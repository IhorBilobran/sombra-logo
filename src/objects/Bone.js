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
var Object3D_1 = require("../core/Object3D");
/**
 * @author mikael emtinger / http://gomo.se/
 * @author alteredq / http://alteredqualia.com/
 * @author ikerr / http://verold.com
 */
var Bone = /** @class */ (function (_super) {
    __extends(Bone, _super);
    function Bone(skin) {
        var _this = _super.call(this) || this;
        _this.isBone = true;
        _this.type = 'Bone';
        _this.skin = skin;
        return _this;
    }
    Bone.prototype.copy = function (source) {
        _super.prototype.copy.call(this, source);
        this.skin = source.skin;
        return this;
    };
    return Bone;
}(Object3D_1.Object3D));
exports.Bone = Bone;
//# sourceMappingURL=Bone.js.map