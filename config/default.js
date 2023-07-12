const dotenv = require("dotenv");

dotenv.config({path: '.env.local'});

module.exports = {
  nodeEnv: process.env.NODE_ENV || "development",
};
