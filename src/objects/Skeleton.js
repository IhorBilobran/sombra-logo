"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Matrix4_1 = require("../math/Matrix4");
var constants_1 = require("../constants");
var DataTexture_1 = require("../textures/DataTexture");
var Math_1 = require("../math/Math");
var Bone_1 = require("./Bone");
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author michael guerrero / http://realitymeltdown.com
 * @author ikerr / http://verold.com
 */
var Skeleton = /** @class */ (function () {
    function Skeleton(bones, boneInverses, useVertexTexture) {
        if (bones === void 0) { bones = []; }
        if (useVertexTexture === void 0) { useVertexTexture = true; }
        this.identityMatrix = new Matrix4_1.Matrix4();
        this.useVertexTexture = useVertexTexture;
        // copy the bone array
        this.bones = bones.slice(0);
        // create a bone texture or an array of floats
        if (this.useVertexTexture) {
            // layout (1 matrix = 4 pixels)
            //      RGBA RGBA RGBA RGBA (=> column1, column2, column3, column4)
            //  with  8x8  pixel texture max   16 bones * 4 pixels =  (8 * 8)
            //       16x16 pixel texture max   64 bones * 4 pixels = (16 * 16)
            //       32x32 pixel texture max  256 bones * 4 pixels = (32 * 32)
            //       64x64 pixel texture max 1024 bones * 4 pixels = (64 * 64)
            var size = Math.sqrt(this.bones.length * 4); // 4 pixels needed for 1 matrix
            size = Math_1._Math.nextPowerOfTwo(Math.ceil(size));
            size = Math.max(size, 4);
            this.boneTextureWidth = size;
            this.boneTextureHeight = size;
            this.boneMatrices = new Float32Array(this.boneTextureWidth * this.boneTextureHeight * 4); // 4 floats per RGBA pixel
            this.boneTexture = new DataTexture_1.DataTexture(this.boneMatrices, this.boneTextureWidth, this.boneTextureHeight, constants_1.TextureFormat.RGBA, constants_1.TextureType.Float);
        }
        else {
            this.boneMatrices = new Float32Array(16 * this.bones.length);
        }
        // use the supplied bone inverses or calculate the inverses
        if (boneInverses === undefined) {
            this.calculateInverses();
        }
        else {
            if (this.bones.length === boneInverses.length) {
                this.boneInverses = boneInverses.slice(0);
            }
            else {
                console.warn('THREE.Skeleton bonInverses is the wrong length.');
                this.boneInverses = [];
                for (var b = 0, bl = this.bones.length; b < bl; b++) {
                    this.boneInverses.push(new Matrix4_1.Matrix4());
                }
            }
        }
    }
    Skeleton.prototype.calculateInverses = function () {
        this.boneInverses = [];
        for (var b = 0, bl = this.bones.length; b < bl; b++) {
            var inverse = new Matrix4_1.Matrix4();
            if (this.bones[b]) {
                inverse.getInverse(this.bones[b].matrixWorld);
            }
            this.boneInverses.push(inverse);
        }
    };
    Skeleton.prototype.pose = function () {
        var bone;
        // recover the bind-time world matrices
        for (var b = 0, bl = this.bones.length; b < bl; b++) {
            bone = this.bones[b];
            if (bone) {
                bone.matrixWorld.getInverse(this.boneInverses[b]);
            }
        }
        // compute the local matrices, positions, rotations and scales
        for (var b = 0, bl = this.bones.length; b < bl; b++) {
            bone = this.bones[b];
            if (bone) {
                if ((bone.parent && bone.parent instanceof Bone_1.Bone)) {
                    bone.matrix.getInverse(bone.parent.matrixWorld);
                    bone.matrix.multiply(bone.matrixWorld);
                }
                else {
                    bone.matrix.copy(bone.matrixWorld);
                }
                bone.matrix.decompose(bone.position, bone.quaternion, bone.scale);
            }
        }
    };
    Skeleton.prototype.update = function () {
        var offsetMatrix = Skeleton.update_offsetMatrix;
        //return function update() {
        // flatten bone matrices to array
        for (var b = 0, bl = this.bones.length; b < bl; b++) {
            // compute the offset between the current and the original transform
            var matrix = this.bones[b] ? this.bones[b].matrixWorld : this.identityMatrix;
            offsetMatrix.multiplyMatrices(matrix, this.boneInverses[b]);
            offsetMatrix.toArray(this.boneMatrices, b * 16);
        }
        if (this.useVertexTexture) {
            this.boneTexture.needsUpdate = true;
        }
        //};
    };
    Skeleton.prototype.clone = function () {
        return new this.constructor(this.bones, this.boneInverses, this.useVertexTexture);
    };
    Skeleton.update_offsetMatrix = new Matrix4_1.Matrix4();
    return Skeleton;
}());
exports.Skeleton = Skeleton;
//# sourceMappingURL=Skeleton.js.map