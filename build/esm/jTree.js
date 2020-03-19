import { isObj, deepFreeze, logData as logData$1, get, mapObj, uuid, isFunc, clearObj, unset, checkCall, isStr, set, setLogs, deepMerge, parseJSON, deepClone, capitalize } from 'jsutils';

const addProp = (obj, name, def) => isObj(obj) && Object.defineProperty(obj, name, def);
const isConstructor = obj => {
  return !!obj.prototype && !!obj.prototype.constructor.name;
};

const DIFF = {
  EVENT_ATTRS: Object.freeze(['onclick', 'ondblclick', 'onmousedown', 'onmouseup', 'onmouseover', 'onmousemove', 'onmouseout', 'onmouseenter', 'onmouseleave', 'ontouchcancel', 'ontouchend', 'ontouchmove', 'ontouchstart', 'ondragstart', 'ondrag', 'ondragenter', 'ondragleave', 'ondragover', 'ondrop', 'ondragend', 'onkeydown', 'onkeypress', 'onkeyup', 'onunload', 'onabort', 'onerror', 'onresize', 'onscroll', 'onselect', 'onchange', 'onsubmit', 'onreset', 'onfocus', 'onblur', 'oninput', 'oncontextmenu', 'onfocusin', 'onfocusout']),
  NODE_TYPES: Object.freeze({
    ELEMENT_NODE: 1,
    TEXT_NODE: 3,
    COMMENT_NODE: 8
  }),
  SAME_NODE: Object.freeze(['tagName', 'isSameNode', 'id', 'type'])
};

