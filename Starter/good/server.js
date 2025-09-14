const app = require('./api');
const PORT = 3002;
app.listen(PORT, () => console.log(`SECURE API on http://localhost:${PORT}`));
