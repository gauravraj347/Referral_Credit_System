import { Response } from 'express';
import { z } from 'zod';
import { simulatePurchase } from '../services';
import { AuthRequest } from '../middleware';

export async function purchase(req: AuthRequest, res: Response) {
	const bodySchema = z.object({ amount: z.number().positive() });
	const parsed = bodySchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const result = await simulatePurchase({ userId: req.userId!, amount: parsed.data.amount });
		return res.json(result);
	} catch (err: any) {
		return res.status(400).json({ error: err.message || 'Purchase failed' });
	}
}



