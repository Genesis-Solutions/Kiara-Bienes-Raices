const db = require('../util/database');

module.exports = class TestFile {

    static obtenerid(text) {
        return db.execute(
            'INSERT INTO test-text(text) VALUES(?)',
            [text]
        )
    }

}