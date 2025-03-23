const PING_URL = 'https://wsh-2025-server.onrender.com';

async function pingServer() {
  try {
    const response = await fetch(PING_URL);
    console.log(`Ping response: ${response.status}`);
  } catch (error) {
    console.error('Ping failed:', error);
  }
}

// 初回実行
pingServer();

// 1分ごとに実行
setInterval(pingServer, 60000);
