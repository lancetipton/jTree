'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var jsutils = require('jsutils');

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
var runtime = (function (exports) {
  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1;
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";
  function wrap(innerFn, outerFn, self, tryLocsList) {
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);
    generator._invoke = makeInvokeMethod(innerFn, self, context);
    return generator;
  }
  exports.wrap = wrap;
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }
  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";
  var ContinueSentinel = {};
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };
  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    IteratorPrototype = NativeIteratorPrototype;
  }
  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }
  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };
  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };
  exports.awrap = function(arg) {
    return { __await: arg };
  };
  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }
        return PromiseImpl.resolve(value).then(function(unwrapped) {
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          return invoke("throw", error, resolve, reject);
        });
      }
    }
    var previousPromise;
    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }
      return previousPromise =
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }
    this._invoke = enqueue;
  }
  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  exports.AsyncIterator = AsyncIterator;
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );
    return exports.isGeneratorFunction(outerFn)
      ? iter
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };
  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;
    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }
      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }
        return doneResult();
      }
      context.method = method;
      context.arg = arg;
      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }
        if (context.method === "next") {
          context.sent = context._sent = context.arg;
        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }
          context.dispatchException(context.arg);
        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }
        state = GenStateExecuting;
        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;
          if (record.arg === ContinueSentinel) {
            continue;
          }
          return {
            value: record.arg,
            done: context.done
          };
        } else if (record.type === "throw") {
          state = GenStateCompleted;
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      context.delegate = null;
      if (context.method === "throw") {
        if (delegate.iterator["return"]) {
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);
          if (context.method === "throw") {
            return ContinueSentinel;
          }
        }
        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }
      return ContinueSentinel;
    }
    var record = tryCatch(method, delegate.iterator, context.arg);
    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }
    var info = record.arg;
    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }
    if (info.done) {
      context[delegate.resultName] = info.value;
      context.next = delegate.nextLoc;
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }
    } else {
      return info;
    }
    context.delegate = null;
    return ContinueSentinel;
  }
  defineIteratorMethods(Gp);
  Gp[toStringTagSymbol] = "Generator";
  Gp[iteratorSymbol] = function() {
    return this;
  };
  Gp.toString = function() {
    return "[object Generator]";
  };
  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };
    if (1 in locs) {
      entry.catchLoc = locs[1];
    }
    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }
    this.tryEntries.push(entry);
  }
  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }
  function Context(tryLocsList) {
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }
  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }
      next.done = true;
      return next;
    };
  };
  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }
      if (typeof iterable.next === "function") {
        return iterable;
      }
      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }
          next.value = undefined$1;
          next.done = true;
          return next;
        };
        return next.next = next;
      }
    }
    return { next: doneResult };
  }
  exports.values = values;
  function doneResult() {
    return { value: undefined$1, done: true };
  }
  Context.prototype = {
    constructor: Context,
    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;
      this.method = "next";
      this.arg = undefined$1;
      this.tryEntries.forEach(resetTryEntry);
      if (!skipTempReset) {
        for (var name in this) {
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },
    stop: function() {
      this.done = true;
      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }
      return this.rval;
    },
    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }
      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;
        if (caught) {
          context.method = "next";
          context.arg = undefined$1;
        }
        return !! caught;
      }
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;
        if (entry.tryLoc === "root") {
          return handle("end");
        }
        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");
          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }
          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }
          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },
    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }
      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        finallyEntry = null;
      }
      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;
      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }
      return this.complete(record);
    },
    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }
      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }
      return ContinueSentinel;
    },
    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },
    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }
      throw new Error("illegal catch attempt");
    },
    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };
      if (this.method === "next") {
        this.arg = undefined$1;
      }
      return ContinueSentinel;
    }
  };
  return exports;
}(
   module.exports 
));
try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  Function("r", "regeneratorRuntime = r")(runtime);
}
});

var regenerator = runtime_1;

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var objectWithoutPropertiesLoose = _objectWithoutPropertiesLoose;

function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
var objectWithoutProperties = _objectWithoutProperties;

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
var classCallCheck = _classCallCheck;

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}
var defineProperty = _defineProperty;

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }
  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}
function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);
      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }
      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }
      _next(undefined);
    });
  };
}
var asyncToGenerator = _asyncToGenerator;

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? Object(arguments[i]) : {};
    var ownKeys = Object.keys(source);
    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }
    ownKeys.forEach(function (key) {
      defineProperty(target, key, source[key]);
    });
  }
  return target;
}
var objectSpread = _objectSpread;

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}
var arrayWithHoles = _arrayWithHoles;

function _iterableToArrayLimit(arr, i) {
  if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) {
    return;
  }
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;
  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);
      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }
  return _arr;
}
var iterableToArrayLimit = _iterableToArrayLimit;

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}
var nonIterableRest = _nonIterableRest;

function _slicedToArray(arr, i) {
  return arrayWithHoles(arr) || iterableToArrayLimit(arr, i) || nonIterableRest();
}
var slicedToArray = _slicedToArray;

var _typeof_1 = createCommonjsModule(function (module) {
function _typeof(obj) {
  "@babel/helpers - typeof";
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    module.exports = _typeof = function _typeof(obj) {
      return typeof obj;
    };
  } else {
    module.exports = _typeof = function _typeof(obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }
  return _typeof(obj);
}
module.exports = _typeof;
});

var addProp = function addProp(obj, name, def) {
  return jsutils.isObj(obj) && Object.defineProperty(obj, name, def);
};
var isConstructor = function isConstructor(obj) {
  return !!obj.prototype && !!obj.prototype.constructor.name;
};

var DIFF = {
  EVENT_ATTRS: Object.freeze(['onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart', 'ondragstart', 'ondrag', 'ondragenter', 'ondragleave', 'ondragover', 'ondrop', 'ondragend', 'onkeydown', 'onkeypress', 'onkeyup', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onselect', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur', 'oninput', 'oncontextmenu', 'onfocusin', 'onfocusout']),
  NODE_TYPES: Object.freeze({
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8
  }),
  SAME_NODE: Object.freeze(['tagName', 'isSameNode', 'id', 'type'])
};

var NO_OP = function NO_OP() {};
var EditorConfig = Object.freeze({
  onChange: NO_OP,
  onSave: NO_OP,
  onCancel: NO_OP,
  source: undefined,
  confirmActions: true,
  iconType: 'far',
  styles: {},
  root: {
    start: 'closed',
    title: 'Object Tree'
  }
});

var DEF_SETTINGS = Object.freeze({
  types: {
    config: {},
    definitions: {}
  }
});

var Schema = {
  MODES: Object.freeze({
    ADD: 'ADD',
    CUT: 'CUT',
    EDIT: 'EDIT',
    DRAG: 'DRAG',
    REMOVE: 'REMOVE',
    REPLACE: 'REPLACE',
    TEMP: 'TEMP'
  }),
  PROPS_CHECK: Object.freeze(['tree', 'Editor', 'parent', 'instance', 'settings']),
  ROOT: 'source',
  TREE_UPDATE_PROPS: Object.freeze(['key', 'value', 'mode', 'type', 'open', 'matchType', 'error']),
  EMPTY_TYPE: 'EmptyType',
  EMPTY: 'empty',
  TYPE_CLASS_CHECK: Object.freeze(['name', 'priority', 'defaultValue', 'eval'])
};

