import express from 'express';
import { createApplication } from '../models/application';

const router = express.Router();

router.post('/apply', async (req, res) => {
    try {
        const {
            internship,
            internshipCreator,
            user,
            fullName,
            email,
            phoneNumber,
            age,
            location,
            education,
            workExperience,
            skills,
            fitAnswer,
            resumeUrl
        } = req.body;

        const application = createApplication({
            internship,
            internshipCreator,
            user,
            fullName,
            email,
            phoneNumber,
            age: Number(age), // Ensure age is a number
            location,
            education,
            workExperience,
            skills,
            fitAnswer,
            resumeUrl
        });

        await application.save();
        res.status(201).send(application);
    } catch (error) {
        res.status(400).send({ error: error.message });
    }
});

export default router; 