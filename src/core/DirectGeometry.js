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
var EventDispatcher_1 = require("./EventDispatcher");
var Vector2_1 = require("../math/Vector2");
var Sphere_1 = require("../math/Sphere");
var Box3_1 = require("../math/Box3");
var Math_1 = require("../math/Math");
var Geometry_1 = require("./Geometry");
/**
 * @author mrdoob / http://mrdoob.com/
 */
var DirectGeometry = /** @class */ (function (_super) {
    __extends(DirectGeometry, _super);
    function DirectGeometry() {
        var _this = _super.call(this) || this;
        _this.id = Geometry_1.GeometryIdCount();
        _this.uuid = Math_1._Math.generateUUID();
        _this.name = '';
        _this.type = 'DirectGeometry';
        _this.indices = [];
        _this.vertices = [];
        _this.normals = [];
        _this.colors = [];
        _this.uvs = [];
        _this.uvs2 = [];
        _this.groups = [];
        _this.morphTargets = { position: undefined, normal: undefined };
        _this.skinWeights = [];
        _this.skinIndices = [];
        // lineDistances: number[] = [];
        _this.boundingBox = null;
        _this.boundingSphere = null;
        // update flags
        _this.verticesNeedUpdate = false;
        _this.normalsNeedUpdate = false;
        _this.colorsNeedUpdate = false;
        _this.uvsNeedUpdate = false;
        _this.groupsNeedUpdate = false;
        return _this;
    }
    DirectGeometry.prototype.computeBoundingBox = function () {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3_1.Box3();
        }
        this.boundingBox.setFromPoints(this.vertices);
    };
    DirectGeometry.prototype.computeBoundingSphere = function () {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere_1.Sphere();
        }
        this.boundingSphere.setFromPoints(this.vertices);
    };
    DirectGeometry.prototype.computeFaceNormals = function () {
        console.warn('THREE.DirectGeometry: computeFaceNormals() is not a method of this type of geometry.');
    };
    DirectGeometry.prototype.computeVertexNormals = function () {
        console.warn('THREE.DirectGeometry: computeVertexNormals() is not a method of this type of geometry.');
    };
    DirectGeometry.prototype.computeGroups = function (geometry) {
        var group;
        var groups = [];
        var materialIndex;
        var faces = geometry.faces;
        var i;
        for (i = 0; i < faces.length; i++) {
            var face = faces[i];
            // materials
            if (face.materialIndex !== materialIndex) {
                materialIndex = face.materialIndex;
                if (group !== undefined) {
                    group.count = (i * 3) - group.start;
                    groups.push(group);
                }
                group = {
                    start: i * 3,
                    materialIndex: materialIndex
                };
            }
        }
        if (group !== undefined) {
            group.count = (i * 3) - group.start;
            groups.push(group);
        }
        this.groups = groups;
    };
    DirectGeometry.prototype.fromGeometry = function (geometry) {
        var faces = geometry.faces;
        var vertices = geometry.vertices;
        var faceVertexUvs = geometry.faceVertexUvs;
        var hasFaceVertexUv = faceVertexUvs[0] && faceVertexUvs[0].length > 0;
        var hasFaceVertexUv2 = faceVertexUvs[1] && faceVertexUvs[1].length > 0;
        // morphs
        var morphTargets = geometry.morphTargets;
        var morphTargetsLength = morphTargets.length;
        var morphTargetsPosition;
        if (morphTargetsLength > 0) {
            morphTargetsPosition = [];
            for (var i = 0; i < morphTargetsLength; i++) {
                morphTargetsPosition[i] = [];
            }
            this.morphTargets.position = morphTargetsPosition;
        }
        var morphNormals = geometry.morphNormals;
        var morphNormalsLength = morphNormals.length;
        var morphTargetsNormal;
        if (morphNormalsLength > 0) {
            morphTargetsNormal = [];
            for (var i = 0; i < morphNormalsLength; i++) {
                morphTargetsNormal[i] = [];
            }
            this.morphTargets.normal = morphTargetsNormal;
        }
        // skins
        var skinIndices = geometry.skinIndices;
        var skinWeights = geometry.skinWeights;
        var hasSkinIndices = skinIndices.length === vertices.length;
        var hasSkinWeights = skinWeights.length === vertices.length;
        //
        for (var i = 0; i < faces.length; i++) {
            var face = faces[i];
            this.vertices.push(vertices[face.a], vertices[face.b], vertices[face.c]);
            var vertexNormals = face.vertexNormals;
            if (vertexNormals.length === 3) {
                this.normals.push(vertexNormals[0], vertexNormals[1], vertexNormals[2]);
            }
            else {
                var normal = face.normal;
                this.normals.push(normal, normal, normal);
            }
            var vertexColors = face.vertexColors;
            if (vertexColors.length === 3) {
                this.colors.push(vertexColors[0], vertexColors[1], vertexColors[2]);
            }
            else {
                var color = face.color;
                this.colors.push(color, color, color);
            }
            if (hasFaceVertexUv === true) {
                var vertexUvs = faceVertexUvs[0][i];
                if (vertexUvs !== undefined) {
                    this.uvs.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);
                }
                else {
                    console.warn('THREE.DirectGeometry.fromGeometry(): Undefined vertexUv ', i);
                    this.uvs.push(new Vector2_1.Vector2(), new Vector2_1.Vector2(), new Vector2_1.Vector2());
                }
            }
            if (hasFaceVertexUv2 === true) {
                var vertexUvs = faceVertexUvs[1][i];
                if (vertexUvs !== undefined) {
                    this.uvs2.push(vertexUvs[0], vertexUvs[1], vertexUvs[2]);
                }
                else {
                    console.warn('THREE.DirectGeometry.fromGeometry(): Undefined vertexUv2 ', i);
                    this.uvs2.push(new Vector2_1.Vector2(), new Vector2_1.Vector2(), new Vector2_1.Vector2());
                }
            }
            // morphs
            for (var j = 0; j < morphTargetsLength; j++) {
                var morphTarget = morphTargets[j].vertices;
                morphTargetsPosition[j].push(morphTarget[face.a], morphTarget[face.b], morphTarget[face.c]);
            }
            for (var j = 0; j < morphNormalsLength; j++) {
                var morphNormal = morphNormals[j].vertexNormals[i];
                morphTargetsNormal[j].push(morphNormal.a, morphNormal.b, morphNormal.c);
            }
            // skins
            if (hasSkinIndices) {
                this.skinIndices.push(skinIndices[face.a], skinIndices[face.b], skinIndices[face.c]);
            }
            if (hasSkinWeights) {
                this.skinWeights.push(skinWeights[face.a], skinWeights[face.b], skinWeights[face.c]);
            }
        }
        this.computeGroups(geometry);
        this.verticesNeedUpdate = geometry.verticesNeedUpdate;
        this.normalsNeedUpdate = geometry.normalsNeedUpdate;
        this.colorsNeedUpdate = geometry.colorsNeedUpdate;
        this.uvsNeedUpdate = geometry.uvsNeedUpdate;
        this.groupsNeedUpdate = geometry.groupsNeedUpdate;
        return this;
    };
    DirectGeometry.prototype.dispose = function () {
        this.dispatchEvent({ type: 'dispose' });
    };
    return DirectGeometry;
}(EventDispatcher_1.EventDispatcher));
exports.DirectGeometry = DirectGeometry;
//# sourceMappingURL=DirectGeometry.js.map