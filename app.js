//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const https = require("https");

const homeStartingContent = "This is the home starting content.";
const aboutContent = "This is the about content.";
const contactContent = "Contact content.  Contact content.  Contact content.  Contact content.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

let posts = [];

app.get("/", function(req, res){
  res.render("home", {
    startingContent: homeStartingContent,
    posts: posts
    });
});

app.get("/about", function(req, res){
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contactContent: contactContent});
});


app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = {
    title: req.body.postTitle,
    content: req.body.postBody
  };

  posts.push(post);

  res.redirect("/");

});

//WEATHER WEATHER WEATHER
app.get("/weather", function(req, res) {
  res.render("weather");
});

//invoked after hitting weather in home page or by /weather
app.post("/weather", function(req, res) {

 // takes in the city from the html form, display in // console. Takes in as string, ex. for kahului
        var city = String(req.body.cityInput);;
        console.log(req.body.cityInput);
            const units = "imperial";
            const apiKey = "29287f9bdce281a4c0ea5ddf3e3feff3";
            const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +  "&units=" + units + "&APPID=" + apiKey;

        // this gets the data from Open WeatherPI
        https.get(url, function(response){
            console.log(response.statusCode);

            // gets individual items from Open Weather API
            response.on("data", function(data){
                const weatherData = JSON.parse(data);
                const temp = weatherData.main.temp;
                const city = weatherData.name;
                const weatherDescription = weatherData.weather[0].description;
                const humidity = weatherData.main.humidity
                // displays city name
                res.write("<h1>" + city + "<h1>")
                //for description
                res.write("<h2> The weather is " + weatherDescription + "<h2>");
                //for temp
                res.write("<h2>The Temperature is " + temp + " Degrees Fahrenheit<h2>");
                //for humidity
                res.write("<h2>Humidity is " + humidity + "%");
                      
            });
        });
    });


app.get("/posts/:postName", function(req, res){
  const requestedTitle = _.lowerCase(req.params.postName);

  posts.forEach(function(post){
    const storedTitle = _.lowerCase(post.title);

    if (storedTitle === requestedTitle) {
      res.render("post", {
        title: post.title,
        content: post.content
      });
    }
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
