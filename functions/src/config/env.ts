import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

function loadFirebaseServiceAccount(value?: string) {
  if (!value) return null;

  if (value.endsWith('.json')) {
    const filePath = path.resolve(value);
    if (!fs.existsSync(filePath)) {
      console.warn(`Archivo Firebase no encontrado: ${filePath}`);
      return null;
    }
    return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  }

  try {
    return JSON.parse(value);
  } catch {
    console.warn('FIREBASE_SERVICE_ACCOUNT no es un JSON válido');
    return null;
  }
}

export const config = {
  PORT: process.env.PORT || 3000,
  JWT_SECRET: process.env.JWT_SECRET || 'secret-jwt-key-challenge-2025',
  FIREBASE_SERVICE_ACCOUNT: loadFirebaseServiceAccount(process.env.FIREBASE_SERVICE_ACCOUNT),
  NODE_ENV: process.env.NODE_ENV || 'development',
};
