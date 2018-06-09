// registro el serviceworker
navigator.serviceWorker
    .register('/serviceworker.js')
    .then(() => console.log('Service worker registrado!'))
    .catch(console.error);

function urlBase64ToUint8Array(base64String) {
    var padding = '='.repeat((4 - base64String.length % 4) % 4);
    var base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

function displayConfirmNotification() {
    if ('serviceWorker' in navigator) {
        var options = {
            body: 'Ya estas suscripto a las notificaciones!',
            // icon: '/src/images/icons/app-icon-96x96.png',
            // image: '/src/images/sf-boat.jpg',
            dir: 'ltr',
            lang: 'es-ES', // BCP 47,
            vibrate: [100, 50, 200],
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
            ]
        };

        navigator.serviceWorker.ready
            .then(function (swreg) {
                swreg.showNotification('Listo!', options);
            });
    }
}

function configurePushSub() {
    var reg;
    navigator.serviceWorker.ready
        .then(function (swreg) {
            // pudo suscripcion
            reg = swreg;
            return swreg.pushManager.getSubscription();
        })
        .then(function (sub) {
            // Si no hay suscripcion, genero una con vapid keys y la retorno
            // la public key debe coincidir con la almacenada en vapid-keys.json
            // Si hay suscripcion previa, devuelvo esa
            return sub || reg.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array('BLOXrJFgbTVoZhcOGQEAIEdosxZngxwI_vlBRMVORIS08zvXvJ-SV7qKUxDCQjl7GIEDrlA_HKpnDqnhu2DYw6M')
            });
        })
        .then(function (currentSub) {
            return fetch('http://localhost:5055/subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(currentSub)
            })
        })
        .then(function (res) {
            if (res.ok) {
                displayConfirmNotification();
            }
            return res.json();
        })
        .then(subID => {
            console.log('New subscription ID:', subID);
            document.getElementById('susDone').style.display = 'block';
            document.getElementById('newSubId').innerHTML = subID;
            document.getElementById('sendPush').addEventListener('click', sendPush);
        })
        .catch(function (err) {
            console.log(err);
        });
}

/**
 * Pudo autorizacion para enviar notificaciones
 */
function askForNotificationPermission() {
    Notification.requestPermission(function (result) {
        if (result !== 'granted') {
            console.log('El usuario NO permite notificaciones');
        } else {
            console.log('El usuario permite notificaciones');
            configurePushSub(); // suscribo
        }
    });
}

const sendPush = () => {
    console.log('Enviando notificacion push');

    const subID = document.getElementById('newSubId').innerHTML;
    const pushConfig = {
        title: document.getElementById('notifTitle').value || 'Titulo de la notificcion',
        body: document.getElementById('notifBody').value || 'Texto adicional opcional',
    }

    return fetch(`http://localhost:5055/send/${subID}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify(pushConfig)
    })
        .then(r => r.json())
        .then(data => {
            console.log(data);
        })
        .catch(console.error);
};

if ('Notification' in window && 'serviceWorker' in navigator) {
    let button = document.getElementById('enableNotif');
    button.style.display = 'inline-block';
    button.addEventListener('click', askForNotificationPermission);
    console.log('Burron ready');
}




