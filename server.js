if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const app = require('./app');

app.listen(3000);
