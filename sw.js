const CACHE_NAME = 'pwa-simple-shell-v1';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json'
];

// Evento de instalação: abre o cache e adiciona os assets principais (app shell)
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('Cache aberto, adicionando assets...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
  self.skipWaiting();
});

// Evento de ativação: limpa caches antigos para evitar conflitos
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.map(k => {
        if (k !== CACHE_NAME) {
          console.log(`Limpando cache antigo: ${k}`);
          return caches.delete(k);
        }
      })
    ))
  );
  // Garante que o novo service worker assuma o controle da página imediatamente
  self.clients.claim();
});

// Evento de fetch: intercepta requisições de rede
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Não cachear chamadas para APIs externas (ex: Nominatim)
  // Responde diretamente da rede
  if (url.hostname.includes('nominatim.openstreetmap.org')) {
    return event.respondWith(fetch(event.request));
  }

  // Estratégia "Cache-first" para recursos do app
  event.respondWith(
    caches.match(event.request).then(cachedResponse => {
      // Se o recurso estiver no cache, retorna a versão do cache
      if (cachedResponse) {
        return cachedResponse;
      }
      // Se não, busca na rede
      return fetch(event.request).then(networkResponse => {
        // Opcional: clona a resposta e a armazena no cache para futuras requisições
        if (event.request.method === 'GET' && event.request.url.startsWith(self.location.origin)) {
          return caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        }
        return networkResponse;
      });
    }).catch(() => {
      // Fallback: se a rede falhar e o item não estiver no cache, retorna a página principal
      return caches.match('/index.html');
    })
  );
});
