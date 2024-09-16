const MovimentiMateriali = require('../../models/movimenti');
const DatiMateriali  = require('../../models/materiali');

async function getAllMovimentiMateriali() {
  const movimenti = await MovimentiMateriali.find();
  return movimenti;
}

async function getMovimentiByCodice(codice) {
  const movimenti = await MovimentiMateriali.find({ codice: codice }).exec();
  return movimenti;
}

 
async function getMovimentiById(id) {
    const movimenti = await MovimentiMateriali.find({ _id: id }).exec();
    return movimenti;
}

async function addMovimento(movimento) {
    const nuovoMovimento = await MovimentiMateriali.create(movimento);
    return nuovoMovimento;
}

async function modMovimentoById(id, modifiche) {
    const movimentoModificato = await MovimentiMateriali.findByIdAndUpdate(id, modifiche, { new: true });
    return movimentoModificato;
}


async function deleteMovimentoById(id) {
    const movimentoEliminato = await MovimentiMateriali.findByIdAndDelete(id);
    return movimentoEliminato;
}


async function getGiacenzaAspettata(codice, qt = 0, opt = "scari", dataS = Date()) {
    try {
      const data = dataS;
      const movimento = await MovimentiMateriali
        .findOne({ codice, data: { $lte: data } }) // troviamo il movimento con codice dato e data inferiore o uguale a quella fornita
        .sort({ data: -1 }) // ordiniamo i risultati per data in ordine decrescente
        .select('giacenza_aspettata')  //selezioniamo solo il campo giacenza_aspettata
        .exec();
  
      if(!movimento)
        return null;
      
      var giac = ((movimento.giacenza_aspettata) ? parseInt(movimento.giacenza_aspettata) : 0);
      var qt = parseInt(qt);
  
      switch(opt){
        case "cari":
          giac += qt;
          return giac.toString();

        case "scari":
          giac -= qt;
          return giac.toString();
  
        case "INV":
          giac = qt;
          return giac.toString();

        /*case "InUbi":
          giac = giac;
          return giac.toString();

        case "OutUbi":
          giac = giac;
          return giac.toString();*/

        default:
          return giac.toString();
      }
  
  
    } catch (error) {
      console.error(error);
      return null; // in caso di errore restituiamo null
    }
}


async function getGiacenzaAspettataRicorsiva(codiciJSON = [], risultati = []) {
  if (codiciJSON.length === 0) {
    return risultati;
  }

  var codici = codiciJSON;

  if (!Array.isArray(codici)) {
    codici = [codici];
  }

  if (codici.length === 0) {
    return risultati;
  }

  const codice = codici.shift();
  const giacenza = await getGiacenzaAspettata(codice);

  risultati.push({ codice, giacenza });
  return getGiacenzaAspettataRicorsiva(codici, risultati);
}

// Funzione per ottenere i movimentiMateriali in base a un range di date, codice e causale
async function getMovimentiByDate(startDate, endDate, codice, causale) {
  try {
    const query = {};

    if (startDate) {
      query.data = { $gte: startDate };
    }

    if (endDate) {
      if (query.data) {
        query.data.$lte = endDate;
      } else {
        query.data = { $lte: endDate };
      }
    }

    if (codice) {
      query.codice = codice;
    }

    if (causale) {
      query.causale = causale;
    }

    const movimenti = await MovimentiMateriali.find(query);
    return movimenti;
  } catch (error) {
    console.log(error);
    throw new Error('Errore durante l\'ottenimento dei movimentiMateriali.');
  }
}


// Funzione per ottenere la data del primo movimento di un dato codice
async function getPrimoMovimentoByCodice(codice) {
  try {
    const movimento = await MovimentiMateriali
      .findOne({ codice })
      .sort({ data: 1 })
      .select('data')
      .exec();

    if (!movimento) {
      return null;
    }

    return movimento.data;
  } catch (error) {
    throw error;
  }
}

