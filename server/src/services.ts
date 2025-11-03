import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { CONFIG } from './config';
import { User, Referral, Purchase } from './models/index';

export function generateReferralCode(email: string): string {
	const [namePart = ''] = email.split('@');
	const base = namePart.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
	const suffix = Math.random().toString(36).slice(2, 6).toUpperCase();
	return `${base}${suffix}`.slice(0, 12);
}

export async function registerUser(params: { email: string; password: string; referredByCode?: string }) {
	const { email, password, referredByCode } = params;
	const existing = await User.findOne({ email });
	if (existing) throw new Error('Email already registered');

	const passwordHash = await bcrypt.hash(password, 10);
	let referralCode = generateReferralCode(email);

	// Ensure referral code uniqueness
	// Try regenerating a few times if collision occurs
	for (let i = 0; i < 5; i++) {
		const inUse = await User.findOne({ referralCode });
		if (!inUse) break;
		referralCode = generateReferralCode(email);
	}

	let referredBy: mongoose.Types.ObjectId | null = null;
	if (referredByCode) {
		const referrer = await User.findOne({ referralCode: referredByCode });
		if (referrer) {
			referredBy = referrer._id as mongoose.Types.ObjectId;
		}
	}

	const user = await User.create({ email, passwordHash, referralCode, referredBy });

	// Create referral relationship if referred
	if (referredBy) {
		await Referral.create({ referrer: referredBy, referee: user._id, status: 'pending' });
	}

	const token = jwt.sign({ userId: String(user._id) }, CONFIG.jwtSecret, { expiresIn: '7d' });
	return { user, token };
}

export async function loginUser(params: { email: string; password: string }) {
	const { email, password } = params;
	const user = await User.findOne({ email });
	if (!user) throw new Error('Invalid credentials');
	const ok = await bcrypt.compare(password, user.passwordHash);
	if (!ok) throw new Error('Invalid credentials');
	const token = jwt.sign({ userId: String(user._id) }, CONFIG.jwtSecret, { expiresIn: '7d' });
	return { user, token };
}

export async function simulatePurchase(params: { userId: string; amount: number }) {
	const session = await mongoose.startSession();
	session.startTransaction();
	try {
		const user = await User.findById(params.userId).session(session);
		if (!user) throw new Error('User not found');

		const isFirst = !user.hasPurchased;
		// Create purchase record; ensure first purchase uniqueness via index
		await Purchase.create([{ user: user._id, amount: params.amount, isFirstPurchase: isFirst }], { session });

		if (isFirst) {
			// Mark user's first purchase
			user.hasPurchased = true;
			await user.save({ session });

			// Award credits if referred and not yet converted
			if (user.referredBy) {
				const referral = await Referral.findOne({ referee: user._id }).session(session);
				if (referral && referral.status !== 'converted') {
					referral.status = 'converted';
					await referral.save({ session });

					// Add credits to both users
					await User.updateOne({ _id: user._id }, { $inc: { credits: 2 } }).session(session);
					await User.updateOne({ _id: user.referredBy }, { $inc: { credits: 2 } }).session(session);
				}
			}
		}

		await session.commitTransaction();
		return { success: true, isFirstPurchase: isFirst };
	} catch (err) {
		await session.abortTransaction();
		throw err;
	} finally {
		session.endSession();
	}
}

export async function getDashboard(userId: string) {
	const user = await User.findById(userId);
	if (!user) throw new Error('User not found');

	const totalReferred = await Referral.countDocuments({ referrer: user._id });
	const converted = await Referral.countDocuments({ referrer: user._id, status: 'converted' });

	return {
		referralCode: user.referralCode,
		totalReferredUsers: totalReferred,
		convertedUsers: converted,
		totalCredits: user.credits,
	};
}


