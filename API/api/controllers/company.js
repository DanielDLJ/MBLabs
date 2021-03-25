// Database
const Op = require('sequelize').Sequelize.Op;
const Company = require('../models/Company');


const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

exports.company_get_all = (req, res, next) => {
    Company.findAll({
        order: [
            ['name', 'ASC']
        ]
    })
    .then(company => res.status(200).json({ status: 1, data: company }))
    .catch(async error => {
        let err =  await generic_error(error,1)
        next(err);
    })
};

exports.company_create_company = async (req, res, next) => {
    let { cnpj, name, password, email, cep, address, number, complement, district, city, state, celular, image } = req.body

    console.log("************Data************")
    console.log(req.body)

    if (!cnpj || !name || !password || !email) {
        let err = new Error('Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário.');
        err.status = 406;
        err.code = 1
        next(err);
    } else {
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        var db = require('../config/database').sequelize;
        await Company.create(req.body)
        .then(async createdCompany =>{ 
            await Company.findByPk(cnpj)
            .then(company => {
                res.status(200).json({status: 1, data: company? company : {}})
            })
            .catch(async error => {
                let err =  await generic_error(error,2)
                next(err);
            })
        })
        .catch(async error => {
            let err =  await generic_error(error,5)
            if(error && error.original && error.original.errno === 1062){//ER_DUP_ENTRY
                err.status = 409;
                if(error.original.sqlMessage?.includes('email_company')){
                    err.code = 3
                    err.message = "Email já está em uso!"
                }
                if(error.original.sqlMessage?.includes('PRIMARY')){
                    err.code = 4
                    err.message = "CNPJ já está em uso!"
                }
            } 
            next(err);
        })
        
    }
};

exports.company_get_company = (req, res, next) => {
    const cnpj = req.params.companyCNPJ
    Company.findByPk(cnpj)
    .then(company => {
        res.status(200).json({status: 1, data: company ? company : {}})
    })
    .catch(async error => {
        let err =  await generic_error(error,1)
        next(err);
    })
};

exports.company_update_company = async (req, res, next) => {
    const companyCNPJ = req.params.companyCNPJ
    let { cnpj, name, password, email, birthday, cep, address, number, complement, district, city, state, celular, image } = req.body
    console.log("Update an account by cnpj = " + companyCNPJ);
    console.log("req.body", req.body);

    if (password != undefined) req.body.password = bcrypt.hashSync(req.body.password, salt);

    if (cnpj) {
        let err = new Error('Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário.');
        err.status = 406;
        err.code = 1;
        next(err);
        return
    }

    const company = await Company.findOne({ where: { cnpj: companyCNPJ } });
    if (!company) {
        let err = new Error('Empresa não existe!');
        err.status = 404;
        err.code = 2;
        next(err);
        return;
    }

    await Company.update(req.body, {
        where: {
            cnpj: companyCNPJ
        }
    })
    .then(async updatedCompany => {
        await Company.findByPk(companyCNPJ)
            .then(company => {
                res.status(200).json({status: 1, data: company? company : {}})
            })
            .catch(async error => {
                let err =  await generic_error(error,3)
                next(err);
            })
    })
    .catch(async error => {
        let err =  await generic_error(error,5)
        if(error && 
            error.original && 
            error.original.errno === 1062 &&
            error.original.sqlMessage?.includes('email_company')){ //ER_DUP_ENTRY 
                err.status = 409;
                err.code = 4
                err.message = "Email já está em uso!"
        }
        next(err);
    })
};

exports.company_delete_company = async (req, res, next) => {
    const cnpj = req.params.companyCNPJ
    let { disabled } = req.body
    try {
        const company = await Company.findOne({ where: { cnpj } });
        if (!company) {
            let err = new Error('Empresa não existe!');
            err.status = 404;
            err.code = 1
            next(err);
            return;
        }
        await Company.update({disabled: disabled !== undefined ? disabled : 1}, {
            where: {
                cnpj: cnpj
            }
        })

        await Company.findByPk(cnpj)
        .then(company => {
            res.status(200).json({status: 1, data: company? company : {}})
        })
        .catch(async error => {
            let err =  await generic_error(error,2)
            next(err);
        })


    } catch (error) {
        let err =  await generic_error(error,3)
        err.status = 406;
        next(err);
    }
};

async function generic_error(error, code) {
    console.log("generic_error", error)
    let err = new Error('');
    err.code = code
    if (error && error.original) {
        if(error.original.sqlMessage) err.message = error.original.sqlMessage
        else if (error.original.errno === -4078 ) err.message = "Database Connection"
        else err.message = error.original;
    }else {
        err.message = error
    }
    err.status = 500;
    return err
}