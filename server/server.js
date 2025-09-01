// server.js
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const adminRoutes = require('./routes/admin');

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

const allowedOrigins = [
  `http://localhost:3000`,
  `http://${process.env.DOMAIN_NAME}`,
  `https://${process.env.DOMAIN_NAME}`,
  `http://www.${process.env.DOMAIN_NAME}`,
  `https://www.${process.env.DOMAIN_NAME}`
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/admin', adminRoutes);
app.get('/', (req, res) => res.json({ ok: true, env: process.env.NODE_ENV || 'development' }));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
