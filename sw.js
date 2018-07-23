const CACHE = 'offline-fallback-v1';

// При установке воркера мы должны закешировать часть данных (статику).
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches
            .open(CACHE)
            .then((cache) => cache.addAll(['/testSW/css/style.css']))
            // `skipWaiting()` необходим, потому что мы хотим активировать SW
            // и контролировать его сразу, а не после перезагрузки.
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    // `self.clients.claim()` позволяет SW начать перехватывать запросы с самого начала,
    // это работает вместе с `skipWaiting()`, позволяя использовать `fallback` с самых первых запросов.
    event.waitUntil(self.clients.claim());
    console.log('Активирован\n');
});

self.addEventListener('fetch', function(event) {
    console.log('Происходит запрос на сервер');
    event.respondWith(networkOrCache(event.request)
        .catch(() => useFallback()));
});

function networkOrCache(request) {
    return fetch(request)
        .then((response) => response.ok ? response : fromCache(request))
        .catch(() => fromCache(request));
}

//Страницу, которую будем выводить, когда у нас нет интернета.
const FALLBACK =
    '<script>console.log(\"Блин. Чувак. У тебя инета нет((\");</script>\n' +
    '<link rel="stylesheet" type="text/css" href="/testSW/css/style.css">\n' +
    '<div>\n' +
    '    <div>App Title</div>\n' +
    '    <div>you are offline</div>\n' +
    '</div>';

//А это страница ошибки 404. Т.к. я пользуюсь GitHub у меня не работает .htaccess. Ну или у меня руки кривые)
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
      '    <h1><a href="/testSW/" class="home">ЧТО ЭТО, ЕПТ?</a></h1>\n' +
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
    if (!navigator.onLine) {  //Проверяем подключение к интернету. Если нет, то выводим наш FALLBACK
	    console.log('Невозможно подключится к серверу. Выдаю сохраненные данные.');
        return Promise.resolve(new Response(FALLBACK, { headers: {
            'Content-Type': 'text/html; charset=utf-8'
        }}));
    } else { //Иначе выводим ошибку 404.
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
