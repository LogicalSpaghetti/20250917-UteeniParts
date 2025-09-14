const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ----- Data -----
const products = require(path.join(__dirname, '..', 'data', 'products.js'));

const users = [
  { id: 1, name: "Alice", email: "alice@example.com", role: "user", passwordHash: "hash1", address: "1 Main St", phone: "555-1111" },
  { id: 2, name: "Bob",   email: "bob@example.com",   role: "user", passwordHash: "hash2", address: "2 Main St", phone: "555-2222" },
  { id: 3, name: "Admin", email: "admin@example.com", role: "admin", passwordHash: "hash3", address: "99 Root",  phone: "555-0000" }
];

const tokenToUserId = { "token-alice": 1, "token-bob": 2, "token-admin": 3 };

let nextOrderId = 2003;
const orders = [
  { id: 2001, userId: 1, items: [{ productId: 501, qty: 2, unitPrice: 45 }], total: 90, isPaid: false, internalStatus: "PENDING" },
  { id: 2002, userId: 2, items: [{ productId: 540, qty: 1, unitPrice: 320 }], total: 320, isPaid: true,  internalStatus: "SHIPPED" }
];

// ----- Tiny "auth" -----
function authOptional(req, _res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token && tokenToUserId[token]) {
    req.user = users.find(u => u.id === tokenToUserId[token]);
  }
  next();
}
function authRequired(req, res, next) {
  authOptional(req, res, () => {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });
    next();
  });
}
app.use(authOptional);


app.get('/products', (req, res) => {
  res.json(products);
});


app.get('/products/search', (req, res) => {
  const expr = req.query.q || "true";
  try {
    const predicate = new Function("p", `return (${expr});`); // DANGEROUS
    const results = products.filter(predicate);
    res.json({ expr, count: results.length, results });
  } catch (e) {
    res.status(400).json({ error: "Bad query expression", details: String(e) });
  }
});


app.get('/orders/:orderId', authRequired, (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  // MISSING: check order.userId === req.user.id || admin
  res.json(order);
});


app.post('/orders', authRequired, (req, res) => {
  const { items = [], total = 0, discount = 0, isPaid = false } = req.body;
  const order = {
    id: nextOrderId++,
    userId: req.user.id,
    items: items.map(x => ({ productId: x.productId, qty: x.qty, unitPrice: x.unitPrice })), // should NOT trust client price
    total: Number(total) - Number(discount || 0),
    isPaid, // should be set by payment system
    internalStatus: "PENDING"
  };
  orders.push(order);
  res.status(201).json(order);
});


app.get('/admin/users', (req, res) => {
  res.json(users);
});

// helper
app.get('/whoami', authRequired, (req, res) => {
  const { id, name, email, role } = req.user;
  res.json({ user: { id, name, email, role } });
});

module.exports = app;