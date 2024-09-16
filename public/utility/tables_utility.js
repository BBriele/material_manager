


const table_options = {
    columns: ["codice", "descrizione", "fornitore", "giacenza", "reparto"],
    headers: {
      codice: "Codice",
      descrizione: "Descrizione",
      fornitore: "Fornitore",
      giacenza: "giacenza",
      reparto: "Reparto",
    },
};



//----------------------------------------------------------------------------------------------------
async function generateMaterialTable(docs) {
    const headers = Object.keys(docs[0]).filter(key => key !== '_id');
    headers.splice(4, 0, "giacenza");
    //headers.join();
    const numColumns = headers.length + 3;
  
    let table = `<table id="info-table" class="display"><thead><tr>`;
    headers.forEach(header => {
      table += `<th class="searchable">${header}</th>`;
    });
    table += `      <th>Storico</th>
                    <th>Riepilogo</th>
                    <th>Modifica</th>
                    <th>Elimina</th>
                </tr>`;
    table += `</thead><tbody>`;
    
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        table += `<tr>`;
        
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            //table += `<td>${doc[header]}</td>`;
            if (typeof doc[header] === 'number') {
                table += `<td style="text-align: right;">${doc[header]}</td>`;
            }else if(header === 'giacenza'){
                const giacenza = await getGiacenza(doc.codice); // attendi il risultato della funzione getGiacenza()
                table += `<td style="text-align: right;">${giacenza}</td>`;
            }else if (header !== '' && header !== '') {
                table += `<td>${doc[header]}</td>`;
            }
        }
        
        
        table += `  
                    <td class="td_icon" onClick="redirectStorico('${doc.codice}')">
                        <i class="material-icons">insights</><!--movimenti-->
                    </td>
                    <td class="td_icon" onClick="redirectRiepilogo('${doc.codice}')">
                        <i class="material-icons">analytics</><!--riepilogo-->
                    </td>
                    <td class="td_icon" onClick="showModMateriale('${doc._id}')">
                        <i class="material-icons">edit</i>  <!-- modifica -->
                    </td>
                    <td class="td_icon" onClick="deleteMateriale('${doc._id}')">  
                        <i class="material-icons">delete</i>  <!-- elimina -->
                    </td>
                </tr>
                `; // inserisci il valore restituito nella colonna vuota
        
    }
    
    table += `</tbody></table>`;
    
    return table;
}  


async function generateMovementTable(docs) {
    const headers = Object.keys(docs[0]).filter(key => key !== '_id');
    const numColumns = headers.length + 2;
  
    let table = `<table id="info-table" class="display"><thead><tr>`;
    headers.forEach(header => {
      table += `<th>${header}</th>`;
    });
    table += `<th></th><th></th></tr>`;
    table += `</thead><tbody>`;
  
    // Crea le righe dei dati
    for (let i = 0; i < docs.length; i++) {
        const doc = docs[i];
        table += `<tr>`;
        
        for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            //table += `<td>${doc[header]}</td>`;
            if (header === 'data') {
                //const date = new Date(doc[header]).toLocaleString();
                //const date = new Date(doc[header]).toISOString();
                const dateD = new Date(doc[header]).toISOString().split('T')[0];
                const dateH = new Date(doc[header]).toISOString().split('T')[1].split('.')[0];
                const date = dateD + " " + dateH;
                
                table += `<td>${date}</td>`;
            }else if (typeof doc[header] === 'number') {
                table += `<td style="text-align: right;">${doc[header]}</td>`;
            }else if (header !== '' && header !== '') {
                table += `<td>${doc[header]}</td>`;
            }
        }
        
        table += `      
                        <td class="td_icon" onClick="showModMovimento('${doc._id}')">
                            <i class="material-icons">edit</i>  <!-- modifica -->
                        </td>
                        <td class="td_icon" onClick="deleteMovimento('${doc._id}')">
                            <i class="material-icons">delete</i>  <!-- elimina -->
                        </td>
                    </tr>
                `; // inserisci il valore restituito nella colonna vuota
        
    }
  
    return table;
}

//----------------------------------------------------------------------------------------------------



//----------------------------------------------------------------------------------------------------
async function insertTableFromMongooseDocuments(documents, elementId) {

    //console.log(documents.fornitore);
    if (documents[0].fornitore){
        // Creiamo la tabella utilizzando la funzione generateMaterialTable
        const table = await generateMaterialTable(documents);
    
        // Inseriamo la tabella nell'elemento HTML con l'ID specificato
        const element = document.getElementById(elementId);
        element.innerHTML = table;

        $('#info-table').DataTable({
            searching: true, //abilita la funzione di ricerca
            paging: true, //abilita la paginazione
            "lengthChange": true, //disabilita il cambio del numero di righe per pagina
            "ordering": true, //abilita l'ordinamento delle colonne
            "info": true, //mostra il numero totale di righe e il range visualizzato
            "stateSave": true,
            "responsive": true,
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Italian.json"
            },
            "columnDefs": [
                {"targets": [3, 4]}, //allinea a destra le colonne 2, 3 e 4
                {"orderable": false, "targets": [6, 7, 8, 9]}, //disabilita l'ordinamento nelle colonne 6,7,8,9
                {"searchable": false, "targets": [6, 7, 8, 9]}, //disabilita la ricerca nelle colonne 6,7,8,9
                //{orderable: true, className: 'select-checkbox', targets:   0}
            ],
            lengthMenu: [[15, 25, 50, -1],[15, 25, 50, 'All']],

            /*"select": {s
                style:    'os',
                selector: 'td:first-child'
            }*/
        });
        
    }
    else if(documents[0].giacenza_aspettata){
        // Creiamo la tabella utilizzando la funzione generateMovementTable
        const table = await generateMovementTable(documents);
    
        // Inseriamo la tabella nell'elemento HTML con l'ID specificato
        const element = document.getElementById(elementId);
        element.innerHTML = table;

        $('#info-table').DataTable({
            "searching": true, //abilita la funzione di ricerca
            paging: true, //abilita la paginazione
            "lengthChange": false, //disabilita il cambio del numero di righe per pagina
            "ordering": true, //abilita l'ordinamento delle colonne
            "info": true, //mostra il numero totale di righe e il range visualizzato
            "stateSave": false,
            "language": {
                "url": "https://cdn.datatables.net/plug-ins/1.10.25/i18n/Italian.json"
            },
            "columnDefs": [
                {"targets": [2, 3]}, //allinea a destra le colonne 2, 3 e 4
                {"orderable": false, "targets": [6, 7]}, //disabilita l'ordinamento nelle colonne 5 e 6
                {"searchable": false, "targets": [6, 7]}, //disabilita la ricerca nelle colonne 0 e 1
                {"type": "date", "targets": 4} // replace with the index of your date column
            ],
            "order": [[4, 'desc']],
            "lengthMenu": [[15, 25, 50, -1],[15, 25, 50, 'All']],
            select: {
                style: 'multi'
            }
        });
    }
}
//----------------------------------------------------------------------------------------------------