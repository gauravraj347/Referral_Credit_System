import { Response } from 'express';
import { getDashboard } from '../services';
import { AuthRequest } from '../middleware';

export async function dashboard(req: AuthRequest, res: Response) {
	try {
		const data = await getDashboard(req.userId!);
		return res.json(data);
	} catch (err: any) {
		return res.status(400).json({ error: err.message || 'Failed to fetch dashboard' });
	}
}



