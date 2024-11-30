const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const citySchema = new Schema(
    {
        city_name: { type: String, required: true, trim: true },
    }
);


const City = mongoose.model("City", citySchema); // Model name is 'City', collection will be 'cities'
module.exports = City;
