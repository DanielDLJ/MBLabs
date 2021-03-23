// Database
const Op = require('sequelize').Sequelize.Op;
const User = require('../models/User');


const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);

exports.users_get_all = (req, res, next) => {
    User.findAll({
        order: [
            ['name', 'ASC']
        ]
    })
    .then(user => res.status(200).json({ status: 1, data: user }))
    .catch(async error => {
        let err =  await generic_error(error,1)
        next(err);
    })
};

exports.users_create_users = async (req, res, next) => {
    let { cpf, name, password, birthday, cep, address, number, complement, district, city, state, celular, image } = req.body

    console.log("************Data************")
    console.log(req.body)

    if (!cpf || !name || !password || !birthday ) {
        let err = new Error('Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário.');
        err.status = 406;
        err.code = 1
        next(err);
    } else {
        req.body.password = bcrypt.hashSync(req.body.password, salt);
        var db = require('../config/database').sequelize;
        await User.create(req.body)
        .then(async createdUser =>{ 
            await User.findByPk(cpf)
            .then(user => {
                res.status(200).json({status: 1, data: user? user : {}})
            })
            .catch(async error => {
                let err =  await generic_error(error,2)
                next(err);
            })
        })
        .catch(async error => {
            let err =  await generic_error(error,3)
            next(err);
        })
        
    }
};

exports.users_get_users = (req, res, next) => {
    const cpf = req.params.userCPF
    User.findByPk(cpf)
    .then(user => {
        res.status(200).json({status: 1, data: user ? user : {}})
    })
    .catch(async error => {
        let err =  await generic_error(error,1)
        next(err);
    })
};

exports.users_update_users = async (req, res, next) => {
    const userCPF = req.params.userCPF
    let { cpf, name, password, birthday, cep, address, number, complement, district, city, state, celular, image } = req.body
    console.log("Update an account by cpf = " + cpf);
    console.log("req.body", req.body);

    if (password != undefined) req.body.password = bcrypt.hashSync(req.body.password, salt);

    if (cpf) {
        let err = new Error('Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário.');
        err.status = 406;
        err.code = 1;
        next(err);
        return
    }

    const user = await User.findOne({ where: { cpf: userCPF } });
    if (!user) {
        let err = new Error('Usuário não existe!');
        err.status = 404;
        err.code = 2;
        next(err);
        return;
    }

    await User.update(req.body, {
        where: {
            cpf: userCPF
        }
    })
    .then(async updatedUser => {
        await User.findByPk(userCPF)
            .then(user => {
                res.status(200).json({status: 1, data: user? user : {}})
            })
            .catch(async error => {
                let err =  await generic_error(error,3)
                next(err);
            })
    })
    .catch(async error => {
        let err =  await generic_error(error,4)
        next(err);
    })
};

exports.users_delete_users = async (req, res, next) => {
    const cpf = req.params.userCPF
    let { disabled } = req.body
    try {
        const user = await User.findOne({ where: { cpf } });
        if (!user) {
            let err = new Error('Usuário não existe!');
            err.status = 404;
            err.code = 1
            next(err);
            return;
        }
        await User.update({disabled: disabled !== undefined ? disabled : 1}, {
            where: {
                cpf: cpf
            }
        })

        await User.findByPk(cpf)
        .then(user => {
            res.status(200).json({status: 1, data: user? user : {}})
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