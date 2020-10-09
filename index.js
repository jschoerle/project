let postArea = document.getElementById('posts')


const apiKey = '18ebb74c4c845cd84cc98885effee0ae';


const cityList = [
{name: 'Amsterdam', text: 'The Amsterdam Canals in front of classic dutch houses.', country: 'The Netherlands', activity: 'Smoking', latlong:{lat: 52.379, lng: 4.899}},
{name: 'Berlin', text: 'The Berlin TV Tower overlooking the city.', city: 'Berlin', country: 'Germany', activity: 'Party', latlong:{lat: 52.520, lng: 13.404}},
{name: 'Paris', text: 'The Eifeltower glowing in the night.', city: 'Paris', country: 'France', activity: 'Culture', latlong:{lat: 48.864, lng: 2.349}},
{name: 'Prague', text: 'Striving through the Old Town of Prague.', city: 'Prague', country: 'Czech Republic', activity: 'Boat Rides', latlong:{lat: 50.073, lng: 14.418}}
];

const stringifiedCityList = JSON.stringify(cityList);

localStorage.setItem("cities", stringifiedCityList);

const getCities = () => {
    const cities = localStorage.getItem("cities");
    return JSON.parse(cities);
}


// map starts here
let map;
const places = [];
const markers = [];
const infoWindows = [];
const mapDiv = document.getElementById("map");
const logOutButton = document.getElementById("logOutButton");

function initMap() {
    map = new google.maps.Map(mapDiv, {
      center: { lat: 53.551, lng: 9.993 },
      zoom: 6,
    });
  
    map.addListener("click", () => {
      closeInfoWindows();
    });
  
    const createAllMarkers = () => {
        const cityList = getCities();
        cityList.forEach(x => {
            const marker = new google.maps.Marker({
                position: x.latlong,
                map: map,
                title: x.name
              });

            const html = createPopUp(x);

            const infoWindow = new google.maps.InfoWindow({
                content: html
              });

            infoWindows.push(infoWindow);

            marker.addListener("click", () => {
                infoWindow.open(map, marker);
                map.setZoom(8);
                map.setCenter(marker.getPosition());
              });
        
        })
    };

    createAllMarkers();

    const closeInfoWindows = () => {
        for (let i = 0; i < infoWindows.length; i++) {
          const infoWindow = infoWindows[i];
          infoWindow.close();
          map.setZoom(6);
        }
      };
  }
// map ends here


const fetchThis = (city) => {
  return  fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`)
        .then((response) => response.json())
        .then(response => {

            return response
            })
    };

const createPopUp = (city) => {
  const html = `
  <div class="max-w-sm w-full lg:max-w-full lg:flex">
  <div class="h-48 lg:h-auto lg:w-48 flex-none bg-cover rounded-t lg:rounded-t-none lg:rounded-l text-center overflow-hidden" style="background-image: url('${city.name}.jpg')" title="Woman holding a mug">
  </div>
  <div class="border-r border-b border-l border-gray-400 lg:border-l-0 lg:border-t lg:border-gray-400 bg-white rounded-b lg:rounded-b-none lg:rounded-r p-4 flex flex-col justify-between leading-normal">
    <div class="mb-8">
      <div class="text-gray-900 font-bold text-xl mb-2">${city.name} in ${city.country}</div>
      <p class="text-gray-700 text-base">${city.text}</p>
      <p class="text-gray-700 text-base">I am here for ${city.activity}.</p>

    </div>
    <div class="flex items-center">
      <img class="w-10 h-10 rounded-full mr-4" src="jakob.jpg" alt="Avatar of Jonathan Reinink">
      <div class="text-sm">
        <p class="text-gray-900 leading-none">Your lovely Author</p>
      </div>
    </div>
  </div>
</div>
  `
  return html
}

const createPost = (city, weather) => {
    const html = `
    <br>
    <div class="mx-auto content-center max-w-sm rounded overflow-hidden shadow-lg">
    <img class="w-full" src="${city.name}.jpg" alt="Sunset in the mountains">
    <div class="px-6 py-4">
      <div class="font-bold text-xl mb-2">${city.name}</div>
      <p class="text-gray-700 text-base">
      ${city.text}      
      </p> 
      <p class="text-gray-700 text-base">
      The current weather is: ${weather.weather[0].description}      
      </p>
      <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="Weather Icon">
      </div>
    <div class="px-6 pt-4 pb-2">
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#${city.name}</span>
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#${city.country}</span>
      <span class="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">#${city.activity}</span>
      <div class="flex items-center">
      <img class="w-10 h-10 rounded-full mr-4" src="jakob.jpg" alt="Jakob Schörle">
      <div class="text-sm">
        <p class="text-gray-900 leading-none">Jakob Schörle</p>
      </div>
      </div>
  </div>
  </div>
  <br>
    `
    return html
}



const createAllPosts = () => {
    const cityList = getCities();
    cityList.forEach(x => {
        const element = document.createElement('div');
        fetchThis(x.name).then(weather => {
          const content = createPost(x, weather);
          element.innerHTML = content;
          postArea.appendChild(element);
        })
    })
};

createAllPosts();


const createNewBlogPost = (e) => {
    e.preventDefault();
    // get values from Form
    const name = document.getElementById("name").value;
    const text = document.getElementById("text").value;
    const activity = document.getElementById("activity").value;
    const country = document.getElementById("country").value;
    const latitude = document.getElementById("latitude").value;
    const longitude = document.getElementById("longitude").value;

    
    let latitudeNumber = parseFloat(latitude);
    let longitudeNumber = parseFloat(longitude);

    const createdPost = {

        name: name, 
        text: text, 
        city: name,
        country: country,
        activity: activity, 
        latlong: {
          lat: latitudeNumber,
          long: longitudeNumber
        }
    };

    const removeAllChildNodes = (parent) => {
      while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
      }
  }
    removeAllChildNodes(postArea);
    addPost(createdPost);
}

const addPost = (createdPost) => {
  const citiesFromStorage = localStorage.getItem("cities");
  const cities = JSON.parse(citiesFromStorage);
  cities.push(createdPost);
  const stringifiedCities = JSON.stringify(cities);
  localStorage.setItem("cities", stringifiedCities);
  console.log(localStorage.getItem("cities"));
  createAllPosts();
}

document.getElementById("newPostForm").addEventListener("submit", createNewBlogPost);


