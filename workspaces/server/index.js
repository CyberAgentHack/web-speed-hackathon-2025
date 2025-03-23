// import express from 'express';
// import compression from 'compression';
// import path from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// const app = express();

// app.use(compression());

// app.use(express.static(path.join(__dirname, 'dist'), {
//   maxAge: '1y', 
//   immutable: true
// }));


// app.use((req, res, next) => {
//   res.set('Cache-Control', 'public, max-age=31536000, immutable');
//   next();
// });


// app.get('/api/hello', (req, res) => {
//   res.json({ message: 'Hello world' });
// });
// app.use((req, res) => {
//   res.status(404).send('Not found');
// });

// const port = process.env.PORT || 3000;
// app.listen(port, () => {
//   console.log(`Server listening on port ${port}`);
// });
