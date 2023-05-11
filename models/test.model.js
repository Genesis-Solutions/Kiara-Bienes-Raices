const db = require("../util/database.util");

module.exports = class Test {

    static findOne(emailUsuario) {
        return db.execute("SELECT * FROM usuario WHERE emailUsuario=?", [
        emailUsuario,
        ]);
    }
};
