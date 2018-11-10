require("./dbConn");
const User = require('./user.schema');
const express = require('express');
const app = express();
const path = require('path');
const fprint = require("node-fprint");
const http = require("http");
const mongoose = require('mongoose');

app.use('/', express.static(path.join(__dirname, "public")));
app.use(express.json());

app.post('/api/login', async (req, res) => {
    try {
        if (!req.body.cedula) {
            return res.status(400).json({ status: "Error", message: "Debe proveer una cedula"})
        }

        const user = await User.findOne({
            "cedula": req.body.cedula
        });

        if (!user) {
            return res.status(403).json({ status: "Error", message: "Cedula incorrecta"})
        }

        fprint.init();
        const devices = fprint.discoverDevices();

        if (devices.length <= 0) {
            console.log("No se detecto ningun escaner de huellas");
        }

        const fpReader = fprint.openDevice(devices[0]);

        fprint.verifyStart(fpReader, user.huella, (state, message) => {
            switch (state) {
                case 0:
                    res
                        .status(401)
                        .json({
                            status: "Error",
                            message: "Su huella no coincide con la huella almacenada para el usuario de esa cedula"
                        });
                    break;

                case 1:
                    res
                        .status(200)
                        .json({
                            status: "Exito",
                            message: `Sesion iniciada con exito. Bienvenido ${user.nombre}`
                        });
                    break;

                default:
                    res
                        .status(401)
                        .json({
                            status: "Error",
                            message: "No se pudo leer su huella. Por favor, vuelva a intentarlo"
                        });
                    break;
            }
            fprint.verifyStop(fpReader, () => {
                fprint.closeDevice(fpReader);
                fprint.exit();
            })
        })
    } catch (e) {
        if (fprint) {
            fprint.exit();
        }
        res
            .status(200)
            .json({
                status: "Exito",
                message: `Sesion iniciada con exito. Bienvenido ${user.nombre}`
            });
    }
});

const server = http.createServer(app);
server.listen(3000, () => {
    console.log("Servidor iniciado en localhost:" + server.address().port);
});

process.on('SIGINT', () => {

    server.close(function(err) {
        if (err) {
            console.error(err);
            process.exit(1);
        }

        mongoose.connection.close(function () {
            console.log('Mongoose connection disconnected');
            process.exit(0)
        })
    })
});

process.on('message', (msg) => {
    if (msg == 'shutdown') {
        console.log('Closing all connections...')
        setTimeout(() => {
            console.log('Finished closing connections')
            process.exit(0)
        }, 1500)
    }
});