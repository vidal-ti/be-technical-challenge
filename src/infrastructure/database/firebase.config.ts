import admin from 'firebase-admin';
import { config } from '../../config/env';

class FirebaseConnection {
  private static instance: FirebaseConnection;
  private db: admin.firestore.Firestore;

  private constructor() {
    try {
      const serviceAccount = config.FIREBASE_SERVICE_ACCOUNT;

      if (!serviceAccount) {
        throw new Error(
          'No se pudo cargar la configuración de Firebase. Verifica que FIREBASE_SERVICE_ACCOUNT esté configurado correctamente.'
        );
      }

      if (
        !serviceAccount.type ||
        !serviceAccount.project_id ||
        !serviceAccount.private_key ||
        !serviceAccount.client_email
      ) {
        throw new Error(
          'El archivo de configuración de Firebase no tiene el formato correcto. Faltan propiedades requeridas.'
        );
      }

      if (serviceAccount.private_key && typeof serviceAccount.private_key === 'string') {
        serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, '\n');
      }

      if (!admin.apps || admin.apps.length === 0) {
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log('Firebase inicializado correctamente');
      }

      this.db = admin.firestore();

      // ÚNICO CAMBIO NECESARIO: Agregar esta línea
      this.db.settings({
        ignoreUndefinedProperties: true,
      });
    } catch (error) {
      console.error('Error inicializando Firebase:', error);
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
