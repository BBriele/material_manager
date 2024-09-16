const path = require('path');


const directory_root = __dirname;


//PATH VIEWS HTML
const path_pg_vis_mat = "views/pg_visual_materiale.html";
const path_pg_vis_mov = "views/pg_visual_storico.html";
const path_pg_vis_riep = "views/pg_visual_riepilogo.html";
const path_pg_vis_nec = "views/pg_visual_necessario.html";



//PATH UTILITY
const path_from_utility = "public/utility/form_utility.js";
const path_tables_utility = "public/utility/tables_utility.js";


//PATH API
const path_materialiApi = "api/materialiApi.js";
const path_movimentiApi = "api/movimentiApi.js";

module.exports = {
    directory_root,
    path_pg_vis_mov,
    path_pg_vis_riep,
    path_pg_vis_nec,
};