import mongoose from 'mongoose';

const fullnameSchema = new mongoose.Schema(
    {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    { _id: false }
);

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        fullname: { type: fullnameSchema, required: true },
        password: {
            type: String,
            required: function () {
                return !this.googleId;
            },
        },
        googleId: {
            type: String,
        },
        role: {
            type: String,
            enum: ['user', 'artist'],
            default: 'user',
        },
    },
    { timestamps: true }
);

const user = mongoose.model('user', userSchema);

export default user;