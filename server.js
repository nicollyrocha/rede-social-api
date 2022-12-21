const app = require("./src/app.js");

const port = process.env.PORT || 3030;
app.listen(port, () => {
  console.log("Aplicação executando na porta ", port);
});
