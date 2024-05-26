// Create routes/jobs.js and controllers/jobs.js. The router should have each of the routes previously described, and the controller should have functions to call when each route is invoked. Remember that req.params will have the id of the entry to be edited, updated, or deleted. You might want to start with simple res.send() operations to make sure each of the routes and controller functions are getting called as expected.

const express = require('express');
const router = express.Router();
const jobsController = require('../controllers/jobs');

// So, you should have routes something like this:

// GET /jobs (display all the job listings belonging to this user)
// POST /jobs (Add a new job listing)
// GET /jobs/new (Put up the form to create a new entry)
// GET /jobs/edit/:id (Get a particular entry and show it in the edit box)
// POST /jobs/update/:id (Update a particular entry)
// POST /jobs/delete/:id (Delete an entry)

router.get('/', jobsController.getAllJobs);
router.post('/', jobsController.createJob);
router.get('/new', jobsController.newJobForm);
router.get('/edit/:id', jobsController.editJobForm);
router.post('/update/:id', jobsController.updateJob);
router.post('/delete/:id', jobsController.deleteJob);

module.exports = router;
