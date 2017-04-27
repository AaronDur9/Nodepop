'use strict';



/*
Cargamos el json con anuncios y usuarios.
Eliminamos el contenido de las colecciones de la bd
Utilizamos los modelos Ad y User para insertar los objetos del json
*/

require('./connectMongoose');
const mongoose = require('mongoose');
require('../models/User');
require('../models/Ad');
const User = mongoose.model('User');
const Ad = mongoose.model('Ad');

const CustomError = require('../modules/customError.js');

//Cargar el json
const fs = require('fs');


const MAX_USERS = 1;
const MAX_ADS = 2;




//función que lea el json con la información de la base de datos
function initBd() {

    const fichero = './lib/init_bd.json';
    fs.readFile(fichero, 'utf-8', function(err, datos) {
        if (err) {
            const error = new CustomError('JSON_ERROR', req.lan);
            res.json(error);
            return;
        }
        //Ya está cargado el json en la variable datos
        //Lo parseamos a json
        //Borramos la base de datos
        //Y añadimos los nuevos elementos
        const initJson = JSON.parse(datos);
        removeUsers()
            .then(removeAds)
            .then(() => {
                insertUsers(initJson);
            })
            .then(() => {
                insertAds(initJson);
            })
            .catch(() => {
                const error = new CustomError('MONGODB_INIT_ERROR', req.lan);
                res.json(error);
                return;
            });
    });

}



function removeUsers() {
    return new Promise((resolve, reject) => {
        User.remove({}, (err) => {
            if (err) {
                reject();
                return;
            }
            resolve();
        });
    });
}



function removeAds() {
    return new Promise((resolve, reject) => {
        Ad.remove({}, (err) => {
            if (err) {
                reject();
                return;
            }
            resolve();
        });
    });
}


function insertUsers(initJson) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < MAX_USERS; i++) {
            const user = new User(initJson['users'][i]);
            user.save(function(err, insertedUser) {
                if (err) {
                    reject();
                    return;
                }
            });
        }
        //Si se han insertado todos los usuarios sin error entonces llamamos al resolve
        resolve();
    });
}

function insertAds(initJson) {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < MAX_ADS; i++) {
            const ad = new Ad(initJson['ads'][i]);
            ad.save(function(err, insertedAd) {
                if (err) {
                    reject();
                    return;
                }
            });
        }
        //Si se han insertado todos los anuncios sin error entonces llamamos al resolve
        resolve();
    });
}
/*
function insertUsers(initJson, callback) {

    for (let i = 0; i < MAX_USERS; i++) {
        const user = new User(initJson['users'][i]);
        user.save(function(err, insertedUser) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, insertedUser);
        });
    }
}

function insertAds(initJson, callback) {

    for (let i = 0; i < MAX_ADS; i++) {
        const ad = new Ad(initJson['ads'][i]);
        ad.save(function(err, insertedAd) {
            if (err) {
                callback(err);
                return;
            }
            callback(null, insertedAd);
        });
    }
}



function removeUsers(callback) {
    //console.log('Borrando coleccion');
    User.remove({}, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}


function removeAds(callback) {
    //console.log('Borrando coleccion');
    Ad.remove({}, (err) => {
        if (err) {
            callback(err);
            return;
        }
        callback(null);
    });
}
*/




initBd();