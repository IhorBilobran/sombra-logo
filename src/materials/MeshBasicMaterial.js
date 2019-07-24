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
var Material_1 = require("./Material");
var constants_1 = require("../constants");
var Color_1 = require("../math/Color");
var MeshBasicMaterial = /** @class */ (function (_super) {
    __extends(MeshBasicMaterial, _super);
    function MeshBasicMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.isMeshBasicMaterial = true;
        _this.type = 'MeshBasicMaterial';
        _this.color = new Color_1.Color(0xffffff); // emissive
        _this.map = null;
        _this.aoMap = null;
        _this.aoMapIntensity = 1.0;
        _this.specularMap = null;
        _this.alphaMap = null;
        _this.envMap = null;
        _this.combine = constants_1.BlendingOperation.Multiply;
        _this.reflectivity = 1;
        _this.refractionRatio = 0.98;
        _this.wireframe = false;
        _this.wireframeLinewidth = 1;
        _this.wireframeLinecap = 'round';
        _this.wireframeLinejoin = 'round';
        _this.skinning = false;
        _this.morphTargets = false;
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    MeshBasicMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.aoMap = source.aoMap;
        this.aoMapIntensity = source.aoMapIntensity;
        this.specularMap = source.specularMap;
        this.alphaMap = source.alphaMap;
        this.envMap = source.envMap;
        this.combine = source.combine;
        this.reflectivity = source.reflectivity;
        this.refractionRatio = source.refractionRatio;
        this.wireframe = source.wireframe;
        this.wireframeLinewidth = source.wireframeLinewidth;
        this.wireframeLinecap = source.wireframeLinecap;
        this.wireframeLinejoin = source.wireframeLinejoin;
        this.skinning = source.skinning;
        this.morphTargets = source.morphTargets;
        return this;
    };
    return MeshBasicMaterial;
}(Material_1.Material));
exports.MeshBasicMaterial = MeshBasicMaterial;
//# sourceMappingURL=MeshBasicMaterial.js.map