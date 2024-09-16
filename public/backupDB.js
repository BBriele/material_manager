const { exec } = require('child_process');
const glob = require("../path_config");
const path = require("path");
const fs = require('fs');
const moment = require('moment');

// Funzione per effettuare il backup di un database MongoDB
function backupMongoDB(databaseName, outputPath) {
  const timestamp = moment().format('YYYY-MM-DD_HH-mm-ss');
  const backupFolder = path.join(outputPath, `${databaseName}_${timestamp}`);

  fs.mkdirSync(backupFolder);

  const command = `mongodump --db ${databaseName} --out ${backupFolder}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Errore durante il backup del database: ${error}`);
    } else {
      console.log(`Backup del database ${databaseName} completato con successo.`);
    }
  });
}

// Funzione per ripristinare un backup di un database MongoDB
function restoreMongoDB(databaseName, backupPath) {
  const command = `mongorestore --db ${databaseName} ${backupPath}`;

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Errore durante il ripristino del backup: ${error}`);
    } else {
      console.log(`Ripristino del backup del database ${databaseName} completato con successo.`);
    }
  });
}

// Utilizzo delle funzioni
const databaseName = 'movimenti';
const backupPath = path.join(glob.directory_root, '/backupDB');

// Esegui il backup del database
backupMongoDB(databaseName, backupPath);

// Esegui il ripristino del backup
//restoreMongoDB(databaseName, backupPath);


module.exports = {backupMongoDB};