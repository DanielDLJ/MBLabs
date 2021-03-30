// Database
const { Op } = require("sequelize");
const Company = require("../models/Company");
const Event = require("../models/Event");
const EventUser = require("../models/EventUser");
const User = require("../models/User");
const Category = require("../models/Category");

const _ = require("lodash");
const bcrypt = require("bcryptjs");
const salt = bcrypt.genSaltSync(10);
const fs = require("fs");

exports.event_get_all = (req, res, next) => {
  const cnpj =
    req.query.cnpj == "" || req.query.cnpj == undefined ? "" : req.query.cnpj;

  var whereCondition = {};
  if (cnpj) whereCondition = { company_cnpj: cnpj };
  console.log("whereCondition", whereCondition);
  Event.findAll({
    where: { ...whereCondition, disabled: false },
    order: [["name", "ASC"]],
  })
    .then((events) => res.status(200).json({ status: 1, data: events }))
    .catch(async (error) => {
      let err = await generic_error(error, 1);
      next(err);
    });
};

exports.event_create_event = async (req, res, next) => {
  let {
    id,
    name,
    description,
    category_id,
    company_cnpj,
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

  if (id || !name || !description || !category_id || !company_cnpj) {
    console.log("error");
    let err = new Error(
      "Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário."
    );
    err.status = 406;
    err.code = 1;
    next(err);
  } else {
    var db = require("../config/database").sequelize;

    var newFileName = "";
    if (req.file != undefined) {
      console.log(req.file);
      req.body.image = req.file.path;
    }
    await Event.create(req.body)
      .then(async (createdEvent) => {
        await Event.findByPk(createdEvent.id)
          .then((event) => {
            res.status(200).json({ status: 1, data: event ? event : {} });
          })
          .catch(async (error) => {
            let err = await generic_error(error, 2);
            next(err);
          });
      })
      .catch(async (error) => {
        let err = await generic_error(error, 5);
        next(err);
      });
  }
};

exports.event_get_event = (req, res, next) => {
  const id = req.params.eventID;
  Event.findByPk(id)
    .then((event) => {
      res.status(200).json({ status: 1, data: event ? event : {} });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 1);
      next(err);
    });
};

exports.event_update_event = async (req, res, next) => {
  const id_Event = req.params.eventID;
  let {
    id,
    cnpj,
    name,
    description,
    category_id,
    company_cnpj,
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
  console.log("Update an account by id = " + id_Event);
  console.log("req.body", req.body);

  var newFileName = "";
  if (req.file != undefined) {
    console.log(req.file);
    req.body.image = req.file.path;
  }

  if (id) {
    let err = new Error(
      "Essa resposta é enviada quando o servidor da Web após realizar a negociação de conteúdo orientada pelo servidor, não encontra nenhum conteúdo seguindo os critérios fornecidos pelo agente do usuário."
    );
    err.status = 406;
    err.code = 1;
    next(err);
    return;
  }

  const event = await Event.findOne({ where: { id: id_Event } });
  if (!event) {
    let err = new Error("Evento não existe!");
    err.status = 404;
    err.code = 2;
    next(err);
    return;
  }

  if (event.image != "" && req.body.image) {
    try {
      fs.unlinkSync(event.image);
      console.log("successfully deleted " + company.image);
    } catch (err) {
      console.log("err deleted", err);
    }
  }

  await Event.update(req.body, {
    where: {
      id: id_Event,
    },
  })
    .then(async (updatedEvent) => {
      await Event.findByPk(id_Event)
        .then((event) => {
          res.status(200).json({ status: 1, data: event ? event : {} });
        })
        .catch(async (error) => {
          let err = await generic_error(error, 3);
          next(err);
        });
    })
    .catch(async (error) => {
      let err = await generic_error(error, 5);
      next(err);
    });
};

exports.event_delete_event = async (req, res, next) => {
  const id_Event = req.params.eventID;
  let { disabled } = req.body;
  try {
    const event = await Event.findOne({ where: { id: id_Event } });
    if (!event) {
      let err = new Error("Evento não existe!");
      err.status = 404;
      err.code = 1;
      next(err);
      return;
    }
    await Event.update(
      { disabled: disabled !== undefined ? disabled : 1 },
      {
        where: {
          id: id_Event,
        },
      }
    );

    await Event.findByPk(id_Event)
      .then((event) => {
        res.status(200).json({ status: 1, data: event ? event : {} });
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

exports.event_get_users = (req, res, next) => {
  const id_event = req.params.eventID;

  console.log("event_get_users", id_event);
  EventUser.findAll({
    where: { id_event: id_event },
    include: [
      {
        model: User,
        attributes: ["name"],
        order: [["name", "ASC"]],
      },
    ],
  })
    .then((users) => res.status(200).json({ status: 1, data: users }))
    .catch(async (error) => {
      let err = await generic_error(error, 1);
      next(err);
    });
};

exports.event_get_time_line = async (req, res, next) => {
  await Event.findAll({
    where: {},
    include: [{
        model: Category,
        attributes: ["name"],
      },
    ],
    raw:true,
  })
    .then((events) => {
      console.log("events", events);
      let aux = _.chain(events)
      .groupBy("category.name")
      .map((value, key) => ({ category: key, events: value }))
      .value();
      res.status(200).json({ status: 1, data: aux});
    })
    .catch(async (error) => {
      let err = await generic_error(error, 1);
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
