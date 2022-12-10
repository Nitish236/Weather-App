const { json } = require("body-parser");
const express = require("express");
const https = require("https");
const bodyParser = require("body-parser");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req,res) => {
     
    res.render("data", { cityName: "City name", Temperature: "17.1", Description: "fog", Pressure: "900", Humidity: "50", seaLevel: "800", Image: "images/sample.png"});
});

app.post("/", (req,res) => {
   
    var cname = req.body.cityName ;
    const city = cname.charAt(0).toUpperCase() + cname.slice(1) ;
    const apikey = "c1a60aefecb1efe6a3ffec64138f8257";
    const unit = "metric";
    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + city +"&units="+ unit + "&appid=" + apikey ;
    https.get(url, (response) => {
      console.log(response.statusCode);

      if( response.statusCode === 200)
      {
        response.on("data", (data) => {
            const weather_data = JSON.parse(data) ;
  
            const temp = weather_data.main.temp ;
            const description = weather_data.weather[0].description ;
            const pressure = weather_data.main.pressure ;
            const humidity = weather_data.main.humidity ;
            const sealevel = weather_data.main.sea_level ;
  
            const icon = weather_data.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/"+ icon +"@2x.png" ;
  
            
            res.render("data", { cityName: city, Temperature: temp, Description: description, Pressure: pressure, Humidity: humidity, seaLevel: sealevel, Image: imageURL })
        
        });
      }
      else{
            res.render("error", { Error: response.statusCode, Message: "City not found" });
        } 
      
    });
});





app.listen(4000, function(){
    console.log("Server is running on port 4000")
});