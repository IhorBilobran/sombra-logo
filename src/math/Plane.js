"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Matrix3_1 = require("./Matrix3");
var Vector3_1 = require("./Vector3");
/**
 * @author bhouston / http://clara.io
 */
var Plane = /** @class */ (function () {
    function Plane(normal, constant) {
        if (normal === void 0) { normal = new Vector3_1.Vector3(1, 0, 0); }
        if (constant === void 0) { constant = 0; }
        this.normal = normal;
        this.constant = constant;
    }
    Plane.prototype.set = function (normal, constant) {
        this.normal.copy(normal);
        this.constant = constant;
        return this;
    };
    Plane.prototype.setComponents = function (x, y, z, w) {
        this.normal.set(x, y, z);
        this.constant = w;
        return this;
    };
    Plane.prototype.setFromNormalAndCoplanarPoint = function (normal, point) {
        this.normal.copy(normal);
        this.constant = -point.dot(this.normal); // must be this.normal, not normal, as this.normal is normalized
        return this;
    };
    Plane.prototype.setFromCoplanarPoints = function (a, b, c) {
        var v1 = Plane.setFromCoplanarPoints_v1;
        var v2 = Plane.setFromCoplanarPoints_v2;
        var normal = v1.subVectors(c, b).cross(v2.subVectors(a, b)).normalize();
        // Q: should an error be thrown if normal is zero (e.g. degenerate plane)?
        this.setFromNormalAndCoplanarPoint(normal, a);
        return this;
    };
    Plane.prototype.clone = function () {
        return new this.constructor().copy(this);
    };
    Plane.prototype.copy = function (plane) {
        this.normal.copy(plane.normal);
        this.constant = plane.constant;
        return this;
    };
    Plane.prototype.normalize = function () {
        // Note: will lead to a divide by zero if the plane is invalid.
        var inverseNormalLength = 1.0 / this.normal.length();
        this.normal.multiplyScalar(inverseNormalLength);
        this.constant *= inverseNormalLength;
        return this;
    };
    Plane.prototype.negate = function () {
        this.constant *= -1;
        this.normal.negate();
        return this;
    };
    Plane.prototype.distanceToPoint = function (point) {
        return this.normal.dot(point) + this.constant;
    };
    Plane.prototype.distanceToSphere = function (sphere) {
        return this.distanceToPoint(sphere.center) - sphere.radius;
    };
    Plane.prototype.projectPoint = function (point, result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        return this.orthoPoint(point, result).sub(point).negate();
    };
    Plane.prototype.orthoPoint = function (point, result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        var perpendicularMagnitude = this.distanceToPoint(point);
        return result.copy(this.normal).multiplyScalar(perpendicularMagnitude);
    };
    Plane.prototype.intersectLine = function (line, result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        var v1 = Plane.intersectLine_v1;
        var direction = line.delta(v1);
        var denominator = this.normal.dot(direction);
        if (denominator === 0) {
            // line is coplanar, return origin
            if (this.distanceToPoint(line.start) === 0) {
                return result.copy(line.start);
            }
            // Unsure if this is the correct method to handle this case.
            return undefined;
        }
        var t = -(line.start.dot(this.normal) + this.constant) / denominator;
        if (t < 0 || t > 1) {
            return undefined;
        }
        return result.copy(direction).multiplyScalar(t).add(line.start);
    };
    Plane.prototype.intersectsLine = function (line) {
        // Note: this tests if a line intersects the plane, not whether it (or its end-points) are coplanar with it.
        var startSign = this.distanceToPoint(line.start);
        var endSign = this.distanceToPoint(line.end);
        return (startSign < 0 && endSign > 0) || (endSign < 0 && startSign > 0);
    };
    Plane.prototype.intersectsBox = function (box) {
        return box.intersectsPlane(this);
    };
    Plane.prototype.intersectsSphere = function (sphere) {
        return sphere.intersectsPlane(this);
    };
    Plane.prototype.coplanarPoint = function (result) {
        if (result === void 0) { result = new Vector3_1.Vector3(); }
        return result.copy(this.normal).multiplyScalar(-this.constant);
    };
    Plane.prototype.applyMatrix4 = function (matrix, optionalNormalMatrix) {
        var v1 = Plane.applyMatrix4_v1;
        var m1 = Plane.applyMatrix4_m1;
        var referencePoint = this.coplanarPoint(v1).applyMatrix4(matrix);
        // transform normal based on theory here:
        // http://www.songho.ca/opengl/gl_normaltransform.html
        var normalMatrix = optionalNormalMatrix || m1.getNormalMatrix(matrix);
        var normal = this.normal.applyMatrix3(normalMatrix).normalize();
        // recalculate constant (like in setFromNormalAndCoplanarPoint)
        this.constant = -referencePoint.dot(normal);
        return this;
    };
    Plane.prototype.translate = function (offset) {
        this.constant = this.constant - offset.dot(this.normal);
        return this;
    };
    Plane.prototype.equals = function (plane) {
        return plane.normal.equals(this.normal) && (plane.constant === this.constant);
    };
    Plane.prototype.isIntersectionLine = function (line) {
        console.warn("THREE.Plane: .isIntersectionLine() has been renamed to .intersectsLine().");
        return this.intersectsLine(line);
    };
    Plane.setFromCoplanarPoints_v1 = new Vector3_1.Vector3();
    Plane.setFromCoplanarPoints_v2 = new Vector3_1.Vector3();
    Plane.intersectLine_v1 = new Vector3_1.Vector3();
    Plane.applyMatrix4_v1 = new Vector3_1.Vector3();
    Plane.applyMatrix4_m1 = new Matrix3_1.Matrix3();
    return Plane;
}());
exports.Plane = Plane;
//# sourceMappingURL=Plane.js.map