"use strict";
var __read = (this && this.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = default_1;
var ts = require("typescript");
var schematics_1 = require("@angular-devkit/schematics");
var schematics_core_1 = require("../../schematics-core");
var renames = {
    getSelectors: 'getRouterSelectors',
};
function renameSelector() {
    return function (tree) {
        (0, schematics_core_1.visitTSSourceFiles)(tree, function (sourceFile) {
            var routerStoreImports = sourceFile.statements
                .filter(function (p) { return ts.isImportDeclaration(p); })
                .filter(function (_a) {
                var moduleSpecifier = _a.moduleSpecifier;
                return moduleSpecifier.getText(sourceFile).includes('@ngrx/router-store');
            });
            var changes = __spreadArray(__spreadArray([], __read(replaceNamedImports(routerStoreImports, sourceFile)), false), __read(replaceNamespaceImports(routerStoreImports, sourceFile)), false);
            if (changes.length) {
                (0, schematics_core_1.commitChanges)(tree, sourceFile.fileName, changes);
            }
        });
    };
}
function replaceNamedImports(routerStoreImports, sourceFile) {
    var e_1, _a;
    var changes = [];
    var namedImports = routerStoreImports
        .flatMap(function (p) {
        return !!p.importClause && ts.isImportClause(p.importClause)
            ? p.importClause.namedBindings
            : [];
    })
        .flatMap(function (p) { return (!!p && ts.isNamedImports(p) ? p.elements : []); });
    try {
        for (var namedImports_1 = __values(namedImports), namedImports_1_1 = namedImports_1.next(); !namedImports_1_1.done; namedImports_1_1 = namedImports_1.next()) {
            var namedImport = namedImports_1_1.value;
            tryToAddReplacement(namedImport.name, sourceFile, changes);
        }
    }
    catch (e_1_1) { e_1 = { error: e_1_1 }; }
    finally {
        try {
            if (namedImports_1_1 && !namedImports_1_1.done && (_a = namedImports_1.return)) _a.call(namedImports_1);
        }
        finally { if (e_1) throw e_1.error; }
    }
    return changes;
}
function replaceNamespaceImports(routerStoreImports, sourceFile) {
    var e_2, _a;
    var changes = [];
    var namespaceImports = routerStoreImports
        .map(function (p) {
        return !!p.importClause &&
            ts.isImportClause(p.importClause) &&
            !!p.importClause.namedBindings &&
            ts.isNamespaceImport(p.importClause.namedBindings)
            ? p.importClause.namedBindings.name.getText(sourceFile)
            : null;
    })
        .filter(function (p) { return !!p; });
    if (namespaceImports.length === 0) {
        return changes;
    }
    try {
        for (var _b = __values(sourceFile.statements), _c = _b.next(); !_c.done; _c = _b.next()) {
            var statement = _c.value;
            statement.forEachChild(function (child) {
                if (ts.isVariableDeclarationList(child)) {
                    var _a = __read(child.declarations, 1), declaration = _a[0];
                    if (ts.isVariableDeclaration(declaration) &&
                        declaration.initializer &&
                        ts.isCallExpression(declaration.initializer) &&
                        declaration.initializer.expression &&
                        ts.isPropertyAccessExpression(declaration.initializer.expression) &&
                        ts.isIdentifier(declaration.initializer.expression.expression) &&
                        ts.isIdentifier(declaration.initializer.expression.name)) {
                        if (namespaceImports.includes(declaration.initializer.expression.expression.getText(sourceFile))) {
                            tryToAddReplacement(declaration.initializer.expression.name, sourceFile, changes);
                        }
                    }
                }
            });
        }
    }
    catch (e_2_1) { e_2 = { error: e_2_1 }; }
    finally {
        try {
            if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
        }
        finally { if (e_2) throw e_2.error; }
    }
    return changes;
}
function tryToAddReplacement(oldName, sourceFile, changes) {
    var oldNameText = oldName.getText(sourceFile);
    var newName = renames[oldNameText];
    if (newName) {
        var change = (0, schematics_core_1.createReplaceChange)(sourceFile, oldName, oldNameText, newName);
        changes.push(change);
    }
}
function default_1() {
    return (0, schematics_1.chain)([renameSelector()]);
}
//# sourceMappingURL=index.js.map