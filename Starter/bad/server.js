const app = require('./api');
const PORT = 3001;
app.listen(PORT, () => console.log(`VULNERABLE API on http://localhost:${PORT}`));