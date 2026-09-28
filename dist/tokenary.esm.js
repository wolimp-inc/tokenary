/*! @wolimp/tokenary v0.1.0-beta.2 | Apache-2.0 */
function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var src;
var hasRequiredSrc;

function requireSrc () {
	if (hasRequiredSrc) return src;
	hasRequiredSrc = 1;

	const escapeRegex = (source) => String(source).replace(/[.*+?^${}()[\]\\]/g, '\\$&');

	const identity = (source) => String(source ?? '');

	const applyMask = (mask, value) => mask.indexOf('?') === -1
	  ? value
	  : mask.split('?').join(value);

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
	function compile({ pairsMap, keyMask = '?', replaceMask = '?' } = {}) {
	  if (!pairsMap || typeof pairsMap !== 'object' || Array.isArray(pairsMap)) {
	    return identity;
	  }

	  if (
	    typeof keyMask !== 'string' || keyMask.length === 0 ||
	    typeof replaceMask !== 'string' || replaceMask.length === 0
	  ) {
	    return identity;
	  }

	  const compiledMap = Object.create(null);
	  const tokens = [];

	  for (const key of Object.keys(pairsMap)) {
	    const token = applyMask(keyMask, key);
	    if (token.length === 0) {
	      continue;
	    }

	    const value = String(pairsMap[key] ?? '');
	    const replacement = applyMask(replaceMask, value);

	    if (!Object.prototype.hasOwnProperty.call(compiledMap, token)) {
	      tokens.push(token);
	    }
	    compiledMap[token] = replacement;
	  }

	  if (tokens.length === 0) {
	    return identity;
	  }

	  tokens.sort((a, b) => b.length - a.length);

	  const expression = new RegExp(
	    tokens.map(escapeRegex).join('|'),
	    'g'
	  );

	  return (source) => identity(source).replace(
	    expression,
	    (match) => compiledMap[match]
	  );
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
	function replaceOneShot({
	  source,
	  pairsMap,
	  keyMask = '?',
	  replaceMask = '?'
	} = {}) {
	  const compiledReplacer = compile({ pairsMap, keyMask, replaceMask });
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
	function replace({ source, compiledReplacer } = {}) {
	  const normalizedSource = identity(source);
	  if (typeof compiledReplacer !== 'function') {
	    return normalizedSource;
	  }

	  return compiledReplacer(normalizedSource);
	}

	src = Object.freeze({
	  compile,
	  replace,
	  replaceOneShot
	});
	return src;
}

var srcExports = requireSrc();
const tokenary = /*@__PURE__*/getDefaultExportFromCjs(srcExports);

const {
  compile,
  replace,
  replaceOneShot
} = tokenary;

export { compile, tokenary as default, replace, replaceOneShot };
