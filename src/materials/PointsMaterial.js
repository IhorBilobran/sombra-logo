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
var Color_1 = require("../math/Color");
var PointsMaterial = /** @class */ (function (_super) {
    __extends(PointsMaterial, _super);
    function PointsMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.isPointsMaterial = true;
        _this.type = 'PointsMaterial';
        _this.color = new Color_1.Color(0xffffff);
        _this.map = null;
        _this.size = 1;
        _this.sizeAttenuation = true;
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    PointsMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.map = source.map;
        this.size = source.size;
        this.sizeAttenuation = source.sizeAttenuation;
        return this;
    };
    return PointsMaterial;
}(Material_1.Material));
exports.PointsMaterial = PointsMaterial;
//# sourceMappingURL=PointsMaterial.js.map