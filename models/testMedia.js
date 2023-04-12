const db = require('../util/database');

module.exports = class Media {

    static insertRegister(text,route,name) {
        return db.execute(
            'INSERT INTO test_media(mediaDescription,mediaRoute,mediaName) VALUES (?,?,?)',
            [text,route,name]
        );
    }

    static fecthAll() {
        return db.execute(
            'SELECT * FROM test_media'
        );
    }

    static updateRegisterById(id,text,imgName) {
        return db.execute(
            'UPDATE test_media SET mediaDescription = ?, mediaName = ?  WHERE idTestMedia = ?',
            [text,imgName,id]
        );
    }

    static fetchPathById(id) {
        return db.execute(
            'SELECT mediaRoute FROM test_media WHERE idTestMedia=?',
            [id]
        );
    }

    static fetchArchiveNameById(id) {
        return db.execute(
            'SELECT mediaName FROM test_media WHERE idTestMedia=?',
            [id]
        );
    }

    static deleteRegisterById(id) {
        return db.execute(
            'DELETE FROM test_media WHERE idTestMedia=?',
            [id]
        );
    }


}