var NO_OP$1 = function NO_OP() {};
var Values = Object.freeze({
  CLEAVE_CLS: 'item-cleave',
  CUSTOM_EVENTS: Object.freeze({
    onBlur: NO_OP$1,
    onCancel: NO_OP$1,
    onChange: NO_OP$1,
    onClick: NO_OP$1,
    onCopy: NO_OP$1,
    onCut: NO_OP$1,
    onDelete: NO_OP$1,
    onEdit: NO_OP$1,
    onFocus: NO_OP$1,
    onKeyDown: NO_OP$1,
    onKeyUp: NO_OP$1,
    onPaste: NO_OP$1,
    onSave: NO_OP$1
  }),
  DOM_EVENTS: Object.freeze(['onChange', 'onClick', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp']),
  DATA_SCHEMA_KEY: 'data-schema-key',
  DATA_TREE_ID: 'data-tree-id',
  DEFAULT_TYPES: 'definitions',
  EDIT_CLS: 'item-edit',
  JT_ROOT_HEADER_ID: 'jt-root-header',
  LOG_TYPES: Object.freeze(['error', 'dir', 'log', 'warn']),
  MAP_TYPES: 'MAP_TYPES',
  NO_OP: NO_OP$1,
  NUMBER_CLS: 'item-number',
  PASTE_ACTION_CLS: 'item-paste-action',
  PARENT_OVERWRITE: Object.freeze({
    eval: 'function',
    matchHelper: 'function',
    priority: 'number'
  }),
  PRIORITY: 'PRIORITY',
  ROOT_CLASS: 'j-tree-editor',
  SHOW_PASTE_CLS: 'show-paste-action',
  TYPE_OVERWRITE: Object.freeze({
    componentDidMount: 'function',
    componentDidUpdate: 'function',
    onBlur: 'function',
    onCancel: 'function',
    onChange: 'function',
    onClick: 'function',
    onCopy: 'function',
    onCut: 'function',
    onDelete: 'function',
    onEdit: 'function',
    onFocus: 'function',
    onKeyDown: 'function',
    onKeyUp: 'function',
    onPaste: 'function',
    onSave: 'function',
    onToggle: 'function',
    render: 'function'
  }),
  TYPES_CONFIG_OPTS: Object.freeze([
  'expandOnChange',
  'options',
  'keyAttrs',
  'valueAttrs'])
});

var useValues = jsutils.deepFreeze(objectSpread({}, Values));
var updateDefValues = function updateDefValues(update) {
  return useValues = jsutils.deepFreeze(objectSpread({}, useValues, update));
};
var useSchema = jsutils.deepFreeze(objectSpread({}, Schema));
var updateDefSchema = function updateDefSchema(update) {
  return useSchema = jsutils.deepFreeze(objectSpread({}, useSchema, update));
};
var Constants = {
  updateDefSchema: updateDefSchema,
  updateDefValues: updateDefValues
};
Object.defineProperty(Constants, 'Values', {
  get: function get() {
    return useValues;
  },
  enumerable: true
});
Object.defineProperty(Constants, 'Schema', {
  get: function get() {
    return useSchema;
  },
  enumerable: true
});

var validateKeyInArray = function validateKeyInArray(key, parentVal, schema) {
  var invalid;
  var index = parseInt(key);
  if (!isNaN(index)) {
    var parKeys = Object.keys(parentVal);
    invalid = parKeys.indexOf(index) === -1 && parKeys.length !== index;
  } else invalid = true;
  return invalid ? {
    error: "Key '".concat(key, "'' must be a numbered index for Type ").concat(schema.instance.name, "!")
  } : {
    error: false
  };
};
var validateMatchType = function validateMatchType(checkType, TYPE_CACHE) {
  var failedClsProps = Constants.Schema.TYPE_CLASS_CHECK.reduce(function (failedCheck, prop) {
    !checkType.hasOwnProperty(prop) && failedCheck.push(prop);
    return failedCheck;
  }, []);
  if (failedClsProps.length) return jsutils.logData("Could not register type '".concat(checkType.name || 'Type', "'. It's missing these static properties:\n\t").concat(failedClsProps.join('\n\t')), 'error');
  if (TYPE_CACHE && TYPE_CACHE[checkType.name]) return jsutils.logData("Type with name ".concat(checkType.name, " is already registered!"), 'error');
  if (!isConstructor(checkType)) return jsutils.logData("New Types must be a constructor!", 'error');
  return true;
};
var validateBuildTypes = function validateBuildTypes(source, Editor) {
  if (!validateSource(source)) return false;
  if (!jsutils.isObj(Editor.Types) || typeof Editor.Types.get !== 'function') return jsutils.logData("Editor.Types class is required when building the editor types!", 'error');
  return true;
};
var validateSource = function validateSource(source) {
  if (!jsutils.isObj(source)) return jsutils.logData("Could update source. Please make sure source param is an Object or JSON parse-able string", 'error');
  return true;
};
var validateUpdate = function validateUpdate(tree, idOrPos, update, settings) {
  if (!idOrPos) return {
    error: "Update requires an id or position!"
  };
  var pos = tree.idMap[idOrPos] || idOrPos;
  if (!pos || !tree.schema[pos]) return {
    error: "Could not find position ".concat(idOrPos, " in the tree!")
  };
  var schema = tree.schema[pos];
  var isEmptyType = schema.matchType === Constants.Schema.EMPTY;
  if (!schema && !isEmptyType) return {
    error: "Could not find node in tree that matches ".concat(idOrPos, "!")
  };
  if (!jsutils.isObj(update)) ;
  if (update.mode === Constants.Schema.MODES.REMOVE || update.mode === Constants.Schema.MODES.REPLACE) return {
    schema: schema,
    pos: pos
  };
  if (schema.mode === Constants.Schema.MODES.ADD && !update.matchType) return {
    error: "A valid type is required to update the item!"
  };
  var nonValid = Object.keys(update).reduce(function (notValid, prop) {
    if (Constants.Schema.TREE_UPDATE_PROPS.indexOf(prop) == -1) notValid = prop;
    return notValid;
  }, false);
  if (nonValid) return {
    error: "".concat(nonValid, " is not a valid update property")
  };
  return {
    schema: schema,
    pos: pos
  };
};
var validateAdd = function validateAdd(schema, parent) {
  return !jsutils.isObj(schema) ? {
    error: "Add method requires a valid schema object as the first argument"
  } : !jsutils.isObj(parent) || !parent.value || !parent.pos ? {
    error: "Add method requires a valid parent schema"
  } : _typeof_1(parent.value) !== 'object' ? {
    error: "Parent value must equal type 'object' ( Object || Array )"
  } : {
    error: false
  };
};
var validateKey = function validateKey(key, tree, pos, schema) {
  if (!key && key !== 0) return {
    error: "Can not set key to a falsy value!"
  };
  if (!tree.schema[pos]) return {
    error: "Position '".concat(pos, "' does not exist, can not update key!")
  };
  var parentVal = schema.parent.value;
  if (Array.isArray(parentVal)) return validateKeyInArray(key, parentVal, schema);
  var noString = "Invalid key value: ".concat(key, ". Could not convert ").concat(key, " into a string!");
  try {
    return {
      error: typeof key.toString() === 'string' ? false : noString
    };
  } catch (e) {
    return {
      error: noString
    };
  }
};

var getTypeStyles = function getTypeStyles(settings, Type) {
  return Type && Type.hasOwnProperty('getStyles') && settings.styleLoader && settings.styleLoader.add && settings.styleLoader.add(buildStyleId(Type), Type.getStyles(settings));
};
var buildStyleId = function buildStyleId(Type) {
  Type.styleId = "".concat(Type.name.toLowerCase(), "-").concat(jsutils.uuid().split('-').pop());
  return Type.styleId;
};
var initTypeCache = function initTypeCache(TypesCls, settings) {
  var _ref = jsutils.get(settings.types, 'definitions') || {},
      BaseType = _ref.BaseType,
      allTypes = objectWithoutProperties(_ref, ["BaseType"]);
  if (!validateMatchType(BaseType)) return;
  TypesCls.BaseType = new BaseType(jsutils.get(settings.types, 'config.base') || {});
  return buildTypeCache(settings, objectSpread({}, allTypes, {
    BaseType: TypesCls.BaseType
  }));
};
var getExtends = function getExtends(factory) {
  var parent = factory.__proto__ && jsutils.get(factory.__proto__, 'prototype.constructor');
  return parent && {
    name: parent.name,
    base: parent,
    factory: parent.constructor
  };
};
var buildTypeCache = function buildTypeCache(settings, types) {
  var BaseType = types.BaseType,
      allTypes = objectWithoutProperties(types, ["BaseType"]);
  var BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor
  };
  getTypeStyles(settings, BaseType.constructor);
  var builtTypes = Object.entries(allTypes).reduce(function (types, _ref2) {
    var _ref3 = slicedToArray(_ref2, 2),
        name = _ref3[0],
        factory = _ref3[1];
    var useName = buildTypeName(name);
    if (!validateMatchType(factory)) return allTypes;
    types[useName] = {
      name: useName,
      factory: factory,
      "extends": getExtends(factory) || BaseTypeMeta
    };
    getTypeStyles(settings, factory);
    return types;
  }, {});
  Object.defineProperty(builtTypes, Constants.Values.MAP_TYPES, {
    value: function value(cb, parent) {
      return jsutils.mapObj(parent, cb);
    },
    enumerable: false
  });
  return Object.freeze(builtTypes);
};
var buildTypeName = function buildTypeName(typeClsName) {
  return typeClsName.split('Type').join('').toLowerCase();
};
var typesOverride = function typesOverride(typeInstance, config) {
  if (!config) return null;
  Object.entries(Constants.Values.TYPE_OVERWRITE).map(function (_ref4) {
    var _ref5 = slicedToArray(_ref4, 2),
        key = _ref5[0],
        type = _ref5[1];
    return _typeof_1(config[key]) === type && typeInstance[key] !== config[key] && (typeInstance[key] = config[key]);
  });
};

var INSTANCE_CACHE;
var getChildSchema = function getChildSchema(key, value, _ref) {
  var tree = _ref.tree,
      schema = _ref.schema;
  return objectSpread({}, tree.schema[buildInstancePos(key, schema)] || {}, {
    key: key,
    value: value,
    parent: schema
  });
};
var buildChild = function buildChild(childKey, child, props, loopChildren) {
  if (props.schema.open) return loopChildren(getChildSchema(childKey, child, props), props.tree, props.settings);
  var childPos = buildInstancePos(childKey, props.schema);
  var schema = props.tree.schema[childPos];
  if (!schema || !schema.instance || !schema.domNode) return;
  clearSchema(schema, props.tree);
  return undefined;
};
var buildInstancePos = function buildInstancePos(key, parent) {
  return key === Constants.Schema.ROOT ? key : "".concat(parent.pos, ".").concat(key);
};
var clearInstanceCache = function clearInstanceCache() {
  jsutils.clearObj(INSTANCE_CACHE);
  INSTANCE_CACHE = undefined;
};
var clearInstance = function clearInstance(id, instance) {
  instance = instance || INSTANCE_CACHE && INSTANCE_CACHE[id];
  if (!instance) return false;
  jsutils.isFunc(instance.componentWillUnmount) && instance.componentWillUnmount();
  instance.state = undefined;
  instance.setState = undefined;
  jsutils.clearObj(instance);
  id = id || INSTANCE_CACHE && Object.keys(INSTANCE_CACHE)[Object.values(INSTANCE_CACHE).indexOf(instance)];
  if (!id) return false;
  INSTANCE_CACHE[id] && (INSTANCE_CACHE[id] = undefined);
  jsutils.unset(INSTANCE_CACHE, id);
  instance = undefined;
  return true;
};
var buildInstance = function buildInstance(type, schema, settings) {
  var id = schema.id,
      matchType = schema.matchType;
  INSTANCE_CACHE = INSTANCE_CACHE || {};
  if (!INSTANCE_CACHE[id]) {
    var config = jsutils.get(settings.types, "config.".concat(matchType)) || {};
    var editorConfig = settings.Editor.config || {};
    jsutils.mapObj(Constants.Values.CUSTOM_EVENTS, function (key, value) {
      return !config[key] && editorConfig[key] && (config[key] = editorConfig[key]);
    });
    var instance = new type.factory(config, settings.Editor);
    config && typesOverride(instance, config);
    Object.keys(instance).map(function (key) {
      if (!jsutils.isFunc(instance[key])) return;
      var orgMethod = instance[key];
      instance[key] = function () {
        for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
          args[_key] = arguments[_key];
        }
        if (!Constants.Values.CUSTOM_EVENTS[key]) return orgMethod.apply(void 0, args.concat([settings.Editor]));
        var callOrg = false;
        var hasOverride = jsutils.isFunc(editorConfig[key]);
        if (hasOverride) {
          var _settings$Editor$conf;
          if (editorConfig.eventOverride === 'instance') callOrg = true;else if ((_settings$Editor$conf = settings.Editor.config)[key].apply(_settings$Editor$conf, args.concat([settings.Editor])) !== false) callOrg = true;
        }
        if (!hasOverride || callOrg) return orgMethod.apply(void 0, args.concat([settings.Editor]));
      };
    });
    INSTANCE_CACHE[id] = instance;
  }
  var NEW_INSTANCE = true;
  addProp(schema, 'newInstance', {
    get: function get() {
      return NEW_INSTANCE;
    },
    set: function set(update) {
      NEW_INSTANCE = undefined;
      jsutils.unset(schema, 'newInstance');
    },
    enumerable: true,
    configurable: true
  });
  addProp(schema, 'instance', {
    get: function get() {
      return INSTANCE_CACHE[id];
    },
    set: function set(instance) {
      if (!instance) {
        clearInstance(id);
        jsutils.unset(schema, 'instance');
      } else INSTANCE_CACHE[id] = instance;
    },
    enumerable: true,
    configurable: true
  });
  return INSTANCE_CACHE[id];
};
var renderInstance = function renderInstance(key, value, props, loopChildren) {
  var schema = props.schema,
      tree = props.tree,
      settings = props.settings;
  var domNode = jsutils.isObj(value) ? jsutils.checkCall(schema.instance.render, objectSpread({}, props, {
    children: Object.entries(value).map(function (_ref2) {
      var _ref3 = slicedToArray(_ref2, 2),
          childKey = _ref3[0],
          child = _ref3[1];
      return buildChild(childKey, child, props, loopChildren);
    })
  })) : Array.isArray(value) ? jsutils.checkCall(schema.instance.render, objectSpread({}, props, {
    children: value.map(function (child, index) {
      return buildChild(index, child, props, loopChildren);
    })
  })) : jsutils.checkCall(schema.instance.render, props);
  domNode && !domNode.id && (domNode.id = schema.id);
  return domNode;
};
var callInstanceUpdates = function callInstanceUpdates(tree, orgPos) {
  return Object.entries(tree.schema).map(function (_ref4) {
    var _ref5 = slicedToArray(_ref4, 2),
        pos = _ref5[0],
        schema = _ref5[1];
    return (
      !schema.instance || schema.pos.indexOf(orgPos) !== 0 ? null : !schema.newInstance
      ? jsutils.isFunc(schema.instance.componentDidUpdate) && schema.instance.componentDidUpdate({
        tree: tree,
        schema: schema,
        parent: schema.parent
      })
      : (schema.newInstance = false) || jsutils.isFunc(schema.instance.componentDidMount) && schema.instance.componentDidMount({
        tree: tree,
        schema: schema,
        parent: schema.parent
      })
    );
  });
};

