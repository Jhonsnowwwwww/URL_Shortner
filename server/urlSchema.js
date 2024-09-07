const mongoose = require("mongoose");

const URLSchema = new mongoose.Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortenUrl: {
        type: String,
        required: true,
    },

});

const Url = mongoose.model("Url", URLSchema);

module.exports =  Url;