const db = require("../config/database");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());

exports.createUser = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const dados = req.body;
    const password_hash = await bcrypt.hash(dados.password, salt);
    const { rows } = await db.query(
      `INSERT INTO usuarios (nome, username, password) VALUES ('${dados.nome}','${dados.username}', '${password_hash}')`
    );

    res.status(201).send({
      message: "Usuário criado com sucesso!",
      body: {
        usuário: { username: dados.username },
      },
    });
  } catch (e) {
    if ((e.code = "23505")) {
      return res.status(500).json({
        status: "fail",
        message: "Usuário já existe",
      });
    } else {
      return res.status(500).json({
        status: "fail",
        message: e,
      });
    }
  }
};

exports.getSession = async (req, res, next) => {
  if (req.session.views) {
    // Increment the number of views.
    req.session.views++;

    // Session will expires after 1 min
    // of in activity
    res.write(
      "<p> Session expires after 1 min of in activity: " +
        req.session.cookie.expires +
        "</p>"
    );
    res.end();
  } else {
    req.session.views = 1;
    res.end(" New session is started");
  }
};

exports.login = async (req, res) => {
  try {
    const dados = req.body;
    const rows = await db.query(
      `SELECT * FROM usuarios WHERE username = '${dados.username}'`
    );
    if (rows.rows.length == 0) {
      return res.status(500).json({
        status: "fail",
        message: "Usuário não existe.",
      });
    } else {
      const verified = bcrypt.compareSync(
        dados.password,
        rows.rows[0].password
      );
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      const options = {
        expiresIn: "30s",
      };
      let data = {
        time: "1d",
        userId: rows.rows[0].id,
      };

      const token = jwt.sign(data, jwtSecretKey, { expiresIn: "30s" });

      app.use(require("cookie-parser")(process.env.JWT_SECRET_KEY)); // header
      if (!rows.rows || verified === false) {
        return res.status(500).json({
          status: "fail",
          message: "Username ou senha inválidos.",
        });
      } else if (rows.rows.length > 0 && verified === true) {
        const userResponse = {
          username: rows.rows[0].username,
          id: rows.rows[0].id,
          nome: rows.rows[0].nome,
          foto: rows.rows[0].foto ? rows.rows[0].foto.toString("base64") : null,
        };

        res
          .cookie("access_token", token, {
            httpOnly: true,
          })
          .status(200)
          .json({
            status: "success",
            user: userResponse,
            token: token,
            id: rows.rows[0].id,
          });
      }
    }
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.logout = async (req, res) => {
  new Promise((resolve, reject) =>
    req.session.destroy((err) => {
      if (err) {
        reject(err);
      }
      res.clearCookie();

      resolve();
    })
  );
};

exports.updateUser = async (req, res) => {
  try {
    const dados = req.body;
    const { rows } = await db.query(
      `UPDATE usuarios SET nome = '${dados.nome}', username = '${dados.username}', foto = 'bytea(${dados.foto})'
      WHERE id = '${dados.id}' `
    );

    res.status(201).send({
      message: "Usuário alterado com sucesso!",
      body: {
        usuário: { username: dados.username },
      },
    });
  } catch (e) {
    return res.status(500).json({
      status: "fail",
      message: e,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const id = req.params.id;
    const rows = await db.query(`SELECT * FROM usuarios WHERE id = '${id}'`);
    res.status(200).json({
      status: "success",
      user: rows.rows[0],
      id: rows.rows[0].id,
      foto: rows.rows[0].foto ? rows.rows[0].foto : null,
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const rows = await db.query(
      `SELECT * FROM usuarios WHERE username = '${username}'`
    );

    res.status(200).json({
      status: "success",
      data: rows.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.deleteConta = async (req, res) => {
  try {
    const username = req.params.username;
    const rows = await db.query(
      `DELETE FROM usuarios WHERE username = '${username}'`
    );

    res.status(200).json({
      status: "success",
      data: rows.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};

exports.updateSenha = async (req, res) => {
  const senhas = req.body;
  const salt = await bcrypt.genSalt(10);
  const dados = req.body;
  const password_hash = await bcrypt.hash(dados.nova, salt);
  try {
    const username = req.params.username;
    const rows = await db.query(
      `SELECT * FROM usuarios WHERE username = '${username}'`
    );

    const verified = bcrypt.compareSync(senhas.atual, rows.rows[0].password);
    if (verified === true) {
      try {
        const dados = req.body;
        const { rows } = await db.query(
          `UPDATE usuarios SET password = '${password_hash}'
      WHERE username = '${username}' `
        );

        res.status(201).send({
          message: "Senha alterada com sucesso!",
          body: {
            username,
          },
        });
      } catch (e) {
        return res.status(500).json({
          status: "fail",
          message: e,
        });
      }
    } else {
      res.status(500).json({
        status: "error",
        message: "Senha errada.",
      });
    }
    res.status(200).json({
      status: "success",
      data: rows.rows[0],
    });
  } catch (err) {
    res.status(500).json({
      status: "error",
      message: err,
    });
  }
};
