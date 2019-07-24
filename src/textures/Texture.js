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
var EventDispatcher_1 = require("../core/EventDispatcher");
var constants_1 = require("../constants");
var Math_1 = require("../math/Math");
var Vector2_1 = require("../math/Vector2");
/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author szimek / https://github.com/szimek/
 */
var Texture = /** @class */ (function (_super) {
    __extends(Texture, _super);
    function Texture(image, mapping, wrapS, wrapT, magFilter, minFilter, format, type, anisotropy, encoding) {
        if (image === void 0) { image = Texture.DEFAULT_IMAGE; }
        if (mapping === void 0) { mapping = Texture.DEFAULT_MAPPING; }
        if (wrapS === void 0) { wrapS = constants_1.TextureWrapping.ClampToEdge; }
        if (wrapT === void 0) { wrapT = constants_1.TextureWrapping.ClampToEdge; }
        if (magFilter === void 0) { magFilter = constants_1.TextureFilter.Linear; }
        if (minFilter === void 0) { minFilter = constants_1.TextureFilter.LinearMipMapLinear; }
        if (format === void 0) { format = constants_1.TextureFormat.RGBA; }
        if (type === void 0) { type = constants_1.TextureType.UnsignedByte; }
        if (anisotropy === void 0) { anisotropy = 1; }
        if (encoding === void 0) { encoding = constants_1.TextureEncoding.Linear; }
        var _this = _super.call(this) || this;
        _this.id = TextureIdCount();
        _this.uuid = Math_1._Math.generateUUID();
        _this.name = '';
        _this.sourceFile = '';
        _this.mipmaps = [];
        _this.offset = new Vector2_1.Vector2(0, 0);
        _this.repeat = new Vector2_1.Vector2(1, 1);
        _this.generateMipmaps = true;
        _this.premultiplyAlpha = false;
        _this.flipY = true;
        _this.unpackAlignment = 4; // valid values: 1, 2, 4, 8 (see http://www.khronos.org/opengles/sdk/docs/man/xhtml/glPixelStorei.xml)
        _this.version = 0;
        _this.onUpdate = null;
        _this.isTexture = true;
        _this.image = image;
        _this.mapping = mapping;
        _this.wrapS = wrapS;
        _this.wrapT = wrapT;
        _this.magFilter = magFilter;
        _this.minFilter = minFilter;
        _this.anisotropy = anisotropy;
        _this.format = format;
        _this.type = type;
        _this.encoding = encoding;
        return _this;
    }
    Object.defineProperty(Texture.prototype, "needsUpdate", {
        set: function (value) {
            if (value === true)
                this.version++;
        },
        enumerable: true,
        configurable: true
    });
    Texture.prototype.clone = function () {
        return new this.constructor().copy(this);
    };
    Texture.prototype.copy = function (source) {
        this.image = source.image;
        this.mipmaps = source.mipmaps.slice(0);
        this.mapping = source.mapping;
        this.wrapS = source.wrapS;
        this.wrapT = source.wrapT;
        this.magFilter = source.magFilter;
        this.minFilter = source.minFilter;
        this.anisotropy = source.anisotropy;
        this.format = source.format;
        this.type = source.type;
        this.offset.copy(source.offset);
        this.repeat.copy(source.repeat);
        this.generateMipmaps = source.generateMipmaps;
        this.premultiplyAlpha = source.premultiplyAlpha;
        this.flipY = source.flipY;
        this.unpackAlignment = source.unpackAlignment;
        this.encoding = source.encoding;
        return this;
    };
    Texture.prototype.toJSON = function (meta) {
        if (meta.textures[this.uuid] !== undefined) {
            return meta.textures[this.uuid];
        }
        function getDataURL(image) {
            var canvas;
            if (image instanceof HTMLCanvasElement) {
                canvas = image;
            }
            else {
                canvas = document.createElementNS('http://www.w3.org/1999/xhtml', 'canvas');
                canvas.width = image.width;
                canvas.height = image.height;
                canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
            }
            if (canvas.width > 2048 || canvas.height > 2048) {
                return canvas.toDataURL('image/jpeg', 0.6);
            }
            else {
                return canvas.toDataURL('image/png');
            }
        }
        var output = {
            metadata: {
                version: 4.4,
                type: 'Texture',
                generator: 'Texture.toJSON'
            },
            uuid: this.uuid,
            name: this.name,
            mapping: this.mapping,
            repeat: [this.repeat.x, this.repeat.y],
            offset: [this.offset.x, this.offset.y],
            wrap: [this.wrapS, this.wrapT],
            minFilter: this.minFilter,
            magFilter: this.magFilter,
            anisotropy: this.anisotropy,
            flipY: this.flipY
        };
        if (this.image !== undefined) {
            // TODO: Move to THREE.Image
            var image = this.image;
            if (image.uuid === undefined) {
                image.uuid = Math_1._Math.generateUUID(); // UGH
            }
            if (meta.images[image.uuid] === undefined) {
                meta.images[image.uuid] = {
                    uuid: image.uuid,
                    url: getDataURL(image)
                };
            }
            output.image = image.uuid;
        }
        meta.textures[this.uuid] = output;
        return output;
    };
    Texture.prototype.dispose = function () {
        this.dispatchEvent({ type: 'dispose' });
    };
    Texture.prototype.transformUv = function (uv) {
        if (this.mapping !== constants_1.TextureMapping.UV)
            return;
        uv.multiply(this.repeat);
        uv.add(this.offset);
        if (uv.x < 0 || uv.x > 1) {
            switch (this.wrapS) {
                case constants_1.TextureWrapping.Repeat:
                    uv.x = uv.x - Math.floor(uv.x);
                    break;
                case constants_1.TextureWrapping.ClampToEdge:
                    uv.x = uv.x < 0 ? 0 : 1;
                    break;
                case constants_1.TextureWrapping.MirroredRepeat:
                    if (Math.abs(Math.floor(uv.x) % 2) === 1) {
                        uv.x = Math.ceil(uv.x) - uv.x;
                    }
                    else {
                        uv.x = uv.x - Math.floor(uv.x);
                    }
                    break;
            }
        }
        if (uv.y < 0 || uv.y > 1) {
            switch (this.wrapT) {
                case constants_1.TextureWrapping.Repeat:
                    uv.y = uv.y - Math.floor(uv.y);
                    break;
                case constants_1.TextureWrapping.ClampToEdge:
                    uv.y = uv.y < 0 ? 0 : 1;
                    break;
                case constants_1.TextureWrapping.MirroredRepeat:
                    if (Math.abs(Math.floor(uv.y) % 2) === 1) {
                        uv.y = Math.ceil(uv.y) - uv.y;
                    }
                    else {
                        uv.y = uv.y - Math.floor(uv.y);
                    }
                    break;
            }
        }
        if (this.flipY) {
            uv.y = 1 - uv.y;
        }
    };
    Texture.DEFAULT_IMAGE = undefined;
    Texture.DEFAULT_MAPPING = constants_1.TextureMapping.UV;
    return Texture;
}(EventDispatcher_1.EventDispatcher));
exports.Texture = Texture;
var count = 0;
function TextureIdCount() { return count++; }
exports.TextureIdCount = TextureIdCount;
;
//# sourceMappingURL=Texture.js.map