var cleanSettingsObj = function cleanSettingsObj(settings) {
  jsutils.clearObj(settings.Editor.config);
  jsutils.clearObj(settings);
};
var clearTypeCache = function clearTypeCache(typeCache) {
  return jsutils.isObj(typeCache) && Object.keys(typeCache).map(function (key) {
    switch (key) {
      case 'children':
        Object.values(typeCache).map(function (child) {
          return clearTypeCache(child);
        });
        break;
      case 'extends':
        Object.keys(typeCache.extends).map(function (key) {
          return jsutils.unset(typeCache.extends, key);
        });
        break;
    }
    jsutils.unset(typeCache, key);
  }).length || (typeCache = undefined);
};
var cleanTreeSchema = function cleanTreeSchema(tree) {
  return Object.keys(tree.schema).map(function (key) {
    return tree.schema[key] && (clearSchema(tree.schema[key], tree) || (tree.schema[key] = undefined));
  });
};
var clearSchema = function clearSchema(schema, tree) {
  var removeInstance = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  if (!schema || !schema.pos || !tree.schema || !tree.schema[schema.pos]) return;
  if (tree.schema && tree.schema[schema.pos] !== schema) {
    return jsutils.logData("Can not clear schema from tree. tree.schema and schema do not match", 'warn');
  }
  var schemaPos = schema.pos;
  removeInstance && clearInstance(schema.id);
  jsutils.unset(tree.idMap, schema.id);
  jsutils.unset(schema, 'domNode');
  jsutils.unset(schema, 'parent');
  jsutils.unset(schema, 'instance');
  jsutils.unset(schema, 'value');
  jsutils.unset(tree.schema, schema.pos);
  jsutils.clearObj(schema);
  jsutils.mapObj(tree.schema, function (pos, schemaItem) {
    pos.indexOf(schemaPos) === 0 && clearSchema(schemaItem, tree);
  });
};
var clearTypeData = function clearTypeData(TypeCls, typeCache) {
  var includeClass = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  clearTypeCache(typeCache);
  jsutils.unset(TypeCls, 'BaseType');
  includeClass && jsutils.clearObj(TypeCls);
};
var cleanUp = function cleanUp(settings, tree) {
  tree.schema && cleanTreeSchema(tree);
  clearInstanceCache();
  cleanSettingsObj(settings);
};

