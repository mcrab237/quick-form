# Business Information Form

A secure multi-step form application for collecting business information with an admin dashboard to view submissions.

## Features

- **Multi-step Form**: Intuitive 7-step form with progress tracking
- **Form Validation**: Real-time validation with helpful error messages
- **Confirmation Screen**: Review all data before submission
- **Secure Storage**: Data stored securely in Firebase Firestore
- **Admin Dashboard**: Protected admin view to manage submissions
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to access the form.

## Routes

| Route              | Description                                          |
| ------------------ | ---------------------------------------------------- |
| `/`                | Public form for users to submit business information |
| `/admin`           | Admin login page                                     |
| `/admin/dashboard` | Protected admin dashboard to view submissions        |

## Form Sections

1. **Business Type**: Partnership, LLC, or Corporation
2. **Business Information**: Legal name, EIN, description, industry
3. **Company Address**: Business physical address
4. **Account Representative**: Authorized signatory details
5. **Additional Owners**: Optional - owners with 25%+ stake
6. **Bank Account**: Payout bank account details
7. **Review**: Confirmation screen before submission

## Admin Access

To access the admin dashboard, you need to:

1. Navigate to `/admin`
2. Log in with Firebase Auth credentials
3. The user must exist in Firebase Authentication

### Creating an Admin User

You can create an admin user through the Firebase Console:

1. Go to Firebase Console > Authentication > Users
2. Add a new user with email/password
3. Go to Firestore > users collection
4. Create a document with the user's UID containing:
   ```json
   {
     "role": "admin",
     "email": "admin@example.com"
   }
   ```

## Firebase Configuration

The app is configured to use the following Firebase project:

- Project ID: `atlast-tech-orbital`

## Firestore Security Rules

The `businessSubmissions` collection has the following rules:

- **Create**: Anyone can submit the form (public access)
- **Read/Update/Delete**: Only authenticated users

To deploy the Firestore rules:

```bash
firebase deploy --only firestore:rules
```

## Environment

This project uses:

- React 19
- Vite
- Tailwind CSS
- Firebase (Firestore + Auth)
- Lucide React Icons

## Build for Production

```bash
npm run build
npm run preview
```

## Security Notes

- Sensitive data (SSN, bank account numbers) are masked in the UI
- Only last 4 digits of SSN are collected
- All data is stored securely in Firestore
- Admin access requires Firebase Authentication
