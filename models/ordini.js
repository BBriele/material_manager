const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const OrdiniSchema = new Schema({
  rif_ordine: { type: String, required: true },
  codice: { type: String, required: true },
  quantita: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  note: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('ordini', OrdiniSchema);