#!/bin/bash

# Task 1.1a Test Case 1.1a.3: Rate Limiting Test
# This script tests the rate limiting on the login endpoint

API_URL="http://localhost:4010/api/v1"
EMAIL="admin@vulhub.com"
WRONG_PASSWORD="wrongpassword"

echo "=================================================="
echo "Task 1.1a Test Case 1.1a.3: Rate Limiting Test"
echo "=================================================="
echo ""
echo "Testing login rate limiting with 6 failed attempts..."
echo "Expected: Attempts 1-5 should fail with 'Invalid credentials'"
echo "Expected: Attempt 6 should fail with rate limit error (429)"
echo ""

for i in {1..6}; do
  echo "---"
  echo "Attempt $i:"
  echo "---"
  
  RESPONSE=$(curl -s -w "\n%{http_code}" -X POST $API_URL/auth/login \
    -H "Content-Type: application/json" \
    -d "{\"email\":\"$EMAIL\",\"password\":\"$WRONG_PASSWORD\"}")
  
  # Extract HTTP status (last line) and body (everything else)
  HTTP_STATUS=$(echo "$RESPONSE" | tail -n 1)
  BODY=$(echo "$RESPONSE" | sed '$d')
  
  echo "HTTP Status: $HTTP_STATUS"
  echo "Response:"
  echo "$BODY" | jq . 2>/dev/null || echo "$BODY"
  echo ""
  
  # Check if rate limited (429)
  if [ "$HTTP_STATUS" = "429" ]; then
    echo "✅ RATE LIMITED (Expected on attempt 6)"
    break
  elif [ "$HTTP_STATUS" = "401" ] || [ "$HTTP_STATUS" = "400" ]; then
    echo "✅ INVALID CREDENTIALS (Expected on attempts 1-5)"
  else
    echo "⚠️ Unexpected HTTP status: $HTTP_STATUS"
  fi
  
  sleep 0.5
done

echo ""
echo "=================================================="
echo "Rate Limiting Test Complete"
echo "=================================================="
echo ""
echo "Next: Review results in PHASE1_TEST_EXECUTION_LOG.md"
