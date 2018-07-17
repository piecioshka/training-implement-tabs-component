'use strict';

/**
 * Put some code to 'app/scripts/tabs-component.js'.
 * Make all unit tests passing.
 *
 * @author Piotr Kowalski <piecioshka@gmail.com> https://piecioshka.pl
 * @version 1.0.0
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

const CLASS_CHECKER_REGEXP = (/^class /);

QUnit.config.reorder = false;

const describe = QUnit.module;
const test = QUnit.test;

describe('TabsComponent', function () {
    describe('General', function () {
        test('should be defined in global scope', (assert) => {
            assert.ok(
                typeof TabsComponent !== 'undefined',
                'Define TabsComponent in Window, global object.'
            );
        });

        test('should be a class', (assert) => {
            assert.regexp(
                TabsComponent.toString(),
                CLASS_CHECKER_REGEXP,
                'Change "window.TabsComponent" to class.'
            );
        });
    });

    describe('API', function (hooks) {
        describe('constructor', () => {
            const hasDefaultParam = (/constructor\(\w+ =/).test(TabsComponent.toString());

            if (!hasDefaultParam) {
                test('should has waiting for single argument "options" in constructor', (assert) => {
                    assert.equal(TabsComponent.length, 1, 'Add one argument into window.TabsComponent constructor, ex. "options"');
                });
            }

            test('should have default value for options = {}', (assert) => {
                const ASSERT_MESSAGE = 'Set default value "{}" in window.TabsComponent constructor';

                try {
                    new TabsComponent();
                    assert.ok(true, ASSERT_MESSAGE);
                } catch (e) {
                    assert.ok(false, ASSERT_MESSAGE);
                }
            });

            test('should save "options.$target" into property', (assert) => {
                const my$target = { foo: 'bar' };
                const c = new TabsComponent({
                    $target: my$target
                });
                assert.equal(c.$target, my$target, 'Assign to this.$target value from options.$target');
            });

            test('should has empty property with DOM structure', (assert) => {
                const c = new TabsComponent({});
                assert.ok(c.hasOwnProperty('$el'), 'Add this.$el property');
                assert.ok(c.$el === null, 'Set this.$el to null at the beginning');
            });

            test('should has list of tabs in Array', (assert) => {
                const c = new TabsComponent({});
                assert.ok(Array.isArray(c.tabs), 'Define empty array "this.tabs"');
            });

        });

        describe('addTab', () => {
            test('should be a method', (assert) => {
                const c = new TabsComponent({});
                assert.equal(typeof c.addTab, 'function', 'Define function "this.addTab"');
            });

            test('addTab: expected 2 arguments: title, content', (assert) => {
                const c = new TabsComponent({});
                assert.equal(c.addTab.length, 2, 'Method "this.addTab" expected 2 arguments');
            });

            test('should append "tabs" property', (assert) => {
                const c = new TabsComponent({});
                c.addTab('foo', 'bar');
                assert.ok(c.tabs.length === 1, 'Use "this.tabs.push" to append list with single object');
                assert.isObject(c.tabs[0], 'Append value is not an object (btw. array is not object)');
                assert.ok(c.tabs[0].title === 'foo', 'Passed object should have property "title" - first argument of "addTab" function');
                assert.ok(c.tabs[0].content === 'bar', 'Passed object should have property "content" - second argument of "addTab" function');
            });

        });

        describe('build', () => {
            test('should define render method', (assert) => {
                const c = new TabsComponent({});
                assert.equal(typeof c.build, 'function', 'Define function "this.build"');
            });

            test('should verify that list of tabs is non-empty', (assert) => {
                const c = new TabsComponent({});
                const $el = c.build();
                assert.equal($el, null, 'Add early return to "this.build" method, with checking that "this.tabs" is empty');
            });


            test('should build tabs list as DOM elements', (assert) => {
                const c = new TabsComponent({ $target: {} });
                c.addTab('foo', 'bar');

                let $el = c.build();

                assert.ok($el.querySelector('nav'), 'Create <nav> for tabs panel');
                assert.equal($el.querySelector('nav').id, 'tabs', 'Set id="tabs" into <nav>');
                assert.ok($el.querySelector('nav').querySelector('ul'), 'Create <nav> with <ul> which contains list of "titles"');
                assert.ok($el.querySelector('ul'), 'Create <ul> with list of <li> which contains "titles"');
                assert.equal($el.querySelector('ul').children.length, 1, 'After add 1x element, list of tabs should has only 1 tab');
                assert.equal($el.querySelector('ul').children[0].textContent, 'foo', 'First tab should has value form "title" property');

                c.addTab('xxx', 'yyy');
                c.addTab('abc', 'bleh');

                $el = c.build();

                assert.equal($el.querySelector('ul').children.length, 3, 'After add 3x element, list of tabs should as 3 tabs');
                assert.equal($el.querySelector('ul').children[1].textContent, 'xxx', 'Second tab should has value from "title" property');
                assert.equal($el.querySelector('ul').children[2].textContent, 'abc', 'Third tab should has value from "title" property');
            });

            test('should build content list as DOM elements', (assert) => {
                const c = new TabsComponent({ $target: {} });
                c.addTab('foo', 'bar');

                let $el = c.build();

                assert.ok($el.querySelector('main'), 'Create <main> with list of <div> which contains "titles"');
                assert.equal($el.querySelector('main').id, 'content', 'Add id="content" to <main> container');
                assert.equal($el.querySelector('main').children.length, 1, 'After add 1x element, list of contents should has only 1 tab');
                assert.equal($el.querySelector('main').children[0].textContent, 'bar', 'First content container, should has value from "content" property');

                c.addTab('xxx', 'yyy');
                c.addTab('abc', 'bleh');

                $el = c.build();

                assert.equal($el.querySelector('main').children.length, 3, 'After add 3x element, list of contents should as 3 tabs');
                assert.equal($el.querySelector('main').children[1].textContent, 'yyy', 'Second content container, should has value from "content" property');
                assert.equal($el.querySelector('main').children[2].textContent, 'bleh', 'Third content container, should has value from "content" property');
            });

        });

        describe('render', () => {
            test('should define render method', (assert) => {
                const c = new TabsComponent({});
                assert.equal(typeof c.render, 'function', 'Define function "this.render"');
            });

            test('should clear current value of "$target"', (assert) => {
                const $target = document.querySelector('#qunit-fixture');
                const c = new TabsComponent({ $target });
                c.render();
                assert.equal(c.$el, null, 'When list of tabs is empty, property "this.$el" should be empty to');
                assert.equal($target.innerHTML, '', 'Render should clear content of $target container');
            });

            test('should render proper DOM tree', (assert) => {
                const $target = document.querySelector('#qunit-fixture');
                const c = new TabsComponent({ $target });
                c.addTab('foo', 'bar');
                c.addTab('xxx', 'yyy');
                c.addTab('abc', 'bleh');
                c.render();

                assert.equal($target.querySelector('ul').children.length, 3, 'After add 3x element, list of tabs should as 3 tabs');
                assert.equal($target.querySelector('ul').children[0].textContent, 'foo', 'First tab should has value form "title" property');
                assert.equal($target.querySelector('ul').children[1].textContent, 'xxx', 'Second tab should has value from "title" property');
                assert.equal($target.querySelector('ul').children[2].textContent, 'abc', 'Third tab should has value from "title" property');

                assert.equal($target.querySelector('main').children.length, 3);
                assert.equal($target.querySelector('main').children[0].textContent, 'bar', 'First content container, should has value from "content" property');
                assert.equal($target.querySelector('main').children[1].textContent, 'yyy', 'Second content container, should has value from "content" property');
                assert.equal($target.querySelector('main').children[2].textContent, 'bleh', 'Third content container, should has value from "content" property');
            });

        });

    });
});
