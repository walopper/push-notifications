const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const vapidKeys = require('../vapid-keys.json');
const webpush = require('web-push');

mongoose.connect('mongodb://localhost/test');
const Subscriptions = mongoose.model('Subscriptions', mongoose.Schema({
    endpoint: String,
    keys: { auth: String, p256dh: String }
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(morgan('tiny'));

function auth(req, res, next) {
    /**
     * Aca deveria autenticar a quien intenta usar este servicio
     */
    if(true) next();
    else res.status(401).send('No autorizado');
});

// almaceno suscripcion
app.post('/send/:subID', auth, (req, res) => {
    var subID = req.params.subID;

    Subscriptions.findById(subID)
        .then(subData => {
            var pushConfig = {
                endpoint: subData.endpoint,
                keys: {
                    auth: subData.keys.auth,
                    p256dh: subData.keys.p256dh
                }
            };

            sendPush(pushConfig, {
                title: req.body.title,
                body: req.body.body
            })
                .then(response => res.status(200).json({ message: 'notification sent' }))
                .catch(err => res.status(500).json({ error: 'push noe sent', message: err }));
        })
        .catch(err => res.status(500).json({ error: 'No se pudo obtener la suscripcion', subid: subID, message: err }));
});

function sendPush(pushConfig, payload) {
    // envio la notificacion al endpoint correspondient
    webpush.setVapidDetails('mailto:walo.walo@gmail.com', vapidKeys.publicKey, vapidKeys.privateKey);
    return webpush.sendNotification(pushConfig, JSON.stringify(payload))
}

// almaceno suscripcion
app.post('/subscription', (req, res) => {
    const subscription = new Subscriptions({
        endpoint: req.body.endpoint,
        keys: {
            auth: req.body.keys.auth,
            p256dh: req.body.keys.p256dh
        }
    });

    subscription.save((err, subs) => {
        if (err) {
            return res.status(500).send({ error: 'No se pudo almacenar la suscripcion', message: err });
        }
        res.status(201).json(subs._id);
    });
});

app.listen(5055, () => console.info('Server iniciado en: ' + ` http://localhost:5055`));
