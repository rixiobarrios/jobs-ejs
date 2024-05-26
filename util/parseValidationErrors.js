// If there is a Mongoose validation error when creating a user record, we need to parse the validation error object to return the issues to the user in a more helpful format, and we do that in the file util/parseValidationErrs.js:

const parseValidationErrors = (e, req) => {
    const keys = Object.keys(e.errors);
    keys.forEach((key) => {
        req.flash('error', key + ': ' + e.errors[key].properties.message);
    });
};

module.exports = parseValidationErrors;
