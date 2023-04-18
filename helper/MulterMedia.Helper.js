const multer = require("multer");

const storage = multer.diskStorage({
	destination: (req, file, callback) => {
		callback(null, './assets/img');
	},
	filename: (req, file, callback) => {
        return callback(null,Date.now()+"-"+file.originalname);
	},
});

const uploadMedia = multer({ storage: storage });

module.exports = {uploadMedia};