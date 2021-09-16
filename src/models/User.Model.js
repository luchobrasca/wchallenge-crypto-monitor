const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  username:  String, 
  password: String,
  firstname:  String, 
  lastname: String,
  preferedCurrency:   String,
  cryptoCurrencies: [{ crypto_id: String }]
},
{
    timestamps: {
        createAt: "created_at",
        updateAt: "updated_at"
    }
});

module.exports = mongoose.model("Users", userSchema);