var CONFIRM_ACTION;
var CUSTOM_CONFIRM;
var setConfirm = function setConfirm(confirmAct) {
  jsutils.isFunc(confirmAct) && (CUSTOM_CONFIRM = confirmAct);
  if (confirmAct) CONFIRM_ACTION = true;else {
    CUSTOM_CONFIRM = undefined;
    CONFIRM_ACTION = undefined;
  }
};
var checkConfirm = function checkConfirm() {
  if (!CONFIRM_ACTION) return true;
  for (var _len = arguments.length, params = new Array(_len), _key = 0; _key < _len; _key++) {
    params[_key] = arguments[_key];
  }
  var message = params.pop();
  if (!jsutils.isStr(message)) return true;
  var outcome = jsutils.isFunc(CUSTOM_CONFIRM) ? CUSTOM_CONFIRM.apply(void 0, params) : window.confirm(message);
  return Boolean(outcome);
};

var NODE_TYPES = DIFF.NODE_TYPES,
    EVENT_ATTRS = DIFF.EVENT_ATTRS,
    SAME_NODE = DIFF.SAME_NODE;
var updateOption = function updateOption(newNode, oldNode) {
  return updateAttribute(newNode, oldNode, 'selected');
};
var updateInput = function updateInput(newNode, oldNode) {
  var newValue = newNode.value;
  var oldValue = oldNode.value;
  updateAttribute(newNode, oldNode, 'checked');
  updateAttribute(newNode, oldNode, 'disabled');
  if (newValue !== oldValue) {
    oldNode.setAttribute('value', newValue);
    oldNode.value = newValue;
  }
  if (newValue === 'null') {
    oldNode.value = '';
    oldNode.removeAttribute('value');
  }
  !newNode.hasAttributeNS(null, 'value') ? oldNode.removeAttribute('value') : oldNode.type === 'range' ? oldNode.value = newValue : null;
};
var updateTextarea = function updateTextarea(newNode, oldNode) {
  var newValue = newNode.value;
  if (newValue !== oldNode.value) oldNode.value = newValue;
  if (!oldNode.firstChild || oldNode.firstChild.nodeValue === newValue) return;
  if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) return;
  oldNode.firstChild.nodeValue = newValue;
};
var NODE_NAME_CHECK = {
  INPUT: updateInput,
  OPTION: updateOption,
  TEXTAREA: updateTextarea
};
var updateParent = function updateParent(newNode, oldNode) {
  newNode.nodeType === NODE_TYPES.ELEMENT_NODE && copyAttrs(newNode, oldNode);
  Object.values(NODE_TYPES).indexOf(newNode.nodeType) !== -1 && oldNode.nodeValue !== newNode.nodeValue && (oldNode.nodeValue = newNode.nodeValue);
  NODE_NAME_CHECK[newNode.nodeName] && NODE_NAME_CHECK[newNode.nodeName](newNode, oldNode);
  copyEvents(newNode, oldNode);
  return oldNode;
};
var removeOldAttrs = function removeOldAttrs(newNode, oldNode, oldAttrs) {
  return Object.values(oldAttrs).map(function (attr) {
    if (attr.specified === false) return;
    if (!attr.namespaceURI) return !newNode.hasAttributeNS(null, attr.name) && oldNode.removeAttribute(attr.name);
    attr.name = attr.localName || attr.name;
    !newNode.hasAttributeNS(attr.namespaceURI, attr.name) && oldNode.removeAttributeNS(attr.namespaceURI, attr.name);
  });
};
var addNewAttrs = function addNewAttrs(newNode, oldNode, newAttrs) {
  return Object.values(newAttrs).map(function (attr) {
    if (attr.namespaceURI) {
      attr.name = attr.localName;
      var fromValue = oldNode.getAttributeNS(attr.namespaceURI, attrLocalName || attr.name);
      return fromValue !== attr.value && oldNode.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
    }
    if (!oldNode.hasAttribute(attr.name)) return oldNode.setAttribute(attr.name, attr.value);
    if (oldNode.getAttribute(attr.name) === attr.value) return;
    attr.value === 'null' || attr.value === 'undefined' ? oldNode.removeAttribute(attr.name) : oldNode.setAttribute(attr.name, attr.value);
  });
};
var copyAttrs = function copyAttrs(newNode, oldNode) {
  var oldAttrs = oldNode.attributes;
  var newAttrs = newNode.attributes;
  addNewAttrs(newNode, oldNode, newAttrs);
  removeOldAttrs(newNode, oldNode, oldAttrs);
};
var copyEvents = function copyEvents(newNode, oldNode) {
  return EVENT_ATTRS.map(function (ev) {
    return newNode[ev] && (oldNode[ev] = newNode[ev]) || oldNode[ev] && (oldNode[ev] = undefined);
  });
};
var updateAttribute = function updateAttribute(newNode, oldNode, name) {
  if (newNode[name] === oldNode[name]) return;
  oldNode[name] = newNode[name];
  newNode[name] ? oldNode.setAttribute(name, '') : oldNode.removeAttribute(name);
};
var same = function same(a, b) {
  return SAME_NODE.reduce(function (isSame, key) {
    return isSame ? isSame : typeof a[key] === 'function' ? a.isSameNode(b) : a.type === NODE_TYPES.TEXT_NODE ? a.nodeValue === b.nodeValue : a[key] === b[key];
  }, false);
};
var updateChildren = function updateChildren(newNode, oldNode) {
  var oldChild;
  var newChild;
  var morphed;
  var offset = 0;
  for (var i = 0;; i++) {
    oldChild = oldNode.childNodes[i];
    newChild = newNode.childNodes[i - offset];
    if (!oldChild && !newChild) break;
    if (!newChild && oldNode.removeChild(oldChild) && i-- > -1) continue;
    if (!oldChild && oldNode.appendChild(newChild) && offset++ > -1) continue;
    if (same(newChild, oldChild)) {
      morphed = runNodeDiff(newChild, oldChild);
      morphed !== oldChild && oldNode.replaceChild(morphed, oldChild) && offset++;
      continue;
    }
    var oldMatch = null;
    for (var j = i; j < oldNode.childNodes.length; j++) {
      if (!same(oldNode.childNodes[j], newChild)) continue;
      oldMatch = oldNode.childNodes[j];
      break;
    }
    if (oldMatch) {
      morphed = runNodeDiff(newChild, oldMatch);
      if (morphed !== oldMatch) offset++;
      oldNode.insertBefore(morphed, oldChild);
      continue;
    }
    if (!newChild.id && !oldChild.id) {
      morphed = runNodeDiff(newChild, oldChild);
      morphed !== oldChild && oldNode.replaceChild(morphed, oldChild) && offset++;
      continue;
    }
    oldNode.insertBefore(newChild, oldChild) && offset++;
  }
};
var runNodeDiff = function runNodeDiff(newNode, oldNode) {
  if (!oldNode) return newNode;else if (!newNode) return null;else if (newNode.isSameNode && newNode.isSameNode(oldNode)) return oldNode;else if (newNode.tagName !== oldNode.tagName) return newNode;
  updateParent(newNode, oldNode);
  updateChildren(newNode, oldNode);
  return oldNode;
};
var diffUpdate = function diffUpdate(newNode, oldNode) {
  var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  return options.childrenOnly ? updateChildren(newNode, oldNode) || oldNode : runNodeDiff(newNode, oldNode);
};

var getElement = function getElement(selector) {
  if (selector instanceof HTMLElement) return selector;
  if (!selector || typeof selector !== 'string') return null;
  var selectorType = 'querySelector';
  if (selector.indexOf('#') === 0) {
    selectorType = 'getElementById';
    selector = selector.substr(1, selector.length);
  }
  return document[selectorType](selector);
};
var removeElement = function removeElement(selector) {
  var element = getElement(selector);
  if (!element) return;
  element.remove ? element.remove() : element.parentNode ? element.parentNode.removeChild(element) : jsutils.logData("Could remove element from dom tree. No method exists", element, 'warn');
};
var upsertElement = function upsertElement(element, parentSelector) {
  if (Boolean(element instanceof HTMLElement) === false) return jsutils.logData("upsertElement method requires an HTML element as it's first argument", element, parent, 'warn');
  var parent = getElement(parentSelector);
  if (!parent) return jsutils.logData("Could not add element to the dom tree. The parent element does not exists", element, parent, 'warn');
  var replaceEl = document.getElementById(element.id);
  if (replaceEl) return diffUpdate(element, replaceEl);
  return parent && parent.appendChild(element);
};

