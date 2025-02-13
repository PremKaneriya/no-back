import mongoose, { model, models } from "mongoose";
import bcrypt from "bcryptjs";

export type MyUser = {
    _id?: mongoose.Types.ObjectId;
    phoneNumber: number;
    email: string;
    password: string;
    createdAt?: Date;
    updatedAt?: Date;
}

const userSchema = new mongoose.Schema<MyUser>({
    phoneNumber: {
        type: Number,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
})

const User = models?.User || model<MyUser>("User", userSchema);

export default User