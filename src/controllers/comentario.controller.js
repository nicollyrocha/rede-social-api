const db = require("../config/database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

exports.createComentario = async (req, res) => {
  try {
    const dados = req.body;
    const { rows } = await db.query(
      `INSERT INTO comentarios (username, comentario, idpubli) VALUES ('${dados.username}','${dados.comentario}', ${dados.idPubli})`
    );

    res.status(201).send({
      message: "Comentário criado com sucesso!",
      body: {
        usuário: { username: dados.username, comentario: dados.comentario },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.getPubliComents = async (req, res) => {
  try {
    const idPubli = req.params.idPubli;
    const publis = await db.query(
      `SELECT * FROM COMENTARIOS WHERE IDPUBLI=${idPubli}`
    );

    res.status(200).send({
      status: "Success!",
      dados: publis.rows,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err,
    });
  }
};
exports.deleteComentario = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await db.query(`DELETE FROM COMENTARIOS WHERE IDPUBLI=${id}`);
    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deleteComentarios = async (req, res, next) => {
  try {
    const username = req.params.username;
    const rows = await db.query(
      `DELETE FROM COMENTARIOS WHERE USERNAME='${username}'`
    );
    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};
