const fetch = require('node-fetch');
const User = require('../models/User.Model');

module.exports = {
    getAll
};

async function getAll(pUser) {
    //Busco usuario
    const user = await User.findById(pUser.sub);

    if (!user) throw 'Hubo un problema al buscar el usuario.';

    var userCurrency = user.preferedCurrency;

    //Obtengo monedas de CoinGecko
    const coins = await fetch(`https://api.coingecko.com/api/v3/coins`, {method: 'get'})
        .then(response => {
            return response.json();
        });

    let responseArray = [];

    //Recorro las monedas disponibles y obtengo los valores a devolver
    for (let i = 0; i < coins.length; i++) {
        const coin = coins[i];

        responseArray.push({
            symbol: coin.symbol,
            name: coin.name,
            image: coin.image,
            last_updated: coin.last_updated,
            current_price: coin.market_data.current_price[userCurrency]
        });
    }

    return responseArray;
}