const NO_OP = () => {};
const EditorConfig = Object.freeze({
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

const DEF_SETTINGS = Object.freeze({
  types: {
    config: {},
    definitions: {}
  }
});

const Schema = {
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

const NO_OP$1 = () => {};
const Values = Object.freeze({
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

let useValues = deepFreeze({ ...Values
});
const updateDefValues = update => useValues = deepFreeze({ ...useValues,
  ...update
});
let useSchema = deepFreeze({ ...Schema
});
const updateDefSchema = update => useSchema = deepFreeze({ ...useSchema,
  ...update
});
const Constants = {
  updateDefSchema,
  updateDefValues
};
Object.defineProperty(Constants, 'Values', {
  get: () => {
    return useValues;
  },
  enumerable: true
});
Object.defineProperty(Constants, 'Schema', {
  get: () => {
    return useSchema;
  },
  enumerable: true
});

const validateKeyInArray = (key, parentVal, schema) => {
  let invalid;
  const index = parseInt(key);
  if (!isNaN(index)) {
    const parKeys = Object.keys(parentVal);
    invalid = parKeys.indexOf(index) === -1 && parKeys.length !== index;
  } else invalid = true;
  return invalid ? {
    error: `Key '${key}'' must be a numbered index for Type ${schema.instance.name}!`
  } : {
    error: false
  };
};
const validateMatchType = (checkType, TYPE_CACHE) => {
  const failedClsProps = Constants.Schema.TYPE_CLASS_CHECK.reduce((failedCheck, prop) => {
    !checkType.hasOwnProperty(prop) && failedCheck.push(prop);
    return failedCheck;
  }, []);
  if (failedClsProps.length) return logData$1(`Could not register type '${checkType.name || 'Type'}'. It's missing these static properties:\n\t${failedClsProps.join('\n\t')}`, 'error');
  if (TYPE_CACHE && TYPE_CACHE[checkType.name]) return logData$1(`Type with name ${checkType.name} is already registered!`, 'error');
  if (!isConstructor(checkType)) return logData$1(`New Types must be a constructor!`, 'error');
  return true;
};
const validateBuildTypes = (source, Editor) => {
  if (!validateSource(source)) return false;
  if (!isObj(Editor.Types) || typeof Editor.Types.get !== 'function') return logData$1(`Editor.Types class is required when building the editor types!`, 'error');
  return true;
};
const validateSource = source => {
  if (!isObj(source)) return logData$1(`Could update source. Please make sure source param is an Object or JSON parse-able string`, 'error');
  return true;
};
const validateUpdate = (tree, idOrPos, update, settings) => {
  if (!idOrPos) return {
    error: `Update requires an id or position!`
  };
  const pos = tree.idMap[idOrPos] || idOrPos;
  if (!pos || !tree.schema[pos]) return {
    error: `Could not find position ${idOrPos} in the tree!`
  };
  const schema = tree.schema[pos];
  const isEmptyType = schema.matchType === Constants.Schema.EMPTY;
  if (!schema && !isEmptyType) return {
    error: `Could not find node in tree that matches ${idOrPos}!`
  };
  if (!isObj(update)) ;
  if (update.mode === Constants.Schema.MODES.REMOVE || update.mode === Constants.Schema.MODES.REPLACE) return {
    schema,
    pos
  };
  if (schema.mode === Constants.Schema.MODES.ADD && !update.matchType) return {
    error: `A valid type is required to update the item!`
  };
  const nonValid = Object.keys(update).reduce((notValid, prop) => {
    if (Constants.Schema.TREE_UPDATE_PROPS.indexOf(prop) == -1) notValid = prop;
    return notValid;
  }, false);
  if (nonValid) return {
    error: `${nonValid} is not a valid update property`
  };
  return {
    schema,
    pos
  };
};
const validateAdd = (schema, parent) => {
  return !isObj(schema) ? {
    error: `Add method requires a valid schema object as the first argument`
  } : !isObj(parent) || !parent.value || !parent.pos ? {
    error: `Add method requires a valid parent schema`
  } : typeof parent.value !== 'object' ? {
    error: `Parent value must equal type 'object' ( Object || Array )`
  } : {
    error: false
  };
};
const validateKey = (key, tree, pos, schema) => {
  if (!key && key !== 0) return {
    error: `Can not set key to a falsy value!`
  };
  if (!tree.schema[pos]) return {
    error: `Position '${pos}' does not exist, can not update key!`
  };
  const parentVal = schema.parent.value;
  if (Array.isArray(parentVal)) return validateKeyInArray(key, parentVal, schema);
  const noString = `Invalid key value: ${key}. Could not convert ${key} into a string!`;
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

const getTypeStyles = (settings, Type) => Type && Type.hasOwnProperty('getStyles') && settings.styleLoader && settings.styleLoader.add && settings.styleLoader.add(buildStyleId(Type), Type.getStyles(settings));
const buildStyleId = Type => {
  Type.styleId = `${Type.name.toLowerCase()}-${uuid().split('-').pop()}`;
  return Type.styleId;
};
const initTypeCache = (TypesCls, settings) => {
  const {
    BaseType,
    ...allTypes
  } = get(settings.types, 'definitions') || {};
  if (!validateMatchType(BaseType)) return;
  TypesCls.BaseType = new BaseType(get(settings.types, 'config.base') || {});
  return buildTypeCache(settings, { ...allTypes,
    BaseType: TypesCls.BaseType
  });
};
const getExtends = factory => {
  const parent = factory.__proto__ && get(factory.__proto__, 'prototype.constructor');
  return parent && {
    name: parent.name,
    base: parent,
    factory: parent.constructor
  };
};
const buildTypeCache = (settings, types) => {
  const {
    BaseType,
    ...allTypes
  } = types;
  const BaseTypeMeta = {
    name: BaseType.constructor.name,
    base: BaseType,
    factory: BaseType.constructor
  };
  getTypeStyles(settings, BaseType.constructor);
  const builtTypes = Object.entries(allTypes).reduce((types, [name, factory]) => {
    const useName = buildTypeName(name);
    if (!validateMatchType(factory)) return allTypes;
    types[useName] = {
      name: useName,
      factory,
      "extends": getExtends(factory) || BaseTypeMeta
    };
    getTypeStyles(settings, factory);
    return types;
  }, {});
  Object.defineProperty(builtTypes, Constants.Values.MAP_TYPES, {
    value: (cb, parent) => mapObj(parent, cb),
    enumerable: false
  });
  return Object.freeze(builtTypes);
};
const buildTypeName = typeClsName => typeClsName.split('Type').join('').toLowerCase();
const typesOverride = (typeInstance, config) => {
  if (!config) return null;
  Object.entries(Constants.Values.TYPE_OVERWRITE).map(([key, type]) => typeof config[key] === type && typeInstance[key] !== config[key] && (typeInstance[key] = config[key]));
};

let INSTANCE_CACHE;
const getChildSchema = (key, value, {
  tree,
  schema
}) => ({ ...(tree.schema[buildInstancePos(key, schema)] || {}),
  key,
  value,
  parent: schema
});
const buildChild = (childKey, child, props, loopChildren) => {
  if (props.schema.open) return loopChildren(getChildSchema(childKey, child, props), props.tree, props.settings);
  const childPos = buildInstancePos(childKey, props.schema);
  const schema = props.tree.schema[childPos];
  if (!schema || !schema.instance || !schema.domNode) return;
  clearSchema(schema, props.tree);
  return undefined;
};
const buildInstancePos = (key, parent) => key === Constants.Schema.ROOT ? key : `${parent.pos}.${key}`;
const clearInstanceCache = () => {
  clearObj(INSTANCE_CACHE);
  INSTANCE_CACHE = undefined;
};
const clearInstance = (id, instance) => {
  instance = instance || INSTANCE_CACHE && INSTANCE_CACHE[id];
  if (!instance) return false;
  isFunc(instance.componentWillUnmount) && instance.componentWillUnmount();
  instance.state = undefined;
  instance.setState = undefined;
  clearObj(instance);
  id = id || INSTANCE_CACHE && Object.keys(INSTANCE_CACHE)[Object.values(INSTANCE_CACHE).indexOf(instance)];
  if (!id) return false;
  INSTANCE_CACHE[id] && (INSTANCE_CACHE[id] = undefined);
  unset(INSTANCE_CACHE, id);
  instance = undefined;
  return true;
};
const buildInstance = (type, schema, settings) => {
  const {
    id,
    matchType
  } = schema;
  INSTANCE_CACHE = INSTANCE_CACHE || {};
  if (!INSTANCE_CACHE[id]) {
    const config = get(settings.types, `config.${matchType}`) || {};
    const editorConfig = settings.Editor.config || {};
    mapObj(Constants.Values.CUSTOM_EVENTS, (key, value) => !config[key] && editorConfig[key] && (config[key] = editorConfig[key]));
    const instance = new type.factory(config, settings.Editor);
    config && typesOverride(instance, config);
    Object.keys(instance).map(key => {
      if (!isFunc(instance[key])) return;
      const orgMethod = instance[key];
      instance[key] = (...args) => {
        if (!Constants.Values.CUSTOM_EVENTS[key]) return orgMethod(...args, settings.Editor);
        let callOrg = false;
        let hasOverride = isFunc(editorConfig[key]);
        if (hasOverride) {
          if (editorConfig.eventOverride === 'instance') callOrg = true;else if (settings.Editor.config[key](...args, settings.Editor) !== false) callOrg = true;
        }
        if (!hasOverride || callOrg) return orgMethod(...args, settings.Editor);
      };
    });
    INSTANCE_CACHE[id] = instance;
  }
  let NEW_INSTANCE = true;
  addProp(schema, 'newInstance', {
    get: () => NEW_INSTANCE,
    set: update => {
      NEW_INSTANCE = undefined;
      unset(schema, 'newInstance');
    },
    enumerable: true,
    configurable: true
  });
  addProp(schema, 'instance', {
    get: () => INSTANCE_CACHE[id],
    set: instance => {
      if (!instance) {
        clearInstance(id);
        unset(schema, 'instance');
      } else INSTANCE_CACHE[id] = instance;
    },
    enumerable: true,
    configurable: true
  });
  return INSTANCE_CACHE[id];
};
const renderInstance = (key, value, props, loopChildren) => {
  const {
    schema,
    tree,
    settings
  } = props;
  let domNode = isObj(value) ? checkCall(schema.instance.render, { ...props,
    children: Object.entries(value).map(([childKey, child]) => buildChild(childKey, child, props, loopChildren))
  }) : Array.isArray(value) ? checkCall(schema.instance.render, { ...props,
    children: value.map((child, index) => buildChild(index, child, props, loopChildren))
  }) : checkCall(schema.instance.render, props);
  domNode && !domNode.id && (domNode.id = schema.id);
  return domNode;
};
const callInstanceUpdates = (tree, orgPos) => Object.entries(tree.schema).map(([pos, schema]) =>
!schema.instance || schema.pos.indexOf(orgPos) !== 0 ? null : !schema.newInstance
? isFunc(schema.instance.componentDidUpdate) && schema.instance.componentDidUpdate({
  tree: tree,
  schema,
  parent: schema.parent
})
: (schema.newInstance = false) || isFunc(schema.instance.componentDidMount) && schema.instance.componentDidMount({
  tree: tree,
  schema,
  parent: schema.parent
}));

const cleanSettingsObj = settings => {
  clearObj(settings.Editor.config);
  clearObj(settings);
};
const clearTypeCache = typeCache => {
  isObj(typeCache) && Object.keys(typeCache).map(key => {
    switch (key) {
      case 'children':
        Object.values(typeCache).map(child => clearTypeCache(child));
        break;
      case 'extends':
        Object.keys(typeCache.extends).map(key => unset(typeCache.extends, key));
        break;
    }
  }).length || (typeCache = undefined);
};
const cleanTreeSchema = tree => Object.keys(tree.schema).map(key => tree.schema[key] && (clearSchema(tree.schema[key], tree) || (tree.schema[key] = undefined)));
const clearSchema = (schema, tree, removeInstance = true) => {
  if (!schema || !schema.pos || !tree.schema || !tree.schema[schema.pos]) return;
  if (tree.schema && tree.schema[schema.pos] !== schema) {
    return logData$1(`Can not clear schema from tree. tree.schema and schema do not match`, 'warn');
  }
  const schemaPos = schema.pos;
  removeInstance && clearInstance(schema.id);
  unset(tree.idMap, schema.id);
  unset(schema, 'domNode');
  unset(schema, 'parent');
  unset(schema, 'instance');
  unset(schema, 'value');
  unset(tree.schema, schema.pos);
  clearObj(schema);
  mapObj(tree.schema, (pos, schemaItem) => {
    pos.indexOf(schemaPos) === 0 && clearSchema(schemaItem, tree);
  });
};
const clearTypeData = (TypeCls, typeCache, includeClass = true) => {
  clearTypeCache(typeCache);
  unset(TypeCls, 'BaseType');
  includeClass && clearObj(TypeCls);
};
const cleanUp = (settings, tree) => {
  tree.schema && cleanTreeSchema(tree);
  clearInstanceCache();
  cleanSettingsObj(settings);
};

let CONFIRM_ACTION;
let CUSTOM_CONFIRM;
const setConfirm = confirmAct => {
  isFunc(confirmAct) && (CUSTOM_CONFIRM = confirmAct);
  if (confirmAct) CONFIRM_ACTION = true;else {
    CUSTOM_CONFIRM = undefined;
    CONFIRM_ACTION = undefined;
  }
};
const checkConfirm = (...params) => {
  if (!CONFIRM_ACTION) return true;
  const message = params.pop();
  if (!isStr(message)) return true;
  const outcome = isFunc(CUSTOM_CONFIRM) ? CUSTOM_CONFIRM(...params) : window.confirm(message);
  return Boolean(outcome);
};

const {
  NODE_TYPES,
  EVENT_ATTRS,
  SAME_NODE
} = DIFF;
const updateOption = (newNode, oldNode) => updateAttribute(newNode, oldNode, 'selected');
const updateInput = (newNode, oldNode) => {
  const newValue = newNode.value;
  const oldValue = oldNode.value;
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
const updateTextarea = (newNode, oldNode) => {
  const newValue = newNode.value;
  if (newValue !== oldNode.value) oldNode.value = newValue;
  if (!oldNode.firstChild || oldNode.firstChild.nodeValue === newValue) return;
  if (newValue === '' && oldNode.firstChild.nodeValue === oldNode.placeholder) return;
  oldNode.firstChild.nodeValue = newValue;
};
const NODE_NAME_CHECK = {
  INPUT: updateInput,
  OPTION: updateOption,
  TEXTAREA: updateTextarea
};
const updateParent = (newNode, oldNode) => {
  newNode.nodeType === NODE_TYPES.ELEMENT_NODE && copyAttrs(newNode, oldNode);
  Object.values(NODE_TYPES).indexOf(newNode.nodeType) !== -1 && oldNode.nodeValue !== newNode.nodeValue && (oldNode.nodeValue = newNode.nodeValue);
  NODE_NAME_CHECK[newNode.nodeName] && NODE_NAME_CHECK[newNode.nodeName](newNode, oldNode);
  copyEvents(newNode, oldNode);
  return oldNode;
};
const removeOldAttrs = (newNode, oldNode, oldAttrs) => Object.values(oldAttrs).map(attr => {
  if (attr.specified === false) return;
  if (!attr.namespaceURI) return !newNode.hasAttributeNS(null, attr.name) && oldNode.removeAttribute(attr.name);
  attr.name = attr.localName || attr.name;
  !newNode.hasAttributeNS(attr.namespaceURI, attr.name) && oldNode.removeAttributeNS(attr.namespaceURI, attr.name);
});
const addNewAttrs = (newNode, oldNode, newAttrs) => Object.values(newAttrs).map(attr => {
  if (attr.namespaceURI) {
    attr.name = attr.localName;
    const fromValue = oldNode.getAttributeNS(attr.namespaceURI, attrLocalName || attr.name);
    return fromValue !== attr.value && oldNode.setAttributeNS(attr.namespaceURI, attr.name, attr.value);
  }
  if (!oldNode.hasAttribute(attr.name)) return oldNode.setAttribute(attr.name, attr.value);
  if (oldNode.getAttribute(attr.name) === attr.value) return;
  attr.value === 'null' || attr.value === 'undefined' ? oldNode.removeAttribute(attr.name) : oldNode.setAttribute(attr.name, attr.value);
});
const copyAttrs = (newNode, oldNode) => {
  const oldAttrs = oldNode.attributes;
  const newAttrs = newNode.attributes;
  addNewAttrs(newNode, oldNode, newAttrs);
  removeOldAttrs(newNode, oldNode, oldAttrs);
};
const copyEvents = (newNode, oldNode) => EVENT_ATTRS.map(ev => newNode[ev] && (oldNode[ev] = newNode[ev]) || oldNode[ev] && (oldNode[ev] = undefined));
const updateAttribute = (newNode, oldNode, name) => {
  if (newNode[name] === oldNode[name]) return;
  oldNode[name] = newNode[name];
  newNode[name] ? oldNode.setAttribute(name, '') : oldNode.removeAttribute(name);
};
const same = (a, b) => SAME_NODE.reduce((isSame, key) => isSame ? isSame : typeof a[key] === 'function' ? a.isSameNode(b) : a.type === NODE_TYPES.TEXT_NODE ? a.nodeValue === b.nodeValue : a[key] === b[key], false);
const updateChildren = (newNode, oldNode) => {
  let oldChild;
  let newChild;
  let morphed;
  let offset = 0;
  for (let i = 0;; i++) {
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
    let oldMatch = null;
    for (let j = i; j < oldNode.childNodes.length; j++) {
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
const runNodeDiff = (newNode, oldNode) => {
  if (!oldNode) return newNode;else if (!newNode) return null;else if (newNode.isSameNode && newNode.isSameNode(oldNode)) return oldNode;else if (newNode.tagName !== oldNode.tagName) return newNode;
  updateParent(newNode, oldNode);
  updateChildren(newNode, oldNode);
  return oldNode;
};
const diffUpdate = (newNode, oldNode, options = {}) => {
  return options.childrenOnly ? updateChildren(newNode, oldNode) || oldNode : runNodeDiff(newNode, oldNode);
};

const getElement = selector => {
  if (selector instanceof HTMLElement) return selector;
  if (!selector || typeof selector !== 'string') return null;
  let selectorType = 'querySelector';
  if (selector.indexOf('#') === 0) {
    selectorType = 'getElementById';
    selector = selector.substr(1, selector.length);
  }
  return document[selectorType](selector);
};
const removeElement = selector => {
  const element = getElement(selector);
  if (!element) return;
  element.remove ? element.remove() : element.parentNode ? element.parentNode.removeChild(element) : logData$1(`Could remove element from dom tree. No method exists`, element, 'warn');
};
const upsertElement = (element, parentSelector) => {
  if (Boolean(element instanceof HTMLElement) === false) return logData$1(`upsertElement method requires an HTML element as it's first argument`, element, parent, 'warn');
  const parent = getElement(parentSelector);
  if (!parent) return logData$1(`Could not add element to the dom tree. The parent element does not exists`, element, parent, 'warn');
  const replaceEl = document.getElementById(element.id);
  if (replaceEl) return diffUpdate(element, replaceEl);
  return parent && parent.appendChild(element);
};

const setHighestPriority = (matches, priority) => {
  if (!matches.highest || matches.highest <= priority) {
    matches.highest = priority;
    return true;
  }
  return false;
};
const getMatchTypes = function (TYPE_CACHE, value, parent, settings, matches = {}) {
  TYPE_CACHE[Constants.Values.MAP_TYPES]((name, meta) => {
    const {
      factory
    } = meta;
    const priority = factory.priority || this.BaseType.constructor.priority;
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
const callMatchHelper = (params, BaseType) => {
  const baseMatchHelper = BaseType.constructor.matchHelper;
  if (!params.matchTypes) return checkCall(baseMatchHelper, params);
  const parentFacts = [];
  let helperMethod;
  Object.entries(params.matchTypes).map(([typeName, meta]) => {
    if (!meta || !meta.factory || helperMethod) return;
    const {
      "extends": {
        factory: {
          matchHelper
        }
      }
    } = meta;
    if (!matchHelper) return;
    if (matchHelper && parentFacts.indexOf(matchHelper) !== -1) helperMethod = meta.extends.factory.matchHelper;
    else if (matchHelper) parentFacts.push(matchHelper);
  });
  helperMethod = helperMethod || baseMatchHelper;
  return checkCall(baseMatchHelper, params);
};
const checkMultiMatches = (matchTypes, schema, tree, settings) => {
  let hasMatches = isObj(matchTypes);
  const matchKeys = hasMatches && Object.keys(matchTypes) || [];
  if (!matchKeys.length) hasMatches = false;
  const {
    Editor: {
      Types: {
        BaseType
      }
    },
    Editor
  } = settings;
  const helperParams = {
    schema,
    tree,
    Editor
  };
  if (!hasMatches) return callMatchHelper(helperParams, BaseType);
  else if (matchKeys.length === 1) return matchTypes[matchKeys[0]];
  helperParams.matchTypes = matchTypes;
  return callMatchHelper(helperParams, BaseType);
};

const addSchemaComponent = (schema, id) => addProp(schema, 'domNode', {
  get: () => document.getElementById(id),
  set: _id => {
    if (_id && _id !== id) id = _id;
  },
  enumerable: true,
  configurable: true
});
const buildSchema = (curSchema, type, settings) => {
  const schema = { ...curSchema,
    pos: buildInstancePos(curSchema.key, curSchema.parent),
    id: curSchema.id || uuid(),
    keyType: curSchema.parent && Array.isArray(curSchema.parent.value) ? 'number' : 'text',
    matchType: curSchema.matchType || buildTypeName(type.name || type.factory.name)
  };
  !schema.instance && buildInstance(type, schema, settings);
  return schema;
};
const loopSource = (curSchema, tree, settings, elementCb) => {
  const {
    value,
    key,
    parent,
    pos,
    pending,
    mode
  } = curSchema;
  const Types = settings.Editor.Types;
  const isRoot = key === Constants.Schema.ROOT;
  const cutMode = mode === Constants.Schema.MODES.CUT;
  const matchTypes = !cutMode && !pending && Types.getValueTypes(value, settings);
  const type = pending ? !cutMode && Types.get(curSchema.matchType) : !cutMode && checkMultiMatches(matchTypes, curSchema, tree, settings);
  if (cutMode || !type || !type.factory || !isConstructor(type.factory)) {
    if (cutMode) {
      curSchema.domNode = undefined;
      curSchema.parent = undefined;
      curSchema.id = undefined;
    }
    return isRoot ? tree : null;
  }
  const schema = buildSchema(curSchema, type, settings);
  !isRoot ? schema.parent = parent : schema.isRoot = true;
  tree.schema[schema.pos] = schema;
  let props = {
    schema,
    tree,
    settings
  };
  const shouldUpdate = checkCall(schema.instance.shouldComponentUpdate, curSchema, props);
  if (shouldUpdate === false) {
    schema.instance = undefined;
    tree.idMap[schema.id] = schema.pos;
    props = undefined;
    return '';
  }
  if (isRoot && !curSchema.id) {
    props.schema.open = get(settings, 'Editor.config.root.start') === 'open';
    props.schema.keyText = get(settings, 'Editor.config.root.title', schema.key);
  }
  let domNode = renderInstance(key, value, props, loopSource);
  domNode && domNode.id && addSchemaComponent(schema, domNode.id);
  tree.idMap[domNode && domNode.id || schema.id] = schema.pos;
  if (!isRoot) return (props = undefined) || domNode;
  elementCb && checkCall(elementCb, settings.Editor, domNode, settings.Editor.config.appendTree, tree);
  domNode = undefined;
  props = undefined;
  return tree;
};
const appendTreeHelper = (jtree, rootComp, appendTree, tree) => {
  const res = checkCall(appendTree, rootComp, jtree, tree);
  if (res === false || !jtree.element) return null;
  upsertElement(rootComp, jtree.element);
  const pos = tree.idMap[rootComp.id];
  callInstanceUpdates(tree, pos);
};
const buildFromPos = (jtree, pos, settings) => {
  if (!isStr(pos) || !jtree.tree.schema[pos]) return logData(`Rebuild was called, but ${pos} does not exist it the tree`, jtree.tree, pos, 'warn');
  const renderSchema = jtree.tree.schema[pos];
  const updatedEl = loopSource(renderSchema, jtree.tree, settings, appendTreeHelper);
  if (updatedEl === null) {
    const domNode = renderSchema.domNode;
    return domNode && removeElement(domNode, domNode.parentNode);
  }
  if (pos === Constants.Schema.ROOT || Boolean(updatedEl instanceof HTMLElement) === false) return;
  upsertElement(updatedEl, renderSchema.domNode);
  callInstanceUpdates(jtree.tree, renderSchema.pos);
};

const checkEmptyType = (newType, schema) => {
  const {
    allowEmptyValue
  } = newType.factory;
  if (allowEmptyValue === undefined) return false;
  if (schema.value === allowEmptyValue) return true;
  const valIsObj = typeof schema.value === 'object';
  const valIsEmptyObj = valIsObj && Object.keys(schema.value).length === 0;
  if (allowEmptyValue === true) return valIsObj ? valIsEmptyObj : schema.value === 0 || schema.value === '';
  const allowType = typeof allowEmptyValue;
  const allowIsObj = allowType === 'object';
  const allowArr = allowIsObj && Array.isArray(allowEmptyValue);
  if (allowArr) return allowEmptyValue.reduce((hasEmpty, allowedEmpty) => {
    return hasEmpty ? hasEmpty : allowIsObj && valIsEmptyObj || schema.value === allowedEmpty;
  });
  return allowIsObj && typeof valIsEmptyObj;
};
const buildNewPos = (pos, key, replace = true) => {
  const splitPos = pos.split('.');
  replace ? splitPos[splitPos.length - 1] = key : splitPos.push(key);
  return splitPos.join('.');
};
const checkSchemaPos = (tree, pos, checkExists) => checkExists ? !tree.schema[pos] ? logData$1(`Cannot update schema in tree. Schema does not exist!`, pos, tree.schema[pos], 'error') : true : tree.schema[pos] ? logData$1(`Cannot add child to tree. Schema pos already exists!`, pos, tree.schema[pos], 'error') : true;
const updateSchemaError = (tree, schema, settings, prop, value, message) => {
  schema.error = checkCall(schema.instance.constructor.error, {
    prop,
    value,
    message,
    schema,
    tree,
    settings
  });
};
const updateSchema = (update, schema) => {
  return isObj(update) && isObj(schema) && Object.entries(update).reduce((updated, [key, value]) => {
    if (key === 'type') key = 'matchType';
    updated[key] = value;
    return updated;
  }, schema);
};
const updateType = (tree, pos, schema, settings) => {
  if (!pos || !isObj(schema)) return {
    error: `The pos and schema are required to update schema type`
  };
  if (!checkSchemaPos(tree, pos, true)) return;
  clearInstance(schema.id);
  unset(schema, 'instance');
  const newType = settings.Editor.Types.get(schema.matchType);
  if (!newType) return {
    error: `Type '${schema.matchType}' in not a configured type`
  };
  let hasValue = schema.value || schema.value === 0 || schema.value === '';
  if (!hasValue && isFunc(newType.factory.defaultValue)) schema.value = newType.factory.defaultValue(schema, settings);
  hasValue = schema.value || schema.value === 0 || schema.value === '';
  const hasEmpty = checkEmptyType(newType, schema);
  if (hasValue && !hasEmpty && !newType.factory.eval(schema.value)) return {
    error: `'Not a valid value for ${(newType.factory.name || '').replace('Type', '')}`
  };
  if (hasValue && !schema.error) set(tree, schema.pos, schema.value);
  tree.schema[pos] = { ...schema,
    pending: true,
    instance: buildInstance(newType, schema, settings),
    mode: Constants.Schema.MODES.EDIT
  };
};
const updateValue = (tree, pos, schema, settings) => {
  const factory = tree.schema[pos].instance.constructor;
  if ('value' in schema && !factory.eval(schema.value)) return {
    error: `Not a valid value for ${(factory.name || '').replace('Type', '')}`
  };
  set(tree, pos, schema.value);
  set(tree.schema[pos], 'value', schema.value);
};
const updateKey = (tree, pos, schema, settings) => {
  if (!schema.key) return {
    error: `Can not set key to a falsy value!`
  };
  const currentVal = get(tree, pos);
  const updatedPos = buildNewPos(pos, schema.key);
  if (updatedPos === pos) return;
  if (tree.schema[updatedPos]) return {
    error: `Can not update key ${schema.key}, because it already exists!`
  };
  const unsetContent = unset(tree, pos);
  if (!unsetContent) return {
    error: `Could not update key, because ${pos} could not be removed!`
  };
  set(tree, updatedPos, currentVal);
  tree.schema[updatedPos] = { ...tree.schema[pos],
    ...schema,
    value: currentVal,
    pos: updatedPos
  };
  schema.pos = updatedPos;
  clearSchema(tree.schema[pos], tree, false);
  return {
    pos: updatedPos
  };
};
const updateSchemaProp = (tree, pos, schema, settings, prop) => {
  if (prop in schema) tree.schema[pos][prop] = schema[prop];
};
const addChildSchema = (tree, schema, parent) => {
  if (!tree || !isObj(schema) || !isObj(parent)) return;
  const parentVal = get(tree, parent.pos);
  if (!parentVal || typeof parentVal !== 'object') return;
  schema.id = schema.id || uuid();
  if (tree.idMap[schema.id]) return logData$1(`Can not add child to tree. Schema id already exists!`, schema.id, tree.schema[tree.idMap[schema.id]], 'error');
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
const addRemoveSchema = (add, remove, tree) => {
  if (!tree) return null;
  if (remove && remove.pos) clearSchema(remove, tree, add && remove.instance !== add.instance);
  if (add) {
    if (!add.pos) return {
      error: `Can not add to schema, position is required!`,
      key: 'pos'
    };else if (!add.id) return {
      error: `Can not add to schema, id is required!`,
      key: 'id'
    };
    add.value && set(tree, add.pos, add.value);
    add.id && (tree.idMap[add.id] = add.pos);
    tree.schema[add.pos] = add;
  }
};

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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function unwrapExports (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

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

let STYLE_LOADER;
let TYPE_CACHE;
let FLAT_TYPES;
const buildTypes = (source, settings, elementCb) => {
  var _tree;
  if (!validateBuildTypes(source, settings.Editor)) return null;
  const tree = (_tree = {
    schema: {}
  }, _defineProperty(_tree, Constants.Schema.ROOT, source), _defineProperty(_tree, "idMap", {}), _tree);
  const rootSchema = {
    value: source,
    key: Constants.Schema.ROOT
  };
  return loopSource(rootSchema, tree, settings, elementCb);
};
function TypesCls(settings) {
  class Types {
    constructor() {
      this.get = name => !name && TYPE_CACHE || TYPE_CACHE[name];
      this.clear = (includeClass = true) => {
        clearTypeData(this, TYPE_CACHE, includeClass);
        TYPE_CACHE = undefined;
        mapObj(FLAT_TYPES, key => unset(FLAT_TYPES[key]));
        FLAT_TYPES = undefined;
      };
      this.register = newType => {
        if (!validateMatchType(newType, TYPE_CACHE)) return null;
      };
      this.rebuild = () => {
        this.clear(false);
        TYPE_CACHE = initTypeCache(this, settings);
      };
      this.getValueTypes = value => {
        const matchTypes = getMatchTypes.apply(this, [TYPE_CACHE, value, TYPE_CACHE, settings, {}]);
        if (matchTypes.highest && matchTypes[matchTypes.highest]) return matchTypes[matchTypes.highest];
        const firstKey = isObj(matchTypes) && Object.keys(matchTypes)[0];
        return firstKey && matchTypes[firstKey];
      };
      this.destroy = Editor => {
        this.clear();
        STYLE_LOADER.destroy();
      };
      if (!settings.types || !settings.types.definitions) return logData$1(`No types found as 'settings.types.definitions'`, 'error');
      STYLE_LOADER = new StyleLoader();
      settings.styleLoader = STYLE_LOADER;
      TYPE_CACHE = initTypeCache(this, settings);
    }
  }
  return new Types();
}

const UPDATE_ACTIONS = {
  matchType: updateType,
  value: updateValue,
  open: updateSchemaProp,
  mode: updateSchemaProp,
  error: updateSchemaProp
};
let ACT_SOURCE;
let TEMP;
const handelUpdateError = (jTree, pos, settings, prop, value, message) => {
  if (!pos || !jTree.tree.schema[pos]) return logData$1(`Could not find ${pos} in the tree!`);
  updateSchemaError(jTree.tree, jTree.tree.schema[pos], settings, prop, value, message);
  buildFromPos(jTree, pos, settings);
};
const doKeyUpdate = (jTree, update, pos, schema, settings) => {
  const valid = validateKey(update.key, jTree.tree, pos, schema);
  if (!valid || valid.error) return handelUpdateError(jTree, pos, settings, 'key', update.key, valid.error);
  const updated = updateKey(jTree.tree, pos, schema);
  if (!updated || updated.error) return handelUpdateError(jTree, pos, settings, 'key', update.key, updated.error);
  return updated.pos;
};
const doUpdateData = (jTree, update, pos, schema, settings) => {
  let invalid;
  Constants.Schema.TREE_UPDATE_PROPS.map(prop => {
    if (invalid) return;
    invalid = prop in update && checkCall(UPDATE_ACTIONS[prop], jTree.tree, pos, schema, settings, prop);
    if (!invalid) return;
    invalid.prop = prop;
    invalid.value = update[prop];
  });
  if (invalid && invalid.error) return handelUpdateError(jTree, pos, settings, invalid.prop, invalid.value, invalid.error);
  return true;
};
const addTempProp = jTree => {
  let TEMP_ID = false;
  addProp(jTree, 'temp', {
    get: () => {
      return { ...(TEMP_ID && jTree.schema(TEMP_ID) || {}),
        mode: Constants.Schema.MODES.TEMP
      };
    },
    set: id => {
      TEMP_ID = id;
    },
    enumerable: true,
    configurable: true
  });
  jTree.hasTemp = () => Boolean(TEMP_ID);
};
const NO_CONFIRM_KEYS = ['open', 'matchType'];
const NO_CONFIRM_MODES = ['edit'];
const shouldShowConfirm = update => {
  const updateKeys = Object.keys(update);
  if (updateKeys.length !== 1) return true;
  if (update.mode && NO_CONFIRM_MODES.indexOf(update.mode.toLowerCase()) !== -1) return false;
  if (NO_CONFIRM_KEYS.indexOf(updateKeys[0]) !== -1) return false;
};
const createEditor = async (settings, editorConfig, domContainer) => {
  class jTree {
    constructor() {
      this.buildTypes = source => {
        if (source && source !== ACT_SOURCE) return this.setSource(source);
        if (!isObj(ACT_SOURCE)) return logData$1(`Could build types, source data is invalid!`, ACT_SOURCE, 'warn');
        if (isObj(ACT_SOURCE)) this.tree = buildTypes(ACT_SOURCE, settings, appendTreeHelper);
        return this;
      };
      this.setSource = (source, update) => {
        if (typeof source === 'string') source = parseJSON(source);
        if (!validateSource(source)) return undefined;
        ACT_SOURCE = deepClone(source);
        return update && this.buildTypes();
      };
      this.forceUpdate = pos => {
        pos && buildFromPos(this, pos, settings);
      };
      this.update = (idOrPos, update) => {
        let pos = this.tree.idMap[idOrPos] || idOrPos;
        const validData = validateUpdate(this.tree, idOrPos, update);
        if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(this, pos, settings, 'update', update, validData.error);
        pos = validData.pos || pos;
        if (shouldShowConfirm(update) && !checkConfirm(validData.schema, pos, update, `${update.mode && capitalize(update.mode) || 'Update'} node at ${pos}?`)) return;
        validData.schema.error && unset(validData.schema, 'error');
        let schema = updateSchema(update, { ...validData.schema
        });
        if ('key' in update) {
          const updatedPos = doKeyUpdate(this, update, pos, schema, settings);
          if (!updatedPos) return;
          pos = updatedPos;
        }
        this.tree.schema[pos].pending && !update.matchType && unset(this.tree.schema[pos], 'pending');
        if (!doUpdateData(this, update, pos, schema, settings)) return;
        if (TEMP && TEMP.id === schema.id) TEMP = undefined;
        schema = undefined;
        validData.schema = undefined;
        buildFromPos(this, pos, settings);
      };
      this.replaceAtPos = (idOrPos, replace) => {
        const validData = validateUpdate(this.tree, idOrPos, {
          mode: Constants.Schema.MODES.REPLACE
        });
        if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(this, this.tree.idMap[idOrPos] || idOrPos, settings, 'replace', null, validData.error);
        const {
          pos,
          schema
        } = validData;
        if (!checkConfirm(schema, pos, replace, `Replace ${schema.pos}?`)) return;
        replace.pos = schema.pos;
        replace.key = schema.key;
        replace.parent = schema.parent;
        replace.id = schema.id;
        addSchemaComponent(replace, replace.id);
        if (replace.mode === Constants.Schema.MODES.REPLACE || replace.mode === Constants.Schema.MODES.TEMP) unset(replace, 'mode');
        schema.instance !== replace.instance && unset(replace, 'instance');
        replace.value = deepClone(replace.value);
        const invalid = addRemoveSchema(replace, schema, this.tree);
        if (invalid && invalid.error) return handelUpdateError(jTree, pos, settings, invalid.key, replace[invalid.key], invalid.error);
        replace.parent && replace.parent.pos && buildFromPos(this, replace.parent && replace.parent.pos, settings);
      };
      this.remove = idOrPos => {
        const validData = validateUpdate(this.tree, idOrPos, {
          mode: Constants.Schema.MODES.REMOVE
        });
        if (!validData || validData.error || !validData.schema || !validData.pos) return handelUpdateError(this, this.tree.idMap[idOrPos] || idOrPos, settings, 'remove', null, validData.error);
        const {
          pos,
          schema
        } = validData;
        if (!checkConfirm(schema, pos, `Remove ${pos}?`)) return;
        unset(this.tree, pos);
        unset(this.tree.idMap, schema.id);
        Array.isArray(schema.parent.value) && schema.parent.value.splice(pos.split('.').pop(), 1);
        const domNode = schema.domNode;
        removeElement(domNode, domNode.parentNode);
        const parentPos = schema.parent.pos;
        clearSchema(schema, this.tree);
        buildFromPos(this, parentPos, settings);
      };
      this.add = (schema, parent) => {
        const useParent = schema.parent || parent || this.tree.schema;
        const isValid = validateAdd(schema, useParent);
        if (!isValid || isValid.error) return logData$1(isValid.error, schema, parent, this.tree, 'warn');
        if (schema.matchType !== Constants.Schema.EMPTY && !checkConfirm(schema, useParent.pos, `Add to parent ${useParent.pos}?`)) return;
        if (!addChildSchema(this.tree, schema, useParent)) return;
        buildFromPos(this, useParent.pos, settings);
      };
      this.schema = idOrPos => get(this, ['tree', 'schema', get(this, `tree.idMap.${idOrPos}`, idOrPos)]);
      this.destroy = () => {
        ACT_SOURCE = undefined;
        const rootNode = get(this, `tree.schema.${Constants.Schema.ROOT}.domNode`);
        clearObj(this.tree[Constants.Schema.ROOT]);
        clearObj(this.tree.idMap);
        checkCall(get(this, 'Types.destroy'), this);
        clearObj(this.tree);
        clearObj(this.config);
        unset(this, 'Types');
        unset(this, 'element');
        unset(this, 'temp');
        cleanUp(settings, this.tree);
        clearObj(this);
        if (!rootNode || !rootNode.parentNode) return;
        const classList = get(rootNode, 'parentNode.classList');
        classList && classList.remove(Constants.Values.ROOT_CLASS);
        removeElement(rootNode, rootNode.parentNode);
      };
      this.Types = TypesCls(settings);
      if (!this.Types) return logData$1(`Could not load types for editor!`, 'error');
      this.element = domContainer;
      this.element.classList.add(Constants.Values.ROOT_CLASS);
      const {
        source: _source,
        ...config
      } = editorConfig;
      this.config = config;
      settings.Editor = this;
      !config.noTemp && addTempProp(this);
      return _source && this.setSource(_source, true);
    }
  }
  const buildJTree = () => {
    return new jTree();
  };
  const jTreeEditor = await buildJTree();
  return jTreeEditor;
};
const init = async opts => {
  if (opts.showLogs) setLogs(true);
  const domContainer = getElement(opts.element);
  if (!domContainer) return logData$1(`Dom node ( element ) is required when calling the jTree init method`, 'error');
  const {
    element,
    showLogs,
    editor,
    ...options
  } = opts;
  opts.element = undefined;
  const settings = deepMerge(DEF_SETTINGS, options);
  const editorConfig = deepMerge(Constants.EditorConfig, editor);
  setConfirm(editorConfig.confirmActions);
  const builtEditor = await createEditor(settings, editorConfig, domContainer);
  return builtEditor;
};

export { Constants, init };
