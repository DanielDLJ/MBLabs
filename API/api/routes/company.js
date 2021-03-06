const express = require('express')
const router = express.Router()

var multer  = require('multer')
var { upload_Company } = require("../middleware/multer");


// Database
const CompanyController = require ('../controllers/company')

//Get all companys
router.get('/', CompanyController.company_get_all)

//Create a company account
router.post('/', upload_Company.none(), CompanyController.company_create_company)

//Get an account by CNPJ
router.get('/:companyCNPJ', CompanyController.company_get_company)

//Update an account by CNPJ
router.patch('/:companyCNPJ', upload_Company.single("image"),  CompanyController.company_update_company)

//Delete an account by CNPJ
router.delete('/:companyCNPJ', CompanyController.company_delete_company)


module.exports = router