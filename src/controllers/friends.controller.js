const db = require("../config/database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

exports.sendFriend = async (req, res) => {
  const dados = req.body;

  try {
    const rows1 = await db.query(
      `INSERT INTO FRIENDS(
        username, friend
      )
      VALUES('${dados.to}','${dados.from}')`
    );
    res.status(201).send({
      message: "Amigo adicionado com sucesso!",
      body: {
        data: rows1,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.getFriends = async (req, res) => {
  const username = req.params.username;

  try {
    const rows1 = await db.query(
      `SELECT * FROM friends
      WHERE username='${username}' OR friend='${username}'`
    );

    res.status(200).send({
      body: {
        data: rows1.rows,
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deleteFriends = async (req, res, next) => {
  const username = req.params.username;

  try {
    const rows1 = await db.query(
      `DELETE FROM friends
      WHERE username='${username}' OR friend='${username}'`
    );

    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};
