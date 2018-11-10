const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
    "nombre": String,
    "correo": String,
    "usuario": String,
    "cedula": String,
    "huella": String
});

module.exports = mongoose.model("usuario", userSchema);