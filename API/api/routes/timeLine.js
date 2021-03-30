const express = require('express')
const router = express.Router()

var multer  = require('multer')
var { upload_Event } = require("../middleware/multer");


// Database
const EventController = require ('../controllers/event')

//Get time line
router.get('/', EventController.event_get_time_line)


module.exports = router