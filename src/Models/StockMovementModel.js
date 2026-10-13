const mongoose = require('mongoose');

const stockMovementSchema = new mongoose.Schema({
  material:        { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
  type:            { type: String, enum: ['IN', 'OUT'] },
  quantity:        { type: Number, required: true, min: 0 },
  user:            { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  productionOrder: { type: mongoose.Schema.Types.ObjectId, ref: 'ProductionOrder', default: null },
}, { timestamps: true });

module.exports = mongoose.model('StockMovement', stockMovementSchema);
