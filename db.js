const mongoose = require('mongoose');

const uri = 'mongodb://127.0.0.1:27017/movimenti';
const options = { useNewUrlParser: true, useUnifiedTopology: true };

mongoose.connect(uri, options)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error);
  });
