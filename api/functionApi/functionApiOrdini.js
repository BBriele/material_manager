const Ordini = require('../../models/ordini.js');

async function getAllOrdini() {
    const foo = await Ordini.find();
    return foo;
}

async function getOrdineById() {
    const foo = await OrdineAcquisto.findById(req.params.id);
    return foo;
}

async function addOrdine(ordine) {
    const foo = await Ordini.create(ordine);
    return foo;
}

async function modOrdineById(id, modifiche) {
    const foo = await Ordini.findByIdAndUpdate(id, modifiche, { new: true });
    return foo;
}

async function deleteOrdineById(id) {
    const foo = await Ordini.findByIdAndDelete(id);
    return foo;
}



module.exports = {
    getAllOrdini, 
    getOrdineById, 
    addOrdine, 
    modOrdineById, 
    deleteOrdineById,
};