/*
// Lista dei file e delle cartelle da includere nel backup
const filesAndFolders = [
  './api',
  './backupDB',
  './models',
  './public',
  './routes',
  './views',
  './backup_code.js',
  './backup.js',
  './config_file_backup.yaml',
  './config_file.yaml',
  './db.js',
  './package-lock.json',
  './package.json',
  './server.js'
];*/
const fs = require('fs');
const readline = require('readline');

// Ottieni la directory corrente
const currentDirectory = process.cwd();

// Ottieni la data corrente per il nome del backup
const currentDate = new Date();
const backupName = `backup_${currentDate.getFullYear()}_${currentDate.getMonth() + 1}_${currentDate.getDate()}`;

// Crea la directory di backup
const backupDirectory = `${currentDirectory}/backup_${backupName}`;
fs.mkdirSync(backupDirectory);

// Leggi i file e le cartelle presenti nella directory corrente
fs.readdir(currentDirectory, (err, files) => {
  if (err) {
    console.log('Si è verificato un errore durante la lettura dei file.');
    return;
  }

  // Crea un'interfaccia di lettura per leggere l'input dell'utente
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  // Funzione ricorsiva per gestire la richiesta per ogni file/cartella
  const handleFile = (index) => {
    if (index === files.length) {
      console.log('Backup completato.');
      rl.close();
      return;
    }

    const file = files[index];

    // Verifica se è un file o una cartella
    const isDirectory = fs.statSync(file).isDirectory();

    // Stampa il nome del file/cartella
    console.log(file);

    // Chiedi all'utente se desidera aggiungere il file/cartella al backup
    rl.question('Aggiungerlo al backup? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y') {
        // Sposta il file/cartella nella directory di backup
        fs.renameSync(file, `${backupDirectory}/${file}`);
        console.log('Aggiunto al backup.');
      }

      // Passa al file/cartella successivo
      handleFile(index + 1);
    });
  };

  // Avvia il processo di gestione dei file/cartelle
  handleFile(0);
});
