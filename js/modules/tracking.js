// Tracking Module - Handles hike tracking functionality

export class Tracking {
    constructor() {
        this.isTracking = false;
        this.isPaused = false;
        this.startTime = null;
        this.pausedTime = 0;
        this.totalPausedDuration = 0;
        this.distance = 0;
        this.positions = [];
        this.lastPosition = null;
        this.watchId = null;
        this.timerInterval = null;

        this.startBtn = document.getElementById('start-tracking');
        this.pauseBtn = document.getElementById('pause-tracking');
        this.resumeBtn = document.getElementById('resume-tracking');
        this.finishBtn = document.getElementById('finish-tracking');
        this.statusElement = document.getElementById('tracking-status');
        this.durationElement = document.getElementById('duration-value');
        this.distanceElement = document.getElementById('distance-value');
        this.speedElement = document.getElementById('speed-value');

        this.init();
    }

    init() {
        this.startBtn.addEventListener('click', () => this.startTracking());
        this.pauseBtn.addEventListener('click', () => this.pauseTracking());
        this.resumeBtn.addEventListener('click', () => this.resumeTracking());
        this.finishBtn.addEventListener('click', () => this.finishTracking());

        this.checkGeolocationSupport();
    }

    checkGeolocationSupport() {
        if ('geolocation' in navigator) {
            this.showStatus('Ready to track your hike!', 'info');
        } else {
            this.showStatus('Geolocation not supported on this device', 'error');
            this.startBtn.disabled = true;
        }
    }

    startTracking() {
        this.isTracking = true;
        this.isPaused = false;
        this.startTime = Date.now();
        this.distance = 0;
        this.positions = [];
        this.lastPosition = null;
        this.totalPausedDuration = 0;

        // Update UI
        this.startBtn.classList.add('hidden');
        this.pauseBtn.classList.remove('hidden');
        this.finishBtn.classList.remove('hidden');
        this.showStatus('Tracking started! Stay safe on your hike.', 'success');

        // Start watching position
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.handlePosition(position),
            (error) => this.handleError(error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );

        // Start timer
        this.timerInterval = setInterval(() => this.updateTimer(), 1000);
    }

    pauseTracking() {
        this.isPaused = true;
        this.pausedTime = Date.now();

        // Update UI
        this.pauseBtn.classList.add('hidden');
        this.resumeBtn.classList.remove('hidden');
        this.showStatus('Tracking paused', 'warning');

        // Stop watching position
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
    }

    resumeTracking() {
        this.isPaused = false;
        this.totalPausedDuration += Date.now() - this.pausedTime;

        // Update UI
        this.resumeBtn.classList.add('hidden');
        this.pauseBtn.classList.remove('hidden');
        this.showStatus('Tracking resumed', 'success');

        // Resume watching position
        this.watchId = navigator.geolocation.watchPosition(
            (position) => this.handlePosition(position),
            (error) => this.handleError(error),
            {
                enableHighAccuracy: true,
                timeout: 5000,
                maximumAge: 0
            }
        );
    }

    finishTracking() {
        this.isTracking = false;

        // Stop watching position
        if (this.watchId !== null) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        // Stop timer
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }

        // Update UI
        this.pauseBtn.classList.add('hidden');
        this.resumeBtn.classList.add('hidden');
        this.finishBtn.classList.add('hidden');
        this.startBtn.classList.remove('hidden');

        const duration = this.formatDuration(this.getElapsedTime());
        const distance = this.distance.toFixed(2);
        
        this.showStatus(
            `Hike completed! Duration: ${duration}, Distance: ${distance} km`,
            'success'
        );

        // Save hike data to localStorage
        this.saveHike();
    }

    handlePosition(position) {
        if (!this.isTracking || this.isPaused) return;

        const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            timestamp: position.timestamp
        };

        this.positions.push(newPosition);

        // Calculate distance if we have a previous position
        if (this.lastPosition) {
            const distanceIncrement = this.calculateDistance(
                this.lastPosition.lat,
                this.lastPosition.lng,
                newPosition.lat,
                newPosition.lng
            );
            this.distance += distanceIncrement;
        }

        this.lastPosition = newPosition;
        this.updateDisplay();
    }

    handleError(error) {
        let message = 'Error getting location: ';
        switch (error.code) {
            case error.PERMISSION_DENIED:
                message += 'Permission denied. Please allow location access.';
                break;
            case error.POSITION_UNAVAILABLE:
                message += 'Position unavailable. Check your GPS signal.';
                break;
            case error.TIMEOUT:
                message += 'Request timeout. Please try again.';
                break;
            default:
                message += 'Unknown error occurred.';
        }
        this.showStatus(message, 'error');
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula for calculating distance between two points
        const R = 6371; // Earth's radius in km
        const dLat = this.toRadians(lat2 - lat1);
        const dLon = this.toRadians(lon2 - lon1);

        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(this.toRadians(lat1)) *
            Math.cos(this.toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);

        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in km
    }

    toRadians(degrees) {
        return degrees * (Math.PI / 180);
    }

    getElapsedTime() {
        if (!this.startTime) return 0;
        const now = this.isPaused ? this.pausedTime : Date.now();
        return now - this.startTime - this.totalPausedDuration;
    }

    updateTimer() {
        if (!this.isTracking || this.isPaused) return;
        this.updateDisplay();
    }

    updateDisplay() {
        // Update duration
        const elapsed = this.getElapsedTime();
        this.durationElement.textContent = this.formatDuration(elapsed);

        // Update distance
        this.distanceElement.textContent = `${this.distance.toFixed(2)} km`;

        // Update speed (km/h)
        const hours = elapsed / (1000 * 60 * 60);
        const speed = hours > 0 ? this.distance / hours : 0;
        this.speedElement.textContent = `${speed.toFixed(1)} km/h`;
    }

    formatDuration(ms) {
        const seconds = Math.floor(ms / 1000);
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;

        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    saveHike() {
        const hike = {
            date: new Date().toISOString(),
            duration: this.getElapsedTime(),
            distance: this.distance,
            positions: this.positions
        };

        // Get existing hikes
        const hikes = JSON.parse(localStorage.getItem('hikes') || '[]');
        hikes.push(hike);

        // Save to localStorage
        localStorage.setItem('hikes', JSON.stringify(hikes));
    }

    showStatus(message, type = 'info') {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `status-message ${type}`;
        }
    }
}
