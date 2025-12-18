#!/bin/bash
# Diagnostic script to check login flow

echo "======================================"
echo "Login Redirect Diagnostic"
echo "======================================"
echo ""

# Check if backend is running
echo "1. Checking if backend is running..."
curl -s http://localhost:5000 > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✓ Backend is running on port 5000"
else
    echo "✗ Backend is NOT running"
    echo "  Start it with: cd backend && npm run dev"
    exit 1
fi

echo ""
echo "2. Testing login endpoint..."

# Test user login
RESPONSE=$(curl -s -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@gmail.com","password":"user@123"}')

echo "Response: $RESPONSE"

# Check if response has success
if echo "$RESPONSE" | grep -q '"success":true'; then
    echo "✓ Login returned success"
    
    # Extract role
    ROLE=$(echo "$RESPONSE" | grep -o '"role":"[^"]*"' | cut -d'"' -f4)
    echo "  Role returned: $ROLE"
    
    if [ "$ROLE" = "user" ]; then
        echo "✓ Role is 'user' - should redirect to /home"
    else
        echo "✗ Role is '$ROLE' - check UserHome access check"
    fi
else
    echo "✗ Login failed"
fi

echo ""
echo "3. Checking frontend..."
echo "  - Open http://localhost:5173 in your browser"
echo "  - Open browser DevTools (F12)"
echo "  - Go to Console tab"
echo "  - Try logging in"
echo "  - Look for console.log messages showing login flow"

echo ""
echo "======================================"
echo "Troubleshooting:"
echo "======================================"
echo ""
echo "If login doesn't redirect:"
echo "1. Check browser console for errors"
echo "2. Verify localStorage has 'token' and 'userRole'"
echo "3. Check Network tab to see actual API response"
echo "4. Verify /home route exists in App.jsx"
echo "5. Check UserHome.jsx access control (useEffect)"
echo ""