var setHighestPriority = function setHighestPriority(matches, priority) {
  if (!matches.highest || matches.highest <= priority) {
    matches.highest = priority;
    return true;
  }
  return false;
};
var getMatchTypes = function getMatchTypes(TYPE_CACHE, value, parent, settings) {
  var _this = this;
  var matches = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : {};
  TYPE_CACHE[Constants.Values.MAP_TYPES](function (name, meta) {
    var factory = meta.factory;
    var priority = factory.priority || _this.BaseType.constructor.priority;
    try {
      if (!factory || !factory.eval || !factory.eval(value)) return;
    } catch (e) {
      return;
    }
    setHighestPriority(matches, priority);
    matches[priority] = matches[priority] || {};
    matches[priority][name] = meta;
  }, parent || TYPE_CACHE);
  return matches;
};
var callMatchHelper = function callMatchHelper(params, BaseType) {
  var baseMatchHelper = BaseType.constructor.matchHelper;
  if (!params.matchTypes) return jsutils.checkCall(baseMatchHelper, params);
  var parentFacts = [];
  var helperMethod;
  Object.entries(params.matchTypes).map(function (_ref) {
    var _ref2 = slicedToArray(_ref, 2),
        typeName = _ref2[0],
        meta = _ref2[1];
    if (!meta || !meta.factory || helperMethod) return;
    var matchHelper = meta.extends.factory.matchHelper;
    if (!matchHelper) return;
    if (matchHelper && parentFacts.indexOf(matchHelper) !== -1) helperMethod = meta.extends.factory.matchHelper;
    else if (matchHelper) parentFacts.push(matchHelper);
  });
  helperMethod = helperMethod || baseMatchHelper;
  return jsutils.checkCall(baseMatchHelper, params);
};
var checkMultiMatches = function checkMultiMatches(matchTypes, schema, tree, settings) {
  var hasMatches = jsutils.isObj(matchTypes);
  var matchKeys = hasMatches && Object.keys(matchTypes) || [];
  if (!matchKeys.length) hasMatches = false;
  var BaseType = settings.Editor.Types.BaseType,
      Editor = settings.Editor;
  var helperParams = {
    schema: schema,
    tree: tree,
    Editor: Editor
  };
  if (!hasMatches) return callMatchHelper(helperParams, BaseType);
  else if (matchKeys.length === 1) return matchTypes[matchKeys[0]];
  helperParams.matchTypes = matchTypes;
  return callMatchHelper(helperParams, BaseType);
};

var addSchemaComponent = function addSchemaComponent(schema, id) {
  return addProp(schema, 'domNode', {
    get: function get() {
      return document.getElementById(id);
    },
    set: function set(_id) {
      if (_id && _id !== id) id = _id;
    },
    enumerable: true,
    configurable: true
  });
};
var buildSchema = function buildSchema(curSchema, type, settings) {
  var schema = objectSpread({}, curSchema, {
    pos: buildInstancePos(curSchema.key, curSchema.parent),
    id: curSchema.id || jsutils.uuid(),
    keyType: curSchema.parent && Array.isArray(curSchema.parent.value) ? 'number' : 'text',
    matchType: curSchema.matchType || buildTypeName(type.name || type.factory.name)
  });
  !schema.instance && buildInstance(type, schema, settings);
  return schema;
};
var loopSource = function loopSource(curSchema, tree, settings, elementCb) {
  var value = curSchema.value,
      key = curSchema.key,
      parent = curSchema.parent,
      pos = curSchema.pos,
      pending = curSchema.pending,
      mode = curSchema.mode;
  var Types = settings.Editor.Types;
  var isRoot = key === Constants.Schema.ROOT;
  var cutMode = mode === Constants.Schema.MODES.CUT;
  var matchTypes = !cutMode && !pending && Types.getValueTypes(value, settings);
  var type = pending ? !cutMode && Types.get(curSchema.matchType) : !cutMode && checkMultiMatches(matchTypes, curSchema, tree, settings);
  if (cutMode || !type || !type.factory || !isConstructor(type.factory)) {
    if (cutMode) {
      curSchema.domNode = undefined;
      curSchema.parent = undefined;
      curSchema.id = undefined;
    }
    return isRoot ? tree : null;
  }
  var schema = buildSchema(curSchema, type, settings);
  !isRoot ? schema.parent = parent : schema.isRoot = true;
  tree.schema[schema.pos] = schema;
  var props = {
    schema: schema,
    tree: tree,
    settings: settings
  };
  var shouldUpdate = jsutils.checkCall(schema.instance.shouldComponentUpdate, curSchema, props);
  if (shouldUpdate === false) {
    schema.instance = undefined;
    tree.idMap[schema.id] = schema.pos;
    props = undefined;
    return '';
  }
  if (isRoot && !curSchema.id) {
    props.schema.open = jsutils.get(settings, 'Editor.config.root.start') === 'open';
    props.schema.keyText = jsutils.get(settings, 'Editor.config.root.title', schema.key);
  }
  var domNode = renderInstance(key, value, props, loopSource);
  domNode && domNode.id && addSchemaComponent(schema, domNode.id);
  tree.idMap[domNode && domNode.id || schema.id] = schema.pos;
  if (!isRoot) return (props = undefined) || domNode;
  elementCb && jsutils.checkCall(elementCb, settings.Editor, domNode, settings.Editor.config.appendTree, tree);
  domNode = undefined;
  props = undefined;
  return tree;
};
var appendTreeHelper = function appendTreeHelper(jtree, rootComp, appendTree, tree) {
  var res = jsutils.checkCall(appendTree, rootComp, jtree, tree);
  if (res === false || !jtree.element) return null;
  upsertElement(rootComp, jtree.element);
  var pos = tree.idMap[rootComp.id];
  callInstanceUpdates(tree, pos);
};
var buildFromPos = function buildFromPos(jtree, pos, settings) {
  if (!jsutils.isStr(pos) || !jtree.tree.schema[pos]) return logData("Rebuild was called, but ".concat(pos, " does not exist it the tree"), jtree.tree, pos, 'warn');
  var renderSchema = jtree.tree.schema[pos];
  var updatedEl = loopSource(renderSchema, jtree.tree, settings, appendTreeHelper);
  if (updatedEl === null) {
    var domNode = renderSchema.domNode;
    return domNode && removeElement(domNode, domNode.parentNode);
  }
  if (pos === Constants.Schema.ROOT || Boolean(updatedEl instanceof HTMLElement) === false) return;
  upsertElement(updatedEl, renderSchema.domNode);
  callInstanceUpdates(jtree.tree, renderSchema.pos);
};

