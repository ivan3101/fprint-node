# Iniciar proyecto

1. Ejecutar `npm install` en la raiz del proyecto, donde se encuentra el archivo `app.js`
2. Ejecutar `npm install` en la carpeta `client`
3. Ir a la carpeta client y ejecutar el comando `npm run build`
4. Copiar el contenido de la carpeta `dist` en la carpeta `public`, ubicada en la carpeta raiz del proyecto (si no 
existe la carpeta `public`, crearla)
5. Iniciar MongoDB
6. Ir a la carpeta raiz del proyecto y ejecutar el comando `npx pm2 start app.js`
7. Para detener el proyecto, ejecutar el comando `npx pm2 stop app.js`

## Nota
Este proyecto solo ha sido probado en Linux. Si desea probarlo en windows recuerde seguir las instrucciones para 
instalar [node-gyp](https://github.com/nodejs/node-gyp).