const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const materiali = require('./models/materiali');
const movimenti = require('./models/movimenti');

// Connessione al database
mongoose.connect('mongodb://127.0.0.1:27017/movimenti', { useNewUrlParser: true, useUnifiedTopology: true });

// Funzione di backup per le collezioni
async function backupCollections() {
  try {
    // Esempio di backup per la Collection1
    const materialiBackup = await materiali.find({}).exec();
    // Salvataggio del backup su disco o in un altro database

    // Esempio di backup per la Collection2
    const movimentiBackup = await movimenti.find({}).exec();
    // Salvataggio del backup su disco o in un altro database

    const backupFolder = './backupDB';
    const backupDate = new Date().toISOString().replace(/T/, '_').replace(/:/g, '-').replace(/\..+/, '');
    const backupFileName1 = `backup_materiali_${backupDate}.json`;
    const backupFileName2 = `backup_movimenti_${backupDate}.json`;

    if (!fs.existsSync(backupFolder)) {
      fs.mkdirSync(backupFolder);
    }

    fs.writeFileSync(path.join(backupFolder, backupFileName1), JSON.stringify(materialiBackup, null, 2));
    fs.writeFileSync(path.join(backupFolder, backupFileName2), JSON.stringify(movimentiBackup, null, 2));

    console.log('Backup completato!');
  } catch (error) {
    console.error('Si è verificato un errore durante il backup:', error);
  } finally {
    mongoose.connection.close();
  }
}

backupCollections();
