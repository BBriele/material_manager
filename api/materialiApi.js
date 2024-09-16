const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');

const DatiMateriali  = require('../models/materiali');
const MovimentiMateriali = require('../models/movimenti');

const urlfunApiMat = "./functionApi/functionApiMateriali";
const lib = require(urlfunApiMat);


// Middleware di logging delle API
function apiLogger(req, res, next) {
  let logMessage = `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`;
  
  if (req.method === 'POST' || req.method === 'PUT') {
    logMessage += ` - Body: ${JSON.stringify(req.body)}`;
  } else if (req.method === 'GET') {
    logMessage += ` - Query Params: ${JSON.stringify(req.query)}`;
  }
  
  fs.appendFile('api_materiali.log', logMessage + '\n', (err) => {
    if (err) {
      console.error('Failed to log API request:', err);
    }
  });
  
  next();
}

// Applica il middleware di logging a tutte le rotte definite in questo router
router.use(apiLogger);




// Rotta per ottenere tutti i datiMateriali
router.get('/getMateriali', async (req, res) => {
  try{
    const materiali = await lib.getAllMateriali();
  
    res.json(materiali);
  }catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});


// Rotta per ottenere tutti i codici
router.get('/getCodici', async (req, res) => {
  try{
    const codici = await lib.getAllCodici();
  
    res.json(codici);
  }catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Rotta per ottenere tutti i datiMateriali relativi a un determinato codice di materiale
router.get('/getMaterialiById/:id', async function(req, res, next) {
  DatiMateriali.find({ _id: req.params.id })
    .then(function(datiMateriali) {
      res.json(datiMateriali);
    })
    .catch(function(error) {
      console.log(error);
      res.sendStatus(500);
    });
});



// Rotta per ottenere tutti i datiMateriali relativi a un determinato codice di materiale
router.get('/getMaterialiByCod/:codice', async function(req, res, next) {
  const codice = req.params.codice;
  
  try {
    const materiali = await lib.getMaterialiByCodice(codice);
    res.json(materiali);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

// Rotta per ottenere tutti i datiMateriali relativi a un array di codici
router.get('/getMaterialiByCodici', async function(req, res, next) {
  const codici = req.query.codici; // Assume che i codici siano passati come parametro di query separati da virgola (es. ?codici=123,456,789)
  const codiciArray = codici.split(',');
  //console.log("MaterialiByCodici: " + codiciArray);
  try {
    const materiali = await lib.getMaterialiByCodici(codiciArray);
    res.json(materiali);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});




//------------------------------------------------------------------------------------------------------
// Rotta per aggiungere un nuovo datiMateriali
router.post('/addMateriale', async (req, res,)  => {
  try {
    const nuovoMateriale = await lib.addMateriale(req.body);
    res.json(nuovoMateriale);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per modificare un datiMateriali esistente
router.put('/modMaterialeById/:id', async (req, res) => {
  try {
    //console.log("Chiamata ad modMaterialeById id: " + req.params.id + " parametri: " + JSON.stringify(req.body));
    const materialeModificato = await lib.modMaterialeById(req.params.id, req.body);
    res.json(materialeModificato);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
// Rotta per eliminare un datiMateriali esistente
router.delete('/deleteMaterialeById/:id', async (req, res) => {
  try {
    const materialeEliminato = await lib.deleteMaterialeById(req.params.id);
    res.json(materialeEliminato);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});

//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
//Rotta per avere i materiali in esaurimento
router.get('/getMaterialeInEusarimento', async function(req, res, next) {
  try {
    const materialiInEsaurimento = await lib.getMaterialeEsaurimento();
    res.json(materialiInEsaurimento);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
//Rotta per avere i materiali in esaurimento
router.get('/getCodiciInEusarimento', async function(req, res, next) {
  try {
    const materialiInEsaurimento = await lib.getCodiciEsaurimento();
    res.json(materialiInEsaurimento);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------


//------------------------------------------------------------------------------------------------------
//Rotta per avere i materiali in esaurimento
router.get('/getVitaStimataByCodice', async function(req, res, next) {
  try {
    const codice = req.query.codice;
    const materialiInEsaurimento = await lib.getVitaStimataByCodice(codice);
    res.json(materialiInEsaurimento);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
//Rotta per avere i materiali in esaurimento
router.post('/getVitaStimataByCodici', async function(req, res, next) {
  try {
    const codici = req.body.codici;
    const materialiInEsaurimento = await lib.getVitaStimataByCodici(codici);
    res.json(materialiInEsaurimento);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
//Rotta per avere i pz necessari per un array di codice e una data
router.post('/getNumPzProssimoOrdineArray', async function(req, res, next) {
  try {
    const codici = req.body.codici;
    const dataProssimoOrdine = req.body.dataProssimoOrdine;
    const pzProssimoOrdine = await lib.getNumPzProssimoOrdineArray(codici, dataProssimoOrdine);
    res.json(pzProssimoOrdine);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------

//------------------------------------------------------------------------------------------------------
//Rotta per avere la tabella pdf di dati codici e colonne
router.post('/getMaterialiByCodicePDF', async function(req, res, next) {
  try {
    //recupera le variabili codice e colonne dal body della richiesta
    const codice = req.body.codici;
    const colonne = req.body.colonne;

    // Ottieni il nome del file dal parametro della route
    const filename = await lib.getMaterialiByCodicePDF(codice, colonne);

    // Leggi il file dal disco
    const fs = require("fs");
    const file = fs.readFileSync(`F:/Codice/server_consumabili_refactor/pdf-tabelle//${filename}`, "binary");


    // Imposta il tipo di risposta come "application/pdf"
    res.setHeader("Content-Type", "application/pdf");

    // Invia il file al client
    res.send(file);
  }
  catch (error){
    console.log(error);
    res.sendStatus(500);
  }
});
//------------------------------------------------------------------------------------------------------

module.exports = router;