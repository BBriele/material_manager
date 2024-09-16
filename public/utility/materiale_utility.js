const vista = "stor";

// Codice eseguito solo la prima volta
if (typeof materialiTable === 'undefined') {
    const materialiTable = document.querySelector('#materiali-table');
}  
if (typeof modificaForm === 'undefined') {
    const modificaForm = document.querySelector('#modifica-form');
}  



//------------------------------------------------------------------------------
//ESEGUITO AL CARICAMENTO DELLA PAGINA
//const materialiTable = document.querySelector('#materiali-table');
axios.get('/apiMateriali/getMateriali')
    .then(async function(response){
        //renderMaterialiTableMateriali(response.data);
        insertTableFromMongooseDocuments(response.data, "div_table");
    })
    .catch((error) => {
        console.error(error);
});
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//  MOSTRA/NASCONDI id:formMateriale
function showForm() {
    document.getElementById('formMateriale').style.display = 'block';
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//  EVENTLISTNER e FUNZIONE annulla aggiunta
document.querySelector('#annulla-aggiunta').addEventListener('click', annullaAggiunta);
function annullaAggiunta() {
    const form = document.querySelector('#formMateriale');
    form.reset();
    form.style.display = 'none';
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//  EVENTLISTNER e FUNZIONE annulla modifica
document.querySelector('#annulla-modifica').addEventListener('click', annullaModifica);
function annullaModifica() {
    const form = document.querySelector('#modifica-form');
    form.reset();
    form.style.display = 'none';
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//  FUNZIONE AGGIUNTA MATERIALE
function salvaMateriale() {
    const codice = document.getElementById('codice').value;
    const descrizione = document.getElementById('descrizione').value;
    const fornitore = document.getElementById('fornitore').value;
    const giac_min = document.getElementById('giac_min').value;
    const repart = document.getElementById('reparto').value;

    const dati = {
        codice: codice,
        descrizione: descrizione,
        fornitore: fornitore,
        giacenza_minima: giac_min,
        reparto: repart
    };

    fetch('/apiMateriali/addMateriale', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dati)
    })
    .then(() => {
        window.location.reload();
    })
    .catch((err) => {
        console.error(err);
        alert('Errore durante il salvataggio del materiale');
    });
}
//------------------------------------------------------------------------------




//------------------------------------------------------------------------------
// FUNZIONE MOSTRA FORM MODIFICA MATERIALE
function showModMateriale(id){
    axios.get("/apiMateriali/getMaterialiById/" + id)
    .then((response) => {

        //var id = response.data[0]._id;
        var giac_min = ((response.data[0].giacenza_minima) ? response.data[0].giacenza_minima : 0);
    /* var codice = response.data[0].codice;
        var descrizione = response.data[0].descrizione;
        var fornitore = response.data[0].fornitore;
        var giacenza_minima = giac_min;*/

        //insertForm(response.data[0], "div_form");

        //console.log(response.data[0]._id);
        const form = document.querySelector('#modifica-form');
        form.style.display = 'block';
        form.querySelector('#input-id').value = response.data[0]._id;
        form.querySelector('#input-codice').value = response.data[0].codice;
        form.querySelector('#input-descrizione').value = response.data[0].descrizione;
        form.querySelector('#input-fornitore').value = response.data[0].fornitore;
        form.querySelector('#input-giac_min').value = giac_min;
        form.querySelector('#input-reparto').value = response.data[0].reparto;
    })
    .catch((error) => {
        console.error(error);
    });
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
// FUNZIONE ELIMINA MATERIALE
function deleteMateriale(id){
    var result = confirm("Sei sicuro di voler continuare?");

    // Se l'utente clicca su OK, esegue la parte di codice qui sotto
    if (result) {
        //console.log("Materiale eliminato id" + id);
        axios.delete("/apiMateriali/deleteMaterialeById/" + id)
        .then((response) => {
            //console.log(response.data[0]._id);
            window.location.reload();
        })
        .catch((error) => {
            console.error(error);
        });
    }
}
//------------------------------------------------------------------------------


//------------------------------------------------------------------------------
//  EVENTLISTENER e FUNZIONE MODIFICA MATERIALE
//const modificaForm = document.querySelector('#modifica-form');
modificaForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(modificaForm);

    //Invia i dati del form a /materiali/:id per la modifica di dato record
    axios.put(`/apiMateriali/modMaterialeById/${formData.get('_id')}`, Object.fromEntries(formData))
        .then((response) => {
            //console.log(response.data);
            annullaModifica();
            axios.get('/apiMateriali/getMateriali')
                .then((response) => {
                    //renderMaterialiTableMateriali(response.data);
                    insertTableFromMongooseDocuments(response.data, "div_table");
                })
                .catch((error) => {
                    console.error(error);
            });
        })
        .catch((error) => {
            console.error(error);
    });
});
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//FUNZIONE REDIRECT ALLO STORICO DI DATO CODICE
function redirectStorico(codice){

     //location.replace("127.0.0.1:3000/visualizza_storico")
     url = "/visualizza_storico/";
     url += codice; 
     window.location.href = url;
     /*
    //location.replace("127.0.0.1:3000/visualizza_storico")
    const url_home =  `http://localhost:3000/home?viewBuild=${vista}&cod=${codice}`;

    window.location.href = url_home;*/
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//FUNZIONE REDIRECT ALLO STORICO DI DATO CODICE
function redirectRiepilogo(codice){
    //location.replace("127.0.0.1:3000/visualizza_storico")
    url = "/visualizza_riepilogo/";
    url += codice; 
    window.location.href = url;
}
//------------------------------------------------------------------------------