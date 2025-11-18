// Compass Module - Handles device orientation and compass functionality

export class Compass {
    constructor() {
        this.heading = 0;
        this.isCalibrated = false;
        this.calibrationOffset = 0;
        this.needleElement = document.getElementById('compass-needle');
        this.headingElement = document.getElementById('heading-value');
        this.directionElement = document.getElementById('direction-display');
        this.statusElement = document.getElementById('compass-status');
        this.calibrateBtn = document.getElementById('calibrate-compass');
        
        this.init();
    }

    init() {
        this.calibrateBtn.addEventListener('click', () => this.calibrate());
        this.checkSupport();
    }

    checkSupport() {
        if ('DeviceOrientationEvent' in window) {
            // Check if we need to request permission (iOS 13+)
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                this.showStatus('Tap "Calibrate Compass" to enable', 'info');
            } else {
                this.startCompass();
            }
        } else {
            this.showStatus('Device orientation not supported on this device', 'error');
        }
    }

    async calibrate() {
        try {
            // Request permission for iOS 13+
            if (typeof DeviceOrientationEvent.requestPermission === 'function') {
                const permission = await DeviceOrientationEvent.requestPermission();
                if (permission === 'granted') {
                    this.startCompass();
                } else {
                    this.showStatus('Permission denied. Compass requires device orientation access.', 'error');
                }
            } else {
                // For devices that don't need permission
                this.calibrationOffset = this.heading;
                this.isCalibrated = true;
                this.showStatus('Compass calibrated successfully!', 'success');
            }
        } catch (error) {
            console.error('Error requesting device orientation permission:', error);
            this.showStatus('Error accessing compass. Please try again.', 'error');
        }
    }

    startCompass() {
        // Try to use absolute orientation first (with magnetic north)
        window.addEventListener('deviceorientationabsolute', (event) => {
            this.handleOrientation(event, true);
        }, { passive: true });

        // Fallback to regular device orientation
        window.addEventListener('deviceorientation', (event) => {
            this.handleOrientation(event, false);
        }, { passive: true });

        this.showStatus('Compass active. Move your device in a figure-8 pattern for better accuracy.', 'success');
    }

    handleOrientation(event, isAbsolute) {
        let heading;

        if (isAbsolute && event.alpha !== null) {
            // Use alpha for absolute orientation (magnetic north)
            heading = event.alpha;
        } else if (event.webkitCompassHeading) {
            // iOS uses webkitCompassHeading
            heading = event.webkitCompassHeading;
        } else if (event.alpha !== null) {
            // Android uses alpha (0-360 degrees, 0 = north)
            heading = 360 - event.alpha;
        } else {
            return; // No valid heading data
        }

        // Apply calibration offset
        this.heading = (heading - this.calibrationOffset + 360) % 360;
        
        this.updateDisplay();
    }

    updateDisplay() {
        // Update needle rotation
        if (this.needleElement) {
            this.needleElement.style.transform = `translate(-50%, -50%) rotate(${this.heading}deg)`;
        }

        // Update heading value
        if (this.headingElement) {
            this.headingElement.textContent = Math.round(this.heading);
        }

        // Update direction text
        if (this.directionElement) {
            this.directionElement.textContent = this.getDirection(this.heading);
        }
    }

    getDirection(heading) {
        const directions = [
            { name: 'N', min: 337.5, max: 360 },
            { name: 'N', min: 0, max: 22.5 },
            { name: 'NE', min: 22.5, max: 67.5 },
            { name: 'E', min: 67.5, max: 112.5 },
            { name: 'SE', min: 112.5, max: 157.5 },
            { name: 'S', min: 157.5, max: 202.5 },
            { name: 'SW', min: 202.5, max: 247.5 },
            { name: 'W', min: 247.5, max: 292.5 },
            { name: 'NW', min: 292.5, max: 337.5 }
        ];

        for (const dir of directions) {
            if (heading >= dir.min && heading < dir.max) {
                return dir.name;
            }
        }

        return 'N';
    }

    showStatus(message, type = 'info') {
        if (this.statusElement) {
            this.statusElement.textContent = message;
            this.statusElement.className = `status-message ${type}`;
        }
    }
}
