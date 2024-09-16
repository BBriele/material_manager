//------------------------------------------------------------------------------
//ESEGUITO AL CARICAMENTO DELLA PAGINA
//const materialiTable = document.querySelector('#movimenti-table');


if (window.location.pathname.split('/')[2]){

    /*const resp = $.ajax({
        url: window.location.href,
        type: "POST",
        success: function(data) {
            // Converte la stringa di testo in un oggetto JavaScript
            const response = JSON.parse(data);
            
            // Accede ai valori dei parametri "cod", "startDate" e "endDate"
            const cod = response.cod;
            const startDate = response.startDate;
            const endDate = response.endDate;
            //console.log(response);
            return response;
        }
    });*/

    axios.get('/apiMovimenti/getMovimentiByCod/' + window.location.pathname.split('/')[2])
    //axios.get('/apiMovimenti/getMovimentiByCod/' + resp.cod )
    .then((response) => {
        //renderMovimentiTable(response.data);
        //document.getElementById("div_table").innerHTML = generateLineChart(response.data);
        const data = filterDocumentsByDate(response.data, 0 , 0);
        createChart(data);
        
    })
    .catch((error) => {
        console.error(error);
    });
}else{
    axios.get('/apiMovimenti/getMovimenti')
    .then((response) => {
        //renderMaterialiTableMateriali(response.data);
        //document.getElementById("div_table").innerHTML = generateLineChart(response.data);
    })
    .catch((error) => {
        console.error(error);
});
}
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//FUNZIONE REDIRECT ALLO STORICO DI DATO CODICE
function redirectStorico(codice){
    //location.replace("127.0.0.1:3000/visualizza_storico")
    url = "/visualizza_storico/";
    url = url.concat(codice);
    window.location.href = url;
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
function createChart(data) {
    // Raggruppa i dati per codice e per data
    let groupedData = {};
    for (let item of data) {
        if (!groupedData[item.codice]) {
            groupedData[item.codice] = {};
        }
        if (!groupedData[item.codice][item.data]) {
            groupedData[item.codice][item.data] = {
                giacenza: item.giacenza_aspettata,
                quantita: 0,
            };
        }
        if (item.causale === "INV") {
            groupedData[item.codice][item.data].giacenza = item.quantita;
        } else if (item.causale === "cari") {
            groupedData[item.codice][item.data].quantita += item.quantita;
        } else if (item.causale === "scari") {
            groupedData[item.codice][item.data].quantita -= item.quantita;
        }
    }

    // Crea un grafico ChartJS per ogni codice
    for (let codice in groupedData) {
        let dates = [];
        let quantita = [];
        let giacenza = [];

        for (let data in groupedData[codice]) {
            dates.push(data);
            quantita.push(groupedData[codice][data].quantita);
            giacenza.push(groupedData[codice][data].giacenza);
        }

        let color = getRandomColor();
        let color2 = getRandomColor();

        let chartData = {
        labels: dates,
        datasets: [
            {
                label: codice + " Quantità",
                data: quantita,
                borderColor: color,
                backgroundColor: color,
                fill: false,
            },
            {
                label: codice + " Giacenza",
                data: giacenza,
                borderColor: color2,
                backgroundColor: "transparent",
                fill: false,
            },
        ],
        };

        let chartOptions = {
            title: {
                display: true,
                text: "Grafico " + codice,
            },
            scales: {
                xAxes: [
                {
                    display: true,
                    scaleLabel: {
                    display: true,
                    labelString: "Data",
                    },
                },
                ],
                yAxes: [
                {
                    display: true,
                    scaleLabel: {
                    display: true,
                    labelString: "Quantità",
                    },
                },
                ],
            },
        };

        let chart = new Chart($("#myChart"), {
            type: "line",
            data: chartData,
            options: chartOptions,
        });
    }
    }
//------------------------------------------------------------------------------   



// Funzione ausiliaria per generare un colore casuale
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}



function filterDocumentsByDate(documents, startDate, endDate) {
    // Parse start and end dates to ensure they're in ISO format
    if (startDate == 0 & endDate == 0){
        return documents
    }
    const isoStartDate = new Date(startDate).toISOString();
    const isoEndDate = new Date(endDate).toISOString();

    // Filter documents based on the date range
    const filteredDocuments = documents.filter(document => {
        const documentDate = new Date(document.date).toISOString();
        return documentDate >= isoStartDate && documentDate <= isoEndDate;
    });

    return filteredDocuments;
}