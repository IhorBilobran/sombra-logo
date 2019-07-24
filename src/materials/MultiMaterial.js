"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Math_1 = require("../math/Math");
/**
 * @author mrdoob / http://mrdoob.com/
 */
var MultiMaterial = /** @class */ (function () {
    function MultiMaterial(materials) {
        if (materials === void 0) { materials = []; }
        this.uuid = Math_1._Math.generateUUID();
        this.type = 'MultiMaterial';
        this.visible = true;
        this.isMultiMaterial = true;
        this.materials = materials;
    }
    // }
    MultiMaterial.prototype.dispose = function () { };
    MultiMaterial.prototype.toJSON = function (meta) {
        var output = {
            metadata: {
                version: 4.2,
                type: 'material',
                generator: 'MaterialExporter'
            },
            uuid: this.uuid,
            type: this.type,
            materials: []
        };
        var materials = this.materials;
        for (var i = 0, l = materials.length; i < l; i++) {
            var material = materials[i].toJSON(meta);
            delete material.metadata;
            output.materials.push(material);
        }
        output.visible = this.visible;
        return output;
    };
    MultiMaterial.prototype.clone = function () {
        var material = new this.constructor();
        for (var i = 0; i < this.materials.length; i++) {
            material.materials.push(this.materials[i].clone());
        }
        material.visible = this.visible;
        return material;
    };
    return MultiMaterial;
}());
exports.MultiMaterial = MultiMaterial;
//# sourceMappingURL=MultiMaterial.js.map