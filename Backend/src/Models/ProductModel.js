const mongoose = require('mongoose');
const compositionSchema = require('./CompositionSchema');

const productSchema = new mongoose.Schema({
  reference:   { type: String, required: true, unique: true },
  name:        { type: String, required: true },
  composition: { type: [compositionSchema], required: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
