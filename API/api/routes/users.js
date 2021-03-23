const express = require('express')
const router = express.Router()

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

// Database
const UserController = require ('../controllers/users')

//Get all Users
router.get('/', UserController.users_get_all)

//Create a user account
router.post('/', upload.none(), UserController.users_create_users)

//Get an account by CPF
router.get('/:userCPF', UserController.users_get_users)

//Update an account by CPF
router.patch('/:userCPF', upload.none(),  UserController.users_update_users)

//Delete an account by CPF
router.delete('/:userCPF', UserController.users_delete_users)


module.exports = router