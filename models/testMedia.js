const db = require('../util/database');

module.exports = class Media {

    static insertRegister(text,media) {
        return db.execute(
            'INSERT INTO test_media(mediaName,mediaRoute) VALUES (?,?)',[text,media]
        );
    }

}