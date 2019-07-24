"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author alteredq / http://alteredqualia.com/
 * @author mrdoob / http://mrdoob.com/
 */
var _Math = /** @class */ (function () {
    function _Math() {
    }
    _Math.generateUUID = function () {
        var chars = _Math.generateUUID_chars;
        var uuid = _Math.generateUUID_uuid;
        for (var i = 0; i < 36; i++) {
            if (i === 8 || i === 13 || i === 18 || i === 23) {
                uuid[i] = '-';
            }
            else if (i === 14) {
                uuid[i] = '4';
            }
            else {
                var rnd = _Math.generateUUID_rnd;
                if (rnd <= 0x02)
                    rnd = 0x2000000 + (Math.random() * 0x1000000) | 0;
                var r = rnd & 0xf;
                _Math.generateUUID_rnd = rnd >> 4;
                uuid[i] = chars[(i === 19) ? (r & 0x3) | 0x8 : r];
            }
        }
        return uuid.join('');
    };
    _Math.clamp = function (value, min, max) {
        return Math.max(min, Math.min(max, value));
    };
    // compute euclidian modulo of m % n
    // https://en.wikipedia.org/wiki/Modulo_operation
    _Math.euclideanModulo = function (n, m) {
        return ((n % m) + m) % m;
    };
    // Linear mapping from range <a1, a2> to range <b1, b2>
    _Math.mapLinear = function (x, a1, a2, b1, b2) {
        return b1 + (x - a1) * (b2 - b1) / (a2 - a1);
    };
    // https://en.wikipedia.org/wiki/Linear_interpolation
    _Math.lerp = function (x, y, t) {
        return (1 - t) * x + t * y;
    };
    // http://en.wikipedia.org/wiki/Smoothstep
    _Math.smoothstep = function (x, min, max) {
        if (x <= min)
            return 0;
        if (x >= max)
            return 1;
        x = (x - min) / (max - min);
        return x * x * (3 - 2 * x);
    };
    _Math.smootherstep = function (x, min, max) {
        if (x <= min)
            return 0;
        if (x >= max)
            return 1;
        x = (x - min) / (max - min);
        return x * x * x * (x * (x * 6 - 15) + 10);
    };
    _Math.random16 = function () {
        console.warn('THREE.Math.random16() has been deprecated. Use Math.random() instead.');
        return Math.random();
    };
    // Random integer from <low, high> interval
    _Math.randInt = function (low, high) {
        return low + Math.floor(Math.random() * (high - low + 1));
    };
    // Random float from <low, high> interval
    _Math.randFloat = function (low, high) {
        return low + Math.random() * (high - low);
    };
    // Random float from <-range/2, range/2> interval
    _Math.randFloatSpread = function (range) {
        return range * (0.5 - Math.random());
    };
    _Math.degToRad = function (degrees) {
        return degrees * _Math.DEG2RAD;
    };
    _Math.radToDeg = function (radians) {
        return radians * _Math.RAD2DEG;
    };
    _Math.isPowerOfTwo = function (value) {
        return (value & (value - 1)) === 0 && value !== 0;
    };
    _Math.nearestPowerOfTwo = function (value) {
        return Math.pow(2, Math.round(Math.log(value) / Math.LN2));
    };
    _Math.nextPowerOfTwo = function (value) {
        value--;
        value |= value >> 1;
        value |= value >> 2;
        value |= value >> 4;
        value |= value >> 8;
        value |= value >> 16;
        value++;
        return value;
    };
    _Math.DEG2RAD = Math.PI / 180;
    _Math.RAD2DEG = 180 / Math.PI;
    _Math.generateUUID_chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    _Math.generateUUID_uuid = new Array(36);
    _Math.generateUUID_rnd = 0;
    return _Math;
}());
exports._Math = _Math;
//# sourceMappingURL=Math.js.map