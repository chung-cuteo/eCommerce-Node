const app = require("./src/app");

const server = app.listen(process.env.APP_PORT, () => {
  console.log(`running eCommerce -- with ${process.env.APP_PORT}`);
});

// process.on("SIGINT", () => {
//   server.close(() => console.log("Exit server"));
//   // notify.send() // report for team
// });
