// Navigation Module - Handles tab navigation

export class Navigation {
    constructor() {
        this.tabs = document.querySelectorAll('.nav-tab');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.currentTab = 'compass';

        this.init();
    }

    init() {
        this.tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const tabName = tab.dataset.tab;
                this.switchTab(tabName);
            });
        });

        // Load saved tab from localStorage
        const savedTab = localStorage.getItem('hiking-current-tab');
        if (savedTab) {
            this.switchTab(savedTab);
        }
    }

    switchTab(tabName) {
        // Update tabs
        this.tabs.forEach(tab => {
            if (tab.dataset.tab === tabName) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Update content
        this.tabContents.forEach(content => {
            if (content.id === `${tabName}-tab`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        this.currentTab = tabName;

        // Save to localStorage
        localStorage.setItem('hiking-current-tab', tabName);
    }
}
