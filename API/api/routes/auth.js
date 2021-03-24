const express = require('express')
const router = express.Router()
var multer = require('multer')

var upload = multer({ dest: 'uploads/' })

const authController = require ('../controllers/auth')

router.post('/login', upload.none(), authController.auth_login)

module.exports = router