import template from 'lodash.template';

export default {
  param: template(`
    <div class="param param-arg">
      <% if (types.length) { %>
        <span class="param-types">
          <% for (const type of types) { %>
            <code class="param-type param-type-<%= type.toLowerCase() %>"><%= type %></code>
          <% } %>
        </span>
      <% } %>
      <code class="param-name"><%= name %></code>
      <% if (description) { %>
        <span class="param-description"><%= description %></span>
      <% } %>
    </div>
  `),

  method: template(`
    <div class="method">
      <div class="method-signature">
        <span class="method-name"><%= name %></span>
        <span class="method-params">
          <span class="method-brace method-brace-left">(</span>
            <% for (const param of params) { %>
              <code class="method-param method-param-<%= param.name %>"><%= param.name %></code>
            <% } %>
          <span class="method-brace method-brace-right">)</span>
          <% if (returns.types.length) { %>
            <span class="method-returns">
              <% for (const type of returns.types) { %>
                <span class="method-returns-type method-returns-type-boolean"><%= type %></span>
              <% } %>
            </span>
          <% } %>
        </span>
      </div>
      <% if (params.length) { %>
        <div class="method-params">
          <% for (const param of params) { %>
            <%= templates.param(param) %>
          <% } %>
        </div>
      <% } %>
      <% if (returns.types.length) { %>
        <div class="method-returns">
          <span class="method-returns">
            <% for (const type of returns.types) { %>
              <span class="method-returns-type method-returns-type-boolean"><%= type %></span>
            <% } %>
          </span>
          <% if (returns.description) { %>
            <span class="method-returns-description"><%= returns.description %></span>
          <% } %>
        </div>
      <% } %>
    </div>
  `),

  event: template(`
    <div class="event">
      <div class="event-signature">
        <span class="event-name"><%= name %></span>
        <% if (params.length) { %>
          <span class="event-params">
            <span class="event-brace event-brace-left">(</span>
            <% for (const param of params) { %>
              <code class="event-param event-param-<%= param.name %>"><%= param.name %></code>
            <% } %>
            <span class="event-brace event-brace-right">)</span>
          </span>
        <% } %>
      </div>
      <% if (params.length) { %>
        <div class="event-params">
          <% for (const param of params) { %>
            <%= templates.param(param) %>
          <% } %>
        </div>
      <% } %>
    </div>
  `),

  property: template(`
    <div class="property">
      <% if (types.length) { %>
        <span class="property-types">
          <% for (const type of types) { %>
            <code class="property-type property-type-<%= type.toLowerCase() %>"><%= type %></code>
          <% } %>
        </span>
      <% } %>
      <code class="property-name"><%= name %></code>
      <% if (description) { %>
        <span class="property-description"><%= description %></span>
      <% } %>
    </div>
  `),
};
