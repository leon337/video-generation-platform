import { Worker } from 'bullmq';

const redisUrl = new URL(process.env.REDIS_URL ?? 'redis://localhost:6379');
const connection = {
  host: redisUrl.hostname,
  port: Number(redisUrl.port || 6379),
  ...(redisUrl.username ? { username: redisUrl.username } : {}),
  ...(redisUrl.password ? { password: redisUrl.password } : {}),
};

const worker = new Worker(
  'generation',
  async (job) => ({
    jobId: job.id,
    phase: 'I0_FOUNDATION',
    realProvidersEnabled: false,
  }),
  { connection },
);

worker.on('failed', (job, error) => {
  console.error('worker job failed', { jobId: job?.id, message: error.message });
});

async function shutdown(): Promise<void> {
  await worker.close();
}

process.on('SIGTERM', () => void shutdown());
process.on('SIGINT', () => void shutdown());
