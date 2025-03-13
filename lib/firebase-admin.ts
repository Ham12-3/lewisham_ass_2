import * as admin from "firebase-admin";

// Your service account details
const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}"
);

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
  });
}

// Export firestore admin
export const adminDb = admin.firestore();

// Export Firebase Admin instance
export default admin;
