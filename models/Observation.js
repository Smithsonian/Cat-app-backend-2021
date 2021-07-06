import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const observationSchema = new Schema({
  sequence_id: { type: String, required: true },
  latitude: { type: String, required: true },
  longitude: { type: String, required: true },
  date_time_original: { type: String, required: true },
  images: { type: [{ image_id: { type: String, required: true } }], required: true }
});

export default model('Observation', observationSchema);
