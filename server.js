const app = require("./src/app");
const {
  app: { port },
} = require("./src/configs/config.app");

const server = app.listen(port, () => {
  console.log(`running eCommerce with ${port}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit server"));
//   // notify.send() // report for team
// });
