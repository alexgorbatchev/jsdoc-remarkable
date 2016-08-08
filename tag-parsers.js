import merge from 'lodash.merge';

function stripWrappingParagraph(str) {
  return str.replace(/^<\p\>([\s\S]*)\<\/p\>\n$/, '$1');
}

export default {
  param(parsedTag, globalContext, { templates, markdown }) {
    const context = merge({}, true, parsedTag);

    context.description = stripWrappingParagraph(markdown.render(context.description));

    if (globalContext.paramsContext) {
      globalContext.paramsContext.push(context);
    }

    return context;
  },

  method(parsedTag, globalContext, { templates, markdown }) {
    const params = [];
    const returns = { types: [], description: null };
    const context = { name: parsedTag.name, params, returns };

    globalContext.paramsContext = params;
    globalContext.returnsContext = returns;

    return context;
  },

  event(parsedTag, globalContext, { templates, markdown }) {
    const params = [];
    const context = { name: parsedTag.name, params };

    globalContext.paramsContext = params;

    return context;
  },

  action(parsedTag, globalContext, { templates, markdown }) {
    const params = [];
    const context = { name: parsedTag.name, params };

    globalContext.paramsContext = params;

    return context;
  },

  returns(parsedTag, globalContext, { templates, markdown }) {
    const { returnsContext } = globalContext;

    if (!returnsContext) {
      throw new Error('@return needs to be in the context of a @method.');
    }

    returnsContext.types.push(...parsedTag.types);
    returnsContext.description = stripWrappingParagraph(markdown.render(parsedTag.description));

    return {
      types: parsedTag.types,
      description: returnsContext.description,
    };
  },

  property(parsedTag, globalContext, { templates, markdown }) {
    const context = merge({}, true, parsedTag);
    context.description = stripWrappingParagraph(markdown.render(parsedTag.description));
    return context;
  },
};
