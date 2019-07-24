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
 * @author mrdoob / http://mrdoob.com/
 */
var CubeTexture = /** @class */ (function (_super) {
    __extends(CubeTexture, _super);
    function CubeTexture(images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
        if (images === void 0) { images = []; }
        if (mapping === void 0) { mapping = constants_1.TextureMapping.CubeReflection; }
        var _this = _super.call(this, images, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) || this;
        _this.isCubeTexture = true;
        _this.flipY = false;
        return _this;
    }
    Object.defineProperty(CubeTexture.prototype, "images", {
        get: function () { return this.image; },
        set: function (value) { this.image = value; },
        enumerable: true,
        configurable: true
    });
    return CubeTexture;
}(Texture_1.Texture));
exports.CubeTexture = CubeTexture;
//# sourceMappingURL=CubeTexture.js.map