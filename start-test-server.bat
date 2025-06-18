@echo off
echo 🧮 Starting Tax Calculator Test Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Node.js not found. Please install Node.js first.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js found
echo 🚀 Starting server on port 3001...
echo.

REM Start simple HTTP server
node -e "const http = require('http'); const fs = require('fs'); const path = require('path'); const server = http.createServer((req, res) => { console.log('Request:', req.url); if (req.url === '/' || req.url === '/test' || req.url === '/index.html') { const filePath = path.join(__dirname, 'test-tax-calculator.html'); fs.readFile(filePath, (err, data) => { if (err) { console.error('Error reading file:', err); res.writeHead(404, {'Content-Type': 'text/html'}); res.end('<h1>404 - File not found</h1>'); } else { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); } }); } else if (req.url.endsWith('.html')) { const filePath = path.join(__dirname, req.url.slice(1)); fs.readFile(filePath, (err, data) => { if (err) { res.writeHead(404, {'Content-Type': 'text/html'}); res.end('<h1>404 - File not found</h1>'); } else { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); } }); } else { res.writeHead(404, {'Content-Type': 'text/html'}); res.end('<h1>404 - Not found</h1><p>Available routes:</p><ul><li><a href=\"/\">/ (Tax Calculator)</a></li><li><a href=\"/test\">test-tax-calculator.html</a></li></ul>'); } }); const PORT = 3001; server.listen(PORT, () => { console.log('🎉 Server started successfully!'); console.log(''); console.log('📍 Local URLs:'); console.log('   Main page: http://localhost:' + PORT); console.log('   Test page: http://localhost:' + PORT + '/test'); console.log(''); console.log('🔗 Click any link above or copy to browser'); console.log('⏹️  Press Ctrl+C to stop server'); console.log(''); }); server.on('error', (err) => { console.error('❌ Server error:', err.message); if (err.code === 'EADDRINUSE') { console.log('🔄 Port 3001 is busy. Trying port 3002...'); const server2 = http.createServer((req, res) => { if (req.url === '/' || req.url === '/test') { const filePath = path.join(__dirname, 'test-tax-calculator.html'); fs.readFile(filePath, (err, data) => { if (err) { res.writeHead(404); res.end('File not found'); } else { res.writeHead(200, {'Content-Type': 'text/html'}); res.end(data); } }); } else { res.writeHead(404); res.end('Not found'); } }); server2.listen(3002, () => console.log('🎉 Server running on http://localhost:3002')); } });"

pause
