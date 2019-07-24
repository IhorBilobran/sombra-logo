"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Sphere_1 = require("../math/Sphere");
var Ray_1 = require("../math/Ray");
var Matrix4_1 = require("../math/Matrix4");
var Object3D_1 = require("../core/Object3D");
var Vector3_1 = require("../math/Vector3");
var PointsMaterial_1 = require("../materials/PointsMaterial");
var Geometry_1 = require("../core/Geometry");
var BufferGeometry_1 = require("../core/BufferGeometry");
/**
 * @author alteredq / http://alteredqualia.com/
 */
var Points = /** @class */ (function (_super) {
    __extends(Points, _super);
    function Points(geometry, material) {
        if (geometry === void 0) { geometry = new BufferGeometry_1.BufferGeometry(); }
        if (material === void 0) { material = new PointsMaterial_1.PointsMaterial({ color: Math.random() * 0xffffff }); }
        var _this = _super.call(this) || this;
        _this.isPoints = true;
        _this.type = 'Points';
        _this.geometry = geometry;
        _this.material = material;
        return _this;
    }
    Points.prototype.raycast = function (raycaster, intersects) {
        var inverseMatrix = new Matrix4_1.Matrix4();
        var ray = new Ray_1.Ray();
        var sphere = new Sphere_1.Sphere();
        //return function raycast(raycaster, intersects) {
        var object = this;
        var geometry = this.geometry;
        var matrixWorld = this.matrixWorld;
        var threshold = raycaster.params.Points.threshold;
        // Checking boundingSphere distance to ray
        if (geometry.boundingSphere === null)
            geometry.computeBoundingSphere();
        sphere.copy(geometry.boundingSphere);
        sphere.applyMatrix4(matrixWorld);
        if (raycaster.ray.intersectsSphere(sphere) === false)
            return intersects;
        //
        inverseMatrix.getInverse(matrixWorld);
        ray.copy(raycaster.ray).applyMatrix4(inverseMatrix);
        var localThreshold = threshold / ((this.scale.x + this.scale.y + this.scale.z) / 3);
        var localThresholdSq = localThreshold * localThreshold;
        var position = new Vector3_1.Vector3();
        function testPoint(point, index) {
            var rayPointDistanceSq = ray.distanceSqToPoint(point);
            if (rayPointDistanceSq < localThresholdSq) {
                var intersectPoint = ray.closestPointToPoint(point);
                intersectPoint.applyMatrix4(matrixWorld);
                var distance = raycaster.ray.origin.distanceTo(intersectPoint);
                if (distance < raycaster.near || distance > raycaster.far)
                    return;
                intersects.push({
                    distance: distance,
                    distanceToRay: Math.sqrt(rayPointDistanceSq),
                    point: intersectPoint.clone(),
                    index: index,
                    face: null,
                    object: object
                });
            }
        }
        if ((geometry && geometry instanceof BufferGeometry_1.BufferGeometry)) {
            var index = geometry.index;
            var attributes = geometry.attributes;
            var positions = attributes.position.array;
            if (index !== null) {
                var indices = index.array;
                for (var i = 0, il = indices.length; i < il; i++) {
                    var a = indices[i];
                    position.fromArray(positions, a * 3);
                    testPoint(position, a);
                }
            }
            else {
                for (var i = 0, l = positions.length / 3; i < l; i++) {
                    position.fromArray(positions, i * 3);
                    testPoint(position, i);
                }
            }
        }
        else if (geometry && geometry instanceof Geometry_1.Geometry) {
            var vertices = geometry.vertices;
            for (var i = 0, l = vertices.length; i < l; i++) {
                testPoint(vertices[i], i);
            }
        }
        return intersects;
        //};
    };
    Points.prototype.clone = function () {
        return new this.constructor(this.geometry, this.material).copy(this);
    };
    return Points;
}(Object3D_1.Object3D));
exports.Points = Points;
//# sourceMappingURL=Points.js.map