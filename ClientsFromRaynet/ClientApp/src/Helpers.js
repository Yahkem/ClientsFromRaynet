"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hashFunc = exports.formatDate = exports.formatLatLng = exports.formatYesNo = exports.formatValueObject = exports.d = exports.ratingDisplay = exports.getColorForCategory = void 0;
function getColorForCategory(name, categories) {
    for (var _i = 0, categories_1 = categories; _i < categories_1.length; _i++) {
        var c = categories_1[_i];
        if (c.code01 === name) {
            return c.code02;
        }
    }
    return null;
}
exports.getColorForCategory = getColorForCategory;
function ratingDisplay(c) {
    var stars = c === 'A' ? '&#9733;&#9733;&#9733;' :
        c === 'B' ? '&#9733;&#9733;&#9734;' :
            c === 'C' ? '&#9733;&#9734;&#9734;' :
                '&#9734;&#9734;&#9734;';
    return stars;
}
exports.ratingDisplay = ratingDisplay;
;
/**
 * Helper for null display
 */
exports.d = function (x) { return !!x ? x : ''; };
exports.formatValueObject = function (obj) {
    if (obj === void 0 || obj === null || obj.value === null) {
        return exports.d(null);
    }
    return exports.d(obj.value);
};
exports.formatYesNo = function (val) {
    return (val === 'YES') ? 'Ano' :
        (val === 'NO') ? 'Ne' :
            exports.d(null);
};
exports.formatLatLng = function (addr) {
    return !!addr.lat ?
        exports.d(addr.lat) + ", " + exports.d(addr.lng) :
        exports.d(null);
};
/**
 * Helper for date display
 */
exports.formatDate = function (dt) {
    if (!dt) {
        return exports.d(null);
    }
    var date = new Date(dt);
    return date.toLocaleDateString('cs-CZ');
};
function hashFunc(s) {
    var hash = 0;
    for (var i = 0; i < s.length; i++) {
        var chr = s.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
}
exports.hashFunc = hashFunc;
//# sourceMappingURL=Helpers.js.map