// Create routes/jobs.js and controllers/jobs.js. The router should have each of the routes previously described, and the controller should have functions to call when each route is invoked. Remember that req.params will have the id of the entry to be edited, updated, or deleted. You might want to start with simple res.send() operations to make sure each of the routes and controller functions are getting called as expected.

const Job = require('../models/Job');

const getAllJobs = async (req, res) => {
    try {
        const jobs = await Job.find({ createdBy: req.user._id });

        res.render('jobs', { jobs });
    } catch (error) {
        console.error(error);
        res.status(500).send('error retrieving items');
    }
};

const createJob = async (req, res) => {
    try {
        const { company, position, status } = req.body;

        const newJob = new Job({
            company,
            position,
            status,
            createdBy: req.user._id,
        });

        await newJob.save();
        res.redirect('/jobs');
    } catch (error) {
        console.error(error);
        res.status(500).send('error adding an item');
    }
};

// When adding, you’ll do res.render("job", { job: null }). That will tell job.ejs that it is doing an add because there’s no value in the job local variable.
const newJobForm = (req, res) => {
    res.render('job', { job: null });
};

const editJobForm = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).send('item not found');
        }

        if (job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send('you do not have permission');
        }
        //  When editing, you’ll do res.render("job", { job }). When a non-null entry is passed to job.ejs, then the form knows it is doing an edit, so the fields are populated and the button says update.
        res.render('job', { job });
    } catch (error) {
        console.error(error);
        res.status(500).send('error retrieving an item for editing');
    }
};

const updateJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const { company, position, status } = req.body;

        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).send('item not found');
        }

        if (job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send('you do not have permission');
        }

        job.company = company;
        job.position = position;
        job.status = status;

        await job.save();
        res.redirect('/jobs');
    } catch (error) {
        console.error(error);
        res.status(500).send('error updating item');
    }
};

const deleteJob = async (req, res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId);

        if (!job) {
            return res.status(404).send('item not found');
        }

        if (job.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).send('you do not have permission');
        }

        await Job.deleteOne({ _id: jobId });
        res.redirect('/jobs');
    } catch (error) {
        console.error(error);
        res.status(500).send('error deleting the item');
    }
};

module.exports = {
    getAllJobs,
    createJob,
    newJobForm,
    editJobForm,
    updateJob,
    deleteJob,
};
