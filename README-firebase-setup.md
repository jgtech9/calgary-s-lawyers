# Firebase Setup & Configuration Guide

## 1. Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Name: `calgary-lawyer-directory`
4. Enable Google Analytics (optional)
5. Create project

### Configure Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable:
   - Email/Password
   - Google
3. Configure authorized domains

### Configure Firestore Database
1. Go to **Firestore Database**
2. Click "Create database"
3. Start in **production mode** (we'll update rules later)
4. Choose location closest to your users

## 2. Environment Configuration

### Update `.env.local`
Replace placeholder values with your Firebase project credentials:

```bash
# Get these values from Firebase Console → Project Settings
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

## 3. Deploy Security Rules

### Method 1: Firebase CLI
```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize project
firebase init

# Deploy rules
firebase deploy --only firestore:rules
```

### Method 2: Firebase Console
1. Go to **Firestore Database** → **Rules** tab
2. Copy contents from `firestore.rules`
3. Paste and click "Publish"

## 4. Create Indexes

### Method 1: Firebase CLI
```bash
firebase deploy --only firestore:indexes
```

### Method 2: Firebase Console
1. Go to **Firestore Database** → **Indexes** tab
2. Click "Add index"
3. Create indexes listed in `firestore.indexes.json`

## 5. Initial Data Migration

### Run Migration Script
Once Firebase is configured, run the migration to move static data to Firestore:

```bash
# In development console
node src/data/migrateLawyersToFirestore.js
```

## 6. LSA Verification System

### For Production:
1. **Replace mock verification** in `src/lib/lsa-verification.js` with actual LSA API calls
2. **Set up environment variables** for LSA API credentials
3. **Implement file upload** for supporting documents (currently mocked)

### LSA API Integration:
```javascript
// Replace mock function with actual API call
const verifyLawyerWithLSA = async (lawyerData) => {
  const response = await fetch(`${import.meta.env.VITE_LSA_API_ENDPOINT}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${import.meta.env.VITE_LSA_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      lsa_id: lawyerData.lsa_id,
      name: lawyerData.name,
      bar_number: lawyerData.bar_number,
    }),
  });
  
  return await response.json();
};
```

## 7. Custom Claims Setup

### Cloud Function for Setting Claims:
Create a Cloud Function to set custom claims when users sign up or their role changes:

```javascript
// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

exports.setCustomClaims = functions.firestore
  .document('users/{userId}')
  .onWrite(async (change, context) => {
    const userData = change.after.data();
    const userId = context.params.userId;
    
    try {
      await admin.auth().setCustomUserClaims(userId, {
        admin: userData.role === 'admin',
        lawyer: userData.role === 'lawyer',
        verified: userData.is_verified || false
      });
      
      console.log(`Custom claims set for user ${userId}`);
    } catch (error) {
      console.error('Error setting custom claims:', error);
    }
  });
```

## 8. Security Hardening Checklist

### ✅ Completed:
- [x] Firestore security rules with RBAC
- [x] Custom claims system for admin/lawyer roles
- [x] LSA verification system with admin panel
- [x] QuickExit security fix (replace instead of href)
- [x] PII protection in Firestore schema
- [x] Environment variable configuration

### 🔄 In Progress:
- [ ] Deploy Cloud Functions for custom claims
- [ ] Set up Firebase Storage for document uploads
- [ ] Implement actual LSA API integration
- [ ] Add audit logging for sensitive operations

### 📋 Pending:
- [ ] Set up Firebase Hosting for production
- [ ] Configure SSL/TLS certificates
- [ ] Implement rate limiting
- [ ] Set up monitoring and alerts

## 9. Testing the System

### 1. Authentication Test:
```bash
# Test signup
curl -X POST "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","returnSecureToken":true}'
```

### 2. Firestore Rules Test:
Use Firebase Emulator Suite to test security rules before deployment.

### 3. LSA Verification Test:
1. Create a lawyer profile with LSA ID
2. Submit verification request
3. Approve as admin
4. Verify badge appears on profile

## 10. Production Deployment

### Step 1: Build Application
```bash
npm run build
```

### Step 2: Deploy to Firebase Hosting
```bash
firebase deploy --only hosting
```

### Step 3: Deploy Cloud Functions
```bash
firebase deploy --only functions
```

### Step 4: Final Security Audit
1. Review all environment variables
2. Test all authentication flows
3. Verify Firestore rules
4. Test QuickExit functionality
5. Confirm LSA verification workflow

## 11. Monitoring & Maintenance

### Regular Tasks:
- **Daily**: Check verification requests
- **Weekly**: Review security logs
- **Monthly**: Update LSA verification cache
- **Quarterly**: Security audit and rule review

### Alert Setup:
1. Firebase Crashlytics for errors
2. Cloud Monitoring for performance
3. Security alerts for suspicious activity

## 12. Troubleshooting

### Common Issues:

1. **Authentication Errors**:
   - Check Firebase API key in environment
   - Verify authorized domains in Firebase Console
   - Check custom claims Cloud Function

2. **Firestore Permission Errors**:
   - Verify security rules are deployed
   - Check user has correct custom claims
   - Test with Firebase Emulator

3. **LSA Verification Failures**:
   - Check API credentials
   - Verify LSA ID format
   - Check network connectivity to LSA API

### Support:
- Firebase Documentation: https://firebase.google.com/docs
- LSA API Documentation: Contact Law Society of Alberta
- Security Questions: Consult with security team

---

**Next Steps:**
1. Update `.env.local` with your Firebase credentials
2. Deploy Firestore rules and indexes
3. Run initial data migration
4. Test the complete authentication and verification flow
5. Deploy to production

**Security Note:** Never commit `.env.local` to version control. Add it to `.gitignore`.
