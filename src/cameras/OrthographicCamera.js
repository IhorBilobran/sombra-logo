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
/**
 * @author alteredq / http://alteredqualia.com/
 * @author arose / http://github.com/arose
 */
var OrthographicCamera = /** @class */ (function (_super) {
    __extends(OrthographicCamera, _super);
    function OrthographicCamera(left, right, top, bottom, near, far) {
        if (near === void 0) { near = 0.1; }
        if (far === void 0) { far = 2000; }
        var _this = _super.call(this) || this;
        _this.zoom = 1;
        _this.view = null;
        _this.isOrthographicCamera = true;
        _this.type = 'OrthographicCamera';
        _this.left = left;
        _this.right = right;
        _this.top = top;
        _this.bottom = bottom;
        _this.near = near;
        _this.far = far;
        _this.updateProjectionMatrix();
        return _this;
    }
    OrthographicCamera.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.left = source.left;
        this.right = source.right;
        this.top = source.top;
        this.bottom = source.bottom;
        this.near = source.near;
        this.far = source.far;
        this.zoom = source.zoom;
        this.view = source.view === null ? null : Object.assign({}, source.view);
        return this;
    };
    OrthographicCamera.prototype.setViewOffset = function (fullWidth, fullHeight, x, y, width, height) {
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
    OrthographicCamera.prototype.clearViewOffset = function () {
        this.view = null;
        this.updateProjectionMatrix();
    };
    OrthographicCamera.prototype.updateProjectionMatrix = function () {
        var dx = (this.right - this.left) / (2 * this.zoom);
        var dy = (this.top - this.bottom) / (2 * this.zoom);
        var cx = (this.right + this.left) / 2;
        var cy = (this.top + this.bottom) / 2;
        var left = cx - dx;
        var right = cx + dx;
        var top = cy + dy;
        var bottom = cy - dy;
        if (this.view !== null) {
            var zoomW = this.zoom / (this.view.width / this.view.fullWidth);
            var zoomH = this.zoom / (this.view.height / this.view.fullHeight);
            var scaleW = (this.right - this.left) / this.view.width;
            var scaleH = (this.top - this.bottom) / this.view.height;
            left += scaleW * (this.view.offsetX / zoomW);
            right = left + scaleW * (this.view.width / zoomW);
            top -= scaleH * (this.view.offsetY / zoomH);
            bottom = top - scaleH * (this.view.height / zoomH);
        }
        this.projectionMatrix.makeOrthographic(left, right, top, bottom, this.near, this.far);
    };
    OrthographicCamera.prototype.toJSON = function (meta) {
        var data = _super.prototype.toJSON.call(this, meta);
        data.object.zoom = this.zoom;
        data.object.left = this.left;
        data.object.right = this.right;
        data.object.top = this.top;
        data.object.bottom = this.bottom;
        data.object.near = this.near;
        data.object.far = this.far;
        if (this.view !== null)
            data.object.view = Object.assign({}, this.view);
        return data;
    };
    return OrthographicCamera;
}(Camera_1.Camera));
exports.OrthographicCamera = OrthographicCamera;
//# sourceMappingURL=OrthographicCamera.js.map