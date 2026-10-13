const RawMaterial = require('../Models/RawMaterialModel');

const create      = (data)       => RawMaterial.create(data);
const findAll     = ()           => RawMaterial.find();
const findById    = (id)         => RawMaterial.findById(id);
const findByRef   = (reference)  => RawMaterial.findOne({ reference });
const updateById  = (id, data)   => RawMaterial.findByIdAndUpdate(id, data, { new: true, runValidators: true });
const findAlerts  = ()           => RawMaterial.find({ $expr: { $lte: ['$quantity', '$alertThreshold'] } });

module.exports = { create, findAll, findById, findByRef, updateById, findAlerts };
