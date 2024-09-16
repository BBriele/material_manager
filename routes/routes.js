const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const DatiMateriali  = require('../models/materiali');
const MovimentiMateriali = require('../models/movimenti');

const urlfunApiMat = "../api/functionApi/functionApiMateriali";
const urlfunApiMov = "../api/functionApi/functionApiMovimenti";
const lib = require(urlfunApiMat);
const libMov = require(urlfunApiMov);

const fs = require('fs');
const yaml = require('js-yaml');
const { render } = require('ejs');




// Rotta per home
router.get('/home', async function(req, res) {

    const yamlFile = fs.readFileSync('config_file.yaml', 'utf8');
    const config = yaml.load(yamlFile);

    const renderOption = {};
    renderOption.async = true;
    renderOption.config = config;


    if(req.query.buildView === "nece"){
        var view = req.query.buildView;
        renderOption.buildView = view;

        renderOption.selectedCod = await lib.getCodiciEsaurimento();
        
    } else if(req.query.buildView){
        var view = req.query.buildView;
        renderOption.buildView = view;
    }

    if(req.query.selectedCod){
        var selectedCod = req.query.selectedCod;
        renderOption.selectedCod = selectedCod;
    }

    //console.log(req.query);
    //console.clear();
    //console.log(renderOption);

    res.render('index.ejs', {renderOption});
}); 



// Rotta per aggiornare valore variabile options_data_prossimo_ordine nel file yaml
router.get('/updateValueYaml', async function(req, res) {
    // Leggi il file yaml
    const data = yaml.load(fs.readFileSync('config_file.yaml', 'utf-8'));

    
    // Modifica il valore della variabile
    data.options_data_prossimo_ordine = 'req.body.data_ordine';

    // Salva il nuovo oggetto yaml
    fs.writeFileSync('config.yaml', yaml.dump(data));
}); 

module.exports = router;