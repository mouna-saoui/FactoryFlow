const mongoose = require('mongoose');

// Reusable subdocument: one material + how much is needed per product unit
const compositionSchema = new mongoose.Schema({
  material: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
  quantity: { type: Number, required: true, min: 0 },
});

module.exports = compositionSchema;
