import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
	email: string;
	passwordHash: string;
	referralCode: string;
	referredBy?: mongoose.Types.ObjectId | null;
	credits: number;
	hasPurchased: boolean;
}

const UserSchema = new Schema<IUser>(
	{
		email: { type: String, required: true, unique: true, index: true },
		passwordHash: { type: String, required: true },
		referralCode: { type: String, required: true, unique: true, index: true },
		referredBy: { type: Schema.Types.ObjectId, ref: 'User', default: null },
		credits: { type: Number, default: 0 },
		hasPurchased: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

export const User: Model<IUser> =
	mongoose.models.User || mongoose.model<IUser>('User', UserSchema);



