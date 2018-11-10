require("./dbConn");
const User = require("./user.schema");
const fprint = require("node-fprint");
const fs = require("fs");
const path = require("path");

if (fprint.init()) {

    const devices = fprint.discoverDevices();

    if (devices.length <= 0) {
        console.log("No se detecto ningun escaner de huellas");
    }

    const fpReader = fprint.openDevice(devices[0]);

    const stages = fprint.getEnrollStages(fpReader);
    let actualStage = 1;
    console.log("Se procedera a agregar su huella a la base de datos. Deberas deslizar el dedo 5 veces por el escaner");
    console.log(`Paso ${actualStage} de ${stages}. Deslice su dedo...`);
    actualStage++;

    fprint.enrollStart(fpReader, (state, message, fingerprint) => {
        switch (state) {
            case 1:
                fprint.enrollStop(fpReader, () => {
                    console.log("Escaneo finalizado. Su huella ha sido agregada");
                    fs.readFile("./mockData.json", (err, data) => {
                        if (err) throw err;
                        const userData = JSON.parse(data);

                        const newUser = new User({
                            ...userData.user,
                            "huella": fingerprint
                        });
                        newUser.save().then(() => {
                            console.log("Usuario agregado a la BD con exito");
                            fprint.closeDevice(fpReader);
                            fprint.exit();
                            process.exit(0);
                        })
                            .catch(err => {
                                throw err
                            });
                    });

                });
                break;

            case 2:
                console.log("Error al agregar el huella. Por favor, vuelva a intentarlo");
                break;

            case 3:
                console.log(`Paso ${actualStage} de ${stages}. Deslice su dedo...`);
                actualStage++;
                break;

            default:
                console.log("Error al escanear su dedo. Vuelva a deslizar el dedo por el escaner por favor...");
                break;
        }
    });
}
