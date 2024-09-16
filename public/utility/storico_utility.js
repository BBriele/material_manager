//------------------------------------------------------------------------------
//ESEGUE AL CARICAMENTO DELLA PAGINA
//chiama la route /apiMovimenti/getMovimenti per avere tutti i movimenti e renderizzarli

//const movimentiTable = document.querySelector('#movimenti-table');

/*if (codice_load){   
    console.log("quii");
    axios.get('/apiMovimenti/getMovimentiByCod/' + codice_load)*/
if (window.location.pathname.split('/')[2]){
    axios.get('/apiMovimenti/getMovimentiByCod/' + window.location.pathname.split('/')[2])
    .then((response) => {
        //renderMovimentiTable(response.data);
        insertTableFromMongooseDocuments(response.data, "div_table");
    })
    .catch((error) => {
        console.error(error);
    });
}else{
    //console.log("quiii");
    axios.get('/apiMovimenti/getMovimenti')
    .then((response) => {
        //renderMovimentiTable(response.data);
        insertTableFromMongooseDocuments(response.data, "div_table");
    })
    .catch((error) => {
        console.error(error);
    });
}

document.getElementById('quantita').addEventListener("keyup", (event) => {showGiacenza()});
//document.getElementById('quantita').onkeyup = getGiacenza();
document.getElementById('data').addEventListener("keyup", (event) => {showGiacenza()});
//document.getElementById('data').onkeyup = getGiacenza();;

//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//  FUNZIONI MOSTRA/NASCONDI FORM NUOVO MOVIMENTO
function showForm() {
    document.getElementById('formMovimento').style.display = 'block';
    if (window.location.pathname.split('/')[2]){
        document.getElementById('codice').value = window.location.pathname.split('/')[2];
    }
    //console.log(moment().format("yyyy/MM/DDTHH:mm:ss"));
    document.getElementById("data").value = moment().format("yyyy-MM-DDTHH:mm:ss");
}

function hideForm() {
    document.getElementById('formMovimento').style.display = 'none';
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//  REDIRECT ALLA PAGINA DEI MATERIALI
function backToMateriali(){
    url = "/visualizza_materiale";
    window.location.href = url;
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//EVENTLISTENER e FUNZIONE ANNULLA MODIFICA
document.querySelector('#annulla-modifica').addEventListener('click', annullaModifica);
function annullaModifica() {
    const form = document.querySelector('#modifica-form');
    form.reset();
    form.style.display = 'none';
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//  FUNZIONE AGGIUNTA MOVIMENTO
function salvaMovimento() {
    //const aggiungiForm = document.querySelector('#formMovimento');
    //const formData = new FormData(aggiungiForm);
    event.preventDefault();
    
    const codice = document.getElementById('codice').value;
    const causale = document.getElementById('causale').value;
    const quantita = document.getElementById('quantita').value;
    const giacenza = document.getElementById('giacenza').value;
    const data = document.getElementById('data').value;
    const note = document.getElementById('note').value;

    const dati = {
        codice: codice,
        causale: causale,
        quantita: quantita,
        giacenza_aspettata: giacenza,
        data: data,
        note: note
    };

    axios.post('/apiMovimenti/addMovimento', dati)
        .then((response) => {
            window.location.reload();
        })
        .catch((error) => {
            console.error(error);
            alert('Errore durante il salvataggio del movimento');
    });
}
//------------------------------------------------------------------------------
        

//------------------------------------------------------------------------------
//EVENTLISTENER e FUNZIONE MODIFICA MOVIMENTO
//const modificaForm = document.querySelector('#modifica-form');
modificaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(modificaForm);

    //Invia i dati del form a /movimenti/:id per la modifica di dato record
    axios.put(`/apiMovimenti/modMovimentoById/${formData.get('_id')}`, Object.fromEntries(formData))
        .then((response) => {
            //console.log(response.data);
            annullaModifica();
            /*axios.get('/movimenti')
                .then((response) => {
                    renderMovimentiTable(response.data);
                })
                .catch((error) => {
                    console.error(error);
            });*/
            window.location.reload();
        })
        .catch((error) => {
            console.error(error);
    });
});
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// FUNZIONE MOSTRA FORM MODIFICA MATERIALE
function showModMovimento(id){
    axios.get("/apiMovimenti/getMovimentiById/" + id)
    .then((response) => {
        //console.log(response.data[0]._id);
        const form = document.querySelector('#modifica-form');
        form.style.display = 'block';
        form.querySelector('#input-id').value = response.data[0]._id;
        form.querySelector('#input-codice').value = response.data[0].codice;
        form.querySelector('#input-causale').value = response.data[0].causale;
        form.querySelector('#input-quantita').value = response.data[0].quantita;
        form.querySelector('#input-giacenza').value = response.data[0].giacenza_aspettata;
        form.querySelector('#input-data').value = response.data[0].data.split('.')[0];
        form.querySelector('#input-note').value = response.data[0].note || '';
})
    .catch((error) => {
        console.error(error);
    });
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// FUNZIONE ELIMINA MATERIALE
function deleteMovimento(id){
    var result = confirm("Sei sicuro di voler continuare?");

    // Se l'utente clicca su OK, esegue la parte di codice qui sotto
    if (result) {
        //console.log("Materiale eliminato id" + id);
        axios.delete("/apiMovimenti/deleteMovimentoById/" + id)
        .then((response) => {
            //console.log(response.data[0]._id);
            //window.location.reload();
        })
        .catch((error) => {
            console.error(error);
        });
    }
}
//------------------------------------------------------------------------------

async function updateTabella(){
    axios.get("/apiMovimenti/getMovimenti")
        .then((response) => {
            //console.log(response.data[0]._id);
            //window.location.reload();
        })
        .catch((error) => {
            console.error(error);
        });
}