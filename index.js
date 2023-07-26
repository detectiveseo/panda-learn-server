const express = require('express');
const cors = require('cors');
const mongodb = require('./mongodb');
const jwt = require('./middlewear/jwt');
const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());


mongodb(app);
jwt(app);




  app.listen(`${port}`, () => {
    console.log(`this port in runing on this port ${port}`)
})