require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();

// Connect DB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/node-mvc-crud';
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Settings
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Routes
const supplierRoutes = require('./routes/supplierRoutes');
const productRoutes = require('./routes/productRoutes');

app.use('/suppliers', supplierRoutes);
app.use('/products', productRoutes);

// Home redirect
app.get('/', (req, res) => res.redirect('/suppliers'));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Node MVC CRUD API',
      version: '1.0.0',
      description: 'API docs for suppliers and products'
    },
    servers: [
      { url: 'http://localhost:3000' },
    ],
  },
  apis: ['./routes/*.js'], // đường dẫn tới file routes có @swagger comment
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
