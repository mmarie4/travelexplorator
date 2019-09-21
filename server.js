
const express = require('express')
const request = require('request');

const app = express();

var places = {
    southAmerica: ["Brazil", "Argentina", "Chile", "Peru", "Colombia", "Bolivia"],
    asia: ["China", "Japan", "Korea", "Singapore", "Malaysia", "HongKong", "Vietnam"],
    europe: ["France", "Spain", "Portugal", "England", "Germany", "Sweden", "Hungary"],
    northAmerica: ["USA", "Canada", "Mexico"],
    africa: ["Kenya", "Tunisia", "Egypt", "SouthAfrica", "Morocco"],
    oceania: ["Australia", "NewZealand", "NewCaledonia"]
}

// Function to shuffle an array
function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

// Function to scrap instagram to get pictures using a countryName + 'travel' as a hashtag
// Fill the array countriesData by adding a new country and its pictures
// Send an Object : { region : regionName, countries : [ { country1 : [ pic1, pic2, ... ] }, { country2 : [ pic1, pic2, ...] } ] }
var scrapCountry = function(countryName, regionData, limit, clientResponse) {
    console.log("Getting images for", countryName, "...");
    var url = "https://instagram.com/explore/tags/" + countryName + "travel";
    request(url, {json: true}, (err, res, body) => {
        list = JSON.stringify(res).match(/https?:\/\/scontent[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/g);
        shuffle(list);
        console.log(list.length, "images scrapped for", countryName);
        regionData.countries.push({
            country: countryName,
            pictures: list
        });
        
        // Send to client if all countries of the region have been scrapped and added to the array
        if(regionData.countries.length >= limit) {
            clientResponse.send(regionData);
        }
    })
}

// Function to request instagram and scrap the images for a hashtag
var scrapRegion = function(regionName, clientResponse) {
    var countriesNames = places[regionName];
    if(countriesNames != undefined) {
        var regionData = { region: regionName, countries: [] };
        for (var i = 0; i < countriesNames.length; i++) {
            country = countriesNames[i];
            if (countriesNames != undefined) scrapCountry(country, regionData, countriesNames.length, clientResponse);
        }
    }
}

// Serve static folder
app.use(express.static('public'));


app.get('/', function (req, res) {
    
})

app.get('/:region', function (req, res) {
    scrapRegion(req.params.region, res);
})

app.listen(3000, function () {
  console.log('listening on port 3000...')
})

