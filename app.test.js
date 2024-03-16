const request = require('supertest');
const app = require('./index.js'); // the path to your app file.

describe('Invoice Management', () => {

  it('should fetch an invoice', async () => {
    const res = await request(app).get('/invoices/1');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('id');
  });

  it('should update an invoice status', async () => {
    const res = await request(app)
      .put('/invoices/1/status')
      .send({ status: 'Paid' });
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('status', 'Paid');
  });

  it('should list invoices for a customer', async () => {
    const res = await request(app).get('/customers/1/invoices');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('should calculate total sales for a customer', async () => {
    const res = await request(app).get('/customers/1/total_sales');
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('total_sales');
  });
});
