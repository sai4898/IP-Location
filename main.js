
let cachedLocation = {};

function displayIPAndLocation() {
    // Get IP address
    const ipAddress = async () => {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return data.ip;
    };

    // Get location 
    const getLocation = () => {
        if (cachedLocation.hasOwnProperty('city')) {
            updateLocationText(cachedLocation);
        } else {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition((position) => {
                    const latitude = position.coords.latitude;
                    const longitude = position.coords.longitude;
                    console.log('Latitude:', latitude, 'Longitude:', longitude); 

                    // Fetch location data
                    fetch(`https://geocode.xyz/${latitude},${longitude}?json=1`)
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok');
                            }
                            return response.json();
                        })
                        .then(data => {
                            if (data.error) {
                                throw new Error(data.error.message);
                            }
                            cachedLocation = data; 
                            updateLocationText(data);
                        })
                        .catch(error => console.error('Error:', error));
                });
            } else {
                console.error('Geolocation is not supported by this browser.');
            }
        }
    };

    // Update location text on the webpage
    const updateLocationText = (locationData) => {
        const location = `${locationData.city}, ${locationData.region}, ${locationData.country}`;
        document.getElementById('location').textContent = 'Location: ' + location;
    };

    // Display IP address and location
    ipAddress().then(ip => {
        document.getElementById('ipAddress').textContent = 'IP Address: ' + ip;
    });
    getLocation(); 
}