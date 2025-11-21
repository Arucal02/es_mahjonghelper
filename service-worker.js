// 缓存名称
const CACHE_NAME = 'es-mahjong-helper-v1';

// 需要缓存的文件
const urlsToCache = [
  './',
  './index.html',
  './data.js',
  './database.html',
  './sample_data.json',
  './manifest.json',
  './es_mahjong_url.png',
  './es_mahjong_yz.png'
];

// 安装Service Worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('缓存已打开');
        return cache.addAll(urlsToCache);
      })
  );
  // 跳过等待，直接激活
  self.skipWaiting();
});

// 激活时清理旧缓存
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  // 立即获取控制权
  event.waitUntil(self.clients.claim());
});

// 拦截请求
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // 如果找到缓存，返回缓存的响应
        if (response) {
          return response;
        }
        // 否则发送网络请求
        return fetch(event.request).then(
          response => {
            // 检查是否收到了有效的响应
            if(!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // 克隆响应
            const responseToCache = response.clone();

            // 将响应添加到缓存
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        ).catch(() => {
          // 如果是导航请求，返回缓存的index.html
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});