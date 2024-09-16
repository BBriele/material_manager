const express = require('express');
const { accessSync } = require('fs');
const fs = require('fs');
const router = express.Router();
const mongoose = require('mongoose');

const MovimentiMateriali = require('../models/movimenti');
const DatiMateriali  = require('../models/materiali');

const urlfunApiMovi = "./functionApi/functionApiMovimenti";
const lib = require(urlfunApiMovi);

// Middleware di logging delle API
function apiLogger(req, res, next) {
  let logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`;

  if (req.method === 'POST' || req.method === 'PUT') {
    logMessage += ` - Body: ${JSON.stringify(req.body)}`;
  } else if (req.method === 'GET') {
    logMessage += ` - Query Params: ${JSON.stringify(req.query)}`;
  }

  fs.appendFile('api_movimenti.log', logMessage + '\n', (err) => {
    if (err) {
      console.error('Failed to log API request:', err);
    }
  });

  next();
}


router.use(apiLogger);

//------------------------------------------------------------------------------------------------------
// Rotta per ottenere tutti i movimentiMateriali
router.get('/getMovimenti', async (req, res) => {
  const movimenti = await lib.getAllMovimentiMateriali();
  res.send(movimenti);
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per ottenere tutti i movimentiMateriali relativi a un determinato codice di materiale
router.get('/getMovimentiByCod/:codice', async (req, res) => {
  try {
  const movimenti = await lib.getMovimentiByCodice(req.params.codice);
  res.json(movimenti);
  } catch (error) {
  console.log(error);
  res.sendStatus(500);
  }
});  
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per ottenere tutti i movimentiMateriali relativi a un determinato id di movimento
router.get('/getMovimentiById/:id', async (req, res) => {
  try {
    const movimenti = await lib.getMovimentiById(req.params.id);
    res.json(movimenti);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per aggiungere un nuovo movimentoMateriali
router.post('/addMovimento', async (req, res) => {
  try {
    const nuovoMovimento = await lib.addMovimento(req.body);
    res.json(nuovoMovimento);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per modificare un movimentoMateriali esistente
router.put('/modMovimentoById/:id', async (req, res) => {
  try {
    const movimentoModificato = await lib.modMovimentoById(req.params.id, req.body);
    res.json(movimentoModificato);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per eliminare un movimentoMateriali esistente
router.delete('/deleteMovimentoById/:id', async (req, res) => {
  try {
    const movimentoEliminato = await lib.deleteMovimentoById(req.params.id);
    res.json(movimentoEliminato);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per ottenere tutti i movimentiMateriali relativi a un determinato id di movimento
router.get('/getGiacenzaAspettata/:codice/:qt/:opt/:data', async function(req, res, next) {
  x = await lib.getGiacenzaAspettata(req.params.codice, req.params.qt, req.params.opt, req.params.data);
  //console.log("Log route getGiacenzaAspettata: /n Response:"+ x);
  res.send(x);
});
//------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------
// Rotta per ottenere la giacenza aspettata per un array di codici
router.post('/getGiacenzaAspettataArray', async function(req, res, next) {
  try {
    const  codici = req.body.codici; // Assume che l'array di codici sia passato nel body della richiesta con la chiave "codici"

    //console.log("Codici: ");
    //console.log(codici);

    const risultati = await lib.getGiacenzaAspettataRicorsiva(codici);
    res.send(risultati);
  } catch (error) {
    console.error(error);
    res.sendStatus(500).send('Errore durante l\'elaborazione della richiesta.');
  }
});
//------------------------------------------------------------------------------------------------------



//------------------------------------------------------------------------------------------------------
// Rotta per ottenere i movimentiMateriali in base a un range di date, codice e causale
/*  
  axios.get('/getMovimentiByDate', {
  params: {
    startDate,
    endDate,
    codice,
    causale
  }
})
*/
router.get('/getMovimentiByDate', async (req, res) => {
  try {
    const { startDate, endDate, codice, causale } = req.query;

    const movimenti = await lib.getMovimentiByDate(startDate, endDate, codice, causale);
    res.json(movimenti);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per ottenere la somma, media o altro dei movimentiMateriali in base a un range di date, codice, causale e operazione
router.get('/getInfoMovimentiByDate', async (req, res) => {
  try {
    const { startDate, endDate, codice, causale, operazione } = req.query;

    const risultatoOperazione = await lib.getInfoMovimentiByDate(startDate, endDate, codice, causale, operazione);
    res.json(risultatoOperazione);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per ottenere la media o somma della causale "scari", "cari" o "INV" di un dato codice per gli ultimi 1gg, 7gg e 30gg
router.get('/getMediaSommaCausale', async (req, res) => {
  try {
    const { codice, causale, operazione } = req.query;

    const result = await lib.getMediaSommaCausale(codice, causale, operazione);
    res.json(result);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------




module.exports = router;