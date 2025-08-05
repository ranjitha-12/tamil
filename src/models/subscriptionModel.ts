import mongoose from 'mongoose';

const SubscriptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: String, required: true },
  features: { type: [String], required: true },
  value: { type: String, required: true, unique: true },
}, { timestamps: true });

const SubscriptionModel = mongoose.models.Subscription || mongoose.model('Subscription', SubscriptionSchema);
export default SubscriptionModel;
