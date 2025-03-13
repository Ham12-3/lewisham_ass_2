import * as admin from "firebase-admin";

// More robust error handling for parsing the service account
let serviceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || "{}");

  if (!serviceAccount.project_id) {
    console.error("Invalid service account format or missing project_id");
  }
} catch (error) {
  console.error("Error parsing Firebase service account JSON:", error);
  // Provide reasonable defaults or throw error based on your needs
  serviceAccount = {};
}

// Initialize Firebase Admin
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Firebase Admin initialization error:", error);
  }
}

// Export firestore admin
export const adminDb = admin.firestore();

// Export Firebase Admin instance
export default admin;
