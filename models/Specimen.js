import mongoose from 'mongoose';
const {
  Schema,
  model,
  Types: { ObjectId }
} = mongoose;

const specimenSchema = new Schema({
  matches: [{ type: ObjectId, ref: 'Observation' }]
});

export default model('Specimen', specimenSchema);
