'use strict'


const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Ad = mongoose.model('Ad');
const CustomError = require('../../modules/customError.js');





// GET /api/ads
/*
El usuario puede concatenar campos de filtro con &.
- Al utilizar name='cadena' se mostrarán todos los anuncios cuyo nombre comience por la cadena dada.
- Al utilizar price='precio':
    -> Con price=15 se mostrarán los anuncios con precio igual a 15
    -> Con price=-15 se mostrarán los anuncios con precio menor o igual a 15
    -> Con price=15- se mostrarán los anuncios con precio mayor o igual a 15
    -> Con price=15-60 (o price=60-15) se mostrarán los anuncios con precio mayor o igual a 15 y menor o igual a 60
- Al utilizar sort='campo' se mostrarán los anuncios ordenados por ese campo de menor a mayor.
- Con page=4&limit=2 se mostrará la cuarta página y cada página contendrá 2 anuncios.
- Con tags=motor,mobile puedes buscar anuncios donde aparezca cualquiera de los dos tags
 */
router.get('/', (req, res, next) => {

    const name = req.query.name;
    const price = req.query.price;
    const on_sale = req.query.on_sale;
    const tags = req.query.tags;
    let page = req.query.page;
    let limit = req.query.limit;
    const sort = req.query.sort;
    //const select = req.query.select;
    //const sort = req.query.sort;


    const filters = {};

    //-- Filtro de tag
    if (tags) {
        let arrayTags = tags.split(',');
        if (arrayTags.length > 1) {
            filters.tags = { $in: arrayTags };
        } else {
            filters.tags = tags;
        }
    }

    //-- Filtro de precio
    if (price) {
        let query = '';
        //Si en el precio aparece el símbolo '-'
        let pos = findSimbol(price, '-');
        if (pos !== -1) {
            //Precio menor
            if (pos === 0) {
                let number = price.slice(1);
                //console.log(price);
                query = { '$lte': number };
            } //Precio mayor 
            else if (pos === price.length - 1) {
                let number = price.slice(0, -1);
                query = { '$gte': number };
            } //Precio entre 2 valores 
            else {
                let numbers = price.split('-');
                numbers.sort(function(a, b) { return a - b });
                query = { '$gte': numbers[0], '$lte': numbers[1] };
            }
        }
        //Precio exacto
        else {
            query = price;
        }
        filters.price = query;

    }
    if (on_sale) {
        console.log(on_sale);
        if (on_sale === "true")
            filters.on_sale = true;
        else
            filters.on_sale = false;
    }
    //-- Filtro de nombre
    if (name) {
        filters.name = new RegExp('^' + name, "i");
    }
    //Si no especifica página se mostrará la primera
    if (!page) {
        page = 1;
    }
    //Si no especifica el límite de anuncios por página será 1
    if (!limit) {
        limit = 2;
    }

    //Si la página es 2, entonces se mostrarás los anuncios 3 y 4
    const skip = (page - 1) * limit;

    //recuperamos una lista de agentes
    Ad.list(filters, +limit, skip, sort, (err, ads) => {
        if (err) {
            const error = new CustomError('MONGODB_QUERY_ERROR', req.lan);
            res.json(error);
            return;
        }
        res.json({ success: true, tags: ads });
    });
});



//-- GET /api/ads/tags
router.get('/tags', (req, res, next) => {


    Ad.aggregate([

        { $project: { tags: 1 } }, /* select the tags field as something we want to "send" to the next command in the chain */
        { $unwind: '$tags' } /* this converts arrays into unique documents for counting */ ,
        {
            $group: { /* execute 'grouping' */
                _id: '$tags' /* using the 'tag' value as the _id */
            }
        }
    ], function(err, tags) {
        if (err) {
            const error = new CustomError('MONGODB_QUERY_ERROR', req.lan);
            res.json(error);
            return;
        }
        res.json({ success: true, tags: tags });
    });


});

//Devuelve la posición en la que aparece el símbolo
function findSimbol(characters, simbol) {

    var found = false;
    let i = 0;
    while (!found && i < characters.length) {
        if (characters[i] === simbol) {
            found = true;
            return i;
        }
        i++;
    }

    return -1;
}

module.exports = router;