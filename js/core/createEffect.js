import { __assign, __awaiter, __generator } from "tslib";
import { createBehavior, createStore } from '@methodjs/store';
import React from 'react';
function initializeEffectState() {
    return {
        isLoading: false,
        isCanceled: false,
        isFromCache: false,
        cachedTime: null,
        error: null,
    };
}
export function createEffect(effect, options) {
    var initializeStore = options.initializeStore, _a = options.isPreventReact, isPreventReact = _a === void 0 ? false : _a, _b = options.isPreventCache, isPreventCache = _b === void 0 ? false : _b, _c = options.reactDependecies, reactDependecies = _c === void 0 ? [] : _c, cacheLifeSeconds = options.cacheLifeSeconds, key = options.key;
    var _d = createStore(initializeStore, {
        key: key,
    }), useStore = _d[0], setStore = _d[1], getStore = _d[2];
    var _e = createStore(initializeEffectState), useState = _e[0], setState = _e[1], getState = _e[2];
    var requestEffect = function requestEffect() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                coreRequestEffect(true);
                return [2 /*return*/];
            });
        });
    };
    function coreRequestEffect(notUsedCache) {
        if (notUsedCache === void 0) { notUsedCache = false; }
        return __awaiter(this, void 0, void 0, function () {
            var _a, cachedTime, isLoading, cacheLimitTime, store, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = getState(), cachedTime = _a.cachedTime, isLoading = _a.isLoading;
                        if (isLoading) {
                            return [2 /*return*/];
                        }
                        setState(function (value) { return (__assign(__assign({}, value), { isLoading: true })); });
                        if (notUsedCache !== true &&
                            isPreventCache !== true &&
                            cachedTime !== null &&
                            cacheLifeSeconds !== undefined) {
                            cacheLimitTime = new Date(Date.now() + cacheLifeSeconds * 1000);
                            if (cacheLimitTime > new Date()) {
                                setState(function (value) { return (__assign(__assign({}, value), { error: null, isLoading: false, isFromCache: true })); });
                            }
                            return [2 /*return*/];
                        }
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, effect()];
                    case 2:
                        store = _b.sent();
                        setStore(store);
                        if (isPreventCache === true) {
                            setState(function (value) { return (__assign(__assign({}, value), { error: null, isLoading: false, isFromCache: false })); });
                        }
                        else {
                            setState(function (value) { return (__assign(__assign({}, value), { error: null, isLoading: false, cachedTime: new Date(), isFromCache: false })); });
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _b.sent();
                        setState(function (value) { return (__assign(__assign({}, value), { error: error_1, isCanceled: true, isLoading: false })); });
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    var startReact = createBehavior(function (key) {
        return reactDependecies.includes(key);
    }, {
        setValueCallback: function () {
            coreRequestEffect(true);
        },
    })[0];
    var getEffect = function getEffect() {
        var store = getStore();
        var state = getState();
        return [store, state];
    };
    var useEffect = function useEffect() {
        var store = useStore();
        var state = useState();
        React.useEffect(function () {
            if (isPreventReact !== true) {
                coreRequestEffect();
                startReact();
            }
        }, []);
        return [store, state];
    };
    return [useEffect, requestEffect, getEffect];
}
