require("dotenv").config();
const express = require("express");
const https = require("https");
const _ = require("lodash");

const app = express();

process.env.API_KEY
app.use(express.urlencoded({ extended: true }));// parse data from browser

app.use(express.static("public"));//add static files 

app.set("view engine", "ejs");// template creation

app.get('/', (req, res) => {
    res.render('index');
});


app.post("/", function (req, res) {

    //   API Data request from external server
    process.env.API_KEY;
    let query = _.startCase(req.body.city);
    let unit = "metric"
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.API_KEY}&units=${unit}`;

    //HTTPS to GET data from external server
    https.get(url, function (response) {
        console.log("statusCode:", response.statusCode);

        let returnedData = "";
        response.on("data", function (data) {
            returnedData += data;
        });

        console.log(query);
        response.on("end", function () {
            let weatherData = JSON.parse(returnedData);

            let temp = weatherData.main.temp;
            let icon = weatherData.weather[0].icon;
            let imageURL = `http://openweathermap.org/img/wn/${icon}@2x.png`;
            let country = weatherData.sys.country;
            let feelsLike = weatherData.main.feels_like;
            let weatherDescription = _.startCase(weatherData.weather[0].description)
            res.render("weather", { city: query, Country: country, Temp: temp, Image: imageURL, Feels: feelsLike, Description: weatherDescription })
        })
    });
})

//heroku listening port
let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("The server is running!");
})

