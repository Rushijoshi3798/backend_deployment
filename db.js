const mongoose = require("mongoose");
require("dotenv").config()

const connection = mongoose.connect(process.env.mongoURL)

module.exports = {
    connection
}

// https://uninterested-boot-dove.cyclic.app/  ==> deplyoed backend app