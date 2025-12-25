import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  retryStrategy: (times) => Math.min(times * 200, 2000),
});

export const CacheProvider = {
    provide: "REDIS_CLIENT",
    useFactory: () => {
        return redis
    }
}

redis.on('connect', () => {
  console.log('✅ Redis connected');
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err.message);
});