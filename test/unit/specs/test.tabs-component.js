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
            assert.notEqual(
                typeof TabsComponent,
                'undefined',
                'Define "window.TabsComponent"'
            );
        });

        test('should be a class', (assert) => {
            assert.regexp(
                TabsComponent.toString(),
                CLASS_CHECKER_REGEXP,
                'Change "window.TabsComponent" to class'
            );
        });
    });

    describe('API', function () {
        describe('constructor', () => {
            const hasDefaultParam = (/constructor\(\w+ =/).test(TabsComponent.toString());

            if (!hasDefaultParam) {
                test('should be waiting for single argument "options" in constructor', (assert) => {
                    assert.deepEqual(TabsComponent.length, 1, 'Add one argument into window.TabsComponent constructor, eg. "options"');
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
                assert.deepEqual(c.$target, my$target, 'Assign value from "options.$target" to "this.$target"');
            });

            test('should have empty property with DOM structure', (assert) => {
                const c = new TabsComponent({});
                assert.ok(c.hasOwnProperty('$el'), 'Add "this.$el" property');
                assert.deepEqual(c.$el, null, 'Set "this.$el" to null at the beginning');
            });

            test('"this.$el" should be define with "null" value', (assert) => {
                const cached = document.querySelector;
                document.querySelector = () => 'DO NOT USE';
                const c = new TabsComponent({});
                assert.deepEqual(c.$el, null, 'Do not use "document.querySelector" in TabsComponent constructor');
                document.querySelector = cached;
            });

            test('should have list of tabs in Array', (assert) => {
                const c = new TabsComponent({});
                assert.ok(Array.isArray(c.tabs), 'Define empty array "this.tabs"');
            });

        });

        describe('addTab', () => {
            test('should be a method', (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(typeof c.addTab, 'function', 'Define function "this.addTab()"');
            });

            test('addTab: expected 2 arguments: title, content', (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(c.addTab.length, 2, 'Method "this.addTab()" expects 2 arguments');
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
                assert.deepEqual(typeof c.build, 'function', 'Define function "this.build()"');
            });

            test('should not modify current "this.$el" property', (assert) => {
                const c = new TabsComponent({});
                c.addTab('t', 'c');
                c.build();
                assert.deepEqual(c.$el, null, 'Function "this.build()" should create structure, but not modify current "this.$el" property');
            });

            test('should use "this.tabs" to build DOM tree with tabs', (assert) => {
                const c = new TabsComponent({ $target: {} });
                c.addTab('foo', 'bar');

                let $el = c.build();

                assert.ok($el instanceof HTMLElement, 'Function "this.build()" should returns HTMLElement');
                assert.deepEqual($el.tagName.toLowerCase(), 'div', 'Function "this.build()" must returns <div>');
                assert.ok($el.querySelector('nav'), 'Append <nav> container into current <div> (use "appendChild" method)');
                assert.deepEqual($el.querySelector('nav').id, 'tabs', 'Set id="tabs" into <nav>');
                assert.ok($el.querySelector('nav').querySelector('ul'), 'Create <nav> with <ul> which contains list of "titles"');
                assert.deepEqual($el.querySelector('nav').querySelector('ul').children.length, 1, 'After adding 1 element, list of tabs should have only 1 tab');
                assert.deepEqual($el.querySelector('nav').querySelector('ul').children[0].textContent, 'foo', 'First tab should have value form "title" property');

                c.addTab('xxx', 'yyy');
                c.addTab('abc', 'bleh');

                $el = c.build();

                assert.deepEqual($el.querySelector('ul').children.length, 3, 'After adding 3 elements, list of tabs should have 3 tabs');
                assert.deepEqual($el.querySelector('ul').children[1].textContent, 'xxx', 'Second tab should have value from "title" property');
                assert.deepEqual($el.querySelector('ul').children[2].textContent, 'abc', 'Third tab should have value from "title" property');
            });

            test('should verify that function returns nothing', (assert) => {
                const c = new TabsComponent({});
                const result = c.build();
                assert.deepEqual(result, null, 'Add early return with "null", when "this.tabs" is empty');
            });

            test('should build content list as DOM elements', (assert) => {
                const c = new TabsComponent({ $target: {} });
                c.addTab('foo', 'bar');

                let $el = c.build();

                assert.ok($el.querySelector('main'), 'Create <main> with list of <div> which contains "titles"');
                assert.deepEqual($el.querySelector('main').id, 'content', 'Add id="content" to <main> container');
                assert.deepEqual($el.querySelector('main').children.length, 1, 'After adding 1 element, list of contents should have only 1 tab');
                assert.deepEqual($el.querySelector('main').children[0].textContent, 'bar', 'First content container, should have value from "content" property');

                c.addTab('xxx', 'yyy');
                c.addTab('abc', 'bleh');

                $el = c.build();

                assert.deepEqual($el.querySelector('main').children.length, 3, 'After adding 3 elements, list of contents should have 3 tabs');
                assert.deepEqual($el.querySelector('main').children[1].textContent, 'yyy', 'Second content container, should have value from "content" property');
                assert.deepEqual($el.querySelector('main').children[2].textContent, 'bleh', 'Third content container, should have value from "content" property');
            });

        });

        describe('render', () => {
            test('should define render method', (assert) => {
                const c = new TabsComponent({});
                assert.deepEqual(typeof c.render, 'function', 'Define function "this.render()"');
            });

            test('should remove all elements from "$target"', (assert) => {
                const $target = document.createElement('div');
                $target.appendChild(document.createElement('p'));
                $target.appendChild(document.createElement('ul'));
                const c = new TabsComponent({ $target });
                c.render();
                assert.deepEqual(c.$el, null, 'When list of tabs is empty, property "this.$el" should be empty too');
                assert.deepEqual($target.innerHTML, '', 'Render should clear content of "this.$target" container with "innerHTML" function');
            });

            test('should render proper DOM tree', (assert) => {
                const $target = document.querySelector('#qunit-fixture');
                const c = new TabsComponent({ $target });
                c.addTab('foo', 'bar');
                c.addTab('xxx', 'yyy');
                c.addTab('abc', 'bleh');
                c.render();

                assert.ok(c.$el instanceof HTMLElement, 'Append "this.$target" only with HTMLElement instance');
                assert.notEqual($target.querySelector('ul'), null, 'Function "render" should update "this.$el" property with "this.build()"');
                assert.deepEqual($target.querySelector('ul').children.length, 3, 'After adding 3 elements, list of tabs should have 3 tabs');
                assert.deepEqual($target.querySelector('ul').children[0].textContent, 'foo', 'First tab should have value form "title" property');
                assert.deepEqual($target.querySelector('ul').children[1].textContent, 'xxx', 'Second tab should have value from "title" property');
                assert.deepEqual($target.querySelector('ul').children[2].textContent, 'abc', 'Third tab should have value from "title" property');

                assert.deepEqual($target.querySelector('main').children.length, 3);
                assert.deepEqual($target.querySelector('main').children[0].textContent, 'bar', 'First content container, should have value from "content" property');
                assert.deepEqual($target.querySelector('main').children[1].textContent, 'yyy', 'Second content container, should have value from "content" property');
                assert.deepEqual($target.querySelector('main').children[2].textContent, 'bleh', 'Third content container, should have value from "content" property');
            });
        });
    });
});