var checkEmptyType = function checkEmptyType(newType, schema) {
  var allowEmptyValue = newType.factory.allowEmptyValue;
  if (allowEmptyValue === undefined) return false;
  if (schema.value === allowEmptyValue) return true;
  var valIsObj = _typeof_1(schema.value) === 'object';
  var valIsEmptyObj = valIsObj && Object.keys(schema.value).length === 0;
  if (allowEmptyValue === true) return valIsObj ? valIsEmptyObj : schema.value === 0 || schema.value === '';
  var allowType = _typeof_1(allowEmptyValue);
  var allowIsObj = allowType === 'object';
  var allowArr = allowIsObj && Array.isArray(allowEmptyValue);
  if (allowArr) return allowEmptyValue.reduce(function (hasEmpty, allowedEmpty) {
    return hasEmpty ? hasEmpty : allowIsObj && valIsEmptyObj || schema.value === allowedEmpty;
  });
  return allowIsObj && _typeof_1(valIsEmptyObj);
};
var buildNewPos = function buildNewPos(pos, key) {
  var replace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var splitPos = pos.split('.');
  replace ? splitPos[splitPos.length - 1] = key : splitPos.push(key);
  return splitPos.join('.');
};
var checkSchemaPos = function checkSchemaPos(tree, pos, checkExists) {
  return checkExists ? !tree.schema[pos] ? jsutils.logData("Cannot update schema in tree. Schema does not exist!", pos, tree.schema[pos], 'error') : true : tree.schema[pos] ? jsutils.logData("Cannot add child to tree. Schema pos already exists!", pos, tree.schema[pos], 'error') : true;
};
var updateSchemaError = function updateSchemaError(tree, schema, settings, prop, value, message) {
  schema.error = jsutils.checkCall(schema.instance.constructor.error, {
    prop: prop,
    value: value,
    message: message,
    schema: schema,
    tree: tree,
    settings: settings
  });
};
var updateSchema = function updateSchema(update, schema) {
  return jsutils.isObj(update) && jsutils.isObj(schema) && Object.entries(update).reduce(function (updated, _ref) {
    var _ref2 = slicedToArray(_ref, 2),
        key = _ref2[0],
        value = _ref2[1];
    if (key === 'type') key = 'matchType';
    updated[key] = value;
    return updated;
  }, schema);
};
var updateType = function updateType(tree, pos, schema, settings) {
  if (!pos || !jsutils.isObj(schema)) return {
    error: "The pos and schema are required to update schema type"
  };
  if (!checkSchemaPos(tree, pos, true)) return;
  clearInstance(schema.id);
  jsutils.unset(schema, 'instance');
  var newType = settings.Editor.Types.get(schema.matchType);
  if (!newType) return {
    error: "Type '".concat(schema.matchType, "' in not a configured type")
  };
  var hasValue = schema.value || schema.value === 0 || schema.value === '';
  if (!hasValue && jsutils.isFunc(newType.factory.defaultValue)) schema.value = newType.factory.defaultValue(schema, settings);
  hasValue = schema.value || schema.value === 0 || schema.value === '';
  var hasEmpty = checkEmptyType(newType, schema);
  if (hasValue && !hasEmpty && !newType.factory.eval(schema.value)) return {
    error: "'Not a valid value for ".concat((newType.factory.name || '').replace('Type', ''))
  };
  if (hasValue && !schema.error) jsutils.set(tree, schema.pos, schema.value);
  tree.schema[pos] = objectSpread({}, schema, {
    pending: true,
    instance: buildInstance(newType, schema, settings),
    mode: Constants.Schema.MODES.EDIT
  });
};
var updateValue = function updateValue(tree, pos, schema, settings) {
  var factory = tree.schema[pos].instance.constructor;
  if ('value' in schema && !factory.eval(schema.value)) return {
    error: "Not a valid value for ".concat((factory.name || '').replace('Type', ''))
  };
  jsutils.set(tree, pos, schema.value);
  jsutils.set(tree.schema[pos], 'value', schema.value);
};
var updateKey = function updateKey(tree, pos, schema, settings) {
  if (!schema.key) return {
    error: "Can not set key to a falsy value!"
  };
  var currentVal = jsutils.get(tree, pos);
  var updatedPos = buildNewPos(pos, schema.key);
  if (updatedPos === pos) return;
  if (tree.schema[updatedPos]) return {
    error: "Can not update key ".concat(schema.key, ", because it already exists!")
  };
  var unsetContent = jsutils.unset(tree, pos);
  if (!unsetContent) return {
    error: "Could not update key, because ".concat(pos, " could not be removed!")
  };
  jsutils.set(tree, updatedPos, currentVal);
  tree.schema[updatedPos] = objectSpread({}, tree.schema[pos], schema, {
    value: currentVal,
    pos: updatedPos
  });
  schema.pos = updatedPos;
  clearSchema(tree.schema[pos], tree, false);
  return {
    pos: updatedPos
  };
};
var updateSchemaProp = function updateSchemaProp(tree, pos, schema, settings, prop) {
  if (prop in schema) tree.schema[pos][prop] = schema[prop];
};
var addChildSchema = function addChildSchema(tree, schema, parent) {
  if (!tree || !jsutils.isObj(schema) || !jsutils.isObj(parent)) return;
  var parentVal = jsutils.get(tree, parent.pos);
  if (!parentVal || _typeof_1(parentVal) !== 'object') return;
  schema.id = schema.id || jsutils.uuid();
  if (tree.idMap[schema.id]) return jsutils.logData("Can not add child to tree. Schema id already exists!", schema.id, tree.schema[tree.idMap[schema.id]], 'error');
  schema.key = schema.key || schema.id;
  schema.parent = parent;
  if (Array.isArray(parentVal)) {
    schema.pos = buildNewPos(parent.pos, parentVal.length, false);
    if (!checkSchemaPos(tree, schema.pos)) return;
    parentVal.push(schema.value);
  } else {
    schema.pos = schema.pos || buildNewPos(parent.pos, schema.key, false);
    if (!checkSchemaPos(tree, schema.pos)) return;
    parentVal[schema.key] = schema.value;
  }
  tree.idMap[schema.id] = schema.pos;
  tree.schema[schema.pos] = schema;
  return true;
};
var addRemoveSchema = function addRemoveSchema(add, remove, tree) {
  if (!tree) return null;
  if (remove && remove.pos) clearSchema(remove, tree, add && remove.instance !== add.instance);
  if (add) {
    if (!add.pos) return {
      error: "Can not add to schema, position is required!",
      key: 'pos'
    };else if (!add.id) return {
      error: "Can not add to schema, id is required!",
      key: 'id'
    };
    add.value && jsutils.set(tree, add.pos, add.value);
    add.id && (tree.idMap[add.id] = add.pos);
    tree.schema[add.pos] = add;
  }
};

var styleloader_min = createCommonjsModule(function (module, exports) {
(function webpackUniversalModuleDefinition(root, factory) {
	module.exports = factory();
})((typeof self !== 'undefined' ? self : commonjsGlobal), function() {
return  (function(modules) {
 	var installedModules = {};
 	function __webpack_require__(moduleId) {
 		if(installedModules[moduleId]) {
 			return installedModules[moduleId].exports;
 		}
 		var module = installedModules[moduleId] = {
 			i: moduleId,
 			l: false,
 			exports: {}
 		};
 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
 		module.l = true;
 		return module.exports;
 	}
 	__webpack_require__.m = modules;
 	__webpack_require__.c = installedModules;
 	__webpack_require__.d = function(exports, name, getter) {
 		if(!__webpack_require__.o(exports, name)) {
 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
 		}
 	};
 	__webpack_require__.r = function(exports) {
 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
 		}
 		Object.defineProperty(exports, '__esModule', { value: true });
 	};
 	__webpack_require__.t = function(value, mode) {
 		if(mode & 1) value = __webpack_require__(value);
 		if(mode & 8) return value;
 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
 		var ns = Object.create(null);
 		__webpack_require__.r(ns);
 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
 		return ns;
 	};
 	__webpack_require__.n = function(module) {
 		var getter = module && module.__esModule ?
 			function getDefault() { return module['default']; } :
 			function getModuleExports() { return module; };
 		__webpack_require__.d(getter, 'a', getter);
 		return getter;
 	};
 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
 	__webpack_require__.p = "";
 	return __webpack_require__(__webpack_require__.s = "./src/loader.js");
 })
 ({
 "./src/loader.js":
/*!***********************!*\
  !*** ./src/loader.js ***!
  \***********************/
/*! exports provided: default */
 (function(module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
 __webpack_require__.d(__webpack_exports__, "default", function() { return StylesLoader; });
 var _properties__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./properties */ "./src/properties.js");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }
function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }
function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }
function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }
function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }
var deepMerge = function deepMerge() {
  for (var _len = arguments.length, sources = new Array(_len), _key = 0; _key < _len; _key++) {
    sources[_key] = arguments[_key];
  }
  return sources.reduce(function (merged, source) {
    return source instanceof Array ? [].concat(_toConsumableArray(merged instanceof Array && merged || []), _toConsumableArray(source)) : source instanceof Object ? Object.entries(source).reduce(function (joined, _ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];
      return _objectSpread({}, joined, _defineProperty({}, key, value instanceof Object && key in joined && deepMerge(joined[key], value) || value));
    }, merged) : merged;
  }, {});
};
var createBlock = function createBlock(selector, rls) {
  var subSelect = [];
  var filteredRls = Object.keys(rls).reduce(function (filtered, key) {
    if (_typeof(rls[key]) !== 'object') filtered[key] = rls[key];else subSelect.push(["".concat(selector, " ").concat(key), rls[key]]);
    return filtered;
  }, {});
  var styRls = createRules(filteredRls);
  var block = "".concat(selector, " {").concat(styRls, "\n}\n");
  subSelect.length && subSelect.map(function (subItem) {
    return block += createBlock(subItem[0], subItem[1]);
  });
  return block;
};
var createRules = function createRules(rule) {
  return Object.entries(rule).reduce(function (ruleString, _ref3) {
    var _ref4 = _slicedToArray(_ref3, 2),
        propName = _ref4[0],
        propValue = _ref4[1];
    var name = propName.replace(/([A-Z])/g, function (matches) {
      return "-".concat(matches[0].toLowerCase());
    });
    var hasUnits = !_properties__WEBPACK_IMPORTED_MODULE_0__["default"].noUnits[propName];
    var val = hasUnits && typeof propValue === 'number' && propValue + 'px' || propValue;
    return "".concat(ruleString, "\n\t").concat(name, ": ").concat(val, ";");
  }, '');
};
var StylesLoader = function StylesLoader() {
  var _this = this;
  _classCallCheck(this, StylesLoader);
  _defineProperty(this, "add", function (id, styleObj, overwrite) {
    return _this.set(id, _this.build(styleObj), overwrite);
  });
  _defineProperty(this, "get", function (id) {
    _this.sheetCache = _this.sheetCache || {};
    if (_this.sheetCache[id]) return _this.sheetCache[id];
    var newSheet = document.createElement('style');
    newSheet.id = id;
    _this.sheetCache[id] = newSheet;
    document.head.appendChild(_this.sheetCache[id]);
    return _this.sheetCache[id];
  });
  _defineProperty(this, "set", function (id, styleStr) {
    var overwrite = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
    _this.sheetCache = _this.sheetCache || {};
    if (_this.sheetCache[id] && overwrite === false) return null;
    var styleEl = _this.get(id);
    if (!styleEl) return null;
    if (styleEl.styleSheet) styleEl.styleSheet.cssText = styleStr;else styleEl.innerHTML = styleStr;
  });
  _defineProperty(this, "build", function () {
    return Object.entries(deepMerge.apply(void 0, arguments)).reduce(function (styles, _ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          selector = _ref6[0],
          rls = _ref6[1];
      return styles + createBlock(selector, rls);
    }, '');
  });
  _defineProperty(this, "destroy", function () {
    return _this.sheetCache = Object.keys(_this.sheetCache).reduce(function (cache, key) {
      return _this.remove(key) && cache;
    }, {});
  });
  _defineProperty(this, "remove", function (id) {
    try {
      _this.sheetCache[id] && document.head.removeChild(_this.sheetCache[id]);
    } catch (e) {
      _this.sheetCache[id] && _this.sheetCache[id].parentNode.removeChild(_this.sheetCache[id]);
    }
    _this.sheetCache[id] = undefined;
    return true;
  });
};
 }),
 "./src/properties.js":
