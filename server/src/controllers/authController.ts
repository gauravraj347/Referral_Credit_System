import { Request, Response } from 'express';
import { loginUser, registerUser } from '../services';
import { z } from 'zod';

export async function register(req: Request, res: Response) {
	const bodySchema = z.object({
		email: z.string().email(),
		password: z.string().min(6),
		referredByCode: z.string().optional(),
	});
	const parsed = bodySchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const result = await registerUser(parsed.data);
		return res.json({
			user: { id: result.user._id, email: result.user.email, referralCode: result.user.referralCode, credits: result.user.credits },
			token: result.token,
		});
	} catch (err: any) {
		return res.status(400).json({ error: err.message || 'Registration failed' });
	}
}

export async function login(req: Request, res: Response) {
	const bodySchema = z.object({ email: z.string().email(), password: z.string().min(6) });
	const parsed = bodySchema.safeParse(req.body);
	if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });
	try {
		const result = await loginUser(parsed.data);
		return res.json({
			user: { id: result.user._id, email: result.user.email, referralCode: result.user.referralCode, credits: result.user.credits },
			token: result.token,
		});
	} catch (err: any) {
		return res.status(400).json({ error: err.message || 'Login failed' });
	}
}



