/**
 * Validación de correo electrónico.
 * @params {string} email = Correo electrónico a verificar
 * @return {boolean} Regresa true o false.
*/

function validateEmail(email) {
    var atSymbol = email.indexOf("@");
    var dotSymbol = email.lastIndexOf(".");
    var spaceSymbol = email.indexOf(" ");

    if ((atSymbol != -1) &&
        (atSymbol != 0) &&
        (dotSymbol != -1) &&
        (dotSymbol != 0) &&
        (dotSymbol > atSymbol + 1) &&
        (email.length > dotSymbol + 1) &&
        (spaceSymbol == -1)) {
        return true;
    } else {
        return false;
    };
};

module.exports = {validateEmail};