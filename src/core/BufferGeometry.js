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
var Box3_1 = require("../math/Box3");
var EventDispatcher_1 = require("./EventDispatcher");
var BufferAttribute_1 = require("./BufferAttribute");
var InterleavedBufferAttribute_1 = require("./InterleavedBufferAttribute");
var Sphere_1 = require("../math/Sphere");
var DirectGeometry_1 = require("./DirectGeometry");
var Object3D_1 = require("./Object3D");
var Matrix4_1 = require("../math/Matrix4");
var Matrix3_1 = require("../math/Matrix3");
var Math_1 = require("../math/Math");
var Geometry_1 = require("./Geometry");
var Points_1 = require("../objects/Points");
var Line_1 = require("../objects/Line");
var Mesh_1 = require("../objects/Mesh");
var BufferGeometry = /** @class */ (function (_super) {
    __extends(BufferGeometry, _super);
    function BufferGeometry() {
        var _this = _super.call(this) || this;
        _this.id = Geometry_1.GeometryIdCount();
        _this.uuid = Math_1._Math.generateUUID();
        _this.name = '';
        _this.type = 'BufferGeometry';
        _this.index = null;
        _this.attributes = {
        //position: undefined,
        //normal: undefined,
        //color: undefined,
        //uv: undefined,
        //lineDistance: undefined,
        //skinWeight: undefined
        };
        _this.parameters = undefined;
        _this.morphAttributes = {};
        _this.groups = [];
        _this.boundingBox = null;
        _this.boundingSphere = null;
        _this.drawRange = { start: 0, count: Infinity };
        // }
        _this.isGeometry = false;
        _this.isBufferGeometry = true;
        return _this;
    }
    BufferGeometry.prototype.getIndex = function () {
        return this.index;
    };
    BufferGeometry.prototype.setIndex = function (index) {
        this.index = index;
    };
    BufferGeometry.prototype.addAttribute = function (name, attribute) {
        if ((attribute && attribute instanceof BufferAttribute_1.BufferAttribute) === false && (attribute && attribute instanceof InterleavedBufferAttribute_1.InterleavedBufferAttribute) === false) {
            console.warn('THREE.BufferGeometry: .addAttribute() now expects (name, attribute).');
            this.addAttribute(name, new BufferAttribute_1.BufferAttribute(arguments[1], arguments[2]));
            return this;
        }
        if (name === 'index') {
            console.warn('THREE.BufferGeometry.addAttribute: Use .setIndex() for index attribute.');
            this.setIndex(attribute);
            return this;
        }
        this.attributes[name] = attribute;
        return this;
    };
    BufferGeometry.prototype.getAttribute = function (name) {
        return this.attributes[name];
    };
    BufferGeometry.prototype.removeAttribute = function (name) {
        delete this.attributes[name];
        return this;
    };
    BufferGeometry.prototype.addGroup = function (start, count, materialIndex) {
        if (materialIndex === void 0) { materialIndex = 0; }
        this.groups.push({
            start: start,
            count: count,
            materialIndex: materialIndex
        });
    };
    BufferGeometry.prototype.clearGroups = function () {
        this.groups = [];
    };
    BufferGeometry.prototype.setDrawRange = function (start, count) {
        this.drawRange.start = start;
        this.drawRange.count = count;
    };
    BufferGeometry.prototype.applyMatrix = function (matrix) {
        var position = this.attributes.position;
        if (position !== undefined) {
            matrix.applyToVector3Array(position.array);
            position.needsUpdate = true;
        }
        var normal = this.attributes.normal;
        if (normal !== undefined) {
            var normalMatrix = new Matrix3_1.Matrix3().getNormalMatrix(matrix);
            normalMatrix.applyToVector3Array(normal.array);
            normal.needsUpdate = true;
        }
        if (this.boundingBox !== null) {
            this.computeBoundingBox();
        }
        if (this.boundingSphere !== null) {
            this.computeBoundingSphere();
        }
        return this;
    };
    BufferGeometry.prototype.rotateX = function (angle) {
        // rotate geometry around world x-axis
        var m1 = new Matrix4_1.Matrix4();
        //return function rotateX(angle) {
        m1.makeRotationX(angle);
        this.applyMatrix(m1);
        return this;
        //};
    };
    BufferGeometry.prototype.rotateY = function (angle) {
        // rotate geometry around world y-axis
        var m1 = new Matrix4_1.Matrix4();
        //return function rotateY(angle) {
        m1.makeRotationY(angle);
        this.applyMatrix(m1);
        return this;
        //};
    };
    BufferGeometry.prototype.rotateZ = function (angle) {
        // rotate geometry around world z-axis
        var m1 = new Matrix4_1.Matrix4();
        //return function rotateZ(angle) {
        m1.makeRotationZ(angle);
        this.applyMatrix(m1);
        return this;
        //};
    };
    BufferGeometry.prototype.translate = function (x, y, z) {
        // translate geometry
        var m1 = new Matrix4_1.Matrix4();
        //return function translate(x, y, z) {
        m1.makeTranslation(x, y, z);
        this.applyMatrix(m1);
        return this;
        //};
    };
    BufferGeometry.prototype.scale = function (x, y, z) {
        // scale geometry
        var m1 = new Matrix4_1.Matrix4();
        //return function scale(x, y, z) {
        m1.makeScale(x, y, z);
        this.applyMatrix(m1);
        return this;
        //};
    };
    BufferGeometry.prototype.lookAt = function (vector) {
        var obj = new Object3D_1.Object3D();
        //return function lookAt(vector) {
        obj.lookAt(vector);
        obj.updateMatrix();
        this.applyMatrix(obj.matrix);
        //};
    };
    BufferGeometry.prototype.center = function () {
        this.computeBoundingBox();
        var offset = this.boundingBox.getCenter().negate();
        this.translate(offset.x, offset.y, offset.z);
        return offset;
    };
    BufferGeometry.prototype.setFromObject = function (object) {
        // console.log('THREE.BufferGeometry.setFromObject(). Converting', object, this);
        var geometry = object.geometry;
        if ((object && object instanceof Points_1.Points) || (object && object instanceof Line_1.Line)) {
            var positions = BufferAttribute_1.Float32Attribute(geometry.vertices.length * 3, 3);
            var colors = BufferAttribute_1.Float32Attribute(geometry.colors.length * 3, 3);
            this.addAttribute('position', positions.copyVector3sArray(geometry.vertices));
            this.addAttribute('color', colors.copyColorsArray(geometry.colors));
            if (geometry.lineDistances && geometry.lineDistances.length === geometry.vertices.length) {
                var lineDistances = BufferAttribute_1.Float32Attribute(geometry.lineDistances.length, 1);
                this.addAttribute('lineDistance', lineDistances.copyArray(geometry.lineDistances));
            }
            if (geometry.boundingSphere !== null) {
                this.boundingSphere = geometry.boundingSphere.clone();
            }
            if (geometry.boundingBox !== null) {
                this.boundingBox = geometry.boundingBox.clone();
            }
        }
        else if ((object && object instanceof Mesh_1.Mesh)) {
            if ((geometry && geometry instanceof Geometry_1.Geometry)) {
                this.fromGeometry(geometry);
            }
        }
        return this;
    };
    BufferGeometry.prototype.updateFromObject = function (object) {
        var geometry = object.geometry;
        if ((object && object instanceof Mesh_1.Mesh)) {
            var direct = geometry.__directGeometry;
            if (geometry.elementsNeedUpdate === true) {
                direct = undefined;
                geometry.elementsNeedUpdate = false;
            }
            if (direct === undefined) {
                return this.fromGeometry(geometry);
            }
            direct.verticesNeedUpdate = geometry.verticesNeedUpdate;
            direct.normalsNeedUpdate = geometry.normalsNeedUpdate;
            direct.colorsNeedUpdate = geometry.colorsNeedUpdate;
            direct.uvsNeedUpdate = geometry.uvsNeedUpdate;
            direct.groupsNeedUpdate = geometry.groupsNeedUpdate;
            geometry.verticesNeedUpdate = false;
            geometry.normalsNeedUpdate = false;
            geometry.colorsNeedUpdate = false;
            geometry.uvsNeedUpdate = false;
            geometry.groupsNeedUpdate = false;
            geometry = direct;
        }
        var attribute;
        if (geometry.verticesNeedUpdate === true) {
            attribute = this.attributes.position;
            if (attribute !== undefined) {
                attribute.copyVector3sArray(geometry.vertices);
                attribute.needsUpdate = true;
            }
            geometry.verticesNeedUpdate = false;
        }
        if (geometry.normalsNeedUpdate === true) {
            attribute = this.attributes.normal;
            if (attribute !== undefined) {
                attribute.copyVector3sArray(geometry.normals);
                attribute.needsUpdate = true;
            }
            geometry.normalsNeedUpdate = false;
        }
        if (geometry.colorsNeedUpdate === true) {
            attribute = this.attributes.color;
            if (attribute !== undefined) {
                attribute.copyColorsArray(geometry.colors);
                attribute.needsUpdate = true;
            }
            geometry.colorsNeedUpdate = false;
        }
        if (geometry.uvsNeedUpdate) {
            attribute = this.attributes.uv;
            if (attribute !== undefined) {
                attribute.copyVector2sArray(geometry.uvs);
                attribute.needsUpdate = true;
            }
            geometry.uvsNeedUpdate = false;
        }
        if (geometry.lineDistancesNeedUpdate) {
            attribute = this.attributes.lineDistance;
            if (attribute !== undefined) {
                attribute.copyArray(geometry.lineDistances);
                attribute.needsUpdate = true;
            }
            geometry.lineDistancesNeedUpdate = false;
        }
        if (geometry.groupsNeedUpdate) {
            geometry.computeGroups(object.geometry);
            this.groups = geometry.groups;
            geometry.groupsNeedUpdate = false;
        }
        return this;
    };
    BufferGeometry.prototype.fromGeometry = function (geometry) {
        geometry.__directGeometry = new DirectGeometry_1.DirectGeometry().fromGeometry(geometry);
        return this.fromDirectGeometry(geometry.__directGeometry);
    };
    BufferGeometry.prototype.fromDirectGeometry = function (geometry) {
        var positions = new Float32Array(geometry.vertices.length * 3);
        this.addAttribute('position', new BufferAttribute_1.BufferAttribute(positions, 3).copyVector3sArray(geometry.vertices));
        if (geometry.normals.length > 0) {
            var normals = new Float32Array(geometry.normals.length * 3);
            this.addAttribute('normal', new BufferAttribute_1.BufferAttribute(normals, 3).copyVector3sArray(geometry.normals));
        }
        if (geometry.colors.length > 0) {
            var colors = new Float32Array(geometry.colors.length * 3);
            this.addAttribute('color', new BufferAttribute_1.BufferAttribute(colors, 3).copyColorsArray(geometry.colors));
        }
        if (geometry.uvs.length > 0) {
            var uvs = new Float32Array(geometry.uvs.length * 2);
            this.addAttribute('uv', new BufferAttribute_1.BufferAttribute(uvs, 2).copyVector2sArray(geometry.uvs));
        }
        if (geometry.uvs2.length > 0) {
            var uvs2 = new Float32Array(geometry.uvs2.length * 2);
            this.addAttribute('uv2', new BufferAttribute_1.BufferAttribute(uvs2, 2).copyVector2sArray(geometry.uvs2));
        }
        if (geometry.indices.length > 0) {
            var TypeArray = geometry.vertices.length > 65535 ? Uint32Array : Uint16Array;
            var indices = new TypeArray(geometry.indices.length * 3);
            this.setIndex(new BufferAttribute_1.BufferAttribute(indices, 1).copyIndicesArray(geometry.indices));
        }
        // groups
        this.groups = geometry.groups;
        // morphs
        for (var name_1 in geometry.morphTargets) {
            if (!geometry.morphTargets[name_1])
                continue;
            var array = [];
            var morphTargets = geometry.morphTargets[name_1];
            for (var i = 0, l = morphTargets.length; i < l; i++) {
                var morphTarget = morphTargets[i];
                var attribute = BufferAttribute_1.Float32Attribute(morphTarget.length * 3, 3);
                array.push(attribute.copyVector3sArray(morphTarget));
            }
            this.morphAttributes[name_1] = array;
        }
        // skinning
        if (geometry.skinIndices.length > 0) {
            var skinIndices = BufferAttribute_1.Float32Attribute(geometry.skinIndices.length * 4, 4);
            this.addAttribute('skinIndex', skinIndices.copyVector4sArray(geometry.skinIndices));
        }
        if (geometry.skinWeights.length > 0) {
            var skinWeights = BufferAttribute_1.Float32Attribute(geometry.skinWeights.length * 4, 4);
            this.addAttribute('skinWeight', skinWeights.copyVector4sArray(geometry.skinWeights));
        }
        //
        if (geometry.boundingSphere !== null) {
            this.boundingSphere = geometry.boundingSphere.clone();
        }
        if (geometry.boundingBox !== null) {
            this.boundingBox = geometry.boundingBox.clone();
        }
        return this;
    };
    BufferGeometry.prototype.computeBoundingBox = function () {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3_1.Box3();
        }
        var positions = this.attributes.position.array;
        if (positions !== undefined) {
            this.boundingBox.setFromArray(positions);
        }
        else {
            this.boundingBox.makeEmpty();
        }
        if (isNaN(this.boundingBox.min.x) || isNaN(this.boundingBox.min.y) || isNaN(this.boundingBox.min.z)) {
            console.error('THREE.BufferGeometry.computeBoundingBox: Computed min/max have NaN values. The "position" attribute is likely to have NaN values.', this);
        }
    };
    BufferGeometry.prototype.computeBoundingSphere = function () {
        var box = new Box3_1.Box3();
        var vector = new Vector3_1.Vector3();
        //return function computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere_1.Sphere();
        }
        var positions = this.attributes.position;
        if (positions) {
            var array = positions.array;
            var center = this.boundingSphere.center;
            box.setFromArray(array);
            box.getCenter(center);
            // hoping to find a boundingSphere with a radius smaller than the
            // boundingSphere of the boundingBox: sqrt(3) smaller in the best case
            var maxRadiusSq = 0;
            for (var i = 0, il = array.length; i < il; i += 3) {
                vector.fromArray(array, i);
                maxRadiusSq = Math.max(maxRadiusSq, center.distanceToSquared(vector));
            }
            this.boundingSphere.radius = Math.sqrt(maxRadiusSq);
            if (isNaN(this.boundingSphere.radius)) {
                console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.', this);
            }
        }
        //};
    };
    BufferGeometry.prototype.computeFaceNormals = function () {
        // backwards compatibility
    };
    BufferGeometry.prototype.computeVertexNormals = function () {
        var index = this.index;
        var attributes = this.attributes;
        var groups = this.groups;
        if (attributes.position) {
            var positions = attributes.position.array;
            if (attributes.normal === undefined) {
                this.addAttribute('normal', new BufferAttribute_1.BufferAttribute(new Float32Array(positions.length), 3));
            }
            else {
                // reset existing normals to zero
                var array = attributes.normal.array;
                for (var i = 0, il = array.length; i < il; i++) {
                    array[i] = 0;
                }
            }
            var normals = attributes.normal.array;
            var vA = void 0, vB = void 0, vC = void 0, pA = new Vector3_1.Vector3(), pB = new Vector3_1.Vector3(), pC = new Vector3_1.Vector3(), cb = new Vector3_1.Vector3(), ab = new Vector3_1.Vector3();
            // indexed elements
            if (index) {
                var indices = index.array;
                if (groups.length === 0) {
                    this.addGroup(0, indices.length);
                }
                for (var j = 0, jl = groups.length; j < jl; ++j) {
                    var group = groups[j];
                    var start = group.start;
                    var count = group.count;
                    for (var i = start, il = start + count; i < il; i += 3) {
                        vA = indices[i + 0] * 3;
                        vB = indices[i + 1] * 3;
                        vC = indices[i + 2] * 3;
                        pA.fromArray(positions, vA);
                        pB.fromArray(positions, vB);
                        pC.fromArray(positions, vC);
                        cb.subVectors(pC, pB);
                        ab.subVectors(pA, pB);
                        cb.cross(ab);
                        normals[vA] += cb.x;
                        normals[vA + 1] += cb.y;
                        normals[vA + 2] += cb.z;
                        normals[vB] += cb.x;
                        normals[vB + 1] += cb.y;
                        normals[vB + 2] += cb.z;
                        normals[vC] += cb.x;
                        normals[vC + 1] += cb.y;
                        normals[vC + 2] += cb.z;
                    }
                }
            }
            else {
                // non-indexed elements (unconnected triangle soup)
                for (var i = 0, il = positions.length; i < il; i += 9) {
                    pA.fromArray(positions, i);
                    pB.fromArray(positions, i + 3);
                    pC.fromArray(positions, i + 6);
                    cb.subVectors(pC, pB);
                    ab.subVectors(pA, pB);
                    cb.cross(ab);
                    normals[i] = cb.x;
                    normals[i + 1] = cb.y;
                    normals[i + 2] = cb.z;
                    normals[i + 3] = cb.x;
                    normals[i + 4] = cb.y;
                    normals[i + 5] = cb.z;
                    normals[i + 6] = cb.x;
                    normals[i + 7] = cb.y;
                    normals[i + 8] = cb.z;
                }
            }
            this.normalizeNormals();
            attributes.normal.needsUpdate = true;
        }
    };
    BufferGeometry.prototype.merge = function (geometry, offset) {
        if (offset === void 0) { offset = 0; }
        if ((geometry && geometry instanceof BufferGeometry) === false) {
            console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
            return this;
        }
        var attributes = this.attributes;
        for (var key in attributes) {
            var attribute1 = attributes[key];
            if (attribute1 === undefined)
                continue;
            var attributeArray1 = attribute1.array;
            var attribute2 = geometry.attributes[key];
            if (attribute2 === undefined)
                continue;
            var attributeArray2 = attribute2.array;
            var attributeSize = attribute2.itemSize;
            for (var i = 0, j = attributeSize * offset; i < attributeArray2.length; i++, j++) {
                attributeArray1[j] = attributeArray2[i];
            }
        }
        return this;
    };
    BufferGeometry.prototype.normalizeNormals = function () {
        var normals = this.attributes.normal.array;
        for (var i = 0, il = normals.length; i < il; i += 3) {
            var x = normals[i];
            var y = normals[i + 1];
            var z = normals[i + 2];
            var n = 1.0 / Math.sqrt(x * x + y * y + z * z);
            normals[i] *= n;
            normals[i + 1] *= n;
            normals[i + 2] *= n;
        }
    };
    BufferGeometry.prototype.toNonIndexed = function () {
        if (this.index === null) {
            console.warn('THREE.BufferGeometry.toNonIndexed(): Geometry is already non-indexed.');
            return this;
        }
        var geometry2 = new BufferGeometry();
        var indices = this.index.array;
        var attributes = this.attributes;
        for (var name_2 in attributes) {
            var attribute = attributes[name_2];
            if (attribute === undefined)
                continue;
            var array = attribute.array;
            var itemSize = attribute.itemSize;
            var array2 = new array.constructor(indices.length * itemSize);
            var index = 0, index2 = 0;
            for (var i = 0, l = indices.length; i < l; i++) {
                index = indices[i] * itemSize;
                for (var j = 0; j < itemSize; j++) {
                    array2[index2++] = array[index++];
                }
            }
            geometry2.addAttribute(name_2, new BufferAttribute_1.BufferAttribute(array2, itemSize));
        }
        return geometry2;
    };
    BufferGeometry.prototype.toJSON = function (meta) {
        var data = {
            metadata: {
                version: 4.4,
                type: 'BufferGeometry',
                generator: 'BufferGeometry.toJSON'
            }
        };
        // standard BufferGeometry serialization
        data.uuid = this.uuid;
        data.type = this.type;
        if (this.name !== '')
            data.name = this.name;
        if (this.parameters !== undefined) {
            var parameters = this.parameters;
            for (var key in parameters) {
                if (parameters[key] !== undefined)
                    data[key] = parameters[key];
            }
            return data;
        }
        data.data = { attributes: {} };
        var index = this.index;
        if (index !== null) {
            var array = Array.prototype.slice.call(index.array);
            data.data.index = {
                type: index.array.constructor.name,
                array: array
            };
        }
        var attributes = this.attributes;
        for (var key in attributes) {
            var attribute = attributes[key];
            if (attribute === undefined)
                continue;
            var array = Array.prototype.slice.call(attribute.array);
            data.data.attributes[key] = {
                itemSize: attribute.itemSize,
                type: attribute.array.constructor.name,
                array: array,
                normalized: attribute.normalized
            };
        }
        var groups = this.groups;
        if (groups.length > 0) {
            data.data.groups = JSON.parse(JSON.stringify(groups));
        }
        var boundingSphere = this.boundingSphere;
        if (boundingSphere !== null) {
            data.data.boundingSphere = {
                center: boundingSphere.center.toArray(),
                radius: boundingSphere.radius
            };
        }
        return data;
    };
    BufferGeometry.prototype.clone = function () {
        /*
        // Handle primitives
        const parameters = this.parameters;
        if (parameters !== undefined) {
          const values = [];
          for (let key in parameters) {
            values.push(parameters[key]);
          }
          const geometry = Object.create(this.constructor.prototype);
          this.constructor.apply(geometry, values);
          return geometry;
        }
        return new this.constructor().copy(this);
        */
        return new this.constructor().copy(this);
    };
    BufferGeometry.prototype.copy = function (source) {
        var index = source.index;
        if (index !== null) {
            this.setIndex(index.clone());
        }
        var attributes = source.attributes;
        for (var name_3 in attributes) {
            var attribute = attributes[name_3];
            if (attribute === undefined)
                continue;
            this.addAttribute(name_3, attribute.clone());
        }
        var groups = source.groups;
        for (var i = 0, l = groups.length; i < l; i++) {
            var group = groups[i];
            this.addGroup(group.start, group.count, group.materialIndex);
        }
        return this;
    };
    BufferGeometry.prototype.dispose = function () {
        this.dispatchEvent({ type: 'dispose' });
    };
    BufferGeometry.prototype.addIndex = function (index) {
        console.warn("THREE.BufferGeometry: .addIndex() has been renamed to .setIndex().");
        this.setIndex(index);
    };
    BufferGeometry.prototype.addDrawCall = function (start, count, indexOffset) {
        if (indexOffset !== undefined) {
            console.warn("THREE.BufferGeometry: .addDrawCall() no longer supports indexOffset.");
        }
        console.warn("THREE.BufferGeometry: .addDrawCall() is now .addGroup().");
        this.addGroup(start, count);
    };
    BufferGeometry.prototype.clearDrawCalls = function () {
        console.warn("THREE.BufferGeometry: .clearDrawCalls() is now .clearGroups().");
        this.clearGroups();
    };
    BufferGeometry.prototype.computeTangents = function () {
        console.warn("THREE.BufferGeometry: .computeTangents() has been removed.");
    };
    BufferGeometry.prototype.computeOffsets = function () {
        console.warn("THREE.BufferGeometry: .computeOffsets() has been removed.");
    };
    Object.defineProperty(BufferGeometry.prototype, "drawcalls", {
        get: function () {
            console.error("THREE.BufferGeometry: .drawcalls has been renamed to .groups.");
            return this.groups;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BufferGeometry.prototype, "offsets", {
        get: function () {
            console.warn("THREE.BufferGeometry: .offsets has been renamed to .groups.");
            return this.groups;
        },
        enumerable: true,
        configurable: true
    });
    BufferGeometry.MaxIndex = 65535;
    return BufferGeometry;
}(EventDispatcher_1.EventDispatcher));
exports.BufferGeometry = BufferGeometry;
//# sourceMappingURL=BufferGeometry.js.map