// const cluster = require('cluster');
// const http = require('http');
// const os = require('os');
// const numCPUs = os.cpus().length;

// if (cluster.isMaster) {
//   console.log(`Master ${process.pid} is running`);

//   // CPU数分だけワーカーをフォークする
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on('exit', (worker, code, signal) => {
//     console.log(`Worker ${worker.process.pid} died. Spawning a new one.`);
//     cluster.fork();
//   });
// } else {
//   // ワーカー側の処理（ここでサーバーの実際の処理を実装）
//   const server = http.createServer((req, res) => {
//     res.writeHead(200);
//     res.end('Hello World\n');
//   });

//   server.listen(process.env.PORT || 8000, () => {
//     console.log(`Worker ${process.pid} started`);
//   });
// }
