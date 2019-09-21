// Global variables
var data_global = [];
var cursor_global = [];

// Handle a click on a continent
var handleClick = function(event) {
    var loadText = document.getElementById('load-text');
    continentName = event.target.id || event.srcElement.id;    
    // Assuming the server runs on the same PC, send AJAX request to get data
    const req = new XMLHttpRequest();
    req.onreadystatechange = function(event) {
        if (this.readyState === XMLHttpRequest.DONE) {
            if (this.status === 200) {
                loadText.style.display = 'none';
                // Set global data and cursor for each country
                data_global = JSON.parse(this.responseText).countries;
                for (var i = 0 ; i < data_global.length; i++) {
                    cursor_global[i] = 0;
                }
                displayAllPictures();
            } else {
                console.log(this.status, this.statusText);
            }
        }
    };
    req.open('GET', 'http://localhost:3000/' + continentName, true); 
    req.send();
    // Hide continents images
    var imgs = document.getElementsByClassName('continent-img');
    for(var i = 0; i < imgs.length; i++) {
        imgs[i].style.display = "none";
    }
    loadText.style.display = 'block';
}

// Display the pictures for each country, using the global variable data_global
var displayAllPictures = function() {
    var container = document.getElementById('countries-container');
    // Process response : display each country and its pictures
    document.getElementById("subtitle").innerHTML = getContinentName(continentName);
    document.getElementById("back-btn").style.display = "block";
    for (var i = 0; i < data_global.length; i++) {
        var countryBox = document.createElement("div");
        countryBox.className = 'country-box';
        countryBox.id = data_global[i].country;
        var countryTitle = document.createElement("div");
        countryTitle.className = 'country-title';
        countryBox.appendChild(countryTitle);
        countryTitle.innerHTML = data_global[i].country;
        // Add reload button
        var reload = document.createElement('img');
        reload.src = 'res/reload.png';
        reload.dataset.country = data_global[i].country;
        reload.className = 'reload-btn';
        reload.addEventListener('click', reloadPictures);
        countryBox.appendChild(reload);
        countryBox.appendChild(document.createElement('br'));
        // Add images
        addImages(countryBox, i);
        container.appendChild(countryBox);
    }
}

// Add 9 images to a countryBox
var addImages = function(countryBox, i) {
    var beginning = cursor_global[i];
    console.log('beginning:', beginning);
    for (var j = beginning; j < beginning+9; j++) {
        var img = document.createElement('img');
        img.className = 'country-img';
        img.onload = function() {
            if (this.width != this.height) {
                this.style.display = "none"; // discard non-squared pictures
            }
        }
        cursor_global[i] = cursor_global[i] < data_global[i].pictures.length ? cursor_global[i]+1 : 0;
        img.src = data_global[i].pictures[cursor_global[i]];
        console.log('cursor_global[i]', cursor_global[i]);
        countryBox.appendChild(img);
    }
}

// Update pictures for one country
var reloadPictures = function(event) {
    var countryName = event.target.dataset.country || event.srcElement.dataset.country;  
    for(var i = 0; i < data_global.length; i++ ){
        if(data_global[i].country == countryName) {
            // Remove pictures for this country
            var countryBox = document.getElementById(countryName);
            var imgs = countryBox.getElementsByClassName('country-img');
            var numberOfImages = imgs.length;
            for(var j = 0; j < numberOfImages; j++ ){
                countryBox.removeChild(imgs[0]);
            }
            // Add new pictures
            addImages(countryBox, i);
        }
    }
}

// Handle click on back button
var handleBack = function(event) {
    document.getElementById('subtitle').innerHTML = "Which region do you want to explore ?";
    document.getElementById("back-btn").style.display = "none";
    // Empty the countries container
    var container = document.getElementById('countries-container');
    while(container.firstChild) {
        container.removeChild(container.firstChild);
    }
    // Display continents images
    var imgs = document.getElementsByClassName('continent-img');
    for(var i = 0; i < imgs.length; i++) {
        imgs[i].style.display = "inline-block";
    }
}

var getContinentName = function(name) {
    if (name == 'europe') return 'Europe';
    if (name == 'southAmerica') return 'South America';
    if (name == 'northAmerica') return 'North America';
    if (name == 'oceania') return 'Oceania';
    if (name == 'africa') return 'Africa';
    if (name == 'asia') return 'Asia';
}

// Add click listeners
var imgs = document.getElementsByClassName('continent-img');
for(var i = 0; i < imgs.length; i++) {
    imgs[i].addEventListener('click', handleClick);
}
document.getElementById('back-btn').addEventListener('click', handleBack);