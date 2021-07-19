import mongoose from 'mongoose';
const {
  Schema,
  model,
  Types: { ObjectId }
} = mongoose;

const observationSchema = new Schema({
  project_id: { type: String, required: true },
  deployment_id: { type: String, required: true },
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
  date_time_original: { type: Date, required: true },
  forReview: { type: Boolean, default: false },
  specimen: { type: ObjectId, ref: 'Specimen' },
  status: {
    type: String,
    enum: ['Unknown', 'Colony/Community/Notched ear', 'Euthanized', 'House', 'Shelter', 'Stray/Wild'],
    default: 'Unknown'
  },
  pattern: {
    type: String,
    enum: [
      'Unknown',
      'Tabby/Tiger',
      'Tortoiseshell',
      'Black/Grey',
      'Orange/White',
      'Calico',
      'Solid',
      'Bicolor',
      'Points',
      'Spotted',
      'Siamese'
    ],
    default: 'Unknown'
  },
  primaryColor: {
    type: String,
    enum: ['Unknown', 'Black', 'Brown', 'Buff/Tan', 'Gray', 'Orange', 'White'],
    default: 'Unknown'
  },
  secondaryColor: {
    type: String,
    enum: ['Unknown', 'Black', 'Brown', 'Buff/Tan', 'Gray', 'Orange', 'White'],
    default: 'Unknown'
  },
  images: { type: [{ image_id: { type: String, required: true } }], required: true }
});

export default model('Observation', observationSchema);
