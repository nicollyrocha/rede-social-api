const db = require("../config/database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

exports.createPublicacao = async (req, res) => {
  const data = new Date();
  try {
    const dados = req.body;
    const { rows } = await db.query(
      `INSERT INTO publicacoes (username, texto, comentarios, likes) VALUES 
      ('${dados.username}','${dados.texto}', ${0},${0})`
    );

    res.status(201).send({
      message: "Publicação criada com sucesso!",
      body: {
        publi: { username: dados.username, publicacao: dados.publicacao },
      },
    });
  } catch (err) {
    return res.status(500).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getPublisFromUser = async (req, res) => {
  try {
    const username = req.params.username;
    const publis = await db.query(
      `SELECT * FROM PUBLICACOES WHERE USERNAME='${username}'
      ORDER BY DATA_PUBLI DESC`
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

exports.getPublisFromId = async (req, res) => {
  const ids = req.body;
  for (const id of ids) {
    try {
      const publis = await db.query(
        `SELECT * FROM PUBLICACOES WHERE id='${id.idpubli}'
      ORDER BY DATA_PUBLI DESC`
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
  }
};

exports.getNumberComments = async (req, res) => {
  try {
    const id = req.params.id;
    const comments = await db.query(
      `SELECT COUNT(COMENTARIOS) FROM COMENTARIOS WHERE IDPUBLI=${id}`
    );

    res.status(200).send({
      status: "Success!",
      dados: comments.rows,
    });
  } catch (err) {
    return res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.updateComment = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `UPDATE PUBLICACOES SET COMENTARIOS = COMENTARIOS + 1 WHERE ID=${id}`
    );
    res.status(201).send({
      message: "Alterado com sucesso!",
      body: {
        usuário: { id: id },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.updateLikes = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `UPDATE PUBLICACOES SET LIKES = LIKES + 1 WHERE ID=${id}`
    );
    res.status(201).send({
      message: "Alterado com sucesso!",
      body: {
        usuário: { id: id },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.updateLikeMais = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `UPDATE PUBLICACOES SET likes = likes + 1 WHERE ID=${id}`
    );
    res.status(201).send({
      message: "Alterado com sucesso!",
      body: {
        usuário: { id: id },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.updateLikeMenos = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query(
      `UPDATE PUBLICACOES SET likes = likes - 1 WHERE ID=${id}`
    );
    res.status(201).send({
      message: "Alterado com sucesso!",
      body: {
        usuário: { id: id },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deletePublicacao = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query(`DELETE FROM PUBLICACOES WHERE ID=${id}`);
    res.status(200).send({
      message: "Publicação deletada com sucesso!",
      body: {
        usuário: { id: id },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deletePublicacoes = async (req, res, next) => {
  try {
    const username = req.params.username;
    const rows = await db.query(
      `DELETE FROM PUBLICACOES WHERE username='${username}'`
    );
    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};
