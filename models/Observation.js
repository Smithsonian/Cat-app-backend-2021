import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const observationSchema = new Schema({
  sequence_id: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true,
      index: '2d'
    }
  },
  date_time_original: { type: String, required: true },
  images: { type: [{ image_id: { type: String, required: true } }], required: true }
});

export default model('Observation', observationSchema);
