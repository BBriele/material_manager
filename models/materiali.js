const mongoose = require('mongoose');

const MovimentiMateriali = require('./movimenti.js');

const Schema = mongoose.Schema;

const MaterialeSchema = new Schema({
  codice: { type: String, required: true },
  descrizione: { type: String, required: true },
  fornitore: { type: String },
  giacenza_minima: { type: Number},
  reparto: { type: String},
  tempoConsegna: { type: Number},
});

module.exports = mongoose.model('materiali', MaterialeSchema);