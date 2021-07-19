const express = require('express');

const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const jobs = require('./routes/jobs');
const capabilities = require('./routes/capabilities');
const bands = require('./routes/bands');
const login = require('./routes/login');
const add = require('./routes/add');

app.use(express.json());
app.use(express.urlencoded());

app.use('/jobs', jobs);
app.use('/capabilities', capabilities);
app.use('/bands', bands);
app.use('/login', login);
app.use('/add', add);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// 404 Path
app.use((req, res) => {
  res.status(404).json({
    message: `Unable to find path ${req.path}`,
  });
});

app.listen(3000, () => {
  console.log('Express started');
});

module.exports = app;
