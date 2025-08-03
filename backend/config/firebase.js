import admin from "firebase-admin";
import "dotenv/config";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT_PATH);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;