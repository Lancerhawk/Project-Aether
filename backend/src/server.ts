import app from './app';
import { env, prisma } from './config';

async function bootstrap() {
  try {
    await prisma.$connect();
    console.log('[Prisma] Connected to database');

    app.listen(env.PORT, () => {
      console.log(`[Aether] Server running on http://localhost:${env.PORT}`);
      console.log(`[Aether] Environment: ${env.NODE_ENV}`);
    });
  } catch (error) {
    console.error('[Aether] Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
