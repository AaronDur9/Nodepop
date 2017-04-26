'use strict';

const jwt = require('jsonwebtoken');
const config = require('../config');

//exportamos un middleware de autenticación
module.exports = function(req, res, next) {
    //Recoger el token jwt 
    //El token puede ser pasado tanto en el body de un post como a través de la url en un get
    const token = req.body.token || req.query.token || req.get('x-access-token');

    //si no me llega token, no autorizar
    if (!token) {
        const error = new Error('Necesitas un token de autenticación');
        error.status = 401;
        next(error);
        return;
    }

    //validar el token 
    jwt.verify(token, config.jwtSecret, (err, openedToken) => {

        //Si el token ha sido modificado o ha expirado 
        //Nos dará este error
        if (err) {
            const error = new Error('El token no es válido');
            error.status = 401;
            next(error);
            return;
        }

        //El token es correcto
        req.user_id = openedToken.user_id;
        next();
    });
};