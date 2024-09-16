async function generateMaterialForm(doc = null) {
    const form = document.createElement('form');
  
    const fields = [
      { label: 'Codice:', name: 'codice', type: 'text' },
      { label: 'Descrizione:', name: 'descrizione', type: 'text' },
      { label: 'Fornitore:', name: 'fornitore', type: 'text' },
      { label: 'Giacenza Minima:', name: 'giacenza_minima', type: 'number' },
      { label: 'Reparto:', name: 'reparto', type: 'text' }
    ];
  
    fields.forEach(field => {
      const div = document.createElement('div');
      const label = document.createElement('label');
      label.innerHTML = field.label;
      const input = document.createElement('input');
      input.name = field.name;
      input.type = field.type;
      input.required = true;
      if (doc) {
        input.value = doc[field.name];
      }
      div.appendChild(label);
      div.appendChild(input);
      form.appendChild(div);
    });
    
    const submit = document.createElement('input');
    submit.type = 'submit';
    submit.value = 'Salva';
  
    form.appendChild(submit);
  
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const url = doc ? `/modMaterialeById/${doc._id}` : '/apiMateriali/addMateriale';
      try {
        const response = await axios({
          method: doc ? 'put' : 'post',
          url: url,
          data: Object.fromEntries(formData)
        });
        //console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    });
    
    Promise.resolve(1);
    return form;
}


async function insertForm(doc = null, elementId) {
    const form = await generateMaterialForm(doc);
    //console.log(form);
    const element = document.getElementById(elementId);
    element.innerHTML += form;
    //console.log(element);
}