import XRegExp from 'xregexp';
import merge from 'lodash.merge';

const PARAM_REGEX_LIST = [
  new XRegExp(`
    ^\\s*
      \\{ (?<types>[\\w\\|]+) \\}
      \\s+
      (?<name> \\w+)
      \\s* (-\\s+)?
      (?<description> .*)
    $
  `, 'xs')

  , new XRegExp(`
    ^\\s*
      (?<name> \\w+)
      \\s+
      \\{ (?<types>[\\w\\|]+) \\}
      \\s* (-\\s+)?
      (?<description> .*)
    $
  `, 'xs')
];

const RETURNS_REGEX_LIST = [
  new XRegExp(`
    ^\\s*
      \\{ (?<types>[\\w\\|]+) \\}
      \\s* (-\\s+)?
      (?<description> .*)
    $
  `, 'xs')
];

function findMatch(string, regexList) {
  for (const regex of regexList) {
    const match = XRegExp.exec(string, regex);
    if (match) {
      return match;
    }
  }
}

function stripWrappingParagraph(str) {
  return str.replace(/^<\p\>([\s\S]*)\<\/p\>\n$/, '$1');
}

export default {
  param(value, globalContext, { templates, markdown }) {
    let { types, name, description } = findMatch(value, PARAM_REGEX_LIST) || {};

    if (name) {
      types = types.split(/\|/g);
      description = stripWrappingParagraph(markdown.render(description));

      const context = { types, name, description };

      if (globalContext.paramsContext) {
        globalContext.paramsContext.push(context);
      }

      return context;
    }
  },

  method(value, globalContext, { templates, markdown }) {
    const params = [];
    const returns = { types: [], description: null };
    const context = { name: value, params, returns };

    globalContext.paramsContext = params;
    globalContext.returnsContext = returns;

    return context;
  },

  event(value, globalContext, { templates, markdown }) {
    const params = [];
    const context = { name: value, params };

    globalContext.paramsContext = params;

    return context;
  },

  action(value, globalContext, { templates, markdown }) {
    const params = [];
    const context = { name: value, params };

    globalContext.paramsContext = params;

    return context;
  },

  returns(value, globalContext, { templates, markdown }) {
    let { types, description } = findMatch(value, RETURNS_REGEX_LIST) || {};

    if (types) {
      const { returnsContext } = globalContext;

      if (!returnsContext) {
        throw new Error('@return needs to be in the context of a @method.');
      }

      types = types.split(/\|/g);
      returnsContext.types.push(...types);
      returnsContext.description = stripWrappingParagraph(markdown.render(description));
      return { types, description };
    }
  },

  property(value, globalContext, { templates, markdown }) {
    let { types, name, description } = findMatch(value, PARAM_REGEX_LIST) || {};

    if (name) {
      types = types.split(/\|/g);
      description = stripWrappingParagraph(markdown.render(description));
      return { types, name, description };
    }
  },
};
