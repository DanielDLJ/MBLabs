const sequelize = require('sequelize');
const bcrypt = require('bcryptjs');

const salt = bcrypt.genSaltSync(10);

// Database
const User = require('../models/User');
const Company = require('../models/Company');


exports.auth_login = async (req, res, next) => {
    let { cpf, cnpj , password } = req.body
    if ((!cpf && !cnpj) || (!!cpf && !!cnpj) || !password) {
        let err = new Error('Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário.');
        err.status = 406;
        err.code = 1
        next(err);
    } else {
        if(cpf !== undefined && cpf !== null ){
            await User.findOne({
                where: {
                    cpf: cpf
                },
            })
            .then(user => {
                if(user === null){
                    let err = new Error('Usuário não existe.');
                    err.status = 404;
                    err.code = 2;
                    next(err);
                    return
                }
                if (bcrypt.compareSync(password, user.password)) {
                    res.status(200).json({ status: 1, data: user })
                } else {
                    let err = new Error('Senha ou CPF errados.');
                    err.status = 401;
                    err.code = 3;
                    next(err);
                    return null;
                }
            })
            .catch(async error => {
                let err =  await generic_error(error,4)
                next(err);
            })
        }
        if(cnpj !== undefined && cnpj !== null ){
            await Company.findOne({
                where: {
                    cnpj: cnpj
                },
            })
            .then(company => {
                if(company === null){
                    let err = new Error('Empresa não existe.');
                    err.status = 404;
                    err.code = 2;
                    next(err);
                    return
                }
                if (bcrypt.compareSync(password, company.password)) {
                    res.status(200).json({ status: 1, data: company })
                } else {
                    let err = new Error('Senha ou CNPJ errados.');
                    err.status = 401;
                    err.code = 3;
                    next(err);
                    return null;
                }
            })
            .catch(async error => {
                let err =  await generic_error(error,4)
                next(err);
            })
        }
    }
};