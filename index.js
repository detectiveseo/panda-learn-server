const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const mongodb = require('./mongodb');

const port = process.env.PORT || 3000;

const app = express();
app.use(cors());
app.use(express.json());

app.post("/jwt", async (req, res) => {
  const body = req.body;  
  const tokenKey = process.env.TOKEYN_KEY;
  const token = jwt.sign(body, tokenKey, { expiresIn: 60 * 60 });
  res.send(token);
})



mongodb(app);

  app.listen(`${port}`, () => {
    console.log(`this port in runing on this port ${port}`)
})