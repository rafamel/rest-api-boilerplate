'use strict';

class Thrower extends Error {
    constructor(announce, { status, err }) {
        const wasError = (err instanceof Error);
        const wasThrower = (err instanceof Thrower);

        if (wasThrower) {
            // Inherit first `Thrower` announce and status (override following)
            announce = err.announce;
            status = err.status;
        }

        super((wasError) ? err.message : announce); // Inherit first `Error` message
        this.announce = announce || 'An error has occurred';
        this.status = (Number.isInteger(status)) ? status : 500;
        this.trace = null;
        if (wasError) this.trace = (wasThrower) ? err.trace : err;
    }
}

module.exports = Thrower;
