const express = require('express');
const app = express();
let PORT = process.env.PORT || 3000;
const bodyparser = require('body-parser');
const config = require('config');
const cors = require('cors');
const routes = require('./routes/routes');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const corsOpts = {
    origin: '*',
  
    methods: [
      'GET',
      'POST',
    ],
  
    allowedHeaders: [
      'Content-Type',
    ],
  };
  
app.use(cors(corsOpts));
app.use('/api' , routes);


if(!module.parent){
app.listen(PORT ,(req,res)=>{
    console.log(`The Server has started at ${PORT}`)
})
}

module.exports = app;