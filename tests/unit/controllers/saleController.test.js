const chai = require('chai');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

const { saleService } = require('../../../src/services');
const { saleController } = require('../../../src/controllers');
const { newSaleMock, salesMockById, allSalesMock } = require('./mocks/sale.Controller.mock');
const { expect } = chai;

chai.use(sinonChai);

describe('Testes unitários saleController', function () {
  it('Retorna 201 para cadastro de vendas', async function () {
    const req = { body: newSaleMock.itemsSold };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'createNewSale').resolves({ type: null, message: newSaleMock });
    await saleController.createNewSale(req, res);
    expect(res.status).to.have.been.calledWith(201);
    expect(res.json).to.have.been.calledWith(newSaleMock);
  });

  it('Retorna erro 400 para tentativas de cadastro de vendas sem o productId', async function () {
    const req = {
      body: [
        {
          productI: 1,
          quantity: 1
        },
        {
          productId: 2,
          quantity: 5
        },
      ]
    };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'createNewSale').resolves({ type: 'BAD_REQUEST', message: '"productId" is required' });
    await saleController.createNewSale(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"productId" is required' });
  });

  it('Retorna erro 400 para tentativas de cadastro de vendas sem o quantity', async function () {
    const req = {
      body: [
        {
          productId: 1,
          quantity: 3,
        },
        {
          productId: 2,
          quatity: 4,
        },
      ]
    };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'createNewSale').resolves({ type: 'BAD_REQUEST', message: '"quantity" is required' });
    await saleController.createNewSale(req, res);
    expect(res.status).to.have.been.calledWith(400);
    expect(res.json).to.have.been.calledWith({ message: '"quantity" is required' });
  });

  it('Retorna erro 422 ao tentar cadastrar vendas com o quantity menor que 1', async function () {
    const req = {
      body: [
        {
          productId: 1,
          quantity: -5,
        },
      ],
    };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'createNewSale').resolves({ type: 'UNPROCESSABLE_ENTITY', message: '"quantity" muste be greater than or equal to 1' });
    await saleController.createNewSale(req, res);
    expect(res.status).to.have.been.calledWith(422);
    expect(res.json).to.have.been.calledWith({ message: '"quantity" muste be greater than or equal to 1' });
  });

  it('Retorna erro 404 ao tentar cadastrar uma venda com productId inexistente no banco de dados', async function () {
    const req = {
      body: [
        {
          productId: 10,
          quantity: 2,
        },
      ],
    };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'createNewSale').resolves({ type: 'PRODUCT_NOT_FOUND', message: 'Product not found' });
    await saleController.createNewSale(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Product not found' });
  });

  it('Retorna uma venda pelo seu ID', async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'showSalesById').resolves({ type: null, message: salesMockById });
    await saleController.showSalesById(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(salesMockById);
  });

  it('Retorna a lista com todas as vendas cadastradas', async function () {
    const req = {};
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'showAllSales').resolves({ type: null, message: allSalesMock });
    await saleController.showAllSales(req, res);
    expect(res.status).to.have.been.calledWith(200);
    expect(res.json).to.have.been.calledWith(allSalesMock);
  });

  it('Retorna erro ao tentar acessar uma venda inexistente no banco', async function () {
    const req = { params: { id: 10 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'showSalesById').resolves({ type: 'SALE_NOT_FOUND', message: 'Sale not found' });
    await saleController.showSalesById(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Sale not found' });
  });

  it('Retorna status 204 para deleções de vendas com sucesso', async function () {
    const req = { params: { id: 1 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'deleteSale').resolves({ type: null, message: '' });
    await saleController.deleteSale(req, res);
    expect(res.status).to.have.been.calledWith(204);
    expect(res.json).to.have.been.calledWith();
  });

  it('Retorna status 404 para tentativa de deletar uma venda que não exista no banco de dados', async function () {
    const req = { params: { id: 11 } };
    const res = {};
    res.status = sinon.stub().returns(res);
    res.json = sinon.stub().returns();
    sinon.stub(saleService, 'deleteSale').resolves({ type: 'SALE_NOT_FOUND', message: 'Sale not found' });
    await saleController.deleteSale(req, res);
    expect(res.status).to.have.been.calledWith(404);
    expect(res.json).to.have.been.calledWith({ message: 'Sale not found' });
  });
  
  afterEach(function () {
    sinon.restore();
  });
});