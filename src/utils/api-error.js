'use strict';

class APIError extends Error {
    constructor(announce, { status, err }) {
        const wasError = (err instanceof Error);
        const wasPublicError = (err instanceof APIError);

        if (wasPublicError) {
            // Inherit first `Thrower` announce and status (override following)
            announce = err.announce;
            status = err.status;
        }

        super((wasError) ? err.message : announce); // Inherit first `Error` message
        this.announce = announce || 'An error has occurred';
        this.status = (Number.isInteger(status)) ? status : 500;
        this.trace = null;
        if (wasError) this.trace = (wasPublicError) ? err.trace : err;
    }
}

module.exports = new Proxy(APIError, {
    apply(Target, thisArg, args) {
        return new Target(...args);
    }
});
