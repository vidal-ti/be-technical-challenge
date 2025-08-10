import * as admin from 'firebase-admin';

class FirebaseConnection {
  private static instance: FirebaseConnection;
  private db: admin.firestore.Firestore;

  private constructor() {
    try {
      // En Cloud Functions, admin.initializeApp() ya se hace en index.ts
      if (!admin.apps || admin.apps.length === 0) {
        admin.initializeApp();
      }

      this.db = admin.firestore();
      this.db.settings({
        ignoreUndefinedProperties: true,
      });

      console.log('Firebase Firestore initialized in Cloud Functions');
    } catch (error) {
      console.error('Error initializing Firebase:', error);
      throw error;
    }
  }

  public static getInstance(): FirebaseConnection {
    if (!FirebaseConnection.instance) {
      FirebaseConnection.instance = new FirebaseConnection();
    }
    return FirebaseConnection.instance;
  }

  public getDb(): admin.firestore.Firestore {
    return this.db;
  }
}

export default FirebaseConnection;
