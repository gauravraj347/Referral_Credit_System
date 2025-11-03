import dotenv from 'dotenv';

dotenv.config();

export const CONFIG = {
	port: parseInt(process.env.PORT || '4000', 10),
	mongoUri: process.env.MONGO_URI || 'mongodb://mongo:27017/mydatabase',
	jwtSecret: process.env.JWT_SECRET || 'dev-secret-change-me',
};



