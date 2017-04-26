'use strict';



//Creamos un constructor de objetos
/*
function CustomError(err, message) {
    this.err = err;
    this.message = message;

    this.showError = function() {
        console.log(message, err);
    };
}

*/
function CustomError(message) {
    this.success = false;
    this.errorMessage = message;

    /*
    this.setMessage = function(value) {
        message = value;
    };
    */
    this.showCustomError = function() {
        console.log(message);
    };
}

module.exports = CustomError;