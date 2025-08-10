import dotenv from 'dotenv';
dotenv.config();

import FirebaseConnection from './src/infrastructure/database/firebase.config.js';

(async () => {
  try {
    console.log('🔥 Iniciando test de Firebase...');
    const db = FirebaseConnection.getInstance().getDb();
    const snapshot = await db.collection('test').get();

    console.log(`✅ Conexión exitosa. Documentos encontrados: ${snapshot.size}`);
  } catch (error) {
    console.error('❌ Error conectando a Firebase:', error);
    process.exit(1);
  }
})();
