const mongoose = require("mongoose");

mongoose
    .connect("mongodb://localhost:27017/ujap", { useNewUrlParser: true })
    .then(() => {
        console.log("conexion establecida a la BD");
    })
    .catch(err => {
        console.log(err)
    });