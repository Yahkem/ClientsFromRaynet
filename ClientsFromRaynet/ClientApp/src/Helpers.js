"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getColorForCategory = void 0;
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
//# sourceMappingURL=Helpers.js.map