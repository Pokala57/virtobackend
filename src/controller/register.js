const express = require("express")
const User = require('../schemas/userDetailSchema');
const countryDetails = require('../schemas/country');
const bodyparser = require("body-parser")
const axios = require("axios");
const { default: mongoose } = require("mongoose");
const router = express.Router();
router.use(bodyparser.json());



router.get('/getCities', async (req, res) => {
    try {
        const getCities = await countryDetails.aggregate([
            {
                $project: {
                    _id: 0,
                    city_id: "$_id",
                    city_name: "$city_name",
                }
            }
        ]);

        return res.status(200).json(getCities);
    }
    catch (e) {
        // Handle errors gracefully
        console.error("Error fetching weather data:", e.message);
        return res.status(500).json({ error: "Unable to fetch weather data" });
    }
});


router.post("/login", async (req, res) => {
    try {
        const { userName, password } = req.body;

        const findUser = await User.findOne({ userName: userName });

        if (!findUser) {
            return res.status(200).send({
                code: 400,
                message: "Invalid username. Please try again."
            });
        };

        const userPswd = findUser?.password || "";

        if (userPswd !== password) {
            return res.status(200).send({
                code: 400,
                message: "Invalid password. Please try again."
            });
        };


        const _id = findUser?._id;
        const cities = findUser?.cities || [];

        return res.status(200).send({
            code: 200,
            message: "User logged in successfully.",
            data: cities
        });
    }
    catch (e) {
        return res.status(400).send({
            code: 400,
            message: e.message
        })
    }
});


router.put("/updateUser", async (req, res) => {
    try {
        const { userName, cities } = req.body;

        if (!cities.length) {
            return res.status(200).send({
                code: 200,
                message: "cities array must be atleast length one."
            });    
        };

        const findUser = await User.updateOne(
            { userName: userName },
            { $set: { cities: cities } }
        );


        return res.status(200).send({
            code: 200,
            message: "User updated successfully.",
            data: findUser
        });
    }
    catch (e) {
        return res.status(400).send({
            code: 400,
            message: e.message
        })
    }
});


router.post('/city-weather', async (req, res) => {
    try {
        const { userName } = req.body;

        const findUser = await User.findOne({ userName: userName });

        const cities = findUser?.cities || [];

        console.log(cities);

        if (!cities.length) {
            return res.status(400).json({ error: "No cities provided." });
        };

        const weatherData = await Promise.all(
            cities.map(async (city) => {
                const response = await axios.get(
                    `https://api.weatherapi.com/v1/current.json`,
                    {
                        params: {
                            key: "90c36d33f178468c85f141751242911",
                            q: city
                        }
                    }
                );

                const data = response.data.current;
                return {
                    city_name: city,
                    description_of_current_weather: data.condition.text,
                    image_of_current_weather: `https://${response.data.current.condition.icon}`,
                    current_temperature_in_C: data.temp_c,
                    current_humidity: data.humidity,
                    current_precipitation: data.precip_mm,
                };
            })
        );

        console.log("Weather Data:", weatherData);

        weatherData.forEach((data) => {
            console.log(`${data.city}: ${data.temperature}°C, ${data.condition}`);
        });

        // Send the weather data in JSON format
        return res.status(200).json({weatherData});
    } catch (e) {
        // Handle errors gracefully
        console.error("Error fetching weather data:", e.message);
        return res.status(500).json({ error: "Unable to fetch weather data" });
    }
});



module.exports = router;
