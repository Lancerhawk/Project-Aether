import { env } from '../config';
import { userRepository } from '../repositories/user.repository';
import { settingsRepository } from '../repositories/settings.repository';
import { AppError, generateAccessToken, generateRefreshToken, verifyRefreshToken, logger } from '../utils';
import { GitHubTokenResponse, GitHubUserResponse, GitHubEmailResponse } from '../types';
import bcrypt from 'bcrypt';
import https from 'https';

const GITHUB_TOKEN_URL = 'https://github.com/login/oauth/access_token';
const GITHUB_USER_URL = 'https://api.github.com/user';
const GITHUB_EMAILS_URL = 'https://api.github.com/user/emails';
const BCRYPT_ROUNDS = 10;

function httpsRequest<T>(
  method: 'GET' | 'POST',
  urlStr: string,
  headers: Record<string, string>,
  body?: any
): Promise<T> {
  return new Promise((resolve, reject) => {
    const url = new URL(urlStr);
    const data = body ? JSON.stringify(body) : undefined;
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname + url.search,
      method,
      headers: {
        ...headers,
        'User-Agent': 'Aether-App', // GitHub strictly requires a User-Agent
        ...(data && { 'Content-Length': Buffer.byteLength(data) }),
      },
    };

    const req = https.request(options, (res) => {
      let result = '';
      res.on('data', (chunk) => {
        result += chunk;
      });
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 400 && res.statusCode !== 401) {
          reject(new Error(`HTTP Error: ${res.statusCode}`));
          return;
        }
        try {
          resolve(JSON.parse(result));
        } catch (e) {
          reject(e);
        }
      });
    });

    req.on('error', reject);
    if (data) req.write(data);
    req.end();
  });
}

async function exchangeCodeForToken(code: string): Promise<string> {
  try {
    const data = await httpsRequest<GitHubTokenResponse & { error?: string }>(
      'POST',
      GITHUB_TOKEN_URL,
      { 'Content-Type': 'application/json', Accept: 'application/json' },
      {
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
      }
    );

    if (data.error || !data.access_token) {
      throw new AppError('The provided authorization code is invalid or expired.', 401, 'INVALID_AUTH_CODE');
    }

    return data.access_token;
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to connect to GitHub OAuth server.', 500, 'GITHUB_NETWORK_ERROR');
  }
}

async function fetchGitHubUser(accessToken: string): Promise<GitHubUserResponse> {
  try {
    return await httpsRequest<GitHubUserResponse>('GET', GITHUB_USER_URL, {
      Authorization: `Bearer ${accessToken}`,
    });
  } catch {
    throw new AppError('Failed to fetch GitHub user profile.', 401, 'GITHUB_API_ERROR');
  }
}

async function fetchGitHubEmail(accessToken: string): Promise<string> {
  try {
    const emails = await httpsRequest<GitHubEmailResponse[]>('GET', GITHUB_EMAILS_URL, {
      Authorization: `Bearer ${accessToken}`,
    });
    
    const primary = emails.find((e) => e.primary && e.verified);
    if (!primary) {
      throw new AppError('No verified primary email found on GitHub account.', 401, 'NO_VERIFIED_EMAIL');
    }
    
    return primary.email;
  } catch (err: any) {
    if (err instanceof AppError) throw err;
    throw new AppError('Failed to fetch GitHub user email.', 401, 'GITHUB_API_ERROR');
  }
}

async function hashToken(token: string): Promise<string> {
  return bcrypt.hash(token, BCRYPT_ROUNDS);
}

async function compareToken(token: string, hash: string): Promise<boolean> {
  return bcrypt.compare(token, hash);
}

export const authService = {
  async authenticateWithGitHub(code: string) {
    const githubAccessToken = await exchangeCodeForToken(code);
    const githubUser = await fetchGitHubUser(githubAccessToken);
    const email = githubUser.email || (await fetchGitHubEmail(githubAccessToken));
    const providerId = String(githubUser.id);

    let user = await userRepository.findByProviderId('GITHUB', providerId);

    if (!user) {
      const existingEmailUser = await userRepository.findByEmail(email);
      if (existingEmailUser) {
        throw new AppError('An account with this email already exists using a different provider.', 409, 'CONFLICT');
      }

      user = await userRepository.create({
        email,
        name: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
        provider: 'GITHUB',
        providerId,
        lastLoginAt: new Date(),
      });

      await settingsRepository.create({
        user: { connect: { id: user.id } },
      });

      logger.info('New user created via GitHub OAuth', { userId: user.id, email });
    } else {
      user = await userRepository.update(user.id, {
        lastLoginAt: new Date(),
        name: githubUser.name || githubUser.login,
        avatarUrl: githubUser.avatar_url,
      });
    }

    const tokenPayload = { userId: user.id, email: user.email };
    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    const hashedRefresh = await hashToken(refreshToken);
    await userRepository.updateRefreshToken(user.id, hashedRefresh);

    return {
      token: accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatarUrl: user.avatarUrl,
        createdAt: user.createdAt,
      },
    };
  },

  async refreshTokens(refreshToken: string) {
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch {
      throw new AppError('Invalid or expired refresh token.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const user = await userRepository.findById(payload.userId);
    if (!user || !user.refreshToken) {
      throw new AppError('Invalid refresh token.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const isValid = await compareToken(refreshToken, user.refreshToken);
    if (!isValid) {
      await userRepository.updateRefreshToken(user.id, null);
      throw new AppError('Refresh token has been revoked.', 401, 'INVALID_REFRESH_TOKEN');
    }

    const tokenPayload = { userId: user.id, email: user.email };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);

    const hashedRefresh = await hashToken(newRefreshToken);
    await userRepository.updateRefreshToken(user.id, hashedRefresh);

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  },

  async logout(userId: string) {
    await userRepository.updateRefreshToken(userId, null);
  },
};
