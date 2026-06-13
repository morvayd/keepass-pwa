// KeePass PWA Application
class KeePassApp {
    constructor() {
        this.db = null;
        this.currentGroup = null;
        this.allEntries = [];
        this.autoLockTimeout = null;
        this.autoLockDelay = 5 * 60 * 1000; // 5 minutes
        
        this.init();
    }

    init() {
        this.registerServiceWorker();
        this.setupEventListeners();
        this.resetAutoLock();
    }

    registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('Service Worker registered'))
                .catch(err => console.log('Service Worker registration failed:', err));
        }
    }

    setupEventListeners() {
        // File input
        const fileInput = document.getElementById('file-input');
        fileInput.addEventListener('change', (e) => this.handleFileSelect(e));

        // Password input
        const passwordInput = document.getElementById('password-input');
        passwordInput.addEventListener('input', () => this.validateUnlockButton());
        passwordInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !document.getElementById('unlock-btn').disabled) {
                this.unlockDatabase();
            }
        });

        // Toggle password visibility
        document.getElementById('toggle-password').addEventListener('click', () => {
            const input = passwordInput;
            input.type = input.type === 'password' ? 'text' : 'password';
        });

        // Unlock button
        document.getElementById('unlock-btn').addEventListener('click', () => this.unlockDatabase());

        // Lock button
        document.getElementById('lock-btn').addEventListener('click', () => this.lockDatabase());

        // Search toggle
        document.getElementById('search-toggle').addEventListener('click', () => {
            const searchBar = document.getElementById('search-bar');
            searchBar.classList.toggle('active');
            if (searchBar.classList.contains('active')) {
                document.getElementById('search-input').focus();
            }
        });

        // Search input
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchEntries(e.target.value);
        });

        // Close modal
        document.getElementById('close-modal').addEventListener('click', () => {
            document.getElementById('entry-modal').classList.remove('active');
        });

        // Click outside modal to close
        document.getElementById('entry-modal').addEventListener('click', (e) => {
            if (e.target.id === 'entry-modal') {
                document.getElementById('entry-modal').classList.remove('active');
            }
        });

        // Reset auto-lock on user activity
        ['mousedown', 'keydown', 'touchstart', 'scroll'].forEach(event => {
            document.addEventListener(event, () => this.resetAutoLock());
        });
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('file-name').textContent = file.name;
            this.selectedFile = file;
            this.validateUnlockButton();
        }
    }

    validateUnlockButton() {
        const hasFile = this.selectedFile !== undefined;
        const hasPassword = document.getElementById('password-input').value.length > 0;
        document.getElementById('unlock-btn').disabled = !(hasFile && hasPassword);
    }

    async unlockDatabase() {
        const password = document.getElementById('password-input').value;
        const errorMsg = document.getElementById('error-message');
        
        errorMsg.classList.remove('show');
        this.showLoading(true);

        try {
            // Read file as ArrayBuffer
            const arrayBuffer = await this.selectedFile.arrayBuffer();
            
            // Create credentials
            const credentials = new kdbxweb.Credentials(
                kdbxweb.ProtectedValue.fromString(password)
            );

            // Load database
            this.db = await kdbxweb.Kdbx.load(arrayBuffer, credentials);
            
            // Extract all entries
            this.extractEntries();
            
            // Show main screen
            this.showMainScreen();
            
            // Clear password
            document.getElementById('password-input').value = '';
            
        } catch (error) {
            console.error('Error unlocking database:', error);
            errorMsg.textContent = 'Failed to unlock database. Please check your password.';
            errorMsg.classList.add('show');
        } finally {
            this.showLoading(false);
        }
    }

    extractEntries() {
        this.allEntries = [];
        const groups = [];

        const processGroup = (group, path = []) => {
            const groupPath = [...path, group.name];
            
            // Add group info
            const groupInfo = {
                name: group.name,
                path: groupPath.join(' / '),
                entries: [],
                uuid: group.uuid.id
            };

            // Process entries in this group
            group.entries.forEach(entry => {
                if (!entry.fields.get('Title')) return; // Skip entries without title
                
                const entryData = {
                    title: entry.fields.get('Title') || 'Untitled',
                    username: entry.fields.get('UserName') || '',
                    password: entry.fields.get('Password') ? entry.fields.get('Password').getText() : '',
                    url: entry.fields.get('URL') || '',
                    notes: entry.fields.get('Notes') || '',
                    group: groupInfo.name,
                    groupPath: groupInfo.path,
                    groupUuid: group.uuid.id
                };

                groupInfo.entries.push(entryData);
                this.allEntries.push(entryData);
            });

            if (groupInfo.entries.length > 0) {
                groups.push(groupInfo);
            }

            // Process subgroups
            group.groups.forEach(subgroup => processGroup(subgroup, groupPath));
        };

        // Start with root group
        this.db.groups.forEach(group => processGroup(group));
        
        this.groups = groups;
    }

    showMainScreen() {
        document.getElementById('login-screen').classList.remove('active');
        document.getElementById('main-screen').classList.add('active');
        
        // Set database name
        const dbName = this.db.meta.name || 'Password Database';
        document.getElementById('db-name').textContent = dbName;
        
        // Display groups
        this.displayGroups();
    }

    displayGroups() {
        const groupsList = document.getElementById('groups-list');
        const entriesList = document.getElementById('entries-list');
        
        groupsList.innerHTML = '';
        groupsList.style.display = '';

        if (this.groups.length === 0) {
            groupsList.innerHTML = `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <p>No entries found in database</p>
                </div>
            `;
            return;
        }

        this.groups.forEach(group => {
            const groupEl = document.createElement('div');
            groupEl.className = 'group-item';
            groupEl.innerHTML = `
                <div class="group-info">
                    <div class="group-icon">📁</div>
                    <div>
                        <div class="group-name">${this.escapeHtml(group.name)}</div>
                        <div class="group-count">${group.entries.length} entries</div>
                    </div>
                </div>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"></polyline>
                </svg>
            `;
            groupEl.addEventListener('click', () => this.showGroupEntries(group));
            groupsList.appendChild(groupEl);
        });

        entriesList.classList.remove('active');
    }

    showGroupEntries(group) {
        const entriesList = document.getElementById('entries-list');
        entriesList.innerHTML = `
            <button class="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Groups
            </button>
        `;

        group.entries.forEach(entry => {
            const entryEl = document.createElement('div');
            entryEl.className = 'entry-item';
            entryEl.innerHTML = `
                <div class="entry-title">${this.escapeHtml(entry.title)}</div>
                <div class="entry-username">${this.escapeHtml(entry.username)}</div>
            `;
            entryEl.addEventListener('click', () => this.showEntryDetails(entry));
            entriesList.appendChild(entryEl);
        });

        entriesList.querySelector('.back-btn').addEventListener('click', () => {
            document.getElementById('groups-list').style.display = '';
            entriesList.classList.remove('active');
            this.displayGroups();
        });

        document.getElementById('groups-list').style.display = 'none';
        entriesList.classList.add('active');
    }

    showEntryDetails(entry) {
        const modal = document.getElementById('entry-modal');
        const details = document.getElementById('entry-details');
        
        document.getElementById('entry-title').textContent = entry.title;
        
        details.innerHTML = '';

        // Username
        if (entry.username) {
            details.appendChild(this.createField('Username', entry.username, false));
        }

        // Password
        if (entry.password) {
            details.appendChild(this.createField('Password', entry.password, true));
        }

        // URL
        if (entry.url) {
            const urlField = this.createField('URL', entry.url, false);
            const urlValue = urlField.querySelector('.field-value');
            urlValue.style.cursor = 'pointer';
            urlValue.addEventListener('click', () => window.open(entry.url, '_blank'));
            details.appendChild(urlField);
        }

        // Notes
        if (entry.notes) {
            details.appendChild(this.createField('Notes', entry.notes, false));
        }

        modal.classList.add('active');
    }

    createField(label, value, isPassword) {
        const field = document.createElement('div');
        field.className = 'field';
        
        const fieldLabel = document.createElement('div');
        fieldLabel.className = 'field-label';
        fieldLabel.textContent = label;
        
        const fieldValue = document.createElement('div');
        fieldValue.className = 'field-value' + (isPassword ? ' password' : '');
        
        const valueSpan = document.createElement('span');
        valueSpan.textContent = isPassword ? '••••••••••••' : value;
        valueSpan.style.flex = '1';
        
        const copyBtn = document.createElement('button');
        copyBtn.className = 'copy-btn';
        copyBtn.innerHTML = `
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
        `;
        copyBtn.addEventListener('click', () => this.copyToClipboard(value, copyBtn));
        
        if (isPassword) {
            const toggleBtn = document.createElement('button');
            toggleBtn.className = 'copy-btn';
            toggleBtn.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                </svg>
            `;
            toggleBtn.addEventListener('click', () => {
                if (valueSpan.textContent === '••••••••••••') {
                    valueSpan.textContent = value;
                } else {
                    valueSpan.textContent = '••••••••••••';
                }
            });
            fieldValue.appendChild(toggleBtn);
        }
        
        fieldValue.appendChild(valueSpan);
        fieldValue.appendChild(copyBtn);
        
        field.appendChild(fieldLabel);
        field.appendChild(fieldValue);
        
        return field;
    }

    async copyToClipboard(text, button) {
        try {
            await navigator.clipboard.writeText(text);
            button.classList.add('copied');
            button.innerHTML = `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
            `;
            setTimeout(() => {
                button.classList.remove('copied');
                button.innerHTML = `
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                `;
            }, 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    }

    searchEntries(query) {
        if (!query.trim()) {
            this.displayGroups();
            return;
        }

        const searchLower = query.toLowerCase();
        const results = this.allEntries.filter(entry => 
            entry.title.toLowerCase().includes(searchLower) ||
            entry.username.toLowerCase().includes(searchLower) ||
            entry.url.toLowerCase().includes(searchLower)
        );

        const entriesList = document.getElementById('entries-list');
        entriesList.innerHTML = `
            <button class="back-btn">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"></polyline>
                </svg>
                Back to Groups
            </button>
            <h3 style="margin-bottom: 16px; color: var(--text-secondary);">
                ${results.length} result${results.length !== 1 ? 's' : ''} for "${this.escapeHtml(query)}"
            </h3>
        `;

        if (results.length === 0) {
            entriesList.innerHTML += `
                <div class="empty-state">
                    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                    <p>No entries found</p>
                </div>
            `;
        } else {
            results.forEach(entry => {
                const entryEl = document.createElement('div');
                entryEl.className = 'entry-item';
                entryEl.innerHTML = `
                    <div class="entry-title">${this.escapeHtml(entry.title)}</div>
                    <div class="entry-username">${this.escapeHtml(entry.username)}</div>
                    <div style="font-size: 12px; color: var(--text-secondary); margin-top: 4px;">
                        ${this.escapeHtml(entry.groupPath)}
                    </div>
                `;
                entryEl.addEventListener('click', () => this.showEntryDetails(entry));
                entriesList.appendChild(entryEl);
            });
        }

        entriesList.querySelector('.back-btn').addEventListener('click', () => {
            document.getElementById('search-input').value = '';
            document.getElementById('search-bar').classList.remove('active');
            document.getElementById('groups-list').style.display = '';
            entriesList.classList.remove('active');
            this.displayGroups();
        });

        document.getElementById('groups-list').style.display = 'none';
        entriesList.classList.add('active');
    }

    lockDatabase() {
        // Clear sensitive data
        this.db = null;
        this.allEntries = [];
        this.groups = [];
        this.currentGroup = null;
        this.selectedFile = undefined;
        
        // Clear inputs
        document.getElementById('password-input').value = '';
        document.getElementById('file-input').value = '';
        document.getElementById('file-name').textContent = 'Choose .kdbx file';
        document.getElementById('search-input').value = '';
        
        // Hide search bar
        document.getElementById('search-bar').classList.remove('active');
        
        // Clear auto-lock timeout
        if (this.autoLockTimeout) {
            clearTimeout(this.autoLockTimeout);
        }
        
        // Show login screen
        document.getElementById('main-screen').classList.remove('active');
        document.getElementById('login-screen').classList.add('active');
    }

    resetAutoLock() {
        if (this.autoLockTimeout) {
            clearTimeout(this.autoLockTimeout);
        }
        
        if (this.db) {
            this.autoLockTimeout = setTimeout(() => {
                this.lockDatabase();
            }, this.autoLockDelay);
        }
    }

    showLoading(show) {
        const loading = document.getElementById('loading');
        if (show) {
            loading.classList.add('active');
        } else {
            loading.classList.remove('active');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new KeePassApp();
});

// Made with Bob
