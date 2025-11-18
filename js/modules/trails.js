// Trails Module - Handles trail discovery

export class Trails {
    constructor() {
        this.currentLocation = null;
        this.findBtn = document.getElementById('find-trails');
        this.statusElement = document.getElementById('trails-status');
        this.trailsList = document.getElementById('trails-list');

        this.init();
    }

    init() {
        this.findBtn.addEventListener('click', () => this.findNearbyTrails());
    }

    async findNearbyTrails() {
        this.showStatus('Finding your location...', 'info');
        this.findBtn.disabled = true;

        try {
            // Get current location
            const position = await this.getCurrentPosition();
            this.currentLocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };

            this.showStatus('Loading nearby trails...', 'info');

            // In a real app, this would call an API like AllTrails, Hiking Project, or OpenStreetMap
            // For this demo, we'll generate sample trails based on location
            const trails = this.generateSampleTrails();

            this.displayTrails(trails);
            this.showStatus(`Found ${trails.length} trails near you!`, 'success');
        } catch (error) {
            this.showStatus('Error finding trails: ' + error.message, 'error');
        } finally {
            this.findBtn.disabled = false;
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
                            message = 'Permission denied';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            message = 'Position unavailable';
                            break;
                        case error.TIMEOUT:
                            message = 'Request timeout';
                            break;
                        default:
                            message = 'Unknown error';
                    }
                    reject(new Error(message));
                },
                {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000
                }
            );
        });
    }

    generateSampleTrails() {
        // Generate sample trails for demonstration
        // In production, this would fetch from a real API
        const trailNames = [
            'Mountain Vista Trail',
            'Riverside Walk',
            'Forest Loop',
            'Summit Challenge',
            'Lakeside Path',
            'Woodland Adventure',
            'Peak Explorer',
            'Canyon View Trail'
        ];

        const difficulties = ['easy', 'moderate', 'hard'];
        const trails = [];

        for (let i = 0; i < 6; i++) {
            const distance = (Math.random() * 10 + 1).toFixed(1);
            const elevation = Math.floor(Math.random() * 500 + 100);
            const duration = Math.floor(Math.random() * 180 + 30);
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

            trails.push({
                name: trailNames[i],
                distance: `${distance} km`,
                elevation: `${elevation} m elevation gain`,
                duration: `${duration} min`,
                difficulty: difficulty,
                rating: (Math.random() * 2 + 3).toFixed(1)
            });
        }

        return trails;
    }

    displayTrails(trails) {
        this.trailsList.innerHTML = '';

        if (trails.length === 0) {
            this.trailsList.innerHTML = '<p>No trails found nearby. Try a different location.</p>';
            return;
        }

        trails.forEach(trail => {
            const trailCard = document.createElement('div');
            trailCard.className = 'trail-card';

            trailCard.innerHTML = `
                <div class="trail-name">${trail.name}</div>
                <div class="trail-details">📏 ${trail.distance} • ⏱️ ${trail.duration} • 📈 ${trail.elevation}</div>
                <div class="trail-details">⭐ ${trail.rating}/5.0</div>
                <span class="trail-difficulty ${trail.difficulty}">${trail.difficulty.toUpperCase()}</span>
            `;

            this.trailsList.appendChild(trailCard);
        });
    }

    showStatus(message, type = 'info') {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `status-message ${type}`;
        }
    }
}
