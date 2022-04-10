const mongoose = require("mongoose");

class Database {
  constructor() {
    this.connect();
  }

  connect() {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => {
        console.log("db connect is successful");
      })
      .catch((err) => {
        console.log("db connect with err" + err);
      });
  }
}

module.exports = new Database();
