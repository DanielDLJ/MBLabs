const express = require('express')
const router = express.Router()

var multer  = require('multer')
var { upload_User } = require("../middleware/multer");

// Database
const UserController = require ('../controllers/users')

//Get all Users
router.get('/', UserController.users_get_all)

//Create a user account
router.post('/', upload_User.none(), UserController.users_create_users)

//Get an account by CPF
router.get('/:userCPF', UserController.users_get_users)

//Update an account by CPF
router.patch('/:userCPF', upload_User.single("image"),  UserController.users_update_users)

//Delete an account by CPF
router.delete('/:userCPF', UserController.users_delete_users)


/**
 * User Event
 */

//Get events by user
router.get('/:userCPF/event', UserController.users_get_events)

//User buy event
router.post('/:userCPF/buyEvent', UserController.users_buy_event)

//User desist event
router.post('/:userCPF/desistEvent', UserController.users_desist_event)

module.exports = router