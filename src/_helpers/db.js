const mongoose = require('mongoose');

let connectionString = 'mongodb+srv://lbrasca:admin123@cluster0.b7smc.mongodb.net/wchallenge-crypto?retryWrites=true&w=majority'

initialize();

async function initialize(){
  // connect to database
  let connect = await mongoose.connect(connectionString)
                    .then( () => console.log('Successfully connect to MongoDB'))
                    .catch(err => console.log("Connection error",err));
  
}


