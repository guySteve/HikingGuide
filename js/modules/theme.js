// Theme Module - Handles theme switching and persistence

export class Theme {
    constructor() {
        this.currentTheme = 'navy'; // default theme
        this.themeToggle = document.getElementById('theme-toggle');
        this.themeModal = document.getElementById('theme-modal');
        this.closeModalBtn = document.getElementById('close-theme-modal');
        this.themeButtons = document.querySelectorAll('.theme-btn');

        this.init();
    }

    init() {
        // Load saved theme from localStorage
        this.loadTheme();

        // Set up event listeners
        this.themeToggle.addEventListener('click', () => this.openModal());
        this.closeModalBtn.addEventListener('click', () => this.closeModal());

        // Close modal when clicking outside
        this.themeModal.addEventListener('click', (e) => {
            if (e.target === this.themeModal) {
                this.closeModal();
            }
        });

        // Theme button listeners
        this.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const theme = btn.dataset.theme;
                this.setTheme(theme);
                this.updateActiveButton(btn);
            });
        });

        // Update active button on load
        this.updateActiveButton();
    }

    openModal() {
        this.themeModal.classList.remove('hidden');
    }

    closeModal() {
        this.themeModal.classList.add('hidden');
    }

    setTheme(theme) {
        this.currentTheme = theme;
        document.body.setAttribute('data-theme', theme);
        
        // Save to localStorage
        localStorage.setItem('hiking-theme', theme);

        // Update meta theme-color for mobile browsers
        this.updateMetaThemeColor(theme);
    }

    loadTheme() {
        const savedTheme = localStorage.getItem('hiking-theme');
        if (savedTheme) {
            this.setTheme(savedTheme);
        } else {
            this.setTheme(this.currentTheme);
        }
    }

    updateActiveButton(activeBtn = null) {
        this.themeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (activeBtn) {
                if (btn === activeBtn) {
                    btn.classList.add('active');
                }
            } else {
                // Find and mark the current theme as active
                if (btn.dataset.theme === this.currentTheme) {
                    btn.classList.add('active');
                }
            }
        });
    }

    updateMetaThemeColor(theme) {
        const themeColors = {
            'navy': '#1e3a5f',
            'forest': '#2d5016',
            'light': '#2196f3',
            'dark': '#121212',
            'accessibility': '#000000'
        };

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor && themeColors[theme]) {
            metaThemeColor.setAttribute('content', themeColors[theme]);
        }
    }
}
