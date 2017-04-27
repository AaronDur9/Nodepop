'use strict';



const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const User = mongoose.model('User');


const jwt = require('jsonwebtoken');
const config = require('../config');

const CustomError = require('../modules/customError.js');


const pepper = 'You either die a hero or you live long enough to see yourself become the villain';
var createHash = require('sha.js');

var random = require('random-integer-number');

// POST /users/register
router.post('/register', (req, res, next) => {

    const userInfo = req.body;
    //Insertamos el usuario


    //Hash de la contraseña
    const salt = random();
    var sha256 = createHash('sha256');
    const newPass = userInfo.password + salt + pepper;
    const hash = sha256.update(newPass, 'utf8').digest('hex');


    userInfo.password = hash;
    userInfo.salt = salt;


    console.log(userInfo);
    const user = new User(userInfo);

    user.save((err, insertedUser) => {
        if (err) {
            const error = new CustomError('MONGODB_INSERT_ERROR', req.lan);
            res.json(error);
            return;
        }
        res.json({ success: true, result: insertedUser });

    });

});



//Método de autenticación de los usuarios 
//Recibimos en un post el email y la contraseña
// POST /users/login
router.post('/login', (req, res, next) => {
    //Recibimos credenciales
    const email = req.body.email;
    const password = req.body.password;

    //Buscamos al usuario en la BD
    User.findOne({ email }).exec((err, user) => {
        if (err) {
            const error = new CustomError(err);
            res.json(error);
            return;
        }
        if (!user) {
            const error = new CustomError('EMAIL_NOT_FOUND', req.lan);
            res.json(error);
            return;
        }
        //Si existe, comprobamos su pass
        const newPass = password + user.salt + pepper;
        var sha256 = createHash('sha256');
        const hash = sha256.update(newPass, 'utf8').digest('hex');


        if (hash !== user.password) {
            //console.log(req);
            const error = new CustomError('WRONG_PASS', req.lan);
            res.json(error);
            return;
        }
        //Si la pass coincide, creamos un token  JWT
        jwt.sign({ user_id: user._id }, config.jwtSecret, config.jwtConfig, (err, token) => {
            if (err) {
                const error = new CustomError('JWT_ERROR', req.lan);
                res.json(error);
                return;
            }
            //Se lo devolvemos
            res.json({ success: true, token: token });
        });
    });
});


module.exports = router;