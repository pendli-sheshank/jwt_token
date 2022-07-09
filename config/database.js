const mongoose = require("mongoose");
const { MONGO_URI } = process.env;
exports.connet = () => {
  //connecting database
  mongoose
    .connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log("Successfully connected");
    })
    .catch((err) => {
      console.log("database connection has failed");
      console.log(err);
      process.exit(1);
    });
};
