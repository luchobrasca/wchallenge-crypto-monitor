const mongoose = require('mongoose');
const { connectionString } = require('../config.json');

initialize();

async function initialize(){
  // connect to database
  let connect = await mongoose.connect(connectionString)
                    .then( () => console.log('Successfully connect to MongoDB'))
                    .catch(err => console.log("Connection error",err));
  
}


