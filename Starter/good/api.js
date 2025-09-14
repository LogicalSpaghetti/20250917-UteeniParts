const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());

// ----- Data -----
const products = require(path.join(__dirname, '..', 'data', 'products.js'));

// ----- Users/tokens -----
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

// ----- Auth helpers -----
function authOptional(req, _res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (token && tokenToUserId[token]) req.user = users.find(u => u.id === tokenToUserId[token]);
  next();
}
function authRequired(req, res, next) {
  authOptional(req, res, () => (!req.user ? res.status(401).json({ error: "Unauthorized" }) : next()));
}
function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: "Unauthorized" });
  if (req.user.role !== 'admin') return res.status(403).json({ error: "Forbidden" });
  next();
}
app.use(authOptional);

// ----- View models / whitelists -----
const productView = p => ({ id: p.id, sku: p.sku, name: p.name, price: p.price, category: p.category, description: p.description });
const userView    = u => ({ id: u.id, name: u.name, email: u.email, role: u.role });

// 1) FIX: Excessive Data Exposure → whitelist fields
app.get('/products', (_req, res) => {
  res.json(products.map(productView));
});

// 2) FIX: No dynamic evaluation; only safe text 'q' search over name+description
app.get('/products/search', (req, res) => {
  const q = (req.query.q || '').trim();
  if (!q) return res.status(400).json({ error: "Missing q" });
  if (!/^[\w\s\-.'"]+$/i.test(q)) return res.status(400).json({ error: "Invalid search query" });

  const needle = q.toLowerCase();
  const results = products
    .filter(p => (`${p.name} ${p.description}`).toLowerCase().includes(needle))
    .map(productView);

  res.json({ q, count: results.length, results });
});

// 3) FIX: BOLA/IDOR → enforce owner/admin
app.get('/orders/:orderId', authRequired, (req, res) => {
  const orderId = Number(req.params.orderId);
  const order = orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: "Order not found" });
  if (order.userId !== req.user.id && req.user.role !== 'admin') {
    return res.status(403).json({ error: "Forbidden" });
  }
  res.json(order);
});

// Helpers to compute server-authoritative prices
const priceIndex = new Map(products.map(p => [p.id, p.price]));

// 4) FIX: Ignore client prices/flags; compute totals
app.post('/orders', authRequired, (req, res) => {
  const { items = [] } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "items array required" });
  }

  let total = 0;
  const normalized = [];
  for (const it of items) {
    const pid = Number(it.productId);
    const qty = Math.max(1, Number(it.qty) || 1);
    if (!priceIndex.has(pid)) return res.status(400).json({ error: `Invalid productId: ${pid}` });
    const unitPrice = priceIndex.get(pid);
    normalized.push({ productId: pid, qty, unitPrice });
    total += unitPrice * qty;
  }

  const order = {
    id: nextOrderId++,
    userId: req.user.id,
    items: normalized,
    total: Number(total.toFixed(2)),
    isPaid: false, // set by a real payment workflow
    internalStatus: "PENDING"
  };
  orders.push(order);
  res.status(201).json(order);
});

// 5) FIX: Admin-only + minimal fields
app.get('/admin/users', authRequired, requireAdmin, (_req, res) => {
  res.json(users.map(userView));
});

// helper
app.get('/whoami', authRequired, (req, res) => {
  const { id, name, email, role } = req.user;
  res.json({ user: { id, name, email, role } });
});

module.exports = app;
