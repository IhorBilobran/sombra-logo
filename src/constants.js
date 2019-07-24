"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.REVISION = "82";
//
var MOUSE;
(function (MOUSE) {
    MOUSE[MOUSE["LEFT"] = 0] = "LEFT";
    MOUSE[MOUSE["MIDDLE"] = 1] = "MIDDLE";
    MOUSE[MOUSE["RIGHT"] = 2] = "RIGHT";
})(MOUSE = exports.MOUSE || (exports.MOUSE = {}));
//
var CullFace;
(function (CullFace) {
    CullFace[CullFace["None"] = 0] = "None";
    CullFace[CullFace["Back"] = 1] = "Back";
    CullFace[CullFace["Front"] = 2] = "Front";
    CullFace[CullFace["FrontBack"] = 3] = "FrontBack";
})(CullFace = exports.CullFace || (exports.CullFace = {}));
exports.CullFaceNone = CullFace.None;
exports.CullFaceBack = CullFace.Back;
exports.CullFaceFront = CullFace.Front;
exports.CullFaceFrontBack = CullFace.FrontBack;
//
var FrontFaceDirection;
(function (FrontFaceDirection) {
    FrontFaceDirection[FrontFaceDirection["CW"] = 0] = "CW";
    FrontFaceDirection[FrontFaceDirection["CCW"] = 1] = "CCW";
})(FrontFaceDirection = exports.FrontFaceDirection || (exports.FrontFaceDirection = {}));
exports.FrontFaceDirectionCW = FrontFaceDirection.CW;
exports.FrontFaceDirectionCCW = FrontFaceDirection.CCW;
//
var ShadowMap;
(function (ShadowMap) {
    ShadowMap[ShadowMap["Basic"] = 0] = "Basic";
    ShadowMap[ShadowMap["PCF"] = 1] = "PCF";
    ShadowMap[ShadowMap["PCFSoft"] = 2] = "PCFSoft";
})(ShadowMap = exports.ShadowMap || (exports.ShadowMap = {}));
exports.BasicShadowMap = ShadowMap.Basic;
exports.PCFShadowMap = ShadowMap.PCF;
exports.PCFSoftShadowMap = ShadowMap.PCFSoft;
//
var SideMode;
(function (SideMode) {
    SideMode[SideMode["Front"] = 0] = "Front";
    SideMode[SideMode["Back"] = 1] = "Back";
    SideMode[SideMode["Double"] = 2] = "Double";
})(SideMode = exports.SideMode || (exports.SideMode = {}));
exports.FrontSide = SideMode.Front;
exports.BackSide = SideMode.Back;
exports.DoubleSide = SideMode.Double;
//
var ShadingMode;
(function (ShadingMode) {
    ShadingMode[ShadingMode["Flat"] = 1] = "Flat";
    ShadingMode[ShadingMode["Smooth"] = 2] = "Smooth";
})(ShadingMode = exports.ShadingMode || (exports.ShadingMode = {}));
exports.FlatShading = ShadingMode.Flat;
exports.SmoothShading = ShadingMode.Smooth;
//
var ColorsMode;
(function (ColorsMode) {
    ColorsMode[ColorsMode["None"] = 0] = "None";
    ColorsMode[ColorsMode["Face"] = 1] = "Face";
    ColorsMode[ColorsMode["Vertex"] = 2] = "Vertex";
})(ColorsMode = exports.ColorsMode || (exports.ColorsMode = {}));
exports.NoColors = ColorsMode.None;
exports.FaceColors = ColorsMode.Face;
exports.VertexColors = ColorsMode.Vertex;
//
var BlendingMode;
(function (BlendingMode) {
    BlendingMode[BlendingMode["None"] = 0] = "None";
    BlendingMode[BlendingMode["Normal"] = 1] = "Normal";
    BlendingMode[BlendingMode["Additive"] = 2] = "Additive";
    BlendingMode[BlendingMode["Subtractive"] = 3] = "Subtractive";
    BlendingMode[BlendingMode["Multiply"] = 4] = "Multiply";
    BlendingMode[BlendingMode["Custom"] = 5] = "Custom";
})(BlendingMode = exports.BlendingMode || (exports.BlendingMode = {}));
exports.NoBlending = BlendingMode.None;
exports.NormalBlending = BlendingMode.Normal;
exports.AdditiveBlending = BlendingMode.Additive;
exports.SubtractiveBlending = BlendingMode.Subtractive;
exports.MultiplyBlending = BlendingMode.Multiply;
exports.CustomBlending = BlendingMode.Custom;
//
var BlendingEquation;
(function (BlendingEquation) {
    BlendingEquation[BlendingEquation["Add"] = 100] = "Add";
    BlendingEquation[BlendingEquation["Subtract"] = 101] = "Subtract";
    BlendingEquation[BlendingEquation["ReverseSubtract"] = 102] = "ReverseSubtract";
    BlendingEquation[BlendingEquation["Min"] = 103] = "Min";
    BlendingEquation[BlendingEquation["Max"] = 104] = "Max";
})(BlendingEquation = exports.BlendingEquation || (exports.BlendingEquation = {}));
exports.AddEquation = BlendingEquation.Add;
exports.SubtractEquation = BlendingEquation.Subtract;
exports.ReverseSubtractEquation = BlendingEquation.ReverseSubtract;
exports.MinEquation = BlendingEquation.Min;
exports.MaxEquation = BlendingEquation.Max;
//
var BlendingFactor;
(function (BlendingFactor) {
    BlendingFactor[BlendingFactor["Zero"] = 200] = "Zero";
    BlendingFactor[BlendingFactor["One"] = 201] = "One";
    BlendingFactor[BlendingFactor["SrcColor"] = 202] = "SrcColor";
    BlendingFactor[BlendingFactor["OneMinusSrcColor"] = 203] = "OneMinusSrcColor";
    BlendingFactor[BlendingFactor["SrcAlpha"] = 204] = "SrcAlpha";
    BlendingFactor[BlendingFactor["OneMinusSrcAlpha"] = 205] = "OneMinusSrcAlpha";
    BlendingFactor[BlendingFactor["DstAlpha"] = 206] = "DstAlpha";
    BlendingFactor[BlendingFactor["OneMinusDstAlpha"] = 207] = "OneMinusDstAlpha";
    BlendingFactor[BlendingFactor["DstColor"] = 208] = "DstColor";
    BlendingFactor[BlendingFactor["OneMinusDstColor"] = 209] = "OneMinusDstColor";
    BlendingFactor[BlendingFactor["SrcAlphaSaturate"] = 210] = "SrcAlphaSaturate";
})(BlendingFactor = exports.BlendingFactor || (exports.BlendingFactor = {}));
exports.ZeroFactor = BlendingFactor.Zero;
exports.OneFactor = BlendingFactor.One;
exports.SrcColorFactor = BlendingFactor.SrcColor;
exports.OneMinusSrcColorFactor = BlendingFactor.OneMinusSrcColor;
exports.SrcAlphaFactor = BlendingFactor.SrcAlpha;
exports.OneMinusSrcAlphaFactor = BlendingFactor.OneMinusSrcAlpha;
exports.DstAlphaFactor = BlendingFactor.DstAlpha;
exports.OneMinusDstAlphaFactor = BlendingFactor.OneMinusDstAlpha;
exports.DstColorFactor = BlendingFactor.DstColor;
exports.OneMinusDstColorFactor = BlendingFactor.OneMinusDstColor;
exports.SrcAlphaSaturateFactor = BlendingFactor.SrcAlphaSaturate;
//
var DepthFunction;
(function (DepthFunction) {
    DepthFunction[DepthFunction["Never"] = 0] = "Never";
    DepthFunction[DepthFunction["Always"] = 1] = "Always";
    DepthFunction[DepthFunction["Less"] = 2] = "Less";
    DepthFunction[DepthFunction["LessEqual"] = 3] = "LessEqual";
    DepthFunction[DepthFunction["Equal"] = 4] = "Equal";
    DepthFunction[DepthFunction["GreaterEqual"] = 5] = "GreaterEqual";
    DepthFunction[DepthFunction["Greater"] = 6] = "Greater";
    DepthFunction[DepthFunction["NotEqual"] = 7] = "NotEqual";
})(DepthFunction = exports.DepthFunction || (exports.DepthFunction = {}));
exports.NeverDepth = DepthFunction.Never;
exports.AlwaysDepth = DepthFunction.Always;
exports.LessDepth = DepthFunction.Less;
exports.LessEqualDepth = DepthFunction.LessEqual;
exports.EqualDepth = DepthFunction.Equal;
exports.GreaterEqualDepth = DepthFunction.GreaterEqual;
exports.GreaterDepth = DepthFunction.Greater;
exports.NotEqualDepth = DepthFunction.NotEqual;
//
var BlendingOperation;
(function (BlendingOperation) {
    BlendingOperation[BlendingOperation["Multiply"] = 0] = "Multiply";
    BlendingOperation[BlendingOperation["Mix"] = 1] = "Mix";
    BlendingOperation[BlendingOperation["Add"] = 2] = "Add";
})(BlendingOperation = exports.BlendingOperation || (exports.BlendingOperation = {}));
exports.MultiplyOperation = BlendingOperation.Multiply;
exports.MixOperation = BlendingOperation.Mix;
exports.AddOperation = BlendingOperation.Add;
//
var ToneMapping;
(function (ToneMapping) {
    ToneMapping[ToneMapping["None"] = 0] = "None";
    ToneMapping[ToneMapping["Linear"] = 1] = "Linear";
    ToneMapping[ToneMapping["Reinhard"] = 2] = "Reinhard";
    ToneMapping[ToneMapping["Uncharted2"] = 3] = "Uncharted2";
    ToneMapping[ToneMapping["Cineon"] = 4] = "Cineon";
})(ToneMapping = exports.ToneMapping || (exports.ToneMapping = {}));
exports.NoToneMapping = ToneMapping.None;
exports.LinearToneMapping = ToneMapping.Linear;
exports.ReinhardToneMapping = ToneMapping.Reinhard;
exports.Uncharted2ToneMapping = ToneMapping.Uncharted2;
exports.CineonToneMapping = ToneMapping.Cineon;
//
var TextureMapping;
(function (TextureMapping) {
    TextureMapping[TextureMapping["UV"] = 300] = "UV";
    TextureMapping[TextureMapping["CubeReflection"] = 301] = "CubeReflection";
    TextureMapping[TextureMapping["CubeRefraction"] = 302] = "CubeRefraction";
    TextureMapping[TextureMapping["EquirectangularReflection"] = 303] = "EquirectangularReflection";
    TextureMapping[TextureMapping["EquirectangularRefraction"] = 304] = "EquirectangularRefraction";
    TextureMapping[TextureMapping["SphericalReflection"] = 305] = "SphericalReflection";
    TextureMapping[TextureMapping["CubeUVReflection"] = 306] = "CubeUVReflection";
    TextureMapping[TextureMapping["CubeUVRefraction"] = 307] = "CubeUVRefraction";
})(TextureMapping = exports.TextureMapping || (exports.TextureMapping = {}));
exports.UVMapping = TextureMapping.UV;
exports.CubeReflectionMapping = TextureMapping.CubeReflection;
exports.CubeRefractionMapping = TextureMapping.CubeRefraction;
exports.EquirectangularReflectionMapping = TextureMapping.EquirectangularReflection;
exports.EquirectangularRefractionMapping = TextureMapping.EquirectangularRefraction;
exports.SphericalReflectionMapping = TextureMapping.SphericalReflection;
exports.CubeUVReflectionMapping = TextureMapping.CubeUVReflection;
exports.CubeUVRefractionMapping = TextureMapping.CubeUVRefraction;
//
var TextureWrapping;
(function (TextureWrapping) {
    TextureWrapping[TextureWrapping["Repeat"] = 1000] = "Repeat";
    TextureWrapping[TextureWrapping["ClampToEdge"] = 1001] = "ClampToEdge";
    TextureWrapping[TextureWrapping["MirroredRepeat"] = 1002] = "MirroredRepeat";
})(TextureWrapping = exports.TextureWrapping || (exports.TextureWrapping = {}));
exports.RepeatWrapping = TextureWrapping.Repeat;
exports.ClampToEdgeWrapping = TextureWrapping.ClampToEdge;
exports.MirroredRepeatWrapping = TextureWrapping.MirroredRepeat;
//
var TextureFilter;
(function (TextureFilter) {
    TextureFilter[TextureFilter["Nearest"] = 1003] = "Nearest";
    TextureFilter[TextureFilter["NearestMipMapNearest"] = 1004] = "NearestMipMapNearest";
    TextureFilter[TextureFilter["NearestMipMapLinear"] = 1005] = "NearestMipMapLinear";
    TextureFilter[TextureFilter["Linear"] = 1006] = "Linear";
    TextureFilter[TextureFilter["LinearMipMapNearest"] = 1007] = "LinearMipMapNearest";
    TextureFilter[TextureFilter["LinearMipMapLinear"] = 1008] = "LinearMipMapLinear";
})(TextureFilter = exports.TextureFilter || (exports.TextureFilter = {}));
exports.NearestFilter = TextureFilter.Nearest;
exports.NearestMipMapNearestFilter = TextureFilter.NearestMipMapNearest;
exports.NearestMipMapLinearFilter = TextureFilter.NearestMipMapLinear;
exports.LinearFilter = TextureFilter.Linear;
exports.LinearMipMapNearestFilter = TextureFilter.LinearMipMapNearest;
exports.LinearMipMapLinearFilter = TextureFilter.LinearMipMapLinear;
//
var TextureType;
(function (TextureType) {
    TextureType[TextureType["UnsignedByte"] = 1009] = "UnsignedByte";
    TextureType[TextureType["Byte"] = 1010] = "Byte";
    TextureType[TextureType["Short"] = 1011] = "Short";
    TextureType[TextureType["UnsignedShort"] = 1012] = "UnsignedShort";
    TextureType[TextureType["Int"] = 1013] = "Int";
    TextureType[TextureType["UnsignedInt"] = 1014] = "UnsignedInt";
    TextureType[TextureType["Float"] = 1015] = "Float";
    TextureType[TextureType["HalfFloat"] = 1016] = "HalfFloat";
    TextureType[TextureType["UnsignedShort4444"] = 1017] = "UnsignedShort4444";
    TextureType[TextureType["UnsignedShort5551"] = 1018] = "UnsignedShort5551";
    TextureType[TextureType["UnsignedShort565"] = 1019] = "UnsignedShort565";
    TextureType[TextureType["UnsignedInt248"] = 1020] = "UnsignedInt248";
})(TextureType = exports.TextureType || (exports.TextureType = {}));
exports.UnsignedByteType = TextureType.UnsignedByte;
exports.ByteType = TextureType.Byte;
exports.ShortType = TextureType.Short;
exports.UnsignedShortType = TextureType.UnsignedShort;
exports.IntType = TextureType.Int;
exports.UnsignedIntType = TextureType.UnsignedInt;
exports.FloatType = TextureType.Float;
exports.HalfFloatType = TextureType.HalfFloat;
exports.UnsignedShort4444Type = TextureType.UnsignedShort4444;
exports.UnsignedShort5551Type = TextureType.UnsignedShort5551;
exports.UnsignedShort565Type = TextureType.UnsignedShort565;
exports.UnsignedInt248Type = TextureType.UnsignedInt248;
//
var TextureFormat;
(function (TextureFormat) {
    TextureFormat[TextureFormat["Alpha"] = 1021] = "Alpha";
    TextureFormat[TextureFormat["RGB"] = 1022] = "RGB";
    TextureFormat[TextureFormat["RGBA"] = 1023] = "RGBA";
    TextureFormat[TextureFormat["Luminance"] = 1024] = "Luminance";
    TextureFormat[TextureFormat["LuminanceAlpha"] = 1025] = "LuminanceAlpha";
    TextureFormat[TextureFormat["RGBE"] = 1023] = "RGBE";
    TextureFormat[TextureFormat["Depth"] = 1026] = "Depth";
    TextureFormat[TextureFormat["DepthStencil"] = 1027] = "DepthStencil";
    TextureFormat[TextureFormat["RGB_S3TC_DXT1"] = 2001] = "RGB_S3TC_DXT1";
    TextureFormat[TextureFormat["RGBA_S3TC_DXT1"] = 2002] = "RGBA_S3TC_DXT1";
    TextureFormat[TextureFormat["RGBA_S3TC_DXT3"] = 2003] = "RGBA_S3TC_DXT3";
    TextureFormat[TextureFormat["RGBA_S3TC_DXT5"] = 2004] = "RGBA_S3TC_DXT5";
    TextureFormat[TextureFormat["RGB_PVRTC_4BPPV1"] = 2100] = "RGB_PVRTC_4BPPV1";
    TextureFormat[TextureFormat["RGB_PVRTC_2BPPV1"] = 2101] = "RGB_PVRTC_2BPPV1";
    TextureFormat[TextureFormat["RGBA_PVRTC_4BPPV1"] = 2102] = "RGBA_PVRTC_4BPPV1";
    TextureFormat[TextureFormat["RGBA_PVRTC_2BPPV1"] = 2103] = "RGBA_PVRTC_2BPPV1";
    TextureFormat[TextureFormat["RGB_ETC1"] = 2151] = "RGB_ETC1";
})(TextureFormat = exports.TextureFormat || (exports.TextureFormat = {}));
exports.AlphaFormat = TextureFormat.Alpha;
exports.RGBFormat = TextureFormat.RGB;
exports.RGBAFormat = TextureFormat.RGBA;
exports.LuminanceFormat = TextureFormat.Luminance;
exports.LuminanceAlphaFormat = TextureFormat.LuminanceAlpha;
exports.RGBEFormat = TextureFormat.RGBE;
exports.DepthFormat = TextureFormat.Depth;
exports.DepthStencilFormat = TextureFormat.DepthStencil;
exports.RGB_S3TC_DXT1_Format = TextureFormat.RGB_S3TC_DXT1;
exports.RGBA_S3TC_DXT1_Format = TextureFormat.RGBA_S3TC_DXT1;
exports.RGBA_S3TC_DXT3_Format = TextureFormat.RGBA_S3TC_DXT3;
exports.RGBA_S3TC_DXT5_Format = TextureFormat.RGBA_S3TC_DXT5;
exports.RGB_PVRTC_4BPPV1_Format = TextureFormat.RGB_PVRTC_4BPPV1;
exports.RGB_PVRTC_2BPPV1_Format = TextureFormat.RGB_PVRTC_2BPPV1;
exports.RGBA_PVRTC_4BPPV1_Format = TextureFormat.RGBA_PVRTC_4BPPV1;
exports.RGBA_PVRTC_2BPPV1_Format = TextureFormat.RGBA_PVRTC_2BPPV1;
exports.RGB_ETC1_Format = TextureFormat.RGB_ETC1;
//
var LoopMode;
(function (LoopMode) {
    LoopMode[LoopMode["Once"] = 2200] = "Once";
    LoopMode[LoopMode["Repeat"] = 2201] = "Repeat";
    LoopMode[LoopMode["PingPong"] = 2202] = "PingPong";
})(LoopMode = exports.LoopMode || (exports.LoopMode = {}));
exports.LoopOnce = LoopMode.Once;
exports.LoopRepeat = LoopMode.Repeat;
exports.LoopPingPong = LoopMode.PingPong;
//
var InterpolateMode;
(function (InterpolateMode) {
    InterpolateMode[InterpolateMode["Discrete"] = 2300] = "Discrete";
    InterpolateMode[InterpolateMode["Linear"] = 2301] = "Linear";
    InterpolateMode[InterpolateMode["Smooth"] = 2302] = "Smooth";
})(InterpolateMode = exports.InterpolateMode || (exports.InterpolateMode = {}));
exports.InterpolateDiscrete = InterpolateMode.Discrete;
exports.InterpolateLinear = InterpolateMode.Linear;
exports.InterpolateSmooth = InterpolateMode.Smooth;
//
var EndingMode;
(function (EndingMode) {
    EndingMode[EndingMode["ZeroCurvature"] = 2400] = "ZeroCurvature";
    EndingMode[EndingMode["ZeroSlope"] = 2401] = "ZeroSlope";
    EndingMode[EndingMode["WrapAround"] = 2402] = "WrapAround";
})(EndingMode = exports.EndingMode || (exports.EndingMode = {}));
exports.ZeroCurvatureEnding = EndingMode.ZeroCurvature;
exports.ZeroSlopeEnding = EndingMode.ZeroSlope;
exports.WrapAroundEnding = EndingMode.WrapAround;
//
var DrawMode;
(function (DrawMode) {
    DrawMode[DrawMode["Triangles"] = 0] = "Triangles";
    DrawMode[DrawMode["TriangleStrip"] = 1] = "TriangleStrip";
    DrawMode[DrawMode["TriangleFan"] = 2] = "TriangleFan";
})(DrawMode = exports.DrawMode || (exports.DrawMode = {}));
exports.TrianglesDrawMode = DrawMode.Triangles;
exports.TriangleStripDrawMode = DrawMode.TriangleStrip;
exports.TriangleFanDrawMode = DrawMode.TriangleFan;
//
var TextureEncoding;
(function (TextureEncoding) {
    TextureEncoding[TextureEncoding["Linear"] = 3000] = "Linear";
    TextureEncoding[TextureEncoding["sRGB"] = 3001] = "sRGB";
    TextureEncoding[TextureEncoding["Gamma"] = 3007] = "Gamma";
    TextureEncoding[TextureEncoding["RGBE"] = 3002] = "RGBE";
    TextureEncoding[TextureEncoding["LogLuv"] = 3003] = "LogLuv";
    TextureEncoding[TextureEncoding["RGBM7"] = 3004] = "RGBM7";
    TextureEncoding[TextureEncoding["RGBM16"] = 3005] = "RGBM16";
    TextureEncoding[TextureEncoding["RGBD"] = 3006] = "RGBD";
})(TextureEncoding = exports.TextureEncoding || (exports.TextureEncoding = {}));
exports.LinearEncoding = TextureEncoding.Linear;
exports.sRGBEncoding = TextureEncoding.sRGB;
exports.GammaEncoding = TextureEncoding.Gamma;
exports.RGBEEncoding = TextureEncoding.RGBE;
exports.LogLuvEncoding = TextureEncoding.LogLuv;
exports.RGBM7Encoding = TextureEncoding.RGBM7;
exports.RGBM16Encoding = TextureEncoding.RGBM16;
exports.RGBDEncoding = TextureEncoding.RGBD;
//
var DepthPacking;
(function (DepthPacking) {
    DepthPacking[DepthPacking["Basic"] = 3200] = "Basic";
    DepthPacking[DepthPacking["RGBA"] = 3201] = "RGBA";
})(DepthPacking = exports.DepthPacking || (exports.DepthPacking = {}));
exports.BasicDepthPacking = DepthPacking.Basic;
exports.RGBADepthPacking = DepthPacking.RGBA;
//# sourceMappingURL=constants.js.map