// Funzione per ottenere la somma, media o numero dei movimentiMateriali in base a un range di date, codice, causale e operazione
async function getInfoMovimentiByDate(startDate, endDate, codice, causale, operazione) {
  try {
    const query = {
      data: { $gte: startDate, $lte: endDate }
    };

    if (codice) {
      query.codice = codice;
    }

    if (causale) {
      if(causale === "inv"){
        query.causale = "INV";
      }else{
        query.causale = causale;
      }
    }

    const movimenti = await MovimentiMateriali.find(query).exec();
    

    let risultato = 0;
    
    if (operazione === 'somma') {               //OPERAZIONE SOMMA
      risultato = movimenti.reduce((acc, movimento) => acc + movimento.quantita, 0);

    } else if (operazione === 'media') {        //OPERAZIONE MEDIA
      let  sommaTotale = 0;
      // const giorniPeriodo = (endDate - startDate) / (1000 * 60 * 60 * 24); // Calcola il numero di giorni nel periodo
      const giorniPeriodo = (new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24); // Calcola il numero di giorni nel periodo
      //console.log(giorniPeriodo);

      for (const movimento of movimenti) {
        sommaTotale += movimento.quantita;
      }

      risultato = sommaTotale / giorniPeriodo;

      /*console.log("operazione: ");
      console.log(operazione);
      console.log("movimenti: ");
      console.log(movimenti);
      console.log("risultato: ");
      console.log(risultato);*/

    } else if (operazione === 'numero') {     //OPERAZIONE NUMERO
      risultato = movimenti.length;
      

    } else {                                  //OPERAZIONE NULLA
      risultato = "Operazione NULLA";

    }

    return risultato;
  } catch (error) {
    throw error;
  }
}

// Funzione per ottenere la media o somma della causale "scari", "cari" o "INV" di un dato codice per gli ultimi 1gg, 7gg e 30gg
async function getMediaSommaCausale(codice, causale, operazione) {
  try {

    const today = new Date();
    const oneDayAgo = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000);
    const ALLDaysAgo = new Date(await getPrimoMovimentoByCodice(codice));

    //console.log(thirtyDaysAgo);

    const Info1gg = await getInfoMovimentiByDate(oneDayAgo, today, codice, causale, operazione);
    //console.log(Info1gg);
    //const somma1gg = await getInfoMovimentiByDate(oneDayAgo, today, codice, ['scari', 'cari', 'INV'], 'somma');
    const Info7gg = await getInfoMovimentiByDate(sevenDaysAgo, today, codice, causale, operazione);
    //const somma7gg = await getInfoMovimentiByDate(sevenDaysAgo, today, codice, ['scari', 'cari', 'INV'], 'somma');
    const Info30gg = await getInfoMovimentiByDate(thirtyDaysAgo, today, codice, causale, operazione);
    //const somma30gg = await getInfoMovimentiByDate(thirtyDaysAgo, today, codice, ['scari', 'cari', 'INV'], 'somma');
    const Info90gg = await getInfoMovimentiByDate(ninetyDaysAgo, today, codice, causale, operazione);
    const InfoALLgg = await getInfoMovimentiByDate(ALLDaysAgo, today, codice, causale, operazione);

    const risultato = {
      Info1gg,
      Info7gg,
      Info30gg,
      Info90gg,
      InfoALLgg
    };
    return risultato;
  } catch (error) {
    throw error;
  }
}




module.exports = {
  getAllMovimentiMateriali, 
  getMovimentiByCodice, 
  getMovimentiById, 
  addMovimento, 
  modMovimentoById,
  deleteMovimentoById, 
  getGiacenzaAspettata, 
  getGiacenzaAspettataRicorsiva, 
  getMovimentiByDate, 
  getInfoMovimentiByDate,
  getMediaSommaCausale,
  getPrimoMovimentoByCodice,
};