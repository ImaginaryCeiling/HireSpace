import express from 'express';
import { Types } from 'mongoose';
import { createInternship, Internship } from '../models/internship';
import { createApplication, Application } from '../models/application';

const router = express.Router();

router.post('/internship', async (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    // Create the internship
    const internship = createInternship({
        title: req.body.title,
        description: req.body.description,
        companyName: req.body.companyName,
        tags: req.body.tags,
        location: req.body.location,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
        hoursPerWeek: req.body.hoursPerWeek,
        hourlyRate: req.body.hourlyRate,
        applicationUrl: req.body.applicationUrl,
        approved: false,
        // @ts-ignore - _id always exists on the User object despite TypeScript not recognizing it
        creator: req.user._id,
    });
    await internship.save();

    res.status(200).send(internship);
});

router.get('/internships', async (req, res) => {
    const internships = await Internship.find({});
    res.status(200).send(internships);
});

router.get('/internship/:id', async (req, res) => {
    // Validate the ID so it doesn't crash the server if it's invalid
    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }

    // Find the internship
    const internship = await Internship.findOne({ _id: req.params.id });
    if (!internship) {
        return res.status(404).send('Internship not found');
    }

    res.status(200).send(internship);
});

router.patch('/internship/:id/approve', async (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    // Check if the user has moderator permissions
    // @ts-ignore - roles always exists on the User object despite TypeScript not recognizing it
    if (!req.user?.roles.includes('moderator')) {
        return res.status(403).send('Not authorized');
    }

    // Validate the ID so it doesn't crash the server if it's invalid
    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }

    // Find the internship
    const internship = await Internship.findOne({ _id: req.params.id });
    if (!internship) {
        return res.status(404).send('Internship not found');
    }

    // Approve the internship
    internship.approved = true;
    await internship.save();

    res.status(200).send(internship);
});

router.delete('/internship/:id/reject', async (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    // Check if the user has moderator permissions
    // @ts-ignore - roles always exists on the User object despite TypeScript not recognizing it
    if (!req.user?.roles.includes('moderator')) {
        return res.status(403).send('Not authorized');
    }

    // Validate the ID so it doesn't crash the server if it's invalid
    if (!Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid ID');
    }

    // Find the internship
    const internship = await Internship.findOne({ _id: req.params.id });
    if (!internship) {
        return res.status(404).send('Internship not found');
    }

    // Reject the internship
    await internship.deleteOne();

    res.status(200).send("Internship rejected");
});

router.post(
    '/internship/:id/apply',
    async (req, res) => {
        // Check if the user is authenticated
        if (!req.isAuthenticated()) {
            return res.status(401).send('Not authenticated');
        }

        // Check if the user has the student role
        // @ts-ignore - roles always exists on the User object despite TypeScript not recognizing it
        if (!req.user?.roles.includes('student')) {
            return res.status(403).send('Not authorized');
        }

        const { id } = req.params;
        const { fitAnswer, resumeUrl } = req.body;
        // @ts-ignore - _id always exists on the User object despite TypeScript not recognizing it
        const userId = req.user._id;

        // Validate the internship ID
        if (!Types.ObjectId.isValid(id)) {
            return res.status(400).send('Invalid internship ID');
        }

        try {
            // Check if the internship exists
            const internship = await Internship.findById(id);
            if (!internship) {
                return res.status(404).send('Internship not found');
            }

            // Create a new application
            const application = new Application({
                internship: id,
                internshipCreator: internship.creator,
                user: userId,
                fitAnswer,
                resumeUrl,
            });

            // Save the application to the database
            await application.save();

            res.status(200).json({ message: 'Application submitted successfully' });
        } catch (error) {
            console.error('Error submitting application:', error);
            res.status(500).json({ error: 'An error occurred while submitting the application' });
        }
    }
);

router.get('/applications/pending', async (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    // Check if the user has the employer role
    // @ts-ignore - roles always exists on the User object despite TypeScript not recognizing it
    if (!req.user?.roles.includes('employer')) {
        return res.status(403).send('Not authorized');
    }

    // @ts-ignore - _id always exists on the User object despite TypeScript not recognizing it
    const userId = req.user._id;

    try {
        // Find all applications for the internships created by the employer
        const applications = await Application.find({ internshipCreator: userId });

        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ error: 'An error occurred while fetching the applications' });
    }
});

router.get('/application/:id', async (req, res) => {
    // Check if the user is authenticated
    if (!req.isAuthenticated()) {
        return res.status(401).send('Not authenticated');
    }

    // Check if the user has the employer role
    // @ts-ignore - roles always exists on the User object despite TypeScript not recognizing it
    if (!req.user?.roles.includes('employer')) {
        return res.status(403).send('Not authorized');
    }

    const applicationId = req.params.id;

    try {
        // Find the application by ID
        const application = await Application.findById(applicationId);

        if (!application) {
            return res.status(404).send('Application not found');
        }

        // Check if the authenticated user is the creator of the internship
        // @ts-ignore - _id always exists on the User object despite TypeScript not recognizing it
        if (application.internshipCreator.toString() !== req.user._id.toString()) {
            return res.status(403).send('Not authorized to view this application');
        }

        res.status(200).json(application);
    } catch (error) {
        console.error('Error fetching application:', error);
        res.status(500).json({ error: 'An error occurred while fetching the application' });
    }
});

export { router as internshipRouter };