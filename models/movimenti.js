const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const MovimentoSchema = new Schema({
  codice: { type: String, required: true },
  causale: { type: String, required: true },
  quantita: { type: Number, required: true },
  giacenza_aspettata: { type: Number, required: true },
  data: { type: Date, default: Date.now },
  note: { type: String },
  ubicazione: {type: String}
}, { timestamps: true });

module.exports = mongoose.model('movimenti', MovimentoSchema);