/*!***************************!*\
  !*** ./src/properties.js ***!
  \***************************/
/*! exports provided: default */
 (function(module, __webpack_exports__, __webpack_require__) {
__webpack_require__.r(__webpack_exports__);
 __webpack_exports__["default"] = ({
  noUnits: {
    animationIterationCount: true,
    borderImageOutset: true,
    borderImageSlice: true,
    borderImageWidth: true,
    boxFlex: true,
    boxFlexGroup: true,
    boxOrdinalGroup: true,
    columnCount: true,
    columns: true,
    flex: true,
    flexGrow: true,
    flexPositive: true,
    flexShrink: true,
    flexNegative: true,
    flexOrder: true,
    gridRow: true,
    gridRowEnd: true,
    gridRowSpan: true,
    gridRowStart: true,
    gridColumn: true,
    gridColumnEnd: true,
    gridColumnSpan: true,
    gridColumnStart: true,
    fontWeight: true,
    lineClamp: true,
    lineHeight: true,
    opacity: true,
    order: true,
    orphans: true,
    tabSize: true,
    widows: true,
    zIndex: true,
    zoom: true,
    fillOpacity: true,
    floodOpacity: true,
    stopOpacity: true,
    strokeDasharray: true,
    strokeDashoffset: true,
    strokeMiterlimit: true,
    strokeOpacity: true,
    strokeWidth: true
  }
});
 })
 });
});
});
var StyleLoader = unwrapExports(styleloader_min);

var STYLE_LOADER;
var TYPE_CACHE;
var FLAT_TYPES;
var buildTypes = function buildTypes(source, settings, elementCb) {
  var _tree;
  if (!validateBuildTypes(source, settings.Editor)) return null;
  var tree = (_tree = {
    schema: {}
  }, defineProperty(_tree, Constants.Schema.ROOT, source), defineProperty(_tree, "idMap", {}), _tree);
  var rootSchema = {
    value: source,
    key: Constants.Schema.ROOT
  };
  return loopSource(rootSchema, tree, settings, elementCb);
};
function TypesCls(settings) {
  var Types = function Types() {
    var _this = this;
    classCallCheck(this, Types);
    defineProperty(this, "get", function (name) {
      return !name && TYPE_CACHE || TYPE_CACHE[name];
    });
    defineProperty(this, "clear", function () {
      var includeClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : true;
      clearTypeData(_this, TYPE_CACHE, includeClass);
      TYPE_CACHE = undefined;
      jsutils.mapObj(FLAT_TYPES, function (key) {
        return jsutils.unset(FLAT_TYPES[key]);
      });
      FLAT_TYPES = undefined;
    });
    defineProperty(this, "register", function (newType) {
      if (!validateMatchType(newType, TYPE_CACHE)) return null;
    });
    defineProperty(this, "rebuild", function () {
      _this.clear(false);
      TYPE_CACHE = initTypeCache(_this, settings);
    });
    defineProperty(this, "getValueTypes", function (value) {
      var matchTypes = getMatchTypes.apply(_this, [TYPE_CACHE, value, TYPE_CACHE, settings, {}]);
      if (matchTypes.highest && matchTypes[matchTypes.highest]) return matchTypes[matchTypes.highest];
      var firstKey = jsutils.isObj(matchTypes) && Object.keys(matchTypes)[0];
      return firstKey && matchTypes[firstKey];
    });
    defineProperty(this, "destroy", function (Editor) {
      _this.clear();
      STYLE_LOADER.destroy();
    });
    if (!settings.types || !settings.types.definitions) return jsutils.logData("No types found as 'settings.types.definitions'", 'error');
    STYLE_LOADER = new StyleLoader();
    settings.styleLoader = STYLE_LOADER;
    TYPE_CACHE = initTypeCache(this, settings);
  };
  return new Types();
}

