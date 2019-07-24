"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector4_1 = require("../math/Vector4");
var Vector3_1 = require("../math/Vector3");
var Vector2_1 = require("../math/Vector2");
var Color_1 = require("../math/Color");
var Math_1 = require("../math/Math");
var BufferAttribute = /** @class */ (function () {
    function BufferAttribute(array, itemSize, normalized) {
        if (normalized === void 0) { normalized = false; }
        this.uuid = Math_1._Math.generateUUID();
        this.dynamic = false;
        this.updateRange = { offset: 0, count: -1 };
        this.version = 0;
        this.isBufferAttribute = true;
        this.isInterleavedBufferAttribute = false;
        if (Array.isArray(array)) {
            throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
        }
        this.array = array;
        this.itemSize = itemSize;
        this.count = array !== undefined ? array.length / itemSize : 0;
        this.normalized = normalized === true;
    }
    Object.defineProperty(BufferAttribute.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        },
        enumerable: true,
        configurable: true
    });
    BufferAttribute.prototype.setArray = function (array) {
        if (Array.isArray(array)) {
            throw new TypeError('THREE.BufferAttribute: array should be a Typed Array.');
        }
        this.count = array !== undefined ? array.length / this.itemSize : 0;
        this.array = array;
    };
    BufferAttribute.prototype.setDynamic = function (value) {
        this.dynamic = value;
        return this;
    };
    BufferAttribute.prototype.copy = function (source) {
        this.array = new source.array.constructor(source.array);
        this.itemSize = source.itemSize;
        this.count = source.count;
        this.normalized = source.normalized;
        this.dynamic = source.dynamic;
        return this;
    };
    BufferAttribute.prototype.copyAt = function (index1, attribute, index2) {
        index1 *= this.itemSize;
        index2 *= attribute.itemSize;
        for (var i = 0, l = this.itemSize; i < l; i++) {
            this.array[index1 + i] = attribute.array[index2 + i];
        }
        return this;
    };
    BufferAttribute.prototype.copyArray = function (array) {
        this.array.set(array, 0);
        return this;
    };
    BufferAttribute.prototype.copyColorsArray = function (colors) {
        var array = this.array;
        var offset = 0;
        for (var i = 0, l = colors.length; i < l; i++) {
            var color = colors[i];
            if (color === undefined) {
                console.warn('THREE.BufferAttribute.copyColorsArray(): color is undefined', i);
                color = new Color_1.Color();
            }
            array[offset++] = color.r;
            array[offset++] = color.g;
            array[offset++] = color.b;
        }
        return this;
    };
    BufferAttribute.prototype.copyIndicesArray = function (indices) {
        var array = this.array;
        var offset = 0;
        for (var i = 0, l = indices.length; i < l; i++) {
            var index = indices[i];
            array[offset++] = index.a;
            array[offset++] = index.b;
            array[offset++] = index.c;
        }
        return this;
    };
    BufferAttribute.prototype.copyVector2sArray = function (vectors) {
        var array = this.array;
        var offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVector2sArray(): vector is undefined', i);
                vector = new Vector2_1.Vector2();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
        }
        return this;
    };
    BufferAttribute.prototype.copyVector3sArray = function (vectors) {
        var array = this.array;
        var offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVector3sArray(): vector is undefined', i);
                vector = new Vector3_1.Vector3();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
        }
        return this;
    };
    BufferAttribute.prototype.copyVector4sArray = function (vectors) {
        var array = this.array;
        var offset = 0;
        for (var i = 0, l = vectors.length; i < l; i++) {
            var vector = vectors[i];
            if (vector === undefined) {
                console.warn('THREE.BufferAttribute.copyVector4sArray(): vector is undefined', i);
                vector = new Vector4_1.Vector4();
            }
            array[offset++] = vector.x;
            array[offset++] = vector.y;
            array[offset++] = vector.z;
            array[offset++] = vector.w;
        }
        return this;
    };
    BufferAttribute.prototype.set = function (value, offset) {
        if (offset === void 0) { offset = 0; }
        this.array.set(value, offset);
        return this;
    };
    BufferAttribute.prototype.getX = function (index) {
        return this.array[index * this.itemSize];
    };
    BufferAttribute.prototype.setX = function (index, x) {
        this.array[index * this.itemSize] = x;
        return this;
    };
    BufferAttribute.prototype.getY = function (index) {
        return this.array[index * this.itemSize + 1];
    };
    BufferAttribute.prototype.setY = function (index, y) {
        this.array[index * this.itemSize + 1] = y;
        return this;
    };
    BufferAttribute.prototype.getZ = function (index) {
        return this.array[index * this.itemSize + 2];
    };
    BufferAttribute.prototype.setZ = function (index, z) {
        this.array[index * this.itemSize + 2] = z;
        return this;
    };
    BufferAttribute.prototype.getW = function (index) {
        return this.array[index * this.itemSize + 3];
    };
    BufferAttribute.prototype.setW = function (index, w) {
        this.array[index * this.itemSize + 3] = w;
        return this;
    };
    BufferAttribute.prototype.setXY = function (index, x, y) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        return this;
    };
    BufferAttribute.prototype.setXYZ = function (index, x, y, z) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        return this;
    };
    BufferAttribute.prototype.setXYZW = function (index, x, y, z, w) {
        index *= this.itemSize;
        this.array[index + 0] = x;
        this.array[index + 1] = y;
        this.array[index + 2] = z;
        this.array[index + 3] = w;
        return this;
    };
    BufferAttribute.prototype.clone = function () {
        return new this.constructor().copy(this);
    };
    Object.defineProperty(BufferAttribute.prototype, "length", {
        get: function () {
            console.warn("THREE.BufferAttribute: .length has been deprecated. Please use .count.");
            return this.array.length;
        },
        enumerable: true,
        configurable: true
    });
    return BufferAttribute;
}());
exports.BufferAttribute = BufferAttribute;
//
function Int8Attribute(array, itemSize) {
    return new BufferAttribute(new Int8Array(array), itemSize);
}
exports.Int8Attribute = Int8Attribute;
function Uint8Attribute(array, itemSize) {
    return new BufferAttribute(new Uint8Array(array), itemSize);
}
exports.Uint8Attribute = Uint8Attribute;
function Uint8ClampedAttribute(array, itemSize) {
    return new BufferAttribute(new Uint8ClampedArray(array), itemSize);
}
exports.Uint8ClampedAttribute = Uint8ClampedAttribute;
function Int16Attribute(array, itemSize) {
    return new BufferAttribute(new Int16Array(array), itemSize);
}
exports.Int16Attribute = Int16Attribute;
function Uint16Attribute(array, itemSize) {
    return new BufferAttribute(new Uint16Array(array), itemSize);
}
exports.Uint16Attribute = Uint16Attribute;
function Int32Attribute(array, itemSize) {
    return new BufferAttribute(new Int32Array(array), itemSize);
}
exports.Int32Attribute = Int32Attribute;
function Uint32Attribute(array, itemSize) {
    return new BufferAttribute(new Uint32Array(array), itemSize);
}
exports.Uint32Attribute = Uint32Attribute;
function Float32Attribute(array, itemSize) {
    return new BufferAttribute(new Float32Array(array), itemSize);
}
exports.Float32Attribute = Float32Attribute;
function Float64Attribute(array, itemSize) {
    return new BufferAttribute(new Float64Array(array), itemSize);
}
exports.Float64Attribute = Float64Attribute;
// Deprecated
function DynamicBufferAttribute(array, itemSize) {
    console.warn('THREE.DynamicBufferAttribute has been removed. Use new THREE.BufferAttribute().setDynamic(true) instead.');
    return new BufferAttribute(array, itemSize).setDynamic(true);
}
exports.DynamicBufferAttribute = DynamicBufferAttribute;
//# sourceMappingURL=BufferAttribute.js.map