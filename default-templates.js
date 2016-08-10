import template from 'lodash.template';

const namedThingWithParams = name => `
  <div class="jsdoc-${name}">
    <code class="jsdoc-${name}-name"><%= name %></code>
    <% if (params.length) { %>
      <span class="jsdoc-${name}-params">
        <code class="jsdoc-${name}-brace jsdoc-${name}-brace-left">(</code>
        <% for (const param of params) { %>
          <code class="jsdoc-${name}-param jsdoc-${name}-param-<%= param.name %>"><%= param.name %></code>
        <% } %>
        <code class="jsdoc-${name}-brace jsdoc-${name}-brace-right">)</code>
      </span>
    <% } %>
  </div>
`;

export default {
  event: template(namedThingWithParams('event')),
  action: template(namedThingWithParams('action')),

  param: template(`
    <div class="jsdoc-param jsdoc-param-arg">
      <% if (types.length) { %>
        <span class="jsdoc-param-types">
          <% for (const type of types) { %>
            <code class="jsdoc-param-type jsdoc-param-type-<%= type.toLowerCase() %>"><%= type %></code>
          <% } %>
        </span>
      <% } %>
      <code class="jsdoc-param-name"><%= name %></code>
      <% if (typeof defaultValue !== 'undefined') { %>
        <code class="jsdoc-param-default-value"><%= defaultValue %></code>
      <% } %>
      <% if (description) { %>
        <span class="jsdoc-param-description"><%= description %></span>
      <% } %>
    </div>
  `),

  method: template(`
    <div class="jsdoc-method">
      <code class="jsdoc-method-name"><%= name %></code>
      <span class="jsdoc-method-params">
        <code class="jsdoc-method-brace jsdoc-method-brace-left">(</code>
          <% for (const param of params) { %>
            <code class="jsdoc-method-param jsdoc-method-param-<%= param.name %>"><%= param.name %></code>
          <% } %>
        <code class="jsdoc-method-brace jsdoc-method-brace-right">)</code>
        <% if (returns.types.length) { %>
          <span class="jsdoc-method-returns">
            <% for (const type of returns.types) { %>
              <code class="jsdoc-method-returns-type jsdoc-method-returns-type-<%= type.toLowerCase() %>"><%= type %></code>
            <% } %>
          </span>
        <% } %>
      </span>
    </div>
  `),

  returns: template(`
    <div class="jsdoc-returns">
      <span class="jsdoc-returns-types">
        <% for (const type of types) { %>
          <code class="jsdoc-returns-type jsdoc-returns-type-<%= type.toLowerCase() %>"><%= type %></code>
        <% } %>
      </span>
      <% if (description) { %>
        <span class="jsdoc-returns-description"><%= description %></span>
      <% } %>
    </div>
  `),

  property: template(`
    <div class="jsdoc-property">
      <% if (types.length) { %>
        <span class="jsdoc-property-types">
          <% for (const type of types) { %>
            <code class="jsdoc-property-type jsdoc-property-type-<%= type.toLowerCase() %>"><%= type %></code>
          <% } %>
        </span>
      <% } %>
      <code class="jsdoc-property-name"><%= name %></code>
      <% if (description) { %>
        <span class="jsdoc-property-description"><%= description %></span>
      <% } %>
    </div>
  `),
};
