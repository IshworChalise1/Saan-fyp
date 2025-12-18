import dotenv from 'dotenv';
dotenv.config();

const config = {
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/saan_db',
  jwtSecret: process.env.JWT_SECRET || 'your_secret_key_here',
  jwtExpire: process.env.JWT_EXPIRE || '7d',
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development'
};

export default config;
