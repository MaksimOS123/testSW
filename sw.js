const CACHE = 'offline-fallback-v1';

// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('install', (event) => {
    console.log('Установлен\n');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    // `self.clients.claim()` позволяет SW начать перехватывать запросы с самого начала,
    // это работает вместе с `skipWaiting()`, позволяя использовать `fallback` с самых первых запросов.
    event.waitUntil(self.clients.claim());
    console.log('Активирован\n');
});

self.addEventListener('fetch', function(event) {
    console.log('Происходит запрос на сервер');
    // Можете использовать любую стратегию описанную выше.
    // Если она не отработает корректно, то используейте `Embedded fallback`.
    event.respondWith(networkOrCache(event.request)
        .catch(() => useFallback()));
});

function networkOrCache(request) {
    return fetch(request)
        .then((response) => response.ok ? response : fromCache(request))
        .catch(() => fromCache(request));
}

// Наш Fallback вместе с нашим собсвенным Динозавриком.
const FALLBACK =
    '<div>\n' +
    '    <div>App Title</div>\n' +
    '    <div>you are offline</div>\n' +
    '</div>';

const Error404 = 
      '<html\n' +
      '	<head>\n' +
      '	 <title>404. Страница не найдена</title>\n' +
      '	 <link rel=\"stylesheet\" type=\"text/css\" href=\"/testSW/css/error.css\">\n' +
      '  <link rel=\"stylesheet\" type=\"text/css\" href=\"/testSW/css/style.css\">\n' +
      '  <meta http-equiv=\"content-type\" content=\"text/html\" charset=\"utf-8\">\n' +
      '  <script async src=\"//pagead2.googlesyndication.com/pagead/js/adsbygoogle.js\"></script>\n' +
      ' </head>\n' +
      ' <body>\n' +
      '  <div id =\"header\">\n' +
      '   <div id =\"header-zglv\">\n' +
      '    <h1><a href="/" class="home">ЧТО ЭТО, ЕПТ?</a></h1>\n' +
      '   </div>\n' +
      '  </div>\n' +
      '   <table>\n' +
      '    <td>\n' +
      '     <th>\n' +
      '      <blockquote><blockquote></blockquote></blockquote>\n' +
      '     </th><th>\n' +
      '      <h2><b>Страница не найдена</b></h2><p><blockquote><h5>Неправильно набран адрес, или такой страницы больше не существует, а возможно, никогда<br>и не существовало.</h5></blockquote><blockquote><h5><b>Проверьте адрес</b> или <a href="/testSW/">перейдите на главную страницу</a>.</h5></blockquote>' +
      '	    </th><th><img src="/testSW/image/error404.jpg" align=top></th></td></table></html>';

function useFallback() {
    if (!navigator.onLine) {
	    console.log('Невозможно подключится к серверу. Выдаю сохраненные данные.');
        return Promise.resolve(new Response(FALLBACK, { headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }}));		
    } else {
	return Promise.resolve(new Response(Error404, { headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }}));
    }
}

function fromCache(request) {
    return caches.open(CACHE).then((cache) =>
        cache.match(request).then((matching) =>
            matching || Promise.reject('no-match')
        ));
}
