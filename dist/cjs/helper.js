"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.intersectionCallback = exports.handleVisibilityChange = exports.updateAdTimer = exports.checkRootObject = void 0;
var visibleAds = new Set();
var previouslyVisibleAds = null;
var checkRootObject = function (options) {
    var _a;
    if (!((options === null || options === void 0 ? void 0 : options.root) instanceof Document)) {
        return (_a = options === null || options === void 0 ? void 0 : options.root) === null || _a === void 0 ? void 0 : _a.current;
    }
    return options === null || options === void 0 ? void 0 : options.root;
};
exports.checkRootObject = checkRootObject;
var totalViewTime = 0;
var updateAdTimer = function (adBox) {
    var lastStarted = adBox.dataset.lastViewStarted;
    var currentTime = performance.now();
    if (lastStarted) {
        var diff = currentTime - parseFloat(lastStarted);
        totalViewTime += diff;
    }
    adBox.dataset.lastViewStarted = currentTime.toString();
};
exports.updateAdTimer = updateAdTimer;
var handleVisibilityChange = function () {
    if (!previouslyVisibleAds) {
        previouslyVisibleAds = visibleAds;
        // @ts-ignore
        visibleAds = [];
        previouslyVisibleAds === null || previouslyVisibleAds === void 0 ? void 0 : previouslyVisibleAds.forEach(function (adBox) {
            (0, exports.updateAdTimer)(adBox);
            adBox.dataset.lastViewStarted = 0;
        });
    }
    else {
        previouslyVisibleAds === null || previouslyVisibleAds === void 0 ? void 0 : previouslyVisibleAds.forEach(function (adBox) {
            adBox.dataset.lastViewStarted = performance.now();
        });
        visibleAds = previouslyVisibleAds;
        previouslyVisibleAds = null;
    }
};
exports.handleVisibilityChange = handleVisibilityChange;
var intersectionCallback = function (_a) {
    var entries = _a.entries, inViewStateForObserveOnce = _a.inViewStateForObserveOnce, observerOptions = _a.observerOptions, observer = _a.observer, setInViewData = _a.setInViewData;
    entries.forEach(function (entry) {
        var _a;
        var adBox = entry.target;
        (0, exports.handleVisibilityChange)();
        if (entry.isIntersecting) {
            // @ts-ignore
            adBox.dataset.lastViewStarted = entry.time;
            visibleAds === null || visibleAds === void 0 ? void 0 : visibleAds.add(adBox);
            inViewStateForObserveOnce.current = true;
            (_a = observerOptions === null || observerOptions === void 0 ? void 0 : observerOptions.callback) === null || _a === void 0 ? void 0 : _a.call(observerOptions, {
                entry: entry,
                inView: true,
                visibilityTime: totalViewTime,
            });
            setInViewData({
                inView: true,
                visibilityTime: totalViewTime,
                entry: entry,
            });
        }
        else {
            setInViewData({
                inView: false,
                visibilityTime: observerOptions.getLastVisibleData
                    ? totalViewTime
                    : undefined,
                entry: entry,
            });
            visibleAds === null || visibleAds === void 0 ? void 0 : visibleAds.delete(adBox);
        }
        if (observerOptions.observeOnce && inViewStateForObserveOnce.current) {
            return observer.disconnect();
        }
    });
};
exports.intersectionCallback = intersectionCallback;
