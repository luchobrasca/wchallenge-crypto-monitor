# WChallenge - Cryptocurrencies Monitor

Esta API es un wrapper de CoinGecko (https://www.coingecko.com/en/api) que consume el servicio y utiliza su información, junto con su propio modelo de datos persistido en una base de datos MongoDB.

## Instalación

Para instalar las dependencias del proyecto, posicionarse sobre la carpeta del proyecto en una consola de comandos y ejecutar.

```bash
npm install
```

Una vez instaladas las dependencias, en la consola ejecutar para iniciar el servicio de manera local.

```bash
npm start
```

Veremos en la consola el siguiente mensaje. Esto indica que el servicio esta corriendo sobre el puerto 8080.

```bash
Listening on port 8080
```

También nos informa si la conexión con la base de datos fue exitosa.

```bash
Successfully connect to MongoDB
```

Para correr los test.

```bash
npm test
```

## Configuración de la base de datos

El connectionString a la base de datos lo encontraremos en el archivo config.json. En el respositorio se incluye una conexión a una base de datos en MongoDB Atlas, a fines de simplificar la prueba y evaluacion del proyecto

```json
{
    "connectionString":"mongodb+srv://lbrasca:admin123@cluster0.b7smc.mongodb.net/wchallenge-crypto?retryWrites=true&w=majority",
    "secret": "asdqwe123"
}
```

## Endpoints

* **POST** /users/create
* **POST** /users/login
* **GET** /cryptos/getAll
* **POST** /users/addCryptocurrency
* **POST** /users/getTopNCryptos

### /users/create
Con este endpoint se crean los usuarios. Recibe los datos enviados en el body, de la siguiente manera:
```json
{
    "username":  "usuario1", 
    "password": "asdasd",
    "firstname":  "nombre", 
    "lastname": "apellido",
    "preferedCurrency": "usd"
}
```
A tener en cuenta:
- ***password*** debe contener al menos 8 caracteres alfanuméricos
- ***preferedCurrency*** admite 3 posibles valores: "usd" *(Dólar)*, "eur" *(Euro)* y "ars" *(Peso argentino)*.
### /users/login
Este endpoint recibe usuario y contraseña a través del body:
```json
{
    "username":  "usuario10", 
    "password": "pass123"
}
```
Devuelve todos los datos del usuario e incluye un token para la autenticación en los siguientes endpoints. La validez del token es de 1 hora.
```json
{
    "_id": "614254f813fb20e7ae199867",
    "username": "usuario10",
    "password": "pass123",
    "firstname": "nombre",
    "lastname": "apellido",
    "preferedCurrency": "usd",
    "cryptoCurrencies": [
        {
            "crypto_id": "bitcoin",
            "_id": "61425594e1fb4e0b7d3a6bf1"
        },
        {
            "crypto_id": "ethereum",
            "_id": "61425595e1fb4e0b7d3a6bf2"
        },
        {
            "crypto_id": "cardano",
            "_id": "614255cce1fb4e0b7d3a6bfd"
        }
    ],
    "createdAt": "2021-09-15T20:18:00.510Z",
    "updatedAt": "2021-09-15T20:21:32.848Z",
    "__v": 2,
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2MTQyNTRmODEzZmIyMGU3YWUxOTk4NjciLCJpYXQiOjE2MzE5NzQxNDYsImV4cCI6MTYzMTk3Nzc0Nn0.izg_uj4eZeO7DqugMVJr0j2_dBGYkBO1zbHHFpzm-Zs"
}
```
### /cryptos/getAll
Este endpoint devuelve todas las criptomonedas disponibles en la API de CoinGecko. Se deberá incluir el token en la llamada como Bearer Token.
Los datos que se incluyen, de cada moneda, son:
- Simbolo.
- Precio (en la moneda preferida del usuario).
- Nombre.
- Imagen.
- Fecha última actualización.
### /users/addCryptocurrency
Mediante este endpoint podemos agregar criptomonedas al usuario. También debemos adjuntar el token como Bearer Token para poder validar a que usuario se le agregaran las criptomonedas enviadas en el body, de la siguiente manera:
```json
{
    "cryptoCurrencies": [
        {
            "crypto_id": "bitcoin"
        },
        {
            "crypto_id": "ethereum"
        },
        {
            "crypto_id": "cardano"
        }
    ]
}
```
El endpoint recibe uno o varios id de criptomonedas. Verifica si el usuario no tiene esa moneda entre sus monedas, si no existe la agrega. 

### /users/getTopNCryptos
Este endpoint devuelve el top N de monedas del usuario. Recibe los siguientes parámetros en el body (junto con el Bearer Token):
```json
{
    "n": 2,
    "order": "asc"
}
```
- ***n*** puede ser menor o igual a 25
- ***order*** es opcional. Admite los valores: "asc" *(Orden ascendente)*, "desc" *(Orden descendente)* y "" *(vacío, se comportara como si no hubiese enviado el parámetro)*.

Se ordena por la cotización de la moneda favorita del usuario. Si el parametro *order* es vacío o no esta incluido en el body, el orden por defecto sera descendente.