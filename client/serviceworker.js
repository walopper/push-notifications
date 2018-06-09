
self.addEventListener('install', function (event) {
    console.log('[Service Worker] Instalando ...');
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activando ....');
});

// escucho push notifications
self.addEventListener('push', function (event) {
    console.log('Push Notification recibida', event);

    if (event.data) {
        pushdata = event.data.json();
        console.log('push data:', pushdata);
    } else {
        console.log('La notificacion vino sin data');
        return;
    }

    // ver opciones en https://developer.mozilla.org/es/docs/Web/API/ServiceWorkerRegistration/showNotification
    var pushOptions = {
        title: 'hola',
        body: pushdata.body,
        icon: '/images/badge.png',
        // image: '/src/images/sf-boat.jpg', // es posible eniar una imagen de preview
        dir: 'ltr',
        lang: 'es-ES', // BCP 47,
        vibrate: [100, 50, 200], // hago vibrar el movil con este patron. los tiempos son en milisegundos
        // badge: '/src/images/icons/app-icon-96x96.png',
        tag: 'confirm-notification',
        renotify: true,
        actions: [
            {
                action: 'confirm',
                title: 'Okay',
                // icon: '/src/images/icons/app-icon-96x96.png' 
            },
            {
                action: 'cancel',
                title: 'Cancel',
                // icon: '/src/images/icons/app-icon-96x96.png' 
            }
        ],
        // puedo abrir una URL al hacer click en la tarjeta de notificacion
        // data: {
        //     url: data.openUrl
        // }
    }

    // retorna una promesa
    console.log('pushdata.title', pushdata.title);
    let pushStatus = sendPushNotification(pushdata.title, pushOptions);

    event.waitUntil(pushStatus);
});

function sendPushNotification(title, options){
    console.log("title");
    console.log(title);
    return self.registration.showNotification(title, options)
}