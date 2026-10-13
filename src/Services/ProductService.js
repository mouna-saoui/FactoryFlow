const productRepo     = require('../Repository/ProductRepository');
const rawMaterialRepo = require('../Repository/RawMaterialRepository');

const validateComposition = async (composition) => {
  if (!composition || composition.length === 0)
    throw { status: 422, message: 'Composition must have at least one material' };

  const ids = composition.map(c => c.material.toString());
  const unique = new Set(ids);
  if (unique.size !== ids.length)
    throw { status: 422, message: 'A material can only appear once in the composition' };

  for (const id of ids) {
    const mat = await rawMaterialRepo.findById(id);
    if (!mat) throw { status: 404, message: `Raw material ${id} not found` };
  }
};

const create = async (data) => {
  const exists = await productRepo.findByRef(data.reference);
  if (exists) throw { status: 409, message: 'Reference already exists' };

  await validateComposition(data.composition);
  return productRepo.create(data);
};

const findAll = () => productRepo.findAll();

const findById = async (id) => {
  const product = await productRepo.findById(id);
  if (!product) throw { status: 404, message: 'Product not found' };
  return product;
};

const update = async (id, data) => {
  if (data.reference) {
    const exists = await productRepo.findByRef(data.reference);
    if (exists && exists._id.toString() !== id)
      throw { status: 409, message: 'Reference already exists' };
  }
  if (data.composition) await validateComposition(data.composition);

  const product = await productRepo.updateById(id, data);
  if (!product) throw { status: 404, message: 'Product not found' };
  return product;
};

module.exports = { create, findAll, findById, update };
