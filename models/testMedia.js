const db = require('../util/database');

module.exports = class Media {

    static insertRegister(text,media) {
        return db.execute(
            'INSERT INTO test_media(mediaName,mediaRoute) VALUES (?,?)',[text,media]
        );
    }

    static fecthAll() {
        return db.execute(
            'SELECT * FROM test_media'
        );
    }

    static deleteRegisterById(id) {
        return db.execute(
            'DELETE FROM test_media WHERE idTestMedia=?',[id]
        );
    }

}