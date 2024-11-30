const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema({
    userName: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    cities: [{ type: String }]
});

const userDetailSchema = mongoose.model("weatherUsers", userSchema);
module.exports = userDetailSchema;

