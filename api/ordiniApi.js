const express = require('express');
const fs = require('fs');
const router = express.Router();
const mongoose = require('mongoose');


const urlfunApiOrdini = "./functionApi/functionApiOrdini";
const lib = require(urlfunApiOrdini);

// Middleware di logging delle API
function apiLogger(req, res, next) {
  let logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`;

  if (req.method === 'POST' || req.method === 'PUT') {
    logMessage += ` - Body: ${JSON.stringify(req.body)}`;
  } else if (req.method === 'GET') {
    logMessage += ` - Query Params: ${JSON.stringify(req.query)}`;
  }

  fs.appendFile('api_ordini_acquisto.log', logMessage + '\n', (err) => {
    if (err) {
      console.error('Failed to log API request:', err);
    }
  });

  next();
}

router.use(apiLogger);

// Rotta per ottenere tutti gli ordini di acquisto
router.get('/getOrdini', async (req, res) => {
  try {
    const response = await lib.getAllOrdini();
    res.json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Rotta per ottenere un ordine di acquisto specifico
router.get('/getOrdineById/:id', async (req, res) => {
  try {
    const ordine = await OrdineAcquisto.findById(req.params.id);
    res.json(ordine);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Rotta per creare un nuovo ordine di acquisto
router.post('/addOrdine', async (req, res) => {
  try {
    const response = await lib.addOrdine(req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Rotta per aggiornare un ordine di acquisto esistente
router.put('/modOrdineById/:id', async (req, res) => {
  try {
    const response = await lib.modOrdineById(req.params.id, req.body);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Rotta per eliminare un ordine di acquisto
router.delete('/deleteOrdineById/:id', async (req, res) => {
  try {
    const response = await lib.deleteOrdineById(req.params.id);
    res.json(response);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

module.exports = router;
