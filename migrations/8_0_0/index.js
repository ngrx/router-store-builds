(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define("@ngrx/router-store/migrations/8_0_0/index", ["require", "exports", "typescript", "@angular-devkit/schematics", "@ngrx/router-store/schematics-core"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const ts = require("typescript");
    const schematics_1 = require("@angular-devkit/schematics");
    const schematics_core_1 = require("@ngrx/router-store/schematics-core");
    function updateRouterStoreImport() {
        return (tree) => {
            tree.visit(path => {
                if (!path.endsWith('.ts')) {
                    return;
                }
                const sourceFile = ts.createSourceFile(path, tree.read(path).toString(), ts.ScriptTarget.Latest);
                if (sourceFile.isDeclarationFile) {
                    return;
                }
                let changes = [];
                ts.forEachChild(sourceFile, function findDecorator(node) {
                    if (!ts.isDecorator(node)) {
                        ts.forEachChild(node, findDecorator);
                        return;
                    }
                    ts.forEachChild(node, function findImports(node) {
                        if (ts.isPropertyAssignment(node) &&
                            ts.isArrayLiteralExpression(node.initializer) &&
                            ts.isIdentifier(node.name) &&
                            node.name.text === 'imports') {
                            node.initializer.elements
                                .filter(ts.isIdentifier)
                                .filter(element => element.text === 'StoreRouterConnectingModule')
                                .forEach(element => {
                                changes.push(schematics_core_1.createReplaceChange(sourceFile, path, element, 'StoreRouterConnectingModule', 'StoreRouterConnectingModule.forRoot()'));
                            });
                        }
                        ts.forEachChild(node, findImports);
                    });
                });
                if (changes.length < 1) {
                    return;
                }
                const recorder = schematics_core_1.createChangeRecorder(tree, path, changes);
                tree.commitUpdate(recorder);
            });
        };
    }
    function default_1() {
        return schematics_1.chain([updateRouterStoreImport()]);
    }
    exports.default = default_1;
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9tb2R1bGVzL3JvdXRlci1zdG9yZS9taWdyYXRpb25zLzhfMF8wL2luZGV4LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7O0lBQUEsaUNBQWlDO0lBQ2pDLDJEQUErRDtJQUMvRCx3RUFJNEM7SUFFNUMsU0FBUyx1QkFBdUI7UUFDOUIsT0FBTyxDQUFDLElBQVUsRUFBRSxFQUFFO1lBQ3BCLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxFQUFFO29CQUN6QixPQUFPO2lCQUNSO2dCQUVELE1BQU0sVUFBVSxHQUFHLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDcEMsSUFBSSxFQUNKLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFFLENBQUMsUUFBUSxFQUFFLEVBQzNCLEVBQUUsQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUN2QixDQUFDO2dCQUVGLElBQUksVUFBVSxDQUFDLGlCQUFpQixFQUFFO29CQUNoQyxPQUFPO2lCQUNSO2dCQUNELElBQUksT0FBTyxHQUFvQixFQUFFLENBQUM7Z0JBQ2xDLEVBQUUsQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLFNBQVMsYUFBYSxDQUFDLElBQUk7b0JBQ3JELElBQUksQ0FBQyxFQUFFLENBQUMsV0FBVyxDQUFDLElBQUksQ0FBQyxFQUFFO3dCQUN6QixFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxhQUFhLENBQUMsQ0FBQzt3QkFDckMsT0FBTztxQkFDUjtvQkFFRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxTQUFTLFdBQVcsQ0FBQyxJQUFJO3dCQUM3QyxJQUNFLEVBQUUsQ0FBQyxvQkFBb0IsQ0FBQyxJQUFJLENBQUM7NEJBQzdCLEVBQUUsQ0FBQyx3QkFBd0IsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDOzRCQUM3QyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7NEJBQzFCLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxLQUFLLFNBQVMsRUFDNUI7NEJBQ0EsSUFBSSxDQUFDLFdBQVcsQ0FBQyxRQUFRO2lDQUN0QixNQUFNLENBQUMsRUFBRSxDQUFDLFlBQVksQ0FBQztpQ0FDdkIsTUFBTSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsT0FBTyxDQUFDLElBQUksS0FBSyw2QkFBNkIsQ0FBQztpQ0FDakUsT0FBTyxDQUFDLE9BQU8sQ0FBQyxFQUFFO2dDQUNqQixPQUFPLENBQUMsSUFBSSxDQUNWLHFDQUFtQixDQUNqQixVQUFVLEVBQ1YsSUFBSSxFQUNKLE9BQU8sRUFDUCw2QkFBNkIsRUFDN0IsdUNBQXVDLENBQ3hDLENBQ0YsQ0FBQzs0QkFDSixDQUFDLENBQUMsQ0FBQzt5QkFDTjt3QkFFRCxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxXQUFXLENBQUMsQ0FBQztvQkFDckMsQ0FBQyxDQUFDLENBQUM7Z0JBQ0wsQ0FBQyxDQUFDLENBQUM7Z0JBRUgsSUFBSSxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtvQkFDdEIsT0FBTztpQkFDUjtnQkFFRCxNQUFNLFFBQVEsR0FBRyxzQ0FBb0IsQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO2dCQUMzRCxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQzlCLENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDO0lBQ0osQ0FBQztJQUVEO1FBQ0UsT0FBTyxrQkFBSyxDQUFDLENBQUMsdUJBQXVCLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUZELDRCQUVDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgdHMgZnJvbSAndHlwZXNjcmlwdCc7XG5pbXBvcnQgeyBSdWxlLCBjaGFpbiwgVHJlZSB9IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7XG4gIFJlcGxhY2VDaGFuZ2UsXG4gIGNyZWF0ZUNoYW5nZVJlY29yZGVyLFxuICBjcmVhdGVSZXBsYWNlQ2hhbmdlLFxufSBmcm9tICdAbmdyeC9yb3V0ZXItc3RvcmUvc2NoZW1hdGljcy1jb3JlJztcblxuZnVuY3Rpb24gdXBkYXRlUm91dGVyU3RvcmVJbXBvcnQoKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSkgPT4ge1xuICAgIHRyZWUudmlzaXQocGF0aCA9PiB7XG4gICAgICBpZiAoIXBhdGguZW5kc1dpdGgoJy50cycpKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cblxuICAgICAgY29uc3Qgc291cmNlRmlsZSA9IHRzLmNyZWF0ZVNvdXJjZUZpbGUoXG4gICAgICAgIHBhdGgsXG4gICAgICAgIHRyZWUucmVhZChwYXRoKSEudG9TdHJpbmcoKSxcbiAgICAgICAgdHMuU2NyaXB0VGFyZ2V0LkxhdGVzdFxuICAgICAgKTtcblxuICAgICAgaWYgKHNvdXJjZUZpbGUuaXNEZWNsYXJhdGlvbkZpbGUpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgICAgbGV0IGNoYW5nZXM6IFJlcGxhY2VDaGFuZ2VbXSA9IFtdO1xuICAgICAgdHMuZm9yRWFjaENoaWxkKHNvdXJjZUZpbGUsIGZ1bmN0aW9uIGZpbmREZWNvcmF0b3Iobm9kZSkge1xuICAgICAgICBpZiAoIXRzLmlzRGVjb3JhdG9yKG5vZGUpKSB7XG4gICAgICAgICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIGZpbmREZWNvcmF0b3IpO1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIHRzLmZvckVhY2hDaGlsZChub2RlLCBmdW5jdGlvbiBmaW5kSW1wb3J0cyhub2RlKSB7XG4gICAgICAgICAgaWYgKFxuICAgICAgICAgICAgdHMuaXNQcm9wZXJ0eUFzc2lnbm1lbnQobm9kZSkgJiZcbiAgICAgICAgICAgIHRzLmlzQXJyYXlMaXRlcmFsRXhwcmVzc2lvbihub2RlLmluaXRpYWxpemVyKSAmJlxuICAgICAgICAgICAgdHMuaXNJZGVudGlmaWVyKG5vZGUubmFtZSkgJiZcbiAgICAgICAgICAgIG5vZGUubmFtZS50ZXh0ID09PSAnaW1wb3J0cydcbiAgICAgICAgICApIHtcbiAgICAgICAgICAgIG5vZGUuaW5pdGlhbGl6ZXIuZWxlbWVudHNcbiAgICAgICAgICAgICAgLmZpbHRlcih0cy5pc0lkZW50aWZpZXIpXG4gICAgICAgICAgICAgIC5maWx0ZXIoZWxlbWVudCA9PiBlbGVtZW50LnRleHQgPT09ICdTdG9yZVJvdXRlckNvbm5lY3RpbmdNb2R1bGUnKVxuICAgICAgICAgICAgICAuZm9yRWFjaChlbGVtZW50ID0+IHtcbiAgICAgICAgICAgICAgICBjaGFuZ2VzLnB1c2goXG4gICAgICAgICAgICAgICAgICBjcmVhdGVSZXBsYWNlQ2hhbmdlKFxuICAgICAgICAgICAgICAgICAgICBzb3VyY2VGaWxlLFxuICAgICAgICAgICAgICAgICAgICBwYXRoLFxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAnU3RvcmVSb3V0ZXJDb25uZWN0aW5nTW9kdWxlJyxcbiAgICAgICAgICAgICAgICAgICAgJ1N0b3JlUm91dGVyQ29ubmVjdGluZ01vZHVsZS5mb3JSb290KCknXG4gICAgICAgICAgICAgICAgICApXG4gICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgdHMuZm9yRWFjaENoaWxkKG5vZGUsIGZpbmRJbXBvcnRzKTtcbiAgICAgICAgfSk7XG4gICAgICB9KTtcblxuICAgICAgaWYgKGNoYW5nZXMubGVuZ3RoIDwgMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHJlY29yZGVyID0gY3JlYXRlQ2hhbmdlUmVjb3JkZXIodHJlZSwgcGF0aCwgY2hhbmdlcyk7XG4gICAgICB0cmVlLmNvbW1pdFVwZGF0ZShyZWNvcmRlcik7XG4gICAgfSk7XG4gIH07XG59XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKCk6IFJ1bGUge1xuICByZXR1cm4gY2hhaW4oW3VwZGF0ZVJvdXRlclN0b3JlSW1wb3J0KCldKTtcbn1cbiJdfQ==