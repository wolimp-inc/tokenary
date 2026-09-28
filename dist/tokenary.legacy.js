/*! @wolimp/tokenary v0.1.0-beta.2 | Apache-2.0 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Tokenary = factory());
})(this, (function () { 'use strict';

	function getDefaultExportFromCjs (x) {
		return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
	}

	function _typeof(o) {
	  "@babel/helpers - typeof";

	  return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
	    return typeof o;
	  } : function (o) {
	    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
	  }, _typeof(o);
	}

	var src;
	var hasRequiredSrc;
	function requireSrc() {
	  if (hasRequiredSrc) return src;
	  hasRequiredSrc = 1;
	  var escapeRegex = function escapeRegex(source) {
	    return String(source).replace(/[.*+?^${}()[\]\\]/g, '\\$&');
	  };
	  var identity = function identity(source) {
	    return String(source !== null && source !== void 0 ? source : '');
	  };
	  var applyMask = function applyMask(mask, value) {
	    return mask.indexOf('?') === -1 ? value : mask.split('?').join(value);
	  };

	  /**
	   * Compiles a token map into a reusable replacement function.
	   *
	   * A question mark in either mask is replaced by the map key or value. When a
	   * mask does not contain a question mark, the original key or value is used.
	   *
	   * @param {object} options
	   * @param {Record<string, unknown>} options.pairsMap
	   * @param {string} [options.keyMask='?']
	   * @param {string} [options.replaceMask='?']
	   * @returns {(source: unknown) => string}
	   */
	  function compile() {
	    var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      pairsMap = _ref.pairsMap,
	      _ref$keyMask = _ref.keyMask,
	      keyMask = _ref$keyMask === void 0 ? '?' : _ref$keyMask,
	      _ref$replaceMask = _ref.replaceMask,
	      replaceMask = _ref$replaceMask === void 0 ? '?' : _ref$replaceMask;
	    if (!pairsMap || _typeof(pairsMap) !== 'object' || Array.isArray(pairsMap)) {
	      return identity;
	    }
	    if (typeof keyMask !== 'string' || keyMask.length === 0 || typeof replaceMask !== 'string' || replaceMask.length === 0) {
	      return identity;
	    }
	    var compiledMap = Object.create(null);
	    var tokens = [];
	    for (var _i = 0, _Object$keys = Object.keys(pairsMap); _i < _Object$keys.length; _i++) {
	      var _pairsMap$key;
	      var key = _Object$keys[_i];
	      var token = applyMask(keyMask, key);
	      if (token.length === 0) {
	        continue;
	      }
	      var value = String((_pairsMap$key = pairsMap[key]) !== null && _pairsMap$key !== void 0 ? _pairsMap$key : '');
	      var replacement = applyMask(replaceMask, value);
	      if (!Object.prototype.hasOwnProperty.call(compiledMap, token)) {
	        tokens.push(token);
	      }
	      compiledMap[token] = replacement;
	    }
	    if (tokens.length === 0) {
	      return identity;
	    }
	    tokens.sort(function (a, b) {
	      return b.length - a.length;
	    });
	    var expression = new RegExp(tokens.map(escapeRegex).join('|'), 'g');
	    return function (source) {
	      return identity(source).replace(expression, function (match) {
	        return compiledMap[match];
	      });
	    };
	  }

	  /**
	   * Compiles a token map and immediately applies it to a source value.
	   *
	   * @param {object} options
	   * @param {unknown} options.source
	   * @param {Record<string, unknown>} options.pairsMap
	   * @param {string} [options.keyMask='?']
	   * @param {string} [options.replaceMask='?']
	   * @returns {string}
	   */
	  function replaceOneShot() {
	    var _ref2 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      source = _ref2.source,
	      pairsMap = _ref2.pairsMap,
	      _ref2$keyMask = _ref2.keyMask,
	      keyMask = _ref2$keyMask === void 0 ? '?' : _ref2$keyMask,
	      _ref2$replaceMask = _ref2.replaceMask,
	      replaceMask = _ref2$replaceMask === void 0 ? '?' : _ref2$replaceMask;
	    var compiledReplacer = compile({
	      pairsMap: pairsMap,
	      keyMask: keyMask,
	      replaceMask: replaceMask
	    });
	    return compiledReplacer(source);
	  }

	  /**
	   * Applies a previously compiled replacement function.
	   *
	   * @param {object} options
	   * @param {unknown} options.source
	   * @param {unknown} options.compiledReplacer
	   * @returns {string}
	   */
	  function replace() {
	    var _ref3 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
	      source = _ref3.source,
	      compiledReplacer = _ref3.compiledReplacer;
	    var normalizedSource = identity(source);
	    if (typeof compiledReplacer !== 'function') {
	      return normalizedSource;
	    }
	    return compiledReplacer(normalizedSource);
	  }
	  src = Object.freeze({
	    compile: compile,
	    replace: replace,
	    replaceOneShot: replaceOneShot
	  });
	  return src;
	}

	var srcExports = requireSrc();
	var index = /*@__PURE__*/getDefaultExportFromCjs(srcExports);

	return index;

}));
