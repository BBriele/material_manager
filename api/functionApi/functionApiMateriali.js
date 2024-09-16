const MovimentiMateriali = require('../../models/movimenti');
const DatiMateriali  = require('../../models/materiali');

const fs = require('fs');
const yaml = require('js-yaml');

const funApiMovimenti = require("./functionApiMovimenti.js");

const PDFDocument = require('pdfkit');

const {jsPDF} = require('jspdf');
require('jspdf-autotable');

const pdfjs = require('pdfjs');
const Table = require('pdfkit-table');
const { pt, ta } = require('date-fns/locale');


async function getAllMateriali(){
  
  /*const materiali = await DatiMateriali.find({});
  return materiali;*/

  var materiali = DatiMateriali.aggregate([
    {
      $lookup: {
        from: 'movimentis', // Nome della collezione dei movimenti
        localField: 'codice',
        foreignField: 'codice',
        as: 'movimentiCodice',
      },
    },
    {
      $unwind: {
        path: '$movimentiCodice',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { 'movimentiCodice.data': -1 }, // Ordina i movimenti per data in ordine decrescente
    },
    {
      $group: {
        _id: '$_id',
        codice: { $first: '$codice' },
        descrizione: { $first: '$descrizione' },
        fornitore: { $first: '$fornitore' },
        giacenza_minima: { $first: '$giacenza_minima' },
        reparto: { $first: '$reparto' },
        tempoConsegna: { $first: '$tempoConsegna' },
        giacenza: {
          $first: {
            $cond: {
              if: '$movimentiCodice',
              then: '$movimentiCodice.giacenza_aspettata',
              else: "0",
            },
          },
        }
      },
    }
  ])
    .exec();

    return materiali;
}

async function getAllCodici(){
  try {
    const materiali = await DatiMateriali.find({}, 'codice');
    const codici = materiali.map((materiale) => materiale.codice);
    return codici;
  } catch (error) {
    // Gestisci l'errore qui se necessario
    throw error;
  }
}

async function getMaterialiById(id) {
  //const materiali = await DatiMateriali.find({ _id: id }).exec();

  var materiali = DatiMateriali.aggregate([
    {
      $match: {
        _id: ObjectId(id) // Converte il valoreId in un ObjectId
      }
    },
    {
      $lookup: {
        from: 'movimentis', // Nome della collezione dei movimenti
        localField: 'codice',
        foreignField: 'codice',
        as: 'movimentiCodice',
      },
    },
    {
      $unwind: {
        path: '$movimentiCodice',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { 'movimentiCodice.data': -1 }, // Ordina i movimenti per data in ordine decrescente
    },
    {
      $group: {
        _id: '$_id',
        codice: { $first: '$codice' },
        descrizione: { $first: '$descrizione' },
        fornitore: { $first: '$fornitore' },
        giacenza_minima: { $first: '$giacenza_minima' },
        reparto: { $first: '$reparto' },
        tempoConsegna: { $first: '$tempoConsegna' },
        giacenza: {
          $first: {
            $cond: {
              if: '$movimentiCodice',
              then: '$movimentiCodice.giacenza_aspettata',
              else: "0",
            },
          },
        }
      },
    }
  ])
    .exec();

  return materiali;
}


async function getMaterialiByCodice(codice) {
  //const materiali = await DatiMateriali.find({ codice: codice }).exec();

  var materiali = DatiMateriali.aggregate([
    {
      $match: {
        codice: codice // Converte il valoreId in un ObjectId
      }
    },
    {
      $lookup: {
        from: 'movimentis', // Nome della collezione dei movimenti
        localField: 'codice',
        foreignField: 'codice',
        as: 'movimentiCodice',
      },
    },
    {
      $unwind: {
        path: '$movimentiCodice',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { 'movimentiCodice.data': -1 }, // Ordina i movimenti per data in ordine decrescente
    },
    {
      $group: {
        _id: '$_id',
        codice: { $first: '$codice' },
        descrizione: { $first: '$descrizione' },
        fornitore: { $first: '$fornitore' },
        giacenza_minima: { $first: '$giacenza_minima' },
        reparto: { $first: '$reparto' },
        tempoConsegna: { $first: '$tempoConsegna' },
        giacenza: {
          $first: {
            $cond: {
              if: '$movimentiCodice',
              then: '$movimentiCodice.giacenza_aspettata',
              else: "0",
            },
          },
        }
      },
    }
  ])
    .exec();

  return materiali;
}

async function getMaterialiByCodici(codici) {
  //const materiali = await DatiMateriali.find({ codice: { $in: codici } }).exec();

  var materiali = DatiMateriali.aggregate([
    {
      $match: {
        codice: { $in: codici} // Converte il valoreId in un ObjectId
      }
    },
    {
      $lookup: {
        from: 'movimentis', // Nome della collezione dei movimenti
        localField: 'codice',
        foreignField: 'codice',
        as: 'movimentiCodice',
      },
    },
    {
      $unwind: {
        path: '$movimentiCodice',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $sort: { 'movimentiCodice.data': -1 }, // Ordina i movimenti per data in ordine decrescente
    },
    {
      $group: {
        _id: '$_id',
        codice: { $first: '$codice' },
        descrizione: { $first: '$descrizione' },
        fornitore: { $first: '$fornitore' },
        giacenza_minima: { $first: '$giacenza_minima' },
        reparto: { $first: '$reparto' },
        tempoConsegna: { $first: '$tempoConsegna' },
        giacenza: {
          $first: {
            $cond: {
              if: '$movimentiCodice',
              then: '$movimentiCodice.giacenza_aspettata',
              else: "0",
            },
          },
        }
      },
    }
  ])
    .exec();

  return materiali;
}


async function addMateriale(materiale) {
    const nuovoMateriale = await DatiMateriali.create(materiale);
    return nuovoMateriale;
}


async function modMaterialeById(id, modifiche) {
  const materialeModificato = await DatiMateriali.findByIdAndUpdate(id, modifiche, { new: true });
  return materialeModificato;
}


async function deleteMaterialeById(id) {
  const materialeEliminato = await DatiMateriali.findByIdAndDelete(id);
  return materialeEliminato;
}

async function getTempoConsegna(codice) {
  const materiale = await DatiMateriali.findOne({ codice: codice }).exec();
  return materiale.tempoConsegna;
}


async function getMaterialeEsaurimento() {
  
    // ottieni tutti i documenti in cui giacenza_minima è maggiore o uguale alla giacenza attuale
    const documents = await getAllMateriali();
    const esaurimentoDocuments = [];
    for (const document of documents) {
      const codice = document.codice;
      const giacenzaMinima = document.giacenza_minima;
      //const giacenzaAttuale = await funApiMovimenti.getGiacenzaAspettata(codice);
      const giacenzaAttuale = document.giacenza;
      if (giacenzaMinima >= giacenzaAttuale && giacenzaMinima != 0) {
        esaurimentoDocuments.push(document);
      }
    }
    
    // restituisci i documenti trovati
    return esaurimentoDocuments;
}

async function getCodiciEsaurimento() {

  // ottieni tutti i documenti in cui giacenza_minima è maggiore o uguale alla giacenza attuale
  const documents = await getAllMateriali();
  const esaurimentoDocuments = [];
  for (const document of documents) {
    const codice = document.codice;
    const giacenzaMinima = document.giacenza_minima;
    //const giacenzaAttuale = await funApiMovimenti.getGiacenzaAspettata(codice);
    const giacenzaAttuale = document.giacenza;
    if (giacenzaMinima >= giacenzaAttuale && giacenzaMinima != 0) {
      esaurimentoDocuments.push(codice); // Aggiungi solo il campo "codice"
    }
  }

  // restituisci i codici dei documenti trovati
  return esaurimentoDocuments;
}



// Funzione per calcolare il numero di giorni rimanenti fino all'esaurimento della giacenza
async function getVitaStimataByCodice(codice) {
  try {
    const giacenzaAttuale = await funApiMovimenti.getGiacenzaAspettata(codice) | 0; // Ottiene la giacenza attuale del codice
    //console.log(codice);
    const risultatiCausale = await funApiMovimenti.getMediaSommaCausale(codice, "scari", "media"); // Ottiene la somma dei movimenti causati dalla causale "scari" negli ultimi 30 giorni

    //const mediaScari30gg = risultatiCausale.Info30gg; // Ottiene la media dei movimenti "scari" negli ultimi 30 giorni
    //const mediaScari30gg = risultatiCausale.InfoALLgg; // Ottiene la media dei movimenti "scari"
    if (risultatiCausale.Info90gg > risultatiCausale.InfoALLgg)
      var mediaScari30gg = risultatiCausale.Info90gg;
    else  
      var mediaScari30gg = risultatiCausale.InfoALLgg;

    

    let dataEsaurimento = "";
    let giorniRimanenti = "";

    if (mediaScari30gg === 0) {
      // Non ci sono movimenti "scari" negli ultimi 30 giorni
      return {dataEsaurimento, giorniRimanenti};
    }

    giorniRimanenti = Math.floor(giacenzaAttuale / mediaScari30gg); // Calcola il numero di giorni rimanenti

    dataEsaurimento = new Date(); // Data attuale
    dataEsaurimento.setDate(dataEsaurimento.getDate() + giorniRimanenti); // Aggiunge il numero di giorni rimanenti
    if(dataEsaurimento.getDay() === 6)
      dataEsaurimento.setDate(dataEsaurimento.getDate() + 2);
    if(dataEsaurimento.getDay() === 7)
      dataEsaurimento.setDate(dataEsaurimento.getDate() + 1);
    
    //dataEsaurimento =  dataEsaurimento.toLocaleDateString();

    var anno = dataEsaurimento.getFullYear();
    var mese = ('0' + (dataEsaurimento.getMonth() + 1)).slice(-2);
    var giorno = ('0' + dataEsaurimento.getDate()).slice(-2);

    dataEsaurimento = anno + '/' + mese + '/' + giorno;

    const result = {dataEsaurimento, giorniRimanenti};

    return result;
  } catch (error) {
    throw error;
  }
}



async function getVitaStimataByCodici(input) {
  if (Array.isArray(input)) {
    const risultati = [];
    for (let i = 0; i < input.length; i++) {
      const risultato = await getVitaStimataByCodici(input[i]);
      risultati.push({ codice: input[i], ...risultato });
    }
    return risultati;
  } else if (typeof input === 'object' && input !== null) {
    const risultati = {};
    for (let key in input) {
      const risultato = await getVitaStimataByCodici(input[key]);
      risultati[key] = { codice: input[key], ...risultato };
    }
    return risultati;
  } else {
    const risultato = await getVitaStimataByCodice(input);
    return { codice: input, ...risultato };
  }
}


// ho bisogno di una funzione per determinare la quantità necessaria di pz di un determinaato codice per arrivara al prossimo ordine effettuato in una determinata data

async function getNumPzProssimoOrdine(codice, dataProssimoOrdine) {
  try {
    


    const today = new Date();

    const dataProssimoOrdineDate = new Date(dataProssimoOrdine); // Converte la data in stringa in un oggetto Date

    const numGiorniProssimoOrdine = Math.floor((dataProssimoOrdineDate - today) / (1000 * 60 * 60 * 24)); // Calcola il numero di giorni rimanenti

    const medieCodice = await funApiMovimenti.getMediaSommaCausale(codice, "scari", "media"); // Ottiene la media dei movimenti "scari"

    // se valore Info90gg è maggiore di InfoALLgg allora mediaCodice = Info90gg
    // altrimenti mediaCodice = InfoALLgg
    if (medieCodice.Info90gg > medieCodice.InfoALLgg)
      var mediaCodice = medieCodice.Info90gg;
    else  
      var mediaCodice = medieCodice.InfoALLgg;

    const giacenzaAttuale = await funApiMovimenti.getGiacenzaAspettata(codice); // Ottiene la giacenza attuale del codice

    const bufferPz = Math.floor(3 * mediaCodice);; // Numero di pezzi di buffer predefinito

    const tempoConsegna = await getTempoConsegna(codice); // Ottiene il tempo di consegna del codice

    // pezziNecessari = (Consumo giornaliero x Tempo di consegna) - (Numero di pezzi x Giorni al prossimo ordine)

    //console.log("tempo codice: " + tempoConsegna);

    if (tempoConsegna != 0)
      var pzNecessari = Math.floor((tempoConsegna + numGiorniProssimoOrdine) * mediaCodice);
    else
      var pzNecessari = Math.floor(numGiorniProssimoOrdine * mediaCodice);

    var result = pzNecessari + bufferPz - giacenzaAttuale;

    if (result < 0)
      result = 0;

    return result;
  } catch (error) {
    throw error;
  }
}

// funzione ricorsiva della getNumPzProssimoOrdine che prende in input un array di codici e una data e restituisce un array di pz necessari con indice il codice


async function getNumPzProssimoOrdineArray(codici, dataProssimoOrdine) {
  try {
    const risultati = [];
    for (let i = 0; i < codici.length; i++) {
      const risultato = await getNumPzProssimoOrdine(codici[i], dataProssimoOrdine);
      const codice = codici[i];
      risultati.push({codice, risultato });
    }
    return risultati;
  } catch (error) {
    throw error;
  }
}


// Funzione per generare e restituire PDF contentnte una tabella che mostri solo i materiali indicati da un array di codici e le colonne indicate da  un array colonne

async function getMaterialiByCodicePDF(codici, colonne) {

  const materiali = await getMaterialiByCodici(codici);

  var tabellaMateriali = filterArrayByKeys(colonne, materiali);
  //console.log(colonne);

  let matriceMateriali = trasformaInMatrice(tabellaMateriali);
  //console.log(matriceMateriali);

  const pdf = new jsPDF();

  pdf.autoTable({
    head: [colonne],
    body: matriceMateriali,
    style: {lineWidth: border = 2, linewidth: Color = 10},
  })

  pdf.save("pdf-tabelle/table.pdf");
  
  //aspetta 2 secondi per permettere al pdf di essere salvato
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  //salva il pdf in una viariabile da restituire
  const data = "table.pdf";

  return data;
}


module.exports = {
    getAllMateriali,
    getAllCodici,
    getMaterialiById,
    getMaterialiByCodice,
    getMaterialiByCodici,
    addMateriale,
    modMaterialeById,
    deleteMaterialeById,
    getTempoConsegna,
    getMaterialeEsaurimento,
    getCodiciEsaurimento,
    getVitaStimataByCodice,
    getVitaStimataByCodici,
    getNumPzProssimoOrdine,
    getNumPzProssimoOrdineArray,
    getMaterialiByCodicePDF,
}








function filterArrayByKeys(keys, array) {
  // Crea un nuovo array vuoto
  const filteredArray = [];

  // Itera sull'array di oggetti
  for (const object of array) {
    // Crea un nuovo oggetto vuoto
    const filteredObject = {};

    // Itera sulle chiavi
    for (const key of keys) {
      // Aggiungi la chiave e il valore corrispondente all'oggetto filtrato
      filteredObject[key] = object[key];
    }

    // Aggiungi l'oggetto filtrato all'array filtrato
    filteredArray.push(filteredObject);
  }

  // Restituisci l'array filtrato
  return filteredArray;
}


function trasformaInMatrice(array) {
  // Creare una matrice vuota
  let matrice = [];

  // Iterare attraverso ogni oggetto nell'array
  array.forEach((elemento) => {
    // Creare un array di valori dalle proprietà dell'oggetto
    let valori = Object.values(elemento);
    
    // Aggiungere l'array di valori alla matrice
    matrice.push(valori);
  });

  return matrice;
}


function trasformaInArrayDiStringhe(array) {
  // Utilizza il metodo map per trasformare ogni oggetto in una stringa
  let arrayDiStringhe = array.map((elemento) => {
    // Crea una stringa concatenando le proprietà dell'oggetto
    return Object.values(elemento).join();
  });

  return arrayDiStringhe;
}