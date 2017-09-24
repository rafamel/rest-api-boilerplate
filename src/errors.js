'use strict';
module.exports = {
    thrower() {
        Error.prototype.public = 'An error has occurred';
        Error.prototype.status = 500;
        Error.thrower = function thrower(obj, err) {
            if (err) {
                // Preserves original error message, status, and public values
                obj.message = err.message;
                if (err.hasOwnProperty('status')) obj.status = err.status;
                if (err.hasOwnProperty('public')) obj.public = err.public;
            }
            // Create error object
            const ans = new Error(obj.message || obj.public || Error.prototype.public);
            if (obj.hasOwnProperty('status')) ans.status = obj.status;
            if (obj.hasOwnProperty('public')) ans.public = obj.public;
            return ans;
        };
    },
    handle(app) {
        // Catch 404 and forward to error handler
        app.use((req, res, next) => {
            next(Error.thrower({ public: 'Not Found', status: 404 }));
        });

        // Error handler
        app.use((err, req, res, next) => {
            if (err.message !== err.public) console.error(err);
            if (!err.status) err = Error(String(err));
            res.status(err.status)
                .json({
                    status: 'error',
                    message: err.public
                });
        });
    }
}
