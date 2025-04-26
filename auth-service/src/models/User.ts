import mongoose, { InferSchemaType, Model } from 'mongoose';

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
});

type UserType = InferSchemaType<typeof UserSchema>;

export const User: Model<UserType> = mongoose.model('User', UserSchema);
