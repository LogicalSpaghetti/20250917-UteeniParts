const request = require('supertest');
const app = require('../api');

const alice = 'Bearer token-alice';
const bob   = 'Bearer token-bob';

describe('E-commerce API (secure behavior expectations)', () => {
  test('GET /products should NOT expose internal fields', async () => {
    const res = await request(app).get('/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const p = res.body[0];
    expect(p).not.toHaveProperty('supplierCost');
    expect(p).not.toHaveProperty('inventoryCount');
    expect(p).not.toHaveProperty('internalNotes');
  });

  test('GET /products/search should reject dynamic expressions and only allow safe text', async () => {
    // expression-like query should be blocked
    const res = await request(app).get('/products/search').query({ q: "p.price<100" });
    expect(res.status).toBe(400);
  });

  test('GET /orders/:id should enforce ownership (Bob cannot read Alice’s order)', async () => {
    const res = await request(app).get('/orders/2001').set('Authorization', bob);
    expect([401, 403]).toContain(res.status);
  });

  test('POST /orders should ignore client price flags and payment status', async () => {
    const res = await request(app)
      .post('/orders')
      .set('Authorization', alice)
      .send({
        items: [{ productId: 501, qty: 1, unitPrice: 0.01 }],
        total: 0.01,
        discount: 0.01,
        isPaid: true
      });

    expect([200,201]).toContain(res.status);
    // unitPrice should be server authoritative (not 0.01)
    expect(res.body.items[0].unitPrice).not.toBe(0.01);
    // payment state should be false until a real payment flow sets it
    expect(res.body.isPaid).toBe(false);
  });

  test('GET /admin/users should require admin', async () => {
    const unauth = await request(app).get('/admin/users');
    const user   = await request(app).get('/admin/users').set('Authorization', alice);
    expect([401,403]).toContain(unauth.status);
    expect([401,403]).toContain(user.status);
  });
});
