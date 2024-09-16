@echo off
title Avvio del server Express

echo Avvio del server Express...

REM Imposta il percorso alla directory del tuo progetto Node.js
set NODE_PROJECT_DIR= F:\Codice\server_consumabili_refactor

REM Imposta il nome del file del server Node.js
set NODE_SERVER_FILE=server.js

REM Imposta il comando per avviare il server Node.js
set NODE_COMMAND=node %NODE_PROJECT_DIR%\%NODE_SERVER_FILE%

REM Avvia il server Node.js
start "Server Express" cmd /k "%NODE_COMMAND%"


echo Apro finestra Chrom a http://localhost:3001/home
start chrome http://localhost:3001/home

exit