// Global variables
let recommendationsData = null;

// Fetch recommendations data from JSON file
async function fetchRecommendations() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        recommendationsData = await response.json();
        console.log('Fetched recommendations:', recommendationsData);
    } catch (error) {
        console.error('Error fetching recommendations:', error);
    }
}

// Initialize the application
async function initialize() {
    await fetchRecommendations();
}

// Search functionality
function searchDestinations() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const resultsSection = document.getElementById('searchResults');
    
    if (!searchTerm) {
        alert('Please enter a search term');
        return;
    }

    let results = [];

    // Search logic for different keywords
    if (searchTerm.includes('beach') || searchTerm.includes('beaches')) {
        results = recommendationsData.beaches;
    } else if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        results = recommendationsData.temples;
    } else {
        // Search through countries
        const matchingCountry = recommendationsData.countries.find(country => 
            country.name.toLowerCase().includes(searchTerm)
        );
        if (matchingCountry) {
            results = matchingCountry.cities;
        }
    }

    displayResults(results);
}

// Display search results
function displayResults(results) {
    const resultsSection = document.getElementById('searchResults');
    
    if (!results || results.length === 0) {
        resultsSection.innerHTML = '<p class="no-results">No recommendations found</p>';
        return;
    }

    let html = '<div class="recommendations">';
    
    results.forEach(result => {
        // Replace placeholder image URLs with actual images
        const imageUrl = result.imageUrl.replace('enter_your_image_for_', 'images/');
        
        html += `
            <div class="recommendation-card">
                <img src="${imageUrl}" alt="${result.name}">
                <div class="recommendation-content">
                    <h3>${result.name}</h3>
                    <p>${result.description}</p>
                    ${getLocalTimeHTML(result.name)}
                </div>
            </div>
        `;
    });

    html += '</div>';
    resultsSection.innerHTML = html;
}

// Get local time HTML based on location
function getLocalTimeHTML(location) {
    const timeZones = {
        'Sydney': 'Australia/Sydney',
        'Melbourne': 'Australia/Melbourne',
        'Tokyo': 'Asia/Tokyo',
        'Kyoto': 'Asia/Tokyo',
        'Rio de Janeiro': 'America/Sao_Paulo',
        'São Paulo': 'America/Sao_Paulo'
    };

    const cityName = location.split(',')[0];
    const timeZone = timeZones[cityName];

    if (!timeZone) return '';

    try {
        const options = { 
            timeZone: timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        const localTime = new Date().toLocaleTimeString('en-US', options);
        return `<p class="local-time">Local Time: ${localTime}</p>`;
    } catch (error) {
        console.error('Error getting local time:', error);
        return '';
    }
}

// Clear search results
function clearResults() {
    const searchInput = document.getElementById('searchInput');
    const resultsSection = document.getElementById('searchResults');
    
    searchInput.value = '';
    resultsSection.innerHTML = '';
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', initialize);