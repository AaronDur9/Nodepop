'use strict';

// --ESTO ES EL MODELO DE USUARIOS




//Conectamos a la base de datos
//require('../lib/connectMongoose');

const mongoose = require('mongoose');

//Creamos un esquema
const userSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        unique: true,
        index: true
    },
    password: {
        type: String
    },
    salt: {
        type: Number
    }
});




/*
//Creamos método estático en el modelo
//para inicializar la base de datos de usuarios con los objetos que nos pasan
agenteSchema.statics.list = function(userList,callback) {
    

    const query = Agente.find(criterios);
    query.limit(limit);
    query.skip(skip);
    query.exec(callback);
    query.select(select);
    query.sort(sort);

    //Lo anterior es igual que ...
    //Agente.find(criterios).limit(limit).exec(callback);
}
*/

mongoose.model('User', userSchema);