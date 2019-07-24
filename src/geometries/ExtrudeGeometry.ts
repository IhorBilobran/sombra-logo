/**
 * @author zz85 / http://www.lab4games.net/zz85/blog
 *
 * Creates extruded geometry from a path shape.
 *
 * parameters = {
 *
 *  curveSegments: <int>, // number of points on the curves
 *  steps: <int>, // number of points for z-side extrusions / used for subdividing segments of extrude spline too
 *  amount: <int>, // Depth to extrude the shape
 *
 *  bevelEnabled: <bool>, // turn on bevel
 *  bevelThickness: <float>, // how deep into the original shape bevel goes
 *  bevelSize: <float>, // how far from shape outline is bevel
 *  bevelSegments: <int>, // number of bevel layers
 *
 *  extrudePath: <THREE.CurvePath> // 3d spline path to extrude shape along. (creates Frames if .frames aren't defined)
 *  frames: <Object> // containing arrays of tangents, normals, binormals
 *
 *  uvGenerator: <Object> // object that provides UV generator functions
 *
 * }
 **/
import { Geometry } from "../core/Geometry";
import { Vector2 } from "../math/Vector2";
import { Face3 } from "../core/Face3";
import { Vector3 } from "../math/Vector3";
import { ShapeUtils } from "../extras/ShapeUtils";
import { Shape } from "../extras/core/Shape";
export class ExtrudeGeometry extends Geometry {
  constructor(shapes?: Shape | Shape[], options?: any) {
    if (typeof(shapes) === "undefined") {
      shapes = [];
      return;
    }
    super();
    this.type = 'ExtrudeGeometry';
    shapes = Array.isArray(shapes) ? shapes : [ shapes ];
    this.addShapeList(shapes, options);
    this.computeFaceNormals();
    // can't really use automatic vertex normals
    // as then front and back sides get smoothed too
    // should do separate smoothing just for sides
    //this.computeVertexNormals();
    //console.log("took", (Date.now() - startTime));
  }
  addShapeList(shapes: Shape[], options?: any) {
    const sl = shapes.length;
    for (let s = 0; s < sl; s ++) {
      const shape = shapes[ s ];
      this.addShape(shape, options);
    }
  }
  addShape(shape: Shape, options?: any) {
    const amount = options.amount !== undefined ? options.amount : 100;
    let bevelThickness = options.bevelThickness !== undefined ? options.bevelThickness : 6; // 10
    let bevelSize = options.bevelSize !== undefined ? options.bevelSize : bevelThickness - 2; // 8
    let bevelSegments = options.bevelSegments !== undefined ? options.bevelSegments : 3;
    let bevelEnabled = options.bevelEnabled !== undefined ? options.bevelEnabled : true; // false
    const curveSegments = options.curveSegments !== undefined ? options.curveSegments : 12;
    const steps = options.steps !== undefined ? options.steps : 1;
    const extrudePath = options.extrudePath;
    let extrudePts;
    let extrudeByPath = false;
    // Use default WorldUVGenerator if no UV generators are specified.
    const uvgen: UVGenerator = options.UVGenerator !== undefined ? options.UVGenerator : ExtrudeGeometry.WorldUVGenerator;
    let splineTube, binormal, normal, position2;
    if (extrudePath) {
      extrudePts = extrudePath.getSpacedPoints(steps);
      extrudeByPath = true;
      bevelEnabled = false; // bevels not supported for path extrusion
      // SETUP TNB variables
      // TODO1 - have a .isClosed in spline?
      splineTube = options.frames !== undefined ? options.frames : extrudePath.computeFrenetFrames(steps, false);
      // console.log(splineTube, 'splineTube', splineTube.normals.length, 'steps', steps, 'extrudePts', extrudePts.length);
      binormal = new Vector3();
      normal = new Vector3();
      position2 = new Vector3();
    }
    // Safeguards if bevels are not enabled
    if (! bevelEnabled) {
      bevelSegments = 0;
      bevelThickness = 0;
      bevelSize = 0;
    }
    // Variables initialization
    const scope = this;
    const shapesOffset = this.vertices.length;
    const shapePoints = shape.extractPoints(curveSegments);
    let vertices = shapePoints.shape;
    const holes = shapePoints.holes;
    let reverse = ! ShapeUtils.isClockWise(vertices);
    if (reverse) {
      vertices = vertices.reverse();
      // Maybe we should also check if holes are in the opposite direction, just to be safe ...
      for (let h = 0, hl = holes.length; h < hl; h ++) {
        const ahole = holes[ h ];
        if (ShapeUtils.isClockWise(ahole)) {
          holes[ h ] = ahole.reverse();
        }
      }
      reverse = false; // If vertices are in order now, we shouldn't need to worry about them again (hopefully)!
    }
    const faces = ShapeUtils.triangulateShape(vertices, holes);
    /* Vertices */
    const contour = vertices; // vertices has all points but contour has only points of circumference
    for (let h = 0, hl = holes.length; h < hl; h ++) {
      const ahole = holes[ h ];
      vertices = vertices.concat(ahole);
    }
    function scalePt2(pt: Vector2, vec: Vector2, size: number): Vector2 {
      if (! vec) console.error("THREE.ExtrudeGeometry: vec does not exist");
      return vec.clone().multiplyScalar(size).add(pt);
    }
    const vlen = vertices.length;
    const flen = faces.length;
    // Find directions for point movement
    function getBevelVec(inPt: Vector2, inPrev: Vector2, inNext: Vector2): Vector2 {
      // computes for inPt the corresponding point inPt' on a new contour
      //   shifted by 1 unit (length of normalized vector) to the left
      // if we walk along contour clockwise, this new contour is outside the old one
      //
      // inPt' is the intersection of the two lines parallel to the two
      //  adjacent edges of inPt at a distance of 1 unit on the left side.
      let v_trans_x, v_trans_y, shrink_by = 1;    // resulting translation vector for inPt
      // good reading for geometry algorithms (here: line-line intersection)
      // http://geomalgorithms.com/a05-_intersect-1.html
      const v_prev_x = inPt.x - inPrev.x, v_prev_y = inPt.y - inPrev.y;
      const v_next_x = inNext.x - inPt.x, v_next_y = inNext.y - inPt.y;
      const v_prev_lensq = (v_prev_x * v_prev_x + v_prev_y * v_prev_y);
      // check for collinear edges
      const collinear0 = (v_prev_x * v_next_y - v_prev_y * v_next_x);
      if (Math.abs(collinear0) > Number.EPSILON) {
        // not collinear
        // length of vectors for normalizing
        const v_prev_len = Math.sqrt(v_prev_lensq);
        const v_next_len = Math.sqrt(v_next_x * v_next_x + v_next_y * v_next_y);
        // shift adjacent points by unit vectors to the left
        const ptPrevShift_x = (inPrev.x - v_prev_y / v_prev_len);
        const ptPrevShift_y = (inPrev.y + v_prev_x / v_prev_len);
        const ptNextShift_x = (inNext.x - v_next_y / v_next_len);
        const ptNextShift_y = (inNext.y + v_next_x / v_next_len);
        // scaling factor for v_prev to intersection point
        const sf = ((ptNextShift_x - ptPrevShift_x) * v_next_y -
          (ptNextShift_y - ptPrevShift_y) * v_next_x) /
          (v_prev_x * v_next_y - v_prev_y * v_next_x);
        // vector from inPt to intersection point
        v_trans_x = (ptPrevShift_x + v_prev_x * sf - inPt.x);
        v_trans_y = (ptPrevShift_y + v_prev_y * sf - inPt.y);
        // Don't normalize!, otherwise sharp corners become ugly
        //  but prevent crazy spikes
        const v_trans_lensq = (v_trans_x * v_trans_x + v_trans_y * v_trans_y);
        if (v_trans_lensq <= 2) {
          return new Vector2(v_trans_x, v_trans_y);
        } else {
          shrink_by = Math.sqrt(v_trans_lensq / 2);
        }
      } else {
        // handle special case of collinear edges
        let direction_eq = false;    // assumes: opposite
        if (v_prev_x > Number.EPSILON) {
          if (v_next_x > Number.EPSILON) {
            direction_eq = true;
          }
        } else {
          if (v_prev_x < - Number.EPSILON) {
            if (v_next_x < - Number.EPSILON) {
              direction_eq = true;
            }
          } else {
            if (Math.sign(v_prev_y) === Math.sign(v_next_y)) {
              direction_eq = true;
            }
          }
        }
        if (direction_eq) {
          // console.log("Warning: lines are a straight sequence");
          v_trans_x = - v_prev_y;
          v_trans_y =  v_prev_x;
          shrink_by = Math.sqrt(v_prev_lensq);
        } else {
          // console.log("Warning: lines are a straight spike");
          v_trans_x = v_prev_x;
          v_trans_y = v_prev_y;
          shrink_by = Math.sqrt(v_prev_lensq / 2);
        }
      }
      return new Vector2(v_trans_x / shrink_by, v_trans_y / shrink_by);
    }
    const contourMovements = [];
    for (let i = 0, il = contour.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++) {
      if (j === il) j = 0;
      if (k === il) k = 0;
      //  (j)---(i)---(k)
      // console.log('i,j,k', i, j , k)
      contourMovements[ i ] = getBevelVec(contour[ i ], contour[ j ], contour[ k ]);
    }
    const holesMovements = [];
    let verticesMovements = contourMovements.concat();
    for (let h = 0, hl = holes.length; h < hl; h ++) {
      const ahole = holes[ h ];
      const oneHoleMovements = [];
      for (let i = 0, il = ahole.length, j = il - 1, k = i + 1; i < il; i ++, j ++, k ++) {
        if (j === il) j = 0;
        if (k === il) k = 0;
        //  (j)---(i)---(k)
        oneHoleMovements[ i ] = getBevelVec(ahole[ i ], ahole[ j ], ahole[ k ]);
      }
      holesMovements.push(oneHoleMovements);
      verticesMovements = verticesMovements.concat(oneHoleMovements);
    }
    // Loop bevelSegments, 1 for the front, 1 for the back
    for (let b = 0; b < bevelSegments; b ++) {
      //for (b = bevelSegments; b > 0; b --) {
      const t = b / bevelSegments;
      const z = bevelThickness * Math.cos(t * Math.PI / 2);
      const bs = bevelSize * Math.sin(t * Math.PI / 2);
      // contract shape
      for (let i = 0, il = contour.length; i < il; i ++) {
        const vert = scalePt2(contour[ i ], contourMovements[ i ], bs);
        v(vert.x, vert.y,  - z);
      }
      // expand holes
      for (let h = 0, hl = holes.length; h < hl; h ++) {
        const ahole = holes[ h ];
        const oneHoleMovements = holesMovements[ h ];
        for (let i = 0, il = ahole.length; i < il; i ++) {
          const vert = scalePt2(ahole[ i ], oneHoleMovements[ i ], bs);
          v(vert.x, vert.y,  - z);
        }
      }
    }
    const bs = bevelSize;
    // Back facing vertices
    for (let i = 0; i < vlen; i ++) {
      const vert = bevelEnabled ? scalePt2(vertices[ i ], verticesMovements[ i ], bs) : vertices[ i ];
      if (! extrudeByPath) {
        v(vert.x, vert.y, 0);
      } else {
        // v(vert.x, vert.y + extrudePts[ 0 ].y, extrudePts[ 0 ].x);
        normal.copy(splineTube.normals[ 0 ]).multiplyScalar(vert.x);
        binormal.copy(splineTube.binormals[ 0 ]).multiplyScalar(vert.y);
        position2.copy(extrudePts[ 0 ]).add(normal).add(binormal);
        v(position2.x, position2.y, position2.z);
      }
    }
    // Add stepped vertices...
    // Including front facing vertices
    for (let s = 1; s <= steps; s ++) {
      for (let i = 0; i < vlen; i ++) {
        const vert = bevelEnabled ? scalePt2(vertices[ i ], verticesMovements[ i ], bs) : vertices[ i ];
        if (! extrudeByPath) {
          v(vert.x, vert.y, amount / steps * s);
        } else {
          // v(vert.x, vert.y + extrudePts[ s - 1 ].y, extrudePts[ s - 1 ].x);
          normal.copy(splineTube.normals[ s ]).multiplyScalar(vert.x);
          binormal.copy(splineTube.binormals[ s ]).multiplyScalar(vert.y);
          position2.copy(extrudePts[ s ]).add(normal).add(binormal);
          v(position2.x, position2.y, position2.z);
        }
      }
    }
    // Add bevel segments planes
    //for (let b = 1; b <= bevelSegments; b ++) {
    for (let b = bevelSegments - 1; b >= 0; b --) {
      const t = b / bevelSegments;
      const z = bevelThickness * Math.cos(t * Math.PI / 2);
      const bs = bevelSize * Math.sin(t * Math.PI / 2);
      // contract shape
      for (let i = 0, il = contour.length; i < il; i ++) {
        const vert = scalePt2(contour[ i ], contourMovements[ i ], bs);
        v(vert.x, vert.y,  amount + z);
      }
      // expand holes
      for (let h = 0, hl = holes.length; h < hl; h ++) {
        const ahole = holes[ h ];
        const oneHoleMovements = holesMovements[ h ];
        for (let i = 0, il = ahole.length; i < il; i ++) {
          const vert = scalePt2(ahole[ i ], oneHoleMovements[ i ], bs);
          if (! extrudeByPath) {
            v(vert.x, vert.y,  amount + z);
          } else {
            v(vert.x, vert.y + extrudePts[ steps - 1 ].y, extrudePts[ steps - 1 ].x + z);
          }
        }
      }
    }
    /* Faces */
    // Top and bottom faces
    buildLidFaces();
    // Sides faces
    buildSideFaces();
    /////  Internal functions
    function buildLidFaces() {
      if (bevelEnabled) {
        let layer = 0; // steps + 1
        let offset = vlen * layer;
        // Bottom faces
        for (let i = 0; i < flen; i ++) {
          const face = faces[ i ];
          f3(face[ 2 ] + offset, face[ 1 ] + offset, face[ 0 ] + offset);
        }
        layer = steps + bevelSegments * 2;
        offset = vlen * layer;
        // Top faces
        for (let i = 0; i < flen; i ++) {
          const face = faces[ i ];
          f3(face[ 0 ] + offset, face[ 1 ] + offset, face[ 2 ] + offset);
        }
      } else {
        // Bottom faces
        for (let i = 0; i < flen; i ++) {
          const face = faces[ i ];
          f3(face[ 2 ], face[ 1 ], face[ 0 ]);
        }
        // Top faces
        for (let i = 0; i < flen; i ++) {
          const face = faces[ i ];
          f3(face[ 0 ] + vlen * steps, face[ 1 ] + vlen * steps, face[ 2 ] + vlen * steps);
        }
      }
    }
    // Create faces for the z-sides of the shape
    function buildSideFaces() {
      let layeroffset = 0;
      sidewalls(contour, layeroffset);
      layeroffset += contour.length;
      for (let h = 0, hl = holes.length; h < hl; h ++) {
        const ahole = holes[ h ];
        sidewalls(ahole, layeroffset);
        //, true
        layeroffset += ahole.length;
      }
    }
    function sidewalls(contour: any[], layeroffset: number): void {
      let i = contour.length;
      while (-- i >= 0) {
        let j = i;
        let k = i - 1;
        if (k < 0) k = contour.length - 1;
        //console.log('b', i,j, i-1, k,vertices.length);
        const sl = steps + bevelSegments * 2;
        for (let s = 0; s < sl; s ++) {
          const slen1 = vlen * s;
          const slen2 = vlen * (s + 1);
          const a = layeroffset + j + slen1,
            b = layeroffset + k + slen1,
            c = layeroffset + k + slen2,
            d = layeroffset + j + slen2;
          f4(a, b, c, d, contour, s, sl, j, k);
        }
      }
    }
    function v(x: number, y: number, z: number): void {
      scope.vertices.push(new Vector3(x, y, z));
    }
    function f3(a: number, b: number, c: number): void {
      a += shapesOffset;
      b += shapesOffset;
      c += shapesOffset;
      scope.faces.push(new Face3(a, b, c, null, null, 0));
      const uvs = uvgen.generateTopUV(scope, a, b, c);
      scope.faceVertexUvs[ 0 ].push(uvs);
    }
    function f4(a: number, b: number, c: number, d: number, wallContour: any, stepIndex: number, stepsLength: number, contourIndex1: number, contourIndex2: number): void {
      a += shapesOffset;
      b += shapesOffset;
      c += shapesOffset;
      d += shapesOffset;
      scope.faces.push(new Face3(a, b, d, null, null, 1));
      scope.faces.push(new Face3(b, c, d, null, null, 1));
      const uvs = uvgen.generateSideWallUV(scope, a, b, c, d);
      scope.faceVertexUvs[ 0 ].push([ uvs[ 0 ], uvs[ 1 ], uvs[ 3 ] ]);
      scope.faceVertexUvs[ 0 ].push([ uvs[ 1 ], uvs[ 2 ], uvs[ 3 ] ]);
    }
  }
  private static _WorldUVGenerator = class implements UVGenerator {
    generateTopUV(geometry: any, indexA: number, indexB: number, indexC: number): Vector2[] {
      const vertices = geometry.vertices;
      const a = vertices[ indexA ];
      const b = vertices[ indexB ];
      const c = vertices[ indexC ];
      return [
        new Vector2(a.x, a.y),
        new Vector2(b.x, b.y),
        new Vector2(c.x, c.y)
      ];
    }
    generateSideWallUV(geometry: any, indexA: number, indexB: number, indexC: number, indexD: number): Vector2[] {
      const vertices = geometry.vertices;
      const a = vertices[ indexA ];
      const b = vertices[ indexB ];
      const c = vertices[ indexC ];
      const d = vertices[ indexD ];
      if (Math.abs(a.y - b.y) < 0.01) {
        return [
          new Vector2(a.x, 1 - a.z),
          new Vector2(b.x, 1 - b.z),
          new Vector2(c.x, 1 - c.z),
          new Vector2(d.x, 1 - d.z)
        ];
      } else {
        return [
          new Vector2(a.y, 1 - a.z),
          new Vector2(b.y, 1 - b.z),
          new Vector2(c.y, 1 - c.z),
          new Vector2(d.y, 1 - d.z)
        ];
      }
    }
  };
  static WorldUVGenerator = new ExtrudeGeometry._WorldUVGenerator();
}
export interface UVGenerator {
  generateTopUV(geometry: any, indexA: number, indexB: number, indexC: number): Vector2[];
  generateSideWallUV(geometry: any, indexA: number, indexB: number, indexC: number, indexD: number): Vector2[];
}