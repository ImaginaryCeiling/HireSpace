import mongoose from "mongoose";

interface IUser {
    username: string;
    password: string;
    salt: string;
    email: string;
    roles: string[];
    internships: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<IUser>({
    username: { type: String, required: true },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    email: { type: String, required: true },
    roles: { type: [String], required: true },
    internships: { type: [mongoose.Schema.Types.ObjectId], required: true },
}, { timestamps: true });

const User = mongoose.model<IUser>('User', userSchema);

function createUser(attr: IUser) {
    return new User(attr);
}

export { User, IUser, createUser };