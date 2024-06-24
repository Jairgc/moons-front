document.addEventListener('DOMContentLoaded', function() {
    const centerTypeFilter = document.getElementById('centerTypeFilter');
    const zoneFilter = document.getElementById('zoneFilter');
    const servicesFilter = document.getElementById('servicesFilter');
    const container = document.getElementById('centersGrid'); // Updated to match the HTML structure
    let smilecentersData = [];

    fetch('https://moons-ce6838cc8a56.herokuapp.com/api/smilecenters/')
        .then(response => response.json())
        .then(data => {
            smilecentersData = data;
            populateFilters(data);
            displaySmilecenters(data);
        })
        .catch(error => console.error('Error fetching data:', error));

    function populateFilters(data) {
        const centerTypes = [...new Set(data.map(item => item.center_type_name))];
        const zones = [...new Set(data.map(item => item.zone))];
        const services = [...new Set(data.flatMap(item => Object.keys(JSON.parse(item.services))))];

        centerTypes.forEach(type => {
            const option = document.createElement('option');
            option.value = type;
            option.textContent = type;
            centerTypeFilter.appendChild(option);
        });

        zones.forEach(zone => {
            const option = document.createElement('option');
            option.value = zone;
            option.textContent = zone;
            zoneFilter.appendChild(option);
        });

        services.forEach(service => {
            const option = document.createElement('option');
            option.value = service;
            option.textContent = service;
            servicesFilter.appendChild(option);
        });
    }

    function displaySmilecenters(data) {
        container.innerHTML = '';
        data.forEach(smilecenter => {
            const smilecenterDiv = document.createElement('div');
            smilecenterDiv.className = 'center'; // Ensure this matches the CSS class for styling
            
            const name = document.createElement('h2');
            name.textContent = smilecenter.name;
            
            const address = document.createElement('p');
            address.textContent = `${smilecenter.city}, ${smilecenter.street} ${smilecenter.number}, ${smilecenter.neighborhood}, ${smilecenter.state}, ${smilecenter.apt}`;
            
            const centerType = document.createElement('p');
            centerType.textContent = `Center Type: ${smilecenter.center_type_name}`;
            
            const country = document.createElement('p');
            country.textContent = `Country: ${smilecenter.country}`;
            
            const timeTable = document.createElement('p');
            const parsedTimeTable = JSON.parse(smilecenter.time_table);
            let timeTableText = 'Time Table: ';
            for (const [day, times] of Object.entries(parsedTimeTable)) {
                let dayTranslated = day;
                if (day === "sunday") {
                    dayTranslated = "Domingo";
                } else if (day === "saturday") {
                    dayTranslated = "Sábado";
                } else if (day === "weekdays") {
                    dayTranslated = "Lunes-Viernes";
                }
                timeTableText += `${dayTranslated}: ${times.join(', ')} `;
            }
            timeTable.textContent = timeTableText;
            
            smilecenterDiv.appendChild(name);
            smilecenterDiv.appendChild(address);
            smilecenterDiv.appendChild(centerType);
            smilecenterDiv.appendChild(country);
            smilecenterDiv.appendChild(timeTable);
            
            container.appendChild(smilecenterDiv);
        });
    }

    function filterSmilecenters() {
        const selectedCenterType = centerTypeFilter.value;
        const selectedZone = zoneFilter.value;
        const selectedService = servicesFilter.value;

        const filteredData = smilecentersData.filter(smilecenter => {
            const services = JSON.parse(smilecenter.services);
            const serviceKeys = Object.keys(services);

            return (selectedCenterType === '' || smilecenter.center_type_name === selectedCenterType) &&
                   (selectedZone === '' || smilecenter.zone === selectedZone) &&
                   (selectedService === '' || serviceKeys.includes(selectedService));
        });

        displaySmilecenters(filteredData);
    }

    centerTypeFilter.addEventListener('change', filterSmilecenters);
    zoneFilter.addEventListener('change', filterSmilecenters);
    servicesFilter.addEventListener('change', filterSmilecenters);
});
