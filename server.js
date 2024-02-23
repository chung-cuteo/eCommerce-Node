const app = require("./src/app");

const POST = 3055;

const server = app.listen(POST, () => {
  console.log(`running eCommerce with ${POST}`);
});

process.on("SIGINT", () => {
  server.close(() => console.log("Exit server"));
});
