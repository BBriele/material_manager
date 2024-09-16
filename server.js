const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const moment = require('moment');


const apiMovimentiRoutes = require('./api/movimentiApi.js');
const apiMaterialiRoutes = require('./api/materialiApi');
const apiOrdiniRoutes = require('./api/ordiniApi');
const apiServerRoutes = require('./api/server-control.js');
const routes = require('./routes/routes');
const web_script = require('./public/web_script.js');
const db = require('./db');
const path = require('path');
const { appendFile } = require('fs/promises');




mongoose.connect('mongodb://127.0.0.1:27017/movimenti', { useNewUrlParser: true });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// View engine setup
app.set('view engine', 'ejs');

//app.set('/apiMovimenti', apiMovimentiRoutes);

app.use('/apiMovimenti', apiMovimentiRoutes);
app.use('/apiMateriali', apiMaterialiRoutes);
app.use('/apiOrdini', apiOrdiniRoutes);
app.use('/apiServer', apiServerRoutes);
app.use('/', routes);


//---------------------------------------------------------------
//  PER ACCEDERE A GLI SCRIPT E CSS
app.use(express.static('public'));
app.use(express.static('views'));
app.use(express.static('node_modules'));
//app.use(express.static('js'));
//---------------------------------------------------------------

//console.log(__dirname);


app.listen(3001, () => {
  console.log('Server started on port 3001');
});
