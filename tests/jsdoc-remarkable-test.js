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

  it('throws when unknown tag is encountered', () =>
    expect(() => actual(`@foo actionName`)).to.throw(/Unknown tag @foo/)
  );

  describe('@param', () => {
    describe('single line', () => {
      it('@param paramName {type}', () =>
        expect(actual('@param paramName {type}')).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName</code>
            </div>
          </p>
        `))
      );

      it('@param paramName {type} here goes description', () =>
        expect(actual('@param paramName {type} here goes description')).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName</code>
              <span class="param-description">here goes description</span>
            </div>
          </p>
        `))
      );

      it('@param paramName {type} - here goes description', () =>
        expect(actual('@param paramName {type} - here goes description')).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName</code>
              <span class="param-description">here goes description</span>
            </div>
          </p>
        `))
      );

      it('@param {type} paramName', () =>
        expect(actual('@param {type} paramName')).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName</code>
            </div>
          </p>
        `))
      );

      it('@param {type} paramName here goes description', () =>
        expect(actual('@param {type} paramName here goes description')).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName</code>
              <span class="param-description">here goes description</span>
            </div>
          </p>
        `))
      );

      it('@param {type} paramName - here goes description', () =>
        expect(actual('@param {type} paramName - here goes description')).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName</code>
              <span class="param-description">here goes description</span>
            </div>
          </p>
        `))
      );
    });

    describe('multiple params', () => {
      it('two params', () =>
        expect(actual(`
          @param {type} paramName1 - here goes description
          @param {type} paramName2
        `)).to.equal(expected(`
          <p>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName1</code>
              <span class="param-description">here goes description</span>
            </div>
            <div class="param param-arg">
              <span class="param-types">
                <code class="param-type param-type-type">type</code>
              </span>
              <code class="param-name">paramName2</code>
            </div>
          </p>
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
          <p>
            <div class="method">
              <div class="method-signature">
                <span class="method-name">methodName</span>
                <span class="method-params">
                  <span class="method-brace method-brace-left">(</span>
                  <span class="method-brace method-brace-right">)</span>
                </span>
              </div>
            </div>
          </p>
        `))
      );
    });

    describe('with return', () => {
      it('@method methodName(): Boolean', () =>
        expect(actual(`
          @method methodName
          @returns {Boolean} This value is returned.
        `)).to.equal(expected(`
          <p>
            <div class="method">
              <div class="method-signature">
                <span class="method-name">methodName</span>
                <span class="method-params">
                  <span class="method-brace method-brace-left">(</span>
                  <span class="method-brace method-brace-right">)</span>
                  <span class="method-returns">
                    <span class="method-returns-type method-returns-type-boolean">Boolean</span>
                  </span>
                </span>
              </div>
              <div class="method-returns">
                <span class="method-returns">
                  <span class="method-returns-type method-returns-type-boolean">Boolean</span>
                </span>
                <span class="method-returns-description">This value is returned.</span>
              </div>
            </div>
          </p>
        `))
      );
    });

    describe('with params', () => {
      it('@method methodName(p1, p2)', () =>
        expect(actual(`
          @method methodName
          @param p1 {Boolean}
          @param p2 {Boolean}
        `)).to.equal(expected(`
          <p>
            <div class="method">
              <div class="method-signature">
                <span class="method-name">methodName</span>
                <span class="method-params">
                  <span class="method-brace method-brace-left">(</span>
                  <code class="method-param method-param-p1">p1</code>
                  <code class="method-param method-param-p2">p2</code>
                  <span class="method-brace method-brace-right">)</span>
                </span>
              </div>
              <div class="method-params">
                <div class="param param-arg">
                  <span class="param-types">
                    <code class="param-type param-type-boolean">Boolean</code>
                  </span>
                  <code class="param-name">p1</code>
                </div>
                <div class="param param-arg">
                  <span class="param-types">
                    <code class="param-type param-type-boolean">Boolean</code>
                  </span>
                  <code class="param-name">p2</code>
                </div>
              </div>
            </div></p>
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
          <p>
            <div class="event">
              <div class="event-signature">
                <span class="event-name">eventName</span>
              </div>
            </div>
          </p>
        `))
      );
    });

    describe('with params', () => {
      it('@event eventName(p1, p2)', () =>
        expect(actual(`
          @event eventName
          @param p1 {Boolean}
          @param p2 {Boolean}
        `)).to.equal(expected(`
          <p>
            <div class="event">
              <div class="event-signature">
                <span class="event-name">eventName</span>
                <span class="event-params">
                  <span class="event-brace event-brace-left">(</span>
                  <code class="event-param event-param-p1">p1</code>
                  <code class="event-param event-param-p2">p2</code>
                  <span class="event-brace event-brace-right">)</span>
                </span>
              </div>
              <div class="event-params">
                <div class="param param-arg">
                  <span class="param-types">
                    <code class="param-type param-type-boolean">Boolean</code>
                  </span>
                  <code class="param-name">p1</code>
                </div>
                <div class="param param-arg">
                  <span class="param-types">
                  <code class="param-type param-type-boolean">Boolean</code>
                  </span>
                  <code class="param-name">p2</code>
                </div>
              </div>
            </div></p>
        `))
      );
    });
  });

  describe('@property', () => {
    it('@property propertyName {Boolean}', () =>
      expect(actual(`
        @property propertyName {Boolean}
      `)).to.equal(expected(`
        <p>
          <div class="property">
            <span class="property-types">
              <code class="property-type property-type-boolean">Boolean</code>
            </span>
            <code class="property-name">propertyName</code>
          </div>
        </p>
      `))
    );

    it('@property propertyName {Boolean} - This is a description.', () =>
      expect(actual(`
        @property propertyName {Boolean} - This is a description.
      `)).to.equal(expected(`
        <p>
          <div class="property">
            <span class="property-types">
              <code class="property-type property-type-boolean">Boolean</code>
            </span>
            <code class="property-name">propertyName</code>
            <span class="property-description">This is a description.</span>
          </div>
        </p>
      `))
    );

    it('@property propertyName {Boolean} This is a description.', () =>
      expect(actual(`
        @property propertyName {Boolean} This is a description.
      `)).to.equal(expected(`
        <p>
          <div class="property">
            <span class="property-types">
              <code class="property-type property-type-boolean">Boolean</code>
            </span>
            <code class="property-name">propertyName</code>
            <span class="property-description">This is a description.</span>
          </div>
        </p>
      `))
    );

    it('@property {Boolean} propertyName - This is a description.', () =>
      expect(actual(`
        @property {Boolean} propertyName - This is a description.
      `)).to.equal(expected(`
        <p>
          <div class="property">
            <span class="property-types">
              <code class="property-type property-type-boolean">Boolean</code>
            </span>
            <code class="property-name">propertyName</code>
            <span class="property-description">This is a description.</span>
          </div>
        </p>
      `))
    );

    it('@property {Boolean} propertyName This is a description.', () =>
      expect(actual(`
        @property {Boolean} propertyName This is a description.
      `)).to.equal(expected(`
        <p>
          <div class="property">
            <span class="property-types">
              <code class="property-type property-type-boolean">Boolean</code>
            </span>
            <code class="property-name">propertyName</code>
            <span class="property-description">This is a description.</span>
          </div>
        </p>
      `))
    );
  });
});
