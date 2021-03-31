// Database
const Op = require("sequelize").Sequelize.Op;
const User = require("../models/User");
const Event = require("../models/Event");
const EventUser = require("../models/EventUser");
const Category = require("../models/Category");

const _ = require("lodash");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);

exports.users_get_all = (req, res, next) => {
  User.findAll({
    order: [["name", "ASC"]],
  })
    .then((user) => res.status(200).json({ status: 1, data: user }))
    .catch(async (error) => {
      let err = await generic_error(error, 1);
      next(err);
    });
};

exports.users_create_users = async (req, res, next) => {
  let {
    cpf,
    name,
    password,
    birthday,
    email,
    cep,
    address,
    number,
    complement,
    district,
    city,
    state,
    celular,
    image,
  } = req.body;

  console.log("************Data************");
  console.log(req.body);

  if (!cpf || !name || !password || !birthday || !email) {
    let err = new Error(
      "Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário."
    );
    err.status = 406;
    err.code = 1;
    next(err);
  } else {
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    var db = require("../config/database").sequelize;
    await User.create(req.body)
      .then(async (createdUser) => {
        await User.findByPk(cpf)
          .then((user) => {
            res.status(200).json({ status: 1, data: user ? user : {} });
          })
          .catch(async (error) => {
            let err = await generic_error(error, 2);
            next(err);
          });
      })
      .catch(async (error) => {
        let err = await generic_error(error, 5);
        if (error && error.original && error.original.errno === 1062) {
          //ER_DUP_ENTRY
          err.status = 409;
          if (error.original.sqlMessage?.includes("email_user")) {
            err.code = 3;
            err.message = "Email já está em uso!";
          }
          if (error.original.sqlMessage?.includes("PRIMARY")) {
            err.code = 4;
            err.message = "CPF já está em uso!";
          }
        }
        next(err);
      });
  }
};

exports.users_get_users = (req, res, next) => {
  const cpf = req.params.userCPF;
  User.findByPk(cpf)
    .then((user) => {
      res.status(200).json({ status: 1, data: user ? user : {} });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 1);
      next(err);
    });
};

exports.users_update_users = async (req, res, next) => {
  const userCPF = req.params.userCPF;
  let {
    cpf,
    name,
    password,
    birthday,
    email,
    cep,
    address,
    number,
    complement,
    district,
    city,
    state,
    celular,
    image,
  } = req.body;
  console.log("Update an account by cpf = " + userCPF);
  console.log("req.body", req.body);

  if (password != undefined)
    req.body.password = bcrypt.hashSync(req.body.password, salt);

  var newFileName = "";
  if (req.file != undefined) {
    console.log(req.file);
    req.body.image = req.file.path;
  }

  if (cpf) {
    let err = new Error(
      "Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário."
    );
    err.status = 406;
    err.code = 1;
    next(err);
    return;
  }

  const user = await User.findOne({ where: { cpf: userCPF } });
  if (!user) {
    let err = new Error("Usuário não existe!");
    err.status = 404;
    err.code = 2;
    next(err);
    return;
  }

  if (user.image != "" && req.body.image) {
    try {
      fs.unlinkSync(user.image);
      console.log("successfully deleted " + user.image);
    } catch (err) {
      console.log("err deleted", err);
    }
  }

  await User.update(req.body, {
    where: {
      cpf: userCPF,
    },
  })
    .then(async (updatedUser) => {
      await User.findByPk(userCPF)
        .then((user) => {
          res.status(200).json({ status: 1, data: user ? user : {} });
        })
        .catch(async (error) => {
          let err = await generic_error(error, 3);
          next(err);
        });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 5);
      if (
        error &&
        error.original &&
        error.original.errno === 1062 &&
        error.original.sqlMessage?.includes("email_user")
      ) {
        //ER_DUP_ENTRY
        err.status = 409;
        err.code = 4;
        err.message = "Email já está em uso!";
      }
      next(err);
    });
};

exports.users_delete_users = async (req, res, next) => {
  const cpf = req.params.userCPF;
  let { disabled } = req.body;
  try {
    const user = await User.findOne({ where: { cpf } });
    if (!user) {
      let err = new Error("Usuário não existe!");
      err.status = 404;
      err.code = 1;
      next(err);
      return;
    }
    await User.update(
      { disabled: disabled !== undefined ? disabled : 1 },
      {
        where: {
          cpf: cpf,
        },
      }
    );

    await User.findByPk(cpf)
      .then((user) => {
        res.status(200).json({ status: 1, data: user ? user : {} });
      })
      .catch(async (error) => {
        let err = await generic_error(error, 2);
        next(err);
      });
  } catch (error) {
    let err = await generic_error(error, 3);
    err.status = 406;
    next(err);
  }
};

exports.users_get_events = async (req, res, next) => {
  const cpf = req.params.userCPF;
  Event.findAll({
    where: {},
    include: [
      {
        model: Category,
        attributes: ["name"],
      },
      {
        model: EventUser,
        attributes: ["cpf_user", "quantity"],
        where: { cpf_user: cpf },
        required: true,
      },
    ],
  })
    .then((events) => {
      let aux = _.chain(events)
        .groupBy("category.name")
        .map((value, key) => ({ category: key, events: value }))
        .value();
      res.status(200).json({ status: 1, data: aux });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 1);
      next(err);
    });
};

exports.users_buy_event = async (req, res, next) => {
  const cpf = req.params.userCPF;
  let { idEvent, quantity } = req.body;
  EventUser.create({ cpf_user: cpf, id_event: idEvent, quantity })
    .then((create) => {
      Event.findByPk(idEvent, {
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: EventUser,
            attributes: ["cpf_user", "quantity"],
            where: { cpf_user: cpf },
            required: true,
          },
        ],
      })
        .then((event) => {
          res.status(200).json({ status: 1, data: event ? event : {} });
        })
        .catch(async (error) => {
          let err = await generic_error(error, 1);
          next(err);
        });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 3);
      if (error && error.original && error.original.errno === 1062) {
        //ER_DUP_ENTRY
        err.status = 409;
        if (error.original.sqlMessage?.includes("PRIMARY")) {
          err.code = 2;
          err.message = "Usuário já comprou esse evento!";
        }
      }
      next(err);
    });
};

exports.users_desist_event = async (req, res, next) => {
  const cpf = req.params.userCPF;
  let { idEvent, quantity } = req.body;

  EventUser.destroy({
    where: {
      cpf_user: cpf,
      id_event: idEvent,
    }
  })
    .then((events) => {
      Event.findByPk(idEvent, {
        include: [
          {
            model: Category,
            attributes: ["name"],
          },
          {
            model: EventUser,
            attributes: ["cpf_user", "quantity"],
            where: { cpf_user: cpf },
            required: false,
          },
        ],
      })
        .then((event) => {
          res.status(200).json({ status: 1, data: event ? event : {} });
        })
        .catch(async (error) => {
          let err = await generic_error(error, 1);
          next(err);
        });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 2);
      next(err);
    });
};

async function generic_error(error, code) {
  console.log("generic_error", error);
  let err = new Error("");
  err.code = code;
  if (error && error.original) {
    if (error.original.sqlMessage) err.message = error.original.sqlMessage;
    else if (error.original.errno === -4078)
      err.message = "Database Connection";
    else err.message = error.original;
  } else {
    err.message = error;
  }
  err.status = 500;
  return err;
}
