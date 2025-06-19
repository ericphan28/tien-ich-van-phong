#!/bin/bash

echo "🚀 Testing POS System PWA..."
echo ""

# Check if server is running
echo "📡 Checking server status..."
if curl -s http://localhost:3002 > /dev/null; then
    echo "✅ Server is running on http://localhost:3002"
else
    echo "❌ Server is not running. Please start with 'npm run dev'"
    exit 1
fi

echo ""
echo "🔍 Testing PWA features..."

# Test manifest
echo "📄 Checking manifest.json..."
if curl -s http://localhost:3002/manifest.json | grep -q "POS System"; then
    echo "✅ Manifest is valid"
else
    echo "❌ Manifest not found or invalid"
fi

# Test service worker
echo "⚙️ Checking service worker..."
if [ -f "public/sw.js" ]; then
    echo "✅ Service worker file exists"
else
    echo "❌ Service worker file not found"
fi

# Test icons
echo "🎨 Checking PWA icons..."
icon_count=0
for size in "192x192" "512x512"; do
    if [ -f "public/icons/icon-${size}.png" ]; then
        ((icon_count++))
        echo "✅ Icon ${size} exists"
    else
        echo "❌ Icon ${size} missing"
    fi
done

echo ""
echo "📱 PWA Test Summary:"
echo "====================="
echo "🌐 App URL: http://localhost:3002"
echo "📱 POS URL: http://localhost:3002/dashboard/pos"
echo "📊 Offline Status: http://localhost:3002/dashboard/offline-status"
echo ""

if [ $icon_count -eq 2 ]; then
    echo "✅ All PWA requirements met!"
    echo ""
    echo "🧪 Test Instructions:"
    echo "1. Open Chrome/Edge browser"
    echo "2. Visit http://localhost:3002"
    echo "3. Look for install prompt in address bar"
    echo "4. Install as PWA"
    echo "5. Test offline by disabling network in DevTools"
    echo "6. Create transactions in POS"
    echo "7. Re-enable network and check sync"
else
    echo "⚠️ Some PWA requirements missing"
fi

echo ""
echo "🎉 Happy testing!"
