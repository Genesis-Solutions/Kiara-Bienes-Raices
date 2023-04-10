const db = require('../util/database');

module.exports = class Text {

    static insertRegister(text) {
        return db.execute(
            'INSERT INTO test_text(text) VALUES (?)',[text]
        );
    }

    static fecthAll() {
        return db.execute(
            'SELECT * FROM test_text'
        );
    }

    static updateRegisterById(id,text) {
        return db.execute(
            'UPDATE test_text SET text = ? WHERE idTestText=?',[text,id]
        );
    }

    static deleteRegisterById(id) {
        return db.execute(
            'DELETE FROM test_text WHERE idTestText=?',[id]
        );
    }

}