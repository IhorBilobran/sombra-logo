"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Color_1 = require("../math/Color");
var Vector3_1 = require("../math/Vector3");
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 */
var Face3 = /** @class */ (function () {
    function Face3(a, b, c, normal, color, materialIndex) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.normal = (normal && normal instanceof Vector3_1.Vector3) ? normal : new Vector3_1.Vector3();
        this.vertexNormals = Array.isArray(normal) ? normal : [];
        this.color = (color && color instanceof Color_1.Color) ? color : new Color_1.Color();
        this.vertexColors = Array.isArray(color) ? color : [];
        this.materialIndex = materialIndex !== undefined ? materialIndex : 0;
    }
    Face3.prototype.clone = function () {
        return new this.constructor().copy(this);
    };
    Face3.prototype.copy = function (source) {
        this.a = source.a;
        this.b = source.b;
        this.c = source.c;
        this.normal.copy(source.normal);
        this.color.copy(source.color);
        this.materialIndex = source.materialIndex;
        for (var i = 0, il = source.vertexNormals.length; i < il; i++) {
            this.vertexNormals[i] = source.vertexNormals[i].clone();
        }
        for (var i = 0, il = source.vertexColors.length; i < il; i++) {
            this.vertexColors[i] = source.vertexColors[i].clone();
        }
        return this;
    };
    return Face3;
}());
exports.Face3 = Face3;
//# sourceMappingURL=Face3.js.map