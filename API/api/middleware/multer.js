
var multer = require('multer')
const moment = require('moment');
const path = require('path')

//Generic Filter
const fileFilters = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true); // OK
    } else {
        cb(null, false);//reject file
    }
}


/*
* Storage Configuration
* by folder 
* ./uploads/User
*/
const storage_User = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/User');
    },
    filename: function (req, file, cb) {
        cb(null, moment().format('YYYYMMDDHHms') + path.extname(file.originalname));
    }
})

/*
* multer export
* by folder 
* ./uploads/User
*/

exports.upload_User = multer({
    storage: storage_User,
    fileFilter: fileFilters
})