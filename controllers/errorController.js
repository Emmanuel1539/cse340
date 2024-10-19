const triggerError = (req, res, next) => {
    const error = Error('This is an intentional server error.');
    error.status = 500;
    next(error);
}

module.exports = triggerError;