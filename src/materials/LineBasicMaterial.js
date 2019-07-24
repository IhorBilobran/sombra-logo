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
var LineBasicMaterial = /** @class */ (function (_super) {
    __extends(LineBasicMaterial, _super);
    function LineBasicMaterial(parameters) {
        var _this = _super.call(this) || this;
        _this.isLineBasicMaterial = true;
        _this.type = 'LineBasicMaterial';
        _this.color = new Color_1.Color(0xffffff);
        _this.linewidth = 1;
        _this.linecap = 'round';
        _this.linejoin = 'round';
        _this.lights = false;
        _this.setValues(parameters);
        return _this;
    }
    LineBasicMaterial.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.color.copy(source.color);
        this.linewidth = source.linewidth;
        this.linecap = source.linecap;
        this.linejoin = source.linejoin;
        return this;
    };
    return LineBasicMaterial;
}(Material_1.Material));
exports.LineBasicMaterial = LineBasicMaterial;
//# sourceMappingURL=LineBasicMaterial.js.map