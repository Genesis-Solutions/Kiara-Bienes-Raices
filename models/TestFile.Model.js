const db = require('../util/database');

module.exports = class File {

    static insertRegister(text,route,name) {
        return db.execute(
            'INSERT INTO test_file(fileDescription,fileRoute,fileName) VALUES (?,?,?)',
            [text,route,name]
        );
    }

    static fecthAll() {
        return db.execute(
            'SELECT * FROM test_file'
        );
    }

}