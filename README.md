# 🥾 Hiking Companion - Mobile-First Web Application

A comprehensive, mobile-optimized web application designed to serve as your digital hiking companion. Built with modern web technologies and leveraging device sensors for an enhanced outdoor experience.

## ✨ Features

### 🧭 Compass
- Real-time compass using device magnetometer and accelerometer
- Accurate directional heading with visual needle display
- Cardinal direction indicators (N, E, S, W)
- Calibration support for improved accuracy

### 📍 Activity Tracking
- Start, pause, and finish hike controls
- Real-time tracking of:
  - Duration (HH:MM:SS)
  - Distance (kilometers)
  - Speed (km/h)
- GPS-based position tracking
- Automatic hike history storage in local storage

### 🗺️ Trail Discovery
- Find nearby hiking trails based on your location
- Trail information including:
  - Distance and elevation gain
  - Estimated duration
  - Difficulty level (Easy, Moderate, Hard)
  - User ratings
- Location-based trail recommendations

### 🌤️ Weather Dashboard
- Current weather conditions display
- 5-day weather forecast
- Detailed weather metrics:
  - Temperature
  - Humidity
  - Wind speed
  - UV index
  - Visibility
- Smart hiking recommendations based on weather conditions
- Safety alerts for adverse weather

### 🎨 Theming Engine
Five beautiful themes to personalize your experience:

1. **US Navy** - Classic navy blue, gold, and white palette (default)
2. **Forest** - Earth tones inspired by nature
3. **Light** - Clean, bright day mode
4. **Dark** - Easy on the eyes for night hiking planning
5. **High Contrast** - Accessibility-focused theme for maximum readability

Theme preferences are saved automatically and persist across sessions.

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Safari, Edge)
- HTTPS connection (required for sensor access)
- Location permissions enabled

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/guySteve/HikingGuide.git
   cd HikingGuide
   ```

2. **Serve the application:**
   
   You can use any static file server. Here are a few options:

   **Using Python:**
   ```bash
   python -m http.server 8000
   ```

   **Using Node.js (http-server):**
   ```bash
   npx http-server
   ```

   **Using PHP:**
   ```bash
   php -S localhost:8000
   ```

3. **Open in browser:**
   Navigate to `http://localhost:8000` (or your server's address)

### GitHub Pages Deployment

This application is ready for GitHub Pages deployment:

1. Go to your repository settings
2. Navigate to "Pages" section
3. Select the branch to deploy (usually `main` or `master`)
4. Select `/` (root) as the source folder
5. Click "Save"
6. Your site will be published at `https://yourusername.github.io/HikingGuide/`

**Note:** GitHub Pages serves over HTTPS automatically, which is required for accessing device sensors.

## 📱 Mobile-First Design

The application is optimized for mobile devices with:
- Responsive layouts that adapt to any screen size
- Touch-friendly interface elements
- Optimized performance for mobile networks
- Native-feeling interactions and animations
- Sticky navigation for easy access

## 🔐 Permissions

The app requires certain permissions to function fully:

- **Location Access**: Required for tracking, trail discovery, and weather
- **Device Orientation**: Required for compass functionality
- **Storage**: Used to save preferences and hike history (automatic)

All permissions are requested only when needed and can be managed in your browser settings.

## 🛠️ Technology Stack

- **HTML5** - Semantic structure and modern web features
- **CSS3** - Advanced styling with CSS Variables for theming
- **JavaScript (ES6+)** - Modular architecture with classes
- **Web APIs**:
  - Geolocation API
  - Device Orientation API
  - LocalStorage API

## 📂 Project Structure

```
HikingGuide/
├── index.html              # Main HTML file
├── css/
│   ├── styles.css          # Core styles
│   └── themes.css          # Theme definitions
├── js/
│   ├── app.js              # Main application entry point
│   └── modules/
│       ├── compass.js      # Compass functionality
│       ├── tracking.js     # Activity tracking
│       ├── trails.js       # Trail discovery
│       ├── weather.js      # Weather dashboard
│       ├── theme.js        # Theme management
│       └── navigation.js   # Tab navigation
└── README.md
```

## 🌐 Browser Compatibility

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari 14+, Chrome Mobile)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- Weather data integration ready for APIs like OpenWeatherMap
- Trail data integration ready for APIs like AllTrails or Hiking Project
- Icons and emojis for enhanced visual experience

## 📞 Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

**Happy Hiking! 🏔️**