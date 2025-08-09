import dotenv from 'dotenv'; // Corrected typo from dotnev

dotenv.config();

const config = {
  app: {
    PORT: process.env.PORT,
  },
  db: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Added JWT secret for global access
  auth: {
    JWT_SECRET: process.env.JWT_SECRET,
  },
};

export default config;