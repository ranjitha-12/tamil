import { Schema, model, models } from 'mongoose';

const CarouselSchema = new Schema({
  url: { type: String, required: true },
  public_id: { type: String, required: true },
}, { timestamps: true });

export default models.Carousel || model('Carousel', CarouselSchema);
