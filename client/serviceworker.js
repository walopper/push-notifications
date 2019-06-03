
self.addEventListener('install', function (event) {
    // ...
});

self.addEventListener('activate', function (event) {
    // ...
});

self.addEventListener('push', function (event) {
    if (event.data) {
        var pushdata = JSON.parse(event.data.json());
    } else {
        return;
    }

    // ver opciones en https://developer.mozilla.org/es/docs/Web/API/ServiceWorkerRegistration/showNotification
    var pushOptions = {
        title: 'hola',
        body: pushdata.body,
        icon: '/images/badge.png',
        image: '/src/images/sf-boat.jpg', // es posible eniar una imagen de preview
        dir: 'ltr',
        lang: 'es-ES', // BCP 47,
        vibrate: [100, 50, 200], // hago vibrar el movil con este patron. los tiempos son en milisegundos
        badge: '/src/images/icons/app-icon-96x96.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
            {
                action: 'confirm',
                title: 'Okay',
                icon: '/src/images/icons/app-icon-96x96.png' 
            },
            {
                action: 'cancel',
                title: 'Cancel',
                icon: '/src/images/icons/app-icon-96x96.png' 
            }
        ],
        // puedo abrir una URL al hacer click en la tarjeta de notificacion
        // data: {
        //     url: data.openUrl
        // }
    }

    event.waitUntil(
        self.registration.showNotification(pushdata.title, pushOptions) // => promise
    );
});
