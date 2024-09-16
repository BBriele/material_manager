axios.get('/apiMateriali/getMaterialeInEusarimento')
                    .then(async function(response){
                        //renderMaterialiTableMateriali(response.data);
                        insertTableFromMongooseDocuments(response.data, "tabella");
                    })
                    .catch((error) => {
                        console.error(error);
});