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
  reasonReview: {
    type: String,
    enum: ['None', 'Not cat', 'New cat', 'New match'],
    default: 'None'
  },
  specimen: { type: ObjectId, ref: 'Specimen' },
  pattern: {
    type: String,
    enum: [
      'Black/Gray',
      'Tabby/Spotted',
      'Orange/White',
      'Tortoiseshell/Calico',
      'Siamese',
      'Unknown'
    ],
    default: 'Unknown'
  },
  bicolor: {
    type: String,
    enum: ['Yes', 'No', 'Unknown'],
    default: 'Unknown'
  },
  longHair: {
    type: String,
    enum: ['Yes', 'No', 'Unknown'],
    default: 'Unknown'
  },
  sex: {
    type: String,
    enum: ['Male', 'Female', 'Unknown'],
    default: 'Unknown'
  },
  notched: {
    type: String,
    enum: ['Yes', 'No', 'Unknown'],
    default: 'Unknown'
  },
  collar: {
    type: String,
    enum: ['Yes', 'No', 'Unknown'],
    default: 'Unknown'
  },
  isCat: { type: Boolean, default: true },
  images: { type: [{ image_id: { type: String, required: true } }], required: true }
});

export default model('Observation', observationSchema);
