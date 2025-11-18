// Weather Module - Handles weather information and recommendations

export class Weather {
    constructor() {
        this.currentLocation = null;
        this.refreshBtn = document.getElementById('refresh-weather');
        this.statusElement = document.getElementById('weather-status');
        this.currentWeather = document.getElementById('weather-current');
        this.forecast = document.getElementById('weather-forecast');
        this.recommendations = document.getElementById('weather-recommendations');

        this.init();
    }

    init() {
        this.refreshBtn.addEventListener('click', () => this.loadWeather());
        // Auto-load weather on initialization
        this.loadWeather();
    }

    async loadWeather() {
        this.showStatus('Loading weather data...', 'info');
        this.refreshBtn.disabled = true;

        try {
            // Get current location
            const position = await this.getCurrentPosition();
            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            // In a real app, this would call a weather API like OpenWeatherMap, WeatherAPI, etc.
            // For this demo, we'll use OpenWeatherMap's free tier or generate sample data
            await this.fetchWeatherData();

            this.showStatus('Weather updated successfully!', 'success');
        } catch (error) {
            this.showStatus('Error loading weather: ' + error.message, 'error');
            // Show sample data even on error for demo purposes
            this.displaySampleWeather();
        } finally {
            this.refreshBtn.disabled = false;
        }
    }

    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!('geolocation' in navigator)) {
                reject(new Error('Geolocation not supported'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                resolve,
                (error) => {
                    let message;
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            message = 'Permission denied. Showing sample weather data.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Position unavailable. Showing sample weather data.';
                            break;
                        case error.TIMEOUT:
                            message = 'Request timeout. Showing sample weather data.';
                            break;
                        default:
                            message = 'Unknown error. Showing sample weather data.';
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: false,
                    timeout: 10000,
                    maximumAge: 300000 // 5 minutes
                }
            );
        });
    }

    async fetchWeatherData() {
        // Try to fetch from OpenWeatherMap API (free tier)
        // Note: In production, the API key should be stored securely on a backend
        // For demo purposes, we'll show sample data
        
        // You can uncomment and use this with your own API key:
        /*
        const API_KEY = 'your_openweathermap_api_key';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lng}&units=metric&appid=${API_KEY}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Weather API request failed');
        
        const data = await response.json();
        this.displayCurrentWeather(data);
        
        // Fetch forecast
        const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${this.currentLocation.lat}&lon=${this.currentLocation.lng}&units=metric&appid=${API_KEY}`;
        const forecastResponse = await fetch(forecastUrl);
        const forecastData = await forecastResponse.json();
        this.displayForecast(forecastData);
        */

        // For demo, show sample data
        this.displaySampleWeather();
    }

    displaySampleWeather() {
        // Generate realistic sample weather data
        const temp = Math.floor(Math.random() * 20 + 10); // 10-30°C
        const conditions = ['Clear', 'Partly Cloudy', 'Cloudy', 'Light Rain', 'Sunny'];
        const condition = conditions[Math.floor(Math.random() * conditions.length)];
        const humidity = Math.floor(Math.random() * 40 + 40); // 40-80%
        const windSpeed = Math.floor(Math.random() * 15 + 5); // 5-20 km/h

        this.currentWeather.innerHTML = `
            <div class="weather-main">
                <div>
                    <div class="weather-icon">${this.getWeatherIcon(condition)}</div>
                    <div class="weather-description">${condition}</div>
                </div>
                <div class="weather-temp">${temp}°C</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <div class="weather-detail-label">Humidity</div>
                    <div class="weather-detail-value">${humidity}%</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Wind</div>
                    <div class="weather-detail-value">${windSpeed} km/h</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">UV Index</div>
                    <div class="weather-detail-value">${Math.floor(Math.random() * 8 + 1)}</div>
                </div>
                <div class="weather-detail">
                    <div class="weather-detail-label">Visibility</div>
                    <div class="weather-detail-value">${Math.floor(Math.random() * 5 + 5)} km</div>
                </div>
            </div>
        `;

        // Display 5-day forecast
        const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
        let forecastHTML = '';

        days.forEach(day => {
            const dayTemp = Math.floor(Math.random() * 20 + 10);
            const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
            
            forecastHTML += `
                <div class="forecast-card">
                    <div class="forecast-day">${day}</div>
                    <div class="forecast-icon">${this.getWeatherIcon(dayCondition)}</div>
                    <div class="forecast-temp">${dayTemp}°C</div>
                </div>
            `;
        });

        this.forecast.innerHTML = forecastHTML;

        // Generate hiking recommendations
        this.generateRecommendations(temp, condition, windSpeed);
    }

    getWeatherIcon(condition) {
        const icons = {
            'Clear': '☀️',
            'Sunny': '☀️',
            'Partly Cloudy': '⛅',
            'Cloudy': '☁️',
            'Light Rain': '🌦️',
            'Rain': '🌧️',
            'Heavy Rain': '⛈️',
            'Snow': '❄️',
            'Fog': '🌫️',
            'Windy': '💨'
        };

        return icons[condition] || '🌤️';
    }

    generateRecommendations(temp, condition, windSpeed) {
        const recommendations = [];

        // Temperature-based recommendations
        if (temp >= 20 && temp <= 28) {
            recommendations.push({
                type: 'good',
                icon: '🌡️',
                text: 'Ideal temperature for hiking! Perfect conditions ahead.'
            });
        } else if (temp > 28) {
            recommendations.push({
                type: 'caution',
                icon: '🌡️',
                text: 'High temperature. Bring extra water and take frequent breaks.'
            });
        } else if (temp < 10) {
            recommendations.push({
                type: 'caution',
                icon: '🌡️',
                text: 'Cool weather. Dress in layers and bring warm clothing.'
            });
        }

        // Condition-based recommendations
        if (condition === 'Clear' || condition === 'Sunny') {
            recommendations.push({
                type: 'good',
                icon: '☀️',
                text: 'Clear skies ahead! Great visibility for scenic views.'
            });
            recommendations.push({
                type: 'caution',
                icon: '🧴',
                text: 'Apply sunscreen and wear a hat for sun protection.'
            });
        } else if (condition.includes('Rain')) {
            recommendations.push({
                type: 'poor',
                icon: '🌧️',
                text: 'Rain expected. Trails may be slippery. Consider postponing.'
            });
            recommendations.push({
                type: 'caution',
                icon: '🎒',
                text: 'If hiking, bring waterproof gear and extra caution on slopes.'
            });
        } else if (condition.includes('Cloudy')) {
            recommendations.push({
                type: 'good',
                icon: '☁️',
                text: 'Overcast conditions provide comfortable hiking temperatures.'
            });
        }

        // Wind-based recommendations
        if (windSpeed > 15) {
            recommendations.push({
                type: 'caution',
                icon: '💨',
                text: 'Windy conditions. Secure loose items and be cautious on ridges.'
            });
        }

        // General recommendations
        recommendations.push({
            type: 'good',
            icon: '💧',
            text: 'Always carry sufficient water - at least 1L per hour of hiking.'
        });

        recommendations.push({
            type: 'good',
            icon: '📱',
            text: 'Inform someone of your hiking plans and expected return time.'
        });

        // Display recommendations
        let recommendationsHTML = '<h3>Hiking Recommendations</h3>';
        recommendations.forEach(rec => {
            recommendationsHTML += `
                <div class="recommendation-item ${rec.type}">
                    <span style="font-size: 1.5rem;">${rec.icon}</span>
                    <span>${rec.text}</span>
                </div>
            `;
        });

        this.recommendations.innerHTML = recommendationsHTML;
    }

    showStatus(message, type = 'info') {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `status-message ${type}`;
        }
    }
}
