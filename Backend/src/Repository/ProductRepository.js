const Product = require('../Models/ProductModel');

const create     = (data) => Product.create(data);
const findAll    = ()     => Product.find().populate('composition.material', 'reference name unit');
const findById   = (id)   => Product.findById(id).populate('composition.material', 'reference name unit');
const findByRef  = (ref)  => Product.findOne({ reference: ref });
const updateById = (id, data) => Product.findByIdAndUpdate(id, data, { new: true, runValidators: true })
                                        .populate('composition.material', 'reference name unit');

module.exports = { create, findAll, findById, findByRef, updateById };
