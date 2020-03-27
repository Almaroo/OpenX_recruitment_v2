const assert = require("chai").assert;
const task2 = require("../app").task2;
const memoize = require("../app").memoize;

describe("Tests of memoize function", function() {
  const cache = memoize(null, 1);
  const test = () => "Passed";

  this.beforeEach(function() {
    memoize(test);
  });

  this.afterEach(function() {
    cache.delete(test);
  });

  it("Test of memoize test mode", function() {
    assert.instanceOf(cache, WeakMap, "Memoize test mode fail");
  });

  it("Memoize value test", function() {
    assert.equal(memoize(test), "Passed", "Memoization failed");
  });

  it("Memoize key test", function() {
    assert.isTrue(cache.has(test), "Memoization failed");
  });
});

describe("Test of task2 module functions", function() {
  it("Test of fetching data", async function() {
    let response = await task2.getJoinedData();

    assert.property(response, "DB", "Fetching failed");
    assert.property(response, "posts", "Fetching failed");
  });
});
