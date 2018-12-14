/**
 * Created with <3 by drouar_b
 */

const ipRangeCheck = require("ip-range-check");

class IPFilter {
    static filter(mask, handle) {
        if (!mask) {
            throw new TypeError('argument IP source is required')
        }

        if (!handle) {
            throw new TypeError('argument handle is required')
        }

        if (typeof handle !== 'function') {
            throw new TypeError('argument handle must be a function')
        }
        
        return function filterIP(req, res, next) {
            if (!ipRangeCheck(req.socket.localAddress, mask)) {
                return next();
            } else {
                handle(req, res, next);
            }
        }
    }
}

module.exports = IPFilter;