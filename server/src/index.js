const port = 8080;
const app = require("./app-config");
const { startActionsPool, stopActionsPool } = require("./pool");
require("./db-config");

app.listen(port, () => {
  console.log(`Serveur Express en cours d'exécution sur le port ${port}`);
  startActionsPool();
});
