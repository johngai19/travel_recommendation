// Global variables
let recommendationsData = null;

// Fetch recommendations data from JSON file
async function fetchRecommendations() {
    try {
        const response = await fetch('travel_recommendation_api.json');
        recommendationsData = await response.json();
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
        results = getBeachRecommendations();
    } else if (searchTerm.includes('temple') || searchTerm.includes('temples')) {
        results = getTempleRecommendations();
    } else {
        // Search by country
        results = getCountryRecommendations(searchTerm);
    }

    displayResults(results);
}

// Get beach recommendations
function getBeachRecommendations() {
    if (!recommendationsData) return [];
    
    return recommendationsData.countries
        .flatMap(country => country.cities)
        .filter(city => city.type === 'beach')
        .slice(0, 2); // Show only 2 recommendations
}

// Get temple recommendations
function getTempleRecommendations() {
    if (!recommendationsData) return [];
    
    return recommendationsData.countries
        .flatMap(country => country.cities)
        .filter(city => city.type === 'temple')
        .slice(0, 2);
}

// Get country recommendations
function getCountryRecommendations(searchTerm) {
    if (!recommendationsData) return [];
    
    const country = recommendationsData.countries
        .find(c => c.name.toLowerCase().includes(searchTerm));
    
    return country ? country.cities.slice(0, 2) : [];
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
        html += `
            <div class="recommendation-card">
                <img src="${result.imageUrl}" alt="${result.name}">
                <div class="recommendation-content">
                    <h3>${result.name}</h3>
                    <p>${result.description}</p>
                    ${result.countryTime ? `<p class="local-time">Local Time: ${getLocalTime(result.timeZone)}</p>` : ''}
                </div>
            </div>
        `;
    });

    html += '</div>';
    resultsSection.innerHTML = html;
}

// Clear search results
function clearResults() {
    const searchInput = document.getElementById('searchInput');
    const resultsSection = document.getElementById('searchResults');
    
    searchInput.value = '';
    resultsSection.innerHTML = '';
}

// Get local time for a specific timezone
function getLocalTime(timeZone) {
    try {
        const options = { 
            timeZone: timeZone,
            hour12: true,
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        return new Date().toLocaleTimeString('en-US', options);
    } catch (error) {
        console.error('Error getting local time:', error);
        return '';
    }
}

// Handle contact form submission
function handleSubmit(event) {
    event.preventDefault();
    
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    // Here you would typically send this data to a server
    console.log('Form submitted:', { name, email, message });
    
    // Clear form and show success message
    event.target.reset();
    alert('Thank you for your message. We will get back to you soon!');
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', initialize);