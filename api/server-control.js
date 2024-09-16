const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const fs = require('fs');
const { accessSync } = require('fs');
const glob = require("../path_config");
const path = require("path");

const DatiMateriali  = require('../models/materiali');
const MovimentiMateriali = require('../models/movimenti');

const urlfunApiMovi = "./functionApi/functionApiMovimenti";
const libMovi = require(urlfunApiMovi);

const urlfunApiMat = "./functionApi/functionApiMateriali";
const libMat = require(urlfunApiMat);

const backUpFunc = "../public/backupDB.js";


// Rotta per ottenere tutti i datiMateriali
router.get('/runBackupDB', async (req, res) => {
    try{
        // Utilizzo delle funzioni
        let databaseName = 'movimenti';
        const backupPath = path.join(glob.directory_root, '/backupDB');

        // Esegui il backup del database
        backUpFunc.backupMongoDB(databaseName, backupPath);
    }catch (error) {
      console.log(error);
      res.sendStatus(500);
    }
  });


module.exports = router;