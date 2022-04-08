const mongoose = require("mongoose");
const config = require("./config");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(config.MONGO_URL)
      .then(() => {
        console.log("db connect is successful");
      })
      .catch((err) => {
        console.log("db connect with err" + err);
      });
  }
}

module.exports = new Database();
