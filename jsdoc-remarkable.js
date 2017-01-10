import merge from 'lodash.merge';
import defaultTemplates from './default-templates';
import parseJSDocLine from 'jsdoc-line-parser';
import tagParsers from './tag-parsers';

const EMPTY_PREFIX = /^\s*$/;

function getLinePrefix(string, pos) {
  let accumulator = '';

  pos--;

  while (pos >= 0 && string[pos] !== '\n') {
    accumulator = string[pos--] + accumulator;
  }

  return accumulator;
}

function parse(state, silent, opts) {
  if (state.src[state.pos] !== '@') {
    return false;
  }

  if (!EMPTY_PREFIX.test(getLinePrefix(state.src, state.pos))) {
    return false;
  }

  if (!state.env.jsdoc) {
    state.env.jsdoc = {};
  }

  let pos = state.pos + 1;

  while (pos < state.src.length) {
    const currentChar = state.src.charAt(pos);
    const nextChar = state.src.charAt(pos + 1);

    if (currentChar === '\n' && (nextChar === '\n' || nextChar === '@')) {
      break;
    }

    pos++;
  }

  const tagString = state.src.substr(state.pos, pos - state.pos);
  const parsedTag = parseJSDocLine(tagString);

  if (!parsedTag) {
    return false;
  }

  if (!silent) {
    const parseTag = tagParsers[parsedTag.tag];
    const context = parseTag ? parseTag(parsedTag, state.env.jsdoc, opts) : {};

    state.push({
      type: 'jsdoc',
      tagName: parsedTag.tag,
      context: context || {},
      level: state.level,
    });
  }

  state.pos = pos;

  return true;
}

function render(tokens, tokenIndex, options, env, _this, opts) {
  const { tagName, tagValue, context } = tokens[tokenIndex];

  if (context.skip) {
    return '';
  }

  const { templates } = opts;
  const template = templates[tagName];

  if (!template) {
    throw new Error(`Unknown tag @${tagName}`);
  }

  const localContext = merge({}, true, context, { templates, merge });

  try {
    return template(localContext).replace(/\s+/g, ' ');
  } catch (err) {
    throw new Error(`Template error (${tagName}): ${err.message}`);
  }
}

export default function jsdocRemarkable(templates = defaultTemplates) {
  return markdown => {
    const opts = { markdown, templates };
    const firstRule = markdown.inline.ruler.__rules__[0].name;
    const { paragraph_open, paragraph_close } = markdown.renderer.rules;

    markdown.inline.ruler.push('jsdoc', (...args) => parse(...args, opts), { alt: [ 'paragraph' ] });
    markdown.renderer.rules.jsdoc = (...args) => render(...args, opts);

    markdown.renderer.rules.paragraph_open = function (tokens, index) {
      let hasJSDocTokens = false;

      // Looks for a jsdoc token inside a paragraph and if found, prevents the <p>
      // tag from being rendered out.
      for (let i = index + 1; i < tokens.length; i++) {
        const children = tokens[i].children || [];
        hasJSDocTokens = hasJSDocTokens || children.find(token => token.type === 'jsdoc');

        if (tokens[i].type === 'paragraph_close') {
          if (hasJSDocTokens) {
            tokens[i].tight = true;
          }
          break;
        }
      }

      return hasJSDocTokens ? '' : paragraph_open(...arguments);
    }
  }
}
