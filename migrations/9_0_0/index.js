"use strict";
exports.__esModule = true;
var ts = require("typescript");
var schematics_1 = require("@angular-devkit/schematics");
var schematics_core_1 = require("../../schematics-core");
function addDefaultSerializer() {
    var SERIALIZER_PROPERTY = 'serializer: DefaultRouterStateSerializer';
    return function (tree, ctx) {
        schematics_core_1.visitTSSourceFiles(tree, function (sourceFile) {
            var changes = [];
            schematics_core_1.visitNgModuleImports(sourceFile, function (importsNode, elementsNode) {
                elementsNode
                    .filter(function (element) {
                    return ts.isCallExpression(element) &&
                        ts.isPropertyAccessExpression(element.expression) &&
                        ts.isIdentifier(element.expression.expression) &&
                        element.expression.expression.text ===
                            'StoreRouterConnectingModule';
                })
                    .forEach(function (element) {
                    var callExpression = element;
                    var callArgument = callExpression.arguments[0];
                    // StoreRouterConnectingModule.forRoot() without arguments
                    if (callArgument === undefined) {
                        changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, callExpression.getEnd() - 1, "{ " + SERIALIZER_PROPERTY + " }"));
                    }
                    else if (ts.isObjectLiteralExpression(callArgument)) {
                        // StoreRouterConnectingModule.forRoot({ key: 'router' }) with arguments
                        var serializerSet = schematics_core_1.containsProperty(callArgument, 'serializer');
                        var routerStateSet = schematics_core_1.containsProperty(callArgument, 'routerState');
                        if (serializerSet || routerStateSet) {
                            return;
                        }
                        changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, callArgument.getStart() + 1, " " + SERIALIZER_PROPERTY + ","));
                    }
                });
            });
            if (changes.length) {
                changes.push(schematics_core_1.insertImport(sourceFile, sourceFile.fileName, 'DefaultRouterStateSerializer', '@ngrx/router-store'));
            }
            schematics_core_1.commitChanges(tree, sourceFile.fileName, changes);
            if (changes.length) {
                ctx.logger.info("[@ngrx/router-store] Updated StoreRouterConnectingModule's configuration, see the migration guide (https://ngrx.io/guide/migration/v9#ngrxrouter-store) for more info");
            }
        });
    };
}
function default_1() {
    return schematics_1.chain([addDefaultSerializer()]);
}
exports["default"] = default_1;
//# sourceMappingURL=index.js.map