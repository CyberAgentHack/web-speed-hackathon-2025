// import { FastifyInstance } from 'fastify';
// import Redis from 'ioredis';

// const redis = new Redis(); 

// export default async function userRoutes(app: FastifyInstance) {
//   app.get('/users/:id', async (request, reply) => {
//     const userId = request.params.id;
//     const cacheKey = `user-${userId}`;

//     let user = await redis.get(cacheKey);
//     if (user) {
//       return JSON.parse(user);
//     }

//     user = await db.query('SELECT * FROM users WHERE id = ?', [userId]);

//     redis.set(cacheKey, JSON.stringify(user), 'EX', 60 * 5);

//     return user;
//   });
// }
