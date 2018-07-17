QUnit.assert.isObject = function (actual, message) {
    const result = (actual === Object(actual)) && !Array.isArray(actual);
    this.pushResult({ result, actual, message });
};
