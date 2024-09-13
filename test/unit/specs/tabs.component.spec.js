"use strict";

/**
 * Put some code to 'src/components/tabs.component.js'.
 * Make all unit tests passing.
 *
 * @author Piotr Kowalski <piecioshka@gmail.com> https://piecioshka.pl
 * @version 1.1.0
 * @license MIT
 * @see https://github.com/piecioshka/training-implement-tabs-component
 */

// -----------------------------------------------------------------------------
//
// DO NOT MODIFY THIS FILE.
//
// -----------------------------------------------------------------------------

function toString(data) {
    return Object.prototype.toString.call(data);
}

QUnit.config.reorder = false;

const describe = QUnit.module;
const it = QUnit.test;

describe("TabsComponent", function () {
    describe("General", function () {
        it("should be defined in global scope", (assert) => {
            assert.notEqual(
                typeof TabsComponent,
                "undefined",
                "TabsComponent is not defined in global scope"
            );
        });

        it("should be a class", (assert) => {
            const CLASS_CHECKER_REGEXP = /^class /;
            assert.regexp(
                TabsComponent.toString(),
                CLASS_CHECKER_REGEXP,
                "TabsComponent is not a class"
            );
        });
    });

    describe("API", function () {
        describe("constructor", () => {
            const hasDefaultParam = /constructor\(\w+ =/.test(
                TabsComponent.toString()
            );

            if (!hasDefaultParam) {
                it('should be waiting for single argument "options" in constructor', (assert) => {
                    assert.deepEqual(
                        TabsComponent.length,
                        1,
                        'TabsComponent#constructor() is not expects 1 parameter"'
                    );
                });
            }

            it('should assign "options.$target" to class instance property', (assert) => {
                const my$target = { foo: "bar" };
                const c = new TabsComponent({
                    $target: my$target,
                });
                assert.deepEqual(
                    c.$target,
                    my$target,
                    '"$target" is not equal to "options.$target"'
                );
            });

            it("should have empty property with DOM structure", (assert) => {
                const c = new TabsComponent({});
                assert.ok(c.hasOwnProperty("$el"), '"$el" is not defined');
                assert.deepEqual(c.$el, null, '"$el" is not a null');
            });

            it('"$el" should be define with "null" value', (assert) => {
                const cached = document.querySelector;
                document.querySelector = () => "DO NOT USE";
                const c = new TabsComponent({});
                assert.deepEqual(
                    c.$el,
                    null,
                    'Do not use "document.querySelector" in TabsComponent constructor'
                );
                document.querySelector = cached;
            });

            it("should have list of tabs in Array", (assert) => {
                const c = new TabsComponent({});
                assert.ok(
                    Array.isArray(c.tabs),
                    '"tabs" is not an empty array'
                );
            });
        });

        describe("addTab", () => {
            it("should be a method", (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(
                    typeof c.addTab,
                    "function",
                    '"addTab()" is not a method'
                );
                assert.deepEqual(
                    typeof TabsComponent.prototype.addTab,
                    "function",
                    '"TabsComponent.prototype.addTab" is not a function'
                );
            });

            it("addTab: expected 2 arguments: title, content", (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(
                    c.addTab.length,
                    2,
                    '"addTab()" is not expected 2 arguments'
                );
            });

            it('should append "tabs" with object with title and content', (assert) => {
                const c = new TabsComponent({});
                c.addTab("foo", "bar");
                assert.ok(
                    c.tabs.length === 1,
                    '"tabs.push" is not called with single object'
                );
                assert.isObject(c.tabs[0], "Appended value is not an object");
                assert.ok(
                    c.tabs[0].title === "foo",
                    'Passed object has not property "title" (it should be a first param of "addTab" function)'
                );
                assert.ok(
                    c.tabs[0].content === "bar",
                    'Passed object has not property "tab-content" (it should be a second param of "addTab" function)'
                );
            });
        });

        describe("setTabs", () => {
            it("should be a method", (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(
                    typeof c.setTabs,
                    "function",
                    '"setTabs()" is not a method'
                );
                assert.deepEqual(
                    typeof TabsComponent.prototype.addTab,
                    "function",
                    '"TabsComponent.prototype.addTab" is not a function'
                );
            });

            it("setTabs: expected 1 argument: tabs", (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(
                    c.setTabs.length,
                    1,
                    '"setTabs()" is not expected 1 argument'
                );
            });

            it('should update "tabs" class property', (assert) => {
                const c = new TabsComponent({});
                c.setTabs([
                    { title: "foo", content: "bar" },
                    { title: "xxx", content: "yyy" },
                ]);
                assert.ok(
                    c.tabs.length === 2,
                    '"tabs" has not contains 2 elements'
                );
                assert.isObject(c.tabs[0], "Appended value is not an object");
                assert.ok(
                    c.tabs[0].title === "foo",
                    'Passed object has not property "title" (it should be a first param of "addTab" function)'
                );
                assert.ok(
                    c.tabs[0].content === "bar",
                    'Passed object has not property "tab-content" (it should be a second param of "addTab" function)'
                );
            });
        });

        describe("build", () => {
            it("should be a method", (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(
                    typeof c.build,
                    "function",
                    '"build()" is not a method'
                );
                assert.deepEqual(
                    typeof TabsComponent.prototype.build,
                    "function",
                    '"TabsComponent.prototype.build" is not a function'
                );
            });

            it('should not modify current "$el" property', (assert) => {
                const c = new TabsComponent({});
                c.addTab("t", "c");
                c.build();
                assert.deepEqual(
                    c.$el,
                    null,
                    '"build()" is not create structure, but not modify current "$el" property'
                );
            });

            it('should use "tabs" to build DOM tree with tabs', (assert) => {
                const c = new TabsComponent({ $target: {} });
                c.addTab("foo", "bar");

                let $el = c.build();

                assert.ok(
                    $el instanceof HTMLElement,
                    '"build()" is not returns HTMLElement'
                );
                assert.deepEqual(
                    $el.tagName.toLowerCase(),
                    "div",
                    '"build()" is not returns <div>'
                );
                assert.ok(
                    $el.querySelector("nav"),
                    "<div> has not child <nav> container"
                );
                assert.deepEqual(
                    $el.querySelector("nav").id,
                    "tabs",
                    '<nav> has not "id" attr with value "tabs"'
                );
                assert.ok(
                    $el.querySelector("nav").querySelector("ul"),
                    '<nav> has not a <ul> as child element, with list of "titles"'
                );
                assert.deepEqual(
                    $el.querySelector("nav").querySelector("ul").children
                        .length,
                    1,
                    "<ul> is not updated with list of tabs"
                );

                [
                    ...$el.querySelector("nav").querySelector("ul").children,
                ].forEach((item) => {
                    assert.deepEqual(
                        item.tagName.toLowerCase(),
                        "li",
                        "<ul> has not <li> as child element"
                    );
                });

                c.addTab("xxx", "yyy");
                c.addTab("abc", "bleh");

                $el = c.build();

                assert.deepEqual(
                    $el.querySelector("nav").querySelector("ul").children
                        .length,
                    3,
                    "After adding 3 elements, list of tabs has not 3 tabs"
                );

                [
                    ...$el.querySelector("nav").querySelector("ul").children,
                ].forEach((item, index) => {
                    assert.deepEqual(
                        item.textContent,
                        c.tabs[index].title,
                        '<li> element is not contains "title" property'
                    );
                });
            });

            it("should verify that function returns nothing", (assert) => {
                const c = new TabsComponent({});
                const result = c.build();
                assert.deepEqual(
                    result,
                    null,
                    '"build()" is not returns "null" when "tabs" is an empty collection'
                );
            });

            it("should build content list as DOM elements", (assert) => {
                const c = new TabsComponent({ $target: {} });
                c.addTab("foo", "bar");

                let $el = c.build();

                assert.ok(
                    $el.querySelector("main"),
                    "<nav> has not child <main> container"
                );
                assert.deepEqual(
                    $el.querySelector("main").id,
                    "tab-content",
                    '<main> container has not "id" attr with value "tab-content"'
                );
                assert.deepEqual(
                    $el.querySelector("main").children.length,
                    1,
                    "After adding 1 element, list of contents has not only 1 tab"
                );

                c.addTab("xxx", "yyy");
                c.addTab("abc", "bleh");

                $el = c.build();

                assert.deepEqual(
                    $el.querySelector("main").children.length,
                    3,
                    "After adding 3 elements, list of contents has not 3 tabs"
                );

                [...$el.querySelector("main").children].forEach(
                    (item, index) => {
                        const tagName = item.tagName.toLowerCase();
                        assert.deepEqual(
                            tagName,
                            "p",
                            "<main> children is not a <p>, but <" +
                                tagName +
                                ">"
                        );
                        assert.deepEqual(
                            item.textContent,
                            c.tabs[index].content,
                            '<p> does not contain "content" property'
                        );
                    }
                );
            });
        });

        describe("render", () => {
            it("should be a method", (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(
                    typeof c.render,
                    "function",
                    '"render()" is not a method'
                );
                assert.deepEqual(
                    typeof TabsComponent.prototype.render,
                    "function",
                    '"TabsComponent.prototype.render" is not a function'
                );
            });

            it('should add protection against "null" when calls $target.appendChild', (assert) => {
                const $target = document.createElement("div");
                $target.appendChild(document.createElement("p"));
                $target.appendChild(document.createElement("ul"));

                const c = new TabsComponent({ $target });
                const appendChild = c.$target.appendChild;

                c.$target.appendChild = function (...args) {
                    assert.notEqual(
                        args[0],
                        null,
                        '"render()" has no protection against "null" from "build()"'
                    );
                    return appendChild.call(c.$target, ...args);
                };

                c.render();

                // HACK for QUnit protection against zero assertions.
                assert.ok(true);

                c.$target.appendChild = appendChild;
            });

            it('should remove all elements from "$target"', (assert) => {
                const $target = document.createElement("div");
                $target.appendChild(document.createElement("p"));
                $target.appendChild(document.createElement("ul"));
                const c = new TabsComponent({ $target });
                c.render();
                assert.deepEqual(
                    c.$el,
                    null,
                    '"$el" is not an null, when "render()" is called and "tabs" is empty'
                );
                assert.deepEqual($target.innerHTML, "", "$target is not empty");
            });

            it("should call", (assert) => {
                const $target = document.querySelector("#qunit-fixture");
                const c = new TabsComponent({ $target });
                const build = sinon.spy(c, "build");

                c.render();

                assert.ok(build.called, '"render()" is not calls "build()"');
            });

            it("should render proper DOM tree", (assert) => {
                const $target = document.querySelector("#qunit-fixture");
                const c = new TabsComponent({ $target });
                c.addTab("foo", "bar");
                c.addTab("xxx", "yyy");
                c.addTab("abc", "bleh");

                const build = sinon.spy(c, "build");

                c.render();

                assert.ok(
                    build.returned(c.$el),
                    '"$el" is not a result of "build()" function'
                );

                assert.deepEqual(
                    $target.firstChild,
                    c.$el,
                    '"$target" first child is not "$el"'
                );
            });
        });
    });
});
