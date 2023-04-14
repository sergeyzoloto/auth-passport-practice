if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config({ path: './config/.env' });
}

const app = require('./app');

app.listen(3000);
