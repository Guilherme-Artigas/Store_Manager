const { productModel, saleModel } = require('../models');
const schema = require('./validations/validationsInputValues');

const showAllSales = async () => {
  const listAllSales = await saleModel.showAllSales();
  return { type: null, message: listAllSales };
};

const showSalesById = async (id) => {
  const sale = await saleModel.showSalesById(id);
  if (sale.length === 0) return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };
  return { type: null, message: sale };
};

const createNewSale = async (sale) => {
  const error = schema.validateNewSale(sale);
  if (error.type) return error;
  const listProduct = await productModel.showAllProducts();
  let productDoesNotExist;
  sale.forEach((_saleProduct, i) => {
    if (!listProduct.some((p) => p.id === sale[i].productId)) {
      productDoesNotExist = true;
    }
  });
  if (productDoesNotExist) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  const newSaleId = await saleModel.createNewSale(sale);
  return { type: null, message: { id: newSaleId, itemsSold: sale } };
};

const updateSale = async (id, body) => {
  const error = schema.validateNewSale(body);
  if (error.type) return error;
  const saleById = await saleModel.showSalesById(id);
  if (saleById.length === 0) return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };
  let productDoesNotExist;
  body.forEach((_saleBody, i) => {
    if (!saleById.some((saleDB) => saleDB.productId === body[i].productId)) {
      productDoesNotExist = true;
    }
  });
  if (productDoesNotExist) return { type: 'PRODUCT_NOT_FOUND', message: 'Product not found' };
  saleById[0].quantity = body[0].quantity;
  saleById[1].quantity = body[1].quantity;
  await saleModel.updateSale(saleById);
  return { type: null, message: { saleId: Number(id), itemsUpdated: body } };
};

const deleteSale = async (id) => {
  const sale = await saleModel.showSalesById(id);
  if (sale.length === 0) return { type: 'SALE_NOT_FOUND', message: 'Sale not found' };
  await saleModel.deleteSale(id);
  return { type: null, message: '' };
};

module.exports = {
  showAllSales,
  showSalesById,
  createNewSale,
  updateSale,
  deleteSale,
};
