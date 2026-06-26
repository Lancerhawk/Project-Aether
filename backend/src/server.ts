import app from './app';
import { env, prisma } from './config';

async function bootstrap() {
  try {
    await prisma.$connect();
    // eslint-disable-next-line no-console
    console.log('[Prisma] Connected to database');

    app.listen(env.port, () => {
      // eslint-disable-next-line no-console
      console.log(`[Aether] Server running on http://localhost:${env.port}`);
      // eslint-disable-next-line no-console
      console.log(`[Aether] Environment: ${env.nodeEnv}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('[Aether] Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
