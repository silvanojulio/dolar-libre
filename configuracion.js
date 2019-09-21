const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// this will be our data base's data structure 
const DataSchema = new Schema(
  {
    _id: String,
    sitioActivo: Boolean,
    mensajeEnPantalla: String,
    password: String
  },
  { timestamps: true }
);

// export the new Schema so we could modify it using Node.js
module.exports = mongoose.model("Configuracion", DataSchema, "Configuracion");