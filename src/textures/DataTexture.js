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
var Texture_1 = require("./Texture");
var constants_1 = require("../constants");
/**
 * @author alteredq / http://alteredqualia.com/
 */
var DataTexture = /** @class */ (function (_super) {
    __extends(DataTexture, _super);
    function DataTexture(data, width, height, format, type, mapping, wrapS, wrapT, magFilter, minFilter, anisotropy, encoding) {
        if (magFilter === void 0) { magFilter = constants_1.TextureFilter.Nearest; }
        if (minFilter === void 0) { minFilter = constants_1.TextureFilter.Nearest; }
        var _this = _super.call(this, null, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) || this;
        _this.isDataTexture = true;
        _this.image = { data: data, width: width, height: height };
        _this.magFilter = magFilter;
        _this.minFilter = minFilter;
        _this.generateMipmaps = false;
        _this.flipY = false;
        _this.unpackAlignment = 1;
        return _this;
    }
    return DataTexture;
}(Texture_1.Texture));
exports.DataTexture = DataTexture;
//# sourceMappingURL=DataTexture.js.map