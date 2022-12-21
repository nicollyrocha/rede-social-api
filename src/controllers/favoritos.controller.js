const db = require("../config/database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

exports.createFavorite = async (req, res) => {
  try {
    const dados = req.body;
    const { rows } = await db.query(
      `INSERT INTO likes (username, idpubli) VALUES ('${dados.username}', ${dados.idPubli})`
    );

    res.status(201).send({
      message: "Favorito criado com sucesso!",
      body: {
        usuário: { username: dados.username, publi: dados.idPubli },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deleteFavorite = async (req, res) => {
  try {
    const username = req.params.username;
    const idPubli = req.params.idPubli;
    const { rows } = await db.query(
      `DELETE FROM likes
      WHERE username = '${username}'
      AND idpubli = '${idPubli}'`
    );

    res.status(200).send({
      message: "Favorito deletado com sucesso!",
      body: {
        usuário: { username: username, publi: idPubli },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.getLikes = async (req, res) => {
  try {
    const username = req.params.username;
    const { rows } = await db.query(
      `SELECT * FROM likes WHERE username = '${username}'`
    );

    res.status(200).send({
      body: rows,
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.getLikesFromIdPubli = async (req, res) => {
  try {
    const idPubli = req.params.idPubli;
    const { rows } = await db.query(
      `SELECT * FROM likes WHERE username = '${idPubli}'`
    );

    res.status(200).send({
      message: "Favorito criado com sucesso!",
      body: rows,
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deleteLike = async (req, res, next) => {
  try {
    const id = req.params.id;
    const rows = await db.query(`DELETE FROM LIKES WHERE IDPUBLI=${id}`);
    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deleteLikes = async (req, res, next) => {
  try {
    const username = req.params.username;
    const rows = await db.query(
      `DELETE FROM LIKES WHERE USERNAME='${username}'`
    );
    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};
