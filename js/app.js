// Main Application Module
// Initializes all components of the Hiking Companion app

import { Compass } from './modules/compass.js';
import { Tracking } from './modules/tracking.js';
import { Trails } from './modules/trails.js';
import { Weather } from './modules/weather.js';
import { Theme } from './modules/theme.js';
import { Navigation } from './modules/navigation.js';

class HikingApp {
    constructor() {
        this.modules = {};
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.initializeModules());
        } else {
            this.initializeModules();
        }
    }

    initializeModules() {
        try {
            // Initialize all modules
            this.modules.navigation = new Navigation();
            this.modules.theme = new Theme();
            this.modules.compass = new Compass();
            this.modules.tracking = new Tracking();
            this.modules.trails = new Trails();
            this.modules.weather = new Weather();

            console.log('Hiking Companion app initialized successfully!');
            
            // Register service worker for offline functionality (if needed later)
            this.registerServiceWorker();
        } catch (error) {
            console.error('Error initializing app:', error);
        }
    }

    registerServiceWorker() {
        // Service worker registration for future PWA features
        if ('serviceWorker' in navigator) {
            // Uncomment when service worker is implemented
            // navigator.serviceWorker.register('/sw.js')
            //     .then(registration => {
            //         console.log('Service Worker registered:', registration);
            //     })
            //     .catch(error => {
            //         console.log('Service Worker registration failed:', error);
            //     });
        }
    }
}

// Initialize the app
const app = new HikingApp();
