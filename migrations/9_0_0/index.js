(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/router-store/migrations/9_0_0/index", ["require", "exports", "typescript", "@angular-devkit/schematics", "@ngrx/router-store/schematics-core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_core_1 = require("@ngrx/router-store/schematics-core");
    function addDefaultSerializer() {
        const SERIALIZER_PROPERTY = 'serializer: DefaultRouterStateSerializer';
        return (tree, ctx) => {
            schematics_core_1.visitTSSourceFiles(tree, sourceFile => {
                let changes = [];
                schematics_core_1.visitNgModuleImports(sourceFile, (importsNode, elementsNode) => {
                    elementsNode
                        .filter(element => ts.isCallExpression(element) &&
                        ts.isPropertyAccessExpression(element.expression) &&
                        ts.isIdentifier(element.expression.expression) &&
                        element.expression.expression.text ===
                            'StoreRouterConnectingModule')
                        .forEach(element => {
                        const callExpression = element;
                        const callArgument = callExpression.arguments[0];
                        // StoreRouterConnectingModule.forRoot() without arguments
                        if (callArgument === undefined) {
                            changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, callExpression.getEnd() - 1, `{ ${SERIALIZER_PROPERTY} }`));
                        }
                        else if (ts.isObjectLiteralExpression(callArgument)) {
                            // StoreRouterConnectingModule.forRoot({ key: 'router' }) with arguments
                            const serializerSet = schematics_core_1.containsProperty(callArgument, 'serializer');
                            const routerStateSet = schematics_core_1.containsProperty(callArgument, 'routerState');
                            if (serializerSet || routerStateSet) {
                                return;
                            }
                            changes.push(new schematics_core_1.InsertChange(sourceFile.fileName, callArgument.getStart() + 1, ` ${SERIALIZER_PROPERTY},`));
                        }
                    });
                });
                if (changes.length) {
                    changes.push(schematics_core_1.insertImport(sourceFile, sourceFile.fileName, 'DefaultRouterStateSerializer', '@ngrx/router-store'));
                }
                schematics_core_1.commitChanges(tree, sourceFile.fileName, changes);
                if (changes.length) {
                    ctx.logger.info(`[@ngrx/router-store] Updated StoreRouterConnectingModule's configuration, see the migration guide (https://ngrx.io/guide/migration/v9#ngrxrouter-store) for more info`);
                }
            });
        };
    }
    function default_1() {
        return schematics_1.chain([addDefaultSerializer()]);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3JvdXRlci1zdG9yZS9taWdyYXRpb25zLzlfMF8wL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsaUNBQWlDO0lBQ2pDLDJEQUtvQztJQUNwQyx3RUFRNEM7SUFFNUMsU0FBUyxvQkFBb0I7UUFDM0IsTUFBTSxtQkFBbUIsR0FBRywwQ0FBMEMsQ0FBQztRQUN2RSxPQUFPLENBQUMsSUFBVSxFQUFFLEdBQXFCLEVBQUUsRUFBRTtZQUMzQyxvQ0FBa0IsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLEVBQUU7Z0JBQ3BDLElBQUksT0FBTyxHQUFhLEVBQUUsQ0FBQztnQkFFM0Isc0NBQW9CLENBQUMsVUFBVSxFQUFFLENBQUMsV0FBVyxFQUFFLFlBQVksRUFBRSxFQUFFO29CQUM3RCxZQUFZO3lCQUNULE1BQU0sQ0FDTCxPQUFPLENBQUMsRUFBRSxDQUNSLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQyxPQUFPLENBQUM7d0JBQzVCLEVBQUUsQ0FBQywwQkFBMEIsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDO3dCQUNqRCxFQUFFLENBQUMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsVUFBVSxDQUFDO3dCQUM5QyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxJQUFJOzRCQUNoQyw2QkFBNkIsQ0FDbEM7eUJBQ0EsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO3dCQUNqQixNQUFNLGNBQWMsR0FBRyxPQUE0QixDQUFDO3dCQUNwRCxNQUFNLFlBQVksR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFDO3dCQUVqRCwwREFBMEQ7d0JBQzFELElBQUksWUFBWSxLQUFLLFNBQVMsRUFBRTs0QkFDOUIsT0FBTyxDQUFDLElBQUksQ0FDVixJQUFJLDhCQUFZLENBQ2QsVUFBVSxDQUFDLFFBQVEsRUFDbkIsY0FBYyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsRUFDM0IsS0FBSyxtQkFBbUIsSUFBSSxDQUM3QixDQUNGLENBQUM7eUJBQ0g7NkJBQU0sSUFBSSxFQUFFLENBQUMseUJBQXlCLENBQUMsWUFBWSxDQUFDLEVBQUU7NEJBQ3JELHdFQUF3RTs0QkFDeEUsTUFBTSxhQUFhLEdBQUcsa0NBQWdCLENBQ3BDLFlBQVksRUFDWixZQUFZLENBQ2IsQ0FBQzs0QkFDRixNQUFNLGNBQWMsR0FBRyxrQ0FBZ0IsQ0FDckMsWUFBWSxFQUNaLGFBQWEsQ0FDZCxDQUFDOzRCQUVGLElBQUksYUFBYSxJQUFJLGNBQWMsRUFBRTtnQ0FDbkMsT0FBTzs2QkFDUjs0QkFFRCxPQUFPLENBQUMsSUFBSSxDQUNWLElBQUksOEJBQVksQ0FDZCxVQUFVLENBQUMsUUFBUSxFQUNuQixZQUFZLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxFQUMzQixJQUFJLG1CQUFtQixHQUFHLENBQzNCLENBQ0YsQ0FBQzt5QkFDSDtvQkFDSCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFFSCxJQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7b0JBQ2xCLE9BQU8sQ0FBQyxJQUFJLENBQ1YsOEJBQVksQ0FDVixVQUFVLEVBQ1YsVUFBVSxDQUFDLFFBQVEsRUFDbkIsOEJBQThCLEVBQzlCLG9CQUFvQixDQUNyQixDQUNGLENBQUM7aUJBQ0g7Z0JBRUQsK0JBQWEsQ0FBQyxJQUFJLEVBQUUsVUFBVSxDQUFDLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQztnQkFFbEQsSUFBSSxPQUFPLENBQUMsTUFBTSxFQUFFO29CQUNsQixHQUFHLENBQUMsTUFBTSxDQUFDLElBQUksQ0FDYix1S0FBdUssQ0FDeEssQ0FBQztpQkFDSDtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEO1FBQ0UsT0FBTyxrQkFBSyxDQUFDLENBQUMsb0JBQW9CLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUZELDRCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQge1xuICBSdWxlLFxuICBjaGFpbixcbiAgVHJlZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MnO1xuaW1wb3J0IHtcbiAgdmlzaXRUU1NvdXJjZUZpbGVzLFxuICBjb21taXRDaGFuZ2VzLFxuICBJbnNlcnRDaGFuZ2UsXG4gIHZpc2l0TmdNb2R1bGVJbXBvcnRzLFxuICBpbnNlcnRJbXBvcnQsXG4gIENoYW5nZSxcbiAgY29udGFpbnNQcm9wZXJ0eSxcbn0gZnJvbSAnQG5ncngvcm91dGVyLXN0b3JlL3NjaGVtYXRpY3MtY29yZSc7XG5cbmZ1bmN0aW9uIGFkZERlZmF1bHRTZXJpYWxpemVyKCk6IFJ1bGUge1xuICBjb25zdCBTRVJJQUxJWkVSX1BST1BFUlRZID0gJ3NlcmlhbGl6ZXI6IERlZmF1bHRSb3V0ZXJTdGF0ZVNlcmlhbGl6ZXInO1xuICByZXR1cm4gKHRyZWU6IFRyZWUsIGN0eDogU2NoZW1hdGljQ29udGV4dCkgPT4ge1xuICAgIHZpc2l0VFNTb3VyY2VGaWxlcyh0cmVlLCBzb3VyY2VGaWxlID0+IHtcbiAgICAgIGxldCBjaGFuZ2VzOiBDaGFuZ2VbXSA9IFtdO1xuXG4gICAgICB2aXNpdE5nTW9kdWxlSW1wb3J0cyhzb3VyY2VGaWxlLCAoaW1wb3J0c05vZGUsIGVsZW1lbnRzTm9kZSkgPT4ge1xuICAgICAgICBlbGVtZW50c05vZGVcbiAgICAgICAgICAuZmlsdGVyKFxuICAgICAgICAgICAgZWxlbWVudCA9PlxuICAgICAgICAgICAgICB0cy5pc0NhbGxFeHByZXNzaW9uKGVsZW1lbnQpICYmXG4gICAgICAgICAgICAgIHRzLmlzUHJvcGVydHlBY2Nlc3NFeHByZXNzaW9uKGVsZW1lbnQuZXhwcmVzc2lvbikgJiZcbiAgICAgICAgICAgICAgdHMuaXNJZGVudGlmaWVyKGVsZW1lbnQuZXhwcmVzc2lvbi5leHByZXNzaW9uKSAmJlxuICAgICAgICAgICAgICBlbGVtZW50LmV4cHJlc3Npb24uZXhwcmVzc2lvbi50ZXh0ID09PVxuICAgICAgICAgICAgICAgICdTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUnXG4gICAgICAgICAgKVxuICAgICAgICAgIC5mb3JFYWNoKGVsZW1lbnQgPT4ge1xuICAgICAgICAgICAgY29uc3QgY2FsbEV4cHJlc3Npb24gPSBlbGVtZW50IGFzIHRzLkNhbGxFeHByZXNzaW9uO1xuICAgICAgICAgICAgY29uc3QgY2FsbEFyZ3VtZW50ID0gY2FsbEV4cHJlc3Npb24uYXJndW1lbnRzWzBdO1xuXG4gICAgICAgICAgICAvLyBTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUuZm9yUm9vdCgpIHdpdGhvdXQgYXJndW1lbnRzXG4gICAgICAgICAgICBpZiAoY2FsbEFyZ3VtZW50ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKFxuICAgICAgICAgICAgICAgIG5ldyBJbnNlcnRDaGFuZ2UoXG4gICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgY2FsbEV4cHJlc3Npb24uZ2V0RW5kKCkgLSAxLFxuICAgICAgICAgICAgICAgICAgYHsgJHtTRVJJQUxJWkVSX1BST1BFUlRZfSB9YFxuICAgICAgICAgICAgICAgIClcbiAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHMuaXNPYmplY3RMaXRlcmFsRXhwcmVzc2lvbihjYWxsQXJndW1lbnQpKSB7XG4gICAgICAgICAgICAgIC8vIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZS5mb3JSb290KHsga2V5OiAncm91dGVyJyB9KSB3aXRoIGFyZ3VtZW50c1xuICAgICAgICAgICAgICBjb25zdCBzZXJpYWxpemVyU2V0ID0gY29udGFpbnNQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBjYWxsQXJndW1lbnQsXG4gICAgICAgICAgICAgICAgJ3NlcmlhbGl6ZXInXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICAgIGNvbnN0IHJvdXRlclN0YXRlU2V0ID0gY29udGFpbnNQcm9wZXJ0eShcbiAgICAgICAgICAgICAgICBjYWxsQXJndW1lbnQsXG4gICAgICAgICAgICAgICAgJ3JvdXRlclN0YXRlJ1xuICAgICAgICAgICAgICApO1xuXG4gICAgICAgICAgICAgIGlmIChzZXJpYWxpemVyU2V0IHx8IHJvdXRlclN0YXRlU2V0KSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgY2hhbmdlcy5wdXNoKFxuICAgICAgICAgICAgICAgIG5ldyBJbnNlcnRDaGFuZ2UoXG4gICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlLmZpbGVOYW1lLFxuICAgICAgICAgICAgICAgICAgY2FsbEFyZ3VtZW50LmdldFN0YXJ0KCkgKyAxLFxuICAgICAgICAgICAgICAgICAgYCAke1NFUklBTElaRVJfUFJPUEVSVFl9LGBcbiAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNoYW5nZXMubGVuZ3RoKSB7XG4gICAgICAgIGNoYW5nZXMucHVzaChcbiAgICAgICAgICBpbnNlcnRJbXBvcnQoXG4gICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgc291cmNlRmlsZS5maWxlTmFtZSxcbiAgICAgICAgICAgICdEZWZhdWx0Um91dGVyU3RhdGVTZXJpYWxpemVyJyxcbiAgICAgICAgICAgICdAbmdyeC9yb3V0ZXItc3RvcmUnXG4gICAgICAgICAgKVxuICAgICAgICApO1xuICAgICAgfVxuXG4gICAgICBjb21taXRDaGFuZ2VzKHRyZWUsIHNvdXJjZUZpbGUuZmlsZU5hbWUsIGNoYW5nZXMpO1xuXG4gICAgICBpZiAoY2hhbmdlcy5sZW5ndGgpIHtcbiAgICAgICAgY3R4LmxvZ2dlci5pbmZvKFxuICAgICAgICAgIGBbQG5ncngvcm91dGVyLXN0b3JlXSBVcGRhdGVkIFN0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZSdzIGNvbmZpZ3VyYXRpb24sIHNlZSB0aGUgbWlncmF0aW9uIGd1aWRlIChodHRwczovL25ncnguaW8vZ3VpZGUvbWlncmF0aW9uL3Y5I25ncnhyb3V0ZXItc3RvcmUpIGZvciBtb3JlIGluZm9gXG4gICAgICAgICk7XG4gICAgICB9XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW2FkZERlZmF1bHRTZXJpYWxpemVyKCldKTtcbn1cbiJdfQ==