var UPDATE_ACTIONS = {
  matchType: updateType,
  value: updateValue,
  open: updateSchemaProp,
  mode: updateSchemaProp,
  error: updateSchemaProp
};
var ACT_SOURCE;
var TEMP;
var handelUpdateError = function handelUpdateError(jTree, pos, settings, prop, value, message) {
  if (!pos || !jTree.tree.schema[pos]) return jsutils.logData("Could not find ".concat(pos, " in the tree!"));
  updateSchemaError(jTree.tree, jTree.tree.schema[pos], settings, prop, value, message);
  buildFromPos(jTree, pos, settings);
};
var doKeyUpdate = function doKeyUpdate(jTree, update, pos, schema, settings) {
  var valid = validateKey(update.key, jTree.tree, pos, schema);
  if (!valid || valid.error) return handelUpdateError(jTree, pos, settings, 'key', update.key, valid.error);
  var updated = updateKey(jTree.tree, pos, schema);
  if (!updated || updated.error) return handelUpdateError(jTree, pos, settings, 'key', update.key, updated.error);
  return updated.pos;
};
var doUpdateData = function doUpdateData(jTree, update, pos, schema, settings) {
  var invalid;
  Constants.Schema.TREE_UPDATE_PROPS.map(function (prop) {
    if (invalid) return;
    invalid = prop in update && jsutils.checkCall(UPDATE_ACTIONS[prop], jTree.tree, pos, schema, settings, prop);
    if (!invalid) return;
    invalid.prop = prop;
    invalid.value = update[prop];
  });
  if (invalid && invalid.error) return handelUpdateError(jTree, pos, settings, invalid.prop, invalid.value, invalid.error);
  return true;
};
var addTempProp = function addTempProp(jTree) {
  var TEMP_ID = false;
  addProp(jTree, 'temp', {
    get: function get() {
      return objectSpread({}, TEMP_ID && jTree.schema(TEMP_ID) || {}, {
        mode: Constants.Schema.MODES.TEMP
      });
    },
    set: function set(id) {
      TEMP_ID = id;
    },
    enumerable: true,
    configurable: true
  });
  jTree.hasTemp = function () {
    return Boolean(TEMP_ID);
  };
};
var NO_CONFIRM_KEYS = ['open', 'matchType'];
var NO_CONFIRM_MODES = ['edit'];
var shouldShowConfirm = function shouldShowConfirm(update) {
  var updateKeys = Object.keys(update);
  if (updateKeys.length !== 1) return true;
  if (update.mode && NO_CONFIRM_MODES.indexOf(update.mode.toLowerCase()) !== -1) return false;
  if (NO_CONFIRM_KEYS.indexOf(updateKeys[0]) !== -1) return false;
};
var createEditor = function () {
  var _ref = asyncToGenerator( regenerator.mark(function _callee(settings, editorConfig, domContainer) {
    var jTree, buildJTree, jTreeEditor;
    return regenerator.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            jTree = function jTree() {
              var _this = this;
              classCallCheck(this, jTree);
              defineProperty(this, "buildTypes", function (source) {
                if (source && source !== ACT_SOURCE) return _this.setSource(source);
                if (!jsutils.isObj(ACT_SOURCE)) return jsutils.logData("Could build types, source data is invalid!", ACT_SOURCE, 'warn');
                if (jsutils.isObj(ACT_SOURCE)) _this.tree = buildTypes(ACT_SOURCE, settings, appendTreeHelper);
                return _this;
              });
              defineProperty(this, "setSource", function (source, update) {
                if (typeof source === 'string') source = jsutils.parseJSON(source);
                if (!validateSource(source)) return undefined;
                ACT_SOURCE = jsutils.deepClone(source);
                return update && _this.buildTypes();
              });
              defineProperty(this, "forceUpdate", function (pos) {
                pos && buildFromPos(_this, pos, settings);
              });
              defineProperty(this, "update", function (idOrPos, update) {
                var pos = _this.tree.idMap[idOrPos] || idOrPos;
                var validData = validateUpdate(_this.tree, idOrPos, update);
                if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(_this, pos, settings, 'update', update, validData.error);
                pos = validData.pos || pos;
                if (shouldShowConfirm(update) && !checkConfirm(validData.schema, pos, update, "".concat(update.mode && jsutils.capitalize(update.mode) || 'Update', " node at ").concat(pos, "?"))) return;
                validData.schema.error && jsutils.unset(validData.schema, 'error');
                var schema = updateSchema(update, objectSpread({}, validData.schema));
                if ('key' in update) {
                  var updatedPos = doKeyUpdate(_this, update, pos, schema, settings);
                  if (!updatedPos) return;
                  pos = updatedPos;
                }
                _this.tree.schema[pos].pending && !update.matchType && jsutils.unset(_this.tree.schema[pos], 'pending');
                if (!doUpdateData(_this, update, pos, schema, settings)) return;
                if (TEMP && TEMP.id === schema.id) TEMP = undefined;
                schema = undefined;
                validData.schema = undefined;
                buildFromPos(_this, pos, settings);
              });
              defineProperty(this, "replaceAtPos", function (idOrPos, replace) {
                var validData = validateUpdate(_this.tree, idOrPos, {
                  mode: Constants.Schema.MODES.REPLACE
                });
                if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(_this, _this.tree.idMap[idOrPos] || idOrPos, settings, 'replace', null, validData.error);
                var pos = validData.pos,
                    schema = validData.schema;
                if (!checkConfirm(schema, pos, replace, "Replace ".concat(schema.pos, "?"))) return;
                replace.pos = schema.pos;
                replace.key = schema.key;
                replace.parent = schema.parent;
                replace.id = schema.id;
                addSchemaComponent(replace, replace.id);
                if (replace.mode === Constants.Schema.MODES.REPLACE || replace.mode === Constants.Schema.MODES.TEMP) jsutils.unset(replace, 'mode');
                schema.instance !== replace.instance && jsutils.unset(replace, 'instance');
                replace.value = jsutils.deepClone(replace.value);
                var invalid = addRemoveSchema(replace, schema, _this.tree);
                if (invalid && invalid.error) return handelUpdateError(jTree, pos, settings, invalid.key, replace[invalid.key], invalid.error);
                replace.parent && replace.parent.pos && buildFromPos(_this, replace.parent && replace.parent.pos, settings);
              });
              defineProperty(this, "remove", function (idOrPos) {
                var validData = validateUpdate(_this.tree, idOrPos, {
                  mode: Constants.Schema.MODES.REMOVE
                });
                if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(_this, _this.tree.idMap[idOrPos] || idOrPos, settings, 'remove', null, validData.error);
                var pos = validData.pos,
                    schema = validData.schema;
                if (!checkConfirm(schema, pos, "Remove ".concat(pos, "?"))) return;
                jsutils.unset(_this.tree, pos);
                jsutils.unset(_this.tree.idMap, schema.id);
                Array.isArray(schema.parent.value) && schema.parent.value.splice(pos.split('.').pop(), 1);
                var domNode = schema.domNode;
                removeElement(domNode, domNode.parentNode);
                var parentPos = schema.parent.pos;
                clearSchema(schema, _this.tree);
                buildFromPos(_this, parentPos, settings);
              });
              defineProperty(this, "add", function (schema, parent) {
                var useParent = schema.parent || parent || _this.tree.schema;
                var isValid = validateAdd(schema, useParent);
                if (!isValid || isValid.error) return jsutils.logData(isValid.error, schema, parent, _this.tree, 'warn');
                if (schema.matchType !== Constants.Schema.EMPTY && !checkConfirm(schema, useParent.pos, "Add to parent ".concat(useParent.pos, "?"))) return;
                if (!addChildSchema(_this.tree, schema, useParent)) return;
                buildFromPos(_this, useParent.pos, settings);
              });
              defineProperty(this, "schema", function (idOrPos) {
                return jsutils.get(_this, ['tree', 'schema', jsutils.get(_this, "tree.idMap.".concat(idOrPos), idOrPos)]);
              });
              defineProperty(this, "destroy", function () {
                ACT_SOURCE = undefined;
                var rootNode = _this.tree.schema[Constants.Schema.ROOT].domNode;
                jsutils.clearObj(_this.tree[Constants.Schema.ROOT]);
                jsutils.clearObj(_this.tree.idMap);
                jsutils.clearObj(_this.config);
                _this.Types.destroy(_this);
                jsutils.unset(_this, 'Types');
                jsutils.unset(_this, 'element');
                cleanUp(settings, _this.tree);
                jsutils.clearObj(_this);
                if (!rootNode || !rootNode.parentNode) return;
                rootNode.parentNode.classList && rootNode.parentNode.classList.remove(Constants.Values.ROOT_CLASS);
                removeElement(rootNode, rootNode.parentNode);
              });
              this.Types = TypesCls(settings);
              if (!this.Types) return jsutils.logData("Could not load types for editor!", 'error');
              this.element = domContainer;
              this.element.classList.add(Constants.Values.ROOT_CLASS);
              var _source = editorConfig.source,
                  config = objectWithoutProperties(editorConfig, ["source"]);
              this.config = config;
              settings.Editor = this;
              !config.noTemp && addTempProp(this);
              return _source && this.setSource(_source, true);
            };
            buildJTree = function buildJTree() {
              return new jTree();
            };
            _context.next = 4;
            return buildJTree();
          case 4:
            jTreeEditor = _context.sent;
            return _context.abrupt("return", jTreeEditor);
          case 6:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));
  return function createEditor(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
var init = function () {
  var _ref2 = asyncToGenerator( regenerator.mark(function _callee2(opts) {
    var domContainer, element, showLogs, editor, options, settings, editorConfig, builtEditor;
    return regenerator.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (opts.showLogs) jsutils.setLogs(true);
            domContainer = getElement(opts.element);
            if (domContainer) {
              _context2.next = 4;
              break;
            }
            return _context2.abrupt("return", jsutils.logData("Dom node ( element ) is required when calling the jTree init method", 'error'));
          case 4:
            element = opts.element, showLogs = opts.showLogs, editor = opts.editor, options = objectWithoutProperties(opts, ["element", "showLogs", "editor"]);
            opts.element = undefined;
            settings = jsutils.deepMerge(DEF_SETTINGS, options);
            editorConfig = jsutils.deepMerge(Constants.EditorConfig, editor);
            setConfirm(editorConfig.confirmActions);
            _context2.next = 11;
            return createEditor(settings, editorConfig, domContainer);
          case 11:
            builtEditor = _context2.sent;
            return _context2.abrupt("return", builtEditor);
          case 13:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));
  return function init(_x4) {
    return _ref2.apply(this, arguments);
  };
}();

exports.Constants = Constants;
exports.init = init;
