//------------------------------------------------------------------------------
//  FUNZIONE PER POPOLARE ARRAY GIACENZE MATERIALI
/*function giacToArray(materiali){
    const promises = materiali.map(async (materiale) => {
        const x = getGiacenza(materiale.codice, 0, "scari", Date());
        return ((x) ? x : 0);
    });

    const x_g =  Promise.all(promises);
    //x_g.forEach((x, index) => console.log("X:", index, " ", x));

    return x_g;
}*/
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//FUNZIONE MOSTRA GIACENZA AGGIORNATA
async function showGiacenza() {
    const cod = document.getElementById('codice').value;
    const qtx = document.getElementById('quantita').value;
    const opt = document.getElementById('causale').value;
    const data = document.getElementById('data').value;
    //const data = ((dat) ? dat : Date(dat).toISOString());
    

    const giac = await getGiacenza(cod, qtx, opt, data);
    if (giac)
            document.getElementById('giacenza_aspettata').value = giac;
    return;
}
//------------------------------------------------------------------------------



//------------------------------------------------------------------------------
//   FUNZIONE RICHIESTA API CHE RESTITUISCI GIACENZA ASPETTATA IN BASE A QT, CAUSALE E DATA
function getGiacenza(cod, qtx = 0, optx = 'scari', dat = new Date().toISOString()) {
    return new Promise((resolve, reject) => {
      const qt = (qtx ? qtx : 0);
      const data = (dat ? new Date(dat).toISOString() : new Date().toISOString());
      const opt = (optx ? optx : "scari");
  
      const uri = '/apiMovimenti/getGiacenzaAspettata/' + cod + '/' + qt + '/' + opt + '/' + data;
  
      axios.get(uri)
        .then(response => {
          const giacenza = (response.data.toString() ? response.data.toString() : 0);
          //if (document.getElementById('giacenza'))
           // document.getElementById('giacenza').value = giacenza;
          resolve(giacenza);
        })
        .catch(error => {
          console.error(error);
          reject(error);
        });
    });
  }
//------------------------------------------------------------------------------


function UserDateToISO(){

}


// The store needs to implement the following interface
/*interface IStore {
  get(id: string): any;
  set(id: string, data: any): void
}*/


function unisciArrayPerCodice(oggetti1 = [], oggetti2 = []) {
  const oggettiUnificati = [];

  if (!Array.isArray(oggetti1)) {
    oggetti1 = [oggetti1];
  }

  if (!Array.isArray(oggetti2)) {
    oggetti2 = [oggetti2];
  }

  const mapOggetti1 = new Map();
  for (const oggetto of oggetti1) {
    mapOggetti1.set(oggetto.codice, oggetto);
  }

  for (const oggetto of oggetti2) {
    const codice = oggetto.codice;
    if (mapOggetti1.has(codice)) {
      const oggetto1 = mapOggetti1.get(codice);
      const oggettoUnificato = { ...oggetto1, ...oggetto };
      oggettiUnificati.push(oggettoUnificato);
    }
  }

  return oggettiUnificati;
}



function estraiArrayDaMatrice(matrice, chiaveColonna) {
  const arrayEstratto = [];

  const righe = matrice.rows;
  const colonne = matrice.columns;

  for (let i = 1; i < righe.length; i++) {
    const riga = righe[i];

    for (let j = 0; j < colonne.length; j++) {
      const colonna = colonne[j];

      if (colonna === chiaveColonna) {
        arrayEstratto.push(riga[j]);
        break;
      }
    }
  }

  return arrayEstratto;
}



/*function eseguiFunzione(nomeFunzione, parametro) {
  // Definisci il valore predefinito da passare alla funzione

  // Esegui la funzione utilizzando eval()
  console.log(funApiMateriali.getVitaStimataByCodice(parametro));
  //var risultato = eval("funApiMateriali." + nomeFunzione + '("' + parametro + '")');
  var risultato = funApiMateriali.getVitaStimataByCodice(parametro);

  // Inserisci il risultato nell'elemento HTML desiderato
  return risultato;
}*/

function eseguiFunzione(route, parametro) {
  // Effettua la richiesta HTTP utilizzando Axios
  const url = "/apiMateriali/" + route;
  //console.log(parametro);
  // Configura l'oggetto di opzioni per la richiesta HTTP
  var params = {
    codice: parametro
  };

  axios.get(url, { params } )
    .then(function(response) {
      // Otteniamo la risposta dalla richiesta
      var risultato = response.data;

      // Inserisci il risultato nell'elemento HTML desiderato
      return risultato.toString();
    })
    .catch(function(error) {
      // Gestiamo eventuali errori
      console.log(error);
    });
}



// Funzione per modificare un materiale
function editMateriale(id) {
  showFormModMateriale(id);
}

// Funzione per eliminare un materiale
function deleMateriale(id) {
  var result = confirm("Sei sicuro di voler continuare?");

  if (result) {
      //console.log("Materiale eliminato id" + id);
      axios.delete("/apiMateriali/deleteMaterialeById/" + id)
          .then((response) => {
              window.location.reload();
          })
          .catch((error) => {
              console.error(error);
          });
  }
}

// Funzione per eliminare un movimento
function deleMovimento(id) {
  var result = confirm("Sei sicuro di voler continuare?");

  if (result) {
      //console.log("Materiale eliminato id" + id);
      axios.delete("/apiMovimenti/deleteMovimentoById/" + id)
          .then((response) => {
              window.location.reload();
          })
          .catch((error) => {
              console.error(error);
          });
  }
}

// Funzione per eliminare un movimento
function deleOrdine(id) {
  var result = confirm("Sei sicuro di voler continuare?");

  if (result) {
      //console.log("Materiale eliminato id" + id);
      axios.delete("/apiOrdini/deleteOrdineById/" + id)
          .then((response) => {
              window.location.reload();
          })
          .catch((error) => {
              console.error(error);
          });
  }
}

// Funzione per visualizzare lo storico di un materiale
function storMateriale(codice) {
  var url = "/home?buildView=movi&selectedCod=";
  url += codice;
  window.location.href = url;
}

function riepMateriale(codice) {
  var url = "/home?buildView=riep&selectedCod=";
  url += codice;
  window.location.href = url;
}

function goInfoPage(codice) {
  var url = "/home?buildView=movi&selectedCod=";
  url += codice;
  window.location.href = url;
}

function shortCutMovimentoScari(cod) {
  showForm(cod, "scari");
}
function shortCutMovimentoCari(cod) {
  showForm(cod, "cari");
}
function shortCutOrdine(cod, formname = "formOrdiniEsaurimento") {
  eval( "window[" + formname + "].showForm(" + cod + ")" );
}

// funzione che esporta in una tabella pdf la giacenza attuale dei materiali indicati nella variabile codici
async function exportGiacenzaInventario(){
  // lista di codici da inventariare
  var codici = codiciDaInventariare;
  // array di materiali da inventariare
  var materiali = await funApiMateriali.getMaterialiByCodici(codici);
  
  
}