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

//Cargar el json
const fs = require('fs');
//path.join se encarga de añadir y eliminar barras inclinadas
const path = require('path');

const MAX_USERS = 1;
const MAX_ADS = 2;

let initJson = '';


function removeUsers() {
    return new Promise((resolve, reject) => {
        User.remove({}, (err) => {
            if (err) {
                reject(err);
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
                reject(err);
                return;
            }
            resolve();
        });
    });
}


function insertUsers() {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < MAX_USERS; i++) {
            const user = new User(initJson['users'][i]);
            user.save(function(err, insertedUser) {
                if (err) {
                    reject(err);
                    return;
                }
            });
        }
        //Si se han insertado todos los usuarios sin error entonces llamamos al resolve
        resolve();
    });
}

function insertAds() {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < MAX_ADS; i++) {
            const ad = new Ad(initJson['ads'][i]);
            ad.save(function(err, insertedAd) {
                if (err) {
                    reject(err);
                    return;
                }
            });
        }
        //Si se han insertado todos los anuncios sin error entonces llamamos al resolve
        resolve();
    });
}




//función que lea el json con la información de la base de datos
function initBd() {
    const fichero = path.join('./lib/init_bd.json');
    fs.readFile(fichero, 'utf-8', function(err, datos) {
        if (err) {
            //callback(err);
            console.log('Error al cargar el json');
            return;
        }
        //Ya está cargado el json en la variable datos
        //Lo parseamos a json
        //Borramos la base de datos
        //Y añadimos los nuevos elementos
        initJson = JSON.parse(datos);
        removeUsers()
            .then(removeAds)
            .then(insertUsers)
            .then(insertAds)
            .catch((err) => {
                console.log("Error al inicializar la base de datos");
            });

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