const mongoose = require('mongoose');

const snapshotItemSchema = new mongoose.Schema(
  {
    material: { type: mongoose.Schema.Types.ObjectId, ref: 'RawMaterial', required: true },
    materialReference: { type: String, required: true },
    quantity: { type: Number, required: true },
  },
  { _id: false }
);

const productionOrderSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 },
    compositionSnapshot: { type: [snapshotItemSchema], required: true },
    operator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: {
      type: String,
      enum: ['PLANIFIE', 'EN_COURS', 'TERMINE', 'ANNULE'],
      default: 'PLANIFIE',
    },
    startedAt: { type: Date },
    finishedAt: { type: Date},
  },
  { timestamps: true }
);

module.exports = mongoose.model('ProductionOrder', productionOrderSchema);
