#!/bin/bash

echo "🚀 Firestore Rules Deployment Script"
echo "===================================="

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI is not installed"
    echo "📦 Installing Firebase CLI..."
    npm install -g firebase-tools
fi

# Check if user is logged in
echo "🔐 Checking Firebase authentication..."
firebase login --no-localhost

if [ $? -ne 0 ]; then
    echo "❌ Firebase login failed"
    echo "💡 Please run: firebase login --no-localhost"
    exit 1
fi

echo "✅ Firebase CLI is ready"

# Deploy Firestore rules
echo "📤 Deploying Firestore rules..."
firebase deploy --only firestore:rules

if [ $? -eq 0 ]; then
    echo "✅ Firestore rules deployed successfully!"
    echo ""
    echo "📋 DEPLOYMENT SUMMARY:"
    echo "======================"
    echo "• Project: calgary-lawyer-directory-d4c44"
    echo "• Rules: Development mode (open access)"
    echo "• Status: Active"
    echo ""
    echo "💡 To switch to production rules:"
    echo "   1. Edit firestore.rules"
    echo "   2. Comment out development block"
    echo "   3. Uncomment production rules"
    echo "   4. Run this script again"
else
    echo "❌ Deployment failed"
    exit 1
fi
