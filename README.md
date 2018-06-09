# push-notifications
Simple ejemplo de push notifications en service worker.

Con fines de prueba: 
- este proyecto tiene un servidor de notificaciones push, que es el server que genera la notificacion, y un cliente basico http para servir la web de prueba. Ambon son independientes.
- Las dependencias estan todas juntas

Tener en cuenta que /server y /client son totalmente independientes. Estan en el mismo proyecto solo para facilitar la demo.

### Requerimientos
- Se debe tener mongo instalado y levantado. En una base mongo se van a guardar las key de suscripcion que seran usadas posteriormente pata el envio de notificaciones.

## Instalacion de dependencias
```bash
$ yarn
```

## Comandos
#### Iniciar el server push
```bash
$ yarn server
```

#### Iniciar el cliente html
```bash
$ yarn client
```