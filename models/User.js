import mongoose from 'mongoose';
const { Schema, model } = mongoose;

const userSchema = new Schema({
  name: { type: String, required: true },
  role: { type: String, required: true, enum: ['user', 'admin', 'master'] },
  email: { type: String, required: true },
  password: { type: String, required: true, select: false },
  active: { type: Boolean, default: true }
});

export default model('User', userSchema);
