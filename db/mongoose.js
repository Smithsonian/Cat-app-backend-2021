import mongoose from 'mongoose';

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err, db) =>
  err ? console.log(err) : console.log(`Connected to MongoDB @ ${db.connections[0].host}`)
);
