import { createClient } from 'redis';

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({
    url: redisURL,
    socket: {
        connectTimeout: 10000
    }
});

redisClient.on('error', (err: any) => console.error('Redis Client Error', err));
redisClient.on('connect', () => console.log('Redis Client Connected'));

try {
    await redisClient.connect();
} catch (err) {
    console.error('Could not connect to Redis. Caching will be disabled until Redis is started.', err);
}

export default redisClient;

