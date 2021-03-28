
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
* ./uploads/Company
* ./uploads/Event
*/
const storage_User = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/User');
    },
    filename: function (req, file, cb) {
        cb(null, moment().format('YYYYMMDDHHms') + path.extname(file.originalname));
    }
})


const storage_Company = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/Company');
    },
    filename: function (req, file, cb) {
        cb(null, moment().format('YYYYMMDDHHms') + path.extname(file.originalname));
    }
})

const storage_Event = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/Event');
    },
    filename: function (req, file, cb) {
        cb(null, moment().format('YYYYMMDDHHms') + path.extname(file.originalname));
    }
})

/*
* multer export
* by folder 
* ./uploads/User
* ./uploads/Company
* ./uploads/Event
*/

exports.upload_User = multer({
    storage: storage_User,
    fileFilter: fileFilters
})

exports.upload_Company = multer({
    storage: storage_Company,
    fileFilter: fileFilters
})

exports.upload_Event = multer({
    storage: storage_Event,
    fileFilter: fileFilters
})
