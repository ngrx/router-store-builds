(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/router-store/schematics-core/utility/queries", ["require", "exports", "typescript"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    function findNgImports(node, callback) {
        ts.forEachChild(node, n => {
            if (ts.isPropertyAssignment(n) &&
                ts.isArrayLiteralExpression(n.initializer) &&
                ts.isIdentifier(n.name) &&
                n.name.text === 'imports') {
                callback(n);
            }
        });
    }
    exports.findNgImports = findNgImports;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicXVlcmllcy5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL21vZHVsZXMvcm91dGVyLXN0b3JlL3NjaGVtYXRpY3MtY29yZS91dGlsaXR5L3F1ZXJpZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7SUFBQSxpQ0FBaUM7SUFFakMsU0FBZ0IsYUFBYSxDQUMzQixJQUFhLEVBQ2IsUUFBcUQ7UUFFckQsRUFBRSxDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEVBQUU7WUFDeEIsSUFDRSxFQUFFLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxDQUFDO2dCQUMxQixFQUFFLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQztnQkFDMUMsRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDO2dCQUN2QixDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksS0FBSyxTQUFTLEVBQ3pCO2dCQUNBLFFBQVEsQ0FBQyxDQUFDLENBQUMsQ0FBQzthQUNiO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBZEQsc0NBY0MiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB0cyBmcm9tICd0eXBlc2NyaXB0JztcblxuZXhwb3J0IGZ1bmN0aW9uIGZpbmROZ0ltcG9ydHMoXG4gIG5vZGU6IHRzLk5vZGUsXG4gIGNhbGxiYWNrOiAoaW1wb3J0Tm9kZTogdHMuUHJvcGVydHlBc3NpZ25tZW50KSA9PiB2b2lkXG4pIHtcbiAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIG4gPT4ge1xuICAgIGlmIChcbiAgICAgIHRzLmlzUHJvcGVydHlBc3NpZ25tZW50KG4pICYmXG4gICAgICB0cy5pc0FycmF5TGl0ZXJhbEV4cHJlc3Npb24obi5pbml0aWFsaXplcikgJiZcbiAgICAgIHRzLmlzSWRlbnRpZmllcihuLm5hbWUpICYmXG4gICAgICBuLm5hbWUudGV4dCA9PT0gJ2ltcG9ydHMnXG4gICAgKSB7XG4gICAgICBjYWxsYmFjayhuKTtcbiAgICB9XG4gIH0pO1xufVxuIl19