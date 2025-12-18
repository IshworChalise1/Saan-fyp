@echo off
REM Diagnostic script to identify "Failed to fetch" error

echo.
echo ======================================
echo SAN - Failed to Fetch Diagnostic
echo ======================================
echo.

REM Check MongoDB
echo Checking MongoDB...
netstat -ano | findstr :27017 > nul
if %errorlevel% equ 0 (
    echo ✓ MongoDB port 27017 is open
) else (
    echo ✗ MongoDB port 27017 is NOT open
    echo   Start MongoDB with: mongod
)

echo.

REM Check Backend
echo Checking Backend...
powershell -Command "$null = Invoke-WebRequest -Uri 'http://localhost:5000' -ErrorAction SilentlyContinue; if ($?) { Write-Host '✓ Backend is running on port 5000' } else { Write-Host '✗ Backend is NOT running' }"

echo.

REM Check if port 5000 is in use
echo Checking port 5000...
netstat -ano | findstr :5000 > nul
if %errorlevel% equ 0 (
    echo ✓ Something is listening on port 5000
    echo   (Should be the backend server)
) else (
    echo ✗ Port 5000 is not in use
    echo   Start backend with: cd backend && npm run dev
)

echo.

REM Check Frontend running
echo Checking Frontend...
netstat -ano | findstr :5173 > nul
if %errorlevel% equ 0 (
    echo ✓ Frontend appears to be running on port 5173
) else (
    echo ✗ Frontend is NOT running on port 5173
    echo   Start frontend with: cd Saan && npm run dev
)

echo.

REM Check API URL in frontend .env
echo Checking Frontend Configuration...
if exist "Saan\.env" (
    for /f "tokens=*" %%i in (Saan\.env) do (
        if "%%i"=="VITE_API_URL=http://localhost:5000/api" (
            echo ✓ Frontend .env has correct API URL
        ) else if "%%i"=="VITE_API_URL=http://localhost:3000/api" (
            echo ✗ Frontend .env has WRONG API URL (port 3000, should be 5000)
            echo   Fix: Update Saan\.env to VITE_API_URL=http://localhost:5000/api
        )
    )
) else (
    echo ✗ Saan\.env not found!
)

echo.

REM Test API directly
echo Testing API Connectivity...
powershell -Command "
try {
    `$response = Invoke-WebRequest -Uri 'http://localhost:5000/api/auth' -ErrorAction SilentlyContinue
    Write-Host '✓ Backend API is responding'
} catch {
    Write-Host '✗ Backend API is NOT responding'
    Write-Host '  Make sure backend is running: cd backend && npm run dev'
}
"

echo.
echo ======================================
echo Summary
echo ======================================
echo.
echo If you see ✗ marks above, fix those issues:
echo.
echo 1. If MongoDB not running:
echo    mongod
echo.
echo 2. If Backend not running:
echo    cd backend
echo    npm install
echo    npm run seed
echo    npm run dev
echo.
echo 3. If Frontend not running:
echo    cd Saan
echo    npm install
echo    npm run dev
echo.
echo 4. If API URL is wrong:
echo    Edit Saan\.env
echo    Change to: VITE_API_URL=http://localhost:5000/api
echo    Restart frontend: npm run dev
echo.
echo ======================================
echo.
pause
