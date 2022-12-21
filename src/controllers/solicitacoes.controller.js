const db = require("../config/database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

exports.getSolicitacoes = async (req, res) => {
  try {
    const to = req.params.to;

    const rows = await db.query(
      `SELECT * FROM solicitacoes WHERE touser = '${to}' OR fromuser='${to}'`
    );

    res.status(200).json({
      status: "success",
      data: rows.rows,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.getFriends = async (req, res) => {
  try {
    const to = req.params.to;

    const rows = await db.query(
      `SELECT * FROM solicitacoes WHERE touser = '${to}' OR fromuser = '${to}' AND status='ACEITA'`
    );

    res.status(200).json({
      status: "success",
      data: rows.rows,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.sendSolicitacao = async (req, res) => {
  const from = req.params.from;
  const to = req.params.to;

  try {
    const rows1 = await db.query(
      `SELECT * FROM solicitacoes WHERE fromuser = '${from}' AND touser = '${to}'`
    );
    if (rows1.rows.length > 0) {
      return res.status(500).json({
        status: "fail",
        message: `Já existe uma solicitação para o usuário ${to}`,
      });
    } else {
      if (from === to) {
        return res.status(500).json({
          status: "fail",
          message: `Usuário não pode mandar solicitação para si mesmo.`,
        });
      } else {
        try {
          const { rows } = await db.query(
            `INSERT INTO solicitacoes (fromuser, touser, status) VALUES ('${from}','${to}', 'ENVIADO')`
          );

          res.status(200).send({
            message: "Solicitação enviada com sucesso!",
            body: {
              data: rows,
            },
          });
        } catch (e) {
          return res.status(500).json({
            status: "fail",
            message: e,
          });
        }
      }
    }
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.updateSolicitacao = async (req, res) => {
  try {
    const dados = req.body;
    const { rows } = await db.query(
      `UPDATE solicitacoes SET status='${dados.status}'
      WHERE fromuser = '${dados.from}'
      AND touser = '${dados.to}' `
    );

    res.status(200).send({
      message: "Solicitação alterada com sucesso!",
      body: {
        usuário: { username: dados.touser },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.deleteSolicitacoes = async (req, res, next) => {
  try {
    const username = req.params.username;
    const { rows } = await db.query(
      `DELETE FROM SOLICITACOES
      WHERE FROMUSER = '${username}'
      OR TOUSER = '${username}' `
    );

    next();
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};
