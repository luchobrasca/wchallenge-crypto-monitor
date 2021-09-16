const config = require('../config.json');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const User = require('../models/User.Model');

module.exports = {
    create,
    login,
    getById,
    addCryptocurrency,
    getTopNCryptos
};

async function create(pUser) {
     //Valido si el nombre de usuario ya existe
     if (await User.findOne({ username: pUser.username })) {
        throw 'El nombre de usuario "' + pUser.username + '" ya existe';
    }

    const newUser = new User(pUser);

    //Grabo usuario
    await newUser.save();
}

async function login({ username, password }) {
    //Busco si existe usuario
    const user = await User.findOne({ username });

    //Si existe, retorno sus datos junto con el token
    if (user && user.password === password) {
        const token = jwt.sign({ sub: user.id }, config.secret, { expiresIn: '1h' });
        return {
            ...user.toJSON(),
            token
        };
    }else{
        throw 'Usuario y/o contraseña incorrectos.'
    }
}

async function getById(id) {
    return await User.findById(id);
}

async function addCryptocurrency(pUser, pBody) {
    //Busco usuario
    const user = await User.findById(pUser.sub);

    if (!user) throw 'Hubo un problema al buscar el usuario.';

    for (let i = 0; i < pBody.cryptoCurrencies.length; i++) {
        const crypto = pBody.cryptoCurrencies[i];

        let exist = user.cryptoCurrencies.find(element => element.crypto_id === crypto.crypto_id);
        
        if (!exist){
            //Si no existe lo agrego a las cryptomonedas del usuario
            user.cryptoCurrencies.push(crypto);  
        }        
    }
    
    //Actualizo
    await user.save();

}

async function getTopNCryptos(pUser, {n, order}){
    //Busco usuario
    const user = await User.findById(pUser.sub);

    if (!user) throw 'Hubo un problema al buscar el usuario.';

    var responseArray = [];

    //Recorro el array de cryptomonedas del usuario
    for (let i = 0; i < user.cryptoCurrencies.length; i++) {
        const cryptoUser = user.cryptoCurrencies[i];
        
        //Obtengo info de la moneda en CoinGecko
        const cryptoInfo = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoUser.crypto_id}`, {method: 'get'})
                                    .then(response => {
                                        return response.json();
                                    });
        
        const cryptoInfo_Symbol = cryptoInfo.symbol;
        const cryptoInfo_Price_ars = cryptoInfo.market_data.current_price.ars;
        const cryptoInfo_Price_usd = cryptoInfo.market_data.current_price.usd;
        const cryptoInfo_Price_eur = cryptoInfo.market_data.current_price.eur;
        const cryptoInfo_Name = cryptoInfo.name;
        const cryptoInfo_Image = cryptoInfo.image;
        const preferedCurrencyPrice = cryptoInfo.market_data.current_price[user.preferedCurrency];

        responseArray.push({
            symbol: cryptoInfo_Symbol,
            ars: cryptoInfo_Price_ars,
            usd: cryptoInfo_Price_usd,
            eur: cryptoInfo_Price_eur,
            name: cryptoInfo_Name,
            image: cryptoInfo_Image,
            preferedCurrencyPrice
        });                                    
    }

    //Ordeno segun el parametro "order" enviado y la moneda de preferencia del usuario
    //Si order = 'asc' ordeno ascendentemente, si order = 'desc', order = '' u order = undefined ordeno descendentemente
    responseArray.sort(order === 'asc'? orderAsc : orderDesc);

    //Elimino la columna preferedCurrencyPrice, usada para el ordenamiento
    responseArray.forEach(function(v){ delete v.preferedCurrencyPrice });

    //Retorno el arreglo de cryptomonedas del usuario ordenado, entre [0, n]
    return responseArray.slice(0, n);
}

function orderAsc(a, b){
    const priceA = a.preferedCurrencyPrice;
    const priceB = b.preferedCurrencyPrice;

    let comparison = 0;
    if (priceA > priceB) {
    comparison = 1;
    } else if (priceA < priceB) {
    comparison = -1;
    }
    return comparison;
}

function orderDesc(a, b){
    const priceA = a.preferedCurrencyPrice;
    const priceB = b.preferedCurrencyPrice;

    let comparison = 0;
    if (priceA < priceB) {
    comparison = 1;
    } else if (priceA > priceB) {
    comparison = -1;
    }
    return comparison;
}