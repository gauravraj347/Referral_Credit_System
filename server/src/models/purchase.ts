import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IPurchase extends Document {
	user: mongoose.Types.ObjectId;
	amount: number;
	isFirstPurchase: boolean;
}

const PurchaseSchema = new Schema<IPurchase>(
	{
		user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
		amount: { type: Number, required: true },
		isFirstPurchase: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

PurchaseSchema.index(
	{ user: 1, isFirstPurchase: 1 },
	{ unique: true, partialFilterExpression: { isFirstPurchase: true } }
);

export const Purchase: Model<IPurchase> =
	mongoose.models.Purchase || mongoose.model<IPurchase>('Purchase', PurchaseSchema);



