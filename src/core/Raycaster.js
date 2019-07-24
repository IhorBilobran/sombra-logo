"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Ray_1 = require("../math/Ray");
var OrthographicCamera_1 = require("../cameras/OrthographicCamera");
var PerspectiveCamera_1 = require("../cameras/PerspectiveCamera");
/**
 * @author mrdoob / http://mrdoob.com/
 * @author bhouston / http://clara.io/
 * @author stephomi / http://stephaneginier.com/
 */
var Intersect = /** @class */ (function () {
    function Intersect() {
    }
    return Intersect;
}());
exports.Intersect = Intersect;
var Raycaster = /** @class */ (function () {
    function Raycaster(origin, direction, near, far) {
        this.linePrecision = 1;
        this.ray = new Ray_1.Ray(origin, direction);
        // direction is assumed to be normalized (for accurate distance calculations)
        this.near = near || 0;
        this.far = far || Infinity;
        this.params = {
            Mesh: {},
            Line: {},
            LOD: {},
            Points: { threshold: 1 },
            Sprite: {}
        };
        //Object.defineProperties(this.params, {
        //  PointCloud: {
        //    get: function () {
        //      console.warn('THREE.Raycaster: params.PointCloud has been renamed to params.Points.');
        //      return this.Points;
        //    }
        //  }
        //});
    }
    Raycaster.prototype.set = function (origin, direction) {
        // direction is assumed to be normalized (for accurate distance calculations)
        this.ray.set(origin, direction);
    };
    Raycaster.prototype.setFromCamera = function (coords, camera) {
        if ((camera && camera instanceof PerspectiveCamera_1.PerspectiveCamera)) {
            this.ray.origin.setFromMatrixPosition(camera.matrixWorld);
            this.ray.direction.set(coords.x, coords.y, 0.5).unproject(camera).sub(this.ray.origin).normalize();
        }
        else if ((camera && camera instanceof OrthographicCamera_1.OrthographicCamera)) {
            this.ray.origin.set(coords.x, coords.y, (camera.near + camera.far) / (camera.near - camera.far)).unproject(camera); // set origin in plane of camera
            this.ray.direction.set(0, 0, -1).transformDirection(camera.matrixWorld);
        }
        else {
            console.error('THREE.Raycaster: Unsupported camera type.');
        }
    };
    Raycaster.prototype.intersectObject = function (object, recursive) {
        var intersects = [];
        intersectObject(object, this, intersects, recursive);
        intersects.sort(ascSort);
        return intersects;
    };
    Raycaster.prototype.intersectObjects = function (objects, recursive) {
        var intersects = [];
        if (Array.isArray(objects) === false) {
            console.warn('THREE.Raycaster.intersectObjects: objects is not an Array.');
            return intersects;
        }
        for (var i = 0, l = objects.length; i < l; i++) {
            intersectObject(objects[i], this, intersects, recursive);
        }
        intersects.sort(ascSort);
        return intersects;
    };
    return Raycaster;
}());
exports.Raycaster = Raycaster;
function ascSort(a, b) {
    return a.distance - b.distance;
}
function intersectObject(object, raycaster, intersects, recursive) {
    if (object.visible === false)
        return;
    object.raycast(raycaster, intersects);
    if (recursive === true) {
        var children = object.children;
        for (var i = 0, l = children.length; i < l; i++) {
            intersectObject(children[i], raycaster, intersects, true);
        }
    }
}
//# sourceMappingURL=Raycaster.js.map