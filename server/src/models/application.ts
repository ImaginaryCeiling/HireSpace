import mongoose from "mongoose";

interface IApplication {
    internship: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    fitAnswer: string;
    resumeUrl: string;
}

const applicationSchema = new mongoose.Schema<IApplication>({
    internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fitAnswer: { type: String, required: true },
    resumeUrl: { type: String, required: true },
}, { timestamps: true });

const Application = mongoose.model<IApplication>('Application', applicationSchema);

function createApplication(attr: IApplication) {
    return new Application(attr);
}

export { Application, IApplication, createApplication };
