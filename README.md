# KeePass-mww Viewer

A Progressive Web App for viewing KeePassXC databases on your iPhone and other devices. No App Store required!

**Created by Daniel Morvay (Morvay Web Works) with IBM Bob**

## 🔌 100% OFFLINE - Works Without Internet!

**After initial setup, this app works completely offline with zero internet connection required.**

- ✈️ Works in airplane mode
- 📵 No WiFi or cell service needed
- 🔒 All processing happens on your device
- 💾 Your .kdbx files stay on your phone
- 🌐 True standalone password manager

See [OFFLINE_GUIDE.md](OFFLINE_GUIDE.md) for complete offline usage details.

## Features

✅ **Read KeePassXC databases** - Opens .kdbx files (KDBX 3.1 and 4.0)
✅ **Multiple database support** - File picker for selecting different .kdbx files
✅ **100% Offline** - Works completely without internet after initial setup
✅ **Secure & Private** - All processing happens locally in your browser
✅ **Mobile-friendly** - Optimized for iPhone and other mobile devices
✅ **Auto-lock** - Automatically locks after 5 minutes of inactivity
✅ **Search functionality** - Quickly find passwords
✅ **Copy to clipboard** - Easy password copying
✅ **No installation** - Add to home screen like a native app
✅ **Zero dependencies** - All code runs locally, no external services

## Security & Privacy Features

- 🔒 **100% Offline** - Works without internet connection
- 🔒 **Client-side only** - Database never leaves your device
- 🔒 **No cloud storage** - You keep your .kdbx files locally
- 🔒 **No external dependencies** - All libraries included locally
- 🔒 **No tracking or analytics** - Complete privacy
- 🔒 **Auto-lock** after inactivity
- 🔒 **Password masking** with toggle
- 🔒 **HTTPS required** for PWA features

## Installation

### For iPhone Users

1. **Host the app** `[https://morvayd.github.io/keepass-mww/](https://morvayd.github.io/keepass-mww/)`
2. **Open Safari** on your iPhone
3. **Navigate to your hosted URL**
4. **Tap the Share button** (square with arrow)
5. **Scroll down and tap "Add to Home Screen"**
6. **Tap "Add"** - The app icon will appear on your home screen

### For Android Users

1. **Host the app** `[https://morvayd.github.io/keepass-mww/](https://morvayd.github.io/keepass-mww/)``
2. **Open Chrome** on your Android device
3. **Navigate to your hosted URL**
4. **Tap the menu** (three dots)
5. **Tap "Add to Home screen"** or "Install app"

## Hosting Options

### Option 1: GitHub Pages (Free & Easy)

**The app will be available at:** `[https://morvayd.github.io/keepass-mww/](https://morvayd.github.io/keepass-mww/)``

### Option 4: Local Testing

For testing on your computer:

```bash
cd keepass-mww
python3 -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

**Note:** PWA features (offline mode, add to home screen) require HTTPS, so local testing won't have full functionality.

## Usage

1. **Open the app** (from home screen or browser)
2. **Tap "Choose .kdbx file"** and select your KeePass database
3. **Enter your master password**
4. **Tap "Unlock Database"**
5. **Browse groups** and tap entries to view details
6. **Copy passwords** by tapping the copy button
7. **Search** using the search icon in the header
8. **Lock** the database when done using the lock icon

## File Structure

```
keepass-mww/
├── index.html              # Main HTML file
├── manifest.json           # PWA configuration
├── service-worker.js       # Offline functionality
├── css/
│   └── style.css          # Styling
├── js/
│   └── app.js             # Main application logic
└── icons/
    ├── icon-192.png       # App icon (192x192)
    └── icon-512.png       # App icon (512x512)
```

## Creating App Icons

You need to create two PNG icons:

1. **icon-192.png** - 192x192 pixels
2. **icon-512.png** - 512x512 pixels

You can:
- Use an online icon generator (search "PWA icon generator")
- Create them in any image editor
- Use the KeePass logo or create your own design

Place them in the `icons/` folder.

## Sharing with Friends & Family

Once hosted, simply share the URL with anyone:

- Send via text message
- Share via email
- Post on Google Drive (share the link, not the files)
- Each person uses their own .kdbx file
- No accounts or sign-ups required
- **Works offline for everyone after initial setup**

## Offline Usage

After adding to home screen, the app works **100% offline**:

✅ No internet connection required
✅ Works in airplane mode
✅ All processing on your device
✅ Your .kdbx files stay local
✅ Complete privacy and security

**See [OFFLINE_GUIDE.md](OFFLINE_GUIDE.md) for detailed offline usage information.**

## Limitations

⚠️ **Read-only** - Cannot modify databases (view only)
⚠️ **No auto-fill** - Cannot auto-fill into other apps (iOS restriction)
⚠️ **Manual file selection** - Must select .kdbx file each time
⚠️ **Initial setup requires internet** - One-time visit to cache files

## Browser Compatibility

- ✅ Safari (iOS 11.3+)
- ✅ Chrome (Android & Desktop)
- ✅ Firefox (Android & Desktop)
- ✅ Edge (Desktop)
- ✅ Samsung Internet

## Troubleshooting

### "Failed to unlock database"
- Check that you entered the correct password
- Ensure the .kdbx file is not corrupted
- Try opening the file in KeePassXC desktop to verify it works

### "Add to Home Screen" not showing
- Make sure you're using Safari on iOS (not Chrome)
- Ensure the site is served over HTTPS
- Try refreshing the page

### App not working offline
- Make sure you've opened the app at least once while online
- Check that service worker is registered (see browser console)
- HTTPS is required for service workers

### Icons not showing
- Ensure icon files are named correctly: `icon-192.png` and `icon-512.png`
- Check that icons are in the `icons/` folder
- Icons must be PNG format

## Privacy & Security

- **No data collection** - This app doesn't collect any data
- **No analytics** - No tracking or analytics
- **No external requests** - All libraries included locally, zero external dependencies
- **100% offline** - Works completely without internet after initial setup
- **Open source** - All code is visible and auditable

## Technical Details

- **Framework:** Vanilla JavaScript (no framework dependencies)
- **Database library:** kdbxweb v2.1.0 (included locally)
- **Supported formats:** KDBX 3.1 and KDBX 4.0
- **Encryption:** AES-256, ChaCha20, Twofish (via kdbxweb)
- **Offline support:** Service Worker with full caching
- **Zero external dependencies** - All code runs locally on your device

## Development

To modify the app:

1. Edit files in the `keepass-mww` folder
2. Test locally with a web server
3. Deploy changes to your hosting service

## License

This project is provided as-is for personal use. Feel free to modify and share.

## Credits

- **Created by:** Daniel Morvay (Morvay Web Works) with IBM Bob
- Built with [kdbxweb](https://github.com/keeweb/kdbxweb) library
- Compatible with [KeePassXC](https://keepassxc.org/) databases

## Support

For issues or questions:
- Check the Troubleshooting section above
- Review the browser console for error messages
- Ensure you're using a supported browser

---

**Enjoy secure password management on your iPhone!** 🔐📱