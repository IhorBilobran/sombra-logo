"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector3_1 = require("./Vector3");
var Math_1 = require("./Math");
/**
 * @author bhouston / http://clara.io
 */
var Line3 = /** @class */ (function () {
    function Line3(start, end) {
        if (start === void 0) { start = new Vector3_1.Vector3(); }
        if (end === void 0) { end = new Vector3_1.Vector3(); }
        this.start = start;
        this.end = end;
    }
    Line3.prototype.set = function (start, end) {
        this.start.copy(start);
        this.end.copy(end);
        return this;
    };
    Line3.prototype.clone = function () {
        return new this.constructor().copy(this);
    };
    Line3.prototype.copy = function (line) {
        this.start.copy(line.start);
        this.end.copy(line.end);
        return this;
    };
    Line3.prototype.getCenter = function (result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        return result.addVectors(this.start, this.end).multiplyScalar(0.5);
    };
    Line3.prototype.delta = function (result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        return result.subVectors(this.end, this.start);
    };
    Line3.prototype.distanceSq = function () {
        return this.start.distanceToSquared(this.end);
    };
    Line3.prototype.distance = function () {
        return this.start.distanceTo(this.end);
    };
    Line3.prototype.at = function (t, result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        return this.delta(result).multiplyScalar(t).add(this.start);
    };
    Line3.prototype.closestPointToPointParameter = function (point, clampToLine) {
        var startP = Line3.closestPointToPointParameter_startP;
        var startEnd = Line3.closestPointToPointParameter_startEnd;
        startP.subVectors(point, this.start);
        startEnd.subVectors(this.end, this.start);
        var startEnd2 = startEnd.dot(startEnd);
        var startEnd_startP = startEnd.dot(startP);
        var t = startEnd_startP / startEnd2;
        if (clampToLine) {
            t = Math_1._Math.clamp(t, 0, 1);
        }
        return t;
    };
    Line3.prototype.closestPointToPoint = function (point, clampToLine, result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        var t = this.closestPointToPointParameter(point, clampToLine);
        return this.delta(result).multiplyScalar(t).add(this.start);
    };
    Line3.prototype.applyMatrix4 = function (matrix) {
        this.start.applyMatrix4(matrix);
        this.end.applyMatrix4(matrix);
        return this;
    };
    Line3.prototype.equals = function (line) {
        return line.start.equals(this.start) && line.end.equals(this.end);
    };
    Line3.prototype.center = function (result) {
        console.warn("THREE.Line3: .center() has been renamed to .getCenter().");
        return this.getCenter(result);
    };
    Line3.closestPointToPointParameter_startP = new Vector3_1.Vector3();
    Line3.closestPointToPointParameter_startEnd = new Vector3_1.Vector3();
    return Line3;
}());
exports.Line3 = Line3;
//# sourceMappingURL=Line3.js.map