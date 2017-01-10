import { expect } from 'chai';
import { unindent } from 'unindenter';
import merge from 'lodash.merge';
import Remarkable from 'remarkable';
import jsdoc from '../jsdoc-remarkable';

describe('jsdoc-remarkable', () => {
  function jsdocRemarkable(input) {
    const markdown = new Remarkable();
    markdown.use(jsdoc());
    return markdown.render(input);
  }

  function expected(str) {
    return str
      .replace(/^\s+/gm, '')
      .replace(/^\s+|\s+$/gm, '')
      ;
  }

  function actual(str) {
    return jsdocRemarkable(unindent(str))
      .replace(/\>\s\</g, '>\n<')
      .replace(/^\s+|\s+$/gm, '')
      ;
  }

  describe('non-tags', () => {
    it('can handle email addresses in plain text', () =>
      expect(actual('This is just [test@](mailto:test@test.com).')).to.equal(expected(`
        <p>This is just <a href="mailto:test@test.com">test@</a>.</p>
      `))
    );
  });

  describe('errors', () => {
    it('throws when unknown tag is encountered', () =>
      expect(() => actual(`@foo actionName`)).to.throw(/Unknown tag @foo/)
    );
  });

  describe('@param', () => {
    describe('single line', () => {
      it('@param {type} paramName', () =>
        expect(actual('@param {type} paramName')).to.equal(expected(`
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-type">type</code>
            </span>
            <code class="jsdoc-param-name">paramName</code>
          </div>
        `))
      );

      it('@param {type} paramName here goes description', () =>
        expect(actual('@param {type} paramName here goes description')).to.equal(expected(`
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-type">type</code>
            </span>
            <code class="jsdoc-param-name">paramName</code>
            <span class="jsdoc-param-description">here goes description</span>
          </div>
        `))
      );

      it('@param {type} paramName - here goes description', () =>
        expect(actual('@param {type} paramName - here goes description')).to.equal(expected(`
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-type">type</code>
            </span>
            <code class="jsdoc-param-name">paramName</code>
            <span class="jsdoc-param-description">here goes description</span>
          </div>
        `))
      );

      it('@param {type} [paramName=FooBar] - here goes description', () =>
        expect(actual('@param {type} [paramName=FooBar] - here goes description')).to.equal(expected(`
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-type">type</code>
            </span>
            <code class="jsdoc-param-name">paramName</code>
            <code class="jsdoc-param-default-value">FooBar</code>
            <span class="jsdoc-param-description">here goes description</span>
          </div>
        `))
      );
    });

    describe('multiple params', () => {
      it('two params', () =>
        expect(actual(`
          @param {type} paramName1 - here goes description
          @param {type} paramName2
        `)).to.equal(expected(`
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-type">type</code>
            </span>
            <code class="jsdoc-param-name">paramName1</code>
            <span class="jsdoc-param-description">here goes description</span>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-type">type</code>
            </span>
            <code class="jsdoc-param-name">paramName2</code>
          </div>
        `))
      );
    })
  });

  describe('@method', () => {
    describe('by itself', () => {
      it('@method methodName', () =>
        expect(actual(`
          @method methodName
        `)).to.equal(expected(`
          <div class="jsdoc-method">
            <code class="jsdoc-method-name">methodName</code>
            <span class="jsdoc-method-params">
              <code class="jsdoc-method-brace jsdoc-method-brace-left">(</code>
              <code class="jsdoc-method-brace jsdoc-method-brace-right">)</code>
            </span>
          </div>
        `))
      );
    });

    describe('with return', () => {
      it('@method methodName(): Boolean', () =>
        expect(actual(`
          @method methodName
          @returns {(Type1|Type2)} - This value is returned.
        `)).to.equal(expected(`
          <div class="jsdoc-method">
            <code class="jsdoc-method-name">methodName</code>
            <span class="jsdoc-method-params">
              <code class="jsdoc-method-brace jsdoc-method-brace-left">(</code>
              <code class="jsdoc-method-brace jsdoc-method-brace-right">)</code>
              <span class="jsdoc-method-returns">
                <code class="jsdoc-method-returns-type jsdoc-method-returns-type-type1">Type1</code>
                <code class="jsdoc-method-returns-type jsdoc-method-returns-type-type2">Type2</code>
              </span>
            </span>
          </div>
          <div class="jsdoc-returns">
            <span class="jsdoc-returns-types">
              <code class="jsdoc-returns-type jsdoc-returns-type-type1">Type1</code>
              <code class="jsdoc-returns-type jsdoc-returns-type-type2">Type2</code>
            </span>
            <span class="jsdoc-returns-description">This value is returned.</span>
          </div>
        `))
      );
    });

    describe('with params', () => {
      it('@method methodName(p1, p2) with description', () =>
        expect(actual(`
          @method methodName
          @param {Boolean} p1
          @param {Boolean} p2

          This is a description.
        `)).to.equal(expected(`
          <div class="jsdoc-method">
            <code class="jsdoc-method-name">methodName</code>
            <span class="jsdoc-method-params">
              <code class="jsdoc-method-brace jsdoc-method-brace-left">(</code>
              <code class="jsdoc-method-param jsdoc-method-param-p1">p1</code>
              <code class="jsdoc-method-param jsdoc-method-param-p2">p2</code>
              <code class="jsdoc-method-brace jsdoc-method-brace-right">)</code>
            </span>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p1</code>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p2</code>
          </div>
          <p>This is a description.</p>
        `))
      );

      it('@method methodName(p1, p2) inside a header', () =>
        expect(actual(`
          ## @method methodName
          @param {Boolean} p1
          @param {Boolean} p2
        `)).to.equal(expected(`
          <h2>
            <div class="jsdoc-method">
              <code class="jsdoc-method-name">methodName</code>
              <span class="jsdoc-method-params">
                <code class="jsdoc-method-brace jsdoc-method-brace-left">(</code>
                <code class="jsdoc-method-param jsdoc-method-param-p1">p1</code>
                <code class="jsdoc-method-param jsdoc-method-param-p2">p2</code>
                <code class="jsdoc-method-brace jsdoc-method-brace-right">)</code>
              </span>
            </div>
          </h2>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p1</code>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p2</code>
          </div>
        `))
      );
    });
  });

  describe('@event', () => {
    describe('by itself', () => {
      it('@event eventName', () =>
        expect(actual(`
          @event eventName
        `)).to.equal(expected(`
          <div class="jsdoc-event">
            <code class="jsdoc-event-name">eventName</code>
          </div>
        `))
      );
    });

    describe('with params', () => {
      it('@event eventName(p1, p2)', () =>
        expect(actual(`
          @event eventName
          @param {Boolean} p1
          @param {Boolean} p2
        `)).to.equal(expected(`
          <div class="jsdoc-event">
            <code class="jsdoc-event-name">eventName</code>
            <span class="jsdoc-event-params">
              <code class="jsdoc-event-brace jsdoc-event-brace-left">(</code>
              <code class="jsdoc-event-param jsdoc-event-param-p1">p1</code>
              <code class="jsdoc-event-param jsdoc-event-param-p2">p2</code>
              <code class="jsdoc-event-brace jsdoc-event-brace-right">)</code>
            </span>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p1</code>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p2</code>
          </div>
        `))
      );
    });
  });

  describe('@action', () => {
    describe('by itself', () => {
      it('@action actionName', () =>
        expect(actual(`
          @action actionName
        `)).to.equal(expected(`
          <div class="jsdoc-action">
            <code class="jsdoc-action-name">actionName</code>
          </div>
        `))
      );

      it('with description', () =>
        expect(actual(`
          @action actionName

          This is a description of \`actionName\`.
        `)).to.equal(expected(`
          <div class="jsdoc-action">
            <code class="jsdoc-action-name">actionName</code>
          </div>

          <p>This is a description of <code>actionName</code>.</p>
        `))
      );
    });

    describe('with params', () => {
      it('@action actionName(p1, p2)', () =>
        expect(actual(`
          @action actionName
          @param {Boolean} p1
          @param {Boolean} p2
        `)).to.equal(expected(`
          <div class="jsdoc-action">
            <code class="jsdoc-action-name">actionName</code>
            <span class="jsdoc-action-params">
              <code class="jsdoc-action-brace jsdoc-action-brace-left">(</code>
              <code class="jsdoc-action-param jsdoc-action-param-p1">p1</code>
              <code class="jsdoc-action-param jsdoc-action-param-p2">p2</code>
              <code class="jsdoc-action-brace jsdoc-action-brace-right">)</code>
            </span>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
              <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p1</code>
          </div>
          <div class="jsdoc-param jsdoc-param-arg">
            <span class="jsdoc-param-types">
            <code class="jsdoc-param-type jsdoc-param-type-boolean">Boolean</code>
            </span>
            <code class="jsdoc-param-name">p2</code>
          </div>
        `))
      );
    });
  });

  describe('@property', () => {
    it('@property {Boolean} propertyName', () =>
      expect(actual(`
        @property {Boolean} propertyName
      `)).to.equal(expected(`
        <div class="jsdoc-property">
          <span class="jsdoc-property-types">
            <code class="jsdoc-property-type jsdoc-property-type-boolean">Boolean</code>
          </span>
          <code class="jsdoc-property-name">propertyName</code>
        </div>
      `))
    );

    it('@property {Boolean} propertyName - This is a description.', () =>
      expect(actual(`
        @property {Boolean} propertyName - This is a description.
      `)).to.equal(expected(`
        <div class="jsdoc-property">
          <span class="jsdoc-property-types">
            <code class="jsdoc-property-type jsdoc-property-type-boolean">Boolean</code>
          </span>
          <code class="jsdoc-property-name">propertyName</code>
          <span class="jsdoc-property-description">This is a description.</span>
        </div>
      `))
    );

    it('@property {Boolean} propertyName This is a description.', () =>
      expect(actual(`
        @property {Boolean} propertyName This is a description.
      `)).to.equal(expected(`
        <div class="jsdoc-property">
          <span class="jsdoc-property-types">
            <code class="jsdoc-property-type jsdoc-property-type-boolean">Boolean</code>
          </span>
          <code class="jsdoc-property-name">propertyName</code>
          <span class="jsdoc-property-description">This is a description.</span>
        </div>
      `))
    );
  });
});
