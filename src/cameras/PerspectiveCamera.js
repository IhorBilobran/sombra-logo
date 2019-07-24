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
var Camera_1 = require("./Camera");
var Math_1 = require("../math/Math");
/**
 * @author mrdoob / http://mrdoob.com/
 * @author greggman / http://games.greggman.com/
 * @author zz85 / http://www.lab4games.net/zz85/blog
 * @author tschw
 */
var PerspectiveCamera = /** @class */ (function (_super) {
    __extends(PerspectiveCamera, _super);
    function PerspectiveCamera(fov, aspect, near, far) {
        if (fov === void 0) { fov = 50; }
        if (aspect === void 0) { aspect = 1; }
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var _this = _super.call(this) || this;
        _this.zoom = 1;
        _this.focus = 10;
        _this.view = null;
        _this.filmGauge = 35; // width of the film (default in millimeters)
        _this.filmOffset = 0; // horizontal film offset (same unit as gauge)
        _this.isPerspectiveCamera = true;
        _this.type = 'PerspectiveCamera';
        _this.fov = fov;
        _this.near = near;
        _this.far = far;
        _this.aspect = aspect;
        _this.updateProjectionMatrix();
        return _this;
    }
    PerspectiveCamera.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.fov = source.fov;
        this.zoom = source.zoom;
        this.near = source.near;
        this.far = source.far;
        this.focus = source.focus;
        this.aspect = source.aspect;
        this.view = source.view === null ? null : Object.assign({}, source.view);
        this.filmGauge = source.filmGauge;
        this.filmOffset = source.filmOffset;
        return this;
    };
    PerspectiveCamera.prototype.setLens = function (focalLength, filmGauge) {
        console.warn("THREE.PerspectiveCamera.setLens is deprecated. " +
            "Use .setFocalLength and .filmGauge for a photographic setup.");
        if (filmGauge !== undefined)
            this.filmGauge = filmGauge;
        this.setFocalLength(focalLength);
    };
    /**
     * Sets the FOV by focal length in respect to the current .filmGauge.
     *
     * The default film gauge is 35, so that the focal length can be specified for
     * a 35mm (full frame) camera.
     *
     * Values for focal length and film gauge must have the same unit.
     */
    PerspectiveCamera.prototype.setFocalLength = function (focalLength) {
        // see http://www.bobatkins.com/photography/technical/field_of_view.html
        var vExtentSlope = 0.5 * this.getFilmHeight() / focalLength;
        this.fov = Math_1._Math.RAD2DEG * 2 * Math.atan(vExtentSlope);
        this.updateProjectionMatrix();
    };
    /**
     * Calculates the focal length from the current .fov and .filmGauge.
     */
    PerspectiveCamera.prototype.getFocalLength = function () {
        var vExtentSlope = Math.tan(Math_1._Math.DEG2RAD * 0.5 * this.fov);
        return 0.5 * this.getFilmHeight() / vExtentSlope;
    };
    PerspectiveCamera.prototype.getEffectiveFOV = function () {
        return Math_1._Math.RAD2DEG * 2 * Math.atan(Math.tan(Math_1._Math.DEG2RAD * 0.5 * this.fov) / this.zoom);
    };
    PerspectiveCamera.prototype.getFilmWidth = function () {
        // film not completely covered in portrait format (aspect < 1)
        return this.filmGauge * Math.min(this.aspect, 1);
    };
    PerspectiveCamera.prototype.getFilmHeight = function () {
        // film not completely covered in landscape format (aspect > 1)
        return this.filmGauge / Math.max(this.aspect, 1);
    };
    /**
     * Sets an offset in a larger frustum. This is useful for multi-window or
     * multi-monitor/multi-machine setups.
     *
     * For example, if you have 3x2 monitors and each monitor is 1920x1080 and
     * the monitors are in grid like this
     *
     *   +---+---+---+
     *   | A | B | C |
     *   +---+---+---+
     *   | D | E | F |
     *   +---+---+---+
     *
     * then for each monitor you would call it like this
     *
     *   let w = 1920;
     *   let h = 1080;
     *   let fullWidth = w * 3;
     *   let fullHeight = h * 2;
     *
     *   --A--
     *   camera.setOffset(fullWidth, fullHeight, w * 0, h * 0, w, h);
     *   --B--
     *   camera.setOffset(fullWidth, fullHeight, w * 1, h * 0, w, h);
     *   --C--
     *   camera.setOffset(fullWidth, fullHeight, w * 2, h * 0, w, h);
     *   --D--
     *   camera.setOffset(fullWidth, fullHeight, w * 0, h * 1, w, h);
     *   --E--
     *   camera.setOffset(fullWidth, fullHeight, w * 1, h * 1, w, h);
     *   --F--
     *   camera.setOffset(fullWidth, fullHeight, w * 2, h * 1, w, h);
     *
     *   Note there is no reason monitors have to be the same size or in a grid.
     */
    PerspectiveCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {
        this.aspect = fullWidth / fullHeight;
        this.view = {
            fullWidth: fullWidth,
            fullHeight: fullHeight,
            offsetX: x,
            offsetY: y,
            width: width,
            height: height
        };
        this.updateProjectionMatrix();
    };
    PerspectiveCamera.prototype.clearViewOffset = function () {
        this.view = null;
        this.updateProjectionMatrix();
    };
    PerspectiveCamera.prototype.updateProjectionMatrix = function () {
        var near = this.near;
        var top = near * Math.tan(Math_1._Math.DEG2RAD * 0.5 * this.fov) / this.zoom;
        var height = 2 * top;
        var width = this.aspect * height;
        var left = -0.5 * width;
        var view = this.view;
        if (view !== null) {
            var fullWidth = view.fullWidth, fullHeight = view.fullHeight;
            left += view.offsetX * width / fullWidth;
            top -= view.offsetY * height / fullHeight;
            width *= view.width / fullWidth;
            height *= view.height / fullHeight;
        }
        var skew = this.filmOffset;
        if (skew !== 0)
            left += near * skew / this.getFilmWidth();
        this.projectionMatrix.makeFrustum(left, left + width, top - height, top, near, this.far);
    };
    PerspectiveCamera.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.fov = this.fov;
        data.object.zoom = this.zoom;
        data.object.near = this.near;
        data.object.far = this.far;
        data.object.focus = this.focus;
        data.object.aspect = this.aspect;
        if (this.view !== null)
            data.object.view = Object.assign({}, this.view);
        data.object.filmGauge = this.filmGauge;
        data.object.filmOffset = this.filmOffset;
        return data;
    };
    return PerspectiveCamera;
}(Camera_1.Camera));
exports.PerspectiveCamera = PerspectiveCamera;
//# sourceMappingURL=PerspectiveCamera.js.map