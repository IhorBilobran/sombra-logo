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
var Mesh_1 = require("./Mesh");
var Vector4_1 = require("../math/Vector4");
var Skeleton_1 = require("./Skeleton");
var Bone_1 = require("./Bone");
var Matrix4_1 = require("../math/Matrix4");
var Geometry_1 = require("../core/Geometry");
var BufferGeometry_1 = require("../core/BufferGeometry");
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */
var SkinnedMesh = /** @class */ (function (_super) {
    __extends(SkinnedMesh, _super);
    function SkinnedMesh(geometry, material, useVertexTexture) {
        if (useVertexTexture === void 0) { useVertexTexture = true; }
        var _this = _super.call(this, geometry, material) || this;
        _this.bindMode = "attached";
        _this.bindMatrix = new Matrix4_1.Matrix4();
        _this.bindMatrixInverse = new Matrix4_1.Matrix4();
        _this.isSkinnedMesh = true;
        _this.type = 'SkinnedMesh';
        // init bones
        // TODO: remove bone creation as there is no reason (other than
        // convenience) for THREE.SkinnedMesh to do this.
        var bones = [];
        if (_this.geometry && _this.geometry.bones !== undefined) {
            var bone = void 0, gbone = void 0;
            for (var b = 0, bl = _this.geometry.bones.length; b < bl; ++b) {
                gbone = _this.geometry.bones[b];
                bone = new Bone_1.Bone(_this);
                bones.push(bone);
                bone.name = gbone.name;
                bone.position.fromArray(gbone.pos);
                bone.quaternion.fromArray(gbone.rotq);
                if (gbone.scl !== undefined)
                    bone.scale.fromArray(gbone.scl);
            }
            for (var b = 0, bl = _this.geometry.bones.length; b < bl; ++b) {
                gbone = _this.geometry.bones[b];
                if (gbone.parent !== -1 && gbone.parent !== null &&
                    bones[gbone.parent] !== undefined) {
                    bones[gbone.parent].add(bones[b]);
                }
                else {
                    _this.add(bones[b]);
                }
            }
        }
        _this.normalizeSkinWeights();
        _this.updateMatrixWorld(true);
        _this.bind(new Skeleton_1.Skeleton(bones, undefined, useVertexTexture), _this.matrixWorld);
        return _this;
    }
    SkinnedMesh.prototype.bind = function (skeleton, bindMatrix) {
        this.skeleton = skeleton;
        if (bindMatrix === undefined) {
            this.updateMatrixWorld(true);
            this.skeleton.calculateInverses();
            bindMatrix = this.matrixWorld;
        }
        this.bindMatrix.copy(bindMatrix);
        this.bindMatrixInverse.getInverse(bindMatrix);
    };
    SkinnedMesh.prototype.pose = function () {
        this.skeleton.pose();
    };
    SkinnedMesh.prototype.normalizeSkinWeights = function () {
        if ((this.geometry && this.geometry instanceof Geometry_1.Geometry)) {
            for (var i = 0; i < this.geometry.skinWeights.length; i++) {
                var sw = this.geometry.skinWeights[i];
                var scale = 1.0 / sw.lengthManhattan();
                if (scale !== Infinity) {
                    sw.multiplyScalar(scale);
                }
                else {
                    sw.set(1, 0, 0, 0); // do something reasonable
                }
            }
        }
        else if ((this.geometry && this.geometry instanceof BufferGeometry_1.BufferGeometry)) {
            var vec = new Vector4_1.Vector4();
            var skinWeight = this.geometry.attributes.skinWeight;
            for (var i = 0; i < skinWeight.count; i++) {
                vec.x = skinWeight.getX(i);
                vec.y = skinWeight.getY(i);
                vec.z = skinWeight.getZ(i);
                vec.w = skinWeight.getW(i);
                var scale = 1.0 / vec.lengthManhattan();
                if (scale !== Infinity) {
                    vec.multiplyScalar(scale);
                }
                else {
                    vec.set(1, 0, 0, 0); // do something reasonable
                }
                skinWeight.setXYZW(i, vec.x, vec.y, vec.z, vec.w);
            }
        }
    };
    SkinnedMesh.prototype.updateMatrixWorld = function (force) {
        _super.prototype.updateMatrixWorld.call(this, true);
        if (this.bindMode === "attached") {
            this.bindMatrixInverse.getInverse(this.matrixWorld);
        }
        else if (this.bindMode === "detached") {
            this.bindMatrixInverse.getInverse(this.bindMatrix);
        }
        else {
            console.warn('THREE.SkinnedMesh unrecognized bindMode: ' + this.bindMode);
        }
    };
    SkinnedMesh.prototype.clone = function () {
        return new this.constructor(this.geometry, this.material, this.skeleton.useVertexTexture).copy(this);
    };
    return SkinnedMesh;
}(Mesh_1.Mesh));
exports.SkinnedMesh = SkinnedMesh;
//# sourceMappingURL=SkinnedMesh.js.map