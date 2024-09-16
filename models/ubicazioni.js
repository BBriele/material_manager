const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UbicazioniSchema = new Schema({
  codice: { type: String, required: true },
  nome: { type: String, required: true },
  tipo: { type: String, required: true },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ubicazioni', UbicazioniSchema);