import mongoose from "mongoose";

interface IApplication {
    internship: mongoose.Types.ObjectId;
    internshipCreator: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    fullName: string;
    email: string;
    phoneNumber: string;
    age: number;
    location: string;
    education: string;
    workExperience: string;
    skills: string;
    fitAnswer: string;
    resumeUrl: string;
}

const applicationSchema = new mongoose.Schema<IApplication>({
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    internshipCreator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    age: { type: Number, required: true },
    location: { type: String, required: true },
    education: { type: String, required: true },
    workExperience: { type: String, required: true },
    skills: { type: String, required: true },
    fitAnswer: { type: String, required: true },
    resumeUrl: { type: String, required: true },
}, { timestamps: true });

const Application = mongoose.model<IApplication>('Application', applicationSchema);

function createApplication(attr: IApplication) {
    return new Application(attr);
}

export { Application, IApplication, createApplication };
