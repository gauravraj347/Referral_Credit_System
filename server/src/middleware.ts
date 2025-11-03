import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { CONFIG } from './config';

export interface AuthRequest extends Request {
	userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });
	const token = authHeader.replace('Bearer ', '');
	try {
		const payload = jwt.verify(token, CONFIG.jwtSecret) as { userId: string };
		req.userId = payload.userId;
		return next();
	} catch (err) {
		return res.status(401).json({ error: 'Invalid or expired token' });
	}
}



