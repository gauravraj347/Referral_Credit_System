import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReferral extends Document {
	referrer: mongoose.Types.ObjectId;
	referee: mongoose.Types.ObjectId;
	status: 'pending' | 'converted';
}

const ReferralSchema = new Schema<IReferral>(
	{
		referrer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		referee: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true, index: true },
		status: { type: String, enum: ['pending', 'converted'], default: 'pending' },
	},
	{ timestamps: true }
);

ReferralSchema.index({ referrer: 1, referee: 1 }, { unique: true });

export const Referral: Model<IReferral> =
	mongoose.models.Referral || mongoose.model<IReferral>('Referral', ReferralSchema);



