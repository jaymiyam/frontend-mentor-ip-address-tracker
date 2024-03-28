const form = document.querySelector('.form');
const queryInput = document.querySelector('#query-input');
const ipDisplay = document.querySelector('#ip-display');
const locationDisplay = document.querySelector('#location-display');
const timezoneDisplay = document.querySelector('#timezone-display');
const ispDisplay = document.querySelector('#isp-display');
const submitBtn = document.querySelector('.btn-submit');

const API_KEY = 'at_572lUbE6ZuqUjJZtcUYIRLG39QM6J';
const API_URL = `https://geo.ipify.org/api/v2/country,city?apiKey=${API_KEY}&ipAddress=`;
let queryString = '';
let regExp = /[a-zA-Z]/g;
let map;
let marker;
let latValue;
let lngValue;
let initialFetchIsDone = false;

form.addEventListener('submit', (e) => {
  e.preventDefault();
  queryString = queryInput.value;

  if (
    queryString.trim() === '' ||
    regExp.test(queryString) ||
    !queryString.includes('.')
  ) {
    alert('Please enter a valid IP address!');
    queryInput.value = '';
    queryInput.focus();
    return;
  }

  fetchLocation(queryString);
});

async function fetchLocation(ip) {
  try {
    const response = await axios.get(`${API_URL}${ip}`);
    const data = response.data;
    console.log(data);

    ipDisplay.textContent = data.ip;
    locationDisplay.textContent =
      data.location.city +
      ', ' +
      data.location.country +
      ' ' +
      data.location.postalCode;
    timezoneDisplay.textContent = 'UTC ' + data.location.timezone;
    ispDisplay.textContent = data.isp;

    latValue = data.location.lat;
    lngValue = data.location.lng;

    if (!initialFetchIsDone) {
      setMap(latValue, lngValue);
      initialFetchIsDone = true;
      return;
    } else {
      map.setView([latValue, lngValue]);
      marker.setLatLng([latValue, lngValue]);
    }
  } catch (err) {
    alert('Tracking was unsuccessful, please check your input!');
    queryInput.value = '';
    queryInput.focus();
    console.log(err);
  }
}

// setting up map
function setMap(lat, lng) {
  map = L.map('map').setView([lat, lng], 13);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution:
      '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  }).addTo(map);

  var locationIcon = L.icon({
    iconUrl: 'images/icon-location.svg',

    iconSize: [46, 56],
    iconAnchor: [23, 55],
  });

  marker = L.marker([lat, lng], {
    icon: locationIcon,
  }).addTo(map);
}

window.addEventListener('load', () => {
  initialFetch();
});

async function initialFetch() {
  const response = await axios.get('https://api.ipify.org');
  const initialIp = response.data;

  fetchLocation(initialIp);
}

// button animation

let tween;

submitBtn.addEventListener('mouseenter', () => {
  tween = gsap.to(submitBtn, {
    opacity: 0.5,
    repeat: -1,
    yoyo: true,
  });
  tween.restart();
});

submitBtn.addEventListener('mouseleave', () => {
  tween.pause();
  gsap.to(tween, { progress: 0 });
});
