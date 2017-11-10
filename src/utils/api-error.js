'use strict';

class APIError extends Error {
    constructor(announce, { status, err, type }) {
        const wasError = (err instanceof Error);
        const wasAPIError = (err instanceof APIError);

        if (wasAPIError) {
            // Inherit first `Thrower` announce and status (override following)
            announce = err.announce;
            status = err.status;
            type = err.type;
        }

        super((wasError) ? err.message : announce); // Inherit first `Error` message
        this.announce = announce || 'An error has occurred';
        this.status = (Number.isInteger(status)) ? status : 500;
        this.trace = null;
        this.type = type || 'Unknown';
        if (wasError) this.trace = (wasAPIError) ? err.trace : err;
    }
}

module.exports = APIError;
