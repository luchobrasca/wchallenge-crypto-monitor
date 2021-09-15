const config = require('../config.json');
const jwt = require('jsonwebtoken');
const User = require('../models/User.Model');

module.exports = {
    create,
    login,
    getById,
    addCryptocurrency
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

        let exist = user.cryptoCurrencies.find(element => element.symbol === crypto.symbol);
        
        if (!exist){
            //Si no existe lo agrego a las cryptomonedas del usuario
            user.cryptoCurrencies.push(crypto);  
        }        
    }
    
    //Actualizo
    await user.save();

}