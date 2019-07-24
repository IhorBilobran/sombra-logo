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
var constants_2 = require("../constants");
var Color_1 = require("../math/Color");
var Math_1 = require("../math/Math");
var Vector3_1 = require("../math/Vector3");
var Texture_1 = require("../textures/Texture");
var Material = /** @class */ (function (_super) {
    __extends(Material, _super);
    function Material() {
        var _this = _super.call(this) || this;
        _this.id = MaterialIdCount();
        _this.uuid = Math_1._Math.generateUUID();
        _this.name = '';
        _this.type = 'Material';
        _this.fog = true;
        _this.lights = true;
        _this.blending = constants_2.BlendingMode.Normal;
        _this.side = constants_1.SideMode.Front;
        _this.shading = constants_1.ShadingMode.Smooth; // THREE.ShadingMode.Flat, THREE.ShadingMode.Smooth
        _this.vertexColors = constants_1.ColorsMode.None; // THREE.ColorsMode.No, THREE.ColorsMode.Vertex, THREE.ColorsMode.Face
        _this._opacity = 1;
        _this.transparent = false;
        _this.blendSrc = constants_1.BlendingFactor.SrcAlpha;
        _this.blendDst = constants_1.BlendingFactor.OneMinusSrcAlpha;
        _this.blendEquation = constants_1.BlendingEquation.Add;
        _this.blendSrcAlpha = null;
        _this.blendDstAlpha = null;
        _this.blendEquationAlpha = null;
        _this.depthFunc = constants_1.DepthFunction.LessEqual;
        _this.depthTest = true;
        _this.depthWrite = true;
        _this.clipping = false;
        _this.clippingPlanes = null;
        _this.clipIntersection = false;
        _this.clipShadows = false;
        _this.colorWrite = true;
        _this.precision = null; // override the renderer's default precision for this material
        _this.polygonOffset = false;
        _this.polygonOffsetFactor = 0;
        _this.polygonOffsetUnits = 0;
        _this.alphaTest = 0;
        _this.premultipliedAlpha = false;
        _this.overdraw = 0; // Overdrawn pixels (typically between 0 and 1) for fixing antialiasing gaps in CanvasRenderer
        _this.visible = true;
        _this._needsUpdate = true;
        // }
        _this.isMaterial = true;
        _this.isMultiMaterial = false;
        return _this;
    }
    Object.defineProperty(Material.prototype, "opacity", {
        get: function () {
            return this._opacity;
        },
        set: function (value) {
            this._opacity = value;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "needsUpdate", {
        get: function () {
            return this._needsUpdate;
        },
        set: function (value) {
            if (value === true)
                this.update();
            this._needsUpdate = value;
        },
        enumerable: true,
        configurable: true
    });
    Material.prototype.setValues = function (values) {
        if (values === undefined)
            return;
        for (var key in values) {
            var newValue = values[key];
            if (newValue === undefined) {
                console.warn("THREE.Material: '" + key + "' parameter is undefined.");
                continue;
            }
            var currentValue = this[key];
            if (currentValue === undefined) {
                console.warn("THREE." + this.type + ": '" + key + "' is not a property of this material.");
                continue;
            }
            if ((currentValue && currentValue instanceof Color_1.Color)) {
                currentValue.set(newValue);
            }
            else if ((currentValue && currentValue instanceof Vector3_1.Vector3) && (newValue && newValue instanceof Vector3_1.Vector3)) {
                currentValue.copy(newValue);
            }
            else if (key === 'overdraw') {
                // ensure overdraw is backwards-compatible with legacy boolean type
                this[key] = Number(newValue);
            }
            else {
                this[key] = newValue;
            }
        }
    };
    Material.prototype.toJSON = function (meta) {
        var isRoot = meta === undefined;
        if (isRoot) {
            meta = {
                textures: {},
                images: {}
            };
        }
        var data = {
            metadata: {
                version: 4.4,
                type: 'Material',
                generator: 'Material.toJSON'
            }
        };
        // standard Material serialization
        data.uuid = this.uuid;
        data.type = this.type;
        if (this.name !== '')
            data.name = this.name;
        if ((this.color && this.color instanceof Color_1.Color))
            data.color = this.color.getHex();
        if (this.roughness !== undefined)
            data.roughness = this.roughness;
        if (this.metalness !== undefined)
            data.metalness = this.metalness;
        if ((this.emissive && this.emissive instanceof Color_1.Color))
            data.emissive = this.emissive.getHex();
        if ((this.specular && this.specular instanceof Color_1.Color))
            data.specular = this.specular.getHex();
        if (this.shininess !== undefined)
            data.shininess = this.shininess;
        if ((this.map && this.map instanceof Texture_1.Texture))
            data.map = this.map.toJSON(meta).uuid;
        if ((this.alphaMap && this.alphaMap instanceof Texture_1.Texture))
            data.alphaMap = this.alphaMap.toJSON(meta).uuid;
        if ((this.lightMap && this.lightMap instanceof Texture_1.Texture))
            data.lightMap = this.lightMap.toJSON(meta).uuid;
        if ((this.bumpMap && this.bumpMap instanceof Texture_1.Texture)) {
            data.bumpMap = this.bumpMap.toJSON(meta).uuid;
            data.bumpScale = this.bumpScale;
        }
        if ((this.normalMap && this.normalMap instanceof Texture_1.Texture)) {
            data.normalMap = this.normalMap.toJSON(meta).uuid;
            data.normalScale = this.normalScale.toArray();
        }
        if ((this.displacementMap && this.displacementMap instanceof Texture_1.Texture)) {
            data.displacementMap = this.displacementMap.toJSON(meta).uuid;
            data.displacementScale = this.displacementScale;
            data.displacementBias = this.displacementBias;
        }
        if ((this.roughnessMap && this.roughnessMap instanceof Texture_1.Texture))
            data.roughnessMap = this.roughnessMap.toJSON(meta).uuid;
        if ((this.metalnessMap && this.metalnessMap instanceof Texture_1.Texture))
            data.metalnessMap = this.metalnessMap.toJSON(meta).uuid;
        if ((this.emissiveMap && this.emissiveMap instanceof Texture_1.Texture))
            data.emissiveMap = this.emissiveMap.toJSON(meta).uuid;
        if ((this.specularMap && this.specularMap instanceof Texture_1.Texture))
            data.specularMap = this.specularMap.toJSON(meta).uuid;
        if ((this.envMap && this.envMap instanceof Texture_1.Texture)) {
            data.envMap = this.envMap.toJSON(meta).uuid;
            data.reflectivity = this.reflectivity; // Scale behind envMap
        }
        if (this.size !== undefined)
            data.size = this.size;
        if (this.sizeAttenuation !== undefined)
            data.sizeAttenuation = this.sizeAttenuation;
        if (this.blending !== constants_2.BlendingMode.Normal)
            data.blending = this.blending;
        if (this.shading !== constants_1.ShadingMode.Smooth)
            data.shading = this.shading;
        if (this.side !== constants_1.SideMode.Front)
            data.side = this.side;
        if (this.vertexColors !== constants_1.ColorsMode.None)
            data.vertexColors = this.vertexColors;
        if (this.opacity < 1)
            data.opacity = this.opacity;
        if (this.transparent === true)
            data.transparent = this.transparent;
        data.depthFunc = this.depthFunc;
        data.depthTest = this.depthTest;
        data.depthWrite = this.depthWrite;
        if (this.alphaTest > 0)
            data.alphaTest = this.alphaTest;
        if (this.premultipliedAlpha === true)
            data.premultipliedAlpha = this.premultipliedAlpha;
        if (this.wireframe === true)
            data.wireframe = this.wireframe;
        if (this.wireframeLinewidth > 1)
            data.wireframeLinewidth = this.wireframeLinewidth;
        if (this.wireframeLinecap !== 'round')
            data.wireframeLinecap = this.wireframeLinecap;
        if (this.wireframeLinejoin !== 'round')
            data.wireframeLinejoin = this.wireframeLinejoin;
        data.skinning = this.skinning;
        data.morphTargets = this.morphTargets;
        // TODO: Copied from Object3D.toJSON
        function extractFromCache(cache) {
            var values = [];
            for (var key in cache) {
                var data_1 = cache[key];
                delete data_1.metadata;
                values.push(data_1);
            }
            return values;
        }
        if (isRoot) {
            var textures = extractFromCache(meta.textures);
            var images = extractFromCache(meta.images);
            if (textures.length > 0)
                data.textures = textures;
            if (images.length > 0)
                data.images = images;
        }
        return data;
    };
    Material.prototype.clone = function () {
        return new this.constructor().copy(this);
    };
    Material.prototype.copy = function (source) {
        this.name = source.name;
        this.fog = source.fog;
        this.lights = source.lights;
        this.blending = source.blending;
        this.side = source.side;
        this.shading = source.shading;
        this.vertexColors = source.vertexColors;
        this.opacity = source.opacity;
        this.transparent = source.transparent;
        this.blendSrc = source.blendSrc;
        this.blendDst = source.blendDst;
        this.blendEquation = source.blendEquation;
        this.blendSrcAlpha = source.blendSrcAlpha;
        this.blendDstAlpha = source.blendDstAlpha;
        this.blendEquationAlpha = source.blendEquationAlpha;
        this.depthFunc = source.depthFunc;
        this.depthTest = source.depthTest;
        this.depthWrite = source.depthWrite;
        this.colorWrite = source.colorWrite;
        this.precision = source.precision;
        this.polygonOffset = source.polygonOffset;
        this.polygonOffsetFactor = source.polygonOffsetFactor;
        this.polygonOffsetUnits = source.polygonOffsetUnits;
        this.alphaTest = source.alphaTest;
        this.premultipliedAlpha = source.premultipliedAlpha;
        this.overdraw = source.overdraw;
        this.visible = source.visible;
        this.clipShadows = source.clipShadows;
        this.clipIntersection = source.clipIntersection;
        var srcPlanes = source.clippingPlanes, dstPlanes = null;
        if (srcPlanes !== null) {
            var n = srcPlanes.length;
            dstPlanes = new Array(n);
            for (var i = 0; i !== n; ++i)
                dstPlanes[i] = srcPlanes[i].clone();
        }
        this.clippingPlanes = dstPlanes;
        return this;
    };
    Material.prototype.update = function () {
        this.dispatchEvent({ type: 'update' });
    };
    Material.prototype.dispose = function () {
        this.dispatchEvent({ type: 'dispose' });
    };
    Object.defineProperty(Material.prototype, "wrapAround", {
        get: function () {
            console.warn("THREE." + this.type + ": .wrapAround has been removed.");
            return false;
        },
        set: function (value) {
            console.warn("THREE." + this.type + ": .wrapAround has been removed.");
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Material.prototype, "wrapRGB", {
        get: function () {
            console.warn("THREE." + this.type + ": .wrapRGB has been removed.");
            return new Color_1.Color();
        },
        enumerable: true,
        configurable: true
    });
    return Material;
}(EventDispatcher_1.EventDispatcher));
exports.Material = Material;
var count = 0;
function MaterialIdCount() { return count++; }
exports.MaterialIdCount = MaterialIdCount;
;
//# sourceMappingURL=Material.js.map