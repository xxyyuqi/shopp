#!/usr/bin/env node
/**
 * MARÉ — 简易静态文件服务器（零依赖）
 * 适用于 Coze FaaS 部署环境。
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = parseInt(process.env.DEPLOY_RUN_PORT || '5000', 10);
const HOST = '0.0.0.0';
const ROOT = __dirname;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.htm': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.map': 'application/json; charset=utf-8'
};

function send(res, status, headers, body) {
  res.writeHead(status, headers);
  if (body) res.end(body);
  else res.end();
}

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const type = MIME[ext] || 'application/octet-stream';
  const stat = fs.statSync(filePath);
  res.writeHead(200, {
    'Content-Type': type,
    'Content-Length': stat.size,
    'Cache-Control': 'public, max-age=300'
  });
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
  stream.on('error', () => {
    if (!res.headersSent) send(res, 500, { 'Content-Type': 'text/plain' }, 'Internal Server Error');
    else res.end();
  });
}

const server = http.createServer((req, res) => {
  try {
    let pathname = decodeURIComponent(url.parse(req.url).pathname || '/');
    // 防止路径遍历
    if (pathname.includes('..')) {
      return send(res, 400, { 'Content-Type': 'text/plain' }, 'Bad Request');
    }
    if (pathname === '/') pathname = '/index.html';

    let target = path.join(ROOT, pathname);
    // 确保目标仍在 ROOT 内
    if (!target.startsWith(ROOT)) {
      return send(res, 403, { 'Content-Type': 'text/plain' }, 'Forbidden');
    }

    let stat;
    try {
      stat = fs.statSync(target);
    } catch (e) {
      // 找不到时尝试回退到 index.html (用于 SPA 路由)
      return send(res, 404, { 'Content-Type': 'text/plain; charset=utf-8' }, '404 Not Found');
    }

    if (stat.isDirectory()) {
      target = path.join(target, 'index.html');
      if (!fs.existsSync(target)) {
        return send(res, 404, { 'Content-Type': 'text/plain' }, '404 Not Found');
      }
    }

    sendFile(res, target);
  } catch (e) {
    console.error('[server error]', e);
    if (!res.headersSent) send(res, 500, { 'Content-Type': 'text/plain' }, 'Internal Server Error');
    else res.end();
  }
});

server.listen(PORT, HOST, () => {
  console.log(`[MARÉ] static server listening on http://${HOST}:${PORT}`);
});

// 优雅退出，但保持进程存活
process.on('SIGTERM', () => {
  console.log('[MARÉ] received SIGTERM, shutting down');
  server.close(() => process.exit(0));
});
process.on('SIGINT', () => {
  console.log('[MARÉ] received SIGINT, shutting down');
  server.close(() => process.exit(0));
});
