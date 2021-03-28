const express = require('express')
const router = express.Router()

var multer  = require('multer')
var { upload_Event } = require("../middleware/multer");


// Database
const EventController = require ('../controllers/event')

//Get all events
router.get('/', EventController.event_get_all)

//Create a event
router.post('/', upload_Event.single("image"), EventController.event_create_event)

//Get an event by ID
router.get('/:eventID', EventController.event_get_event)

//Update an event by ID
router.patch('/:eventID', upload_Event.single("image"),  EventController.event_update_event)

//Delete an event by ID
router.delete('/:eventID', EventController.event_delete_event)

//Get users by event ID
router.get('/:eventID/users', EventController.event_get_users)

module.exports = router