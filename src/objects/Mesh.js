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
var Vector3_1 = require("../math/Vector3");
var Vector2_1 = require("../math/Vector2");
var Sphere_1 = require("../math/Sphere");
var Ray_1 = require("../math/Ray");
var Matrix4_1 = require("../math/Matrix4");
var Object3D_1 = require("../core/Object3D");
var Triangle_1 = require("../math/Triangle");
var Face3_1 = require("../core/Face3");
var constants_1 = require("../constants");
var Geometry_1 = require("../core/Geometry");
var MultiMaterial_1 = require("../materials/MultiMaterial");
var MeshBasicMaterial_1 = require("../materials/MeshBasicMaterial");
var BufferGeometry_1 = require("../core/BufferGeometry");
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author mikael emtinger / http://gomo.se/
 * @author jonobr1 / http://jonobr1.com/
 */
var Mesh = /** @class */ (function (_super) {
    __extends(Mesh, _super);
    function Mesh(geometry, material) {
        if (geometry === void 0) { geometry = new BufferGeometry_1.BufferGeometry(); }
        if (material === void 0) { material = new MeshBasicMaterial_1.MeshBasicMaterial({ color: Math.random() * 0xffffff }); }
        var _this = _super.call(this) || this;
        _this.drawMode = constants_1.DrawMode.Triangles;
        _this.isMesh = true;
        _this.type = 'Mesh';
        _this.geometry = geometry;
        _this.material = material;
        _this.updateMorphTargets();
        return _this;
    }
    Mesh.prototype.setDrawMode = function (value) {
        this.drawMode = value;
    };
    Mesh.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.drawMode = source.drawMode;
        return this;
    };
    Mesh.prototype.updateMorphTargets = function () {
        var morphTargets = this.geometry.morphTargets;
        if (morphTargets !== undefined && morphTargets.length > 0) {
            this.morphTargetInfluences = [];
            this.morphTargetDictionary = {};
            for (var m = 0, ml = morphTargets.length; m < ml; m++) {
                this.morphTargetInfluences.push(0);
                this.morphTargetDictionary[morphTargets[m].name] = m;
            }
        }
    };
    Mesh.prototype.raycast = function (raycaster, intersects) {
        var inverseMatrix = new Matrix4_1.Matrix4();
        var ray = new Ray_1.Ray();
        var sphere = new Sphere_1.Sphere();
        var vA = new Vector3_1.Vector3();
        var vB = new Vector3_1.Vector3();
        var vC = new Vector3_1.Vector3();
        var tempA = new Vector3_1.Vector3();
        var tempB = new Vector3_1.Vector3();
        var tempC = new Vector3_1.Vector3();
        var uvA = new Vector2_1.Vector2();
        var uvB = new Vector2_1.Vector2();
        var uvC = new Vector2_1.Vector2();
        var barycoord = new Vector3_1.Vector3();
        var intersectionPoint = new Vector3_1.Vector3();
        var intersectionPointWorld = new Vector3_1.Vector3();
        function uvIntersection(point, p1, p2, p3, uv1, uv2, uv3) {
            Triangle_1.Triangle.barycoordFromPoint(point, p1, p2, p3, barycoord);
            uv1.multiplyScalar(barycoord.x);
            uv2.multiplyScalar(barycoord.y);
            uv3.multiplyScalar(barycoord.z);
            uv1.add(uv2).add(uv3);
            return uv1.clone();
        }
        function checkIntersection(object, raycaster, ray, pA, pB, pC, point) {
            var intersect;
            var material = object.material;
            if (material.side === constants_1.SideMode.Back) {
                intersect = ray.intersectTriangle(pC, pB, pA, true, point);
            }
            else {
                intersect = ray.intersectTriangle(pA, pB, pC, material.side !== constants_1.SideMode.Double, point);
            }
            if (intersect === null)
                return null;
            intersectionPointWorld.copy(point);
            intersectionPointWorld.applyMatrix4(object.matrixWorld);
            var distance = raycaster.ray.origin.distanceTo(intersectionPointWorld);
            if (distance < raycaster.near || distance > raycaster.far)
                return null;
            return {
                distance: distance,
                point: intersectionPointWorld.clone(),
                index: 0,
                face: null,
                faceIndex: 0,
                uv: null,
                object: object
            };
        }
        function checkBufferGeometryIntersection(object, raycaster, ray, positions, uvs, a, b, c) {
            vA.fromArray(positions, a * 3);
            vB.fromArray(positions, b * 3);
            vC.fromArray(positions, c * 3);
            var intersection = checkIntersection(object, raycaster, ray, vA, vB, vC, intersectionPoint);
            if (intersection) {
                if (uvs) {
                    uvA.fromArray(uvs, a * 2);
                    uvB.fromArray(uvs, b * 2);
                    uvC.fromArray(uvs, c * 2);
                    intersection.uv = uvIntersection(intersectionPoint, vA, vB, vC, uvA, uvB, uvC);
                }
                intersection.face = new Face3_1.Face3(a, b, c, Triangle_1.Triangle.normal(vA, vB, vC));
                intersection.faceIndex = a;
            }
            return intersection;
        }
        //return function raycast(raycaster, intersects) {
        var geometry = this.geometry;
        var material = this.material;
        var matrixWorld = this.matrixWorld;
        if (material === undefined)
            return intersects;
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
        // Check boundingBox before continuing
        if (geometry.boundingBox !== null) {
            if (ray.intersectsBox(geometry.boundingBox) === false)
                return intersects;
        }
        var uvs, intersection;
        if ((geometry && geometry instanceof BufferGeometry_1.BufferGeometry)) {
            var a = void 0, b = void 0, c = void 0;
            var index = geometry.index;
            var attributes = geometry.attributes;
            var positions = attributes.position.array;
            if (attributes.uv !== undefined) {
                uvs = attributes.uv.array;
            }
            if (index !== null) {
                var indices = index.array;
                for (var i = 0, l = indices.length; i < l; i += 3) {
                    a = indices[i];
                    b = indices[i + 1];
                    c = indices[i + 2];
                    intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);
                    if (intersection) {
                        intersection.faceIndex = Math.floor(i / 3); // triangle number in indices buffer semantics
                        intersects.push(intersection);
                    }
                }
            }
            else {
                for (var i = 0, l = positions.length; i < l; i += 9) {
                    a = i / 3;
                    b = a + 1;
                    c = a + 2;
                    intersection = checkBufferGeometryIntersection(this, raycaster, ray, positions, uvs, a, b, c);
                    if (intersection) {
                        intersection.index = a; // triangle number in positions buffer semantics
                        intersects.push(intersection);
                    }
                }
            }
        }
        else if ((geometry && geometry instanceof Geometry_1.Geometry)) {
            var fvA = void 0, fvB = void 0, fvC = void 0;
            var isFaceMaterial = (material && material instanceof MultiMaterial_1.MultiMaterial);
            var materials = isFaceMaterial === true ? material.materials : null;
            var vertices = geometry.vertices;
            var faces = geometry.faces;
            var faceVertexUvs = geometry.faceVertexUvs[0];
            if (faceVertexUvs.length > 0)
                uvs = faceVertexUvs;
            for (var f = 0, fl = faces.length; f < fl; f++) {
                var face = faces[f];
                var faceMaterial = isFaceMaterial === true ? materials[face.materialIndex] : material;
                if (faceMaterial === undefined)
                    continue;
                fvA = vertices[face.a];
                fvB = vertices[face.b];
                fvC = vertices[face.c];
                if (faceMaterial.morphTargets === true) {
                    var morphTargets = geometry.morphTargets;
                    var morphInfluences = this.morphTargetInfluences;
                    vA.set(0, 0, 0);
                    vB.set(0, 0, 0);
                    vC.set(0, 0, 0);
                    for (var t = 0, tl = morphTargets.length; t < tl; t++) {
                        var influence = morphInfluences[t];
                        if (influence === 0)
                            continue;
                        var targets = morphTargets[t].vertices;
                        vA.addScaledVector(tempA.subVectors(targets[face.a], fvA), influence);
                        vB.addScaledVector(tempB.subVectors(targets[face.b], fvB), influence);
                        vC.addScaledVector(tempC.subVectors(targets[face.c], fvC), influence);
                    }
                    vA.add(fvA);
                    vB.add(fvB);
                    vC.add(fvC);
                    fvA = vA;
                    fvB = vB;
                    fvC = vC;
                }
                intersection = checkIntersection(this, raycaster, ray, fvA, fvB, fvC, intersectionPoint);
                if (intersection) {
                    if (uvs) {
                        var uvs_f = uvs[f];
                        uvA.copy(uvs_f[0]);
                        uvB.copy(uvs_f[1]);
                        uvC.copy(uvs_f[2]);
                        intersection.uv = uvIntersection(intersectionPoint, fvA, fvB, fvC, uvA, uvB, uvC);
                    }
                    intersection.face = face;
                    intersection.faceIndex = f;
                    intersects.push(intersection);
                }
            }
        }
        return intersects;
        //};
    };
    Mesh.prototype.clone = function () {
        return new this.constructor(this.geometry, this.material).copy(this);
    };
    return Mesh;
}(Object3D_1.Object3D));
exports.Mesh = Mesh;
//# sourceMappingURL=Mesh.js.map