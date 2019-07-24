"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @author mrdoob / http://mrdoob.com/
 */
var Layers = /** @class */ (function () {
    function Layers() {
        this.mask = 1;
    }
    Layers.prototype.set = function (channel) {
        this.mask = 1 << channel;
    };
    Layers.prototype.enable = function (channel) {
        this.mask |= 1 << channel;
    };
    Layers.prototype.toggle = function (channel) {
        this.mask ^= 1 << channel;
    };
    Layers.prototype.disable = function (channel) {
        this.mask &= ~(1 << channel);
    };
    Layers.prototype.test = function (layers) {
        return (this.mask & layers.mask) !== 0;
    };
    return Layers;
}());
exports.Layers = Layers;
//# sourceMappingURL=Layers.js.map