const mongoose = require('mongoose');

const rawMaterialSchema = new mongoose.Schema({
  reference:      { type: String, required: true, unique: true },
  name:           { type: String, required: true },
  unit:           { type: String, required: true },
  quantity:       { type: Number, required: true, min: 0, default: 0 },
  alertThreshold: { type: Number, required: true, min: 0, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('RawMaterial', rawMaterialSchema);
