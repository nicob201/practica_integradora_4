import mongoose from "mongoose";

const userCollection = "Users";

const userSchema = new mongoose.Schema({
  first_name: String,
  last_name: String,
  email: { type: String, unique: true },
  age: Number,
  password: String,
  githubId: { type: String, unique: true, sparse: true },
  cart: [
    {
      id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Carts",
      },
    },
  ],
  role: {
    type: String,
    enum: ['user', 'premium'],
    default: 'user',
  },
  resetToken: {
    type: String,
    default: null,
  },
  documents: [
    {
      name: String,
      reference: String,
    },
  ],
  last_connection: {
    type: Date,
    default: null,
  },
});

const usersCollection = mongoose.model(userCollection, userSchema);

export default usersCollection;
