# jsdoc-remarkable

[![GratiPay](https://img.shields.io/gratipay/user/alexgorbatchev.svg)](https://gratipay.com/alexgorbatchev/)
![Downloads](https://img.shields.io/npm/dm/jsdoc-remarkable.svg)
![Version](https://img.shields.io/npm/v/jsdoc-remarkable.svg)

Plugin for [Remarkable Markdown parser](https://github.com/jonschlinkert/remarkable) that enables basic JSDoc.

## Installation

```
npm install --save-dev jsdoc-remarkable
```

## Usage

```
import jsdoc from 'jsdoc-remarkable';
import Remarkable from 'remarkable';

const markdown = new Remarkable();
markdown.use(jsdoc());
markdown.render(...);
```

## JSDoc Support

This plugin is **not meant** to be a comprehensive implementation of JSDoc. The goal is to provide a small subset of functionality to facilitate beautifully rendered documentation. Majority of other things could be achieved with Markdown.

The following constructs are supported:

### @param

```
@param {(Type1|Type2)} paramName - Param description.
```

### @method

```
@method methodName
@param {(Type1|Type2)} paramName - Param description.

This is method description.
```

### @property

```
@property {(Type1|Type2)} propName - Property description.
```

### @event

```
@event eventName
@param {(Type1|Type2)} paramName - Param description.

This is event description.
```

### @action

```
@action actionName
@param {(Type1|Type2)} paramName - Param description.

This is action description.
```

## License

ISC
