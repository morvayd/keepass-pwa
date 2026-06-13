# Offline Usage Guide

## Yes! This Password Manager Works 100% Offline! 🔌❌

Once you've added the app to your iPhone home screen, it works **completely offline** with no internet connection required.

## How It Works

### Initial Setup (Requires Internet Once)
1. **First visit** - Open the app URL in Safari (needs internet)
2. **Add to Home Screen** - The app and all files are cached
3. **Done!** - From now on, works offline forever

### After Setup (No Internet Needed)
✅ Open the app from home screen  
✅ Select your .kdbx file  
✅ Unlock with password  
✅ Browse all entries  
✅ Copy passwords  
✅ Search entries  
✅ Everything works offline!

## What's Cached for Offline Use

The Service Worker caches:
- ✅ HTML, CSS, JavaScript files
- ✅ kdbxweb library (now included locally)
- ✅ App icons
- ✅ Manifest file

## Your .kdbx Files

Your KeePass database files (.kdbx):
- 📱 Stay on your iPhone (in Files app or iCloud Drive)
- 🔒 Never uploaded anywhere
- 💾 You select them each time you open the app
- 🌐 No internet connection needed to read them

## Airplane Mode Test

To verify offline functionality:
1. Add app to home screen (while online)
2. Turn on Airplane Mode ✈️
3. Open the app from home screen
4. Select your .kdbx file
5. Enter password
6. Everything works!

## Technical Details

### What Happens Online vs Offline

**First Visit (Online):**
```
Internet → Download app files → Cache in browser → Add to home screen
```

**Subsequent Uses (Offline):**
```
Home screen → Load from cache → Select .kdbx → Decrypt locally → Display
```

### Service Worker Magic

The `service-worker.js` file:
- Intercepts all network requests
- Serves files from cache when offline
- Updates cache when online
- Enables true offline functionality

### No External Dependencies

The app is now **100% self-contained**:
- ❌ No CDN dependencies
- ❌ No external API calls
- ❌ No cloud services
- ✅ All code runs locally on your device

## Sharing with Others

When you share the URL with friends/family:
1. They visit once (needs internet)
2. They add to home screen
3. From then on, works offline for them too
4. Each person uses their own .kdbx files

## Updates

If you update the app code:
- Users need internet once to get updates
- Service worker automatically updates cache
- Then works offline again with new version

## Storage

The app uses minimal storage:
- App files: ~200 KB
- Cached in browser storage
- Your .kdbx files: Stored separately (not in app cache)
- No storage limits for your password files

## Privacy Benefits of Offline

Since everything works offline:
- 🔒 No data sent to servers
- 🔒 No tracking possible
- 🔒 No analytics
- 🔒 Complete privacy
- 🔒 Works in airplane mode
- 🔒 Works without cell service
- 🔒 Works without WiFi

## Comparison with Native Apps

| Feature | This PWA | Native App |
|---------|----------|------------|
| Offline | ✅ Yes | ✅ Yes |
| App Store | ❌ No | ✅ Required |
| Updates | Auto | Manual |
| Storage | Browser | App sandbox |
| Privacy | 100% local | 100% local |
| Cost | Free | Free/$99 dev |

## Troubleshooting Offline Issues

**App won't load offline?**
- Make sure you added it to home screen (not just bookmarked)
- Visit once while online to cache files
- Check Safari settings allow offline storage

**"Add to Home Screen" missing?**
- Must use Safari (not Chrome on iOS)
- Must be served over HTTPS (not HTTP)
- Must have manifest.json properly configured

**Files not caching?**
- Check browser console for service worker errors
- Clear cache and try again
- Ensure all files are in correct locations

## Best Practices

1. **Initial setup** - Do while connected to WiFi
2. **Keep .kdbx files** - Store in iPhone Files app or iCloud
3. **Regular backups** - Keep .kdbx files backed up elsewhere
4. **Test offline** - Try airplane mode after setup
5. **Update occasionally** - Connect to internet to get app updates

## Summary

✅ **Works 100% offline after initial setup**  
✅ **No internet required to use**  
✅ **All processing happens on your device**  
✅ **Your passwords never leave your phone**  
✅ **Perfect for travel, no service areas, or privacy**

---

**This is a true offline-first password manager!** 🔐✈️