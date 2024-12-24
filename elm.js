(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}




// EQUALITY

function _Utils_eq(x, y)
{
	for (
		var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
		isEqual && (pair = stack.pop());
		isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
		)
	{}

	return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack)
{
	if (x === y)
	{
		return true;
	}

	if (typeof x !== 'object' || x === null || y === null)
	{
		typeof x === 'function' && _Debug_crash(5);
		return false;
	}

	if (depth > 100)
	{
		stack.push(_Utils_Tuple2(x,y));
		return true;
	}

	/**_UNUSED/
	if (x.$ === 'Set_elm_builtin')
	{
		x = $elm$core$Set$toList(x);
		y = $elm$core$Set$toList(y);
	}
	if (x.$ === 'RBNode_elm_builtin' || x.$ === 'RBEmpty_elm_builtin')
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	/**/
	if (x.$ < 0)
	{
		x = $elm$core$Dict$toList(x);
		y = $elm$core$Dict$toList(y);
	}
	//*/

	for (var key in x)
	{
		if (!_Utils_eqHelp(x[key], y[key], depth + 1, stack))
		{
			return false;
		}
	}
	return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function(a, b) { return !_Utils_eq(a,b); });



// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and List.js depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y, ord)
{
	if (typeof x !== 'object')
	{
		return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
	}

	/**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

	/**/
	if (typeof x.$ === 'undefined')
	//*/
	/**_UNUSED/
	if (x.$[0] === '#')
	//*/
	{
		return (ord = _Utils_cmp(x.a, y.a))
			? ord
			: (ord = _Utils_cmp(x.b, y.b))
				? ord
				: _Utils_cmp(x.c, y.c);
	}

	// traverse conses until end of a list or a mismatch
	for (; x.b && y.b && !(ord = _Utils_cmp(x.a, y.a)); x = x.b, y = y.b) {} // WHILE_CONSES
	return ord || (x.b ? /*GT*/ 1 : y.b ? /*LT*/ -1 : /*EQ*/ 0);
}

var _Utils_lt = F2(function(a, b) { return _Utils_cmp(a, b) < 0; });
var _Utils_le = F2(function(a, b) { return _Utils_cmp(a, b) < 1; });
var _Utils_gt = F2(function(a, b) { return _Utils_cmp(a, b) > 0; });
var _Utils_ge = F2(function(a, b) { return _Utils_cmp(a, b) >= 0; });

var _Utils_compare = F2(function(x, y)
{
	var n = _Utils_cmp(x, y);
	return n < 0 ? $elm$core$Basics$LT : n ? $elm$core$Basics$GT : $elm$core$Basics$EQ;
});


// COMMON VALUES

var _Utils_Tuple0 = 0;
var _Utils_Tuple0_UNUSED = { $: '#0' };

function _Utils_Tuple2(a, b) { return { a: a, b: b }; }
function _Utils_Tuple2_UNUSED(a, b) { return { $: '#2', a: a, b: b }; }

function _Utils_Tuple3(a, b, c) { return { a: a, b: b, c: c }; }
function _Utils_Tuple3_UNUSED(a, b, c) { return { $: '#3', a: a, b: b, c: c }; }

function _Utils_chr(c) { return c; }
function _Utils_chr_UNUSED(c) { return new String(c); }


// RECORDS

function _Utils_update(oldRecord, updatedFields)
{
	var newRecord = {};

	for (var key in oldRecord)
	{
		newRecord[key] = oldRecord[key];
	}

	for (var key in updatedFields)
	{
		newRecord[key] = updatedFields[key];
	}

	return newRecord;
}


// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys)
{
	// append Strings
	if (typeof xs === 'string')
	{
		return xs + ys;
	}

	// append Lists
	if (!xs.b)
	{
		return ys;
	}
	var root = _List_Cons(xs.a, ys);
	xs = xs.b
	for (var curr = root; xs.b; xs = xs.b) // WHILE_CONS
	{
		curr = curr.b = _List_Cons(xs.a, ys);
	}
	return root;
}



var _List_Nil = { $: 0 };
var _List_Nil_UNUSED = { $: '[]' };

function _List_Cons(hd, tl) { return { $: 1, a: hd, b: tl }; }
function _List_Cons_UNUSED(hd, tl) { return { $: '::', a: hd, b: tl }; }


var _List_cons = F2(_List_Cons);

function _List_fromArray(arr)
{
	var out = _List_Nil;
	for (var i = arr.length; i--; )
	{
		out = _List_Cons(arr[i], out);
	}
	return out;
}

function _List_toArray(xs)
{
	for (var out = []; xs.b; xs = xs.b) // WHILE_CONS
	{
		out.push(xs.a);
	}
	return out;
}

var _List_map2 = F3(function(f, xs, ys)
{
	for (var arr = []; xs.b && ys.b; xs = xs.b, ys = ys.b) // WHILE_CONSES
	{
		arr.push(A2(f, xs.a, ys.a));
	}
	return _List_fromArray(arr);
});

var _List_map3 = F4(function(f, xs, ys, zs)
{
	for (var arr = []; xs.b && ys.b && zs.b; xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A3(f, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map4 = F5(function(f, ws, xs, ys, zs)
{
	for (var arr = []; ws.b && xs.b && ys.b && zs.b; ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A4(f, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_map5 = F6(function(f, vs, ws, xs, ys, zs)
{
	for (var arr = []; vs.b && ws.b && xs.b && ys.b && zs.b; vs = vs.b, ws = ws.b, xs = xs.b, ys = ys.b, zs = zs.b) // WHILE_CONSES
	{
		arr.push(A5(f, vs.a, ws.a, xs.a, ys.a, zs.a));
	}
	return _List_fromArray(arr);
});

var _List_sortBy = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		return _Utils_cmp(f(a), f(b));
	}));
});

var _List_sortWith = F2(function(f, xs)
{
	return _List_fromArray(_List_toArray(xs).sort(function(a, b) {
		var ord = A2(f, a, b);
		return ord === $elm$core$Basics$EQ ? 0 : ord === $elm$core$Basics$LT ? -1 : 1;
	}));
});



var _JsArray_empty = [];

function _JsArray_singleton(value)
{
    return [value];
}

function _JsArray_length(array)
{
    return array.length;
}

var _JsArray_initialize = F3(function(size, offset, func)
{
    var result = new Array(size);

    for (var i = 0; i < size; i++)
    {
        result[i] = func(offset + i);
    }

    return result;
});

var _JsArray_initializeFromList = F2(function (max, ls)
{
    var result = new Array(max);

    for (var i = 0; i < max && ls.b; i++)
    {
        result[i] = ls.a;
        ls = ls.b;
    }

    result.length = i;
    return _Utils_Tuple2(result, ls);
});

var _JsArray_unsafeGet = F2(function(index, array)
{
    return array[index];
});

var _JsArray_unsafeSet = F3(function(index, value, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[index] = value;
    return result;
});

var _JsArray_push = F2(function(value, array)
{
    var length = array.length;
    var result = new Array(length + 1);

    for (var i = 0; i < length; i++)
    {
        result[i] = array[i];
    }

    result[length] = value;
    return result;
});

var _JsArray_foldl = F3(function(func, acc, array)
{
    var length = array.length;

    for (var i = 0; i < length; i++)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_foldr = F3(function(func, acc, array)
{
    for (var i = array.length - 1; i >= 0; i--)
    {
        acc = A2(func, array[i], acc);
    }

    return acc;
});

var _JsArray_map = F2(function(func, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = func(array[i]);
    }

    return result;
});

var _JsArray_indexedMap = F3(function(func, offset, array)
{
    var length = array.length;
    var result = new Array(length);

    for (var i = 0; i < length; i++)
    {
        result[i] = A2(func, offset + i, array[i]);
    }

    return result;
});

var _JsArray_slice = F3(function(from, to, array)
{
    return array.slice(from, to);
});

var _JsArray_appendN = F3(function(n, dest, source)
{
    var destLen = dest.length;
    var itemsToCopy = n - destLen;

    if (itemsToCopy > source.length)
    {
        itemsToCopy = source.length;
    }

    var size = destLen + itemsToCopy;
    var result = new Array(size);

    for (var i = 0; i < destLen; i++)
    {
        result[i] = dest[i];
    }

    for (var i = 0; i < itemsToCopy; i++)
    {
        result[i + destLen] = source[i];
    }

    return result;
});



// LOG

var _Debug_log = F2(function(tag, value)
{
	return value;
});

var _Debug_log_UNUSED = F2(function(tag, value)
{
	console.log(tag + ': ' + _Debug_toString(value));
	return value;
});


// TODOS

function _Debug_todo(moduleName, region)
{
	return function(message) {
		_Debug_crash(8, moduleName, region, message);
	};
}

function _Debug_todoCase(moduleName, region, value)
{
	return function(message) {
		_Debug_crash(9, moduleName, region, value, message);
	};
}


// TO STRING

function _Debug_toString(value)
{
	return '<internals>';
}

function _Debug_toString_UNUSED(value)
{
	return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value)
{
	if (typeof value === 'function')
	{
		return _Debug_internalColor(ansi, '<function>');
	}

	if (typeof value === 'boolean')
	{
		return _Debug_ctorColor(ansi, value ? 'True' : 'False');
	}

	if (typeof value === 'number')
	{
		return _Debug_numberColor(ansi, value + '');
	}

	if (value instanceof String)
	{
		return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
	}

	if (typeof value === 'string')
	{
		return _Debug_stringColor(ansi, '"' + _Debug_addSlashes(value, false) + '"');
	}

	if (typeof value === 'object' && '$' in value)
	{
		var tag = value.$;

		if (typeof tag === 'number')
		{
			return _Debug_internalColor(ansi, '<internals>');
		}

		if (tag[0] === '#')
		{
			var output = [];
			for (var k in value)
			{
				if (k === '$') continue;
				output.push(_Debug_toAnsiString(ansi, value[k]));
			}
			return '(' + output.join(',') + ')';
		}

		if (tag === 'Set_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Set')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Set$toList(value));
		}

		if (tag === 'RBNode_elm_builtin' || tag === 'RBEmpty_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Dict')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Dict$toList(value));
		}

		if (tag === 'Array_elm_builtin')
		{
			return _Debug_ctorColor(ansi, 'Array')
				+ _Debug_fadeColor(ansi, '.fromList') + ' '
				+ _Debug_toAnsiString(ansi, $elm$core$Array$toList(value));
		}

		if (tag === '::' || tag === '[]')
		{
			var output = '[';

			value.b && (output += _Debug_toAnsiString(ansi, value.a), value = value.b)

			for (; value.b; value = value.b) // WHILE_CONS
			{
				output += ',' + _Debug_toAnsiString(ansi, value.a);
			}
			return output + ']';
		}

		var output = '';
		for (var i in value)
		{
			if (i === '$') continue;
			var str = _Debug_toAnsiString(ansi, value[i]);
			var c0 = str[0];
			var parenless = c0 === '{' || c0 === '(' || c0 === '[' || c0 === '<' || c0 === '"' || str.indexOf(' ') < 0;
			output += ' ' + (parenless ? str : '(' + str + ')');
		}
		return _Debug_ctorColor(ansi, tag) + output;
	}

	if (typeof DataView === 'function' && value instanceof DataView)
	{
		return _Debug_stringColor(ansi, '<' + value.byteLength + ' bytes>');
	}

	if (typeof File !== 'undefined' && value instanceof File)
	{
		return _Debug_internalColor(ansi, '<' + value.name + '>');
	}

	if (typeof value === 'object')
	{
		var output = [];
		for (var key in value)
		{
			var field = key[0] === '_' ? key.slice(1) : key;
			output.push(_Debug_fadeColor(ansi, field) + ' = ' + _Debug_toAnsiString(ansi, value[key]));
		}
		if (output.length === 0)
		{
			return '{}';
		}
		return '{ ' + output.join(', ') + ' }';
	}

	return _Debug_internalColor(ansi, '<internals>');
}

function _Debug_addSlashes(str, isChar)
{
	var s = str
		.replace(/\\/g, '\\\\')
		.replace(/\n/g, '\\n')
		.replace(/\t/g, '\\t')
		.replace(/\r/g, '\\r')
		.replace(/\v/g, '\\v')
		.replace(/\0/g, '\\0');

	if (isChar)
	{
		return s.replace(/\'/g, '\\\'');
	}
	else
	{
		return s.replace(/\"/g, '\\"');
	}
}

function _Debug_ctorColor(ansi, string)
{
	return ansi ? '\x1b[96m' + string + '\x1b[0m' : string;
}

function _Debug_numberColor(ansi, string)
{
	return ansi ? '\x1b[95m' + string + '\x1b[0m' : string;
}

function _Debug_stringColor(ansi, string)
{
	return ansi ? '\x1b[93m' + string + '\x1b[0m' : string;
}

function _Debug_charColor(ansi, string)
{
	return ansi ? '\x1b[92m' + string + '\x1b[0m' : string;
}

function _Debug_fadeColor(ansi, string)
{
	return ansi ? '\x1b[37m' + string + '\x1b[0m' : string;
}

function _Debug_internalColor(ansi, string)
{
	return ansi ? '\x1b[36m' + string + '\x1b[0m' : string;
}

function _Debug_toHexDigit(n)
{
	return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}


// CRASH


function _Debug_crash(identifier)
{
	throw new Error('https://github.com/elm/core/blob/1.0.0/hints/' + identifier + '.md');
}


function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4)
{
	switch(identifier)
	{
		case 0:
			throw new Error('What node should I take over? In JavaScript I need something like:\n\n    Elm.Main.init({\n        node: document.getElementById("elm-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.');

		case 1:
			throw new Error('Browser.application programs cannot handle URLs like this:\n\n    ' + document.location.href + '\n\nWhat is the root? The root of your file system? Try looking at this program with `elm reactor` or some other server.');

		case 2:
			var jsonErrorString = fact1;
			throw new Error('Problem with the flags given to your Elm program on initialization.\n\n' + jsonErrorString);

		case 3:
			var portName = fact1;
			throw new Error('There can only be one port named `' + portName + '`, but your program has multiple.');

		case 4:
			var portName = fact1;
			var problem = fact2;
			throw new Error('Trying to send an unexpected type of value through port `' + portName + '`:\n' + problem);

		case 5:
			throw new Error('Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Elm sense.\nRead more about this at https://package.elm-lang.org/packages/elm/core/latest/Basics#== which describes why it is this way and what the better version will look like.');

		case 6:
			var moduleName = fact1;
			throw new Error('Your page is loading multiple Elm scripts with a module named ' + moduleName + '. Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!');

		case 8:
			var moduleName = fact1;
			var region = fact2;
			var message = fact3;
			throw new Error('TODO in module `' + moduleName + '` ' + _Debug_regionToString(region) + '\n\n' + message);

		case 9:
			var moduleName = fact1;
			var region = fact2;
			var value = fact3;
			var message = fact4;
			throw new Error(
				'TODO in module `' + moduleName + '` from the `case` expression '
				+ _Debug_regionToString(region) + '\n\nIt received the following value:\n\n    '
				+ _Debug_toString(value).replace('\n', '\n    ')
				+ '\n\nBut the branch that handles it says:\n\n    ' + message.replace('\n', '\n    ')
			);

		case 10:
			throw new Error('Bug in https://github.com/elm/virtual-dom/issues');

		case 11:
			throw new Error('Cannot perform mod 0. Division by zero error.');
	}
}

function _Debug_regionToString(region)
{
	if (region.bd.aB === region.bz.aB)
	{
		return 'on line ' + region.bd.aB;
	}
	return 'on lines ' + region.bd.aB + ' through ' + region.bz.aB;
}



// MATH

var _Basics_add = F2(function(a, b) { return a + b; });
var _Basics_sub = F2(function(a, b) { return a - b; });
var _Basics_mul = F2(function(a, b) { return a * b; });
var _Basics_fdiv = F2(function(a, b) { return a / b; });
var _Basics_idiv = F2(function(a, b) { return (a / b) | 0; });
var _Basics_pow = F2(Math.pow);

var _Basics_remainderBy = F2(function(b, a) { return a % b; });

// https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/divmodnote-letter.pdf
var _Basics_modBy = F2(function(modulus, x)
{
	var answer = x % modulus;
	return modulus === 0
		? _Debug_crash(11)
		:
	((answer > 0 && modulus < 0) || (answer < 0 && modulus > 0))
		? answer + modulus
		: answer;
});


// TRIGONOMETRY

var _Basics_pi = Math.PI;
var _Basics_e = Math.E;
var _Basics_cos = Math.cos;
var _Basics_sin = Math.sin;
var _Basics_tan = Math.tan;
var _Basics_acos = Math.acos;
var _Basics_asin = Math.asin;
var _Basics_atan = Math.atan;
var _Basics_atan2 = F2(Math.atan2);


// MORE MATH

function _Basics_toFloat(x) { return x; }
function _Basics_truncate(n) { return n | 0; }
function _Basics_isInfinite(n) { return n === Infinity || n === -Infinity; }

var _Basics_ceiling = Math.ceil;
var _Basics_floor = Math.floor;
var _Basics_round = Math.round;
var _Basics_sqrt = Math.sqrt;
var _Basics_log = Math.log;
var _Basics_isNaN = isNaN;


// BOOLEANS

function _Basics_not(bool) { return !bool; }
var _Basics_and = F2(function(a, b) { return a && b; });
var _Basics_or  = F2(function(a, b) { return a || b; });
var _Basics_xor = F2(function(a, b) { return a !== b; });



var _String_cons = F2(function(chr, str)
{
	return chr + str;
});

function _String_uncons(string)
{
	var word = string.charCodeAt(0);
	return !isNaN(word)
		? $elm$core$Maybe$Just(
			0xD800 <= word && word <= 0xDBFF
				? _Utils_Tuple2(_Utils_chr(string[0] + string[1]), string.slice(2))
				: _Utils_Tuple2(_Utils_chr(string[0]), string.slice(1))
		)
		: $elm$core$Maybe$Nothing;
}

var _String_append = F2(function(a, b)
{
	return a + b;
});

function _String_length(str)
{
	return str.length;
}

var _String_map = F2(function(func, string)
{
	var len = string.length;
	var array = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = string.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			array[i] = func(_Utils_chr(string[i] + string[i+1]));
			i += 2;
			continue;
		}
		array[i] = func(_Utils_chr(string[i]));
		i++;
	}
	return array.join('');
});

var _String_filter = F2(function(isGood, str)
{
	var arr = [];
	var len = str.length;
	var i = 0;
	while (i < len)
	{
		var char = str[i];
		var word = str.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += str[i];
			i++;
		}

		if (isGood(_Utils_chr(char)))
		{
			arr.push(char);
		}
	}
	return arr.join('');
});

function _String_reverse(str)
{
	var len = str.length;
	var arr = new Array(len);
	var i = 0;
	while (i < len)
	{
		var word = str.charCodeAt(i);
		if (0xD800 <= word && word <= 0xDBFF)
		{
			arr[len - i] = str[i + 1];
			i++;
			arr[len - i] = str[i - 1];
			i++;
		}
		else
		{
			arr[len - i] = str[i];
			i++;
		}
	}
	return arr.join('');
}

var _String_foldl = F3(function(func, state, string)
{
	var len = string.length;
	var i = 0;
	while (i < len)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		i++;
		if (0xD800 <= word && word <= 0xDBFF)
		{
			char += string[i];
			i++;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_foldr = F3(function(func, state, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		state = A2(func, _Utils_chr(char), state);
	}
	return state;
});

var _String_split = F2(function(sep, str)
{
	return str.split(sep);
});

var _String_join = F2(function(sep, strs)
{
	return strs.join(sep);
});

var _String_slice = F3(function(start, end, str) {
	return str.slice(start, end);
});

function _String_trim(str)
{
	return str.trim();
}

function _String_trimLeft(str)
{
	return str.replace(/^\s+/, '');
}

function _String_trimRight(str)
{
	return str.replace(/\s+$/, '');
}

function _String_words(str)
{
	return _List_fromArray(str.trim().split(/\s+/g));
}

function _String_lines(str)
{
	return _List_fromArray(str.split(/\r\n|\r|\n/g));
}

function _String_toUpper(str)
{
	return str.toUpperCase();
}

function _String_toLower(str)
{
	return str.toLowerCase();
}

var _String_any = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (isGood(_Utils_chr(char)))
		{
			return true;
		}
	}
	return false;
});

var _String_all = F2(function(isGood, string)
{
	var i = string.length;
	while (i--)
	{
		var char = string[i];
		var word = string.charCodeAt(i);
		if (0xDC00 <= word && word <= 0xDFFF)
		{
			i--;
			char = string[i] + char;
		}
		if (!isGood(_Utils_chr(char)))
		{
			return false;
		}
	}
	return true;
});

var _String_contains = F2(function(sub, str)
{
	return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function(sub, str)
{
	return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function(sub, str)
{
	return str.length >= sub.length &&
		str.lastIndexOf(sub) === str.length - sub.length;
});

var _String_indexes = F2(function(sub, str)
{
	var subLen = sub.length;

	if (subLen < 1)
	{
		return _List_Nil;
	}

	var i = 0;
	var is = [];

	while ((i = str.indexOf(sub, i)) > -1)
	{
		is.push(i);
		i = i + subLen;
	}

	return _List_fromArray(is);
});


// TO STRING

function _String_fromNumber(number)
{
	return number + '';
}


// INT CONVERSIONS

function _String_toInt(str)
{
	var total = 0;
	var code0 = str.charCodeAt(0);
	var start = code0 == 0x2B /* + */ || code0 == 0x2D /* - */ ? 1 : 0;

	for (var i = start; i < str.length; ++i)
	{
		var code = str.charCodeAt(i);
		if (code < 0x30 || 0x39 < code)
		{
			return $elm$core$Maybe$Nothing;
		}
		total = 10 * total + code - 0x30;
	}

	return i == start
		? $elm$core$Maybe$Nothing
		: $elm$core$Maybe$Just(code0 == 0x2D ? -total : total);
}


// FLOAT CONVERSIONS

function _String_toFloat(s)
{
	// check if it is a hex, octal, or binary number
	if (s.length === 0 || /[\sxbo]/.test(s))
	{
		return $elm$core$Maybe$Nothing;
	}
	var n = +s;
	// faster isNaN check
	return n === n ? $elm$core$Maybe$Just(n) : $elm$core$Maybe$Nothing;
}

function _String_fromList(chars)
{
	return _List_toArray(chars).join('');
}




function _Char_toCode(char)
{
	var code = char.charCodeAt(0);
	if (0xD800 <= code && code <= 0xDBFF)
	{
		return (code - 0xD800) * 0x400 + char.charCodeAt(1) - 0xDC00 + 0x10000
	}
	return code;
}

function _Char_fromCode(code)
{
	return _Utils_chr(
		(code < 0 || 0x10FFFF < code)
			? '\uFFFD'
			:
		(code <= 0xFFFF)
			? String.fromCharCode(code)
			:
		(code -= 0x10000,
			String.fromCharCode(Math.floor(code / 0x400) + 0xD800, code % 0x400 + 0xDC00)
		)
	);
}

function _Char_toUpper(char)
{
	return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char)
{
	return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char)
{
	return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char)
{
	return _Utils_chr(char.toLocaleLowerCase());
}



/**_UNUSED/
function _Json_errorToString(error)
{
	return $elm$json$Json$Decode$errorToString(error);
}
//*/


// CORE DECODERS

function _Json_succeed(msg)
{
	return {
		$: 0,
		a: msg
	};
}

function _Json_fail(msg)
{
	return {
		$: 1,
		a: msg
	};
}

function _Json_decodePrim(decoder)
{
	return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function(value) {
	return (typeof value !== 'number')
		? _Json_expecting('an INT', value)
		:
	(-2147483647 < value && value < 2147483647 && (value | 0) === value)
		? $elm$core$Result$Ok(value)
		:
	(isFinite(value) && !(value % 1))
		? $elm$core$Result$Ok(value)
		: _Json_expecting('an INT', value);
});

var _Json_decodeBool = _Json_decodePrim(function(value) {
	return (typeof value === 'boolean')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a BOOL', value);
});

var _Json_decodeFloat = _Json_decodePrim(function(value) {
	return (typeof value === 'number')
		? $elm$core$Result$Ok(value)
		: _Json_expecting('a FLOAT', value);
});

var _Json_decodeValue = _Json_decodePrim(function(value) {
	return $elm$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function(value) {
	return (typeof value === 'string')
		? $elm$core$Result$Ok(value)
		: (value instanceof String)
			? $elm$core$Result$Ok(value + '')
			: _Json_expecting('a STRING', value);
});

function _Json_decodeList(decoder) { return { $: 3, b: decoder }; }
function _Json_decodeArray(decoder) { return { $: 4, b: decoder }; }

function _Json_decodeNull(value) { return { $: 5, c: value }; }

var _Json_decodeField = F2(function(field, decoder)
{
	return {
		$: 6,
		d: field,
		b: decoder
	};
});

var _Json_decodeIndex = F2(function(index, decoder)
{
	return {
		$: 7,
		e: index,
		b: decoder
	};
});

function _Json_decodeKeyValuePairs(decoder)
{
	return {
		$: 8,
		b: decoder
	};
}

function _Json_mapMany(f, decoders)
{
	return {
		$: 9,
		f: f,
		g: decoders
	};
}

var _Json_andThen = F2(function(callback, decoder)
{
	return {
		$: 10,
		b: decoder,
		h: callback
	};
});

function _Json_oneOf(decoders)
{
	return {
		$: 11,
		g: decoders
	};
}


// DECODING OBJECTS

var _Json_map1 = F2(function(f, d1)
{
	return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function(f, d1, d2)
{
	return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function(f, d1, d2, d3)
{
	return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function(f, d1, d2, d3, d4)
{
	return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function(f, d1, d2, d3, d4, d5)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function(f, d1, d2, d3, d4, d5, d6)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function(f, d1, d2, d3, d4, d5, d6, d7)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function(f, d1, d2, d3, d4, d5, d6, d7, d8)
{
	return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});


// DECODE

var _Json_runOnString = F2(function(decoder, string)
{
	try
	{
		var value = JSON.parse(string);
		return _Json_runHelp(decoder, value);
	}
	catch (e)
	{
		return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'This is not valid JSON! ' + e.message, _Json_wrap(string)));
	}
});

var _Json_run = F2(function(decoder, value)
{
	return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value)
{
	switch (decoder.$)
	{
		case 2:
			return decoder.b(value);

		case 5:
			return (value === null)
				? $elm$core$Result$Ok(decoder.c)
				: _Json_expecting('null', value);

		case 3:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('a LIST', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _List_fromArray);

		case 4:
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			return _Json_runArrayDecoder(decoder.b, value, _Json_toElmArray);

		case 6:
			var field = decoder.d;
			if (typeof value !== 'object' || value === null || !(field in value))
			{
				return _Json_expecting('an OBJECT with a field named `' + field + '`', value);
			}
			var result = _Json_runHelp(decoder.b, value[field]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, field, result.a));

		case 7:
			var index = decoder.e;
			if (!_Json_isArray(value))
			{
				return _Json_expecting('an ARRAY', value);
			}
			if (index >= value.length)
			{
				return _Json_expecting('a LONGER array. Need index ' + index + ' but only see ' + value.length + ' entries', value);
			}
			var result = _Json_runHelp(decoder.b, value[index]);
			return ($elm$core$Result$isOk(result)) ? result : $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, index, result.a));

		case 8:
			if (typeof value !== 'object' || value === null || _Json_isArray(value))
			{
				return _Json_expecting('an OBJECT', value);
			}

			var keyValuePairs = _List_Nil;
			// TODO test perf of Object.keys and switch when support is good enough
			for (var key in value)
			{
				if (value.hasOwnProperty(key))
				{
					var result = _Json_runHelp(decoder.b, value[key]);
					if (!$elm$core$Result$isOk(result))
					{
						return $elm$core$Result$Err(A2($elm$json$Json$Decode$Field, key, result.a));
					}
					keyValuePairs = _List_Cons(_Utils_Tuple2(key, result.a), keyValuePairs);
				}
			}
			return $elm$core$Result$Ok($elm$core$List$reverse(keyValuePairs));

		case 9:
			var answer = decoder.f;
			var decoders = decoder.g;
			for (var i = 0; i < decoders.length; i++)
			{
				var result = _Json_runHelp(decoders[i], value);
				if (!$elm$core$Result$isOk(result))
				{
					return result;
				}
				answer = answer(result.a);
			}
			return $elm$core$Result$Ok(answer);

		case 10:
			var result = _Json_runHelp(decoder.b, value);
			return (!$elm$core$Result$isOk(result))
				? result
				: _Json_runHelp(decoder.h(result.a), value);

		case 11:
			var errors = _List_Nil;
			for (var temp = decoder.g; temp.b; temp = temp.b) // WHILE_CONS
			{
				var result = _Json_runHelp(temp.a, value);
				if ($elm$core$Result$isOk(result))
				{
					return result;
				}
				errors = _List_Cons(result.a, errors);
			}
			return $elm$core$Result$Err($elm$json$Json$Decode$OneOf($elm$core$List$reverse(errors)));

		case 1:
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

		case 0:
			return $elm$core$Result$Ok(decoder.a);
	}
}

function _Json_runArrayDecoder(decoder, value, toElmValue)
{
	var len = value.length;
	var array = new Array(len);
	for (var i = 0; i < len; i++)
	{
		var result = _Json_runHelp(decoder, value[i]);
		if (!$elm$core$Result$isOk(result))
		{
			return $elm$core$Result$Err(A2($elm$json$Json$Decode$Index, i, result.a));
		}
		array[i] = result.a;
	}
	return $elm$core$Result$Ok(toElmValue(array));
}

function _Json_isArray(value)
{
	return Array.isArray(value) || (typeof FileList !== 'undefined' && value instanceof FileList);
}

function _Json_toElmArray(array)
{
	return A2($elm$core$Array$initialize, array.length, function(i) { return array[i]; });
}

function _Json_expecting(type, value)
{
	return $elm$core$Result$Err(A2($elm$json$Json$Decode$Failure, 'Expecting ' + type, _Json_wrap(value)));
}


// EQUALITY

function _Json_equality(x, y)
{
	if (x === y)
	{
		return true;
	}

	if (x.$ !== y.$)
	{
		return false;
	}

	switch (x.$)
	{
		case 0:
		case 1:
			return x.a === y.a;

		case 2:
			return x.b === y.b;

		case 5:
			return x.c === y.c;

		case 3:
		case 4:
		case 8:
			return _Json_equality(x.b, y.b);

		case 6:
			return x.d === y.d && _Json_equality(x.b, y.b);

		case 7:
			return x.e === y.e && _Json_equality(x.b, y.b);

		case 9:
			return x.f === y.f && _Json_listEquality(x.g, y.g);

		case 10:
			return x.h === y.h && _Json_equality(x.b, y.b);

		case 11:
			return _Json_listEquality(x.g, y.g);
	}
}

function _Json_listEquality(aDecoders, bDecoders)
{
	var len = aDecoders.length;
	if (len !== bDecoders.length)
	{
		return false;
	}
	for (var i = 0; i < len; i++)
	{
		if (!_Json_equality(aDecoders[i], bDecoders[i]))
		{
			return false;
		}
	}
	return true;
}


// ENCODE

var _Json_encode = F2(function(indentLevel, value)
{
	return JSON.stringify(_Json_unwrap(value), null, indentLevel) + '';
});

function _Json_wrap_UNUSED(value) { return { $: 0, a: value }; }
function _Json_unwrap_UNUSED(value) { return value.a; }

function _Json_wrap(value) { return value; }
function _Json_unwrap(value) { return value; }

function _Json_emptyArray() { return []; }
function _Json_emptyObject() { return {}; }

var _Json_addField = F3(function(key, value, object)
{
	object[key] = _Json_unwrap(value);
	return object;
});

function _Json_addEntry(func)
{
	return F2(function(entry, array)
	{
		array.push(_Json_unwrap(func(entry)));
		return array;
	});
}

var _Json_encodeNull = _Json_wrap(null);



// TASKS

function _Scheduler_succeed(value)
{
	return {
		$: 0,
		a: value
	};
}

function _Scheduler_fail(error)
{
	return {
		$: 1,
		a: error
	};
}

function _Scheduler_binding(callback)
{
	return {
		$: 2,
		b: callback,
		c: null
	};
}

var _Scheduler_andThen = F2(function(callback, task)
{
	return {
		$: 3,
		b: callback,
		d: task
	};
});

var _Scheduler_onError = F2(function(callback, task)
{
	return {
		$: 4,
		b: callback,
		d: task
	};
});

function _Scheduler_receive(callback)
{
	return {
		$: 5,
		b: callback
	};
}


// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task)
{
	var proc = {
		$: 0,
		e: _Scheduler_guid++,
		f: task,
		g: null,
		h: []
	};

	_Scheduler_enqueue(proc);

	return proc;
}

function _Scheduler_spawn(task)
{
	return _Scheduler_binding(function(callback) {
		callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
	});
}

function _Scheduler_rawSend(proc, msg)
{
	proc.h.push(msg);
	_Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function(proc, msg)
{
	return _Scheduler_binding(function(callback) {
		_Scheduler_rawSend(proc, msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});

function _Scheduler_kill(proc)
{
	return _Scheduler_binding(function(callback) {
		var task = proc.f;
		if (task.$ === 2 && task.c)
		{
			task.c();
		}

		proc.f = null;

		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
}


/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/


var _Scheduler_working = false;
var _Scheduler_queue = [];


function _Scheduler_enqueue(proc)
{
	_Scheduler_queue.push(proc);
	if (_Scheduler_working)
	{
		return;
	}
	_Scheduler_working = true;
	while (proc = _Scheduler_queue.shift())
	{
		_Scheduler_step(proc);
	}
	_Scheduler_working = false;
}


function _Scheduler_step(proc)
{
	while (proc.f)
	{
		var rootTag = proc.f.$;
		if (rootTag === 0 || rootTag === 1)
		{
			while (proc.g && proc.g.$ !== rootTag)
			{
				proc.g = proc.g.i;
			}
			if (!proc.g)
			{
				return;
			}
			proc.f = proc.g.b(proc.f.a);
			proc.g = proc.g.i;
		}
		else if (rootTag === 2)
		{
			proc.f.c = proc.f.b(function(newRoot) {
				proc.f = newRoot;
				_Scheduler_enqueue(proc);
			});
			return;
		}
		else if (rootTag === 5)
		{
			if (proc.h.length === 0)
			{
				return;
			}
			proc.f = proc.f.b(proc.h.shift());
		}
		else // if (rootTag === 3 || rootTag === 4)
		{
			proc.g = {
				$: rootTag === 3 ? 0 : 1,
				b: proc.f.b,
				i: proc.g
			};
			proc.f = proc.f.d;
		}
	}
}



function _Process_sleep(time)
{
	return _Scheduler_binding(function(callback) {
		var id = setTimeout(function() {
			callback(_Scheduler_succeed(_Utils_Tuple0));
		}, time);

		return function() { clearTimeout(id); };
	});
}




// PROGRAMS


var _Platform_worker = F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cH,
		impl.c1,
		impl.c_,
		function() { return function() {} }
	);
});



// INITIALIZE A PROGRAM


function _Platform_initialize(flagDecoder, args, init, update, subscriptions, stepperBuilder)
{
	var result = A2(_Json_run, flagDecoder, _Json_wrap(args ? args['flags'] : undefined));
	$elm$core$Result$isOk(result) || _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
	var managers = {};
	var initPair = init(result.a);
	var model = initPair.a;
	var stepper = stepperBuilder(sendToApp, model);
	var ports = _Platform_setupEffects(managers, sendToApp);

	function sendToApp(msg, viewMetadata)
	{
		var pair = A2(update, msg, model);
		stepper(model = pair.a, viewMetadata);
		_Platform_enqueueEffects(managers, pair.b, subscriptions(model));
	}

	_Platform_enqueueEffects(managers, initPair.b, subscriptions(model));

	return ports ? { ports: ports } : {};
}



// TRACK PRELOADS
//
// This is used by code in elm/browser and elm/http
// to register any HTTP requests that are triggered by init.
//


var _Platform_preload;


function _Platform_registerPreload(url)
{
	_Platform_preload.add(url);
}



// EFFECT MANAGERS


var _Platform_effectManagers = {};


function _Platform_setupEffects(managers, sendToApp)
{
	var ports;

	// setup all necessary effect managers
	for (var key in _Platform_effectManagers)
	{
		var manager = _Platform_effectManagers[key];

		if (manager.a)
		{
			ports = ports || {};
			ports[key] = manager.a(key, sendToApp);
		}

		managers[key] = _Platform_instantiateManager(manager, sendToApp);
	}

	return ports;
}


function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap)
{
	return {
		b: init,
		c: onEffects,
		d: onSelfMsg,
		e: cmdMap,
		f: subMap
	};
}


function _Platform_instantiateManager(info, sendToApp)
{
	var router = {
		g: sendToApp,
		h: undefined
	};

	var onEffects = info.c;
	var onSelfMsg = info.d;
	var cmdMap = info.e;
	var subMap = info.f;

	function loop(state)
	{
		return A2(_Scheduler_andThen, loop, _Scheduler_receive(function(msg)
		{
			var value = msg.a;

			if (msg.$ === 0)
			{
				return A3(onSelfMsg, router, value, state);
			}

			return cmdMap && subMap
				? A4(onEffects, router, value.i, value.j, state)
				: A3(onEffects, router, cmdMap ? value.i : value.j, state);
		}));
	}

	return router.h = _Scheduler_rawSpawn(A2(_Scheduler_andThen, loop, info.b));
}



// ROUTING


var _Platform_sendToApp = F2(function(router, msg)
{
	return _Scheduler_binding(function(callback)
	{
		router.g(msg);
		callback(_Scheduler_succeed(_Utils_Tuple0));
	});
});


var _Platform_sendToSelf = F2(function(router, msg)
{
	return A2(_Scheduler_send, router.h, {
		$: 0,
		a: msg
	});
});



// BAGS


function _Platform_leaf(home)
{
	return function(value)
	{
		return {
			$: 1,
			k: home,
			l: value
		};
	};
}


function _Platform_batch(list)
{
	return {
		$: 2,
		m: list
	};
}


var _Platform_map = F2(function(tagger, bag)
{
	return {
		$: 3,
		n: tagger,
		o: bag
	}
});



// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/elm/core/issues/980
//   https://github.com/elm/core/pull/981
//   https://github.com/elm/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.


// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;


function _Platform_enqueueEffects(managers, cmdBag, subBag)
{
	_Platform_effectsQueue.push({ p: managers, q: cmdBag, r: subBag });

	if (_Platform_effectsActive) return;

	_Platform_effectsActive = true;
	for (var fx; fx = _Platform_effectsQueue.shift(); )
	{
		_Platform_dispatchEffects(fx.p, fx.q, fx.r);
	}
	_Platform_effectsActive = false;
}


function _Platform_dispatchEffects(managers, cmdBag, subBag)
{
	var effectsDict = {};
	_Platform_gatherEffects(true, cmdBag, effectsDict, null);
	_Platform_gatherEffects(false, subBag, effectsDict, null);

	for (var home in managers)
	{
		_Scheduler_rawSend(managers[home], {
			$: 'fx',
			a: effectsDict[home] || { i: _List_Nil, j: _List_Nil }
		});
	}
}


function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers)
{
	switch (bag.$)
	{
		case 1:
			var home = bag.k;
			var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
			effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
			return;

		case 2:
			for (var list = bag.m; list.b; list = list.b) // WHILE_CONS
			{
				_Platform_gatherEffects(isCmd, list.a, effectsDict, taggers);
			}
			return;

		case 3:
			_Platform_gatherEffects(isCmd, bag.o, effectsDict, {
				s: bag.n,
				t: taggers
			});
			return;
	}
}


function _Platform_toEffect(isCmd, home, taggers, value)
{
	function applyTaggers(x)
	{
		for (var temp = taggers; temp; temp = temp.t)
		{
			x = temp.s(x);
		}
		return x;
	}

	var map = isCmd
		? _Platform_effectManagers[home].e
		: _Platform_effectManagers[home].f;

	return A2(map, applyTaggers, value)
}


function _Platform_insert(isCmd, newEffect, effects)
{
	effects = effects || { i: _List_Nil, j: _List_Nil };

	isCmd
		? (effects.i = _List_Cons(newEffect, effects.i))
		: (effects.j = _List_Cons(newEffect, effects.j));

	return effects;
}



// PORTS


function _Platform_checkPortName(name)
{
	if (_Platform_effectManagers[name])
	{
		_Debug_crash(3, name)
	}
}



// OUTGOING PORTS


function _Platform_outgoingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		e: _Platform_outgoingPortMap,
		u: converter,
		a: _Platform_setupOutgoingPort
	};
	return _Platform_leaf(name);
}


var _Platform_outgoingPortMap = F2(function(tagger, value) { return value; });


function _Platform_setupOutgoingPort(name)
{
	var subs = [];
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Process_sleep(0);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, cmdList, state)
	{
		for ( ; cmdList.b; cmdList = cmdList.b) // WHILE_CONS
		{
			// grab a separate reference to subs in case unsubscribe is called
			var currentSubs = subs;
			var value = _Json_unwrap(converter(cmdList.a));
			for (var i = 0; i < currentSubs.length; i++)
			{
				currentSubs[i](value);
			}
		}
		return init;
	});

	// PUBLIC API

	function subscribe(callback)
	{
		subs.push(callback);
	}

	function unsubscribe(callback)
	{
		// copy subs into a new array in case unsubscribe is called within a
		// subscribed callback
		subs = subs.slice();
		var index = subs.indexOf(callback);
		if (index >= 0)
		{
			subs.splice(index, 1);
		}
	}

	return {
		subscribe: subscribe,
		unsubscribe: unsubscribe
	};
}



// INCOMING PORTS


function _Platform_incomingPort(name, converter)
{
	_Platform_checkPortName(name);
	_Platform_effectManagers[name] = {
		f: _Platform_incomingPortMap,
		u: converter,
		a: _Platform_setupIncomingPort
	};
	return _Platform_leaf(name);
}


var _Platform_incomingPortMap = F2(function(tagger, finalTagger)
{
	return function(value)
	{
		return tagger(finalTagger(value));
	};
});


function _Platform_setupIncomingPort(name, sendToApp)
{
	var subs = _List_Nil;
	var converter = _Platform_effectManagers[name].u;

	// CREATE MANAGER

	var init = _Scheduler_succeed(null);

	_Platform_effectManagers[name].b = init;
	_Platform_effectManagers[name].c = F3(function(router, subList, state)
	{
		subs = subList;
		return init;
	});

	// PUBLIC API

	function send(incomingValue)
	{
		var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

		$elm$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

		var value = result.a;
		for (var temp = subs; temp.b; temp = temp.b) // WHILE_CONS
		{
			sendToApp(temp.a(value));
		}
	}

	return { send: send };
}



// EXPORT ELM MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//


function _Platform_export(exports)
{
	scope['Elm']
		? _Platform_mergeExportsProd(scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsProd(obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6)
				: _Platform_mergeExportsProd(obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}


function _Platform_export_UNUSED(exports)
{
	scope['Elm']
		? _Platform_mergeExportsDebug('Elm', scope['Elm'], exports)
		: scope['Elm'] = exports;
}


function _Platform_mergeExportsDebug(moduleName, obj, exports)
{
	for (var name in exports)
	{
		(name in obj)
			? (name == 'init')
				? _Debug_crash(6, moduleName)
				: _Platform_mergeExportsDebug(moduleName + '.' + name, obj[name], exports[name])
			: (obj[name] = exports[name]);
	}
}




// HELPERS


var _VirtualDom_divertHrefToApp;

var _VirtualDom_doc = typeof document !== 'undefined' ? document : {};


function _VirtualDom_appendChild(parent, child)
{
	parent.appendChild(child);
}

var _VirtualDom_init = F4(function(virtualNode, flagDecoder, debugMetadata, args)
{
	// NOTE: this function needs _Platform_export available to work

	/**/
	var node = args['node'];
	//*/
	/**_UNUSED/
	var node = args && args['node'] ? args['node'] : _Debug_crash(0);
	//*/

	node.parentNode.replaceChild(
		_VirtualDom_render(virtualNode, function() {}),
		node
	);

	return {};
});



// TEXT


function _VirtualDom_text(string)
{
	return {
		$: 0,
		a: string
	};
}



// NODE


var _VirtualDom_nodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 1,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_node = _VirtualDom_nodeNS(undefined);



// KEYED NODE


var _VirtualDom_keyedNodeNS = F2(function(namespace, tag)
{
	return F2(function(factList, kidList)
	{
		for (var kids = [], descendantsCount = 0; kidList.b; kidList = kidList.b) // WHILE_CONS
		{
			var kid = kidList.a;
			descendantsCount += (kid.b.b || 0);
			kids.push(kid);
		}
		descendantsCount += kids.length;

		return {
			$: 2,
			c: tag,
			d: _VirtualDom_organizeFacts(factList),
			e: kids,
			f: namespace,
			b: descendantsCount
		};
	});
});


var _VirtualDom_keyedNode = _VirtualDom_keyedNodeNS(undefined);



// CUSTOM


function _VirtualDom_custom(factList, model, render, diff)
{
	return {
		$: 3,
		d: _VirtualDom_organizeFacts(factList),
		g: model,
		h: render,
		i: diff
	};
}



// MAP


var _VirtualDom_map = F2(function(tagger, node)
{
	return {
		$: 4,
		j: tagger,
		k: node,
		b: 1 + (node.b || 0)
	};
});



// LAZY


function _VirtualDom_thunk(refs, thunk)
{
	return {
		$: 5,
		l: refs,
		m: thunk,
		k: undefined
	};
}

var _VirtualDom_lazy = F2(function(func, a)
{
	return _VirtualDom_thunk([func, a], function() {
		return func(a);
	});
});

var _VirtualDom_lazy2 = F3(function(func, a, b)
{
	return _VirtualDom_thunk([func, a, b], function() {
		return A2(func, a, b);
	});
});

var _VirtualDom_lazy3 = F4(function(func, a, b, c)
{
	return _VirtualDom_thunk([func, a, b, c], function() {
		return A3(func, a, b, c);
	});
});

var _VirtualDom_lazy4 = F5(function(func, a, b, c, d)
{
	return _VirtualDom_thunk([func, a, b, c, d], function() {
		return A4(func, a, b, c, d);
	});
});

var _VirtualDom_lazy5 = F6(function(func, a, b, c, d, e)
{
	return _VirtualDom_thunk([func, a, b, c, d, e], function() {
		return A5(func, a, b, c, d, e);
	});
});

var _VirtualDom_lazy6 = F7(function(func, a, b, c, d, e, f)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f], function() {
		return A6(func, a, b, c, d, e, f);
	});
});

var _VirtualDom_lazy7 = F8(function(func, a, b, c, d, e, f, g)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g], function() {
		return A7(func, a, b, c, d, e, f, g);
	});
});

var _VirtualDom_lazy8 = F9(function(func, a, b, c, d, e, f, g, h)
{
	return _VirtualDom_thunk([func, a, b, c, d, e, f, g, h], function() {
		return A8(func, a, b, c, d, e, f, g, h);
	});
});



// FACTS


var _VirtualDom_on = F2(function(key, handler)
{
	return {
		$: 'a0',
		n: key,
		o: handler
	};
});
var _VirtualDom_style = F2(function(key, value)
{
	return {
		$: 'a1',
		n: key,
		o: value
	};
});
var _VirtualDom_property = F2(function(key, value)
{
	return {
		$: 'a2',
		n: key,
		o: value
	};
});
var _VirtualDom_attribute = F2(function(key, value)
{
	return {
		$: 'a3',
		n: key,
		o: value
	};
});
var _VirtualDom_attributeNS = F3(function(namespace, key, value)
{
	return {
		$: 'a4',
		n: key,
		o: { f: namespace, o: value }
	};
});



// XSS ATTACK VECTOR CHECKS
//
// For some reason, tabs can appear in href protocols and it still works.
// So '\tjava\tSCRIPT:alert("!!!")' and 'javascript:alert("!!!")' are the same
// in practice. That is why _VirtualDom_RE_js and _VirtualDom_RE_js_html look
// so freaky.
//
// Pulling the regular expressions out to the top level gives a slight speed
// boost in small benchmarks (4-10%) but hoisting values to reduce allocation
// can be unpredictable in large programs where JIT may have a harder time with
// functions are not fully self-contained. The benefit is more that the js and
// js_html ones are so weird that I prefer to see them near each other.


var _VirtualDom_RE_script = /^script$/i;
var _VirtualDom_RE_on_formAction = /^(on|formAction$)/i;
var _VirtualDom_RE_js = /^\s*j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:/i;
var _VirtualDom_RE_js_html = /^\s*(j\s*a\s*v\s*a\s*s\s*c\s*r\s*i\s*p\s*t\s*:|d\s*a\s*t\s*a\s*:\s*t\s*e\s*x\s*t\s*\/\s*h\s*t\s*m\s*l\s*(,|;))/i;


function _VirtualDom_noScript(tag)
{
	return _VirtualDom_RE_script.test(tag) ? 'p' : tag;
}

function _VirtualDom_noOnOrFormAction(key)
{
	return _VirtualDom_RE_on_formAction.test(key) ? 'data-' + key : key;
}

function _VirtualDom_noInnerHtmlOrFormAction(key)
{
	return key == 'innerHTML' || key == 'formAction' ? 'data-' + key : key;
}

function _VirtualDom_noJavaScriptUri(value)
{
	return _VirtualDom_RE_js.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlUri(value)
{
	return _VirtualDom_RE_js_html.test(value)
		? /**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		: value;
}

function _VirtualDom_noJavaScriptOrHtmlJson(value)
{
	return (typeof _Json_unwrap(value) === 'string' && _VirtualDom_RE_js_html.test(_Json_unwrap(value)))
		? _Json_wrap(
			/**/''//*//**_UNUSED/'javascript:alert("This is an XSS vector. Please use ports or web components instead.")'//*/
		) : value;
}



// MAP FACTS


var _VirtualDom_mapAttribute = F2(function(func, attr)
{
	return (attr.$ === 'a0')
		? A2(_VirtualDom_on, attr.n, _VirtualDom_mapHandler(func, attr.o))
		: attr;
});

function _VirtualDom_mapHandler(func, handler)
{
	var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

	// 0 = Normal
	// 1 = MayStopPropagation
	// 2 = MayPreventDefault
	// 3 = Custom

	return {
		$: handler.$,
		a:
			!tag
				? A2($elm$json$Json$Decode$map, func, handler.a)
				:
			A3($elm$json$Json$Decode$map2,
				tag < 3
					? _VirtualDom_mapEventTuple
					: _VirtualDom_mapEventRecord,
				$elm$json$Json$Decode$succeed(func),
				handler.a
			)
	};
}

var _VirtualDom_mapEventTuple = F2(function(func, tuple)
{
	return _Utils_Tuple2(func(tuple.a), tuple.b);
});

var _VirtualDom_mapEventRecord = F2(function(func, record)
{
	return {
		J: func(record.J),
		be: record.be,
		bb: record.bb
	}
});



// ORGANIZE FACTS


function _VirtualDom_organizeFacts(factList)
{
	for (var facts = {}; factList.b; factList = factList.b) // WHILE_CONS
	{
		var entry = factList.a;

		var tag = entry.$;
		var key = entry.n;
		var value = entry.o;

		if (tag === 'a2')
		{
			(key === 'className')
				? _VirtualDom_addClass(facts, key, _Json_unwrap(value))
				: facts[key] = _Json_unwrap(value);

			continue;
		}

		var subFacts = facts[tag] || (facts[tag] = {});
		(tag === 'a3' && key === 'class')
			? _VirtualDom_addClass(subFacts, key, value)
			: subFacts[key] = value;
	}

	return facts;
}

function _VirtualDom_addClass(object, key, newClass)
{
	var classes = object[key];
	object[key] = classes ? classes + ' ' + newClass : newClass;
}



// RENDER


function _VirtualDom_render(vNode, eventNode)
{
	var tag = vNode.$;

	if (tag === 5)
	{
		return _VirtualDom_render(vNode.k || (vNode.k = vNode.m()), eventNode);
	}

	if (tag === 0)
	{
		return _VirtualDom_doc.createTextNode(vNode.a);
	}

	if (tag === 4)
	{
		var subNode = vNode.k;
		var tagger = vNode.j;

		while (subNode.$ === 4)
		{
			typeof tagger !== 'object'
				? tagger = [tagger, subNode.j]
				: tagger.push(subNode.j);

			subNode = subNode.k;
		}

		var subEventRoot = { j: tagger, p: eventNode };
		var domNode = _VirtualDom_render(subNode, subEventRoot);
		domNode.elm_event_node_ref = subEventRoot;
		return domNode;
	}

	if (tag === 3)
	{
		var domNode = vNode.h(vNode.g);
		_VirtualDom_applyFacts(domNode, eventNode, vNode.d);
		return domNode;
	}

	// at this point `tag` must be 1 or 2

	var domNode = vNode.f
		? _VirtualDom_doc.createElementNS(vNode.f, vNode.c)
		: _VirtualDom_doc.createElement(vNode.c);

	if (_VirtualDom_divertHrefToApp && vNode.c == 'a')
	{
		domNode.addEventListener('click', _VirtualDom_divertHrefToApp(domNode));
	}

	_VirtualDom_applyFacts(domNode, eventNode, vNode.d);

	for (var kids = vNode.e, i = 0; i < kids.length; i++)
	{
		_VirtualDom_appendChild(domNode, _VirtualDom_render(tag === 1 ? kids[i] : kids[i].b, eventNode));
	}

	return domNode;
}



// APPLY FACTS


function _VirtualDom_applyFacts(domNode, eventNode, facts)
{
	for (var key in facts)
	{
		var value = facts[key];

		key === 'a1'
			? _VirtualDom_applyStyles(domNode, value)
			:
		key === 'a0'
			? _VirtualDom_applyEvents(domNode, eventNode, value)
			:
		key === 'a3'
			? _VirtualDom_applyAttrs(domNode, value)
			:
		key === 'a4'
			? _VirtualDom_applyAttrsNS(domNode, value)
			:
		((key !== 'value' && key !== 'checked') || domNode[key] !== value) && (domNode[key] = value);
	}
}



// APPLY STYLES


function _VirtualDom_applyStyles(domNode, styles)
{
	var domNodeStyle = domNode.style;

	for (var key in styles)
	{
		domNodeStyle[key] = styles[key];
	}
}



// APPLY ATTRS


function _VirtualDom_applyAttrs(domNode, attrs)
{
	for (var key in attrs)
	{
		var value = attrs[key];
		typeof value !== 'undefined'
			? domNode.setAttribute(key, value)
			: domNode.removeAttribute(key);
	}
}



// APPLY NAMESPACED ATTRS


function _VirtualDom_applyAttrsNS(domNode, nsAttrs)
{
	for (var key in nsAttrs)
	{
		var pair = nsAttrs[key];
		var namespace = pair.f;
		var value = pair.o;

		typeof value !== 'undefined'
			? domNode.setAttributeNS(namespace, key, value)
			: domNode.removeAttributeNS(namespace, key);
	}
}



// APPLY EVENTS


function _VirtualDom_applyEvents(domNode, eventNode, events)
{
	var allCallbacks = domNode.elmFs || (domNode.elmFs = {});

	for (var key in events)
	{
		var newHandler = events[key];
		var oldCallback = allCallbacks[key];

		if (!newHandler)
		{
			domNode.removeEventListener(key, oldCallback);
			allCallbacks[key] = undefined;
			continue;
		}

		if (oldCallback)
		{
			var oldHandler = oldCallback.q;
			if (oldHandler.$ === newHandler.$)
			{
				oldCallback.q = newHandler;
				continue;
			}
			domNode.removeEventListener(key, oldCallback);
		}

		oldCallback = _VirtualDom_makeCallback(eventNode, newHandler);
		domNode.addEventListener(key, oldCallback,
			_VirtualDom_passiveSupported
			&& { passive: $elm$virtual_dom$VirtualDom$toHandlerInt(newHandler) < 2 }
		);
		allCallbacks[key] = oldCallback;
	}
}



// PASSIVE EVENTS


var _VirtualDom_passiveSupported;

try
{
	window.addEventListener('t', null, Object.defineProperty({}, 'passive', {
		get: function() { _VirtualDom_passiveSupported = true; }
	}));
}
catch(e) {}



// EVENT HANDLERS


function _VirtualDom_makeCallback(eventNode, initialHandler)
{
	function callback(event)
	{
		var handler = callback.q;
		var result = _Json_runHelp(handler.a, event);

		if (!$elm$core$Result$isOk(result))
		{
			return;
		}

		var tag = $elm$virtual_dom$VirtualDom$toHandlerInt(handler);

		// 0 = Normal
		// 1 = MayStopPropagation
		// 2 = MayPreventDefault
		// 3 = Custom

		var value = result.a;
		var message = !tag ? value : tag < 3 ? value.a : value.J;
		var stopPropagation = tag == 1 ? value.b : tag == 3 && value.be;
		var currentEventNode = (
			stopPropagation && event.stopPropagation(),
			(tag == 2 ? value.b : tag == 3 && value.bb) && event.preventDefault(),
			eventNode
		);
		var tagger;
		var i;
		while (tagger = currentEventNode.j)
		{
			if (typeof tagger == 'function')
			{
				message = tagger(message);
			}
			else
			{
				for (var i = tagger.length; i--; )
				{
					message = tagger[i](message);
				}
			}
			currentEventNode = currentEventNode.p;
		}
		currentEventNode(message, stopPropagation); // stopPropagation implies isSync
	}

	callback.q = initialHandler;

	return callback;
}

function _VirtualDom_equalEvents(x, y)
{
	return x.$ == y.$ && _Json_equality(x.a, y.a);
}



// DIFF


// TODO: Should we do patches like in iOS?
//
// type Patch
//   = At Int Patch
//   | Batch (List Patch)
//   | Change ...
//
// How could it not be better?
//
function _VirtualDom_diff(x, y)
{
	var patches = [];
	_VirtualDom_diffHelp(x, y, patches, 0);
	return patches;
}


function _VirtualDom_pushPatch(patches, type, index, data)
{
	var patch = {
		$: type,
		r: index,
		s: data,
		t: undefined,
		u: undefined
	};
	patches.push(patch);
	return patch;
}


function _VirtualDom_diffHelp(x, y, patches, index)
{
	if (x === y)
	{
		return;
	}

	var xType = x.$;
	var yType = y.$;

	// Bail if you run into different types of nodes. Implies that the
	// structure has changed significantly and it's not worth a diff.
	if (xType !== yType)
	{
		if (xType === 1 && yType === 2)
		{
			y = _VirtualDom_dekey(y);
			yType = 1;
		}
		else
		{
			_VirtualDom_pushPatch(patches, 0, index, y);
			return;
		}
	}

	// Now we know that both nodes are the same $.
	switch (yType)
	{
		case 5:
			var xRefs = x.l;
			var yRefs = y.l;
			var i = xRefs.length;
			var same = i === yRefs.length;
			while (same && i--)
			{
				same = xRefs[i] === yRefs[i];
			}
			if (same)
			{
				y.k = x.k;
				return;
			}
			y.k = y.m();
			var subPatches = [];
			_VirtualDom_diffHelp(x.k, y.k, subPatches, 0);
			subPatches.length > 0 && _VirtualDom_pushPatch(patches, 1, index, subPatches);
			return;

		case 4:
			// gather nested taggers
			var xTaggers = x.j;
			var yTaggers = y.j;
			var nesting = false;

			var xSubNode = x.k;
			while (xSubNode.$ === 4)
			{
				nesting = true;

				typeof xTaggers !== 'object'
					? xTaggers = [xTaggers, xSubNode.j]
					: xTaggers.push(xSubNode.j);

				xSubNode = xSubNode.k;
			}

			var ySubNode = y.k;
			while (ySubNode.$ === 4)
			{
				nesting = true;

				typeof yTaggers !== 'object'
					? yTaggers = [yTaggers, ySubNode.j]
					: yTaggers.push(ySubNode.j);

				ySubNode = ySubNode.k;
			}

			// Just bail if different numbers of taggers. This implies the
			// structure of the virtual DOM has changed.
			if (nesting && xTaggers.length !== yTaggers.length)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			// check if taggers are "the same"
			if (nesting ? !_VirtualDom_pairwiseRefEqual(xTaggers, yTaggers) : xTaggers !== yTaggers)
			{
				_VirtualDom_pushPatch(patches, 2, index, yTaggers);
			}

			// diff everything below the taggers
			_VirtualDom_diffHelp(xSubNode, ySubNode, patches, index + 1);
			return;

		case 0:
			if (x.a !== y.a)
			{
				_VirtualDom_pushPatch(patches, 3, index, y.a);
			}
			return;

		case 1:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKids);
			return;

		case 2:
			_VirtualDom_diffNodes(x, y, patches, index, _VirtualDom_diffKeyedKids);
			return;

		case 3:
			if (x.h !== y.h)
			{
				_VirtualDom_pushPatch(patches, 0, index, y);
				return;
			}

			var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
			factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

			var patch = y.i(x.g, y.g);
			patch && _VirtualDom_pushPatch(patches, 5, index, patch);

			return;
	}
}

// assumes the incoming arrays are the same length
function _VirtualDom_pairwiseRefEqual(as, bs)
{
	for (var i = 0; i < as.length; i++)
	{
		if (as[i] !== bs[i])
		{
			return false;
		}
	}

	return true;
}

function _VirtualDom_diffNodes(x, y, patches, index, diffKids)
{
	// Bail if obvious indicators have changed. Implies more serious
	// structural changes such that it's not worth it to diff.
	if (x.c !== y.c || x.f !== y.f)
	{
		_VirtualDom_pushPatch(patches, 0, index, y);
		return;
	}

	var factsDiff = _VirtualDom_diffFacts(x.d, y.d);
	factsDiff && _VirtualDom_pushPatch(patches, 4, index, factsDiff);

	diffKids(x, y, patches, index);
}



// DIFF FACTS


// TODO Instead of creating a new diff object, it's possible to just test if
// there *is* a diff. During the actual patch, do the diff again and make the
// modifications directly. This way, there's no new allocations. Worth it?
function _VirtualDom_diffFacts(x, y, category)
{
	var diff;

	// look for changes and removals
	for (var xKey in x)
	{
		if (xKey === 'a1' || xKey === 'a0' || xKey === 'a3' || xKey === 'a4')
		{
			var subDiff = _VirtualDom_diffFacts(x[xKey], y[xKey] || {}, xKey);
			if (subDiff)
			{
				diff = diff || {};
				diff[xKey] = subDiff;
			}
			continue;
		}

		// remove if not in the new facts
		if (!(xKey in y))
		{
			diff = diff || {};
			diff[xKey] =
				!category
					? (typeof x[xKey] === 'string' ? '' : null)
					:
				(category === 'a1')
					? ''
					:
				(category === 'a0' || category === 'a3')
					? undefined
					:
				{ f: x[xKey].f, o: undefined };

			continue;
		}

		var xValue = x[xKey];
		var yValue = y[xKey];

		// reference equal, so don't worry about it
		if (xValue === yValue && xKey !== 'value' && xKey !== 'checked'
			|| category === 'a0' && _VirtualDom_equalEvents(xValue, yValue))
		{
			continue;
		}

		diff = diff || {};
		diff[xKey] = yValue;
	}

	// add new stuff
	for (var yKey in y)
	{
		if (!(yKey in x))
		{
			diff = diff || {};
			diff[yKey] = y[yKey];
		}
	}

	return diff;
}



// DIFF KIDS


function _VirtualDom_diffKids(xParent, yParent, patches, index)
{
	var xKids = xParent.e;
	var yKids = yParent.e;

	var xLen = xKids.length;
	var yLen = yKids.length;

	// FIGURE OUT IF THERE ARE INSERTS OR REMOVALS

	if (xLen > yLen)
	{
		_VirtualDom_pushPatch(patches, 6, index, {
			v: yLen,
			i: xLen - yLen
		});
	}
	else if (xLen < yLen)
	{
		_VirtualDom_pushPatch(patches, 7, index, {
			v: xLen,
			e: yKids
		});
	}

	// PAIRWISE DIFF EVERYTHING ELSE

	for (var minLen = xLen < yLen ? xLen : yLen, i = 0; i < minLen; i++)
	{
		var xKid = xKids[i];
		_VirtualDom_diffHelp(xKid, yKids[i], patches, ++index);
		index += xKid.b || 0;
	}
}



// KEYED DIFF


function _VirtualDom_diffKeyedKids(xParent, yParent, patches, rootIndex)
{
	var localPatches = [];

	var changes = {}; // Dict String Entry
	var inserts = []; // Array { index : Int, entry : Entry }
	// type Entry = { tag : String, vnode : VNode, index : Int, data : _ }

	var xKids = xParent.e;
	var yKids = yParent.e;
	var xLen = xKids.length;
	var yLen = yKids.length;
	var xIndex = 0;
	var yIndex = 0;

	var index = rootIndex;

	while (xIndex < xLen && yIndex < yLen)
	{
		var x = xKids[xIndex];
		var y = yKids[yIndex];

		var xKey = x.a;
		var yKey = y.a;
		var xNode = x.b;
		var yNode = y.b;

		var newMatch = undefined;
		var oldMatch = undefined;

		// check if keys match

		if (xKey === yKey)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNode, localPatches, index);
			index += xNode.b || 0;

			xIndex++;
			yIndex++;
			continue;
		}

		// look ahead 1 to detect insertions and removals.

		var xNext = xKids[xIndex + 1];
		var yNext = yKids[yIndex + 1];

		if (xNext)
		{
			var xNextKey = xNext.a;
			var xNextNode = xNext.b;
			oldMatch = yKey === xNextKey;
		}

		if (yNext)
		{
			var yNextKey = yNext.a;
			var yNextNode = yNext.b;
			newMatch = xKey === yNextKey;
		}


		// swap x and y
		if (newMatch && oldMatch)
		{
			index++;
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			_VirtualDom_insertNode(changes, localPatches, xKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNextNode, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		// insert y
		if (newMatch)
		{
			index++;
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			_VirtualDom_diffHelp(xNode, yNextNode, localPatches, index);
			index += xNode.b || 0;

			xIndex += 1;
			yIndex += 2;
			continue;
		}

		// remove x
		if (oldMatch)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 1;
			continue;
		}

		// remove x, insert y
		if (xNext && xNextKey === yNextKey)
		{
			index++;
			_VirtualDom_removeNode(changes, localPatches, xKey, xNode, index);
			_VirtualDom_insertNode(changes, localPatches, yKey, yNode, yIndex, inserts);
			index += xNode.b || 0;

			index++;
			_VirtualDom_diffHelp(xNextNode, yNextNode, localPatches, index);
			index += xNextNode.b || 0;

			xIndex += 2;
			yIndex += 2;
			continue;
		}

		break;
	}

	// eat up any remaining nodes with removeNode and insertNode

	while (xIndex < xLen)
	{
		index++;
		var x = xKids[xIndex];
		var xNode = x.b;
		_VirtualDom_removeNode(changes, localPatches, x.a, xNode, index);
		index += xNode.b || 0;
		xIndex++;
	}

	while (yIndex < yLen)
	{
		var endInserts = endInserts || [];
		var y = yKids[yIndex];
		_VirtualDom_insertNode(changes, localPatches, y.a, y.b, undefined, endInserts);
		yIndex++;
	}

	if (localPatches.length > 0 || inserts.length > 0 || endInserts)
	{
		_VirtualDom_pushPatch(patches, 8, rootIndex, {
			w: localPatches,
			x: inserts,
			y: endInserts
		});
	}
}



// CHANGES FROM KEYED DIFF


var _VirtualDom_POSTFIX = '_elmW6BL';


function _VirtualDom_insertNode(changes, localPatches, key, vnode, yIndex, inserts)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		entry = {
			c: 0,
			z: vnode,
			r: yIndex,
			s: undefined
		};

		inserts.push({ r: yIndex, A: entry });
		changes[key] = entry;

		return;
	}

	// this key was removed earlier, a match!
	if (entry.c === 1)
	{
		inserts.push({ r: yIndex, A: entry });

		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(entry.z, vnode, subPatches, entry.r);
		entry.r = yIndex;
		entry.s.s = {
			w: subPatches,
			A: entry
		};

		return;
	}

	// this key has already been inserted or moved, a duplicate!
	_VirtualDom_insertNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, yIndex, inserts);
}


function _VirtualDom_removeNode(changes, localPatches, key, vnode, index)
{
	var entry = changes[key];

	// never seen this key before
	if (!entry)
	{
		var patch = _VirtualDom_pushPatch(localPatches, 9, index, undefined);

		changes[key] = {
			c: 1,
			z: vnode,
			r: index,
			s: patch
		};

		return;
	}

	// this key was inserted earlier, a match!
	if (entry.c === 0)
	{
		entry.c = 2;
		var subPatches = [];
		_VirtualDom_diffHelp(vnode, entry.z, subPatches, index);

		_VirtualDom_pushPatch(localPatches, 9, index, {
			w: subPatches,
			A: entry
		});

		return;
	}

	// this key has already been removed or moved, a duplicate!
	_VirtualDom_removeNode(changes, localPatches, key + _VirtualDom_POSTFIX, vnode, index);
}



// ADD DOM NODES
//
// Each DOM node has an "index" assigned in order of traversal. It is important
// to minimize our crawl over the actual DOM, so these indexes (along with the
// descendantsCount of virtual nodes) let us skip touching entire subtrees of
// the DOM if we know there are no patches there.


function _VirtualDom_addDomNodes(domNode, vNode, patches, eventNode)
{
	_VirtualDom_addDomNodesHelp(domNode, vNode, patches, 0, 0, vNode.b, eventNode);
}


// assumes `patches` is non-empty and indexes increase monotonically.
function _VirtualDom_addDomNodesHelp(domNode, vNode, patches, i, low, high, eventNode)
{
	var patch = patches[i];
	var index = patch.r;

	while (index === low)
	{
		var patchType = patch.$;

		if (patchType === 1)
		{
			_VirtualDom_addDomNodes(domNode, vNode.k, patch.s, eventNode);
		}
		else if (patchType === 8)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var subPatches = patch.s.w;
			if (subPatches.length > 0)
			{
				_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
			}
		}
		else if (patchType === 9)
		{
			patch.t = domNode;
			patch.u = eventNode;

			var data = patch.s;
			if (data)
			{
				data.A.s = domNode;
				var subPatches = data.w;
				if (subPatches.length > 0)
				{
					_VirtualDom_addDomNodesHelp(domNode, vNode, subPatches, 0, low, high, eventNode);
				}
			}
		}
		else
		{
			patch.t = domNode;
			patch.u = eventNode;
		}

		i++;

		if (!(patch = patches[i]) || (index = patch.r) > high)
		{
			return i;
		}
	}

	var tag = vNode.$;

	if (tag === 4)
	{
		var subNode = vNode.k;

		while (subNode.$ === 4)
		{
			subNode = subNode.k;
		}

		return _VirtualDom_addDomNodesHelp(domNode, subNode, patches, i, low + 1, high, domNode.elm_event_node_ref);
	}

	// tag must be 1 or 2 at this point

	var vKids = vNode.e;
	var childNodes = domNode.childNodes;
	for (var j = 0; j < vKids.length; j++)
	{
		low++;
		var vKid = tag === 1 ? vKids[j] : vKids[j].b;
		var nextLow = low + (vKid.b || 0);
		if (low <= index && index <= nextLow)
		{
			i = _VirtualDom_addDomNodesHelp(childNodes[j], vKid, patches, i, low, nextLow, eventNode);
			if (!(patch = patches[i]) || (index = patch.r) > high)
			{
				return i;
			}
		}
		low = nextLow;
	}
	return i;
}



// APPLY PATCHES


function _VirtualDom_applyPatches(rootDomNode, oldVirtualNode, patches, eventNode)
{
	if (patches.length === 0)
	{
		return rootDomNode;
	}

	_VirtualDom_addDomNodes(rootDomNode, oldVirtualNode, patches, eventNode);
	return _VirtualDom_applyPatchesHelp(rootDomNode, patches);
}

function _VirtualDom_applyPatchesHelp(rootDomNode, patches)
{
	for (var i = 0; i < patches.length; i++)
	{
		var patch = patches[i];
		var localDomNode = patch.t
		var newNode = _VirtualDom_applyPatch(localDomNode, patch);
		if (localDomNode === rootDomNode)
		{
			rootDomNode = newNode;
		}
	}
	return rootDomNode;
}

function _VirtualDom_applyPatch(domNode, patch)
{
	switch (patch.$)
	{
		case 0:
			return _VirtualDom_applyPatchRedraw(domNode, patch.s, patch.u);

		case 4:
			_VirtualDom_applyFacts(domNode, patch.u, patch.s);
			return domNode;

		case 3:
			domNode.replaceData(0, domNode.length, patch.s);
			return domNode;

		case 1:
			return _VirtualDom_applyPatchesHelp(domNode, patch.s);

		case 2:
			if (domNode.elm_event_node_ref)
			{
				domNode.elm_event_node_ref.j = patch.s;
			}
			else
			{
				domNode.elm_event_node_ref = { j: patch.s, p: patch.u };
			}
			return domNode;

		case 6:
			var data = patch.s;
			for (var i = 0; i < data.i; i++)
			{
				domNode.removeChild(domNode.childNodes[data.v]);
			}
			return domNode;

		case 7:
			var data = patch.s;
			var kids = data.e;
			var i = data.v;
			var theEnd = domNode.childNodes[i];
			for (; i < kids.length; i++)
			{
				domNode.insertBefore(_VirtualDom_render(kids[i], patch.u), theEnd);
			}
			return domNode;

		case 9:
			var data = patch.s;
			if (!data)
			{
				domNode.parentNode.removeChild(domNode);
				return domNode;
			}
			var entry = data.A;
			if (typeof entry.r !== 'undefined')
			{
				domNode.parentNode.removeChild(domNode);
			}
			entry.s = _VirtualDom_applyPatchesHelp(domNode, data.w);
			return domNode;

		case 8:
			return _VirtualDom_applyPatchReorder(domNode, patch);

		case 5:
			return patch.s(domNode);

		default:
			_Debug_crash(10); // 'Ran into an unknown patch!'
	}
}


function _VirtualDom_applyPatchRedraw(domNode, vNode, eventNode)
{
	var parentNode = domNode.parentNode;
	var newNode = _VirtualDom_render(vNode, eventNode);

	if (!newNode.elm_event_node_ref)
	{
		newNode.elm_event_node_ref = domNode.elm_event_node_ref;
	}

	if (parentNode && newNode !== domNode)
	{
		parentNode.replaceChild(newNode, domNode);
	}
	return newNode;
}


function _VirtualDom_applyPatchReorder(domNode, patch)
{
	var data = patch.s;

	// remove end inserts
	var frag = _VirtualDom_applyPatchReorderEndInsertsHelp(data.y, patch);

	// removals
	domNode = _VirtualDom_applyPatchesHelp(domNode, data.w);

	// inserts
	var inserts = data.x;
	for (var i = 0; i < inserts.length; i++)
	{
		var insert = inserts[i];
		var entry = insert.A;
		var node = entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u);
		domNode.insertBefore(node, domNode.childNodes[insert.r]);
	}

	// add end inserts
	if (frag)
	{
		_VirtualDom_appendChild(domNode, frag);
	}

	return domNode;
}


function _VirtualDom_applyPatchReorderEndInsertsHelp(endInserts, patch)
{
	if (!endInserts)
	{
		return;
	}

	var frag = _VirtualDom_doc.createDocumentFragment();
	for (var i = 0; i < endInserts.length; i++)
	{
		var insert = endInserts[i];
		var entry = insert.A;
		_VirtualDom_appendChild(frag, entry.c === 2
			? entry.s
			: _VirtualDom_render(entry.z, patch.u)
		);
	}
	return frag;
}


function _VirtualDom_virtualize(node)
{
	// TEXT NODES

	if (node.nodeType === 3)
	{
		return _VirtualDom_text(node.textContent);
	}


	// WEIRD NODES

	if (node.nodeType !== 1)
	{
		return _VirtualDom_text('');
	}


	// ELEMENT NODES

	var attrList = _List_Nil;
	var attrs = node.attributes;
	for (var i = attrs.length; i--; )
	{
		var attr = attrs[i];
		var name = attr.name;
		var value = attr.value;
		attrList = _List_Cons( A2(_VirtualDom_attribute, name, value), attrList );
	}

	var tag = node.tagName.toLowerCase();
	var kidList = _List_Nil;
	var kids = node.childNodes;

	for (var i = kids.length; i--; )
	{
		kidList = _List_Cons(_VirtualDom_virtualize(kids[i]), kidList);
	}
	return A3(_VirtualDom_node, tag, attrList, kidList);
}

function _VirtualDom_dekey(keyedNode)
{
	var keyedKids = keyedNode.e;
	var len = keyedKids.length;
	var kids = new Array(len);
	for (var i = 0; i < len; i++)
	{
		kids[i] = keyedKids[i].b;
	}

	return {
		$: 1,
		c: keyedNode.c,
		d: keyedNode.d,
		e: kids,
		f: keyedNode.f,
		b: keyedNode.b
	};
}




// ELEMENT


var _Debugger_element;

var _Browser_element = _Debugger_element || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cH,
		impl.c1,
		impl.c_,
		function(sendToApp, initialModel) {
			var view = impl.c4;
			/**/
			var domNode = args['node'];
			//*/
			/**_UNUSED/
			var domNode = args && args['node'] ? args['node'] : _Debug_crash(0);
			//*/
			var currNode = _VirtualDom_virtualize(domNode);

			return _Browser_makeAnimator(initialModel, function(model)
			{
				var nextNode = view(model);
				var patches = _VirtualDom_diff(currNode, nextNode);
				domNode = _VirtualDom_applyPatches(domNode, currNode, patches, sendToApp);
				currNode = nextNode;
			});
		}
	);
});



// DOCUMENT


var _Debugger_document;

var _Browser_document = _Debugger_document || F4(function(impl, flagDecoder, debugMetadata, args)
{
	return _Platform_initialize(
		flagDecoder,
		args,
		impl.cH,
		impl.c1,
		impl.c_,
		function(sendToApp, initialModel) {
			var divertHrefToApp = impl.bc && impl.bc(sendToApp)
			var view = impl.c4;
			var title = _VirtualDom_doc.title;
			var bodyNode = _VirtualDom_doc.body;
			var currNode = _VirtualDom_virtualize(bodyNode);
			return _Browser_makeAnimator(initialModel, function(model)
			{
				_VirtualDom_divertHrefToApp = divertHrefToApp;
				var doc = view(model);
				var nextNode = _VirtualDom_node('body')(_List_Nil)(doc.cq);
				var patches = _VirtualDom_diff(currNode, nextNode);
				bodyNode = _VirtualDom_applyPatches(bodyNode, currNode, patches, sendToApp);
				currNode = nextNode;
				_VirtualDom_divertHrefToApp = 0;
				(title !== doc.c0) && (_VirtualDom_doc.title = title = doc.c0);
			});
		}
	);
});



// ANIMATION


var _Browser_cancelAnimationFrame =
	typeof cancelAnimationFrame !== 'undefined'
		? cancelAnimationFrame
		: function(id) { clearTimeout(id); };

var _Browser_requestAnimationFrame =
	typeof requestAnimationFrame !== 'undefined'
		? requestAnimationFrame
		: function(callback) { return setTimeout(callback, 1000 / 60); };


function _Browser_makeAnimator(model, draw)
{
	draw(model);

	var state = 0;

	function updateIfNeeded()
	{
		state = state === 1
			? 0
			: ( _Browser_requestAnimationFrame(updateIfNeeded), draw(model), 1 );
	}

	return function(nextModel, isSync)
	{
		model = nextModel;

		isSync
			? ( draw(model),
				state === 2 && (state = 1)
				)
			: ( state === 0 && _Browser_requestAnimationFrame(updateIfNeeded),
				state = 2
				);
	};
}



// APPLICATION


function _Browser_application(impl)
{
	var onUrlChange = impl.cR;
	var onUrlRequest = impl.cS;
	var key = function() { key.a(onUrlChange(_Browser_getUrl())); };

	return _Browser_document({
		bc: function(sendToApp)
		{
			key.a = sendToApp;
			_Browser_window.addEventListener('popstate', key);
			_Browser_window.navigator.userAgent.indexOf('Trident') < 0 || _Browser_window.addEventListener('hashchange', key);

			return F2(function(domNode, event)
			{
				if (!event.ctrlKey && !event.metaKey && !event.shiftKey && event.button < 1 && !domNode.target && !domNode.hasAttribute('download'))
				{
					event.preventDefault();
					var href = domNode.href;
					var curr = _Browser_getUrl();
					var next = $elm$url$Url$fromString(href).a;
					sendToApp(onUrlRequest(
						(next
							&& curr.bZ === next.bZ
							&& curr.bI === next.bI
							&& curr.bV.a === next.bV.a
						)
							? $elm$browser$Browser$Internal(next)
							: $elm$browser$Browser$External(href)
					));
				}
			});
		},
		cH: function(flags)
		{
			return A3(impl.cH, flags, _Browser_getUrl(), key);
		},
		c4: impl.c4,
		c1: impl.c1,
		c_: impl.c_
	});
}

function _Browser_getUrl()
{
	return $elm$url$Url$fromString(_VirtualDom_doc.location.href).a || _Debug_crash(1);
}

var _Browser_go = F2(function(key, n)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		n && history.go(n);
		key();
	}));
});

var _Browser_pushUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.pushState({}, '', url);
		key();
	}));
});

var _Browser_replaceUrl = F2(function(key, url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function() {
		history.replaceState({}, '', url);
		key();
	}));
});



// GLOBAL EVENTS


var _Browser_fakeNode = { addEventListener: function() {}, removeEventListener: function() {} };
var _Browser_doc = typeof document !== 'undefined' ? document : _Browser_fakeNode;
var _Browser_window = typeof window !== 'undefined' ? window : _Browser_fakeNode;

var _Browser_on = F3(function(node, eventName, sendToSelf)
{
	return _Scheduler_spawn(_Scheduler_binding(function(callback)
	{
		function handler(event)	{ _Scheduler_rawSpawn(sendToSelf(event)); }
		node.addEventListener(eventName, handler, _VirtualDom_passiveSupported && { passive: true });
		return function() { node.removeEventListener(eventName, handler); };
	}));
});

var _Browser_decodeEvent = F2(function(decoder, event)
{
	var result = _Json_runHelp(decoder, event);
	return $elm$core$Result$isOk(result) ? $elm$core$Maybe$Just(result.a) : $elm$core$Maybe$Nothing;
});



// PAGE VISIBILITY


function _Browser_visibilityInfo()
{
	return (typeof _VirtualDom_doc.hidden !== 'undefined')
		? { cD: 'hidden', cs: 'visibilitychange' }
		:
	(typeof _VirtualDom_doc.mozHidden !== 'undefined')
		? { cD: 'mozHidden', cs: 'mozvisibilitychange' }
		:
	(typeof _VirtualDom_doc.msHidden !== 'undefined')
		? { cD: 'msHidden', cs: 'msvisibilitychange' }
		:
	(typeof _VirtualDom_doc.webkitHidden !== 'undefined')
		? { cD: 'webkitHidden', cs: 'webkitvisibilitychange' }
		: { cD: 'hidden', cs: 'visibilitychange' };
}



// ANIMATION FRAMES


function _Browser_rAF()
{
	return _Scheduler_binding(function(callback)
	{
		var id = _Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(Date.now()));
		});

		return function() {
			_Browser_cancelAnimationFrame(id);
		};
	});
}


function _Browser_now()
{
	return _Scheduler_binding(function(callback)
	{
		callback(_Scheduler_succeed(Date.now()));
	});
}



// DOM STUFF


function _Browser_withNode(id, doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			var node = document.getElementById(id);
			callback(node
				? _Scheduler_succeed(doStuff(node))
				: _Scheduler_fail($elm$browser$Browser$Dom$NotFound(id))
			);
		});
	});
}


function _Browser_withWindow(doStuff)
{
	return _Scheduler_binding(function(callback)
	{
		_Browser_requestAnimationFrame(function() {
			callback(_Scheduler_succeed(doStuff()));
		});
	});
}


// FOCUS and BLUR


var _Browser_call = F2(function(functionName, id)
{
	return _Browser_withNode(id, function(node) {
		node[functionName]();
		return _Utils_Tuple0;
	});
});



// WINDOW VIEWPORT


function _Browser_getViewport()
{
	return {
		b5: _Browser_getScene(),
		cf: {
			cj: _Browser_window.pageXOffset,
			ck: _Browser_window.pageYOffset,
			ci: _Browser_doc.documentElement.clientWidth,
			bG: _Browser_doc.documentElement.clientHeight
		}
	};
}

function _Browser_getScene()
{
	var body = _Browser_doc.body;
	var elem = _Browser_doc.documentElement;
	return {
		ci: Math.max(body.scrollWidth, body.offsetWidth, elem.scrollWidth, elem.offsetWidth, elem.clientWidth),
		bG: Math.max(body.scrollHeight, body.offsetHeight, elem.scrollHeight, elem.offsetHeight, elem.clientHeight)
	};
}

var _Browser_setViewport = F2(function(x, y)
{
	return _Browser_withWindow(function()
	{
		_Browser_window.scroll(x, y);
		return _Utils_Tuple0;
	});
});



// ELEMENT VIEWPORT


function _Browser_getViewportOf(id)
{
	return _Browser_withNode(id, function(node)
	{
		return {
			b5: {
				ci: node.scrollWidth,
				bG: node.scrollHeight
			},
			cf: {
				cj: node.scrollLeft,
				ck: node.scrollTop,
				ci: node.clientWidth,
				bG: node.clientHeight
			}
		};
	});
}


var _Browser_setViewportOf = F3(function(id, x, y)
{
	return _Browser_withNode(id, function(node)
	{
		node.scrollLeft = x;
		node.scrollTop = y;
		return _Utils_Tuple0;
	});
});



// ELEMENT


function _Browser_getElement(id)
{
	return _Browser_withNode(id, function(node)
	{
		var rect = node.getBoundingClientRect();
		var x = _Browser_window.pageXOffset;
		var y = _Browser_window.pageYOffset;
		return {
			b5: _Browser_getScene(),
			cf: {
				cj: x,
				ck: y,
				ci: _Browser_doc.documentElement.clientWidth,
				bG: _Browser_doc.documentElement.clientHeight
			},
			cB: {
				cj: x + rect.left,
				ck: y + rect.top,
				ci: rect.width,
				bG: rect.height
			}
		};
	});
}



// LOAD and RELOAD


function _Browser_reload(skipCache)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		_VirtualDom_doc.location.reload(skipCache);
	}));
}

function _Browser_load(url)
{
	return A2($elm$core$Task$perform, $elm$core$Basics$never, _Scheduler_binding(function(callback)
	{
		try
		{
			_Browser_window.location = url;
		}
		catch(err)
		{
			// Only Firefox can throw a NS_ERROR_MALFORMED_URI exception here.
			// Other browsers reload the page, so let's be consistent about that.
			_VirtualDom_doc.location.reload(false);
		}
	}));
}



var _Bitwise_and = F2(function(a, b)
{
	return a & b;
});

var _Bitwise_or = F2(function(a, b)
{
	return a | b;
});

var _Bitwise_xor = F2(function(a, b)
{
	return a ^ b;
});

function _Bitwise_complement(a)
{
	return ~a;
};

var _Bitwise_shiftLeftBy = F2(function(offset, a)
{
	return a << offset;
});

var _Bitwise_shiftRightBy = F2(function(offset, a)
{
	return a >> offset;
});

var _Bitwise_shiftRightZfBy = F2(function(offset, a)
{
	return a >>> offset;
});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return _Utils_Tuple3(isGood ? offset : -1, row, col);
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return _Utils_Tuple2(offset, total);
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return _Utils_Tuple2(offset, total);
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return _Utils_Tuple3(newOffset, row, col);
});
var $author$project$Sitewide$Types$Tick = function (a) {
	return {$: 5, a: a};
};
var $author$project$Sitewide$Types$UrlChange = function (a) {
	return {$: 1, a: a};
};
var $author$project$Sitewide$Types$UrlRequest = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$always = F2(
	function (a, _v0) {
		return a;
	});
var $elm$core$Basics$EQ = 1;
var $elm$core$Basics$GT = 2;
var $elm$core$Basics$LT = 0;
var $elm$core$List$cons = _List_cons;
var $elm$core$Dict$foldr = F3(
	function (func, acc, t) {
		foldr:
		while (true) {
			if (t.$ === -2) {
				return acc;
			} else {
				var key = t.b;
				var value = t.c;
				var left = t.d;
				var right = t.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldr, func, acc, right)),
					$temp$t = left;
				func = $temp$func;
				acc = $temp$acc;
				t = $temp$t;
				continue foldr;
			}
		}
	});
var $elm$core$Dict$toList = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, list) {
				return A2(
					$elm$core$List$cons,
					_Utils_Tuple2(key, value),
					list);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Dict$keys = function (dict) {
	return A3(
		$elm$core$Dict$foldr,
		F3(
			function (key, value, keyList) {
				return A2($elm$core$List$cons, key, keyList);
			}),
		_List_Nil,
		dict);
};
var $elm$core$Set$toList = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$keys(dict);
};
var $elm$core$Elm$JsArray$foldr = _JsArray_foldr;
var $elm$core$Array$foldr = F3(
	function (func, baseCase, _v0) {
		var tree = _v0.c;
		var tail = _v0.d;
		var helper = F2(
			function (node, acc) {
				if (!node.$) {
					var subTree = node.a;
					return A3($elm$core$Elm$JsArray$foldr, helper, acc, subTree);
				} else {
					var values = node.a;
					return A3($elm$core$Elm$JsArray$foldr, func, acc, values);
				}
			});
		return A3(
			$elm$core$Elm$JsArray$foldr,
			helper,
			A3($elm$core$Elm$JsArray$foldr, func, baseCase, tail),
			tree);
	});
var $elm$core$Array$toList = function (array) {
	return A3($elm$core$Array$foldr, $elm$core$List$cons, _List_Nil, array);
};
var $elm$core$Result$Err = function (a) {
	return {$: 1, a: a};
};
var $elm$json$Json$Decode$Failure = F2(
	function (a, b) {
		return {$: 3, a: a, b: b};
	});
var $elm$json$Json$Decode$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$json$Json$Decode$Index = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$core$Result$Ok = function (a) {
	return {$: 0, a: a};
};
var $elm$json$Json$Decode$OneOf = function (a) {
	return {$: 2, a: a};
};
var $elm$core$Basics$False = 1;
var $elm$core$Basics$add = _Basics_add;
var $elm$core$Maybe$Just = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Maybe$Nothing = {$: 1};
var $elm$core$String$all = _String_all;
var $elm$core$Basics$and = _Basics_and;
var $elm$core$Basics$append = _Utils_append;
var $elm$json$Json$Encode$encode = _Json_encode;
var $elm$core$String$fromInt = _String_fromNumber;
var $elm$core$String$join = F2(
	function (sep, chunks) {
		return A2(
			_String_join,
			sep,
			_List_toArray(chunks));
	});
var $elm$core$String$split = F2(
	function (sep, string) {
		return _List_fromArray(
			A2(_String_split, sep, string));
	});
var $elm$json$Json$Decode$indent = function (str) {
	return A2(
		$elm$core$String$join,
		'\n    ',
		A2($elm$core$String$split, '\n', str));
};
var $elm$core$List$foldl = F3(
	function (func, acc, list) {
		foldl:
		while (true) {
			if (!list.b) {
				return acc;
			} else {
				var x = list.a;
				var xs = list.b;
				var $temp$func = func,
					$temp$acc = A2(func, x, acc),
					$temp$list = xs;
				func = $temp$func;
				acc = $temp$acc;
				list = $temp$list;
				continue foldl;
			}
		}
	});
var $elm$core$List$length = function (xs) {
	return A3(
		$elm$core$List$foldl,
		F2(
			function (_v0, i) {
				return i + 1;
			}),
		0,
		xs);
};
var $elm$core$List$map2 = _List_map2;
var $elm$core$Basics$le = _Utils_le;
var $elm$core$Basics$sub = _Basics_sub;
var $elm$core$List$rangeHelp = F3(
	function (lo, hi, list) {
		rangeHelp:
		while (true) {
			if (_Utils_cmp(lo, hi) < 1) {
				var $temp$lo = lo,
					$temp$hi = hi - 1,
					$temp$list = A2($elm$core$List$cons, hi, list);
				lo = $temp$lo;
				hi = $temp$hi;
				list = $temp$list;
				continue rangeHelp;
			} else {
				return list;
			}
		}
	});
var $elm$core$List$range = F2(
	function (lo, hi) {
		return A3($elm$core$List$rangeHelp, lo, hi, _List_Nil);
	});
var $elm$core$List$indexedMap = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$map2,
			f,
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(xs) - 1),
			xs);
	});
var $elm$core$Char$toCode = _Char_toCode;
var $elm$core$Char$isLower = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (97 <= code) && (code <= 122);
};
var $elm$core$Char$isUpper = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $elm$core$Basics$or = _Basics_or;
var $elm$core$Char$isAlpha = function (_char) {
	return $elm$core$Char$isLower(_char) || $elm$core$Char$isUpper(_char);
};
var $elm$core$Char$isDigit = function (_char) {
	var code = $elm$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $elm$core$Char$isAlphaNum = function (_char) {
	return $elm$core$Char$isLower(_char) || ($elm$core$Char$isUpper(_char) || $elm$core$Char$isDigit(_char));
};
var $elm$core$List$reverse = function (list) {
	return A3($elm$core$List$foldl, $elm$core$List$cons, _List_Nil, list);
};
var $elm$core$String$uncons = _String_uncons;
var $elm$json$Json$Decode$errorOneOf = F2(
	function (i, error) {
		return '\n\n(' + ($elm$core$String$fromInt(i + 1) + (') ' + $elm$json$Json$Decode$indent(
			$elm$json$Json$Decode$errorToString(error))));
	});
var $elm$json$Json$Decode$errorToString = function (error) {
	return A2($elm$json$Json$Decode$errorToStringHelp, error, _List_Nil);
};
var $elm$json$Json$Decode$errorToStringHelp = F2(
	function (error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $elm$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.a;
							var rest = _v2.b;
							return $elm$core$Char$isAlpha(_char) && A2($elm$core$String$all, $elm$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, fieldName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = '[' + ($elm$core$String$fromInt(i) + ']');
					var $temp$error = err,
						$temp$context = A2($elm$core$List$cons, indexName, context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					if (!errors.b) {
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (!context.b) {
								return '!';
							} else {
								return ' at json' + A2(
									$elm$core$String$join,
									'',
									$elm$core$List$reverse(context));
							}
						}();
					} else {
						if (!errors.b.b) {
							var err = errors.a;
							var $temp$error = err,
								$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						} else {
							var starter = function () {
								if (!context.b) {
									return 'Json.Decode.oneOf';
								} else {
									return 'The Json.Decode.oneOf at json' + A2(
										$elm$core$String$join,
										'',
										$elm$core$List$reverse(context));
								}
							}();
							var introduction = starter + (' failed in the following ' + ($elm$core$String$fromInt(
								$elm$core$List$length(errors)) + ' ways:'));
							return A2(
								$elm$core$String$join,
								'\n\n',
								A2(
									$elm$core$List$cons,
									introduction,
									A2($elm$core$List$indexedMap, $elm$json$Json$Decode$errorOneOf, errors)));
						}
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (!context.b) {
							return 'Problem with the given value:\n\n';
						} else {
							return 'Problem with the value at json' + (A2(
								$elm$core$String$join,
								'',
								$elm$core$List$reverse(context)) + ':\n\n    ');
						}
					}();
					return introduction + ($elm$json$Json$Decode$indent(
						A2($elm$json$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
			}
		}
	});
var $elm$core$Array$branchFactor = 32;
var $elm$core$Array$Array_elm_builtin = F4(
	function (a, b, c, d) {
		return {$: 0, a: a, b: b, c: c, d: d};
	});
var $elm$core$Elm$JsArray$empty = _JsArray_empty;
var $elm$core$Basics$ceiling = _Basics_ceiling;
var $elm$core$Basics$fdiv = _Basics_fdiv;
var $elm$core$Basics$logBase = F2(
	function (base, number) {
		return _Basics_log(number) / _Basics_log(base);
	});
var $elm$core$Basics$toFloat = _Basics_toFloat;
var $elm$core$Array$shiftStep = $elm$core$Basics$ceiling(
	A2($elm$core$Basics$logBase, 2, $elm$core$Array$branchFactor));
var $elm$core$Array$empty = A4($elm$core$Array$Array_elm_builtin, 0, $elm$core$Array$shiftStep, $elm$core$Elm$JsArray$empty, $elm$core$Elm$JsArray$empty);
var $elm$core$Elm$JsArray$initialize = _JsArray_initialize;
var $elm$core$Array$Leaf = function (a) {
	return {$: 1, a: a};
};
var $elm$core$Basics$apL = F2(
	function (f, x) {
		return f(x);
	});
var $elm$core$Basics$apR = F2(
	function (x, f) {
		return f(x);
	});
var $elm$core$Basics$eq = _Utils_equal;
var $elm$core$Basics$floor = _Basics_floor;
var $elm$core$Elm$JsArray$length = _JsArray_length;
var $elm$core$Basics$gt = _Utils_gt;
var $elm$core$Basics$max = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $elm$core$Basics$mul = _Basics_mul;
var $elm$core$Array$SubTree = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Elm$JsArray$initializeFromList = _JsArray_initializeFromList;
var $elm$core$Array$compressNodes = F2(
	function (nodes, acc) {
		compressNodes:
		while (true) {
			var _v0 = A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodes);
			var node = _v0.a;
			var remainingNodes = _v0.b;
			var newAcc = A2(
				$elm$core$List$cons,
				$elm$core$Array$SubTree(node),
				acc);
			if (!remainingNodes.b) {
				return $elm$core$List$reverse(newAcc);
			} else {
				var $temp$nodes = remainingNodes,
					$temp$acc = newAcc;
				nodes = $temp$nodes;
				acc = $temp$acc;
				continue compressNodes;
			}
		}
	});
var $elm$core$Tuple$first = function (_v0) {
	var x = _v0.a;
	return x;
};
var $elm$core$Array$treeFromBuilder = F2(
	function (nodeList, nodeListSize) {
		treeFromBuilder:
		while (true) {
			var newNodeSize = $elm$core$Basics$ceiling(nodeListSize / $elm$core$Array$branchFactor);
			if (newNodeSize === 1) {
				return A2($elm$core$Elm$JsArray$initializeFromList, $elm$core$Array$branchFactor, nodeList).a;
			} else {
				var $temp$nodeList = A2($elm$core$Array$compressNodes, nodeList, _List_Nil),
					$temp$nodeListSize = newNodeSize;
				nodeList = $temp$nodeList;
				nodeListSize = $temp$nodeListSize;
				continue treeFromBuilder;
			}
		}
	});
var $elm$core$Array$builderToArray = F2(
	function (reverseNodeList, builder) {
		if (!builder.k) {
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.m),
				$elm$core$Array$shiftStep,
				$elm$core$Elm$JsArray$empty,
				builder.m);
		} else {
			var treeLen = builder.k * $elm$core$Array$branchFactor;
			var depth = $elm$core$Basics$floor(
				A2($elm$core$Basics$logBase, $elm$core$Array$branchFactor, treeLen - 1));
			var correctNodeList = reverseNodeList ? $elm$core$List$reverse(builder.n) : builder.n;
			var tree = A2($elm$core$Array$treeFromBuilder, correctNodeList, builder.k);
			return A4(
				$elm$core$Array$Array_elm_builtin,
				$elm$core$Elm$JsArray$length(builder.m) + treeLen,
				A2($elm$core$Basics$max, 5, depth * $elm$core$Array$shiftStep),
				tree,
				builder.m);
		}
	});
var $elm$core$Basics$idiv = _Basics_idiv;
var $elm$core$Basics$lt = _Utils_lt;
var $elm$core$Array$initializeHelp = F5(
	function (fn, fromIndex, len, nodeList, tail) {
		initializeHelp:
		while (true) {
			if (fromIndex < 0) {
				return A2(
					$elm$core$Array$builderToArray,
					false,
					{n: nodeList, k: (len / $elm$core$Array$branchFactor) | 0, m: tail});
			} else {
				var leaf = $elm$core$Array$Leaf(
					A3($elm$core$Elm$JsArray$initialize, $elm$core$Array$branchFactor, fromIndex, fn));
				var $temp$fn = fn,
					$temp$fromIndex = fromIndex - $elm$core$Array$branchFactor,
					$temp$len = len,
					$temp$nodeList = A2($elm$core$List$cons, leaf, nodeList),
					$temp$tail = tail;
				fn = $temp$fn;
				fromIndex = $temp$fromIndex;
				len = $temp$len;
				nodeList = $temp$nodeList;
				tail = $temp$tail;
				continue initializeHelp;
			}
		}
	});
var $elm$core$Basics$remainderBy = _Basics_remainderBy;
var $elm$core$Array$initialize = F2(
	function (len, fn) {
		if (len <= 0) {
			return $elm$core$Array$empty;
		} else {
			var tailLen = len % $elm$core$Array$branchFactor;
			var tail = A3($elm$core$Elm$JsArray$initialize, tailLen, len - tailLen, fn);
			var initialFromIndex = (len - tailLen) - $elm$core$Array$branchFactor;
			return A5($elm$core$Array$initializeHelp, fn, initialFromIndex, len, _List_Nil, tail);
		}
	});
var $elm$core$Basics$True = 0;
var $elm$core$Result$isOk = function (result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};
var $elm$json$Json$Decode$map = _Json_map1;
var $elm$json$Json$Decode$map2 = _Json_map2;
var $elm$json$Json$Decode$succeed = _Json_succeed;
var $elm$virtual_dom$VirtualDom$toHandlerInt = function (handler) {
	switch (handler.$) {
		case 0:
			return 0;
		case 1:
			return 1;
		case 2:
			return 2;
		default:
			return 3;
	}
};
var $elm$browser$Browser$External = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$Internal = function (a) {
	return {$: 0, a: a};
};
var $elm$core$Basics$identity = function (x) {
	return x;
};
var $elm$browser$Browser$Dom$NotFound = $elm$core$Basics$identity;
var $elm$url$Url$Http = 0;
var $elm$url$Url$Https = 1;
var $elm$url$Url$Url = F6(
	function (protocol, host, port_, path, query, fragment) {
		return {bF: fragment, bI: host, bT: path, bV: port_, bZ: protocol, b$: query};
	});
var $elm$core$String$contains = _String_contains;
var $elm$core$String$length = _String_length;
var $elm$core$String$slice = _String_slice;
var $elm$core$String$dropLeft = F2(
	function (n, string) {
		return (n < 1) ? string : A3(
			$elm$core$String$slice,
			n,
			$elm$core$String$length(string),
			string);
	});
var $elm$core$String$indexes = _String_indexes;
var $elm$core$String$isEmpty = function (string) {
	return string === '';
};
var $elm$core$String$left = F2(
	function (n, string) {
		return (n < 1) ? '' : A3($elm$core$String$slice, 0, n, string);
	});
var $elm$core$String$toInt = _String_toInt;
var $elm$url$Url$chompBeforePath = F5(
	function (protocol, path, params, frag, str) {
		if ($elm$core$String$isEmpty(str) || A2($elm$core$String$contains, '@', str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, ':', str);
			if (!_v0.b) {
				return $elm$core$Maybe$Just(
					A6($elm$url$Url$Url, protocol, str, $elm$core$Maybe$Nothing, path, params, frag));
			} else {
				if (!_v0.b.b) {
					var i = _v0.a;
					var _v1 = $elm$core$String$toInt(
						A2($elm$core$String$dropLeft, i + 1, str));
					if (_v1.$ === 1) {
						return $elm$core$Maybe$Nothing;
					} else {
						var port_ = _v1;
						return $elm$core$Maybe$Just(
							A6(
								$elm$url$Url$Url,
								protocol,
								A2($elm$core$String$left, i, str),
								port_,
								path,
								params,
								frag));
					}
				} else {
					return $elm$core$Maybe$Nothing;
				}
			}
		}
	});
var $elm$url$Url$chompBeforeQuery = F4(
	function (protocol, params, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '/', str);
			if (!_v0.b) {
				return A5($elm$url$Url$chompBeforePath, protocol, '/', params, frag, str);
			} else {
				var i = _v0.a;
				return A5(
					$elm$url$Url$chompBeforePath,
					protocol,
					A2($elm$core$String$dropLeft, i, str),
					params,
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompBeforeFragment = F3(
	function (protocol, frag, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '?', str);
			if (!_v0.b) {
				return A4($elm$url$Url$chompBeforeQuery, protocol, $elm$core$Maybe$Nothing, frag, str);
			} else {
				var i = _v0.a;
				return A4(
					$elm$url$Url$chompBeforeQuery,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					frag,
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$url$Url$chompAfterProtocol = F2(
	function (protocol, str) {
		if ($elm$core$String$isEmpty(str)) {
			return $elm$core$Maybe$Nothing;
		} else {
			var _v0 = A2($elm$core$String$indexes, '#', str);
			if (!_v0.b) {
				return A3($elm$url$Url$chompBeforeFragment, protocol, $elm$core$Maybe$Nothing, str);
			} else {
				var i = _v0.a;
				return A3(
					$elm$url$Url$chompBeforeFragment,
					protocol,
					$elm$core$Maybe$Just(
						A2($elm$core$String$dropLeft, i + 1, str)),
					A2($elm$core$String$left, i, str));
			}
		}
	});
var $elm$core$String$startsWith = _String_startsWith;
var $elm$url$Url$fromString = function (str) {
	return A2($elm$core$String$startsWith, 'http://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		0,
		A2($elm$core$String$dropLeft, 7, str)) : (A2($elm$core$String$startsWith, 'https://', str) ? A2(
		$elm$url$Url$chompAfterProtocol,
		1,
		A2($elm$core$String$dropLeft, 8, str)) : $elm$core$Maybe$Nothing);
};
var $elm$core$Basics$never = function (_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $elm$core$Task$Perform = $elm$core$Basics$identity;
var $elm$core$Task$succeed = _Scheduler_succeed;
var $elm$core$Task$init = $elm$core$Task$succeed(0);
var $elm$core$List$foldrHelper = F4(
	function (fn, acc, ctr, ls) {
		if (!ls.b) {
			return acc;
		} else {
			var a = ls.a;
			var r1 = ls.b;
			if (!r1.b) {
				return A2(fn, a, acc);
			} else {
				var b = r1.a;
				var r2 = r1.b;
				if (!r2.b) {
					return A2(
						fn,
						a,
						A2(fn, b, acc));
				} else {
					var c = r2.a;
					var r3 = r2.b;
					if (!r3.b) {
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(fn, c, acc)));
					} else {
						var d = r3.a;
						var r4 = r3.b;
						var res = (ctr > 500) ? A3(
							$elm$core$List$foldl,
							fn,
							acc,
							$elm$core$List$reverse(r4)) : A4($elm$core$List$foldrHelper, fn, acc, ctr + 1, r4);
						return A2(
							fn,
							a,
							A2(
								fn,
								b,
								A2(
									fn,
									c,
									A2(fn, d, res))));
					}
				}
			}
		}
	});
var $elm$core$List$foldr = F3(
	function (fn, acc, ls) {
		return A4($elm$core$List$foldrHelper, fn, acc, 0, ls);
	});
var $elm$core$List$map = F2(
	function (f, xs) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, acc) {
					return A2(
						$elm$core$List$cons,
						f(x),
						acc);
				}),
			_List_Nil,
			xs);
	});
var $elm$core$Task$andThen = _Scheduler_andThen;
var $elm$core$Task$map = F2(
	function (func, taskA) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return $elm$core$Task$succeed(
					func(a));
			},
			taskA);
	});
var $elm$core$Task$map2 = F3(
	function (func, taskA, taskB) {
		return A2(
			$elm$core$Task$andThen,
			function (a) {
				return A2(
					$elm$core$Task$andThen,
					function (b) {
						return $elm$core$Task$succeed(
							A2(func, a, b));
					},
					taskB);
			},
			taskA);
	});
var $elm$core$Task$sequence = function (tasks) {
	return A3(
		$elm$core$List$foldr,
		$elm$core$Task$map2($elm$core$List$cons),
		$elm$core$Task$succeed(_List_Nil),
		tasks);
};
var $elm$core$Platform$sendToApp = _Platform_sendToApp;
var $elm$core$Task$spawnCmd = F2(
	function (router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(
			A2(
				$elm$core$Task$andThen,
				$elm$core$Platform$sendToApp(router),
				task));
	});
var $elm$core$Task$onEffects = F3(
	function (router, commands, state) {
		return A2(
			$elm$core$Task$map,
			function (_v0) {
				return 0;
			},
			$elm$core$Task$sequence(
				A2(
					$elm$core$List$map,
					$elm$core$Task$spawnCmd(router),
					commands)));
	});
var $elm$core$Task$onSelfMsg = F3(
	function (_v0, _v1, _v2) {
		return $elm$core$Task$succeed(0);
	});
var $elm$core$Task$cmdMap = F2(
	function (tagger, _v0) {
		var task = _v0;
		return A2($elm$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($elm$core$Task$init, $elm$core$Task$onEffects, $elm$core$Task$onSelfMsg, $elm$core$Task$cmdMap);
var $elm$core$Task$command = _Platform_leaf('Task');
var $elm$core$Task$perform = F2(
	function (toMessage, task) {
		return $elm$core$Task$command(
			A2($elm$core$Task$map, toMessage, task));
	});
var $elm$browser$Browser$application = _Browser_application;
var $elm$core$Set$Set_elm_builtin = $elm$core$Basics$identity;
var $elm$core$Dict$RBEmpty_elm_builtin = {$: -2};
var $elm$core$Dict$empty = $elm$core$Dict$RBEmpty_elm_builtin;
var $elm$core$Set$empty = $elm$core$Dict$empty;
var $elm$core$Dict$Black = 1;
var $elm$core$Dict$RBNode_elm_builtin = F5(
	function (a, b, c, d, e) {
		return {$: -1, a: a, b: b, c: c, d: d, e: e};
	});
var $elm$core$Dict$Red = 0;
var $elm$core$Dict$balance = F5(
	function (color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					key,
					value,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					rK,
					rV,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, left, rLeft),
					rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					0,
					lK,
					lV,
					A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, lRight, right));
			} else {
				return A5($elm$core$Dict$RBNode_elm_builtin, color, key, value, left, right);
			}
		}
	});
var $elm$core$Basics$compare = _Utils_compare;
var $elm$core$Dict$insertHelp = F3(
	function (key, value, dict) {
		if (dict.$ === -2) {
			return A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($elm$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						A3($elm$core$Dict$insertHelp, key, value, nLeft),
						nRight);
				case 1:
					return A5($elm$core$Dict$RBNode_elm_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						nLeft,
						A3($elm$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $elm$core$Dict$insert = F3(
	function (key, value, dict) {
		var _v0 = A3($elm$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Set$insert = F2(
	function (key, _v0) {
		var dict = _v0;
		return A3($elm$core$Dict$insert, key, 0, dict);
	});
var $elm$core$Set$fromList = function (list) {
	return A3($elm$core$List$foldl, $elm$core$Set$insert, $elm$core$Set$empty, list);
};
var $elm$core$Basics$negate = function (n) {
	return -n;
};
var $author$project$Extra$GameOfLife$ExampleBoards$gliderGun = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(-17, 0),
			_Utils_Tuple2(-17, 1),
			_Utils_Tuple2(-16, 0),
			_Utils_Tuple2(-16, 1),
			_Utils_Tuple2(-7, 0),
			_Utils_Tuple2(-7, 1),
			_Utils_Tuple2(-7, 2),
			_Utils_Tuple2(-6, -1),
			_Utils_Tuple2(-6, 3),
			_Utils_Tuple2(-5, -2),
			_Utils_Tuple2(-5, 4),
			_Utils_Tuple2(-4, -2),
			_Utils_Tuple2(-4, 4),
			_Utils_Tuple2(-3, 1),
			_Utils_Tuple2(-2, -1),
			_Utils_Tuple2(-2, 3),
			_Utils_Tuple2(-1, 0),
			_Utils_Tuple2(-1, 1),
			_Utils_Tuple2(-1, 2),
			_Utils_Tuple2(0, 1),
			_Utils_Tuple2(3, -2),
			_Utils_Tuple2(3, -1),
			_Utils_Tuple2(3, 0),
			_Utils_Tuple2(4, -2),
			_Utils_Tuple2(4, -1),
			_Utils_Tuple2(4, 0),
			_Utils_Tuple2(5, -3),
			_Utils_Tuple2(5, 1),
			_Utils_Tuple2(7, -4),
			_Utils_Tuple2(7, -3),
			_Utils_Tuple2(7, 1),
			_Utils_Tuple2(7, 2),
			_Utils_Tuple2(17, -2),
			_Utils_Tuple2(17, -1),
			_Utils_Tuple2(18, -2),
			_Utils_Tuple2(18, -1)
		]));
var $elm$core$Dict$foldl = F3(
	function (func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
					$temp$acc = A3(
					func,
					key,
					value,
					A3($elm$core$Dict$foldl, func, acc, left)),
					$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $elm$core$Set$foldl = F3(
	function (func, initialState, _v0) {
		var dict = _v0;
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (key, _v1, state) {
					return A2(func, key, state);
				}),
			initialState,
			dict);
	});
var $elm$core$Set$map = F2(
	function (func, set) {
		return $elm$core$Set$fromList(
			A3(
				$elm$core$Set$foldl,
				F2(
					function (x, xs) {
						return A2(
							$elm$core$List$cons,
							func(x),
							xs);
					}),
				_List_Nil,
				set));
	});
var $author$project$Extra$GameOfLife$App$offset = F2(
	function (n, m) {
		return $elm$core$Set$map(
			function (_v0) {
				var x = _v0.a;
				var y = _v0.b;
				return _Utils_Tuple2(x + n, y + m);
			});
	});
var $author$project$Extra$GameOfLife$App$initialBoard = A3($author$project$Extra$GameOfLife$App$offset, 50, 20, $author$project$Extra$GameOfLife$ExampleBoards$gliderGun);
var $elm$core$Basics$sqrt = _Basics_sqrt;
var $author$project$Pages$Test$amplitude = function (n) {
	var _v0 = n;
	var a = _v0.a;
	var b = _v0.b;
	return $elm$core$Basics$sqrt((a * a) + (b * b));
};
var $author$project$Pages$Test$mult = F2(
	function (n, m) {
		var _v0 = _Utils_Tuple2(n, m);
		var _v1 = _v0.a;
		var a = _v1.a;
		var b = _v1.b;
		var _v2 = _v0.b;
		var c = _v2.a;
		var d = _v2.b;
		return _Utils_Tuple2((a * c) - (b * d), (a * d) + (b * c));
	});
var $elm$core$List$sum = function (numbers) {
	return A3($elm$core$List$foldl, $elm$core$Basics$add, 0, numbers);
};
var $author$project$Pages$Test$normalize = function (l) {
	var amp = $elm$core$List$sum(
		A2($elm$core$List$map, $author$project$Pages$Test$amplitude, l));
	return A2(
		$elm$core$List$map,
		$author$project$Pages$Test$mult(
			_Utils_Tuple2(1 / amp, 0)),
		l);
};
var $elm$core$Basics$cos = _Basics_cos;
var $elm$core$Basics$pi = _Basics_pi;
var $elm$core$Basics$sin = _Basics_sin;
var $author$project$Pages$Test$planeWave = function (n) {
	var k = $elm$core$Basics$pi / 8;
	return A2(
		$elm$core$List$map,
		function (x) {
			return _Utils_Tuple2(
				$elm$core$Basics$cos(k * x),
				$elm$core$Basics$sin(k * x));
		},
		A2($elm$core$List$range, 0, n - 1));
};
var $author$project$Pages$Test$initialComplexList = $author$project$Pages$Test$normalize(
	$author$project$Pages$Test$planeWave(16));
var $author$project$Sitewide$Types$GameOfLifeStep = {$: 8};
var $author$project$Sitewide$Types$SelectPage = function (a) {
	return {$: 2, a: a};
};
var $author$project$Sitewide$Types$ToggleClock = {$: 6};
var $author$project$Sitewide$Types$ToggleContactForm = {$: 7};
var $author$project$Sitewide$Update$commandInterpreter = F2(
	function (_v0, s) {
		switch (s) {
			case 'NAV':
				return $elm$core$Maybe$Just(
					$author$project$Sitewide$Types$SelectPage('/NAV'));
			case 'REC':
				return $elm$core$Maybe$Just(
					$author$project$Sitewide$Types$SelectPage('/REC'));
			case 'GOG':
				return $elm$core$Maybe$Just(
					$author$project$Sitewide$Types$SelectPage('/GOG'));
			case 'LIFE':
				return $elm$core$Maybe$Just(
					$author$project$Sitewide$Types$SelectPage('/LIFE'));
			case 'TEST':
				return $elm$core$Maybe$Just(
					$author$project$Sitewide$Types$SelectPage('/TEST'));
			case 'CLOCK':
				return $elm$core$Maybe$Just($author$project$Sitewide$Types$ToggleClock);
			case 'MSG':
				return $elm$core$Maybe$Just($author$project$Sitewide$Types$ToggleContactForm);
			default:
				return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Basics$ge = _Utils_ge;
var $author$project$Sitewide$Update$intervalCount = F2(
	function (time, intervalDuration) {
		return $elm$core$Basics$floor(time / intervalDuration);
	});
var $elm$browser$Browser$Navigation$load = _Browser_load;
var $elm$core$String$map = _String_map;
var $elm$core$Platform$Cmd$batch = _Platform_batch;
var $elm$core$Platform$Cmd$none = $elm$core$Platform$Cmd$batch(_List_Nil);
var $elm$core$Basics$not = _Basics_not;
var $elm$browser$Browser$Navigation$pushUrl = _Browser_pushUrl;
var $elm$core$Char$toUpper = _Char_toUpper;
var $rtfeldman$elm_css$VirtualDom$Styled$Node = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$Node;
var $rtfeldman$elm_css$Html$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$node;
var $rtfeldman$elm_css$Html$Styled$a = $rtfeldman$elm_css$Html$Styled$node('a');
var $rtfeldman$elm_css$Css$Preprocess$AppendProperty = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Structure$Property = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$prop1 = F2(
	function (key, arg) {
		return A2($rtfeldman$elm_css$Css$property, key, arg.D);
	});
var $rtfeldman$elm_css$Css$center = $rtfeldman$elm_css$Css$prop1('center');
var $rtfeldman$elm_css$VirtualDom$Styled$Attribute = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$virtual_dom$VirtualDom$attribute = F2(
	function (key, value) {
		return A2(
			_VirtualDom_attribute,
			_VirtualDom_noOnOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlUri(value));
	});
var $elm$core$List$any = F2(
	function (isOkay, list) {
		any:
		while (true) {
			if (!list.b) {
				return false;
			} else {
				var x = list.a;
				var xs = list.b;
				if (isOkay(x)) {
					return true;
				} else {
					var $temp$isOkay = isOkay,
						$temp$list = xs;
					isOkay = $temp$isOkay;
					list = $temp$list;
					continue any;
				}
			}
		}
	});
var $elm$core$Basics$composeL = F3(
	function (g, f, x) {
		return g(
			f(x));
	});
var $elm$core$List$all = F2(
	function (isOkay, list) {
		return !A2(
			$elm$core$List$any,
			A2($elm$core$Basics$composeL, $elm$core$Basics$not, isOkay),
			list);
	});
var $elm$core$List$isEmpty = function (xs) {
	if (!xs.b) {
		return true;
	} else {
		return false;
	}
};
var $rtfeldman$elm_css$Css$Structure$compactHelp = F2(
	function (declaration, _v0) {
		var keyframesByName = _v0.a;
		var declarations = _v0.b;
		switch (declaration.$) {
			case 0:
				var _v2 = declaration.a;
				var properties = _v2.c;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 1:
				var styleBlocks = declaration.b;
				return A2(
					$elm$core$List$all,
					function (_v3) {
						var properties = _v3.c;
						return $elm$core$List$isEmpty(properties);
					},
					styleBlocks) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 2:
				var otherDeclarations = declaration.b;
				return $elm$core$List$isEmpty(otherDeclarations) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 3:
				return _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 4:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 5:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 6:
				var record = declaration.a;
				return $elm$core$String$isEmpty(record.cy) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					A3($elm$core$Dict$insert, record.cP, record.cy, keyframesByName),
					declarations);
			case 7:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			case 8:
				var properties = declaration.a;
				return $elm$core$List$isEmpty(properties) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
			default:
				var tuples = declaration.a;
				return A2(
					$elm$core$List$all,
					function (_v4) {
						var properties = _v4.b;
						return $elm$core$List$isEmpty(properties);
					},
					tuples) ? _Utils_Tuple2(keyframesByName, declarations) : _Utils_Tuple2(
					keyframesByName,
					A2($elm$core$List$cons, declaration, declarations));
		}
	});
var $rtfeldman$elm_css$Css$Structure$Keyframes = function (a) {
	return {$: 6, a: a};
};
var $elm$core$List$append = F2(
	function (xs, ys) {
		if (!ys.b) {
			return xs;
		} else {
			return A3($elm$core$List$foldr, $elm$core$List$cons, ys, xs);
		}
	});
var $rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations = F2(
	function (keyframesByName, compactedDeclarations) {
		return A2(
			$elm$core$List$append,
			A2(
				$elm$core$List$map,
				function (_v0) {
					var name = _v0.a;
					var decl = _v0.b;
					return $rtfeldman$elm_css$Css$Structure$Keyframes(
						{cy: decl, cP: name});
				},
				$elm$core$Dict$toList(keyframesByName)),
			compactedDeclarations);
	});
var $rtfeldman$elm_css$Css$Structure$compactDeclarations = function (declarations) {
	var _v0 = A3(
		$elm$core$List$foldr,
		$rtfeldman$elm_css$Css$Structure$compactHelp,
		_Utils_Tuple2($elm$core$Dict$empty, _List_Nil),
		declarations);
	var keyframesByName = _v0.a;
	var compactedDeclarations = _v0.b;
	return A2($rtfeldman$elm_css$Css$Structure$withKeyframeDeclarations, keyframesByName, compactedDeclarations);
};
var $rtfeldman$elm_css$Css$Structure$compactStylesheet = function (_v0) {
	var charset = _v0.bv;
	var imports = _v0.bJ;
	var namespaces = _v0.bQ;
	var declarations = _v0.cz;
	return {
		bv: charset,
		cz: $rtfeldman$elm_css$Css$Structure$compactDeclarations(declarations),
		bJ: imports,
		bQ: namespaces
	};
};
var $elm$core$Maybe$map = F2(
	function (f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $elm$core$Maybe$Just(
				f(value));
		} else {
			return $elm$core$Maybe$Nothing;
		}
	});
var $elm$core$Maybe$withDefault = F2(
	function (_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $rtfeldman$elm_css$Css$Structure$Output$charsetToString = function (charset) {
	return A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			function (str) {
				return '@charset \"' + (str + '\"');
			},
			charset));
};
var $rtfeldman$elm_css$Css$String$mapJoinHelp = F4(
	function (map, sep, strs, result) {
		mapJoinHelp:
		while (true) {
			if (!strs.b) {
				return result;
			} else {
				if (!strs.b.b) {
					var first = strs.a;
					return result + (map(first) + '');
				} else {
					var first = strs.a;
					var rest = strs.b;
					var $temp$map = map,
						$temp$sep = sep,
						$temp$strs = rest,
						$temp$result = result + (map(first) + (sep + ''));
					map = $temp$map;
					sep = $temp$sep;
					strs = $temp$strs;
					result = $temp$result;
					continue mapJoinHelp;
				}
			}
		}
	});
var $rtfeldman$elm_css$Css$String$mapJoin = F3(
	function (map, sep, strs) {
		return A4($rtfeldman$elm_css$Css$String$mapJoinHelp, map, sep, strs, '');
	});
var $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString = function (expression) {
	return '(' + (expression.bC + (A2(
		$elm$core$Maybe$withDefault,
		'',
		A2(
			$elm$core$Maybe$map,
			$elm$core$Basics$append(': '),
			expression.D)) + ')'));
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString = function (mediaType) {
	switch (mediaType) {
		case 0:
			return 'print';
		case 1:
			return 'screen';
		default:
			return 'speech';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString = function (mediaQuery) {
	var prefixWith = F3(
		function (str, mediaType, expressions) {
			return str + (' ' + A2(
				$elm$core$String$join,
				' and ',
				A2(
					$elm$core$List$cons,
					$rtfeldman$elm_css$Css$Structure$Output$mediaTypeToString(mediaType),
					A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, expressions))));
		});
	switch (mediaQuery.$) {
		case 0:
			var expressions = mediaQuery.a;
			return A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$mediaExpressionToString, ' and ', expressions);
		case 1:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'only', mediaType, expressions);
		case 2:
			var mediaType = mediaQuery.a;
			var expressions = mediaQuery.b;
			return A3(prefixWith, 'not', mediaType, expressions);
		default:
			var str = mediaQuery.a;
			return str;
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString = F2(
	function (name, mediaQuery) {
		return '@import \"' + (name + ($rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString(mediaQuery) + '\"'));
	});
var $rtfeldman$elm_css$Css$Structure$Output$importToString = function (_v0) {
	var name = _v0.a;
	var mediaQueries = _v0.b;
	return A3(
		$rtfeldman$elm_css$Css$String$mapJoin,
		$rtfeldman$elm_css$Css$Structure$Output$importMediaQueryToString(name),
		'\n',
		mediaQueries);
};
var $rtfeldman$elm_css$Css$Structure$Output$namespaceToString = function (_v0) {
	var prefix = _v0.a;
	var str = _v0.b;
	return '@namespace ' + (prefix + ('\"' + (str + '\"')));
};
var $rtfeldman$elm_css$Css$Structure$Output$emitProperties = function (properties) {
	return A3(
		$rtfeldman$elm_css$Css$String$mapJoin,
		function (_v0) {
			var prop = _v0;
			return prop + ';';
		},
		'',
		properties);
};
var $elm$core$String$append = _String_append;
var $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString = function (_v0) {
	var str = _v0;
	return '::' + str;
};
var $rtfeldman$elm_css$Css$Structure$Output$combinatorToString = function (combinator) {
	switch (combinator) {
		case 0:
			return '+';
		case 1:
			return '~';
		case 2:
			return '>';
		default:
			return '';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString = function (repeatableSimpleSelector) {
	switch (repeatableSimpleSelector.$) {
		case 0:
			var str = repeatableSimpleSelector.a;
			return '.' + str;
		case 1:
			var str = repeatableSimpleSelector.a;
			return '#' + str;
		case 2:
			var str = repeatableSimpleSelector.a;
			return ':' + str;
		default:
			var str = repeatableSimpleSelector.a;
			return '[' + (str + ']');
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString = function (simpleSelectorSequence) {
	switch (simpleSelectorSequence.$) {
		case 0:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return _Utils_ap(
				str,
				A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, '', repeatableSimpleSelectors));
		case 1:
			var repeatableSimpleSelectors = simpleSelectorSequence.a;
			return $elm$core$List$isEmpty(repeatableSimpleSelectors) ? '*' : A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, '', repeatableSimpleSelectors);
		default:
			var str = simpleSelectorSequence.a;
			var repeatableSimpleSelectors = simpleSelectorSequence.b;
			return _Utils_ap(
				str,
				A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$repeatableSimpleSelectorToString, '', repeatableSimpleSelectors));
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString = function (_v0) {
	var combinator = _v0.a;
	var sequence = _v0.b;
	return $rtfeldman$elm_css$Css$Structure$Output$combinatorToString(combinator) + (' ' + $rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(sequence));
};
var $rtfeldman$elm_css$Css$Structure$Output$selectorToString = function (_v0) {
	var simpleSelectorSequence = _v0.a;
	var chain = _v0.b;
	var pseudoElement = _v0.c;
	var segments = A2(
		$elm$core$List$cons,
		$rtfeldman$elm_css$Css$Structure$Output$simpleSelectorSequenceToString(simpleSelectorSequence),
		A2($elm$core$List$map, $rtfeldman$elm_css$Css$Structure$Output$selectorChainToString, chain));
	var pseudoElementsString = A2(
		$elm$core$Maybe$withDefault,
		'',
		A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Structure$Output$pseudoElementToString, pseudoElement));
	return A2(
		$elm$core$String$append,
		A2($elm$core$String$join, ' ', segments),
		pseudoElementsString);
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock = function (_v0) {
	var firstSelector = _v0.a;
	var otherSelectors = _v0.b;
	var properties = _v0.c;
	var selectorStr = A3(
		$rtfeldman$elm_css$Css$String$mapJoin,
		$rtfeldman$elm_css$Css$Structure$Output$selectorToString,
		',',
		A2($elm$core$List$cons, firstSelector, otherSelectors));
	return selectorStr + ('{' + ($rtfeldman$elm_css$Css$Structure$Output$emitProperties(properties) + '}'));
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration = function (decl) {
	switch (decl.$) {
		case 0:
			var styleBlock = decl.a;
			return $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock(styleBlock);
		case 1:
			var mediaQueries = decl.a;
			var styleBlocks = decl.b;
			var query = A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$mediaQueryToString, ', ', mediaQueries);
			var blocks = A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintStyleBlock, '\n', styleBlocks);
			return '@media ' + (query + ('{' + (blocks + '}')));
		case 2:
			return 'TODO';
		case 3:
			return 'TODO';
		case 4:
			return 'TODO';
		case 5:
			return 'TODO';
		case 6:
			var name = decl.a.cP;
			var declaration = decl.a.cy;
			return '@keyframes ' + (name + ('{' + (declaration + '}')));
		case 7:
			return 'TODO';
		case 8:
			return 'TODO';
		default:
			return 'TODO';
	}
};
var $rtfeldman$elm_css$Css$Structure$Output$prettyPrint = function (_v0) {
	var charset = _v0.bv;
	var imports = _v0.bJ;
	var namespaces = _v0.bQ;
	var declarations = _v0.cz;
	return $rtfeldman$elm_css$Css$Structure$Output$charsetToString(charset) + (A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$importToString, '\n', imports) + (A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$namespaceToString, '\n', namespaces) + (A3($rtfeldman$elm_css$Css$String$mapJoin, $rtfeldman$elm_css$Css$Structure$Output$prettyPrintDeclaration, '\n', declarations) + '')));
};
var $elm$core$List$concat = function (lists) {
	return A3($elm$core$List$foldr, $elm$core$List$append, _List_Nil, lists);
};
var $elm$core$List$concatMap = F2(
	function (f, list) {
		return $elm$core$List$concat(
			A2($elm$core$List$map, f, list));
	});
var $rtfeldman$elm_css$Css$Structure$CounterStyle = function (a) {
	return {$: 8, a: a};
};
var $rtfeldman$elm_css$Css$Structure$FontFace = function (a) {
	return {$: 5, a: a};
};
var $rtfeldman$elm_css$Css$Structure$PageRule = function (a) {
	return {$: 4, a: a};
};
var $rtfeldman$elm_css$Css$Structure$Selector = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$Css$Structure$SupportsRule = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$Viewport = function (a) {
	return {$: 7, a: a};
};
var $rtfeldman$elm_css$Css$Structure$MediaRule = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$mapLast = F2(
	function (update, list) {
		if (!list.b) {
			return list;
		} else {
			if (!list.b.b) {
				var only = list.a;
				return _List_fromArray(
					[
						update(only)
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$mapLast, update, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$withPropertyAppended = F2(
	function (property, _v0) {
		var firstSelector = _v0.a;
		var otherSelectors = _v0.b;
		var properties = _v0.c;
		return A3(
			$rtfeldman$elm_css$Css$Structure$StyleBlock,
			firstSelector,
			otherSelectors,
			_Utils_ap(
				properties,
				_List_fromArray(
					[property])));
	});
var $rtfeldman$elm_css$Css$Structure$appendProperty = F2(
	function (property, declarations) {
		if (!declarations.b) {
			return declarations;
		} else {
			if (!declarations.b.b) {
				switch (declarations.a.$) {
					case 0:
						var styleBlock = declarations.a.a;
						return _List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
								A2($rtfeldman$elm_css$Css$Structure$withPropertyAppended, property, styleBlock))
							]);
					case 1:
						var _v1 = declarations.a;
						var mediaQueries = _v1.a;
						var styleBlocks = _v1.b;
						return _List_fromArray(
							[
								A2(
								$rtfeldman$elm_css$Css$Structure$MediaRule,
								mediaQueries,
								A2(
									$rtfeldman$elm_css$Css$Structure$mapLast,
									$rtfeldman$elm_css$Css$Structure$withPropertyAppended(property),
									styleBlocks))
							]);
					default:
						return declarations;
				}
			} else {
				var first = declarations.a;
				var rest = declarations.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendToLastSelector = F2(
	function (f, styleBlock) {
		if (!styleBlock.b.b) {
			var only = styleBlock.a;
			var properties = styleBlock.c;
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, only, _List_Nil, properties),
					A3(
					$rtfeldman$elm_css$Css$Structure$StyleBlock,
					f(only),
					_List_Nil,
					_List_Nil)
				]);
		} else {
			var first = styleBlock.a;
			var rest = styleBlock.b;
			var properties = styleBlock.c;
			var newRest = A2($elm$core$List$map, f, rest);
			var newFirst = f(first);
			return _List_fromArray(
				[
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, rest, properties),
					A3($rtfeldman$elm_css$Css$Structure$StyleBlock, newFirst, newRest, _List_Nil)
				]);
		}
	});
var $rtfeldman$elm_css$Css$Structure$applyPseudoElement = F2(
	function (pseudo, _v0) {
		var sequence = _v0.a;
		var selectors = _v0.b;
		return A3(
			$rtfeldman$elm_css$Css$Structure$Selector,
			sequence,
			selectors,
			$elm$core$Maybe$Just(pseudo));
	});
var $rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector = F2(
	function (pseudo, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$applyPseudoElement(pseudo),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Structure$CustomSelector = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$TypeSelectorSequence = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence = function (a) {
	return {$: 1, a: a};
};
var $rtfeldman$elm_css$Css$Structure$appendRepeatable = F2(
	function (selector, sequence) {
		switch (sequence.$) {
			case 0:
				var typeSelector = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$TypeSelectorSequence,
					typeSelector,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			case 1:
				var list = sequence.a;
				return $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
			default:
				var str = sequence.a;
				var list = sequence.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$CustomSelector,
					str,
					_Utils_ap(
						list,
						_List_fromArray(
							[selector])));
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator = F2(
	function (selector, list) {
		if (!list.b) {
			return _List_Nil;
		} else {
			if (!list.b.b) {
				var _v1 = list.a;
				var combinator = _v1.a;
				var sequence = _v1.b;
				return _List_fromArray(
					[
						_Utils_Tuple2(
						combinator,
						A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, selector, sequence))
					]);
			} else {
				var first = list.a;
				var rest = list.b;
				return A2(
					$elm$core$List$cons,
					first,
					A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, selector, rest));
			}
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableSelector = F2(
	function (repeatableSimpleSelector, selector) {
		if (!selector.b.b) {
			var sequence = selector.a;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatable, repeatableSimpleSelector, sequence),
				_List_Nil,
				pseudoElement);
		} else {
			var firstSelector = selector.a;
			var tuples = selector.b;
			var pseudoElement = selector.c;
			return A3(
				$rtfeldman$elm_css$Css$Structure$Selector,
				firstSelector,
				A2($rtfeldman$elm_css$Css$Structure$appendRepeatableWithCombinator, repeatableSimpleSelector, tuples),
				pseudoElement);
		}
	});
var $rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector = F2(
	function (selector, styleBlock) {
		return A2(
			$rtfeldman$elm_css$Css$Structure$appendToLastSelector,
			$rtfeldman$elm_css$Css$Structure$appendRepeatableSelector(selector),
			styleBlock);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors = function (declarations) {
	collectSelectors:
	while (true) {
		if (!declarations.b) {
			return _List_Nil;
		} else {
			if (!declarations.a.$) {
				var _v1 = declarations.a.a;
				var firstSelector = _v1.a;
				var otherSelectors = _v1.b;
				var rest = declarations.b;
				return _Utils_ap(
					A2($elm$core$List$cons, firstSelector, otherSelectors),
					$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(rest));
			} else {
				var rest = declarations.b;
				var $temp$declarations = rest;
				declarations = $temp$declarations;
				continue collectSelectors;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$DocumentRule = F5(
	function (a, b, c, d, e) {
		return {$: 3, a: a, b: b, c: c, d: d, e: e};
	});
var $rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock = F2(
	function (update, declarations) {
		_v0$12:
		while (true) {
			if (!declarations.b) {
				return declarations;
			} else {
				if (!declarations.b.b) {
					switch (declarations.a.$) {
						case 0:
							var styleBlock = declarations.a.a;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration,
								update(styleBlock));
						case 1:
							if (declarations.a.b.b) {
								if (!declarations.a.b.b.b) {
									var _v1 = declarations.a;
									var mediaQueries = _v1.a;
									var _v2 = _v1.b;
									var styleBlock = _v2.a;
									return _List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Structure$MediaRule,
											mediaQueries,
											update(styleBlock))
										]);
								} else {
									var _v3 = declarations.a;
									var mediaQueries = _v3.a;
									var _v4 = _v3.b;
									var first = _v4.a;
									var rest = _v4.b;
									var _v5 = A2(
										$rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock,
										update,
										_List_fromArray(
											[
												A2($rtfeldman$elm_css$Css$Structure$MediaRule, mediaQueries, rest)
											]));
									if ((_v5.b && (_v5.a.$ === 1)) && (!_v5.b.b)) {
										var _v6 = _v5.a;
										var newMediaQueries = _v6.a;
										var newStyleBlocks = _v6.b;
										return _List_fromArray(
											[
												A2(
												$rtfeldman$elm_css$Css$Structure$MediaRule,
												newMediaQueries,
												A2($elm$core$List$cons, first, newStyleBlocks))
											]);
									} else {
										var newDeclarations = _v5;
										return newDeclarations;
									}
								}
							} else {
								break _v0$12;
							}
						case 2:
							var _v7 = declarations.a;
							var str = _v7.a;
							var nestedDeclarations = _v7.b;
							return _List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Css$Structure$SupportsRule,
									str,
									A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, nestedDeclarations))
								]);
						case 3:
							var _v8 = declarations.a;
							var str1 = _v8.a;
							var str2 = _v8.b;
							var str3 = _v8.c;
							var str4 = _v8.d;
							var styleBlock = _v8.e;
							return A2(
								$elm$core$List$map,
								A4($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4),
								update(styleBlock));
						case 4:
							return declarations;
						case 5:
							return declarations;
						case 6:
							return declarations;
						case 7:
							return declarations;
						case 8:
							return declarations;
						default:
							return declarations;
					}
				} else {
					break _v0$12;
				}
			}
		}
		var first = declarations.a;
		var rest = declarations.b;
		return A2(
			$elm$core$List$cons,
			first,
			A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, update, rest));
	});
var $elm$core$String$cons = _String_cons;
var $robinheghan$murmur3$Murmur3$HashData = F4(
	function (shift, seed, hash, charsProcessed) {
		return {ab: charsProcessed, ag: hash, U: seed, am: shift};
	});
var $robinheghan$murmur3$Murmur3$c1 = 3432918353;
var $robinheghan$murmur3$Murmur3$c2 = 461845907;
var $elm$core$Bitwise$and = _Bitwise_and;
var $elm$core$Bitwise$shiftLeftBy = _Bitwise_shiftLeftBy;
var $elm$core$Bitwise$shiftRightZfBy = _Bitwise_shiftRightZfBy;
var $robinheghan$murmur3$Murmur3$multiplyBy = F2(
	function (b, a) {
		return ((a & 65535) * b) + ((((a >>> 16) * b) & 65535) << 16);
	});
var $elm$core$Basics$neq = _Utils_notEqual;
var $elm$core$Bitwise$or = _Bitwise_or;
var $robinheghan$murmur3$Murmur3$rotlBy = F2(
	function (b, a) {
		return (a << b) | (a >>> (32 - b));
	});
var $elm$core$Bitwise$xor = _Bitwise_xor;
var $robinheghan$murmur3$Murmur3$finalize = function (data) {
	var acc = (!(!data.ag)) ? (data.U ^ A2(
		$robinheghan$murmur3$Murmur3$multiplyBy,
		$robinheghan$murmur3$Murmur3$c2,
		A2(
			$robinheghan$murmur3$Murmur3$rotlBy,
			15,
			A2($robinheghan$murmur3$Murmur3$multiplyBy, $robinheghan$murmur3$Murmur3$c1, data.ag)))) : data.U;
	var h0 = acc ^ data.ab;
	var h1 = A2($robinheghan$murmur3$Murmur3$multiplyBy, 2246822507, h0 ^ (h0 >>> 16));
	var h2 = A2($robinheghan$murmur3$Murmur3$multiplyBy, 3266489909, h1 ^ (h1 >>> 13));
	return (h2 ^ (h2 >>> 16)) >>> 0;
};
var $elm$core$String$foldl = _String_foldl;
var $robinheghan$murmur3$Murmur3$mix = F2(
	function (h1, k1) {
		return A2(
			$robinheghan$murmur3$Murmur3$multiplyBy,
			5,
			A2(
				$robinheghan$murmur3$Murmur3$rotlBy,
				13,
				h1 ^ A2(
					$robinheghan$murmur3$Murmur3$multiplyBy,
					$robinheghan$murmur3$Murmur3$c2,
					A2(
						$robinheghan$murmur3$Murmur3$rotlBy,
						15,
						A2($robinheghan$murmur3$Murmur3$multiplyBy, $robinheghan$murmur3$Murmur3$c1, k1))))) + 3864292196;
	});
var $robinheghan$murmur3$Murmur3$hashFold = F2(
	function (c, data) {
		var res = data.ag | ((255 & $elm$core$Char$toCode(c)) << data.am);
		var _v0 = data.am;
		if (_v0 === 24) {
			return {
				ab: data.ab + 1,
				ag: 0,
				U: A2($robinheghan$murmur3$Murmur3$mix, data.U, res),
				am: 0
			};
		} else {
			return {ab: data.ab + 1, ag: res, U: data.U, am: data.am + 8};
		}
	});
var $robinheghan$murmur3$Murmur3$hashString = F2(
	function (seed, str) {
		return $robinheghan$murmur3$Murmur3$finalize(
			A3(
				$elm$core$String$foldl,
				$robinheghan$murmur3$Murmur3$hashFold,
				A4($robinheghan$murmur3$Murmur3$HashData, 0, seed, 0, 0),
				str));
	});
var $rtfeldman$elm_css$Hash$initialSeed = 15739;
var $elm$core$String$fromList = _String_fromList;
var $elm$core$Basics$modBy = _Basics_modBy;
var $rtfeldman$elm_hex$Hex$unsafeToDigit = function (num) {
	unsafeToDigit:
	while (true) {
		switch (num) {
			case 0:
				return '0';
			case 1:
				return '1';
			case 2:
				return '2';
			case 3:
				return '3';
			case 4:
				return '4';
			case 5:
				return '5';
			case 6:
				return '6';
			case 7:
				return '7';
			case 8:
				return '8';
			case 9:
				return '9';
			case 10:
				return 'a';
			case 11:
				return 'b';
			case 12:
				return 'c';
			case 13:
				return 'd';
			case 14:
				return 'e';
			case 15:
				return 'f';
			default:
				var $temp$num = num;
				num = $temp$num;
				continue unsafeToDigit;
		}
	}
};
var $rtfeldman$elm_hex$Hex$unsafePositiveToDigits = F2(
	function (digits, num) {
		unsafePositiveToDigits:
		while (true) {
			if (num < 16) {
				return A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(num),
					digits);
			} else {
				var $temp$digits = A2(
					$elm$core$List$cons,
					$rtfeldman$elm_hex$Hex$unsafeToDigit(
						A2($elm$core$Basics$modBy, 16, num)),
					digits),
					$temp$num = (num / 16) | 0;
				digits = $temp$digits;
				num = $temp$num;
				continue unsafePositiveToDigits;
			}
		}
	});
var $rtfeldman$elm_hex$Hex$toString = function (num) {
	return $elm$core$String$fromList(
		(num < 0) ? A2(
			$elm$core$List$cons,
			'-',
			A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, -num)) : A2($rtfeldman$elm_hex$Hex$unsafePositiveToDigits, _List_Nil, num));
};
var $rtfeldman$elm_css$Hash$fromString = function (str) {
	return A2(
		$elm$core$String$cons,
		'_',
		$rtfeldman$elm_hex$Hex$toString(
			A2($robinheghan$murmur3$Murmur3$hashString, $rtfeldman$elm_css$Hash$initialSeed, str)));
};
var $elm$core$List$head = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(x);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$last = function (list) {
	last:
	while (true) {
		if (!list.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!list.b.b) {
				var singleton = list.a;
				return $elm$core$Maybe$Just(singleton);
			} else {
				var rest = list.b;
				var $temp$list = rest;
				list = $temp$list;
				continue last;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration = function (declarations) {
	lastDeclaration:
	while (true) {
		if (!declarations.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			if (!declarations.b.b) {
				var x = declarations.a;
				return $elm$core$Maybe$Just(
					_List_fromArray(
						[x]));
			} else {
				var xs = declarations.b;
				var $temp$declarations = xs;
				declarations = $temp$declarations;
				continue lastDeclaration;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf = function (maybes) {
	oneOf:
	while (true) {
		if (!maybes.b) {
			return $elm$core$Maybe$Nothing;
		} else {
			var maybe = maybes.a;
			var rest = maybes.b;
			if (maybe.$ === 1) {
				var $temp$maybes = rest;
				maybes = $temp$maybes;
				continue oneOf;
			} else {
				return maybe;
			}
		}
	}
};
var $rtfeldman$elm_css$Css$Structure$FontFeatureValues = function (a) {
	return {$: 9, a: a};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues = function (tuples) {
	var expandTuples = function (tuplesToExpand) {
		if (!tuplesToExpand.b) {
			return _List_Nil;
		} else {
			var properties = tuplesToExpand.a;
			var rest = tuplesToExpand.b;
			return A2(
				$elm$core$List$cons,
				properties,
				expandTuples(rest));
		}
	};
	var newTuples = expandTuples(tuples);
	return _List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$FontFeatureValues(newTuples)
		]);
};
var $elm$core$List$singleton = function (value) {
	return _List_fromArray(
		[value]);
};
var $rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule = F2(
	function (mediaQueries, declaration) {
		if (!declaration.$) {
			var styleBlock = declaration.a;
			return A2(
				$rtfeldman$elm_css$Css$Structure$MediaRule,
				mediaQueries,
				_List_fromArray(
					[styleBlock]));
		} else {
			return declaration;
		}
	});
var $elm$core$List$tail = function (list) {
	if (list.b) {
		var x = list.a;
		var xs = list.b;
		return $elm$core$Maybe$Just(xs);
	} else {
		return $elm$core$Maybe$Nothing;
	}
};
var $elm$core$List$takeReverse = F3(
	function (n, list, kept) {
		takeReverse:
		while (true) {
			if (n <= 0) {
				return kept;
			} else {
				if (!list.b) {
					return kept;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs,
						$temp$kept = A2($elm$core$List$cons, x, kept);
					n = $temp$n;
					list = $temp$list;
					kept = $temp$kept;
					continue takeReverse;
				}
			}
		}
	});
var $elm$core$List$takeTailRec = F2(
	function (n, list) {
		return $elm$core$List$reverse(
			A3($elm$core$List$takeReverse, n, list, _List_Nil));
	});
var $elm$core$List$takeFast = F3(
	function (ctr, n, list) {
		if (n <= 0) {
			return _List_Nil;
		} else {
			var _v0 = _Utils_Tuple2(n, list);
			_v0$1:
			while (true) {
				_v0$5:
				while (true) {
					if (!_v0.b.b) {
						return list;
					} else {
						if (_v0.b.b.b) {
							switch (_v0.a) {
								case 1:
									break _v0$1;
								case 2:
									var _v2 = _v0.b;
									var x = _v2.a;
									var _v3 = _v2.b;
									var y = _v3.a;
									return _List_fromArray(
										[x, y]);
								case 3:
									if (_v0.b.b.b.b) {
										var _v4 = _v0.b;
										var x = _v4.a;
										var _v5 = _v4.b;
										var y = _v5.a;
										var _v6 = _v5.b;
										var z = _v6.a;
										return _List_fromArray(
											[x, y, z]);
									} else {
										break _v0$5;
									}
								default:
									if (_v0.b.b.b.b && _v0.b.b.b.b.b) {
										var _v7 = _v0.b;
										var x = _v7.a;
										var _v8 = _v7.b;
										var y = _v8.a;
										var _v9 = _v8.b;
										var z = _v9.a;
										var _v10 = _v9.b;
										var w = _v10.a;
										var tl = _v10.b;
										return (ctr > 1000) ? A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A2($elm$core$List$takeTailRec, n - 4, tl))))) : A2(
											$elm$core$List$cons,
											x,
											A2(
												$elm$core$List$cons,
												y,
												A2(
													$elm$core$List$cons,
													z,
													A2(
														$elm$core$List$cons,
														w,
														A3($elm$core$List$takeFast, ctr + 1, n - 4, tl)))));
									} else {
										break _v0$5;
									}
							}
						} else {
							if (_v0.a === 1) {
								break _v0$1;
							} else {
								break _v0$5;
							}
						}
					}
				}
				return list;
			}
			var _v1 = _v0.b;
			var x = _v1.a;
			return _List_fromArray(
				[x]);
		}
	});
var $elm$core$List$take = F2(
	function (n, list) {
		return A3($elm$core$List$takeFast, 0, n, list);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule = F5(
	function (str1, str2, str3, str4, declaration) {
		if (!declaration.$) {
			var structureStyleBlock = declaration.a;
			return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
		} else {
			return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule = F2(
	function (mediaQueries, declaration) {
		switch (declaration.$) {
			case 0:
				var structureStyleBlock = declaration.a;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					mediaQueries,
					_List_fromArray(
						[structureStyleBlock]));
			case 1:
				var newMediaQueries = declaration.a;
				var structureStyleBlocks = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$MediaRule,
					_Utils_ap(mediaQueries, newMediaQueries),
					structureStyleBlocks);
			case 2:
				var str = declaration.a;
				var declarations = declaration.b;
				return A2(
					$rtfeldman$elm_css$Css$Structure$SupportsRule,
					str,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
						declarations));
			case 3:
				var str1 = declaration.a;
				var str2 = declaration.b;
				var str3 = declaration.c;
				var str4 = declaration.d;
				var structureStyleBlock = declaration.e;
				return A5($rtfeldman$elm_css$Css$Structure$DocumentRule, str1, str2, str3, str4, structureStyleBlock);
			case 4:
				return declaration;
			case 5:
				return declaration;
			case 6:
				return declaration;
			case 7:
				return declaration;
			case 8:
				return declaration;
			default:
				return declaration;
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet = function (_v0) {
	var declarations = _v0;
	return declarations;
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast = F4(
	function (nestedStyles, rest, f, declarations) {
		var withoutParent = function (decls) {
			return A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$elm$core$List$tail(decls));
		};
		var nextResult = A2(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
			rest,
			A2(
				$elm$core$Maybe$withDefault,
				_List_Nil,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		var newDeclarations = function () {
			var _v14 = _Utils_Tuple2(
				$elm$core$List$head(nextResult),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$last(declarations));
			if ((!_v14.a.$) && (!_v14.b.$)) {
				var nextResultParent = _v14.a.a;
				var originalParent = _v14.b.a;
				return _Utils_ap(
					A2(
						$elm$core$List$take,
						$elm$core$List$length(declarations) - 1,
						declarations),
					_List_fromArray(
						[
							(!_Utils_eq(originalParent, nextResultParent)) ? nextResultParent : originalParent
						]));
			} else {
				return declarations;
			}
		}();
		var insertStylesToNestedDecl = function (lastDecl) {
			return $elm$core$List$concat(
				A2(
					$rtfeldman$elm_css$Css$Structure$mapLast,
					$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles(nestedStyles),
					A2(
						$elm$core$List$map,
						$elm$core$List$singleton,
						A2($rtfeldman$elm_css$Css$Structure$concatMapLastStyleBlock, f, lastDecl))));
		};
		var initialResult = A2(
			$elm$core$Maybe$withDefault,
			_List_Nil,
			A2(
				$elm$core$Maybe$map,
				insertStylesToNestedDecl,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$lastDeclaration(declarations)));
		return _Utils_ap(
			newDeclarations,
			_Utils_ap(
				withoutParent(initialResult),
				withoutParent(nextResult)));
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles = F2(
	function (styles, declarations) {
		if (!styles.b) {
			return declarations;
		} else {
			switch (styles.a.$) {
				case 0:
					var property = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, property, declarations));
				case 1:
					var _v4 = styles.a;
					var selector = _v4.a;
					var nestedStyles = _v4.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendRepeatableToLastSelector(selector),
						declarations);
				case 2:
					var _v5 = styles.a;
					var selectorCombinator = _v5.a;
					var snippets = _v5.b;
					var rest = styles.b;
					var chain = F2(
						function (_v9, _v10) {
							var originalSequence = _v9.a;
							var originalTuples = _v9.b;
							var originalPseudoElement = _v9.c;
							var newSequence = _v10.a;
							var newTuples = _v10.b;
							var newPseudoElement = _v10.c;
							return A3(
								$rtfeldman$elm_css$Css$Structure$Selector,
								originalSequence,
								_Utils_ap(
									originalTuples,
									A2(
										$elm$core$List$cons,
										_Utils_Tuple2(selectorCombinator, newSequence),
										newTuples)),
								$rtfeldman$elm_css$Css$Preprocess$Resolve$oneOf(
									_List_fromArray(
										[newPseudoElement, originalPseudoElement])));
						});
					var expandDeclaration = function (declaration) {
						switch (declaration.$) {
							case 0:
								var _v7 = declaration.a;
								var firstSelector = _v7.a;
								var otherSelectors = _v7.b;
								var nestedStyles = _v7.c;
								var newSelectors = A2(
									$elm$core$List$concatMap,
									function (originalSelector) {
										return A2(
											$elm$core$List$map,
											chain(originalSelector),
											A2($elm$core$List$cons, firstSelector, otherSelectors));
									},
									$rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations));
								var newDeclarations = function () {
									if (!newSelectors.b) {
										return _List_Nil;
									} else {
										var first = newSelectors.a;
										var remainder = newSelectors.b;
										return _List_fromArray(
											[
												$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
												A3($rtfeldman$elm_css$Css$Structure$StyleBlock, first, remainder, _List_Nil))
											]);
									}
								}();
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, nestedStyles, newDeclarations);
							case 1:
								var mediaQueries = declaration.a;
								var styleBlocks = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
							case 2:
								var str = declaration.a;
								var otherSnippets = declaration.b;
								return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, otherSnippets);
							case 3:
								var str1 = declaration.a;
								var str2 = declaration.b;
								var str3 = declaration.c;
								var str4 = declaration.d;
								var styleBlock = declaration.e;
								return A2(
									$elm$core$List$map,
									A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
									$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
							case 4:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$PageRule(properties)
									]);
							case 5:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$FontFace(properties)
									]);
							case 6:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$Viewport(properties)
									]);
							case 7:
								var properties = declaration.a;
								return _List_fromArray(
									[
										$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
									]);
							default:
								var tuples = declaration.a;
								return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
						}
					};
					return $elm$core$List$concat(
						_Utils_ap(
							_List_fromArray(
								[
									A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations)
								]),
							A2(
								$elm$core$List$map,
								expandDeclaration,
								A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets))));
				case 3:
					var _v11 = styles.a;
					var pseudoElement = _v11.a;
					var nestedStyles = _v11.b;
					var rest = styles.b;
					return A4(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyNestedStylesToLast,
						nestedStyles,
						rest,
						$rtfeldman$elm_css$Css$Structure$appendPseudoElementToLastSelector(pseudoElement),
						declarations);
				case 5:
					var str = styles.a.a;
					var rest = styles.b;
					var name = $rtfeldman$elm_css$Hash$fromString(str);
					var newProperty = 'animation-name:' + name;
					var newDeclarations = A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						rest,
						A2($rtfeldman$elm_css$Css$Structure$appendProperty, newProperty, declarations));
					return A2(
						$elm$core$List$append,
						newDeclarations,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$Structure$Keyframes(
								{cy: str, cP: name})
							]));
				case 4:
					var _v12 = styles.a;
					var mediaQueries = _v12.a;
					var nestedStyles = _v12.b;
					var rest = styles.b;
					var extraDeclarations = function () {
						var _v13 = $rtfeldman$elm_css$Css$Preprocess$Resolve$collectSelectors(declarations);
						if (!_v13.b) {
							return _List_Nil;
						} else {
							var firstSelector = _v13.a;
							var otherSelectors = _v13.b;
							return A2(
								$elm$core$List$map,
								$rtfeldman$elm_css$Css$Structure$styleBlockToMediaRule(mediaQueries),
								A2(
									$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
									nestedStyles,
									$elm$core$List$singleton(
										$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
											A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil)))));
						}
					}();
					return _Utils_ap(
						A2($rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles, rest, declarations),
						extraDeclarations);
				default:
					var otherStyles = styles.a.a;
					var rest = styles.b;
					return A2(
						$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
						_Utils_ap(otherStyles, rest),
						declarations);
			}
		}
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock = function (_v2) {
	var firstSelector = _v2.a;
	var otherSelectors = _v2.b;
	var styles = _v2.c;
	return A2(
		$rtfeldman$elm_css$Css$Preprocess$Resolve$applyStyles,
		styles,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Css$Structure$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Structure$StyleBlock, firstSelector, otherSelectors, _List_Nil))
			]));
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$extract = function (snippetDeclarations) {
	if (!snippetDeclarations.b) {
		return _List_Nil;
	} else {
		var first = snippetDeclarations.a;
		var rest = snippetDeclarations.b;
		return _Utils_ap(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations(first),
			$rtfeldman$elm_css$Css$Preprocess$Resolve$extract(rest));
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule = F2(
	function (mediaQueries, styleBlocks) {
		var handleStyleBlock = function (styleBlock) {
			return A2(
				$elm$core$List$map,
				$rtfeldman$elm_css$Css$Preprocess$Resolve$toMediaRule(mediaQueries),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		};
		return A2($elm$core$List$concatMap, handleStyleBlock, styleBlocks);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule = F2(
	function (str, snippets) {
		var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
			A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
		return _List_fromArray(
			[
				A2($rtfeldman$elm_css$Css$Structure$SupportsRule, str, declarations)
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toDeclarations = function (snippetDeclaration) {
	switch (snippetDeclaration.$) {
		case 0:
			var styleBlock = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock);
		case 1:
			var mediaQueries = snippetDeclaration.a;
			var styleBlocks = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveMediaRule, mediaQueries, styleBlocks);
		case 2:
			var str = snippetDeclaration.a;
			var snippets = snippetDeclaration.b;
			return A2($rtfeldman$elm_css$Css$Preprocess$Resolve$resolveSupportsRule, str, snippets);
		case 3:
			var str1 = snippetDeclaration.a;
			var str2 = snippetDeclaration.b;
			var str3 = snippetDeclaration.c;
			var str4 = snippetDeclaration.d;
			var styleBlock = snippetDeclaration.e;
			return A2(
				$elm$core$List$map,
				A4($rtfeldman$elm_css$Css$Preprocess$Resolve$toDocumentRule, str1, str2, str3, str4),
				$rtfeldman$elm_css$Css$Preprocess$Resolve$expandStyleBlock(styleBlock));
		case 4:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$PageRule(properties)
				]);
		case 5:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$FontFace(properties)
				]);
		case 6:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$Viewport(properties)
				]);
		case 7:
			var properties = snippetDeclaration.a;
			return _List_fromArray(
				[
					$rtfeldman$elm_css$Css$Structure$CounterStyle(properties)
				]);
		default:
			var tuples = snippetDeclaration.a;
			return $rtfeldman$elm_css$Css$Preprocess$Resolve$resolveFontFeatureValues(tuples);
	}
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure = function (_v0) {
	var charset = _v0.bv;
	var imports = _v0.bJ;
	var namespaces = _v0.bQ;
	var snippets = _v0.b7;
	var declarations = $rtfeldman$elm_css$Css$Preprocess$Resolve$extract(
		A2($elm$core$List$concatMap, $rtfeldman$elm_css$Css$Preprocess$unwrapSnippet, snippets));
	return {bv: charset, cz: declarations, bJ: imports, bQ: namespaces};
};
var $rtfeldman$elm_css$Css$Preprocess$Resolve$compile = function (sheet) {
	return $rtfeldman$elm_css$Css$Structure$Output$prettyPrint(
		$rtfeldman$elm_css$Css$Structure$compactStylesheet(
			$rtfeldman$elm_css$Css$Preprocess$Resolve$toStructure(sheet)));
};
var $rtfeldman$elm_css$Css$Preprocess$Snippet = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Preprocess$StyleBlock = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$makeSnippet = F2(
	function (styles, sequence) {
		var selector = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, selector, _List_Nil, styles))
			]);
	});
var $rtfeldman$elm_css$Css$Preprocess$stylesheet = function (snippets) {
	return {bv: $elm$core$Maybe$Nothing, bJ: _List_Nil, bQ: _List_Nil, b7: snippets};
};
var $rtfeldman$elm_css$Css$Structure$ClassSelector = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$classnameStandin = '\u0007';
var $rtfeldman$elm_css$VirtualDom$Styled$templateSelector = $rtfeldman$elm_css$Css$Structure$UniversalSelectorSequence(
	_List_fromArray(
		[
			$rtfeldman$elm_css$Css$Structure$ClassSelector($rtfeldman$elm_css$VirtualDom$Styled$classnameStandin)
		]));
var $rtfeldman$elm_css$VirtualDom$Styled$getCssTemplate = function (styles) {
	if (!styles.b) {
		return '';
	} else {
		var otherwise = styles;
		return $rtfeldman$elm_css$Css$Preprocess$Resolve$compile(
			$rtfeldman$elm_css$Css$Preprocess$stylesheet(
				_List_fromArray(
					[
						A2($rtfeldman$elm_css$VirtualDom$Styled$makeSnippet, styles, $rtfeldman$elm_css$VirtualDom$Styled$templateSelector)
					])));
	}
};
var $rtfeldman$elm_css$Html$Styled$Internal$css = function (styles) {
	var cssTemplate = $rtfeldman$elm_css$VirtualDom$Styled$getCssTemplate(styles);
	var classProperty = A2($elm$virtual_dom$VirtualDom$attribute, '', '');
	return A3($rtfeldman$elm_css$VirtualDom$Styled$Attribute, classProperty, true, cssTemplate);
};
var $rtfeldman$elm_css$Html$Styled$Attributes$css = $rtfeldman$elm_css$Html$Styled$Internal$css;
var $rtfeldman$elm_css$Html$Styled$div = $rtfeldman$elm_css$Html$Styled$node('div');
var $rtfeldman$elm_css$Html$Styled$h1 = $rtfeldman$elm_css$Html$Styled$node('h1');
var $elm$virtual_dom$VirtualDom$property = F2(
	function (key, value) {
		return A2(
			_VirtualDom_property,
			_VirtualDom_noInnerHtmlOrFormAction(key),
			_VirtualDom_noJavaScriptOrHtmlJson(value));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$property = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$property, key, value),
			false,
			'');
	});
var $elm$json$Json$Encode$string = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty = F2(
	function (key, string) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$property,
			key,
			$elm$json$Json$Encode$string(string));
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$href = function (url) {
	return A2($rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'href', url);
};
var $rtfeldman$elm_css$Html$Styled$p = $rtfeldman$elm_css$Html$Styled$node('p');
var $rtfeldman$elm_css$VirtualDom$Styled$Unstyled = function (a) {
	return {$: 4, a: a};
};
var $elm$virtual_dom$VirtualDom$text = _VirtualDom_text;
var $rtfeldman$elm_css$VirtualDom$Styled$text = function (str) {
	return $rtfeldman$elm_css$VirtualDom$Styled$Unstyled(
		$elm$virtual_dom$VirtualDom$text(str));
};
var $rtfeldman$elm_css$Html$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $rtfeldman$elm_css$Css$Preprocess$ApplyStyles = function (a) {
	return {$: 6, a: a};
};
var $rtfeldman$elm_css$Css$Internal$property = F2(
	function (key, value) {
		return $rtfeldman$elm_css$Css$Preprocess$AppendProperty(key + (':' + value));
	});
var $rtfeldman$elm_css$Css$Internal$getOverloadedProperty = F3(
	function (functionName, desiredKey, style) {
		getOverloadedProperty:
		while (true) {
			switch (style.$) {
				case 0:
					var str = style.a;
					var key = A2(
						$elm$core$Maybe$withDefault,
						'',
						$elm$core$List$head(
							A2($elm$core$String$split, ':', str)));
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, key);
				case 1:
					var selector = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-selector'));
				case 2:
					var combinator = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-combinator'));
				case 3:
					var pseudoElement = style.a;
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-pseudo-element setter'));
				case 4:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-media-query'));
				case 5:
					return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-inapplicable-Style-for-keyframes'));
				default:
					if (!style.a.b) {
						return A2($rtfeldman$elm_css$Css$Internal$property, desiredKey, 'elm-css-error-cannot-apply-' + (functionName + '-with-empty-Style'));
					} else {
						if (!style.a.b.b) {
							var _v1 = style.a;
							var only = _v1.a;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = only;
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						} else {
							var _v2 = style.a;
							var first = _v2.a;
							var rest = _v2.b;
							var $temp$functionName = functionName,
								$temp$desiredKey = desiredKey,
								$temp$style = $rtfeldman$elm_css$Css$Preprocess$ApplyStyles(rest);
							functionName = $temp$functionName;
							desiredKey = $temp$desiredKey;
							style = $temp$style;
							continue getOverloadedProperty;
						}
					}
			}
		}
	});
var $rtfeldman$elm_css$Css$Internal$IncompatibleUnits = 0;
var $rtfeldman$elm_css$Css$Structure$Compatible = 0;
var $elm$core$String$fromFloat = _String_fromNumber;
var $rtfeldman$elm_css$Css$Internal$lengthConverter = F3(
	function (units, unitLabel, numericValue) {
		return {
			bi: 0,
			bt: 0,
			ae: 0,
			p: 0,
			aA: 0,
			ah: 0,
			I: 0,
			ai: 0,
			aj: 0,
			Q: 0,
			R: 0,
			B: 0,
			ak: 0,
			K: numericValue,
			ap: 0,
			ar: unitLabel,
			aI: units,
			D: _Utils_ap(
				$elm$core$String$fromFloat(numericValue),
				unitLabel)
		};
	});
var $rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty = A3($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '', 0);
var $rtfeldman$elm_css$Css$textAlign = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'textAlign',
		'text-align',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$Pages$Missing$missing = A2(
	$rtfeldman$elm_css$Html$Styled$div,
	_List_Nil,
	_List_fromArray(
		[
			A2(
			$rtfeldman$elm_css$Html$Styled$h1,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center)
						]))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('404')
				])),
			A2(
			$rtfeldman$elm_css$Html$Styled$p,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('This page does not exist. '),
					A2(
					$rtfeldman$elm_css$Html$Styled$a,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$href('/NAV')
						]),
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Return to navigation?')
						]))
				]))
		]));
var $rtfeldman$elm_css$Html$Styled$article = $rtfeldman$elm_css$Html$Styled$node('article');
var $rtfeldman$elm_css$Css$stringsToValue = function (list) {
	return $elm$core$List$isEmpty(list) ? {D: 'none'} : {
		D: A2($elm$core$String$join, ', ', list)
	};
};
var $rtfeldman$elm_css$Css$fontFamilies = A2(
	$elm$core$Basics$composeL,
	$rtfeldman$elm_css$Css$prop1('font-family'),
	$rtfeldman$elm_css$Css$stringsToValue);
var $rtfeldman$elm_css$Html$Styled$h2 = $rtfeldman$elm_css$Html$Styled$node('h2');
var $rtfeldman$elm_css$Css$auto = {cm: 0, c: 0, ae: 0, aO: 0, cJ: 0, ah: 0, I: 0, B: 0, al: 0, y: 0, aX: 0, aq: 0, u: 0, D: 'auto'};
var $rtfeldman$elm_css$Css$EmUnits = 0;
var $rtfeldman$elm_css$Css$em = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'em');
var $rtfeldman$elm_css$Css$fontSize = $rtfeldman$elm_css$Css$prop1('font-size');
var $rtfeldman$elm_css$Css$prop3 = F4(
	function (key, argA, argB, argC) {
		return A2($rtfeldman$elm_css$Css$property, key, argA.D + (' ' + (argB.D + (' ' + argC.D))));
	});
var $rtfeldman$elm_css$Css$margin3 = $rtfeldman$elm_css$Css$prop3('margin');
var $rtfeldman$elm_css$Css$PercentageUnits = 0;
var $rtfeldman$elm_css$Css$pct = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, '%');
var $elm$virtual_dom$VirtualDom$style = _VirtualDom_style;
var $rtfeldman$elm_css$VirtualDom$Styled$style = F2(
	function (key, val) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$style, key, val),
			false,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$style = $rtfeldman$elm_css$VirtualDom$Styled$style;
var $rtfeldman$elm_css$Css$width = $rtfeldman$elm_css$Css$prop1('width');
var $author$project$Components$heading = function (title) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						A3(
						$rtfeldman$elm_css$Css$margin3,
						$rtfeldman$elm_css$Css$em(1.2),
						$rtfeldman$elm_css$Css$auto,
						$rtfeldman$elm_css$Css$em(2.8))
					]))
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$h1,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
								$rtfeldman$elm_css$Css$width(
								$rtfeldman$elm_css$Css$pct(70)),
								A3(
								$rtfeldman$elm_css$Css$margin3,
								$rtfeldman$elm_css$Css$em(2.3),
								$rtfeldman$elm_css$Css$auto,
								$rtfeldman$elm_css$Css$em(1.1)),
								$rtfeldman$elm_css$Css$fontSize(
								$rtfeldman$elm_css$Css$em(2.2))
							])),
						A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'text-wrap', 'balance')
					]),
				_List_fromArray(
					[title]))
			]));
};
var $elm$core$Basics$composeR = F3(
	function (f, g, x) {
		return g(
			f(x));
	});
var $elm$time$Time$Jan = 0;
var $justinmimbs$date$Date$RD = $elm$core$Basics$identity;
var $justinmimbs$date$Date$isLeapYear = function (y) {
	return ((!A2($elm$core$Basics$modBy, 4, y)) && (!(!A2($elm$core$Basics$modBy, 100, y)))) || (!A2($elm$core$Basics$modBy, 400, y));
};
var $justinmimbs$date$Date$daysInMonth = F2(
	function (y, m) {
		switch (m) {
			case 0:
				return 31;
			case 1:
				return $justinmimbs$date$Date$isLeapYear(y) ? 29 : 28;
			case 2:
				return 31;
			case 3:
				return 30;
			case 4:
				return 31;
			case 5:
				return 30;
			case 6:
				return 31;
			case 7:
				return 31;
			case 8:
				return 30;
			case 9:
				return 31;
			case 10:
				return 30;
			default:
				return 31;
		}
	});
var $justinmimbs$date$Date$monthToNumber = function (m) {
	switch (m) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 3;
		case 3:
			return 4;
		case 4:
			return 5;
		case 5:
			return 6;
		case 6:
			return 7;
		case 7:
			return 8;
		case 8:
			return 9;
		case 9:
			return 10;
		case 10:
			return 11;
		default:
			return 12;
	}
};
var $elm$time$Time$Apr = 3;
var $elm$time$Time$Aug = 7;
var $elm$time$Time$Dec = 11;
var $elm$time$Time$Feb = 1;
var $elm$time$Time$Jul = 6;
var $elm$time$Time$Jun = 5;
var $elm$time$Time$Mar = 2;
var $elm$time$Time$May = 4;
var $elm$time$Time$Nov = 10;
var $elm$time$Time$Oct = 9;
var $elm$time$Time$Sep = 8;
var $justinmimbs$date$Date$numberToMonth = function (mn) {
	var _v0 = A2($elm$core$Basics$max, 1, mn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		case 7:
			return 6;
		case 8:
			return 7;
		case 9:
			return 8;
		case 10:
			return 9;
		case 11:
			return 10;
		default:
			return 11;
	}
};
var $justinmimbs$date$Date$toCalendarDateHelp = F3(
	function (y, m, d) {
		toCalendarDateHelp:
		while (true) {
			var monthDays = A2($justinmimbs$date$Date$daysInMonth, y, m);
			var mn = $justinmimbs$date$Date$monthToNumber(m);
			if ((mn < 12) && (_Utils_cmp(d, monthDays) > 0)) {
				var $temp$y = y,
					$temp$m = $justinmimbs$date$Date$numberToMonth(mn + 1),
					$temp$d = d - monthDays;
				y = $temp$y;
				m = $temp$m;
				d = $temp$d;
				continue toCalendarDateHelp;
			} else {
				return {bx: d, bP: m, cl: y};
			}
		}
	});
var $justinmimbs$date$Date$floorDiv = F2(
	function (a, b) {
		return $elm$core$Basics$floor(a / b);
	});
var $justinmimbs$date$Date$daysBeforeYear = function (y1) {
	var y = y1 - 1;
	var leapYears = (A2($justinmimbs$date$Date$floorDiv, y, 4) - A2($justinmimbs$date$Date$floorDiv, y, 100)) + A2($justinmimbs$date$Date$floorDiv, y, 400);
	return (365 * y) + leapYears;
};
var $justinmimbs$date$Date$divWithRemainder = F2(
	function (a, b) {
		return _Utils_Tuple2(
			A2($justinmimbs$date$Date$floorDiv, a, b),
			A2($elm$core$Basics$modBy, b, a));
	});
var $justinmimbs$date$Date$year = function (_v0) {
	var rd = _v0;
	var _v1 = A2($justinmimbs$date$Date$divWithRemainder, rd, 146097);
	var n400 = _v1.a;
	var r400 = _v1.b;
	var _v2 = A2($justinmimbs$date$Date$divWithRemainder, r400, 36524);
	var n100 = _v2.a;
	var r100 = _v2.b;
	var _v3 = A2($justinmimbs$date$Date$divWithRemainder, r100, 1461);
	var n4 = _v3.a;
	var r4 = _v3.b;
	var _v4 = A2($justinmimbs$date$Date$divWithRemainder, r4, 365);
	var n1 = _v4.a;
	var r1 = _v4.b;
	var n = (!r1) ? 0 : 1;
	return ((((n400 * 400) + (n100 * 100)) + (n4 * 4)) + n1) + n;
};
var $justinmimbs$date$Date$toOrdinalDate = function (_v0) {
	var rd = _v0;
	var y = $justinmimbs$date$Date$year(rd);
	return {
		ba: rd - $justinmimbs$date$Date$daysBeforeYear(y),
		cl: y
	};
};
var $justinmimbs$date$Date$toCalendarDate = function (_v0) {
	var rd = _v0;
	var date = $justinmimbs$date$Date$toOrdinalDate(rd);
	return A3($justinmimbs$date$Date$toCalendarDateHelp, date.cl, 0, date.ba);
};
var $justinmimbs$date$Date$day = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.bx;
	});
var $justinmimbs$date$Date$month = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toCalendarDate,
	function ($) {
		return $.bP;
	});
var $justinmimbs$date$Date$monthNumber = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToNumber);
var $justinmimbs$date$Date$ordinalDay = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toOrdinalDate,
	function ($) {
		return $.ba;
	});
var $elm$core$String$fromChar = function (_char) {
	return A2($elm$core$String$cons, _char, '');
};
var $elm$core$Bitwise$shiftRightBy = _Bitwise_shiftRightBy;
var $elm$core$String$repeatHelp = F3(
	function (n, chunk, result) {
		return (n <= 0) ? result : A3(
			$elm$core$String$repeatHelp,
			n >> 1,
			_Utils_ap(chunk, chunk),
			(!(n & 1)) ? result : _Utils_ap(result, chunk));
	});
var $elm$core$String$repeat = F2(
	function (n, chunk) {
		return A3($elm$core$String$repeatHelp, n, chunk, '');
	});
var $elm$core$String$padLeft = F3(
	function (n, _char, string) {
		return _Utils_ap(
			A2(
				$elm$core$String$repeat,
				n - $elm$core$String$length(string),
				$elm$core$String$fromChar(_char)),
			string);
	});
var $elm$core$Basics$abs = function (n) {
	return (n < 0) ? (-n) : n;
};
var $justinmimbs$date$Date$padSignedInt = F2(
	function (length, _int) {
		return _Utils_ap(
			(_int < 0) ? '-' : '',
			A3(
				$elm$core$String$padLeft,
				length,
				'0',
				$elm$core$String$fromInt(
					$elm$core$Basics$abs(_int))));
	});
var $justinmimbs$date$Date$monthToQuarter = function (m) {
	return (($justinmimbs$date$Date$monthToNumber(m) + 2) / 3) | 0;
};
var $justinmimbs$date$Date$quarter = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$month, $justinmimbs$date$Date$monthToQuarter);
var $elm$core$String$right = F2(
	function (n, string) {
		return (n < 1) ? '' : A3(
			$elm$core$String$slice,
			-n,
			$elm$core$String$length(string),
			string);
	});
var $justinmimbs$date$Date$weekdayNumber = function (_v0) {
	var rd = _v0;
	var _v1 = A2($elm$core$Basics$modBy, 7, rd);
	if (!_v1) {
		return 7;
	} else {
		var n = _v1;
		return n;
	}
};
var $justinmimbs$date$Date$daysBeforeWeekYear = function (y) {
	var jan4 = $justinmimbs$date$Date$daysBeforeYear(y) + 4;
	return jan4 - $justinmimbs$date$Date$weekdayNumber(jan4);
};
var $elm$time$Time$Fri = 4;
var $elm$time$Time$Mon = 0;
var $elm$time$Time$Sat = 5;
var $elm$time$Time$Sun = 6;
var $elm$time$Time$Thu = 3;
var $elm$time$Time$Tue = 1;
var $elm$time$Time$Wed = 2;
var $justinmimbs$date$Date$numberToWeekday = function (wdn) {
	var _v0 = A2($elm$core$Basics$max, 1, wdn);
	switch (_v0) {
		case 1:
			return 0;
		case 2:
			return 1;
		case 3:
			return 2;
		case 4:
			return 3;
		case 5:
			return 4;
		case 6:
			return 5;
		default:
			return 6;
	}
};
var $justinmimbs$date$Date$toWeekDate = function (_v0) {
	var rd = _v0;
	var wdn = $justinmimbs$date$Date$weekdayNumber(rd);
	var wy = $justinmimbs$date$Date$year(rd + (4 - wdn));
	var week1Day1 = $justinmimbs$date$Date$daysBeforeWeekYear(wy) + 1;
	return {
		cg: 1 + (((rd - week1Day1) / 7) | 0),
		ch: wy,
		c5: $justinmimbs$date$Date$numberToWeekday(wdn)
	};
};
var $justinmimbs$date$Date$weekNumber = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.cg;
	});
var $justinmimbs$date$Date$weekYear = A2(
	$elm$core$Basics$composeR,
	$justinmimbs$date$Date$toWeekDate,
	function ($) {
		return $.ch;
	});
var $justinmimbs$date$Date$weekday = A2($elm$core$Basics$composeR, $justinmimbs$date$Date$weekdayNumber, $justinmimbs$date$Date$numberToWeekday);
var $elm$core$Basics$min = F2(
	function (x, y) {
		return (_Utils_cmp(x, y) < 0) ? x : y;
	});
var $justinmimbs$date$Date$ordinalSuffix = function (n) {
	var nn = A2($elm$core$Basics$modBy, 100, n);
	var _v0 = A2(
		$elm$core$Basics$min,
		(nn < 20) ? nn : A2($elm$core$Basics$modBy, 10, nn),
		4);
	switch (_v0) {
		case 1:
			return 'st';
		case 2:
			return 'nd';
		case 3:
			return 'rd';
		default:
			return 'th';
	}
};
var $justinmimbs$date$Date$withOrdinalSuffix = function (n) {
	return _Utils_ap(
		$elm$core$String$fromInt(n),
		$justinmimbs$date$Date$ordinalSuffix(n));
};
var $justinmimbs$date$Date$formatField = F4(
	function (language, _char, length, date) {
		switch (_char) {
			case 'y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$year(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$year(date));
				}
			case 'Y':
				if (length === 2) {
					return A2(
						$elm$core$String$right,
						2,
						A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekYear(date))));
				} else {
					return A2(
						$justinmimbs$date$Date$padSignedInt,
						length,
						$justinmimbs$date$Date$weekYear(date));
				}
			case 'Q':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 3:
						return 'Q' + $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					case 4:
						return $justinmimbs$date$Date$withOrdinalSuffix(
							$justinmimbs$date$Date$quarter(date));
					case 5:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$quarter(date));
					default:
						return '';
				}
			case 'M':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$monthNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$monthNumber(date)));
					case 3:
						return language.aQ(
							$justinmimbs$date$Date$month(date));
					case 4:
						return language.a7(
							$justinmimbs$date$Date$month(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.aQ(
								$justinmimbs$date$Date$month(date)));
					default:
						return '';
				}
			case 'w':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekNumber(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$weekNumber(date)));
					default:
						return '';
				}
			case 'd':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$day(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$day(date)));
					case 3:
						return language.a2(
							$justinmimbs$date$Date$day(date));
					default:
						return '';
				}
			case 'D':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$ordinalDay(date));
					case 2:
						return A3(
							$elm$core$String$padLeft,
							2,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					case 3:
						return A3(
							$elm$core$String$padLeft,
							3,
							'0',
							$elm$core$String$fromInt(
								$justinmimbs$date$Date$ordinalDay(date)));
					default:
						return '';
				}
			case 'E':
				switch (length) {
					case 1:
						return language.Y(
							$justinmimbs$date$Date$weekday(date));
					case 2:
						return language.Y(
							$justinmimbs$date$Date$weekday(date));
					case 3:
						return language.Y(
							$justinmimbs$date$Date$weekday(date));
					case 4:
						return language.bh(
							$justinmimbs$date$Date$weekday(date));
					case 5:
						return A2(
							$elm$core$String$left,
							1,
							language.Y(
								$justinmimbs$date$Date$weekday(date)));
					case 6:
						return A2(
							$elm$core$String$left,
							2,
							language.Y(
								$justinmimbs$date$Date$weekday(date)));
					default:
						return '';
				}
			case 'e':
				switch (length) {
					case 1:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					case 2:
						return $elm$core$String$fromInt(
							$justinmimbs$date$Date$weekdayNumber(date));
					default:
						return A4($justinmimbs$date$Date$formatField, language, 'E', length, date);
				}
			default:
				return '';
		}
	});
var $justinmimbs$date$Date$formatWithTokens = F3(
	function (language, tokens, date) {
		return A3(
			$elm$core$List$foldl,
			F2(
				function (token, formatted) {
					if (!token.$) {
						var _char = token.a;
						var length = token.b;
						return _Utils_ap(
							A4($justinmimbs$date$Date$formatField, language, _char, length, date),
							formatted);
					} else {
						var str = token.a;
						return _Utils_ap(str, formatted);
					}
				}),
			'',
			tokens);
	});
var $justinmimbs$date$Pattern$Literal = function (a) {
	return {$: 1, a: a};
};
var $elm$parser$Parser$Advanced$Bad = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$Good = F3(
	function (a, b, c) {
		return {$: 0, a: a, b: b, c: c};
	});
var $elm$parser$Parser$Advanced$Parser = $elm$core$Basics$identity;
var $elm$parser$Parser$Advanced$andThen = F2(
	function (callback, _v0) {
		var parseA = _v0;
		return function (s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($elm$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $elm$parser$Parser$andThen = $elm$parser$Parser$Advanced$andThen;
var $elm$parser$Parser$Advanced$map2 = F3(
	function (func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function (s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($elm$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3(
						$elm$parser$Parser$Advanced$Good,
						p1 || p2,
						A2(func, a, b),
						s2);
				}
			}
		};
	});
var $elm$parser$Parser$Advanced$ignorer = F2(
	function (keepParser, ignoreParser) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$always, keepParser, ignoreParser);
	});
var $elm$parser$Parser$ignorer = $elm$parser$Parser$Advanced$ignorer;
var $elm$parser$Parser$Advanced$succeed = function (a) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $elm$parser$Parser$succeed = $elm$parser$Parser$Advanced$succeed;
var $elm$parser$Parser$Expecting = function (a) {
	return {$: 0, a: a};
};
var $elm$parser$Parser$Advanced$Token = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$toToken = function (str) {
	return A2(
		$elm$parser$Parser$Advanced$Token,
		str,
		$elm$parser$Parser$Expecting(str));
};
var $elm$parser$Parser$Advanced$AddRight = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$DeadEnd = F4(
	function (row, col, problem, contextStack) {
		return {bw: col, cw: contextStack, bW: problem, b4: row};
	});
var $elm$parser$Parser$Advanced$Empty = {$: 0};
var $elm$parser$Parser$Advanced$fromState = F2(
	function (s, x) {
		return A2(
			$elm$parser$Parser$Advanced$AddRight,
			$elm$parser$Parser$Advanced$Empty,
			A4($elm$parser$Parser$Advanced$DeadEnd, s.b4, s.bw, x, s.f));
	});
var $elm$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $elm$parser$Parser$Advanced$token = function (_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$elm$core$String$isEmpty(str);
	return function (s) {
		var _v1 = A5($elm$parser$Parser$Advanced$isSubString, str, s.b, s.b4, s.bw, s.a);
		var newOffset = _v1.a;
		var newRow = _v1.b;
		var newCol = _v1.c;
		return _Utils_eq(newOffset, -1) ? A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : A3(
			$elm$parser$Parser$Advanced$Good,
			progress,
			0,
			{bw: newCol, f: s.f, g: s.g, b: newOffset, b4: newRow, a: s.a});
	};
};
var $elm$parser$Parser$token = function (str) {
	return $elm$parser$Parser$Advanced$token(
		$elm$parser$Parser$toToken(str));
};
var $justinmimbs$date$Pattern$escapedQuote = A2(
	$elm$parser$Parser$ignorer,
	$elm$parser$Parser$succeed(
		$justinmimbs$date$Pattern$Literal('\'')),
	$elm$parser$Parser$token('\'\''));
var $elm$parser$Parser$UnexpectedChar = {$: 11};
var $elm$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $elm$parser$Parser$Advanced$chompIf = F2(
	function (isGood, expecting) {
		return function (s) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, s.b, s.a);
			return _Utils_eq(newOffset, -1) ? A2(
				$elm$parser$Parser$Advanced$Bad,
				false,
				A2($elm$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bw: 1, f: s.f, g: s.g, b: s.b + 1, b4: s.b4 + 1, a: s.a}) : A3(
				$elm$parser$Parser$Advanced$Good,
				true,
				0,
				{bw: s.bw + 1, f: s.f, g: s.g, b: newOffset, b4: s.b4, a: s.a}));
		};
	});
var $elm$parser$Parser$chompIf = function (isGood) {
	return A2($elm$parser$Parser$Advanced$chompIf, isGood, $elm$parser$Parser$UnexpectedChar);
};
var $justinmimbs$date$Pattern$Field = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$chompWhileHelp = F5(
	function (isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($elm$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3(
					$elm$parser$Parser$Advanced$Good,
					_Utils_cmp(s0.b, offset) < 0,
					0,
					{bw: col, f: s0.f, g: s0.g, b: offset, b4: row, a: s0.a});
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
						$temp$offset = offset + 1,
						$temp$row = row + 1,
						$temp$col = 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
						$temp$offset = newOffset,
						$temp$row = row,
						$temp$col = col + 1,
						$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$chompWhile = function (isGood) {
	return function (s) {
		return A5($elm$parser$Parser$Advanced$chompWhileHelp, isGood, s.b, s.b4, s.bw, s);
	};
};
var $elm$parser$Parser$chompWhile = $elm$parser$Parser$Advanced$chompWhile;
var $elm$parser$Parser$Advanced$getOffset = function (s) {
	return A3($elm$parser$Parser$Advanced$Good, false, s.b, s);
};
var $elm$parser$Parser$getOffset = $elm$parser$Parser$Advanced$getOffset;
var $elm$parser$Parser$Advanced$keeper = F2(
	function (parseFunc, parseArg) {
		return A3($elm$parser$Parser$Advanced$map2, $elm$core$Basics$apL, parseFunc, parseArg);
	});
var $elm$parser$Parser$keeper = $elm$parser$Parser$Advanced$keeper;
var $elm$parser$Parser$Problem = function (a) {
	return {$: 12, a: a};
};
var $elm$parser$Parser$Advanced$problem = function (x) {
	return function (s) {
		return A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$problem = function (msg) {
	return $elm$parser$Parser$Advanced$problem(
		$elm$parser$Parser$Problem(msg));
};
var $elm$core$String$foldr = _String_foldr;
var $elm$core$String$toList = function (string) {
	return A3($elm$core$String$foldr, $elm$core$List$cons, _List_Nil, string);
};
var $justinmimbs$date$Pattern$fieldRepeats = function (str) {
	var _v0 = $elm$core$String$toList(str);
	if (_v0.b && (!_v0.b.b)) {
		var _char = _v0.a;
		return A2(
			$elm$parser$Parser$keeper,
			A2(
				$elm$parser$Parser$keeper,
				$elm$parser$Parser$succeed(
					F2(
						function (x, y) {
							return A2($justinmimbs$date$Pattern$Field, _char, 1 + (y - x));
						})),
				A2(
					$elm$parser$Parser$ignorer,
					$elm$parser$Parser$getOffset,
					$elm$parser$Parser$chompWhile(
						$elm$core$Basics$eq(_char)))),
			$elm$parser$Parser$getOffset);
	} else {
		return $elm$parser$Parser$problem('expected exactly one char');
	}
};
var $elm$parser$Parser$Advanced$mapChompedString = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					A2(
						func,
						A3($elm$core$String$slice, s0.b, s1.b, s0.a),
						a),
					s1);
			}
		};
	});
var $elm$parser$Parser$Advanced$getChompedString = function (parser) {
	return A2($elm$parser$Parser$Advanced$mapChompedString, $elm$core$Basics$always, parser);
};
var $elm$parser$Parser$getChompedString = $elm$parser$Parser$Advanced$getChompedString;
var $justinmimbs$date$Pattern$field = A2(
	$elm$parser$Parser$andThen,
	$justinmimbs$date$Pattern$fieldRepeats,
	$elm$parser$Parser$getChompedString(
		$elm$parser$Parser$chompIf($elm$core$Char$isAlpha)));
var $justinmimbs$date$Pattern$finalize = A2(
	$elm$core$List$foldl,
	F2(
		function (token, tokens) {
			var _v0 = _Utils_Tuple2(token, tokens);
			if (((_v0.a.$ === 1) && _v0.b.b) && (_v0.b.a.$ === 1)) {
				var x = _v0.a.a;
				var _v1 = _v0.b;
				var y = _v1.a.a;
				var rest = _v1.b;
				return A2(
					$elm$core$List$cons,
					$justinmimbs$date$Pattern$Literal(
						_Utils_ap(x, y)),
					rest);
			} else {
				return A2($elm$core$List$cons, token, tokens);
			}
		}),
	_List_Nil);
var $elm$parser$Parser$Advanced$lazy = function (thunk) {
	return function (s) {
		var _v0 = thunk(0);
		var parse = _v0;
		return parse(s);
	};
};
var $elm$parser$Parser$lazy = $elm$parser$Parser$Advanced$lazy;
var $justinmimbs$date$Pattern$isLiteralChar = function (_char) {
	return (_char !== '\'') && (!$elm$core$Char$isAlpha(_char));
};
var $elm$parser$Parser$Advanced$map = F2(
	function (func, _v0) {
		var parse = _v0;
		return function (s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3(
					$elm$parser$Parser$Advanced$Good,
					p,
					func(a),
					s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($elm$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $elm$parser$Parser$map = $elm$parser$Parser$Advanced$map;
var $justinmimbs$date$Pattern$literal = A2(
	$elm$parser$Parser$map,
	$justinmimbs$date$Pattern$Literal,
	$elm$parser$Parser$getChompedString(
		A2(
			$elm$parser$Parser$ignorer,
			A2(
				$elm$parser$Parser$ignorer,
				$elm$parser$Parser$succeed(0),
				$elm$parser$Parser$chompIf($justinmimbs$date$Pattern$isLiteralChar)),
			$elm$parser$Parser$chompWhile($justinmimbs$date$Pattern$isLiteralChar))));
var $elm$parser$Parser$Advanced$Append = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $elm$parser$Parser$Advanced$oneOfHelp = F3(
	function (s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			if (!parsers.b) {
				return A2($elm$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var parse = parsers.a;
				var remainingParsers = parsers.b;
				var _v1 = parse(s0);
				if (!_v1.$) {
					var step = _v1;
					return step;
				} else {
					var step = _v1;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
							$temp$bag = A2($elm$parser$Parser$Advanced$Append, bag, x),
							$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $elm$parser$Parser$Advanced$oneOf = function (parsers) {
	return function (s) {
		return A3($elm$parser$Parser$Advanced$oneOfHelp, s, $elm$parser$Parser$Advanced$Empty, parsers);
	};
};
var $elm$parser$Parser$oneOf = $elm$parser$Parser$Advanced$oneOf;
var $elm$parser$Parser$ExpectingEnd = {$: 10};
var $elm$parser$Parser$Advanced$end = function (x) {
	return function (s) {
		return _Utils_eq(
			$elm$core$String$length(s.a),
			s.b) ? A3($elm$parser$Parser$Advanced$Good, false, 0, s) : A2(
			$elm$parser$Parser$Advanced$Bad,
			false,
			A2($elm$parser$Parser$Advanced$fromState, s, x));
	};
};
var $elm$parser$Parser$end = $elm$parser$Parser$Advanced$end($elm$parser$Parser$ExpectingEnd);
var $justinmimbs$date$Pattern$quotedHelp = function (result) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (str) {
					return $justinmimbs$date$Pattern$quotedHelp(
						_Utils_ap(result, str));
				},
				$elm$parser$Parser$getChompedString(
					A2(
						$elm$parser$Parser$ignorer,
						A2(
							$elm$parser$Parser$ignorer,
							$elm$parser$Parser$succeed(0),
							$elm$parser$Parser$chompIf(
								$elm$core$Basics$neq('\''))),
						$elm$parser$Parser$chompWhile(
							$elm$core$Basics$neq('\''))))),
				A2(
				$elm$parser$Parser$andThen,
				function (_v0) {
					return $justinmimbs$date$Pattern$quotedHelp(result + '\'');
				},
				$elm$parser$Parser$token('\'\'')),
				$elm$parser$Parser$succeed(result)
			]));
};
var $justinmimbs$date$Pattern$quoted = A2(
	$elm$parser$Parser$keeper,
	A2(
		$elm$parser$Parser$ignorer,
		$elm$parser$Parser$succeed($justinmimbs$date$Pattern$Literal),
		$elm$parser$Parser$chompIf(
			$elm$core$Basics$eq('\''))),
	A2(
		$elm$parser$Parser$ignorer,
		$justinmimbs$date$Pattern$quotedHelp(''),
		$elm$parser$Parser$oneOf(
			_List_fromArray(
				[
					$elm$parser$Parser$chompIf(
					$elm$core$Basics$eq('\'')),
					$elm$parser$Parser$end
				]))));
var $justinmimbs$date$Pattern$patternHelp = function (tokens) {
	return $elm$parser$Parser$oneOf(
		_List_fromArray(
			[
				A2(
				$elm$parser$Parser$andThen,
				function (token) {
					return $justinmimbs$date$Pattern$patternHelp(
						A2($elm$core$List$cons, token, tokens));
				},
				$elm$parser$Parser$oneOf(
					_List_fromArray(
						[$justinmimbs$date$Pattern$field, $justinmimbs$date$Pattern$literal, $justinmimbs$date$Pattern$escapedQuote, $justinmimbs$date$Pattern$quoted]))),
				$elm$parser$Parser$lazy(
				function (_v0) {
					return $elm$parser$Parser$succeed(
						$justinmimbs$date$Pattern$finalize(tokens));
				})
			]));
};
var $elm$parser$Parser$DeadEnd = F3(
	function (row, col, problem) {
		return {bw: col, bW: problem, b4: row};
	});
var $elm$parser$Parser$problemToDeadEnd = function (p) {
	return A3($elm$parser$Parser$DeadEnd, p.b4, p.bw, p.bW);
};
var $elm$parser$Parser$Advanced$bagToList = F2(
	function (bag, list) {
		bagToList:
		while (true) {
			switch (bag.$) {
				case 0:
					return list;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$core$List$cons, x, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
						$temp$list = A2($elm$parser$Parser$Advanced$bagToList, bag2, list);
					bag = $temp$bag;
					list = $temp$list;
					continue bagToList;
			}
		}
	});
var $elm$parser$Parser$Advanced$run = F2(
	function (_v0, src) {
		var parse = _v0;
		var _v1 = parse(
			{bw: 1, f: _List_Nil, g: 1, b: 0, b4: 1, a: src});
		if (!_v1.$) {
			var value = _v1.b;
			return $elm$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $elm$core$Result$Err(
				A2($elm$parser$Parser$Advanced$bagToList, bag, _List_Nil));
		}
	});
var $elm$parser$Parser$run = F2(
	function (parser, source) {
		var _v0 = A2($elm$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $elm$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $elm$core$Result$Err(
				A2($elm$core$List$map, $elm$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $elm$core$Result$withDefault = F2(
	function (def, result) {
		if (!result.$) {
			var a = result.a;
			return a;
		} else {
			return def;
		}
	});
var $justinmimbs$date$Pattern$fromString = function (str) {
	return A2(
		$elm$core$Result$withDefault,
		_List_fromArray(
			[
				$justinmimbs$date$Pattern$Literal(str)
			]),
		A2(
			$elm$parser$Parser$run,
			$justinmimbs$date$Pattern$patternHelp(_List_Nil),
			str));
};
var $justinmimbs$date$Date$formatWithLanguage = F2(
	function (language, pattern) {
		var tokens = $elm$core$List$reverse(
			$justinmimbs$date$Pattern$fromString(pattern));
		return A2($justinmimbs$date$Date$formatWithTokens, language, tokens);
	});
var $justinmimbs$date$Date$monthToName = function (m) {
	switch (m) {
		case 0:
			return 'January';
		case 1:
			return 'February';
		case 2:
			return 'March';
		case 3:
			return 'April';
		case 4:
			return 'May';
		case 5:
			return 'June';
		case 6:
			return 'July';
		case 7:
			return 'August';
		case 8:
			return 'September';
		case 9:
			return 'October';
		case 10:
			return 'November';
		default:
			return 'December';
	}
};
var $justinmimbs$date$Date$weekdayToName = function (wd) {
	switch (wd) {
		case 0:
			return 'Monday';
		case 1:
			return 'Tuesday';
		case 2:
			return 'Wednesday';
		case 3:
			return 'Thursday';
		case 4:
			return 'Friday';
		case 5:
			return 'Saturday';
		default:
			return 'Sunday';
	}
};
var $justinmimbs$date$Date$language_en = {
	a2: $justinmimbs$date$Date$withOrdinalSuffix,
	a7: $justinmimbs$date$Date$monthToName,
	aQ: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$monthToName,
		$elm$core$String$left(3)),
	bh: $justinmimbs$date$Date$weekdayToName,
	Y: A2(
		$elm$core$Basics$composeR,
		$justinmimbs$date$Date$weekdayToName,
		$elm$core$String$left(3))
};
var $justinmimbs$date$Date$format = function (pattern) {
	return A2($justinmimbs$date$Date$formatWithLanguage, $justinmimbs$date$Date$language_en, pattern);
};
var $rtfeldman$elm_css$Css$right = $rtfeldman$elm_css$Css$prop1('right');
var $rtfeldman$elm_css$Html$Styled$td = $rtfeldman$elm_css$Html$Styled$node('td');
var $rtfeldman$elm_css$Html$Styled$tr = $rtfeldman$elm_css$Html$Styled$node('tr');
var $author$project$Pages$Navigation$navRow = function (pageInfo) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$tr,
		_List_fromArray(
			[
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'text-wrap', 'balance')
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$td,
				_List_Nil,
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$a,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$href(pageInfo.cV)
							]),
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$text(pageInfo.c0)
							]))
					])),
				A2(
				$rtfeldman$elm_css$Html$Styled$td,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$right)
							]))
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(
						A2($justinmimbs$date$Date$format, 'MMM dd y', pageInfo.b_))
					]))
			]));
};
var $elm$core$Basics$clamp = F3(
	function (low, high, number) {
		return (_Utils_cmp(number, low) < 0) ? low : ((_Utils_cmp(number, high) > 0) ? high : number);
	});
var $justinmimbs$date$Date$daysBeforeMonth = F2(
	function (y, m) {
		var leapDays = $justinmimbs$date$Date$isLeapYear(y) ? 1 : 0;
		switch (m) {
			case 0:
				return 0;
			case 1:
				return 31;
			case 2:
				return 59 + leapDays;
			case 3:
				return 90 + leapDays;
			case 4:
				return 120 + leapDays;
			case 5:
				return 151 + leapDays;
			case 6:
				return 181 + leapDays;
			case 7:
				return 212 + leapDays;
			case 8:
				return 243 + leapDays;
			case 9:
				return 273 + leapDays;
			case 10:
				return 304 + leapDays;
			default:
				return 334 + leapDays;
		}
	});
var $justinmimbs$date$Date$fromCalendarDate = F3(
	function (y, m, d) {
		return ($justinmimbs$date$Date$daysBeforeYear(y) + A2($justinmimbs$date$Date$daysBeforeMonth, y, m)) + A3(
			$elm$core$Basics$clamp,
			1,
			A2($justinmimbs$date$Date$daysInMonth, y, m),
			d);
	});
var $elm$time$Time$flooredDiv = F2(
	function (numerator, denominator) {
		return $elm$core$Basics$floor(numerator / denominator);
	});
var $elm$time$Time$posixToMillis = function (_v0) {
	var millis = _v0;
	return millis;
};
var $elm$time$Time$toAdjustedMinutesHelp = F3(
	function (defaultOffset, posixMinutes, eras) {
		toAdjustedMinutesHelp:
		while (true) {
			if (!eras.b) {
				return posixMinutes + defaultOffset;
			} else {
				var era = eras.a;
				var olderEras = eras.b;
				if (_Utils_cmp(era.bd, posixMinutes) < 0) {
					return posixMinutes + era.b;
				} else {
					var $temp$defaultOffset = defaultOffset,
						$temp$posixMinutes = posixMinutes,
						$temp$eras = olderEras;
					defaultOffset = $temp$defaultOffset;
					posixMinutes = $temp$posixMinutes;
					eras = $temp$eras;
					continue toAdjustedMinutesHelp;
				}
			}
		}
	});
var $elm$time$Time$toAdjustedMinutes = F2(
	function (_v0, time) {
		var defaultOffset = _v0.a;
		var eras = _v0.b;
		return A3(
			$elm$time$Time$toAdjustedMinutesHelp,
			defaultOffset,
			A2(
				$elm$time$Time$flooredDiv,
				$elm$time$Time$posixToMillis(time),
				60000),
			eras);
	});
var $elm$time$Time$toCivil = function (minutes) {
	var rawDay = A2($elm$time$Time$flooredDiv, minutes, 60 * 24) + 719468;
	var era = (((rawDay >= 0) ? rawDay : (rawDay - 146096)) / 146097) | 0;
	var dayOfEra = rawDay - (era * 146097);
	var yearOfEra = ((((dayOfEra - ((dayOfEra / 1460) | 0)) + ((dayOfEra / 36524) | 0)) - ((dayOfEra / 146096) | 0)) / 365) | 0;
	var dayOfYear = dayOfEra - (((365 * yearOfEra) + ((yearOfEra / 4) | 0)) - ((yearOfEra / 100) | 0));
	var mp = (((5 * dayOfYear) + 2) / 153) | 0;
	var month = mp + ((mp < 10) ? 3 : (-9));
	var year = yearOfEra + (era * 400);
	return {
		bx: (dayOfYear - ((((153 * mp) + 2) / 5) | 0)) + 1,
		bP: month,
		cl: year + ((month <= 2) ? 1 : 0)
	};
};
var $elm$time$Time$toDay = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bx;
	});
var $elm$time$Time$toMonth = F2(
	function (zone, time) {
		var _v0 = $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).bP;
		switch (_v0) {
			case 1:
				return 0;
			case 2:
				return 1;
			case 3:
				return 2;
			case 4:
				return 3;
			case 5:
				return 4;
			case 6:
				return 5;
			case 7:
				return 6;
			case 8:
				return 7;
			case 9:
				return 8;
			case 10:
				return 9;
			case 11:
				return 10;
			default:
				return 11;
		}
	});
var $elm$time$Time$toYear = F2(
	function (zone, time) {
		return $elm$time$Time$toCivil(
			A2($elm$time$Time$toAdjustedMinutes, zone, time)).cl;
	});
var $justinmimbs$date$Date$fromPosix = F2(
	function (zone, posix) {
		return A3(
			$justinmimbs$date$Date$fromCalendarDate,
			A2($elm$time$Time$toYear, zone, posix),
			A2($elm$time$Time$toMonth, zone, posix),
			A2($elm$time$Time$toDay, zone, posix));
	});
var $elm$time$Time$Posix = $elm$core$Basics$identity;
var $elm$time$Time$millisToPosix = $elm$core$Basics$identity;
var $elm$time$Time$Zone = F2(
	function (a, b) {
		return {$: 0, a: a, b: b};
	});
var $elm$time$Time$utc = A2($elm$time$Time$Zone, 0, _List_Nil);
var $author$project$Pages$DiyPatternMatching$article = {
	cN: 'DiyPatternMatching',
	cV: '/DIYPTRNMATCH',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1735066800000)),
	c0: 'DIY Pattern Matching'
};
var $author$project$Pages$FunctionalLinearAlgebra$article = {
	cN: 'FunctionalLinearAlgebra',
	cV: '/FNLINALG',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1726423200000)),
	c0: 'Functional Linear Algebra'
};
var $author$project$Pages$FunctionalLinearAlgebraMemoized$article = {
	cN: 'FunctionalLinearAlgebraMemoized',
	cV: '/FNLINALGMEMO',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1726855200000)),
	c0: 'Functional Linear Algebra, Memoized'
};
var $author$project$Pages$FunctionalLinearAlgebraWithTypes$article = {
	cN: 'FunctionalLinearAlgebraWithTypes',
	cV: '/FNLINALGTYPED',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1726596000000)),
	c0: 'Functional Linear Algebra, with Types'
};
var $author$project$Pages$GameOfLife$article = {
	cN: 'GameOfLife',
	cV: '/LIFE',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1668625200000)),
	c0: 'Better Living Through Sets'
};
var $author$project$Pages$RecursionSchemes$article = {
	cN: 'RecursionSchemes',
	cV: '/REC',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1673031600000)),
	c0: 'Recursion Schemes Are The Answer'
};
var $author$project$Pages$TheGutsOfGit$article = {
	cN: 'TheGutsOfGit',
	cV: '/GOG',
	b_: A2(
		$justinmimbs$date$Date$fromPosix,
		$elm$time$Time$utc,
		$elm$time$Time$millisToPosix(1674154800000)),
	c0: 'The Guts of Git'
};
var $justinmimbs$date$Date$compare = F2(
	function (_v0, _v1) {
		var a = _v0;
		var b = _v1;
		return A2($elm$core$Basics$compare, a, b);
	});
var $elm$core$List$sortWith = _List_sortWith;
var $author$project$Pages$Navigation$pageList = A2(
	$elm$core$List$sortWith,
	F2(
		function (r, s) {
			return A2($justinmimbs$date$Date$compare, s.b_, r.b_);
		}),
	_List_fromArray(
		[$author$project$Pages$TheGutsOfGit$article, $author$project$Pages$GameOfLife$article, $author$project$Pages$RecursionSchemes$article, $author$project$Pages$DiyPatternMatching$article, $author$project$Pages$FunctionalLinearAlgebra$article, $author$project$Pages$FunctionalLinearAlgebraWithTypes$article, $author$project$Pages$FunctionalLinearAlgebraMemoized$article]));
var $rtfeldman$elm_css$Html$Styled$table = $rtfeldman$elm_css$Html$Styled$node('table');
var $author$project$Pages$Navigation$navigationPage = A2(
	$rtfeldman$elm_css$Html$Styled$article,
	_List_Nil,
	_List_fromArray(
		[
			$author$project$Components$heading(
			$rtfeldman$elm_css$Html$Styled$text('Navigation')),
			A2(
			$rtfeldman$elm_css$Html$Styled$p,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('Hi! Welcome! Come on in. Welcome to the personal website for Sean Luc Russell. Glad you found us.')
				])),
			A2(
			$rtfeldman$elm_css$Html$Styled$p,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('If this is your first time here let me show you around. At the top right of every page we have a navigation link. This will help you get back here. Use it if you get lost. We also have a contact link in case you want to send an email to Mr. Russell. And below we have a collection of all the publications on this blog, ordered chronologically.')
				])),
			A2(
			$rtfeldman$elm_css$Html$Styled$p,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('I can\'t tell you if we have what you are looking for here. I\'m not sure myself what you might find in the pages below. The precise purpose of this site is a work in progress. But we are happy you are here, so stay as long as you\'d like and have a look around. Who knows? Maybe you\'ll find something that interests you.')
				])),
			A2(
			$rtfeldman$elm_css$Html$Styled$p,
			_List_Nil,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('Thanks for dropping in!')
				])),
			A2(
			$rtfeldman$elm_css$Html$Styled$h2,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center)
						]))
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text('Pages')
				])),
			A2(
			$rtfeldman$elm_css$Html$Styled$table,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$fontFamilies(
							_List_fromArray(
								['courier'])),
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$pct(100))
						]))
				]),
			A2($elm$core$List$map, $author$project$Pages$Navigation$navRow, $author$project$Pages$Navigation$pageList))
		]));
var $rtfeldman$elm_css$Html$Styled$i = $rtfeldman$elm_css$Html$Styled$node('i');
var $author$project$Components$date = function (d) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$pct(70)),
						A3(
						$rtfeldman$elm_css$Css$margin3,
						$rtfeldman$elm_css$Css$em(1.2),
						$rtfeldman$elm_css$Css$auto,
						$rtfeldman$elm_css$Css$em(2.8))
					]))
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$i,
				_List_Nil,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$text(
						A2($justinmimbs$date$Date$format, 'MMMM d, y', d))
					]))
			]));
};
var $author$project$Components$blogHeading = F2(
	function (title, publicationDate) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					$author$project$Components$heading(title),
					$author$project$Components$date(publicationDate)
				]));
	});
var $rtfeldman$elm_css$Html$Styled$code = $rtfeldman$elm_css$Html$Styled$node('code');
var $rtfeldman$elm_css$Html$Styled$li = $rtfeldman$elm_css$Html$Styled$node('li');
var $rtfeldman$elm_css$Html$Styled$ol = $rtfeldman$elm_css$Html$Styled$node('ol');
var $rtfeldman$elm_css$Html$Styled$pre = $rtfeldman$elm_css$Html$Styled$node('pre');
var $author$project$Pages$DiyPatternMatching$page = {
	c1: F2(
		function (_v0, model) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}),
	c4: function (_v1) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('DIY Pattern Matching'),
					$author$project$Pages$DiyPatternMatching$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Today I’m going to tell you about the coolest thing I’ve discovered in the last year.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Algebraic data types with pattern matching are one of the best language features out there right now. They make Rust and Haskell really easy to use. They make it easy to manage error handling, partial functions, embedded DSLs, any kind of tree data, complex control flow, and so much more. Once you rewire your brain to think in terms of ADTs you won’t wanna go back.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Unfortunately, you will have to go back. You will inevitably find yourself having to write programs in languages that do not natively support pattern matching. Tragic.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Except. And this is what I discovered recently. Quite a lot of languages actually support a DIY style of pattern matching. You can implement your own data types in just a few lines of code. And a LOT of languages let you do this. In fact any language that supports both')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$ol,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('First class functions')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Records (aka tables, objects, dictionaries)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('then you can build your own pattern matching. The languages that have these features are many. I’ve confirmed this trick works in Python, Lua, Ruby, Clojure, Perl, and, funnily enough, Elm. It is easy to use and looks really clean.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Lets see how to do a simple example in Javascript. Suppose we want to implement the Maybe datatype to make a safe division function. Since it really doesn’t require that much code, I’ll just show you the full thing and we will walk through it step-by-step')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('const Just = x => handler => handler.Just(x);\nconst Nothing = handler => handler.Nothing;\n\nconst match = (value, handler) => value(handler);\n\nfunction safeDivide(numerator, denominator) {\n    return denominator === 0 ? Nothing : Just(numerator / denominator);\n}\n\nfunction displayResult(maybeValue) {\n  const extractedValue = match(maybeValue, {\n    Just: result => `Result of division is ${result}`,\n    Nothing: `Handled divide by zero error`\n  });\n  console.log(extractedValue);\n}\n\nconst badDivision = safeDivide(5,0);\nconst goodDivision = safeDivide(22, 7);\n\ndisplayResult(badDivision);\ndisplayResult(goodDivision);')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('That’s the whole thing. You can paste it into node or your browser console and run it and you will see the output')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Handled divide by zero error\nResult of division is 3.142857142857143')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Pretty neat. So what is going on here?')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The first two lines define our data type constructors. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' has two arguments in curried form, and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Nothing')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' has one. The final argument for both is the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('handler')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. We think of the value of a type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Maybe')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' as this later half of this: a '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Maybe')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' value is a function that takes a handler as input and does something with it. What something? Well both '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Maybe')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' use the handler as an object, and between them the object has a field '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Nothing')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and a field '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' seems to store a function that takes a single argument as input, while '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Nothing')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' could be any value.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('For an example, suppose we were to construct a value of '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just(5)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. What would we get? A new value, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('handler => handler.Just(5)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This is a function that takes an object that has a field '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' contains a function, and we pass '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('handler.Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' the value 5.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('FYI if this seems majorly confusing don’t worry. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Nothing')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', as keywords, are getting used in both the handler and the constructor. This is to make everything look nice when we are using them for programming, but it can make the comprehension a little bit challenging.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The third line, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('match')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', is syntax sugar to make pattern matching plesant. A '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('maybe')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' value is a function from a handler to some data. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('match')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' hides that weird detail from the user and does the calling for us.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('safeDivide')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' we get to the first usage of our data types. If you are at all familiar with algebraic data then this will be easy. Using a ternary operator, we check if the denominator is zero. If it is we return '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Nothing')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', if it isn’t we return the result of division wrapped in a '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Likewise '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('displayResult')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is a very standard use of algebraic data. We pattern match on '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('maybeValue')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and handle the two cases: where the value contains '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Just')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' some data and where the value contains '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Nothing')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This will look pretty familiar at a casual reading, but there are some mild differences.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The handler is an object. It is an object with two labels representing the two cases. So overall the handler looks like '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('{ Just: ..., Nothing: ... }')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' with relevant data. This is slightly different from traditional pattern matching. We don’t do destructuring in the pattern match on the labels. Instead we emulate destructuring by writing the appropriate functions. This is almost like using a continuation passing style, if that helps with intuition. We \"'),
							$rtfeldman$elm_css$Html$Styled$text('destructure'),
							$rtfeldman$elm_css$Html$Styled$text('\" by writing a continuation.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Okay so we’ve got this basic setup. Let us manually run through the examples to see what happens. I’m going to be super verbose and manually walk through the evaluations of the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('goodDivision')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' code. The '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('badDivision')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' execution trace is left as an exercise for the reader.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('goodDivision = safeDivide(22,7);\n// inline safeDivide\ngoodDivision = 0 === 0 ? Nothing : Just(22/7);\n// evaluate ternary expression\ngoodDivision = Just(22/7);\n// inline definition of Nothing\ngoodDivision = handler => handler.Just(22/7);')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Now we have the value of '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('goodDivision')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', lets pass it to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('displayResult')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('displayResult(goodDivision);\n\n// inline displayResult\nconst extractedValue = match(goodDivision, {\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n});\nconsole.log(extractedValue);\n\n// inline match\nconst extractedValue = goodDivision({\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n});\nconsole.log(extractedValue);\n\n// inline definition of badDivision\nconst extractedValue = (handler => handler.Just(22/7)) ({\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n});\nconsole.log(extractedValue);\n\n// evaluate function call\nconst extractedValue = ({\n  Just: result => `Result of division is ${result}`,\n  Nothing: `Handled divide by zero error`\n}.Just)(22/7);\nconsole.log(extractedValue);\n\n// execute field lookup\nconst extractedValue = (result => `Result of division is ${result}`)(22/7);\nconsole.log(extractedValue);\n\n// evaluate function call\nconst extractedValue = `Result of division is ${22/7}`;\nconsole.log(extractedValue);\n\n// print to console\nconsole.log(`Result of division is ${22/7}`);')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We did the division safely and everyone is happy.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This idea is by no means limited to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Maybe')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' types either. All sorts of algebraic data can be encoded with this pattern. For example, lets look at embedding a simple arithmetic language with addition, multiplication, numeric literals, equality tests, and branching.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('const Add = (x,y) => handler => handler.Add(x,y);\nconst Multiply = (x,y) => handler => handler.Multiply(x,y);\nconst Literal = x => handler => handler.Literal(x);\nconst Equal = (x,y) => handler => handler.Equal(x,y);\nconst Cond = (condition,x,y) => handler => handler.Cond(condition,x,y);')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('There we go. New data type built. We don’t have to define a new '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('match')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' function because '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('match')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' was always generic. And now we can write a pretty printer')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('function prettyPrint(expression) {\n  return match(expression, {\n    Add: (x,y) => \"(\" + prettyPrint(x) + \"+\" + prettyPrint(y) + \")\",\n    Multiply: (x,y) => \"(\" + prettyPrint(x) + \"*\" + prettyPrint(y) + \")\",\n    Literal: x => x.toString(),\n    Equal: (x,y) => \"(\" + prettyPrint(x) + \"==\" + prettyPrint(y) + \")\",\n    Cond: (condition,x,y) => \"(if \" + prettyPrint(condition) + \" then \" + prettyPrint(x) + \" else \" + prettyPrint(y) + \")\"\n  });\n}')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and use it')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('prettyPrint(\n  Cond(\n    Equal(\n      Literal(4),\n      Add(\n        Literal(2),\n        Literal(2))),\n    Literal(1),\n    Literal(0)));')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Now you know one of my better secrets. This pattern transports to all sorts of languages and all sorts of data types. You could write your own libraries using this stuff. You can cover the world in algebra.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In fact that is what I hope you’ll do. Algebraic data types are one of the best features of modern languages. Since this trick lets us implement them in languages that don’t natively support them, we can spread the gospel of algebra to all those who haven’t yet heard the good word. Convert the unelightened. Remake the world into a new order.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Or you can just think of this as a neat trick.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Up to you.')
						]))
				]));
	}
};
var $rtfeldman$elm_css$VirtualDom$Styled$attribute = F2(
	function (key, value) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$attribute, key, value),
			false,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Attributes$attribute = $rtfeldman$elm_css$VirtualDom$Styled$attribute;
var $elm$json$Json$Encode$bool = _Json_wrap;
var $rtfeldman$elm_css$Html$Styled$em = $rtfeldman$elm_css$Html$Styled$node('em');
var $elm$json$Json$Encode$object = function (pairs) {
	return _Json_wrap(
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, obj) {
					var k = _v0.a;
					var v = _v0.b;
					return A3(_Json_addField, k, v, obj);
				}),
			_Json_emptyObject(0),
			pairs));
};
var $author$project$Pages$FunctionalLinearAlgebra$page = {
	c1: F2(
		function (_v0, model) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}),
	c4: function (_v1) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra'),
					$author$project$Pages$FunctionalLinearAlgebra$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Today we are learning how to implement all the basic operations of linear algebra for ourselves! Why? Well I was trying to learn how to find eigenvalues of a matrix today but the computer I was working on didn’t have numpy installed already and I was to lazy to set it up so I decided to implement all the linear algebra operations I needed from scratch. So now you are in this with me too.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Also we are going to do it in a super weird way. I’ve been thinking of a way to express linear algebra using a more functional style. Instead of using data to represent data, we are going to be using functions to represent data. Instead of using lists to encode matrices and vectors, we will use functions.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I don’t feel like delaying the big reveal, so here is the code.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('# some basic definitions\ndims = [0,1,2]\ncontract = lambda f: sum(f(k) for k in dims)\n\n# basic arithmetic operations on scalars, vectors, and matrices\nmmadd = lambda m,n:\n  lambda i,j: m(i,j)+n(i,j)\nmmmul = lambda m,n:\n  lambda i,j: contract(lambda k: m(i,k)*n(k,j))\nmvmul = lambda m,v:\n  lambda i: contract(lambda k: m(i,k)*v(k))\nsmmul = lambda s,m:\n  lambda i,j: s*m(i,j)\nsvmul = lambda s,v:\n  lambda i: s*v(i)\n\n# linear algebra operations\ndot = lambda v,w:\n  contract(lambda k: v(k)*w(k))\nmagnitude = lambda v:\n  (contract(lambda k:v(k)**2))**0.5\nnormalize = lambda v:\n  svmul(1/magnitude(v), v)\nouter = lambda v,w:\n  lambda i,j: v(i)*w(j)\n\n# convert lists into functions\nmfromlist = lambda l: lambda i,j: l[i][j]\nvfromlist = lambda l: lambda i: l[i]')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This stuff is the basic linear algebra \"'),
							$rtfeldman$elm_css$Html$Styled$text('library'),
							$rtfeldman$elm_css$Html$Styled$text('\" in python 3. I only implemented the features I needed to do the eigenvalue calculations, demonstrated below.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('# Eigenvalue/eigenvector calculation\ndef power_iteration(A):\n    b = vfromlist([1,2,3])\n    for _ in range(1000):\n        b = normalize(mvmul(A,b))\n    eigenvalue = dot(b,mvmul(A,b))\n    return eigenvalue, b\n\ndef deflate(A, eigenvalue, eigenvector):\n    return mmadd(\n        A,\n        smmul(-eigenvalue, outer(eigenvector, eigenvector))\n    )\n\neigenvalue_1, eigenvector_1 = power_iteration(A)\nA_deflated = deflate(A, eigenvalue_1, eigenvector_1)\neigenvalue_2, eigenvector_2 = power_iteration(A_deflated)\n\nA = mfromlist([[4,1,2],[1,3,0],[2,0,3]])\n\n# display the results of our calculation\ndef display(val, vec):\n    print(\n        f\"λ: {val:.2f}\",\n        *(f\'x{i}: {vec(i):.2f}\' for i in dims)\n    )\ndisplay(eigenvalue_1, eigenvector_1)\ndisplay(eigenvalue_2, eigenvector_2)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Let us discuss.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('First, you will notice we have got quite a lot of lambdas running about. Some may say that the code is not particularly \"'),
							$rtfeldman$elm_css$Html$Styled$text('pythonic'),
							$rtfeldman$elm_css$Html$Styled$text('\", but we can ignore those people. This is unmistakably how the language was meant to be used.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('How so? Let us consider what a matrix \"'),
							$rtfeldman$elm_css$Html$Styled$text('is'),
							$rtfeldman$elm_css$Html$Styled$text('\". We often think about it as a grid of values.')
						])),
					A3(
					$rtfeldman$elm_css$Html$Styled$node,
					'katex-expression',
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
							'katex-options',
							A2(
								$elm$json$Json$Encode$encode,
								0,
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'displayMode',
											$elm$json$Json$Encode$bool(true)),
											_Utils_Tuple2(
											'throwOnError',
											$elm$json$Json$Encode$bool(false))
										])))),
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', '\n\\begin{bmatrix}3.1 & 2.8 & 5.5 \\\\ 1.0 & 3.5 & 5.5\\end{bmatrix}\n')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But what is a grid but a function? We can represent this 2 by 3 grid as a function defined over pairs of integers. Maybe we call our function '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'WhatIsInCell(i,j)')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text('. For example in this case we will find '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'WhatIsInCell(2,1) = 1.0')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text('. Row 2, column 1 has the value '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', '1.0')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text('. Don’t overthink it. A matrix is a function that takes two indices as arguments and produces a scalar as output. A vector is the same but with just one argument.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We can write this out explicitly. It’s kind of tedious, but check this')
						])),
					A3(
					$rtfeldman$elm_css$Html$Styled$node,
					'katex-expression',
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
							'katex-options',
							A2(
								$elm$json$Json$Encode$encode,
								0,
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'displayMode',
											$elm$json$Json$Encode$bool(true)),
											_Utils_Tuple2(
											'throwOnError',
											$elm$json$Json$Encode$bool(false))
										])))),
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', '\nM_{ij} = WhatIsInCell(i,j) =\n\\begin{cases}\n3.1 &\\text{if } i = 1 \\text{ and } j = 1\n\\\\\n2.8 &\\text{if } i = 1 \\text{ and } j = 2\n\\\\\n5.5 &\\text{if } i = 1 \\text{ and } j = 3\n\\\\\n1.0 &\\text{if } i = 2 \\text{ and } j = 1\n\\\\\n3.5 &\\text{if } i = 2 \\text{ and } j = 2\n\\\\\n5.5 &\\text{if } i = 2 \\text{ and } j = 3\n\\end{cases}\n')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('That’s a function!')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('What would happen if we took this observation way more seriously than it deserves? We come up with a pretty weird and in some ways extremely elegant way to describe linear algebra. Vectors are functions. Matrices are functions. Matrix-vector multiplication takes two functions and yields a new function. The dot product takes two functions and gets us a scalar. And so on.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('To dip our toes in, let’s look at scalar-vector multiplication.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('svmul = lambda s,v: lambda i: s * v(i)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is a function that takes a scalar '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('s')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and a vector '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('v')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' (AKA a function from an index to a scalar) and returns a function from an index '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('i')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' to a scalar (AKA a vector). If you look at this for a while you can probably see why it is equivalent to the more standard definition.')
						])),
					A3(
					$rtfeldman$elm_css$Html$Styled$node,
					'katex-expression',
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
							'katex-options',
							A2(
								$elm$json$Json$Encode$encode,
								0,
								$elm$json$Json$Encode$object(
									_List_fromArray(
										[
											_Utils_Tuple2(
											'displayMode',
											$elm$json$Json$Encode$bool(true)),
											_Utils_Tuple2(
											'throwOnError',
											$elm$json$Json$Encode$bool(false))
										])))),
							A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', '\n(s\\vec v)_i = s(\\vec v_i)\n')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We can do the same thing to define all the basic arithmetic operations on scalars, vectors, and matrices. In our library we use prefixes to identify the different operations, for example '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('mmadd')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is matrix-matrix addition, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('svmul')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is scalar-vector multiplication, etc.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('If you look at the definitions for some of our operations, you’ll notice a weird operation called '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('contract')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This is used in definining the matrix vector product, the dot product, and the magnitude of vectors. This utility is loosely analogous to the idea of tensor contraction though it is perhaps more general and less theoretically justified. There are a lot of linear algebra operations where we want to accumulate via a sum the values across indices. We factor this commonality out into the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('contract')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' construct.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('You may notice one of the main weaknesses of our system as it is currently specified in this '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('contract')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' function. In order to contract across indices we need to iterate across those indices. We’ve hard coded the indices here to only describe three dimensional space. That seems bad.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Fortunately this is not a fundamental weakness of this technique. I’m just lazy. The right way to fix this is to describe some sort of \"'),
							$rtfeldman$elm_css$Html$Styled$text('index'),
							$rtfeldman$elm_css$Html$Styled$text('\" interface instead of using plain integers. We might describe indices by an object that implements the iterator for us, for instance. In theory you could even give nice typing rules to these iterators so that we can describe a matrix or vector in terms of the types of their iterators and so that our matrix and vector operations preserve well typed semantics.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But like I said I’m lazy so this will wait for another day.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('There is one other glaring issue that you will have noticed if you’ve tried running this code. It is quite horribly slow. This is because we aren’t caching intermediate results. Every time we look up the value of some vector index, we are rerunning all the computations that describe that index. But once again this is possible to solve, and arguably even easier than the dimensionality thing I discussed before. A pretty brain-dead memoization of the core library makes it so our computer that struggls to churn through 7 iterations of the power iteration algorithm will instantly compute a thousand iterations once memoized.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('def memoize(f):\n    cache = {}\n    def memoized_function(*args):\n        if args not in cache: cache[args] = f(*args)\n        return cache[args]\n    return memoized_function\n\ncontract = lambda f: sum(f(k) for k in dims)\nmmadd = lambda m, n:\n  memoize(lambda i, j: m(i,j) + n(i,j))\nmmmul = lambda m, n:\n  memoize(lambda i, j: contract(lambda k: m(i,k) * n(k,j)))\nmvmul = lambda m, v:\n  memoize(lambda i: contract(lambda k: m(i,k) * v(k)))\nsmmul = lambda s, m:\n  memoize(lambda i, j: s * m(i,j))\nsvmul = lambda s, v:\n  memoize(lambda i: s * v(i))\ndot = lambda v, w: contract(lambda k: v(k) * w(k))\nmagnitude = lambda v: (contract(lambda k: v(k) ** 2)) ** 0.5\nnormalize = lambda v: svmul(1 / magnitude(v), v)\nouter = lambda v, w:\n  memoize(lambda i, j: v(i) * w(j))\nmfromlist = lambda l:\n  memoize(lambda i,j: l[i][j])\nvfromlist = lambda l:\n  memoize(lambda i: l[i])')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Substitute this memoized version of the library for the original without making any changes and see instant massive performance gains.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So this system totally works. Very cool. If you are like me you probably think this is cool enough on its own merits, but just to be explicit let us enumerate the reasons this approach might me interesting explicitly. As far as I’ve thought through there are three of them. First, portability. Second, simplicity. Third, insight.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Starting with portability. You might find yourself wanting to perform some linear algebra in a place that is hostile to linear algebra. Maybe you are doing some in browser stuff with javascript and don’t want to load a full library for some lightweight operations. Copy in twenty or so lines of code and you’ve got yourself a basic linear algebra system anywhere you like. This is a pretty narrow use case but it’s still kind of fun.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Second is simplicity. Many, many interesting matrix operations are expressed more naturally as functions to be quite honest. For example we can construct an identity matrix very cleanly using this functional style: '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('identity = lambda i,j: 1 if i == j else 0')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Technically in Python we could even use implicit boolean conversion to write this '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('identity = lambda i,j: i == j')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' but implicit casting like that gives me the creeps. Or suppose we want a constant vector - this is easily written as '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('vconstant = lambda n: lambda i: n')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Or perhaps we want to test two vectors for equality with '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('vequal = lambda v, w: contract(lambda k: abs(v(k) - w(k))) == 0')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. We skipped defining the transpose of a matrix because we didn’t need it, but if we did we could write '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('transpose = lambda m: lambda i,j: m(j,i)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This concept also works particularly well to represent sparse matrices which could have considerable performance implications for the right contexts. And because we are using such basic primitive operations it is easy to build up new and more exotic kinds of operations. Instead of having a million library functions to describe direct sums, constant matrices, pointwise nonlinear operations, etc etc etc, we can directly specify them ourselves. I’m a control freak so I find this to be a nice advantage of this style. If you are looking for heavily optimized linear algebra routines this is obviously not the correct style, but if you are looking to do more exploratory and experimental work the flexibility offered by this functional approach to linear algebra is pretty hard to beat, so far as I’ve seen.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This leads into the third benefit I’m aware of. Insight.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I’m a firm believer that seeing the same concepts from dozens of different angles gives you a much deeper understanding of that concept than accepting the one standard approach. This functional approach is very nonstandard. I’m still playing with all of this so I’m not quite sure exactly '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('what')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' those insights might be. Though the centrality of the contraction operation here does give me warm and fuzzy feelings about Einsten notation for tensors.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But perhaps more than simply seeing things from a different perspective we gain insight by tinkering and experimentation. Like I said, this approach is extremely flexible. It took me just a few hours to develop this entire approach from scratch and implement the power iteration algorithm in it. Next time I will be even faster. There is no better educational technique than hands-on experimentation and the functional linear algebra approach is the best approach I’ve ever come across for doing it yourself.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So there you have it! You are now in posession of a very weird approach to implementing linear algebra in any language that supports first class functions. Impress your friends, frighten your enemies, and awe the world with the power of functional linear algebra.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('For more, check out the appendices to this essay: '),
									A2(
									$rtfeldman$elm_css$Html$Styled$a,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$Attributes$href('/FNLINALGTYPED')
										]),
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra, With Types')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' and '),
									A2(
									$rtfeldman$elm_css$Html$Styled$a,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$Attributes$href('/FNLINALGMEMO')
										]),
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra, Memoized')
										]))
								]))
						]))
				]));
	}
};
var $author$project$Pages$FunctionalLinearAlgebraMemoized$page = {
	c1: F2(
		function (_v0, model) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}),
	c4: function (_v1) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra, Memoized'),
					$author$project$Pages$FunctionalLinearAlgebraMemoized$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is a second appendix to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('/FNLINALG')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. It’s a continuation of the first appendix, really, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('/FNLINALGTYPED')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra, With Types')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. There we extended the original Python implementation in Haskell so all our matrix and vector operations are very nicely typed. But in the process we lost a lot of performance. This brief note discusses memoizing the Haskell impelmentation.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The idea is pretty simple, actually. The reason performance suffered has to do with our representation of vectors as functions. When we describe a vector in terms of a big chain of operations that involve contractions, we unfortunately do not typically share those contraction results across indices. If we have a 3d vector defined as a product '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'M\\vec v')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(', then to find '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', '\\vec v_i')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(' and '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', '\\vec v_j')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(' we are running a the same contraction over indices two different times. This is obviously redundant. This results in our power iteration running in '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'O(d^n)')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(' time, where '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'd')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(' is the dimensionality of the matrix and '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'n')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(' is the iteration count.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The dumbest way to fix this I know of is to embed a vector or matrix into an array. This effectively forces the computations to be shared. Here is a quick way to do this using some imports from '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Data.Array')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' (full code at the end of this post):')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('memoizeVector :: forall a. KnownNat a => Vector a -> Vector a\nmemoizeVector v =\n  let\n    bounds =\n        ( fromIntegral (minBound :: Finite a)\n        , fromIntegral (maxBound :: Finite a))\n    arr = listArray bounds (map v finites)\n  in \\i -> arr ! fromIntegral (getFinite i)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('With this we only change one thing in our existing code. We memoize part of our loop')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('powerIteration b0 m =\n    ...\n    loop i b\' = loop (i-1) (normalize (memoizeVector (mvmul m b\')))\n    ...')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We inject this one call to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('memoizeVector')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Now we can increase the number of loop iterations by a whole bunch')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('powerIteration b0 m =\n    ...\n    b = loop 1000 b0\n    ...')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('(the iterations were maxing out around 7 before) and the code runs almost instantly. We are now pretty firmly in '),
							A3(
							$rtfeldman$elm_css$Html$Styled$node,
							'katex-expression',
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$Attributes$attribute,
									'katex-options',
									A2(
										$elm$json$Json$Encode$encode,
										0,
										$elm$json$Json$Encode$object(
											_List_fromArray(
												[
													_Utils_Tuple2(
													'displayMode',
													$elm$json$Json$Encode$bool(false)),
													_Utils_Tuple2(
													'throwOnError',
													$elm$json$Json$Encode$bool(false))
												])))),
									A2($rtfeldman$elm_css$Html$Styled$Attributes$attribute, 'expression', 'O(d \\times n)')
								]),
							_List_Nil),
							$rtfeldman$elm_css$Html$Styled$text(' territory for the runtime of this algorithm.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Before we end some brief discussion.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Full disclosure, I don’t totally love this solution. For a few different reasons. It doesn’t feel very principled. I don’t have a good theory for exactly when it will be necessary to insert these memoization calls, or precisely where to insert them. To figure this instance out I poked at the code for a while and got it to do the right thing but trial-and-error seems like the wrong way to go about optimizing this. It feels like there should be some sort of theory or equational law or standard rewrite or something that makes this fast.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I also don’t love throwing away totality within the body of the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('memoizeVector')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' definition. I '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('know')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' that the array index lookup will never throw an error, but non-total functions, even those that are well reasoned, give me the ick. Is this a stupid criticism? Probably. But I can’t help but feel that the presence of partiality signals that something fundamental is wrong and that a better approach exists.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Nevertheless, memoizing works. And it works really well. The original version of this example took a little over 10 seconds to run 7 power iteration loops and was growing exponentially. The memoized version can run 1,000,000 iterations in under 5 seconds and grows linearly from there. Beautiful or not, memoizing is certainly effective.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So there you have it. A fast, type safe, very simple functional implementation of linear algebra in Haskell that represents matrices and vectors as functions. I leave it to you to find whatever meaning you want in this exercise. Perhaps this is just a cool trick. Perhaps it’s a fun excuse to try out some easy, type-level programming. Perhaps this is a deep insight into the fundamental nature of linear algebra. Perhaps it’s a meditation on the benefits and challenges of encoding data with functions. Or perhaps it means something else to you.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Whatever the case, I am much obliged that you’ve read through to the end with me. I leave the full source of this memoized implementation in your care. Use it wisely.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('{-# LANGUAGE ScopedTypeVariables #-}\n{-# LANGUAGE DataKinds #-}\n{-# LANGUAGE TypeApplications #-}\n\nmodule Main where\n\nimport Data.Array\nimport GHC.TypeLits\nimport Data.Finite\nimport Data.Maybe\nimport Data.List\nimport Control.Monad\n\ntype Vector a = Finite a -> Float\ntype Matrix a b = Finite a -> Finite b -> Float\n\ncontract :: forall a. KnownNat a => Vector a -> Float\ncontract f = sum (map f finites)\n\nmmadd :: Matrix a b -> Matrix a b -> Matrix a b\nmmadd m n i j = m i j + n i j\n\nmmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c) => Matrix a b -> Matrix b c -> Matrix a c\nmmmul m n i j = contract (\\k -> m i k * n k j)\n\nmvmul :: forall a b. (KnownNat a, KnownNat b) => Matrix a b -> Vector b -> Vector a\nmvmul m v i = contract (\\k -> m i k * v k)\n\nsmmul :: Float -> Matrix a b -> Matrix a b\nsmmul s m i j = s * m i j\n\nsvmul :: Float -> Vector a -> Vector a\nsvmul s v i = s * v i\n\ndot :: forall a. KnownNat a => Vector a -> Vector a -> Float\ndot v w = contract (\\k -> v k * w k)\n\nmagnitude :: forall a. KnownNat a => Vector a -> Float\nmagnitude v = (contract (\\k -> (v k)**2))**0.5\n\nnormalize :: forall a. KnownNat a => Vector a -> Vector a\nnormalize v = svmul (1 / (magnitude v)) v\n\nouter :: Vector a -> Vector b -> Matrix a b\nouter v w i j = v i * w j\n\nvfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)\nvfromlist l = do\n  guard (length l == length (finites @n))\n  pure (\\i -> l !! fromIntegral i)\n\nmfromlist :: forall n m. (KnownNat n, KnownNat m) => [[Float]] -> Maybe (Matrix n m)\nmfromlist l = do\n  guard (length l == length (finites @n))\n  ls <- sequence (fmap vfromlist l)\n  pure (\\i -> ls !! fromIntegral i)\n\nmemoizeVector :: forall a. KnownNat a => Vector a -> Vector a\nmemoizeVector v =\n  let\n    bounds = (fromIntegral (minBound :: Finite a), fromIntegral (maxBound :: Finite a))\n    arr = listArray bounds (map v finites)\n  in \\i -> arr ! fromIntegral (getFinite i)\n\npowerIteration :: forall a. KnownNat a => Vector a -> Matrix a a -> (Float, Vector a)\npowerIteration b0 m =\n  let\n    loop :: Int -> Vector a -> Vector a\n    loop 0 b\' = b\'\n    loop i b\' = loop (i-1) (normalize (memoizeVector (mvmul m b\')))\n    b :: Vector a\n    b = loop 1000 b0\n    eigenvalue :: Float\n    eigenvalue = dot b (mvmul m b)\n  in (eigenvalue, b)\n\ndeflate :: forall a. KnownNat a => Matrix a a -> Float -> Vector a -> Matrix a a\ndeflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))\n\na :: Matrix 3 3\nJust a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]\n\nb0 :: Vector 3\nJust b0 = vfromlist([1,2,3])\n\npow = powerIteration\n\ne1 :: (Float, Vector 3)\ne1 = pow b0 a\na_deflated :: Matrix 3 3\na_deflated = deflate a (fst e1) (snd e1)\ne2 :: (Float, Vector 3)\ne2 = pow b0 a_deflated\n\ndisplay :: (Float, Vector 3) -> String\ndisplay (eval, evec) = \"λ: \" ++ show eval ++ \" \" ++ intercalate \" \" (map (\\i -> show (getFinite i) ++ \": \" ++ show (evec i)) finites)\n\nmain :: IO ()\nmain = do putStrLn (display e1)\n          putStrLn (display e2)')
								]))
						]))
				]));
	}
};
var $author$project$Pages$FunctionalLinearAlgebraWithTypes$page = {
	c1: F2(
		function (_v0, model) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}),
	c4: function (_v1) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra, with Types'),
					$author$project$Pages$FunctionalLinearAlgebraWithTypes$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is an appendix to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('/FNLINALG')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' that fills in one of the biggest gaps from that essay. If you haven’t read it, the premise is that I didn’t want to install numpy. Instead we talked over how we can represent vectors and matrices using functions from some set of labels (e.g. X, Y, Z or 0, 1, 2) to scalars. And with this representation we can write all sorts of operations pretty simply as higher order functions. If you want more details go read that article, I think it’s a pretty cool idea if I do say so myself.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I alluded to a better system for representing dimensions in that essay. Some handwaving suggestions that \"'),
							$rtfeldman$elm_css$Html$Styled$text('with the magic of types we can nicely deal with contractions over dimensions'),
							$rtfeldman$elm_css$Html$Styled$text('\" and stuff like that. This appendix closes that loop by showing how to do this quite elegantly in Haskell. Porting this demonstration to other languages is clearly trivial and left as an exercise to the reader (I’m so sorry but I’m too dumb to figure it out myself).')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The only new piece of technology we will use is the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Data.Finite')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' module. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Data.Finite')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' uses some fancy Haskell stuff with type level natural numbers to provide an easy way to build finite sets of a given cardinality. For example the type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Finite 3')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' will contain the values '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('finite 0')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('finite 1')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('finite 2')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', and nothing else.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Crucially the module provides us a nice utility, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('finites')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', that gives us an iterator over all elements of a particular finite set with a particular cardinality. If we were to evaluate '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('finites :: [Finite 4]')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' we would be yielded the result '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('[finite 0, finite 1, finite 2, finite 3]')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This means that our types carry precisely the information needed to define iterators for the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('contract')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' function we were using last time.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('If that doesn’t make sense, don’t worry about it. Have some code instead.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('{-# LANGUAGE ScopedTypeVariables #-}\n{-# LANGUAGE DataKinds #-}\n{-# LANGUAGE TypeApplications #-}\n\nmodule Main where\n\nimport GHC.TypeLits\nimport Data.Finite\nimport Data.Maybe\nimport Data.List\nimport Control.Monad\n\ntype Vector a = Finite a -> Float\ntype Matrix a b = Finite a -> Finite b -> Float\n\ncontract :: forall a. KnownNat a => Vector a -> Float\ncontract f = sum (map f finites)\n\nmmadd :: Matrix a b -> Matrix a b -> Matrix a b\nmmadd m n i j = m i j + n i j\n\nmmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c)\n  => Matrix a b -> Matrix b c -> Matrix a c\nmmmul m n i j = contract (\\k -> m i k * n k j)\n\nmvmul :: forall a b. (KnownNat a, KnownNat b)\n  => Matrix a b -> Vector b -> Vector a\nmvmul m v i = contract (\\k -> m i k * v k)\n\nsmmul :: Float -> Matrix a b -> Matrix a b\nsmmul s m i j = s * m i j\n\nsvmul :: Float -> Vector a -> Vector a\nsvmul s v i = s * v i\n\ndot :: forall a. KnownNat a => Vector a -> Vector a -> Float\ndot v w = contract (\\k -> v k * w k)\n\nmagnitude :: forall a. KnownNat a => Vector a -> Float\nmagnitude v = (contract (\\k -> (v k)**2))**0.5\n\nnormalize :: forall a. KnownNat a => Vector a -> Vector a\nnormalize v = svmul (1 / (magnitude v)) v\n\nouter :: Vector a -> Vector b -> Matrix a b\nouter v w i j = v i * w j\n\nvfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)\nvfromlist l = do\n  guard (length l == length (finites @n))\n  pure (\\i -> l !! getFinite i)\n\nmfromlist :: forall n m. (KnownNat n, KnownNat m)\n  => [[Float]] -> Maybe (Matrix n m)\nmfromlist l = do\n  guard (length l == length (finites @n))\n  ls <- sequence (fmap vfromlist l)\n  pure (\\i -> ls !! getFinite i)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is what our linear algebra library looks like when translated into Haskell. If you were to cross reference it with the python implementation from the other post, you’d notice only a few key differences.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$ol,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Type annotations. The whole point is that we are trying to make this new scheme well typed, no? Most of the new lines here are type annotations. These annotations are mostly intuitive, though the '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('forall a.KnownNat a')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' stuff may be a bit perplexing. Just know that this universal quantification is how we pass around the type information that lets us write '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('contract')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' all nice like.')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('More complex conversions from lists to matrices and vectors. The python list conversion functions did no bounds checking, so we added some extra stuff to make the matrix conversions type safe.')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('The type aliases '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('Vector')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' and '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('Matrix')
										])),
									$rtfeldman$elm_css$Html$Styled$text('. They are just aliases for functions!')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Perhaps the real star of the show, our new definitions for '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('contract')
										])),
									$rtfeldman$elm_css$Html$Styled$text('. Notice how it no longer depends on some hard coded '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('dims')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' array floating around in the ether, but it also doesn’t require any new arguments? That’s the magic of our chosen library and the '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('finites')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' function. '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('finites')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' lets us access the type level data we need to iterate over all the values of a given axis.')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Everything else in the library is a very straightforward translation from Python to Haskell.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('From here we rush through the remainder of the example from the original essay. Here we define our power iteration and deflation functions')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('powerIteration :: forall a. KnownNat a\n  => Vector a -> Matrix a a -> (Float, Vector a)\npowerIteration b0 m =\n  let\n    loop :: Int -> Vector a -> Vector a\n    loop 0 b\' = b\'\n    loop i b\' = loop (i-1) (normalize (mvmul m b\'))\n    b :: Vector a\n    b = loop 5 b0\n    eigenvalue :: Float\n    eigenvalue = dot b (mvmul m b)\n  in (eigenvalue, b)\n\ndeflate :: forall a. KnownNat a\n  => Matrix a a -> Float -> Vector a -> Matrix a a\ndeflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('You can read from the type signatures that we can only define these methods over a square matrix, since our functions operate on '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Matrix a a')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. And here is an example calculation using '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('powerIteration')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('deflate')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('a :: Matrix 3 3\nJust a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]\n\nb0 :: Vector 3\nJust b0 = vfromlist([1,2,3])\n\ne1 :: (Float, Vector 3)\ne1 = powerIteration b0 a\na_deflated :: Matrix 3 3\na_deflated = deflate a (fst e1) (snd e1)\ne2 :: (Float, Vector 3)\ne2 = powerIteration b0 a_deflated\n\ndisplay :: (Float, Vector 3) -> String\ndisplay (eval, evec) =\n  \"λ: \"\n  ++ show eval\n  ++ \" \"\n  ++ intercalate \" \"\n       (map\n         (\\i -> show (getFinite i) ++ \": \" ++ show (evec i))\n         finites)\n\nmain :: IO ()\nmain = do putStrLn (display e1)\n          putStrLn (display e2)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Notice that we have lovely type level natural numbers on the type of '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('a')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. You won’t get confused when you see '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('a :: Matrix 3 3')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. It’s scientifically impossible. When we put everything together and run it we get the results that we hope for')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('λ: 5.7912016 0: 0.7802645 1: 0.28464365 2: 0.55692476\nλ: 2.9946988 0: -4.2912193e-2 1: 0.90928996 2: -0.41394478')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Isn’t this lovely? I think it is lovely. Our linear algebra system is perfectly well typed '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('and')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' we still have the incredible flexibiliy offered by defining matrices and vectors in terms of functions. Need an identity matrix? Here’s a perfectly typed identity matrix.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('identity :: Matrix a a\nidentity i j = if i == j then 1 else 0')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Too easy.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Before wrapping up, here is the full source code you can use to experiment with yourself.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('{-# LANGUAGE ScopedTypeVariables #-}\n{-# LANGUAGE DataKinds #-}\n{-# LANGUAGE TypeApplications #-}\n\nmodule Main where\n\nimport GHC.TypeLits\nimport Data.Finite\nimport Data.Maybe\nimport Data.List\nimport Control.Monad\n\ntype Vector a = Finite a -> Float\ntype Matrix a b = Finite a -> Finite b -> Float\n\ncontract :: forall a. KnownNat a => Vector a -> Float\ncontract f = sum (map f finites)\n\nmmadd :: Matrix a b -> Matrix a b -> Matrix a b\nmmadd m n i j = m i j + n i j\n\nmmmul :: forall a b c. (KnownNat a, KnownNat b, KnownNat c) => Matrix a b -> Matrix b c -> Matrix a c\nmmmul m n i j = contract (\\k -> m i k * n k j)\n\nmvmul :: forall a b. (KnownNat a, KnownNat b) => Matrix a b -> Vector b -> Vector a\nmvmul m v i = contract (\\k -> m i k * v k)\n\nsmmul :: Float -> Matrix a b -> Matrix a b\nsmmul s m i j = s * m i j\n\nsvmul :: Float -> Vector a -> Vector a\nsvmul s v i = s * v i\n\ndot :: forall a. KnownNat a => Vector a -> Vector a -> Float\ndot v w = contract (\\k -> v k * w k)\n\nmagnitude :: forall a. KnownNat a => Vector a -> Float\nmagnitude v = (contract (\\k -> (v k)**2))**0.5\n\nnormalize :: forall a. KnownNat a => Vector a -> Vector a\nnormalize v = svmul (1 / (magnitude v)) v\n\nouter :: Vector a -> Vector b -> Matrix a b\nouter v w i j = v i * w j\n\nvfromlist :: forall n. KnownNat n => [Float] -> Maybe (Vector n)\nvfromlist l = do\n  guard (length l == length (finites @n))\n  pure (\\i -> l !! getFinite i)\n\nmfromlist :: forall n m. (KnownNat n, KnownNat m) => [[Float]] -> Maybe (Matrix n m)\nmfromlist l = do\n  guard (length l == length (finites @n))\n  ls <- sequence (fmap vfromlist l)\n  pure (\\i -> ls !! getFinite i)\n\npowerIteration :: forall a. KnownNat a => Vector a -> Matrix a a -> (Float, Vector a)\npowerIteration b0 m =\n  let\n    loop :: Int -> Vector a -> Vector a\n    loop 0 b\' = b\'\n    loop i b\' = loop (i-1) (normalize (mvmul m b\'))\n    b :: Vector a\n    b = loop 5 b0\n    eigenvalue :: Float\n    eigenvalue = dot b (mvmul m b)\n  in (eigenvalue, b)\n\ndeflate :: forall a. KnownNat a => Matrix a a -> Float -> Vector a -> Matrix a a\ndeflate m s v = mmadd m (smmul (-s / magnitude v) (outer v v))\n\na :: Matrix 3 3\nJust a = mfromlist [[4,1,2],[1,3,0],[2,0,3]]\n\nb0 :: Vector 3\nJust b0 = vfromlist([1,2,3])\n\ne1 :: (Float, Vector 3)\ne1 = powerIteration b0 a\na_deflated :: Matrix 3 3\na_deflated = deflate a (fst e1) (snd e1)\ne2 :: (Float, Vector 3)\ne2 = powerIteration b0 a_deflated\n\ndisplay :: (Float, Vector 3) -> String\ndisplay (eval, evec) = \"λ: \" ++ show eval ++ \" \" ++ intercalate \" \" (map (\\i -> show (getFinite i) ++ \": \" ++ show (evec i)) finites)\n\nmain :: IO ()\nmain = do putStrLn (display e1)\n          putStrLn (display e2)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('If you try running this code you will notice there is one very minor drawback to this implementation. Memoizing is unfortunately not as braindead simple in Haskell as it is in python, so i haven’t implemented it. I don’t even really have a good idea how to implement it yet in a way that sparks joy. Obviously this code '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('could')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' be memoized, but I’m not sure how to do it without sacrificing the semantic clarity we’ve gained from turning everything into functions. And if we lose the simplicity then we’ve lost a lot of the draw of this approach.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So there is still work to do.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Nevertheless! We have from the original essay a fairly performant memoized implementation of functional linear algebra. And we have in this appendix a very nicely typed implementation of functional linear algebra. The technique works.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And we still haven’t installed numpy.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Good job team.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('For more, check out the second appendix to this essay: '),
									A2(
									$rtfeldman$elm_css$Html$Styled$a,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$Attributes$href('/FNLINALGMEMO')
										]),
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('Functional Linear Algebra, Memoized')
										]))
								]))
						]))
				]));
	}
};
var $rtfeldman$elm_css$Svg$Styled$Attributes$d = $rtfeldman$elm_css$VirtualDom$Styled$attribute('d');
var $rtfeldman$elm_css$VirtualDom$Styled$NodeNS = F4(
	function (a, b, c, d) {
		return {$: 1, a: a, b: b, c: c, d: d};
	});
var $rtfeldman$elm_css$VirtualDom$Styled$nodeNS = $rtfeldman$elm_css$VirtualDom$Styled$NodeNS;
var $rtfeldman$elm_css$Svg$Styled$node = $rtfeldman$elm_css$VirtualDom$Styled$nodeNS('http://www.w3.org/2000/svg');
var $rtfeldman$elm_css$Svg$Styled$path = $rtfeldman$elm_css$Svg$Styled$node('path');
var $rtfeldman$elm_css$Svg$Styled$Attributes$stroke = $rtfeldman$elm_css$VirtualDom$Styled$attribute('stroke');
var $rtfeldman$elm_css$Svg$Styled$Attributes$strokeLinejoin = $rtfeldman$elm_css$VirtualDom$Styled$attribute('stroke-linejoin');
var $rtfeldman$elm_css$Svg$Styled$Attributes$strokeWidth = $rtfeldman$elm_css$VirtualDom$Styled$attribute('stroke-width');
var $author$project$Extra$GameOfLife$Diagrams$arrow = function (yPos) {
	return A2(
		$rtfeldman$elm_css$Svg$Styled$path,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$d(
				'm.5' + ($elm$core$String$fromFloat(yPos) + '5v-.04zl.012-.012zl-.012-.012z')),
				$rtfeldman$elm_css$Svg$Styled$Attributes$stroke('black'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$strokeWidth('.003'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$strokeLinejoin('round')
			]),
		_List_Nil);
};
var $author$project$Extra$GameOfLife$Diagrams$cartesian = F2(
	function (xs, ys) {
		return A2(
			$elm$core$List$concatMap,
			function (x) {
				return A2(
					$elm$core$List$map,
					function (y) {
						return _Utils_Tuple2(x, y);
					},
					ys);
			},
			xs);
	});
var $rtfeldman$elm_css$Svg$Styled$circle = $rtfeldman$elm_css$Svg$Styled$node('circle');
var $rtfeldman$elm_css$Svg$Styled$Attributes$cx = $rtfeldman$elm_css$VirtualDom$Styled$attribute('cx');
var $rtfeldman$elm_css$Svg$Styled$Attributes$cy = $rtfeldman$elm_css$VirtualDom$Styled$attribute('cy');
var $rtfeldman$elm_css$Svg$Styled$Attributes$r = $rtfeldman$elm_css$VirtualDom$Styled$attribute('r');
var $author$project$Extra$GameOfLife$Diagrams$drawCell = F2(
	function (alive, _v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2(
			$rtfeldman$elm_css$Svg$Styled$circle,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Svg$Styled$Attributes$cx(
					$elm$core$String$fromFloat(x)),
					$rtfeldman$elm_css$Svg$Styled$Attributes$cy(
					$elm$core$String$fromFloat(y)),
					$rtfeldman$elm_css$Svg$Styled$Attributes$r(
					alive ? '0.007' : '0.001')
				]),
			_List_Nil);
	});
var $rtfeldman$elm_css$Svg$Styled$g = $rtfeldman$elm_css$Svg$Styled$node('g');
var $elm$core$Dict$get = F2(
	function (targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $elm$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($elm$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
							$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $elm$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
							$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $elm$core$Dict$member = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $elm$core$Set$member = F2(
	function (key, _v0) {
		var dict = _v0;
		return A2($elm$core$Dict$member, key, dict);
	});
var $author$project$Extra$GameOfLife$Diagrams$spacing = 0.017;
var $author$project$Extra$GameOfLife$Diagrams$cellGrid = F4(
	function (_v0, width, height, cells) {
		var xCenter = _v0.a;
		var yCenter = _v0.b;
		return A2(
			$rtfeldman$elm_css$Svg$Styled$g,
			_List_Nil,
			A2(
				$elm$core$List$map,
				function (_v1) {
					var x = _v1.a;
					var y = _v1.b;
					return A2(
						$author$project$Extra$GameOfLife$Diagrams$drawCell,
						A2(
							$elm$core$Set$member,
							_Utils_Tuple2(x, y),
							cells),
						_Utils_Tuple2((xCenter - ((0.5 * (width - 1)) * $author$project$Extra$GameOfLife$Diagrams$spacing)) + ($author$project$Extra$GameOfLife$Diagrams$spacing * x), (yCenter - ((0.5 * (height - 1)) * $author$project$Extra$GameOfLife$Diagrams$spacing)) + ($author$project$Extra$GameOfLife$Diagrams$spacing * y)));
				},
				A2(
					$author$project$Extra$GameOfLife$Diagrams$cartesian,
					A2($elm$core$List$range, 0, width - 1),
					A2($elm$core$List$range, 0, height - 1))));
	});
var $rtfeldman$elm_css$Svg$Styled$Attributes$dominantBaseline = $rtfeldman$elm_css$VirtualDom$Styled$attribute('dominant-baseline');
var $rtfeldman$elm_css$Svg$Styled$Attributes$fontFamily = $rtfeldman$elm_css$VirtualDom$Styled$attribute('font-family');
var $rtfeldman$elm_css$Svg$Styled$Attributes$fontSize = $rtfeldman$elm_css$VirtualDom$Styled$attribute('font-size');
var $rtfeldman$elm_css$Svg$Styled$text = $rtfeldman$elm_css$VirtualDom$Styled$text;
var $rtfeldman$elm_css$Svg$Styled$Attributes$textAnchor = $rtfeldman$elm_css$VirtualDom$Styled$attribute('text-anchor');
var $rtfeldman$elm_css$Svg$Styled$text_ = $rtfeldman$elm_css$Svg$Styled$node('text');
var $rtfeldman$elm_css$Svg$Styled$Attributes$x = $rtfeldman$elm_css$VirtualDom$Styled$attribute('x');
var $rtfeldman$elm_css$Svg$Styled$Attributes$y = $rtfeldman$elm_css$VirtualDom$Styled$attribute('y');
var $author$project$Extra$GameOfLife$Diagrams$diagramText = F3(
	function (xVal, yVal, content) {
		return A2(
			$rtfeldman$elm_css$Svg$Styled$text_,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Svg$Styled$Attributes$x(xVal),
					$rtfeldman$elm_css$Svg$Styled$Attributes$y(yVal),
					$rtfeldman$elm_css$Svg$Styled$Attributes$fontSize('.028'),
					$rtfeldman$elm_css$Svg$Styled$Attributes$fontFamily('courier'),
					$rtfeldman$elm_css$Svg$Styled$Attributes$dominantBaseline('central'),
					$rtfeldman$elm_css$Svg$Styled$Attributes$textAnchor('middle')
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Svg$Styled$text(content)
				]));
	});
var $rtfeldman$elm_css$Svg$Styled$Attributes$preserveAspectRatio = $rtfeldman$elm_css$VirtualDom$Styled$attribute('preserveAspectRatio');
var $rtfeldman$elm_css$Svg$Styled$svg = $rtfeldman$elm_css$Svg$Styled$node('svg');
var $rtfeldman$elm_css$Svg$Styled$Attributes$transform = $rtfeldman$elm_css$VirtualDom$Styled$attribute('transform');
var $rtfeldman$elm_css$Svg$Styled$Attributes$viewBox = $rtfeldman$elm_css$VirtualDom$Styled$attribute('viewBox');
var $rtfeldman$elm_css$Svg$Styled$Attributes$width = $rtfeldman$elm_css$VirtualDom$Styled$attribute('width');
var $author$project$Extra$GameOfLife$Diagrams$cellsToCheckDiagram = function () {
	var line3 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(0 .25)')
			]),
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.4', '.49', '∪'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.6', '.49', '∪'),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.3, 0.49),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(0, 0),
							_Utils_Tuple2(0, 1),
							_Utils_Tuple2(0, 2),
							_Utils_Tuple2(1, 0),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(2, 0),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 2)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.5, 0.49),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(0, 1),
							_Utils_Tuple2(0, 2),
							_Utils_Tuple2(0, 3),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 3),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 2),
							_Utils_Tuple2(2, 3)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.7, 0.49),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 3),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 2),
							_Utils_Tuple2(2, 3),
							_Utils_Tuple2(3, 1),
							_Utils_Tuple2(3, 2),
							_Utils_Tuple2(3, 3)
						])))
			]));
	var line2 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_Nil,
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.16', '.49', '(near'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.39', '.49', ') ∪ (near'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.66', '.49', ') ∪ (near'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.86', '.49', ')'),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.26, 0.49),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 1)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.53, 0.49),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 2)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.8, 0.49),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(2, 2)
						])))
			]));
	var line1 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate(0.04 0.04)')
			]),
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.4', '0.235', 'foldl (near >> union) empty'),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.69, 0.235),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(2, 2)
						])))
			]));
	return A2(
		$rtfeldman$elm_css$Svg$Styled$svg,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$width('100%'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0.22 1 0.83'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$preserveAspectRatio('meet')
			]),
		_List_fromArray(
			[
				line1,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.38),
				line2,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.63),
				line3,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.87),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.5, 0.98),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(0, 0),
							_Utils_Tuple2(1, 0),
							_Utils_Tuple2(2, 0),
							_Utils_Tuple2(0, 3),
							_Utils_Tuple2(0, 1),
							_Utils_Tuple2(0, 2),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 3),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 2),
							_Utils_Tuple2(2, 3),
							_Utils_Tuple2(3, 1),
							_Utils_Tuple2(3, 2),
							_Utils_Tuple2(3, 3)
						])))
			]));
}();
var $rtfeldman$elm_css$Html$Styled$h3 = $rtfeldman$elm_css$Html$Styled$node('h3');
var $author$project$Extra$GameOfLife$Diagrams$livingNeighborsDiagram = function () {
	var line4 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate (0 .63)')
			]),
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.5', '.09', '∩'),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.4, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 0),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(3, 3),
							_Utils_Tuple2(4, 0),
							_Utils_Tuple2(2, 2)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.6, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 3),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 3),
							_Utils_Tuple2(3, 1),
							_Utils_Tuple2(3, 2),
							_Utils_Tuple2(3, 3)
						])))
			]));
	var line3 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate (0 .42)')
			]),
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.44', '.09', '∩ ('),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.6', '.09', ' -'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.74', '.09', ')'),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.34, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 0),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(3, 3),
							_Utils_Tuple2(4, 0),
							_Utils_Tuple2(2, 2)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.52, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 3),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 2),
							_Utils_Tuple2(2, 3),
							_Utils_Tuple2(3, 1),
							_Utils_Tuple2(3, 2),
							_Utils_Tuple2(3, 3)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.68, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(2, 2)
						])))
			]));
	var line2 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$transform('translate (-0.02 .2)')
			]),
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.44', '.09', '∩ ((near'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.64', '.09', ') -'),
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.79', '.09', ')'),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.3, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 0),
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(3, 3),
							_Utils_Tuple2(4, 0),
							_Utils_Tuple2(2, 2)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.56, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(2, 2)
						]))),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.73, 0.09),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(2, 2)
						])))
			]));
	var line1 = A2(
		$rtfeldman$elm_css$Svg$Styled$g,
		_List_Nil,
		_List_fromArray(
			[
				A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '.5', '.1', 'board ∩ ((near cell) - cell)')
			]));
	return A2(
		$rtfeldman$elm_css$Svg$Styled$svg,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$width('100%'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 .06 1 .96'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$preserveAspectRatio('meet')
			]),
		_List_fromArray(
			[
				line1,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.19),
				line2,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.41),
				line3,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.63),
				line4,
				$author$project$Extra$GameOfLife$Diagrams$arrow(0.86),
				A4(
				$author$project$Extra$GameOfLife$Diagrams$cellGrid,
				_Utils_Tuple2(0.5, 0.95),
				5,
				5,
				$elm$core$Set$fromList(
					_List_fromArray(
						[
							_Utils_Tuple2(1, 1),
							_Utils_Tuple2(1, 2),
							_Utils_Tuple2(1, 3),
							_Utils_Tuple2(2, 1),
							_Utils_Tuple2(2, 2),
							_Utils_Tuple2(2, 3),
							_Utils_Tuple2(3, 1),
							_Utils_Tuple2(3, 2),
							_Utils_Tuple2(3, 3)
						])))
			]));
}();
var $author$project$Extra$GameOfLife$Diagrams$nearDiagram = A2(
	$rtfeldman$elm_css$Svg$Styled$svg,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Svg$Styled$Attributes$width('100%'),
			$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 .02 1 .39'),
			$rtfeldman$elm_css$Svg$Styled$Attributes$preserveAspectRatio('meet')
		]),
	_List_fromArray(
		[
			A3($author$project$Extra$GameOfLife$Diagrams$diagramText, '0.45', '0.09', 'near'),
			A4(
			$author$project$Extra$GameOfLife$Diagrams$cellGrid,
			_Utils_Tuple2(0.55, 0.09),
			5,
			5,
			$elm$core$Set$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(2, 2)
					]))),
			A4(
			$author$project$Extra$GameOfLife$Diagrams$cellGrid,
			_Utils_Tuple2(0.5, 0.34),
			5,
			5,
			$elm$core$Set$fromList(
				_List_fromArray(
					[
						_Utils_Tuple2(1, 1),
						_Utils_Tuple2(1, 2),
						_Utils_Tuple2(1, 3),
						_Utils_Tuple2(2, 1),
						_Utils_Tuple2(2, 2),
						_Utils_Tuple2(2, 3),
						_Utils_Tuple2(3, 1),
						_Utils_Tuple2(3, 2),
						_Utils_Tuple2(3, 3)
					]))),
			$author$project$Extra$GameOfLife$Diagrams$arrow(0.23)
		]));
var $elm$core$Dict$getMin = function (dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $elm$core$Dict$moveRedLeft = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				rlK,
				rlV,
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					rlL),
				A5($elm$core$Dict$RBNode_elm_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$moveRedRight = function (dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				0,
				lK,
				lV,
				A5($elm$core$Dict$RBNode_elm_builtin, 1, llK, llV, llLeft, llRight),
				A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					lRight,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					1,
					k,
					v,
					A5($elm$core$Dict$RBNode_elm_builtin, 0, lK, lV, lLeft, lRight),
					A5($elm$core$Dict$RBNode_elm_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $elm$core$Dict$removeHelpPrepEQGT = F7(
	function (targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				lK,
				lV,
				lLeft,
				A5($elm$core$Dict$RBNode_elm_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $elm$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $elm$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $elm$core$Dict$removeMin = function (dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5(
					$elm$core$Dict$RBNode_elm_builtin,
					color,
					key,
					value,
					$elm$core$Dict$removeMin(left),
					right);
			} else {
				var _v4 = $elm$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5(
						$elm$core$Dict$balance,
						nColor,
						nKey,
						nValue,
						$elm$core$Dict$removeMin(nLeft),
						nRight);
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			}
		} else {
			return A5(
				$elm$core$Dict$RBNode_elm_builtin,
				color,
				key,
				value,
				$elm$core$Dict$removeMin(left),
				right);
		}
	} else {
		return $elm$core$Dict$RBEmpty_elm_builtin;
	}
};
var $elm$core$Dict$removeHelp = F2(
	function (targetKey, dict) {
		if (dict.$ === -2) {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5(
							$elm$core$Dict$RBNode_elm_builtin,
							color,
							key,
							value,
							A2($elm$core$Dict$removeHelp, targetKey, left),
							right);
					} else {
						var _v7 = $elm$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5(
								$elm$core$Dict$balance,
								nColor,
								nKey,
								nValue,
								A2($elm$core$Dict$removeHelp, targetKey, nLeft),
								nRight);
						} else {
							return $elm$core$Dict$RBEmpty_elm_builtin;
						}
					}
				} else {
					return A5(
						$elm$core$Dict$RBNode_elm_builtin,
						color,
						key,
						value,
						A2($elm$core$Dict$removeHelp, targetKey, left),
						right);
				}
			} else {
				return A2(
					$elm$core$Dict$removeHelpEQGT,
					targetKey,
					A7($elm$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $elm$core$Dict$removeHelpEQGT = F2(
	function (targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $elm$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5(
						$elm$core$Dict$balance,
						color,
						minKey,
						minValue,
						left,
						$elm$core$Dict$removeMin(right));
				} else {
					return $elm$core$Dict$RBEmpty_elm_builtin;
				}
			} else {
				return A5(
					$elm$core$Dict$balance,
					color,
					key,
					value,
					left,
					A2($elm$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $elm$core$Dict$RBEmpty_elm_builtin;
		}
	});
var $elm$core$Dict$remove = F2(
	function (key, dict) {
		var _v0 = A2($elm$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($elm$core$Dict$RBNode_elm_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $elm$core$Dict$diff = F2(
	function (t1, t2) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, t) {
					return A2($elm$core$Dict$remove, k, t);
				}),
			t1,
			t2);
	});
var $elm$core$Set$diff = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$diff, dict1, dict2);
	});
var $elm$core$Dict$filter = F2(
	function (isGood, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (k, v, d) {
					return A2(isGood, k, v) ? A3($elm$core$Dict$insert, k, v, d) : d;
				}),
			$elm$core$Dict$empty,
			dict);
	});
var $elm$core$Dict$intersect = F2(
	function (t1, t2) {
		return A2(
			$elm$core$Dict$filter,
			F2(
				function (k, _v0) {
					return A2($elm$core$Dict$member, k, t2);
				}),
			t1);
	});
var $elm$core$Set$intersect = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$intersect, dict1, dict2);
	});
var $author$project$Extra$GameOfLife$GameOfLife$near = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return A2(
		$elm$core$Set$map,
		function (n) {
			return _Utils_Tuple2(
				(x - 1) + A2($elm$core$Basics$modBy, 3, n),
				(y - 1) + ((n / 3) | 0));
		},
		$elm$core$Set$fromList(
			A2($elm$core$List$range, 0, 8)));
};
var $elm$core$Dict$singleton = F2(
	function (key, value) {
		return A5($elm$core$Dict$RBNode_elm_builtin, 1, key, value, $elm$core$Dict$RBEmpty_elm_builtin, $elm$core$Dict$RBEmpty_elm_builtin);
	});
var $elm$core$Set$singleton = function (key) {
	return A2($elm$core$Dict$singleton, key, 0);
};
var $author$project$Extra$GameOfLife$GameOfLife$neighbors = F2(
	function (board, cell) {
		return A2(
			$elm$core$Set$intersect,
			board,
			A2(
				$elm$core$Set$diff,
				$author$project$Extra$GameOfLife$GameOfLife$near(cell),
				$elm$core$Set$singleton(cell)));
	});
var $elm$core$Dict$sizeHelp = F2(
	function (n, dict) {
		sizeHelp:
		while (true) {
			if (dict.$ === -2) {
				return n;
			} else {
				var left = dict.d;
				var right = dict.e;
				var $temp$n = A2($elm$core$Dict$sizeHelp, n + 1, right),
					$temp$dict = left;
				n = $temp$n;
				dict = $temp$dict;
				continue sizeHelp;
			}
		}
	});
var $elm$core$Dict$size = function (dict) {
	return A2($elm$core$Dict$sizeHelp, 0, dict);
};
var $elm$core$Set$size = function (_v0) {
	var dict = _v0;
	return $elm$core$Dict$size(dict);
};
var $author$project$Extra$GameOfLife$GameOfLife$cellWillBeAlive = F2(
	function (board, cell) {
		var numberOfNeighbors = $elm$core$Set$size(
			A2($author$project$Extra$GameOfLife$GameOfLife$neighbors, board, cell));
		return (numberOfNeighbors === 3) || ((numberOfNeighbors === 2) && A2($elm$core$Set$member, cell, board));
	});
var $elm$core$Dict$union = F2(
	function (t1, t2) {
		return A3($elm$core$Dict$foldl, $elm$core$Dict$insert, t2, t1);
	});
var $elm$core$Set$union = F2(
	function (_v0, _v1) {
		var dict1 = _v0;
		var dict2 = _v1;
		return A2($elm$core$Dict$union, dict1, dict2);
	});
var $author$project$Extra$GameOfLife$GameOfLife$cellsToCheck = A2(
	$elm$core$Set$foldl,
	A2($elm$core$Basics$composeR, $author$project$Extra$GameOfLife$GameOfLife$near, $elm$core$Set$union),
	$elm$core$Set$empty);
var $elm$core$Set$filter = F2(
	function (isGood, _v0) {
		var dict = _v0;
		return A2(
			$elm$core$Dict$filter,
			F2(
				function (key, _v1) {
					return isGood(key);
				}),
			dict);
	});
var $author$project$Extra$GameOfLife$GameOfLife$cullBoard = $elm$core$Set$filter(
	function (_v0) {
		var x = _v0.a;
		var y = _v0.b;
		return ($elm$core$Basics$abs(x) < 300) && ($elm$core$Basics$abs(y) < 300);
	});
var $author$project$Extra$GameOfLife$GameOfLife$nextBoard = function (board) {
	return $author$project$Extra$GameOfLife$GameOfLife$cullBoard(
		A2(
			$elm$core$Set$filter,
			$author$project$Extra$GameOfLife$GameOfLife$cellWillBeAlive(board),
			$author$project$Extra$GameOfLife$GameOfLife$cellsToCheck(board)));
};
var $author$project$Extra$GameOfLife$App$update = F2(
	function (msg, model) {
		switch (msg.$) {
			case 8:
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{
							a4: $author$project$Extra$GameOfLife$GameOfLife$nextBoard(model.a4)
						}),
					$elm$core$Platform$Cmd$none);
			case 9:
				var board = msg.a;
				return _Utils_Tuple2(
					_Utils_update(
						model,
						{a4: board}),
					$elm$core$Platform$Cmd$none);
			default:
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}
	});
var $author$project$Sitewide$Types$LoadBoard = function (a) {
	return {$: 9, a: a};
};
var $rtfeldman$elm_css$Css$absolute = {aC: 0, D: 'absolute'};
var $rtfeldman$elm_css$Css$bottom = $rtfeldman$elm_css$Css$prop1('bottom');
var $rtfeldman$elm_css$Css$displayFlex = A2($rtfeldman$elm_css$Css$property, 'display', 'flex');
var $rtfeldman$elm_css$Css$flexWrap = $rtfeldman$elm_css$Css$prop1('flex-wrap');
var $author$project$Extra$GameOfLife$ExampleBoards$glider = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(-1, 0),
			_Utils_Tuple2(0, 1),
			_Utils_Tuple2(1, -1),
			_Utils_Tuple2(1, 0),
			_Utils_Tuple2(1, 1)
		]));
var $rtfeldman$elm_css$Css$justifyContent = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'justifyContent',
		'justify-content',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $author$project$Extra$GameOfLife$ExampleBoards$methuselah = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(-3, 1),
			_Utils_Tuple2(-2, -1),
			_Utils_Tuple2(-2, 1),
			_Utils_Tuple2(0, 0),
			_Utils_Tuple2(1, 1),
			_Utils_Tuple2(2, 1),
			_Utils_Tuple2(3, 1)
		]));
var $rtfeldman$elm_css$Css$position = $rtfeldman$elm_css$Css$prop1('position');
var $author$project$Extra$GameOfLife$ExampleBoards$pulsar = $elm$core$Set$fromList(
	_List_fromArray(
		[
			_Utils_Tuple2(-6, -4),
			_Utils_Tuple2(-6, -3),
			_Utils_Tuple2(-6, -2),
			_Utils_Tuple2(-6, 2),
			_Utils_Tuple2(-6, 3),
			_Utils_Tuple2(-6, 4),
			_Utils_Tuple2(-4, -6),
			_Utils_Tuple2(-4, -1),
			_Utils_Tuple2(-4, 1),
			_Utils_Tuple2(-4, 6),
			_Utils_Tuple2(-3, -6),
			_Utils_Tuple2(-3, -1),
			_Utils_Tuple2(-3, 1),
			_Utils_Tuple2(-3, 6),
			_Utils_Tuple2(-2, -6),
			_Utils_Tuple2(-2, -1),
			_Utils_Tuple2(-2, 1),
			_Utils_Tuple2(-2, 6),
			_Utils_Tuple2(-1, -4),
			_Utils_Tuple2(-1, -3),
			_Utils_Tuple2(-1, -2),
			_Utils_Tuple2(-1, 2),
			_Utils_Tuple2(-1, 3),
			_Utils_Tuple2(-1, 4),
			_Utils_Tuple2(1, -4),
			_Utils_Tuple2(1, -3),
			_Utils_Tuple2(1, -2),
			_Utils_Tuple2(1, 2),
			_Utils_Tuple2(1, 3),
			_Utils_Tuple2(1, 4),
			_Utils_Tuple2(2, -1),
			_Utils_Tuple2(2, -6),
			_Utils_Tuple2(2, 1),
			_Utils_Tuple2(2, 6),
			_Utils_Tuple2(3, -1),
			_Utils_Tuple2(3, -6),
			_Utils_Tuple2(3, 1),
			_Utils_Tuple2(3, 6),
			_Utils_Tuple2(4, -1),
			_Utils_Tuple2(4, -6),
			_Utils_Tuple2(4, 1),
			_Utils_Tuple2(4, 6),
			_Utils_Tuple2(6, -4),
			_Utils_Tuple2(6, -3),
			_Utils_Tuple2(6, -2),
			_Utils_Tuple2(6, 2),
			_Utils_Tuple2(6, 3),
			_Utils_Tuple2(6, 4)
		]));
var $rtfeldman$elm_css$Css$PxUnits = 0;
var $rtfeldman$elm_css$Css$px = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'px');
var $rtfeldman$elm_css$Css$relative = {aC: 0, D: 'relative'};
var $elm$core$List$filter = F2(
	function (isGood, list) {
		return A3(
			$elm$core$List$foldr,
			F2(
				function (x, xs) {
					return isGood(x) ? A2($elm$core$List$cons, x, xs) : xs;
				}),
			_List_Nil,
			list);
	});
var $rtfeldman$elm_css$Svg$Styled$Attributes$height = $rtfeldman$elm_css$VirtualDom$Styled$attribute('height');
var $author$project$Extra$GameOfLife$RenderBoard$inBounds = function (_v0) {
	var x = _v0.a;
	var y = _v0.b;
	return (0 <= x) && ((x < 100) && ((0 <= y) && (y < 50)));
};
var $rtfeldman$elm_css$Svg$Styled$rect = $rtfeldman$elm_css$Svg$Styled$node('rect');
var $author$project$Extra$GameOfLife$RenderBoard$renderCell = function (_v0) {
	var xPos = _v0.a;
	var yPos = _v0.b;
	return A2(
		$rtfeldman$elm_css$Svg$Styled$rect,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Svg$Styled$Attributes$x(
				$elm$core$String$fromInt(xPos) + '.5%'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$y(
				$elm$core$String$fromInt((2 * yPos) + 1) + '%'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$height('0.15em'),
				$rtfeldman$elm_css$Svg$Styled$Attributes$width('0.15em')
			]),
		_List_Nil);
};
var $author$project$Extra$GameOfLife$RenderBoard$renderBoard = A2(
	$elm$core$Basics$composeL,
	A2(
		$elm$core$Basics$composeL,
		A2(
			$elm$core$Basics$composeL,
			$rtfeldman$elm_css$Svg$Styled$svg(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Svg$Styled$Attributes$width('100%'),
						$rtfeldman$elm_css$Svg$Styled$Attributes$height('100%')
					])),
			$elm$core$List$map($author$project$Extra$GameOfLife$RenderBoard$renderCell)),
		$elm$core$List$filter($author$project$Extra$GameOfLife$RenderBoard$inBounds)),
	$elm$core$Set$toList);
var $rtfeldman$elm_css$Html$Styled$button = $rtfeldman$elm_css$Html$Styled$node('button');
var $elm$virtual_dom$VirtualDom$Normal = function (a) {
	return {$: 0, a: a};
};
var $elm$virtual_dom$VirtualDom$on = _VirtualDom_on;
var $rtfeldman$elm_css$VirtualDom$Styled$on = F2(
	function (eventName, handler) {
		return A3(
			$rtfeldman$elm_css$VirtualDom$Styled$Attribute,
			A2($elm$virtual_dom$VirtualDom$on, eventName, handler),
			false,
			'');
	});
var $rtfeldman$elm_css$Html$Styled$Events$on = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$Normal(decoder));
	});
var $rtfeldman$elm_css$Html$Styled$Events$onClick = function (msg) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$on,
		'click',
		$elm$json$Json$Decode$succeed(msg));
};
var $author$project$Extra$GameOfLife$App$selectorButton = F2(
	function (msg, description) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$button,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Events$onClick(msg)
				]),
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$text(description)
				]));
	});
var $rtfeldman$elm_css$Css$wrap = {ax: 0, aN: 0, D: 'wrap'};
var $author$project$Extra$GameOfLife$App$view = function (b) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$div,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$width(
						$rtfeldman$elm_css$Css$pct(100)),
						$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$relative)
					])),
				A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'aspect-ratio', '2/1')
			]),
		_List_fromArray(
			[
				$author$project$Extra$GameOfLife$RenderBoard$renderBoard(b),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$position($rtfeldman$elm_css$Css$absolute),
								$rtfeldman$elm_css$Css$bottom(
								$rtfeldman$elm_css$Css$px(0)),
								$rtfeldman$elm_css$Css$width(
								$rtfeldman$elm_css$Css$pct(100)),
								$rtfeldman$elm_css$Css$displayFlex,
								$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
								$rtfeldman$elm_css$Css$flexWrap($rtfeldman$elm_css$Css$wrap)
							]))
					]),
				_List_fromArray(
					[
						A2(
						$author$project$Extra$GameOfLife$App$selectorButton,
						$author$project$Sitewide$Types$LoadBoard(
							A3($author$project$Extra$GameOfLife$App$offset, 50, 20, $author$project$Extra$GameOfLife$ExampleBoards$glider)),
						'Glider'),
						A2(
						$author$project$Extra$GameOfLife$App$selectorButton,
						$author$project$Sitewide$Types$LoadBoard(
							A3($author$project$Extra$GameOfLife$App$offset, 50, 20, $author$project$Extra$GameOfLife$ExampleBoards$pulsar)),
						'Pulsar'),
						A2(
						$author$project$Extra$GameOfLife$App$selectorButton,
						$author$project$Sitewide$Types$LoadBoard(
							A3($author$project$Extra$GameOfLife$App$offset, 50, 20, $author$project$Extra$GameOfLife$ExampleBoards$methuselah)),
						'Methuselah'),
						A2(
						$author$project$Extra$GameOfLife$App$selectorButton,
						$author$project$Sitewide$Types$LoadBoard(
							A3($author$project$Extra$GameOfLife$App$offset, 50, 20, $author$project$Extra$GameOfLife$ExampleBoards$gliderGun)),
						'Glider Gun')
					]))
			]));
};
var $author$project$Pages$GameOfLife$page = {
	c1: $author$project$Extra$GameOfLife$App$update,
	c4: function (model) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('Better Living Through Sets'),
					$author$project$Pages$GameOfLife$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Lists are THE most overrated data type bar none. Who has '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('ever')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' needed an ordered sequence of values with duplication? Not me. Lists are such a ridiculous data structure that no one can even agree how they should be built. A collection of cons cells? A block of contiguous memory? Do we index into them with pointers? Do we iterate over them with folds? Are we really just using a queue or a stack? Lists are crazy.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Nah. Sets are where it’s at.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The mathemeticians have known about sets for a long time, but until recently (within the last 100 years!) programmers didn’t have access to them. Now we do but they remain woefully underutilized. But start looking around and you’ll see that sets are way better than lists for every conceivable application.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('To prove it to ya we are gon’ be implementing Conway’s Game of Life today. But we are going to be doing it with sets like civilized men and not lists like so many pagans. Because we use a real datatype we won’t have to worry about boundary conditions, we will have a compact core ruleset, cool diagrams will be easy to draw to explain what is going on, the implementation will naturally be sparse, and all will be right in the eyes of the Lord.')
						])),
					$author$project$Extra$GameOfLife$App$view(model.a4),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The Game Itself')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The game of life is a simple cellular automaton. It is played out on an infinite grid of cells that are either \"'),
							$rtfeldman$elm_css$Html$Styled$text('alive'),
							$rtfeldman$elm_css$Html$Styled$text('\" or \"'),
							$rtfeldman$elm_css$Html$Styled$text('dead'),
							$rtfeldman$elm_css$Html$Styled$text('\" with rules for updating this grid. In order for a cell to be alive, it must either')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$ol,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Have exactly three living neighbors')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Have two or three living neighbors and have been alive in the previous timestep.')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('By repeatedly applying the update rule to some initial grid you can observe all sorts of interesting behavior. People have developed initial patterns that explode in complexity, act like factories, fly across the grid, or even simulate entire computers. The game of life is in fact turing complete if that phrase is meaningful to you.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The implementation')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('What is so remarkable about the game of life, the reason it has captured the imagination of so many computer scientists and mathematicians, is how this extremely simple ruleset gives rise to incredibly complex behavior. But even if it seems simple in theory, how can one express these rules simply in practice?')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The heart of the trick is in how the grid is represented programmatically. It is tempting to use a two dimensional array to represent the grid, but this results in extra complexity at the boundary of the array. The true game of life is played on an infinite grid, so using a finite representation of the grid forces the implementation to either 1) resize the grid which involves complexity not found in the basic semantics of the game or 2) come up with boundary conditions, like cell death or a toroidal topology, that change the semantics of the game entirely.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So instead of using a two dimensional array for the grid representation, we use a set containing the coordinates of all the living cells. With a point-set representation of the grid we have dealt with the problem of grid boundaries. But we have also translated the problem into a form which can almost entirely be calculated using elementary set operations. In principle we have also found a format that allows for huge efficiency gains by reducing the number of cells we have to check for updates, though to exploit this last point would require work that I deem beneath me.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('At a high level the algorithm for the point-set representation looks like this')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$ol,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Identify which cells need to be checked for updates. Because the game of life rules only operate on cells which are alive or have living neighbors this amounts to finding all the cells which are alive or have living neighbors.')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('For each cell identified in step 1, determine the next state of the cell. This requires counting up all living neighbors (which requires finding all living neighbors) and then applying the update rules based on this count.')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And that is all. So lets get down to raw code.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('(This implementation is in elm but the basic algorithm translates nicely to any language with proper support for sets. At the bottom I’ll have the full implementation of the update rule along with a link to the full source for the simulation above.)')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('First the data representation. The basic type here is the cell '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('type Cell = (Int,Int)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Boards are then represented as '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Set Cell')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. To check if a particular cell is alive or dead with respect to a given environment is implemented with set membership: '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cellIsAlive cell board = member cell board')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('For both step 1 and 2 in the algorithm we need a way to compute the neighbors of a cell. Visually, this is what we are computing:')
						])),
					$author$project$Extra$GameOfLife$Diagrams$nearDiagram,
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In code there are several ways to do this. The easiest method would be to use the cartesian product of two sets which would look like')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('near : Cell -> Set Cell\nnear (x,y) =\n    let adjacent1d n = fromList (range (n-1) (n+1))\n      in cartesianProduct (adjacent1d x) (adjacent1d y)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Which is very conceptually clean. Unfortunately elm sets don’t do cartesian products, and while we can implement them ourselves we can also just use the following modular arithmetic nonsense to achieve the same effect')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('near : Cell -> Set Cell\nnear ( x, y ) =\n    map\n      (\\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 ))\n      (fromList (range 0 8))')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Using this neighbors funtction we can easily find all the cells we need to check. We find the neighbors for each living cell in the current grid and then we take the set union of all these nighborhoods. Visually we are doing this')
						])),
					$author$project$Extra$GameOfLife$Diagrams$cellsToCheckDiagram,
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('while in code we are doing this')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cellsToCheck : Set Cell -> Set Cell\ncellsToCheck = foldl (near >> union) empty')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is doing a lot of functional programming stuff with folds and function composition and point free style which is all very impressive but in the end it just does what the diagram above is describing: go point by point, apply '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('near')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' to each point, take the n-way union of all the resulting neighborhoods.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Once we’ve got a list of cells to update we need a way to check if they will be alive at the next timestep. We do this by first finding all of a cells living neighbors, counting them, and applying the update rule. To get the living neighbors of a cell is naught but a string of set operations')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('neighbors : Set Cell -> Cell -> Set Cell\nneighbors board cell =\n    intersect board (diff (near cell) (singleton cell))')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('which visually corresponds to the following reduction')
						])),
					$author$project$Extra$GameOfLife$Diagrams$livingNeighborsDiagram,
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In words this is \"'),
							$rtfeldman$elm_css$Html$Styled$text('the set of all cells that are both in the board and in the neighborhood but are not the cell itself'),
							$rtfeldman$elm_css$Html$Styled$text('\". With this we can count up the number of neighbors and apply the update rule')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cellWillBeAlive : Set Cell -> Cell -> Bool\ncellWillBeAlive board cell =\n    let numberNearby = size (neighbors board cell)\n    in numberNearby == 3 || (numberNearby == 2 && member cell board)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And for our final act we weave the update rule together with the cells that need checking')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('update : Set Cell -> Set Cell\nupdate board = filter (cellWillBeAlive board) (cellsToCheck board)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and we are done!')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('To use it is simplicity itself. Write down all the coordinates of living cells for the board you’d like to represent and then hit go')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('initialBoard : Set Cell\ninitialBoard = fromList [ (1,1), (1,2), (2,1) ]\n\nnextBoard : Set Cell\nnextBoard = update initialBoard')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('nextBoard')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' will now be equal to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('fromList [ (1,1), (1,2), (2,1), (2,2) ]')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Victory')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So there we have it. The core rules for the game of life in less than thirty lines of code')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('module GameOfLife exposing (Cell, nextBoard)\n\nimport List exposing (range)\nimport Set exposing (..)\n\ntype alias Cell = (Int, Int)\n\nnear : Cell -> Set Cell\nnear ( x, y ) =\n    map\n      (\\n -> ( x - 1 + modBy 3 n, y - 1 + n // 3 ))\n      (fromList (range 0 8))\n\nneighbors : Set Cell -> Cell -> Set Cell\nneighbors board cell =\n    intersect board (diff (near cell) (singleton cell))\n\ncellWillBeAlive : Set Cell -> Cell -> Bool\ncellWillBeAlive board cell =\n    let numberNearby = size (neighbors board cell)\n    in numberNearby == 3 || (numberNearby == 2 && member cell board)\n\ncellsToCheck : Set Cell -> Set Cell\ncellsToCheck = foldl (near >> union) empty\n\nupdate : Set Cell -> Set Cell\nupdate board = filter (cellWillBeAlive board) (cellsToCheck board)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In order to make a cool interactive out of this we still need an event loop and some rendering code. This isn’t terribly hard to implement yourself but because I’m so generous I have a simple implementation '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('https://github.com/seanlucrussell/elm-life')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('hosted on Github')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In Conclusion')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The most important thing we all learned today is that arrays drool and sets rule.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But not just that. This is also a neat demonstration of how appropriate datastructure selection can greatly simplify and clarify the nature of a problem. By looking at living cells in the game of life as a set of grid coordinate we get a nice visual intuition for what the rules mean and how to implement them using predefined set operations. Choosing sets for the underlying datastructure also eliminated any boundary problems we might have had and provided us with a sparse, space efficient representation of the game for free.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('It is my opinion that sets are severely underutilized by programmers. A surprising number of situations, from storing command line options to understanding relational algebras (which in turn underly the design of SQL) or even for implementing the game of life, benefit from the judicious application of some simple set theory.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So if nothing else I hope this at least served as an amusing example of the applications of sets to programming.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And I hope this '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('sets')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' you up to think of sets next time you are programming.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('He. Hehehehe. Haaha. Ha.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Go sets.')
						]))
				]));
	}
};
var $author$project$Pages$RecursionSchemes$page = {
	c1: F2(
		function (_v0, model) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}),
	c4: function (_v1) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('Recursion Schemes Are The Answer'),
					$author$project$Pages$RecursionSchemes$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But what is the question?')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Since I’ve been learning about recursion schemes lately here is the version of recursion schemes that finally made sense to me. This leaves a lot of topics untouched, instead focusing on what I see as the core idea underlying the field. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('https://blog.sumtypeofway.com/posts/introduction-to-recursion-schemes.html')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('This series by Patrick Thomson')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is the most complete exposition about recursion schemes I have come across to date. And '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('https://jtobin.io/practical-recursion-schemes')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('this post by Jared Tobin')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' containing several practical examples of non-recursive recursive algorithms is what finally made the concept click for me.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Recursion schemes are all about removing recursion from datatypes and separating it out into standard recursive templates, \"'),
							$rtfeldman$elm_css$Html$Styled$text('schemes'),
							$rtfeldman$elm_css$Html$Styled$text('\" if you will, and reusing these schemes for every recursive datatype in existence.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But to ensure we are starting on solid ground let us be very clear what we mean by recursive datatypes by looking at a couple of the most common: linked lists and binary trees.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('A linked list is a recursive datatype. By recursive we mean that a linked list can be built up from smaller linked lists. The list '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('[1,2,3]')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is essentially the same as the first item, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('1')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', plus the rest of the list, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('[2,3]')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. The rest of the list can in turn be described as the first item ('),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('2')
								])),
							$rtfeldman$elm_css$Html$Styled$text(') and an even smaller list ('),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('[3]')
								])),
							$rtfeldman$elm_css$Html$Styled$text('), which is in turn a final item ('),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('3')
								])),
							$rtfeldman$elm_css$Html$Styled$text(') and the smallest possible list (the empty list '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('[]')
								])),
							$rtfeldman$elm_css$Html$Styled$text(').')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('When we say a datatype is recursive we mean it can be built up from smaller copies of itself. The standard definition of a list involves defining the empty list and an operation for adding an item to the front of a preexisting list. We call these operations Nil and Cons respectively because that is what people decided on sixty years ago with lisp and no-one understands what the lisp people are doing well enough to challenge them.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Binary trees are the same. A binary tree can be built from a single leaf containing a value or it can be built from a pair of smaller trees. As with the linked list, the creation of a tree may require the input of smaller trees.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('In Haskell syntax we’d write the linked list and tree definitions as '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data List a = Nil | Cons a (List a)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data Tree a = Leaf a | Node (Tree a) (Tree a)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' respectively.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So these types are recursive. Now that we know that let us do something silly. Lets see if we can make them non-recursive. Or at least as non-recursive as possible. And if you are asking why we’d do that right now I will kindly ask you to shut up and pretend like I haven’t lost my mind.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Our list is recursive only in the second argument to Cons. What if we just made that a type variable? Why? I told you to stop asking questions.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Turning the recursive call in Cons into a type variable leaves us with '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data List a f = Nil | Cons a f')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This seems totally useless but we can still technically create a list using this new type. See for example '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Cons 3 (Cons 1 Nil)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Beware that we have somewhat changed behavior. The type of '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Cons 3 (Cons 1 Nil)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', that is '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('List Int (List Int (List a f))')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is now different from the type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('(Cons 1 Nil)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', which is '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('List Int (List a f)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Not to mention we get weird typing behavior that lets us write lists of mixed type like '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Cons True (Cons 1 Nil)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' or even weird tree like structures like '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Cons (Cons 5 Nil) (Cons \"baking soda\" Nil)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So this is clearly less useful as a list than our original list. There may be some useful applications of it because this new type is in fact isomorphic to the type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Maybe (a,f)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' which isn’t an unreasonable type to see in the real world. But if types are changing based on the length of the list and we have hetrogeneous collections then we can’t fairly say we have a list as the word \"'),
							$rtfeldman$elm_css$Html$Styled$text('list'),
							$rtfeldman$elm_css$Html$Styled$text('\" is normally understood.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Clearly I haven’t gone quite insane enough for this to make sense. So here is another type: '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data Fix f = Fix (f (Fix f))')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. This one is recursive. But I think it’s the only recursive datatype we will need ever again.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I’m not going to elaborate on the reasoning behind the definition of this one. It was provided by divine providence as far as you are concerned. Lets just keep doing things like apply it to list datatype starting with the empty list constructor: '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix Nil')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' gets us the type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix (List a)')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. If we make the following function '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('newCons x l = Fix (Cons x l)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and inspect its type we will see it is of type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('a -> Fix (List a) -> Fix (List a)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' which, barring the bizarre addition of '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix')
								])),
							$rtfeldman$elm_css$Html$Styled$text(', is precisely the normal type signature for the Cons constructor. So '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix (Cons 3 (Fix Nil)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' will be of type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix (List Int)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and the type of a list no longer depends on the length of the list. And lists are back to being homogenous in the type of their contents.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Great! We’ve reinvented a normal list using an extremely confusing declaration, a few extra lines of code, and extra syntax interleaved in any list definition. To review, normally we’d write')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data List a = Nil | Cons a (List a)\n\nexampleList :: List String\nexampleList = Cons \"what\" (Cons \"is\" (Cons \"butter?\" Nil))')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('but with this exciting new paradigm we would write')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data List a f = Nil | Cons a f\ndata Fix f = Fix (f (Fix f))\n\nexampleList :: Fix (List String)\nexampleList = Fix (Cons \"what\" (Fix (Cons \"is\" (Fix (Cons \"butter?\" (Fix Nil))))))')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We have successfully made our program worse. Huzzah! That’s right, recursion schemes are just a fancy obfuscation tactic.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Actually, there is one way in which recursion schemes are better. Say we have this new fancy nonsense function that I’m not going to bother to explain as the purpose is obvious (this is called sarcasm)')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata :: Functor f => (f a -> a) -> Fix f -> a\ncata f = f . fmap (cata f) . unfix\n  where unfix :: Fix f -> f (Fix f)\n        unfix (Fix x) = x')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and since I’m just throwing things out there let’s also give our non-recursive list a functor instance')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('instance Functor (List a) where\n  fmap _ Nil = Nil\n  fmap f (Cons a b) = Cons a (f b)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and define a random function on our list type')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('sum :: List Int Int -> Int\nsum Nil = 0\nsum (Cons a b) = a + b')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Sequencing these things we can sum a list! Evaluating '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata sum (Fix (Cons 3 (Fix (Cons 4 (Fix Nil)))))')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' yields '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('7')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Very cool.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('For the recursive list type we could have of course written')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('sum :: List Int -> Int\nsum Nil = 0\nsum (Cons a b) = a + sum b')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is a good place to once again take the score. For the traditional list we have')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data List a = Nil | Cons a (List a)\n\nsum :: List Int -> Int\nsum Nil = 0\nsum (Cons a b) = a + sum b')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Weighing in at 5 lines of code this is all that is needed to define a list and the sum of a list. By contrast with our new fancy method using nonsense words we have')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data List a f = Nil | Cons a f\ndata Fix f = Fix (f (Fix f))\n\ncata :: Functor f => (f a -> a) -> Fix f -> a\ncata f = f . fmap (cata f) . unfix\n  where unfix :: Fix f -> f (Fix f)\n        unfix (Fix x) = x\n\ninstance Functor (List a) where\n  fmap _ Nil = Nil\n  fmap f (Cons a b) = Cons a (f b)\n\nsum :: Fix (List Int) -> Int\nsum = cata assistant\n  where assistant :: List Int Int -> Int\n        assistant Nil = 0\n        assistant (Cons a b) = a + b')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Summing up to 15 lines of code. We’ve managed to triple the length of code required to take the sum of a list for no perceptible benefit. Super rad.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But wait. There '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('is')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' a small, very small, very very '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('very')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' small way in which the second is better than the first. One section of the sum function is ever so slightly simpler, not requiring a recursive call to the tail of the list to evaluate the sum.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But the sum is a recursive operation is it not?')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('It is indeed. Packed away in the mystery function '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Functor')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' instance for '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('List a')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is all the recursion we need to implement the sum.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Ok, but we could totally just write a list fold for the normal list and factor out the recursion from the normal list sum. No need for all this nonsense.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Thats right. In fact that is essentially what we’ve done with the weird list. The function '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is a bizarre type of fold for our bizarre type of list.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Alright, time to actually do something cool with all this nonsense. Let’s make a tree type using our dumb recursion-factoring methodology and give it its functor instance:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data Tree a f = Leaf a | Branch f f\n\ninstance Functor (Tree a) where\n  fmap _ (Leaf x) = Leaf x\n  fmap f (Branch a b) = Branch (f a) (f b)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('If you play around with the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Tree a f')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' constructors for a while you’ll see they behave similarly to the weird linked list: the tree will have different types depending on the depth of the tree. Plus there is some new weird behavior only possible with trees: each branch needs to be of the same depth in order for the tree to type check.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But if you use the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' type, the same exact type we defined above, you’ll start getting a normal tree again! See '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix (Branch (Fix (Leaf \'f\')) (Fix (Branch (Fix (Leaf \'f\')) (Fix (Leaf \'f\')))))')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' for example: while this tree has mixed branches you can see it is of type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix (Tree Char)')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' in a Haskell interpreter. The same exact Fix type, when applied to our completely new weird Tree type, has resulted in something essentially identical to the ordinary Tree definition.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But this goes deeper. Let’s define a sum over our new Tree type')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('sum :: Fix (Tree Int) -> Int\nsum = cata assistant\n  where assistant :: Tree Int Int -> Int\n        assistant (Leaf x) = x\n        assistant (Branch a b) = a + b')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Once again we attain a recursion-free sum. Applying it to an example tree '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('sum (Fix (Branch (Fix (Leaf 4)) (Fix (Branch (Fix (Leaf 3)) (Fix (Leaf 2))))))')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' yields a result of '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('9')
								])),
							$rtfeldman$elm_css$Html$Styled$text('.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Bizarre. We still have a lot of boilerplate with all the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix')
								])),
							$rtfeldman$elm_css$Html$Styled$text('es interleaved through everything and the functor instance. But the Fix type and the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' function worked for both the tree and the linked list.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And now we approach the heart of the utility of recursion schemes. For ANY recursive datatype, and that means ANY, we can go through this simple procedure:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$ol,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Factor out the recursion')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Create a functor instance')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Apply the '),
									A2(
									$rtfeldman$elm_css$Html$Styled$code,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('cata')
										])),
									$rtfeldman$elm_css$Html$Styled$text(' function to iterate over it')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('This is all very mechanical. Functor instances can be derived with normal haskell. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' never changes. Factoring out recursion can be accomplished with template haskell. Humans don’t actually need to engage in any of this.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And then we can write fancy functions for much more sophisticated datatypes than the simple tree or list:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data Ring f\n    = Zero\n    | One\n    | Invert f\n    | Add f f\n    | Multiply f f\n    deriving (Functor)\n\nevaluate :: Fix Ring -> Int\nevaluate = cata assistant\n  where assistant :: Ring Int -> Int\n        assistant Zero = 0\n        assistant One = 1\n        assistant (Invert n) = -n\n        assistant (Add a b) = a + b\n        assistant (Multiply a b) = a * b')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('There we go. The '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('assistant')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' function here makes clear the essence of ring evaluation without any explicit recursion. I never had to write a fold anywhere (I’m using mathematical rings as a simple example of a domain specific language, don’t worry too much about what a ring is). Compare '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('assistant')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' to a hypothetical recursive ring evaluation')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('evaluate Ring -> Int\nevaluate Zero = 0\nevaluate One = 1\nevaluate (Invert n) = - (evaluate n)\nevaluate (Add a b) = (evaluate a) + (evaluate b)\nevaluate (Multiply a b) = (evaluate a) * (evaluate b)')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and see that, ignoring all the other mess we’ve made, the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('assistant')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' function is clearer. All the recursion in '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('assistant')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is implicit and the general notion is obvious.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('By the way all these functions I’ve been calling '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('assistant')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' are examples of what insiders call an F-Algebra, sometimes shortened to Algebra. It’s a fancy name for a very simple concept. Anything of type '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('f a -> a')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is an algebra. Complain to the mathematicians if this doesn’t seem obvious to you.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('There is likely one lingering thought you are having at this point. Sure, we can derive functor instances automatically. Sure, we can create non-recursive types automatically. Sure, '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' and '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' work for all functors. But dealing with This:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix (Multiply (Fix (Add (Fix Unit) (Fix Zero))) (Fix One))')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('where half of our datastructure is just calls to '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Fix')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' instead of This:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('Multiply (Add Unit Zero) One')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('is simply not going to work. Semantically they might behave the same. But programs are a means for humans and computers to communicate with each other and that first version is just '),
							A2(
							$rtfeldman$elm_css$Html$Styled$em,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('awful')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' for communicating with humans. So recursion schemes are useless after all.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Unless we can find a way to use them with normal data types.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And this is the final piece of the puzzle. Just like it is fairly straightforward to automatically derive the functionality to generate a non-recursive type from a recursive type it is also straightforward to generate the functions that convert between the fixpoint of the non-recursive type and the original recursive type. For our lists')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('data NormalList a\n    = NormalNil\n    | NormalCons a (NormalList a)\n\ndata WeirdList a f \n    = WeirdNil\n    | WeirdCons a f')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('that means we could auto-generate')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('from :: NormalList a -> Fix (WeirdList a)\nto :: Fix (WeirdList a) -> NormalList a')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and then use these functions to go back and forth between the real world and the upside-down world of recursion schemes. We can use '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' when it is simpler and we can use our ordinary datatype when we prefer.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Finally we are at the point where this is all actually worthwhile:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$ol,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('We write a recursive datatype as we normally would')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('We import a library for managing recursion schemes')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('The recursion schemes library generates the non-recursive variant of our datatype')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('The library also generates the conversion functions')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('It also generates the functor instances')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$li,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('We write almost no boilerplate, can use our types as God intended, but we can also jump over to mystery recursion land to perform dark magic')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And that is the secret to recursion schemes.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('To review. The essential concept to understand recursion schemes is to view it as an exploration of factoring out recursion from our datatypes. When we look deep enough we discover that there is a purely mechanical process for performing this factorization that allows us to write elegant, non-recursive code and then apply it recursively.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Library writers then go off and write things like the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('recursion-schemes')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' library that takes care of all this manual boiler plate for us so we get the best of both worlds; little incomprehensible nonsense code with all the power of recursion schemes.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h2,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Conclusion')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I hardly touched on what the recursion schemes really are. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is the only example provided in this article. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cata')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' is in fact short for catamorphism, and it turns out there are a number of different ways to recurse through a datatype so there are a number of different functions akin to the catamorhism. They all have wild and exotic names like the zygomorphism or the histomorphism but they each boil down to strategies, schemes if you will, to recurse over a recursive datatype.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('One particularly large weakness of recursion schemes is that they don’t deal elegantly with mutually recursive datatypes. At least not that I’ve been able to divine. This is a real problem for things like programming languages where you’ll often have mutually recursive datatypes like expressions and statements. There appears to be a number of attempts to expand recursion schemes to more flexible datatypes but it isn’t clear to me that there is a winner in this battle yet.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I hope that the main takeaway of this article has come across. For me the essence of recursion schemes is the answer to a question: \"'),
							$rtfeldman$elm_css$Html$Styled$text('What happens if we try to take away recursion from as much of a datatype as we possibly can?'),
							$rtfeldman$elm_css$Html$Styled$text('\". Recursion schemes are the answer. And the answer turns out to be pretty cool.')
						]))
				]));
	}
};
var $rtfeldman$elm_css$Svg$Styled$line = $rtfeldman$elm_css$Svg$Styled$node('line');
var $elm$core$Tuple$second = function (_v0) {
	var y = _v0.b;
	return y;
};
var $rtfeldman$elm_css$Svg$Styled$Attributes$x1 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('x1');
var $rtfeldman$elm_css$Svg$Styled$Attributes$x2 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('x2');
var $rtfeldman$elm_css$Svg$Styled$Attributes$y1 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('y1');
var $rtfeldman$elm_css$Svg$Styled$Attributes$y2 = $rtfeldman$elm_css$VirtualDom$Styled$attribute('y2');
var $author$project$Pages$Test$ln = F2(
	function (start, end) {
		return A2(
			$rtfeldman$elm_css$Svg$Styled$line,
			_List_fromArray(
				[
					$rtfeldman$elm_css$Svg$Styled$Attributes$x1(
					$elm$core$String$fromFloat(start.a)),
					$rtfeldman$elm_css$Svg$Styled$Attributes$y1(
					$elm$core$String$fromFloat(start.b)),
					$rtfeldman$elm_css$Svg$Styled$Attributes$x2(
					$elm$core$String$fromFloat(end.a)),
					$rtfeldman$elm_css$Svg$Styled$Attributes$y2(
					$elm$core$String$fromFloat(end.b)),
					$rtfeldman$elm_css$Svg$Styled$Attributes$stroke('black'),
					$rtfeldman$elm_css$Svg$Styled$Attributes$strokeWidth('0.1')
				]),
			_List_Nil);
	});
var $author$project$Pages$Test$lln = F3(
	function (sx, sy, len) {
		return A2(
			$author$project$Pages$Test$ln,
			_Utils_Tuple2(sx, sy),
			_Utils_Tuple2(sx - len, sy + len));
	});
var $author$project$Pages$Test$rln = F3(
	function (sx, sy, len) {
		return A2(
			$author$project$Pages$Test$ln,
			_Utils_Tuple2(sx, sy),
			_Utils_Tuple2(sx + len, sy + len));
	});
var $author$project$Pages$Test$drawTree = F4(
	function (tree, len, x, y) {
		if (!tree.$) {
			return _List_Nil;
		} else {
			var l = tree.a;
			var r = tree.b;
			return _Utils_ap(
				_List_fromArray(
					[
						A3($author$project$Pages$Test$rln, x, y, len),
						A3($author$project$Pages$Test$lln, x, y, len)
					]),
				_Utils_ap(
					A4($author$project$Pages$Test$drawTree, l, len * 0.4, x - len, y + len),
					A4($author$project$Pages$Test$drawTree, r, len * 0.4, x + len, y + len)));
		}
	});
var $author$project$Pages$Test$add = F2(
	function (n, m) {
		var _v0 = _Utils_Tuple2(n, m);
		var _v1 = _v0.a;
		var a = _v1.a;
		var b = _v1.b;
		var _v2 = _v0.b;
		var c = _v2.a;
		var d = _v2.b;
		return _Utils_Tuple2(a + c, b + d);
	});
var $elm$core$Basics$pow = _Basics_pow;
var $elm$core$List$drop = F2(
	function (n, list) {
		drop:
		while (true) {
			if (n <= 0) {
				return list;
			} else {
				if (!list.b) {
					return list;
				} else {
					var x = list.a;
					var xs = list.b;
					var $temp$n = n - 1,
						$temp$list = xs;
					n = $temp$n;
					list = $temp$list;
					continue drop;
				}
			}
		}
	});
var $author$project$Pages$Test$rotateList = function (n) {
	return A2(
		$elm$core$Basics$composeR,
		$elm$core$List$drop(n),
		$elm$core$List$head);
};
var $author$project$Pages$Test$evolve = function (ls) {
	var theta = 0.003;
	return $author$project$Pages$Test$normalize(
		A2(
			$elm$core$List$map,
			function (i) {
				return A3(
					$elm$core$List$foldl,
					$author$project$Pages$Test$add,
					_Utils_Tuple2(0, 0),
					A3(
						$elm$core$List$map2,
						F2(
							function (j, v) {
								return A2(
									$author$project$Pages$Test$mult,
									A2(
										$elm$core$Maybe$withDefault,
										_Utils_Tuple2(0, 0),
										A2(
											$author$project$Pages$Test$rotateList,
											A2(
												$elm$core$Basics$modBy,
												$elm$core$List$length(ls),
												i + j),
											ls)),
									v);
							}),
						A2(
							$elm$core$List$map,
							(!A2($elm$core$Basics$modBy, 2, i)) ? $elm$core$Basics$identity : $elm$core$Basics$negate,
							_List_fromArray(
								[-1, 0, 1, 2])),
						_List_fromArray(
							[
								_Utils_Tuple2(
								0,
								$elm$core$Basics$sin(2 * theta) / 2),
								_Utils_Tuple2(
								A2(
									$elm$core$Basics$pow,
									$elm$core$Basics$cos(theta),
									2),
								0),
								_Utils_Tuple2(
								0,
								$elm$core$Basics$sin(2 * theta) / 2),
								_Utils_Tuple2(
								-A2(
									$elm$core$Basics$pow,
									$elm$core$Basics$sin(theta),
									2),
								0)
							])));
			},
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(ls) - 1)));
};
var $author$project$Pages$Test$B = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $author$project$Pages$Test$L = {$: 0};
var $author$project$Pages$Test$numToTree = function (n) {
	switch (n) {
		case 0:
			return $author$project$Pages$Test$L;
		case 1:
			return A2($author$project$Pages$Test$B, $author$project$Pages$Test$L, $author$project$Pages$Test$L);
		default:
			return A2(
				$author$project$Pages$Test$B,
				$author$project$Pages$Test$numToTree(n - 1),
				$author$project$Pages$Test$numToTree(n - 2));
	}
};
var $rtfeldman$elm_css$Svg$Styled$Attributes$fill = $rtfeldman$elm_css$VirtualDom$Styled$attribute('fill');
var $author$project$Pages$Test$cvis = F2(
	function (n, coords) {
		var d = 8;
		var ampVisualStrength = 5 * $author$project$Pages$Test$amplitude(n);
		var _v0 = _Utils_Tuple2(n, coords);
		var _v1 = _v0.a;
		var a = _v1.a;
		var b = _v1.b;
		var _v2 = _v0.b;
		var x = _v2.a;
		var y = _v2.b;
		return _List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Svg$Styled$g,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Svg$Styled$Attributes$transform(
						'translate(' + ($elm$core$String$fromFloat(x) + (' ' + ($elm$core$String$fromFloat(y) + (') scale(' + ($elm$core$String$fromFloat(ampVisualStrength) + ')'))))))
					]),
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Svg$Styled$circle,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Svg$Styled$Attributes$cx('0'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$cy('0'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$r(
								$elm$core$String$fromFloat(d)),
								$rtfeldman$elm_css$Svg$Styled$Attributes$stroke('black'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$fill('none'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$strokeWidth('0.1')
							]),
						_List_Nil),
						A2(
						$rtfeldman$elm_css$Svg$Styled$circle,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Svg$Styled$Attributes$cx('0'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$cy('0'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$r(
								$elm$core$String$fromFloat(d / 4))
							]),
						_List_Nil),
						A2(
						$rtfeldman$elm_css$Svg$Styled$line,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Svg$Styled$Attributes$x1('0'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$y1('0'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$x2(
								$elm$core$String$fromFloat(
									(d * a) / $author$project$Pages$Test$amplitude(n))),
								$rtfeldman$elm_css$Svg$Styled$Attributes$y2(
								$elm$core$String$fromFloat(
									(d * b) / $author$project$Pages$Test$amplitude(n))),
								$rtfeldman$elm_css$Svg$Styled$Attributes$stroke('black'),
								$rtfeldman$elm_css$Svg$Styled$Attributes$strokeWidth('1')
							]),
						_List_Nil)
					]))
			]);
	});
var $author$project$Pages$Test$plotComplexGrid = function (numbers) {
	var spacing = 5;
	return $elm$core$List$concat(
		A3(
			$elm$core$List$map2,
			F2(
				function (i, n) {
					return A2(
						$author$project$Pages$Test$cvis,
						n,
						_Utils_Tuple2(
							(50 - ((spacing / 2) * ($elm$core$List$length(numbers) - 1))) + (i * spacing),
							50));
				}),
			A2(
				$elm$core$List$range,
				0,
				$elm$core$List$length(numbers) - 1),
			numbers));
};
var $author$project$Pages$Test$repeat = F3(
	function (n, f, x) {
		repeat:
		while (true) {
			if (!n) {
				return x;
			} else {
				var $temp$n = n - 1,
					$temp$f = f,
					$temp$x = f(x);
				n = $temp$n;
				f = $temp$f;
				x = $temp$x;
				continue repeat;
			}
		}
	});
var $author$project$Pages$Test$circleCoordinateMap = F3(
	function (scale, m, n) {
		var angle = ((2 * $elm$core$Basics$pi) * n) / m;
		return _Utils_Tuple2(
			50 + (scale * $elm$core$Basics$cos(angle)),
			50 - (scale * $elm$core$Basics$sin(angle)));
	});
var $author$project$Pages$Test$cartesianProduct = F2(
	function (la, lb) {
		return A2(
			$elm$core$List$concatMap,
			function (x) {
				return A2(
					$elm$core$List$map,
					function (y) {
						return _Utils_Tuple2(x, y);
					},
					lb);
			},
			la);
	});
var $author$project$Pages$Test$drawGraph = F3(
	function (vertexIterator, vertexRenderer, edgeRenderer) {
		return _Utils_ap(
			A2($elm$core$List$concatMap, vertexRenderer, vertexIterator),
			A2(
				$elm$core$List$concatMap,
				function (_v0) {
					var start = _v0.a;
					var end = _v0.b;
					return A2(edgeRenderer, start, end);
				},
				A2($author$project$Pages$Test$cartesianProduct, vertexIterator, vertexIterator)));
	});
var $author$project$Pages$Test$renderEdge = F4(
	function (graphIndicator, coordinateMap, startVertex, endVertex) {
		return A2(graphIndicator, startVertex, endVertex) ? _List_fromArray(
			[
				A2(
				$author$project$Pages$Test$ln,
				coordinateMap(startVertex),
				coordinateMap(endVertex))
			]) : _List_Nil;
	});
var $author$project$Pages$Test$testIndicator = F2(
	function (x, y) {
		return !A2($elm$core$Basics$modBy, x, y);
	});
var $rtfeldman$elm_css$Svg$Styled$Attributes$style = $rtfeldman$elm_css$VirtualDom$Styled$attribute('style');
var $author$project$Pages$Test$testVertexRenderer = F2(
	function (coordinateMap, n) {
		return _List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Svg$Styled$text_,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Svg$Styled$Attributes$x(
						$elm$core$String$fromFloat(
							coordinateMap(n).a)),
						$rtfeldman$elm_css$Svg$Styled$Attributes$y(
						$elm$core$String$fromFloat(
							coordinateMap(n).b)),
						$rtfeldman$elm_css$Svg$Styled$Attributes$textAnchor('middle'),
						$rtfeldman$elm_css$Svg$Styled$Attributes$style('font-size: 1.3')
					]),
				_List_fromArray(
					[
						$rtfeldman$elm_css$Svg$Styled$text(
						$elm$core$String$fromInt(n))
					]))
			]);
	});
var $author$project$Pages$Test$sampleGraphic = function () {
	var top = 50;
	return A3(
		$author$project$Pages$Test$drawGraph,
		A2($elm$core$List$range, 2, top),
		$author$project$Pages$Test$testVertexRenderer(
			A2($author$project$Pages$Test$circleCoordinateMap, 47, top - 1)),
		A2(
			$author$project$Pages$Test$renderEdge,
			$author$project$Pages$Test$testIndicator,
			A2($author$project$Pages$Test$circleCoordinateMap, 45, top - 1)));
}();
var $author$project$Pages$Test$sampleGraphic2 = function () {
	var top = 150;
	return A3(
		$author$project$Pages$Test$drawGraph,
		A2($elm$core$List$range, 2, 3 * top),
		$author$project$Pages$Test$testVertexRenderer(
			A2($author$project$Pages$Test$circleCoordinateMap, 47, top - 1)),
		A2(
			$author$project$Pages$Test$renderEdge,
			$author$project$Pages$Test$testIndicator,
			A2($author$project$Pages$Test$circleCoordinateMap, 49, top - 1)));
}();
var $author$project$Pages$Test$coordinatesList = _List_fromArray(
	[
		_Utils_Tuple2(55, 23),
		_Utils_Tuple2(43, 12),
		_Utils_Tuple2(93, 23),
		_Utils_Tuple2(77, 77),
		_Utils_Tuple2(54, 45)
	]);
var $author$project$Pages$Test$indices = A2(
	$elm$core$List$range,
	0,
	$elm$core$List$length($author$project$Pages$Test$coordinatesList));
var $author$project$Pages$Test$allNodePairs = A2(
	$elm$core$List$concatMap,
	function (x) {
		return A2(
			$elm$core$List$map,
			function (y) {
				return _Utils_Tuple2(x, y);
			},
			$author$project$Pages$Test$indices);
	},
	$author$project$Pages$Test$indices);
var $author$project$Pages$Test$connectionsList = _List_fromArray(
	[
		_List_fromArray(
		[1, 0]),
		_List_fromArray(
		[1, 4]),
		_List_fromArray(
		[2, 4]),
		_List_fromArray(
		[1, 2]),
		_List_fromArray(
		[3, 4]),
		_List_fromArray(
		[1, 3])
	]);
var $elm$core$List$member = F2(
	function (x, xs) {
		return A2(
			$elm$core$List$any,
			function (a) {
				return _Utils_eq(a, x);
			},
			xs);
	});
var $author$project$Pages$Test$connected = F2(
	function (n, m) {
		return A2(
			$elm$core$List$member,
			$elm$core$Set$fromList(
				_List_fromArray(
					[n, m])),
			A2($elm$core$List$map, $elm$core$Set$fromList, $author$project$Pages$Test$connectionsList));
	});
var $author$project$Pages$Test$allConnections = A2(
	$elm$core$List$filter,
	function (_v0) {
		var x = _v0.a;
		var y = _v0.b;
		return A2($author$project$Pages$Test$connected, x, y);
	},
	$author$project$Pages$Test$allNodePairs);
var $author$project$Pages$Test$coordinates = function (n) {
	return A2(
		$elm$core$Maybe$withDefault,
		_Utils_Tuple2(0, 0),
		$elm$core$List$head(
			A2($elm$core$List$drop, n, $author$project$Pages$Test$coordinatesList)));
};
var $author$project$Pages$Test$drawConnection = F2(
	function (start, end) {
		return A2(
			$author$project$Pages$Test$ln,
			$author$project$Pages$Test$coordinates(start),
			$author$project$Pages$Test$coordinates(end));
	});
var $author$project$Pages$Test$viewNetwork = A2(
	$rtfeldman$elm_css$Svg$Styled$svg,
	_List_fromArray(
		[
			$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 100 100')
		]),
	A2(
		$elm$core$List$map,
		function (_v0) {
			var x = _v0.a;
			var y = _v0.b;
			return A2($author$project$Pages$Test$drawConnection, x, y);
		},
		$author$project$Pages$Test$allConnections));
var $author$project$Pages$Test$page = {
	c1: F2(
		function (msg, b) {
			if (msg.$ === 8) {
				return _Utils_Tuple2(
					_Utils_update(
						b,
						{
							bf: A3($author$project$Pages$Test$repeat, 50, $author$project$Pages$Test$evolve, b.bf)
						}),
					$elm$core$Platform$Cmd$none);
			} else {
				return _Utils_Tuple2(b, $elm$core$Platform$Cmd$none);
			}
		}),
	c4: function (model) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$div,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Svg$Styled$svg,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 100 100')
						]),
					$author$project$Pages$Test$plotComplexGrid(model.bf)),
					A2(
					$rtfeldman$elm_css$Svg$Styled$svg,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 100 100')
						]),
					$author$project$Pages$Test$sampleGraphic),
					A2(
					$rtfeldman$elm_css$Svg$Styled$svg,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 100 100')
						]),
					$author$project$Pages$Test$sampleGraphic2),
					$author$project$Pages$Test$viewNetwork,
					A2(
					$rtfeldman$elm_css$Svg$Styled$svg,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Svg$Styled$Attributes$viewBox('0 0 100 100')
						]),
					A4(
						$author$project$Pages$Test$drawTree,
						$author$project$Pages$Test$numToTree(14),
						25,
						50,
						20))
				]));
	}
};
var $rtfeldman$elm_css$Html$Styled$Attributes$alt = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('alt');
var $rtfeldman$elm_css$Html$Styled$img = $rtfeldman$elm_css$Html$Styled$node('img');
var $rtfeldman$elm_css$Html$Styled$Attributes$src = function (url) {
	return A2($rtfeldman$elm_css$Html$Styled$Attributes$stringProperty, 'src', url);
};
var $author$project$Pages$TheGutsOfGit$page = {
	c1: F2(
		function (_v0, model) {
			return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
		}),
	c4: function (_v1) {
		return A2(
			$rtfeldman$elm_css$Html$Styled$article,
			_List_Nil,
			_List_fromArray(
				[
					A2(
					$author$project$Components$blogHeading,
					$rtfeldman$elm_css$Html$Styled$text('The Guts of Git'),
					$author$project$Pages$TheGutsOfGit$article.b_),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('During the renaissance it became popular for great artists to dissect human corpses. Michelangelo and da Vinci both took part in the dissecting of man. Art requires an intimate knowledge of the subject in order to faithfully reproduce it, and there aren’t many better ways to understand something than by taking it apart.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So it is with software. Today we are gonna be tearing out the guts of git and looking at them for ourselves so we may too become like the masters.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The Content Database')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('At the very core of git is a content addressed database (or filesystem, or memory, or whatever). I’m going to be calling this a CAD. To understand what is going on with git it is really important to understand what a content addressed database is. Fortunately they are pretty simple.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('First lets look at what \"'),
							$rtfeldman$elm_css$Html$Styled$text('Content'),
							$rtfeldman$elm_css$Html$Styled$text('\" means. This is simple. The content in a content addressed database is literally any kind of data. Just a sequence of 1’s and 0’s. Any pile of bits will do.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So what does it mean to address content? If I address you, that means I’ve said your name or provided some other indication, some identifier, that it is you I’m addressing. I’m talkin to ya. An address is just a unique way of identifying something. Address books uniquely identify houses. Etc.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('So if content is a sequence of 1’s and 0’s, the address of some content is a unique way of referring to that data. In what manner might we accomplish that? Hashes! Any sort of hash will do as long as it satisfies all the properties of a good hashing function but for our purposes lets use the sha1 hash.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The database part simply means we have a method for finding content based on its hash.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Alright so we have a lookup table that correlates hashes with data. This has some nice properties.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('First, we don’t have to trust the database for data integrity. When we request some data from the database and we get the data back we can run our hashing algorithm against the hash we had stored and check if they match. So content addressed memory doesn’t require any trust between the client and the server. Except maybe that the client will desire that the server doesn’t delete their data. So maybe a bit of trust.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('It also means that data is immutable in the database. The store is extremely simple, supporting only two operations. Add a blob of data and retrieve a blob of data by hash. There are no mutation operations here.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Of course it is so simple that figuring out how to use a CAD appropriately takes some work. But git shows us how.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('What is git used for?')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Ok so real quick aside: we need to remember what the essential purpose of git is. What operations do we want it to support? Because that all determines how git can work with a CAD.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The real essence of a version control system (VCS, how many acronyms can we pack in this essay?) is it should allow us to look back into the history of a project, see how the new version differs from whatever past versions we have, let us revert to previous versions of our codebase, and ideally allow us to work nicely with others.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('A big part of this means that a VCS is about recreating snapshots for different moments in history of our project. This is actually super simple in theory: we could copy EVERYTHING in a project whenever we take a snapshot and save it to a tarball or something and tag the tarball with the previous version and some note to let us know what the tarball meant. Then to retrieve previous versions we can unpack the tarball and voila we have the previous version. But that is really inefficient especially when we want to make small changes at a time. So the trick to building a good version control system is to make these snapshots efficient while still allowing one to construct the entire state of the repo.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Proof')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('One more aside: if you want to follow along you can look into the guts with the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cat-file')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' command; this one lists all the objects in a repo along with their types')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('git cat-file --batch-check --batch-all-objects')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('and this one grabs a file by hash')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('git cat-file -p $HASH')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I’d encourage you to experiment with these for a bit. Run the first command to list all the objects in the repo of some project you are familiar with. Then take one of those objects at random and run its hash through the second command. Look for patterns.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('You can also sort of see the structure of the repo by looking in '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('.git/objects/')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' but I recommend using the '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('cat-file')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' command because otherwise you’ll have to look at compressed objects in packfiles and their indexes and some other nonsense.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Blobs, Trees, and Commits')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Git uses its CAD for 3 types of objects. Remember we are keeping things simple here so we aren’t using 3 separate CADs, one for each type of object. Everything goes into the one CAD.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Commits are a snapshot of a repo. From a commit you should be able to recreate the ENTIRE state of the project at that point in time. In addition to the data needed to reconstruct the state of the repo at a moment in time commits include information on the history of the project up until that commit by referencing parent commits (a single commit can reference multiple parents; this happens in the case of a merge. Or none in the case of the initial commit). And commits have a little bit of data that is useful like commit author and message (and committer, which is almost never distinct from commit author). A sample:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('tree 8d69b7df5fa3bb43671f9cf34e3674dec4fad311\nparent 13d7893577cedbceed7a364d050c11aa3cfea1ee\nauthor Ada Lovelace <alovlace@analytical.engine> 1674337023 -0700\ncommitter Ada Lovelace <alovlace@analytical.engine> 1674337023 -0700\n\nFinished translation of the algorithm to javascript.')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Btw I mentioned that a commit references one or more parents. How does it do this? Through the CAD! The commit holds a sha1 hash for each parent commit, so to look back in time you simply grab the parent sha1 address from the commit object and then look the parent up in the CAD. Repeat ad infinitum to go back to the big bang.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Ok so how can you \"'),
							$rtfeldman$elm_css$Html$Styled$text('reconstruct'),
							$rtfeldman$elm_css$Html$Styled$text('\" an entire project state from a commit? To do this you need ALL the data that may have been present; you need a full directory heirarchy.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The second type of object git stores in the CAD is just this: the tree type. A tree is simple; it is just a list of references to blobs (I’ll get there in a sec) and other trees, along with some permissions data and filenames. Imagine we had the following project structure:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('.\n├── README.md\n└── src\n   ├── engine-schematics.c\n   └── bernoulli-numbers.js')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('the corresponding tree would look something like')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('100644 blob c2226816b4eeaf4cd22bbca0b69d084dfc49c8af    README.md\n040000 tree 084f97465213fd702411f144fac54b13ff351430    src')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Wait theres only two things here? Nah just look at the src object, which can be retrieved from the CAD using its hash, and you’ll see something like')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('100644 blob a9340b122ae22ca82be607c6abc9fc35af57de33    engine-schematics.c\n100644 blob 9c63c22bf2335c96ab74fc41c549aefafa38253a    bernoulli-numbers.js')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Alright so commits point to previous commits and to trees. The trees can be used to reconstruct the entirety of a commit; or at least the filesystem layout at the time of commit.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And now for the simplest type of data in the git CAD: the blob. A blob can be ANYTHING, look inside a blob and you will simply see your source files.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('To recap. A commit is a repo snapshot. Commits link to previous commits and to a tree. The tree represents a directory. In each tree is a list of links to other trees and blobs along with the file name and permissions at time of commit. And a blob is any kind of data.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The creature in motion')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('I don’t think this description is complete without seeing how this all plays out when new files are committed. That should help tie up any loose ends about the reasoning for this design.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But before we do that we have to introduce one last concept: references.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('All the above works great but if you are just looking at a repo as a list of objects by hash you will have no idea what to do. A big project can get well beyond the thousands of objects in a repository; if you want the latest version of a project, or to try out an experimental branch, or to do anything else, where on earth should you start?')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('References provide the answer. These live outside the CAD; they are just files that hold the index (hash) of an object within the CAD. They are mostly used to know what the latest state for different branches are, though they are also used for things like tagging releases. '),
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('git show-ref')
								])),
							$rtfeldman$elm_css$Html$Styled$text(' lists all the references in a git repo along with the corresponding commit hashes.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And with an understanding of references we can now see what happens when we modify a file and commit the changes we’ve made. Lets use the previous example:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$pre,
					_List_Nil,
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$code,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('.\n├── README.md\n└── src\n    ├── engine-schematics.c\n    └── bernoulli-numbers.js')
								]))
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('To keep things simple let’s pretend like this is about to be only the second commit ever to this project. The current state of the repo will look something like this:')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$src('media/0-database-start.png'),
							$rtfeldman$elm_css$Html$Styled$Attributes$alt('Master ref links to initial commit, initial commit links to readme blob and src tree, src tree links to other two')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And with annotations so you can see what these different object types are')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$src('media/1-initial-database-labeled.png'),
							$rtfeldman$elm_css$Html$Styled$Attributes$alt('Annotated version of the same diagram')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We’ve made a change to the readme. So we add that to the CAD')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$src('media/2-add-new-readme.png'),
							$rtfeldman$elm_css$Html$Styled$Attributes$alt('same as above, but with new readme in green')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('But the new readme means we need a new tree')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$src('media/3-add-new-tree.png'),
							$rtfeldman$elm_css$Html$Styled$Attributes$alt('same as above, but new readme is darker green and we have a new tree in gree linking to new readme and old src')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('With the new tree we can add the new commit')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$src('media/4-new-commit-object.png'),
							$rtfeldman$elm_css$Html$Styled$Attributes$alt('same as above, but new tree is darker green and there is a new commit in green linking to tree and old commit')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('And finally update the reference')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$img,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$Attributes$src('media/5-modify-branch.png'),
							$rtfeldman$elm_css$Html$Styled$Attributes$alt('same as above, but new commit is darker green and the reference is yellow and now points to the new commit')
						]),
					_List_Nil),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('We are now done. The commit is done! We’ve updated our repo. We can always go back by finding the previous commit and restoring the tree.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Notice how the only thing that got modified was the reference. Everything else was just added to. Pretty neat.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Also notice that we added a completely new copy of the readme. It is a common misconception (that I held until like a week ago) that git stores file differences in order to save space. But it doesn’t (caveat needed: sometimes git will compress objects in the CAD into what are known as pack files, where it will use file diffs to save space. But this doesn’t change the basic semantics of the CAD itself).')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$h3,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Conclusion')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Git is built on top of a content addressed database. This database holds three kinds of objects: commits, trees, and blobs. Commits link to trees and previous commits. Trees link to trees and blob. References point to interesting commits.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('If you understand this summary then you should understand nearly everything there is to know about git. Most of the git documentation and commands should not only be understandable to you, but you should be able to nearly reproduce for yourself. Or at least imagine the implementation.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('The real reason I ended up writing about all this was because I was interested in the git CAD and ended up writing a little '),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('https://github.com/seanlucrussell/object-explorer')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('app to turn the objects in a git CAD into a website')
								])),
							$rtfeldman$elm_css$Html$Styled$text('. Since commits link to trees and trees link to trees and trees link to blobs and commits link to commits I figured the web would provide a nice way to explore a git repo.')
						])),
					A2(
					$rtfeldman$elm_css$Html$Styled$p,
					_List_Nil,
					_List_fromArray(
						[
							$rtfeldman$elm_css$Html$Styled$text('Just remember: the heart has four chambers, the spine has thirty three vertebrae, and git is built on a content addressed database. And you’ll do just fine.')
						]))
				]));
	}
};
var $author$project$Sitewide$Routes$staticPage = function (pageView) {
	return {
		c1: F2(
			function (_v0, model) {
				return _Utils_Tuple2(model, $elm$core$Platform$Cmd$none);
			}),
		c4: pageView
	};
};
var $author$project$Sitewide$Routes$urlMap = function (s) {
	switch (s) {
		case '/':
			return $author$project$Sitewide$Routes$staticPage(
				$elm$core$Basics$always($author$project$Pages$Navigation$navigationPage));
		case '/NAV':
			return $author$project$Sitewide$Routes$staticPage(
				$elm$core$Basics$always($author$project$Pages$Navigation$navigationPage));
		case '/GOG':
			return $author$project$Pages$TheGutsOfGit$page;
		case '/REC':
			return $author$project$Pages$RecursionSchemes$page;
		case '/LIFE':
			return $author$project$Pages$GameOfLife$page;
		case '/FNLINALG':
			return $author$project$Pages$FunctionalLinearAlgebra$page;
		case '/FNLINALGTYPED':
			return $author$project$Pages$FunctionalLinearAlgebraWithTypes$page;
		case '/FNLINALGMEMO':
			return $author$project$Pages$FunctionalLinearAlgebraMemoized$page;
		case '/DIYPTRNMATCH':
			return $author$project$Pages$DiyPatternMatching$page;
		case '/TEST':
			return $author$project$Pages$Test$page;
		default:
			return $author$project$Sitewide$Routes$staticPage(
				$elm$core$Basics$always($author$project$Pages$Missing$missing));
	}
};
var $author$project$Sitewide$Update$update = F2(
	function (message, model) {
		update:
		while (true) {
			switch (message.$) {
				case 2:
					var p = message.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cx: p}),
						A2($elm$browser$Browser$Navigation$pushUrl, model.cK, p));
				case 1:
					var url = message.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cx: url.bT}),
						$elm$core$Platform$Cmd$none);
				case 0:
					if (!message.a.$) {
						var url = message.a.a;
						var $temp$message = $author$project$Sitewide$Types$SelectPage(url.bT),
							$temp$model = model;
						message = $temp$message;
						model = $temp$model;
						continue update;
					} else {
						var url = message.a.a;
						return _Utils_Tuple2(
							model,
							$elm$browser$Browser$Navigation$load(url));
					}
				case 3:
					var t = message.a;
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cu: t}),
						$elm$core$Platform$Cmd$none);
				case 4:
					var _v1 = A2(
						$author$project$Sitewide$Update$commandInterpreter,
						model,
						A2($elm$core$String$map, $elm$core$Char$toUpper, model.cu));
					if (!_v1.$) {
						var cmd = _v1.a;
						var $temp$message = cmd,
							$temp$model = _Utils_update(
							model,
							{cu: ''});
						message = $temp$message;
						model = $temp$model;
						continue update;
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{cu: ''}),
							$elm$core$Platform$Cmd$none);
					}
				case 6:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{ct: !model.ct}),
						$elm$core$Platform$Cmd$none);
				case 7:
					return _Utils_Tuple2(
						_Utils_update(
							model,
							{cv: !model.cv}),
						$elm$core$Platform$Cmd$none);
				case 5:
					var t = message.a;
					if ((A2($author$project$Sitewide$Update$intervalCount, model.c$ + t, 100) - A2($author$project$Sitewide$Update$intervalCount, model.c$, 100)) >= 1) {
						var $temp$message = $author$project$Sitewide$Types$GameOfLifeStep,
							$temp$model = _Utils_update(
							model,
							{c$: model.c$ + t});
						message = $temp$message;
						model = $temp$model;
						continue update;
					} else {
						return _Utils_Tuple2(
							_Utils_update(
								model,
								{c$: model.c$ + t}),
							$elm$core$Platform$Cmd$none);
					}
				default:
					return A2(
						$author$project$Sitewide$Routes$urlMap(model.cx).c1,
						message,
						model);
			}
		}
	});
var $author$project$Sitewide$Init$init = F3(
	function (_v0, url, key) {
		return A2(
			$author$project$Sitewide$Update$update,
			$author$project$Sitewide$Types$UrlChange(url),
			{ct: false, cu: '', cv: false, cx: '/NAV', a4: $author$project$Extra$GameOfLife$App$initialBoard, cK: key, bf: $author$project$Pages$Test$initialComplexList, c$: 0});
	});
var $elm$browser$Browser$AnimationManager$Delta = function (a) {
	return {$: 1, a: a};
};
var $elm$browser$Browser$AnimationManager$State = F3(
	function (subs, request, oldTime) {
		return {a9: oldTime, b2: request, b9: subs};
	});
var $elm$browser$Browser$AnimationManager$init = $elm$core$Task$succeed(
	A3($elm$browser$Browser$AnimationManager$State, _List_Nil, $elm$core$Maybe$Nothing, 0));
var $elm$core$Process$kill = _Scheduler_kill;
var $elm$browser$Browser$AnimationManager$now = _Browser_now(0);
var $elm$browser$Browser$AnimationManager$rAF = _Browser_rAF(0);
var $elm$core$Platform$sendToSelf = _Platform_sendToSelf;
var $elm$core$Process$spawn = _Scheduler_spawn;
var $elm$browser$Browser$AnimationManager$onEffects = F3(
	function (router, subs, _v0) {
		var request = _v0.b2;
		var oldTime = _v0.a9;
		var _v1 = _Utils_Tuple2(request, subs);
		if (_v1.a.$ === 1) {
			if (!_v1.b.b) {
				var _v2 = _v1.a;
				return $elm$browser$Browser$AnimationManager$init;
			} else {
				var _v4 = _v1.a;
				return A2(
					$elm$core$Task$andThen,
					function (pid) {
						return A2(
							$elm$core$Task$andThen,
							function (time) {
								return $elm$core$Task$succeed(
									A3(
										$elm$browser$Browser$AnimationManager$State,
										subs,
										$elm$core$Maybe$Just(pid),
										time));
							},
							$elm$browser$Browser$AnimationManager$now);
					},
					$elm$core$Process$spawn(
						A2(
							$elm$core$Task$andThen,
							$elm$core$Platform$sendToSelf(router),
							$elm$browser$Browser$AnimationManager$rAF)));
			}
		} else {
			if (!_v1.b.b) {
				var pid = _v1.a.a;
				return A2(
					$elm$core$Task$andThen,
					function (_v3) {
						return $elm$browser$Browser$AnimationManager$init;
					},
					$elm$core$Process$kill(pid));
			} else {
				return $elm$core$Task$succeed(
					A3($elm$browser$Browser$AnimationManager$State, subs, request, oldTime));
			}
		}
	});
var $elm$browser$Browser$AnimationManager$onSelfMsg = F3(
	function (router, newTime, _v0) {
		var subs = _v0.b9;
		var oldTime = _v0.a9;
		var send = function (sub) {
			if (!sub.$) {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(
						$elm$time$Time$millisToPosix(newTime)));
			} else {
				var tagger = sub.a;
				return A2(
					$elm$core$Platform$sendToApp,
					router,
					tagger(newTime - oldTime));
			}
		};
		return A2(
			$elm$core$Task$andThen,
			function (pid) {
				return A2(
					$elm$core$Task$andThen,
					function (_v1) {
						return $elm$core$Task$succeed(
							A3(
								$elm$browser$Browser$AnimationManager$State,
								subs,
								$elm$core$Maybe$Just(pid),
								newTime));
					},
					$elm$core$Task$sequence(
						A2($elm$core$List$map, send, subs)));
			},
			$elm$core$Process$spawn(
				A2(
					$elm$core$Task$andThen,
					$elm$core$Platform$sendToSelf(router),
					$elm$browser$Browser$AnimationManager$rAF)));
	});
var $elm$browser$Browser$AnimationManager$Time = function (a) {
	return {$: 0, a: a};
};
var $elm$browser$Browser$AnimationManager$subMap = F2(
	function (func, sub) {
		if (!sub.$) {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Time(
				A2($elm$core$Basics$composeL, func, tagger));
		} else {
			var tagger = sub.a;
			return $elm$browser$Browser$AnimationManager$Delta(
				A2($elm$core$Basics$composeL, func, tagger));
		}
	});
_Platform_effectManagers['Browser.AnimationManager'] = _Platform_createManager($elm$browser$Browser$AnimationManager$init, $elm$browser$Browser$AnimationManager$onEffects, $elm$browser$Browser$AnimationManager$onSelfMsg, 0, $elm$browser$Browser$AnimationManager$subMap);
var $elm$browser$Browser$AnimationManager$subscription = _Platform_leaf('Browser.AnimationManager');
var $elm$browser$Browser$AnimationManager$onAnimationFrameDelta = function (tagger) {
	return $elm$browser$Browser$AnimationManager$subscription(
		$elm$browser$Browser$AnimationManager$Delta(tagger));
};
var $elm$browser$Browser$Events$onAnimationFrameDelta = $elm$browser$Browser$AnimationManager$onAnimationFrameDelta;
var $rtfeldman$elm_css$Css$alignItems = function (fn) {
	return A3(
		$rtfeldman$elm_css$Css$Internal$getOverloadedProperty,
		'alignItems',
		'align-items',
		fn($rtfeldman$elm_css$Css$Internal$lengthForOverloadedProperty));
};
var $rtfeldman$elm_css$Css$backgroundColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'background-color', c.D);
};
var $rtfeldman$elm_css$Css$borderColor = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'border-color', c.D);
};
var $rtfeldman$elm_css$Css$borderRadius = $rtfeldman$elm_css$Css$prop1('border-radius');
var $rtfeldman$elm_css$Css$borderStyle = $rtfeldman$elm_css$Css$prop1('border-style');
var $rtfeldman$elm_css$Css$borderWidth = $rtfeldman$elm_css$Css$prop1('border-width');
var $rtfeldman$elm_css$Css$dashed = {r: 0, V: 0, D: 'dashed'};
var $rtfeldman$elm_css$Css$Structure$Descendant = 3;
var $rtfeldman$elm_css$Css$Preprocess$NestSnippet = F2(
	function (a, b) {
		return {$: 2, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Global$descendants = $rtfeldman$elm_css$Css$Preprocess$NestSnippet(3);
var $rtfeldman$elm_css$Css$fontWeight = function (_v0) {
	var value = _v0.D;
	return A2($rtfeldman$elm_css$Css$property, 'font-weight', value);
};
var $rtfeldman$elm_css$Css$height = $rtfeldman$elm_css$Css$prop1('height');
var $rtfeldman$elm_css$Css$withPrecedingHash = function (str) {
	return A2($elm$core$String$startsWith, '#', str) ? str : A2($elm$core$String$cons, '#', str);
};
var $rtfeldman$elm_css$Css$erroneousHex = function (str) {
	return {
		au: 1,
		aw: 0,
		A: 0,
		az: 0,
		aD: 0,
		D: $rtfeldman$elm_css$Css$withPrecedingHash(str)
	};
};
var $rtfeldman$elm_hex$Hex$fromStringHelp = F3(
	function (position, chars, accumulated) {
		fromStringHelp:
		while (true) {
			if (!chars.b) {
				return $elm$core$Result$Ok(accumulated);
			} else {
				var _char = chars.a;
				var rest = chars.b;
				switch (_char) {
					case '0':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated;
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '1':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + A2($elm$core$Basics$pow, 16, position);
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '2':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (2 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '3':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (3 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '4':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (4 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '5':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (5 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '6':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (6 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '7':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (7 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '8':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (8 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case '9':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (9 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'a':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (10 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'b':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (11 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'c':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (12 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'd':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (13 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'e':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (14 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					case 'f':
						var $temp$position = position - 1,
							$temp$chars = rest,
							$temp$accumulated = accumulated + (15 * A2($elm$core$Basics$pow, 16, position));
						position = $temp$position;
						chars = $temp$chars;
						accumulated = $temp$accumulated;
						continue fromStringHelp;
					default:
						var nonHex = _char;
						return $elm$core$Result$Err(
							$elm$core$String$fromChar(nonHex) + ' is not a valid hexadecimal character.');
				}
			}
		}
	});
var $elm$core$Result$map = F2(
	function (func, ra) {
		if (!ra.$) {
			var a = ra.a;
			return $elm$core$Result$Ok(
				func(a));
		} else {
			var e = ra.a;
			return $elm$core$Result$Err(e);
		}
	});
var $elm$core$Result$mapError = F2(
	function (f, result) {
		if (!result.$) {
			var v = result.a;
			return $elm$core$Result$Ok(v);
		} else {
			var e = result.a;
			return $elm$core$Result$Err(
				f(e));
		}
	});
var $rtfeldman$elm_hex$Hex$fromString = function (str) {
	if ($elm$core$String$isEmpty(str)) {
		return $elm$core$Result$Err('Empty strings are not valid hexadecimal strings.');
	} else {
		var result = function () {
			if (A2($elm$core$String$startsWith, '-', str)) {
				var list = A2(
					$elm$core$Maybe$withDefault,
					_List_Nil,
					$elm$core$List$tail(
						$elm$core$String$toList(str)));
				return A2(
					$elm$core$Result$map,
					$elm$core$Basics$negate,
					A3(
						$rtfeldman$elm_hex$Hex$fromStringHelp,
						$elm$core$List$length(list) - 1,
						list,
						0));
			} else {
				return A3(
					$rtfeldman$elm_hex$Hex$fromStringHelp,
					$elm$core$String$length(str) - 1,
					$elm$core$String$toList(str),
					0);
			}
		}();
		var formatError = function (err) {
			return A2(
				$elm$core$String$join,
				' ',
				_List_fromArray(
					['\"' + (str + '\"'), 'is not a valid hexadecimal string because', err]));
		};
		return A2($elm$core$Result$mapError, formatError, result);
	}
};
var $elm$core$String$toLower = _String_toLower;
var $rtfeldman$elm_css$Css$validHex = F5(
	function (str, _v0, _v1, _v2, _v3) {
		var r1 = _v0.a;
		var r2 = _v0.b;
		var g1 = _v1.a;
		var g2 = _v1.b;
		var b1 = _v2.a;
		var b2 = _v2.b;
		var a1 = _v3.a;
		var a2 = _v3.b;
		var toResult = A2(
			$elm$core$Basics$composeR,
			$elm$core$String$fromList,
			A2($elm$core$Basics$composeR, $elm$core$String$toLower, $rtfeldman$elm_hex$Hex$fromString));
		var results = _Utils_Tuple2(
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[r1, r2])),
				toResult(
					_List_fromArray(
						[g1, g2]))),
			_Utils_Tuple2(
				toResult(
					_List_fromArray(
						[b1, b2])),
				toResult(
					_List_fromArray(
						[a1, a2]))));
		if ((((!results.a.a.$) && (!results.a.b.$)) && (!results.b.a.$)) && (!results.b.b.$)) {
			var _v5 = results.a;
			var red = _v5.a.a;
			var green = _v5.b.a;
			var _v6 = results.b;
			var blue = _v6.a.a;
			var alpha = _v6.b.a;
			return {
				au: alpha / 255,
				aw: blue,
				A: 0,
				az: green,
				aD: red,
				D: $rtfeldman$elm_css$Css$withPrecedingHash(str)
			};
		} else {
			return $rtfeldman$elm_css$Css$erroneousHex(str);
		}
	});
var $rtfeldman$elm_css$Css$hex = function (str) {
	var withoutHash = A2($elm$core$String$startsWith, '#', str) ? A2($elm$core$String$dropLeft, 1, str) : str;
	var _v0 = $elm$core$String$toList(withoutHash);
	_v0$4:
	while (true) {
		if ((_v0.b && _v0.b.b) && _v0.b.b.b) {
			if (!_v0.b.b.b.b) {
				var r = _v0.a;
				var _v1 = _v0.b;
				var g = _v1.a;
				var _v2 = _v1.b;
				var b = _v2.a;
				return A5(
					$rtfeldman$elm_css$Css$validHex,
					str,
					_Utils_Tuple2(r, r),
					_Utils_Tuple2(g, g),
					_Utils_Tuple2(b, b),
					_Utils_Tuple2('f', 'f'));
			} else {
				if (!_v0.b.b.b.b.b) {
					var r = _v0.a;
					var _v3 = _v0.b;
					var g = _v3.a;
					var _v4 = _v3.b;
					var b = _v4.a;
					var _v5 = _v4.b;
					var a = _v5.a;
					return A5(
						$rtfeldman$elm_css$Css$validHex,
						str,
						_Utils_Tuple2(r, r),
						_Utils_Tuple2(g, g),
						_Utils_Tuple2(b, b),
						_Utils_Tuple2(a, a));
				} else {
					if (_v0.b.b.b.b.b.b) {
						if (!_v0.b.b.b.b.b.b.b) {
							var r1 = _v0.a;
							var _v6 = _v0.b;
							var r2 = _v6.a;
							var _v7 = _v6.b;
							var g1 = _v7.a;
							var _v8 = _v7.b;
							var g2 = _v8.a;
							var _v9 = _v8.b;
							var b1 = _v9.a;
							var _v10 = _v9.b;
							var b2 = _v10.a;
							return A5(
								$rtfeldman$elm_css$Css$validHex,
								str,
								_Utils_Tuple2(r1, r2),
								_Utils_Tuple2(g1, g2),
								_Utils_Tuple2(b1, b2),
								_Utils_Tuple2('f', 'f'));
						} else {
							if (_v0.b.b.b.b.b.b.b.b && (!_v0.b.b.b.b.b.b.b.b.b)) {
								var r1 = _v0.a;
								var _v11 = _v0.b;
								var r2 = _v11.a;
								var _v12 = _v11.b;
								var g1 = _v12.a;
								var _v13 = _v12.b;
								var g2 = _v13.a;
								var _v14 = _v13.b;
								var b1 = _v14.a;
								var _v15 = _v14.b;
								var b2 = _v15.a;
								var _v16 = _v15.b;
								var a1 = _v16.a;
								var _v17 = _v16.b;
								var a2 = _v17.a;
								return A5(
									$rtfeldman$elm_css$Css$validHex,
									str,
									_Utils_Tuple2(r1, r2),
									_Utils_Tuple2(g1, g2),
									_Utils_Tuple2(b1, b2),
									_Utils_Tuple2(a1, a2));
							} else {
								break _v0$4;
							}
						}
					} else {
						break _v0$4;
					}
				}
			}
		} else {
			break _v0$4;
		}
	}
	return $rtfeldman$elm_css$Css$erroneousHex(str);
};
var $rtfeldman$elm_css$Css$Preprocess$ExtendSelector = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Structure$PseudoClassSelector = function (a) {
	return {$: 2, a: a};
};
var $rtfeldman$elm_css$Css$pseudoClass = function (_class) {
	return $rtfeldman$elm_css$Css$Preprocess$ExtendSelector(
		$rtfeldman$elm_css$Css$Structure$PseudoClassSelector(_class));
};
var $rtfeldman$elm_css$Css$hover = $rtfeldman$elm_css$Css$pseudoClass('hover');
var $rtfeldman$elm_css$Css$UnitlessInteger = 0;
var $rtfeldman$elm_css$Css$int = function (val) {
	return {
		O: 0,
		aO: 0,
		R: 0,
		B: 0,
		cQ: 0,
		aR: 0,
		K: val,
		ar: '',
		aI: 0,
		D: $elm$core$String$fromInt(val)
	};
};
var $rtfeldman$elm_css$Css$prop2 = F3(
	function (key, argA, argB) {
		return A2($rtfeldman$elm_css$Css$property, key, argA.D + (' ' + argB.D));
	});
var $rtfeldman$elm_css$Css$margin2 = $rtfeldman$elm_css$Css$prop2('margin');
var $rtfeldman$elm_css$Css$overflow = $rtfeldman$elm_css$Css$prop1('overflow');
var $rtfeldman$elm_css$Css$padding2 = $rtfeldman$elm_css$Css$prop2('padding');
var $rtfeldman$elm_css$Css$paddingBottom = $rtfeldman$elm_css$Css$prop1('padding-bottom');
var $rtfeldman$elm_css$Css$paddingTop = $rtfeldman$elm_css$Css$prop1('padding-top');
var $rtfeldman$elm_css$Css$solid = {r: 0, V: 0, D: 'solid'};
var $rtfeldman$elm_css$Css$Structure$TypeSelector = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Global$typeSelector = F2(
	function (selectorStr, styles) {
		var sequence = A2($rtfeldman$elm_css$Css$Structure$TypeSelectorSequence, selectorStr, _List_Nil);
		var sel = A3($rtfeldman$elm_css$Css$Structure$Selector, sequence, _List_Nil, $elm$core$Maybe$Nothing);
		return _List_fromArray(
			[
				$rtfeldman$elm_css$Css$Preprocess$StyleBlockDeclaration(
				A3($rtfeldman$elm_css$Css$Preprocess$StyleBlock, sel, _List_Nil, styles))
			]);
	});
var $author$project$Sitewide$View$defaultStyles = $rtfeldman$elm_css$Html$Styled$Attributes$css(
	_List_fromArray(
		[
			$rtfeldman$elm_css$Css$Global$descendants(
			_List_fromArray(
				[
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'code',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$fontSize(
							$rtfeldman$elm_css$Css$em(0.7))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'pre',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$overflow($rtfeldman$elm_css$Css$auto),
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$pct(90)),
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$em(0.9),
							$rtfeldman$elm_css$Css$pct(5))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'.katex',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$fontSize(
							$rtfeldman$elm_css$Css$em(1))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'p',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$paddingTop(
							$rtfeldman$elm_css$Css$em(0.4)),
							$rtfeldman$elm_css$Css$paddingBottom(
							$rtfeldman$elm_css$Css$em(0.4))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'article>svg',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$pct(90)),
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$em(1.4),
							$rtfeldman$elm_css$Css$pct(5))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'img',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$width(
							$rtfeldman$elm_css$Css$pct(90)),
							$rtfeldman$elm_css$Css$height($rtfeldman$elm_css$Css$auto),
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$em(1.4),
							$rtfeldman$elm_css$Css$pct(5))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'li',
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$em(0.3),
							$rtfeldman$elm_css$Css$em(0))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'article',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$paddingBottom(
							$rtfeldman$elm_css$Css$em(12))
						])),
					A2(
					$rtfeldman$elm_css$Css$Global$typeSelector,
					'button',
					_List_fromArray(
						[
							$rtfeldman$elm_css$Css$borderWidth(
							$rtfeldman$elm_css$Css$px(1)),
							$rtfeldman$elm_css$Css$borderRadius(
							$rtfeldman$elm_css$Css$em(40)),
							$rtfeldman$elm_css$Css$fontFamilies(
							_List_fromArray(
								['arial'])),
							A2(
							$rtfeldman$elm_css$Css$margin2,
							$rtfeldman$elm_css$Css$em(0.4),
							$rtfeldman$elm_css$Css$em(0.7)),
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$em(0.4),
							$rtfeldman$elm_css$Css$em(1)),
							$rtfeldman$elm_css$Css$fontSize(
							$rtfeldman$elm_css$Css$em(0.9)),
							$rtfeldman$elm_css$Css$fontWeight(
							$rtfeldman$elm_css$Css$int(200)),
							$rtfeldman$elm_css$Css$borderStyle($rtfeldman$elm_css$Css$dashed),
							$rtfeldman$elm_css$Css$borderColor(
							$rtfeldman$elm_css$Css$hex('C0C0C0')),
							$rtfeldman$elm_css$Css$backgroundColor(
							$rtfeldman$elm_css$Css$hex('ffffffbb')),
							$rtfeldman$elm_css$Css$hover(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$backgroundColor(
									$rtfeldman$elm_css$Css$hex('ddddddbb')),
									$rtfeldman$elm_css$Css$borderColor(
									$rtfeldman$elm_css$Css$hex('aaaaaa')),
									$rtfeldman$elm_css$Css$borderStyle($rtfeldman$elm_css$Css$solid)
								]))
						]))
				]))
		]));
var $rtfeldman$elm_css$Css$Transitions$Height = 51;
var $rtfeldman$elm_css$Css$Transitions$Transition = $elm$core$Basics$identity;
var $rtfeldman$elm_css$Css$Transitions$durationTransition = F2(
	function (animation, duration) {
		return {aK: animation, aM: $elm$core$Maybe$Nothing, by: duration, aY: $elm$core$Maybe$Nothing};
	});
var $rtfeldman$elm_css$Css$Transitions$height = $rtfeldman$elm_css$Css$Transitions$durationTransition(51);
var $rtfeldman$elm_css$Css$hidden = {r: 0, al: 0, D: 'hidden', aJ: 0};
var $rtfeldman$elm_css$Html$Styled$main_ = $rtfeldman$elm_css$Html$Styled$node('main');
var $rtfeldman$elm_css$Css$margin = $rtfeldman$elm_css$Css$prop1('margin');
var $rtfeldman$elm_css$Css$Media$feature = F2(
	function (key, _v0) {
		var value = _v0.D;
		return {
			bC: key,
			D: $elm$core$Maybe$Just(value)
		};
	});
var $rtfeldman$elm_css$Css$Media$minWidth = function (value) {
	return A2($rtfeldman$elm_css$Css$Media$feature, 'min-width', value);
};
var $author$project$Sitewide$Types$CommandBarChanged = function (a) {
	return {$: 3, a: a};
};
var $rtfeldman$elm_css$Css$border = $rtfeldman$elm_css$Css$prop1('border');
var $rtfeldman$elm_css$Css$color = function (c) {
	return A2($rtfeldman$elm_css$Css$property, 'color', c.D);
};
var $rtfeldman$elm_css$Css$flexDirection = $rtfeldman$elm_css$Css$prop1('flex-direction');
var $rtfeldman$elm_css$Css$flexGrow = $rtfeldman$elm_css$Css$prop1('flex-grow');
var $rtfeldman$elm_css$Css$focus = $rtfeldman$elm_css$Css$pseudoClass('focus');
var $rtfeldman$elm_css$Html$Styled$header = $rtfeldman$elm_css$Html$Styled$node('header');
var $rtfeldman$elm_css$Html$Styled$input = $rtfeldman$elm_css$Html$Styled$node('input');
var $author$project$Sitewide$Types$CommandSubmitted = {$: 4};
var $elm$json$Json$Decode$andThen = _Json_andThen;
var $elm$json$Json$Decode$fail = _Json_fail;
var $elm$json$Json$Decode$field = _Json_decodeField;
var $elm$json$Json$Decode$int = _Json_decodeInt;
var $author$project$Sitewide$View$keyDecoder = A2(
	$elm$json$Json$Decode$andThen,
	function (keyCode) {
		return (keyCode === 13) ? $elm$json$Json$Decode$succeed($author$project$Sitewide$Types$CommandSubmitted) : $elm$json$Json$Decode$fail('Not the Enter key');
	},
	A2($elm$json$Json$Decode$field, 'keyCode', $elm$json$Json$Decode$int));
var $author$project$Sitewide$View$makeSidePanel = $elm$core$List$map(
	A2(
		$elm$core$Basics$composeL,
		$rtfeldman$elm_css$Html$Styled$div(
			_List_fromArray(
				[
					$rtfeldman$elm_css$Html$Styled$Attributes$css(
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Css$padding2,
							$rtfeldman$elm_css$Css$em(0.1),
							$rtfeldman$elm_css$Css$em(0))
						]))
				])),
		$elm$core$List$singleton));
var $rtfeldman$elm_css$Css$marginBottom = $rtfeldman$elm_css$Css$prop1('margin-bottom');
var $author$project$Sitewide$View$navPanelSideWidth = $rtfeldman$elm_css$Css$em(8);
var $rtfeldman$elm_css$Css$none = {_: 0, br: 0, r: 0, c: 0, j: 0, cE: 0, bK: 0, a5: 0, aj: 0, Q: 0, B: 0, e: 0, d: 0, a8: 0, aT: 0, cU: 0, y: 0, aU: 0, cX: 0, ao: 0, W: 0, u: 0, i: 0, c2: 0, D: 'none'};
var $rtfeldman$elm_css$Css$UnitlessFloat = 0;
var $rtfeldman$elm_css$Css$num = function (val) {
	return {
		R: 0,
		B: 0,
		ak: 0,
		cQ: 0,
		aR: 0,
		K: val,
		ar: '',
		aI: 0,
		D: $elm$core$String$fromFloat(val)
	};
};
var $rtfeldman$elm_css$Html$Styled$Events$alwaysStop = function (x) {
	return _Utils_Tuple2(x, true);
};
var $elm$virtual_dom$VirtualDom$MayStopPropagation = function (a) {
	return {$: 1, a: a};
};
var $rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn = F2(
	function (event, decoder) {
		return A2(
			$rtfeldman$elm_css$VirtualDom$Styled$on,
			event,
			$elm$virtual_dom$VirtualDom$MayStopPropagation(decoder));
	});
var $elm$json$Json$Decode$at = F2(
	function (fields, decoder) {
		return A3($elm$core$List$foldr, $elm$json$Json$Decode$field, decoder, fields);
	});
var $elm$json$Json$Decode$string = _Json_decodeString;
var $rtfeldman$elm_css$Html$Styled$Events$targetValue = A2(
	$elm$json$Json$Decode$at,
	_List_fromArray(
		['target', 'value']),
	$elm$json$Json$Decode$string);
var $rtfeldman$elm_css$Html$Styled$Events$onInput = function (tagger) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$Events$stopPropagationOn,
		'input',
		A2(
			$elm$json$Json$Decode$map,
			$rtfeldman$elm_css$Html$Styled$Events$alwaysStop,
			A2($elm$json$Json$Decode$map, tagger, $rtfeldman$elm_css$Html$Styled$Events$targetValue)));
};
var $rtfeldman$elm_css$Css$opacity = $rtfeldman$elm_css$Css$prop1('opacity');
var $rtfeldman$elm_css$Css$outline = $rtfeldman$elm_css$Css$prop1('outline');
var $rtfeldman$elm_css$Html$Styled$Attributes$placeholder = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('placeholder');
var $rtfeldman$elm_css$Css$cssFunction = F2(
	function (funcName, args) {
		return funcName + ('(' + (A2($elm$core$String$join, ',', args) + ')'));
	});
var $rtfeldman$elm_css$Css$rgb = F3(
	function (r, g, b) {
		return {
			au: 1,
			aw: b,
			A: 0,
			az: g,
			aD: r,
			D: A2(
				$rtfeldman$elm_css$Css$cssFunction,
				'rgb',
				A2(
					$elm$core$List$map,
					$elm$core$String$fromInt,
					_List_fromArray(
						[r, g, b])))
		};
	});
var $rtfeldman$elm_css$Css$row = {a3: 0, ax: 0, D: 'row'};
var $rtfeldman$elm_css$Html$Styled$span = $rtfeldman$elm_css$Html$Styled$node('span');
var $rtfeldman$elm_css$Css$textTransform = $rtfeldman$elm_css$Css$prop1('text-transform');
var $rtfeldman$elm_css$Css$uppercase = {W: 0, D: 'uppercase'};
var $rtfeldman$elm_css$Html$Styled$Attributes$value = $rtfeldman$elm_css$Html$Styled$Attributes$stringProperty('value');
var $author$project$Sitewide$View$navBar = function (model) {
	return A2(
		$rtfeldman$elm_css$Html$Styled$header,
		_List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$Attributes$css(
				_List_fromArray(
					[
						$rtfeldman$elm_css$Css$displayFlex,
						$rtfeldman$elm_css$Css$flexDirection($rtfeldman$elm_css$Css$row),
						$rtfeldman$elm_css$Css$fontFamilies(
						_List_fromArray(
							['courier'])),
						$rtfeldman$elm_css$Css$marginBottom(
						$rtfeldman$elm_css$Css$em(1.2))
					]))
			]),
		_List_fromArray(
			[
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$width($author$project$Sitewide$View$navPanelSideWidth)
							]))
					]),
				_Utils_ap(
					$author$project$Sitewide$View$makeSidePanel(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$text('SLR'),
								$rtfeldman$elm_css$Html$Styled$text('LOCAL BUILD')
							])),
					model.ct ? _List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$span,
							_List_Nil,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('CLOCK: '),
									A2(
									$rtfeldman$elm_css$Html$Styled$span,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$Attributes$css(
											_List_fromArray(
												[
													$rtfeldman$elm_css$Css$color(
													A3($rtfeldman$elm_css$Css$rgb, 220, 220, 220))
												]))
										]),
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text(
											$elm$core$String$fromFloat(model.c$))
										]))
								]))
						]) : _List_Nil)),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$flexGrow(
								$rtfeldman$elm_css$Css$num(1))
							]))
					]),
				_List_fromArray(
					[
						A2(
						$rtfeldman$elm_css$Html$Styled$input,
						_List_fromArray(
							[
								$rtfeldman$elm_css$Html$Styled$Attributes$css(
								_List_fromArray(
									[
										$rtfeldman$elm_css$Css$border(
										$rtfeldman$elm_css$Css$em(0)),
										$rtfeldman$elm_css$Css$opacity(
										$rtfeldman$elm_css$Css$num(
											(model.cu === '') ? 0 : 1)),
										$rtfeldman$elm_css$Css$focus(
										_List_fromArray(
											[
												$rtfeldman$elm_css$Css$outline($rtfeldman$elm_css$Css$none),
												$rtfeldman$elm_css$Css$opacity(
												$rtfeldman$elm_css$Css$num(1))
											])),
										$rtfeldman$elm_css$Css$fontFamilies(
										_List_fromArray(
											['courier'])),
										$rtfeldman$elm_css$Css$textTransform($rtfeldman$elm_css$Css$uppercase),
										$rtfeldman$elm_css$Css$color(
										A3($rtfeldman$elm_css$Css$rgb, 100, 100, 100)),
										$rtfeldman$elm_css$Css$width(
										$rtfeldman$elm_css$Css$pct(100))
									])),
								$rtfeldman$elm_css$Html$Styled$Attributes$value(model.cu),
								$rtfeldman$elm_css$Html$Styled$Events$onInput($author$project$Sitewide$Types$CommandBarChanged),
								A2(
								$rtfeldman$elm_css$Html$Styled$Events$on,
								'keydown',
								A2($elm$json$Json$Decode$map, $elm$core$Basics$identity, $author$project$Sitewide$View$keyDecoder)),
								A2($rtfeldman$elm_css$Html$Styled$Attributes$style, 'user-select', 'none'),
								$rtfeldman$elm_css$Html$Styled$Attributes$placeholder('ENTER COMMAND')
							]),
						_List_Nil)
					])),
				A2(
				$rtfeldman$elm_css$Html$Styled$div,
				_List_fromArray(
					[
						$rtfeldman$elm_css$Html$Styled$Attributes$css(
						_List_fromArray(
							[
								$rtfeldman$elm_css$Css$width($author$project$Sitewide$View$navPanelSideWidth),
								$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$right)
							]))
					]),
				$author$project$Sitewide$View$makeSidePanel(
					_List_fromArray(
						[
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$href('/NAV')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text('NAVIGATION')
								])),
							A2(
							$rtfeldman$elm_css$Html$Styled$a,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Events$onClick($author$project$Sitewide$Types$ToggleContactForm),
									$rtfeldman$elm_css$Html$Styled$Attributes$href('#')
								]),
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$text(
									model.cv ? 'HIDE' : 'CONTACT')
								]))
						])))
			]));
};
var $rtfeldman$elm_css$Css$Structure$OnlyQuery = F2(
	function (a, b) {
		return {$: 1, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Media$only = $rtfeldman$elm_css$Css$Structure$OnlyQuery;
var $rtfeldman$elm_css$Css$overflowY = $rtfeldman$elm_css$Css$prop1('overflow-y');
var $rtfeldman$elm_css$Css$RemUnits = 0;
var $rtfeldman$elm_css$Css$rem = A2($rtfeldman$elm_css$Css$Internal$lengthConverter, 0, 'rem');
var $rtfeldman$elm_css$Css$Structure$Screen = 1;
var $rtfeldman$elm_css$Css$Media$screen = 1;
var $rtfeldman$elm_css$VirtualDom$Styled$UnscopedStyles = function (a) {
	return {$: 0, a: a};
};
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles = F2(
	function (_v0, styles) {
		var isCssStyles = _v0.b;
		var cssTemplate = _v0.c;
		if (isCssStyles) {
			var _v1 = A2($elm$core$Dict$get, cssTemplate, styles);
			if (!_v1.$) {
				return styles;
			} else {
				return A3(
					$elm$core$Dict$insert,
					cssTemplate,
					$rtfeldman$elm_css$Hash$fromString(cssTemplate),
					styles);
			}
		} else {
			return styles;
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute = F2(
	function (styles, _v0) {
		var val = _v0.a;
		var isCssStyles = _v0.b;
		var cssTemplate = _v0.c;
		if (isCssStyles) {
			var _v1 = A2($elm$core$Dict$get, cssTemplate, styles);
			if (!_v1.$) {
				var classname = _v1.a;
				return A2(
					$elm$virtual_dom$VirtualDom$property,
					'className',
					$elm$json$Json$Encode$string(classname));
			} else {
				return A2(
					$elm$virtual_dom$VirtualDom$property,
					'className',
					$elm$json$Json$Encode$string('_unstyled'));
			}
		} else {
			return val;
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttributeNS = F2(
	function (styles, _v0) {
		var val = _v0.a;
		var isCssStyles = _v0.b;
		var cssTemplate = _v0.c;
		if (isCssStyles) {
			var _v1 = A2($elm$core$Dict$get, cssTemplate, styles);
			if (!_v1.$) {
				var classname = _v1.a;
				return A2($elm$virtual_dom$VirtualDom$attribute, 'class', classname);
			} else {
				return A2($elm$virtual_dom$VirtualDom$attribute, 'class', '_unstyled');
			}
		} else {
			return val;
		}
	});
var $elm$virtual_dom$VirtualDom$keyedNode = function (tag) {
	return _VirtualDom_keyedNode(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$keyedNodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_keyedNodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $elm$virtual_dom$VirtualDom$node = function (tag) {
	return _VirtualDom_node(
		_VirtualDom_noScript(tag));
};
var $elm$virtual_dom$VirtualDom$nodeNS = F2(
	function (namespace, tag) {
		return A2(
			_VirtualDom_nodeNS,
			namespace,
			_VirtualDom_noScript(tag));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml = F2(
	function (_v6, _v7) {
		var key = _v6.a;
		var html = _v6.b;
		var pairs = _v7.a;
		var styles = _v7.b;
		switch (html.$) {
			case 4:
				var vdom = html.a;
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v9 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v9.a;
				var finalStyles = _v9.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v10 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v10.a;
				var finalStyles = _v10.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v11 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v11.a;
				var finalStyles = _v11.b;
				var vdom = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v12 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v12.a;
				var finalStyles = _v12.b;
				var vdom = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2(
						$elm$core$List$cons,
						_Utils_Tuple2(key, vdom),
						pairs),
					finalStyles);
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml = F2(
	function (html, _v0) {
		var nodes = _v0.a;
		var styles = _v0.b;
		switch (html.$) {
			case 4:
				var vdomNode = html.a;
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					styles);
			case 0:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v2 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v2.a;
				var finalStyles = _v2.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$node,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 1:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v3 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v3.a;
				var finalStyles = _v3.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$nodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttributeNS(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			case 2:
				var elemType = html.a;
				var properties = html.b;
				var children = html.c;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v4 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v4.a;
				var finalStyles = _v4.b;
				var vdomNode = A3(
					$elm$virtual_dom$VirtualDom$keyedNode,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
			default:
				var ns = html.a;
				var elemType = html.b;
				var properties = html.c;
				var children = html.d;
				var combinedStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, styles, properties);
				var _v5 = A3(
					$elm$core$List$foldl,
					$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
					_Utils_Tuple2(_List_Nil, combinedStyles),
					children);
				var childNodes = _v5.a;
				var finalStyles = _v5.b;
				var vdomNode = A4(
					$elm$virtual_dom$VirtualDom$keyedNodeNS,
					ns,
					elemType,
					A2(
						$elm$core$List$map,
						$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttributeNS(finalStyles),
						properties),
					$elm$core$List$reverse(childNodes));
				return _Utils_Tuple2(
					A2($elm$core$List$cons, vdomNode, nodes),
					finalStyles);
		}
	});
var $elm$core$String$replace = F3(
	function (before, after, string) {
		return A2(
			$elm$core$String$join,
			after,
			A2($elm$core$String$split, before, string));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$styleToDeclaration = F3(
	function (template, classname, declaration) {
		return declaration + ('\n' + A3($elm$core$String$replace, $rtfeldman$elm_css$VirtualDom$Styled$classnameStandin, classname, template));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration = function (dict) {
	return A3($elm$core$Dict$foldl, $rtfeldman$elm_css$VirtualDom$Styled$styleToDeclaration, '', dict);
};
var $rtfeldman$elm_css$VirtualDom$Styled$toScopedDeclaration = F2(
	function (scopingPrefix, dict) {
		return A3(
			$elm$core$Dict$foldl,
			F3(
				function (template, classname, declaration) {
					return declaration + ('\n' + A3($elm$core$String$replace, '.' + $rtfeldman$elm_css$VirtualDom$Styled$classnameStandin, '#' + (scopingPrefix + ('.' + classname)), template));
				}),
			'',
			dict);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toStyleNode = F2(
	function (maybeNonce, accumulatedStyles) {
		var cssText = function () {
			if (!accumulatedStyles.$) {
				var allStyles = accumulatedStyles.a;
				return $rtfeldman$elm_css$VirtualDom$Styled$toDeclaration(allStyles);
			} else {
				var scope = accumulatedStyles.a;
				var rootStyles = accumulatedStyles.b;
				var descendantStyles = accumulatedStyles.c;
				return A2($rtfeldman$elm_css$VirtualDom$Styled$toScopedDeclaration, scope, rootStyles) + ('\n' + A2($rtfeldman$elm_css$VirtualDom$Styled$toScopedDeclaration, scope + ' ', descendantStyles));
			}
		}();
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			'span',
			_List_fromArray(
				[
					A2($elm$virtual_dom$VirtualDom$attribute, 'style', 'display: none;'),
					A2($elm$virtual_dom$VirtualDom$attribute, 'class', 'elm-css-style-wrapper')
				]),
			_List_fromArray(
				[
					A3(
					$elm$virtual_dom$VirtualDom$node,
					'style',
					function () {
						if (!maybeNonce.$) {
							var nonce = maybeNonce.a;
							return _List_fromArray(
								[
									A2($elm$virtual_dom$VirtualDom$attribute, 'nonce', nonce)
								]);
						} else {
							return _List_Nil;
						}
					}(),
					$elm$core$List$singleton(
						$elm$virtual_dom$VirtualDom$text(cssText)))
				]));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyle = F4(
	function (maybeNonce, elemType, properties, children) {
		var initialStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, $elm$core$Dict$empty, properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = A2(
			$rtfeldman$elm_css$VirtualDom$Styled$toStyleNode,
			maybeNonce,
			$rtfeldman$elm_css$VirtualDom$Styled$UnscopedStyles(styles));
		var unstyledProperties = A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(styles),
			properties);
		return A3(
			$elm$virtual_dom$VirtualDom$node,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$containsKey = F2(
	function (key, pairs) {
		containsKey:
		while (true) {
			if (!pairs.b) {
				return false;
			} else {
				var _v1 = pairs.a;
				var str = _v1.a;
				var rest = pairs.b;
				if (_Utils_eq(key, str)) {
					return true;
				} else {
					var $temp$key = key,
						$temp$pairs = rest;
					key = $temp$key;
					pairs = $temp$pairs;
					continue containsKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey = F2(
	function (_default, pairs) {
		getUnusedKey:
		while (true) {
			if (!pairs.b) {
				return _default;
			} else {
				var _v1 = pairs.a;
				var firstKey = _v1.a;
				var rest = pairs.b;
				var newKey = '_' + firstKey;
				if (A2($rtfeldman$elm_css$VirtualDom$Styled$containsKey, newKey, rest)) {
					var $temp$default = newKey,
						$temp$pairs = rest;
					_default = $temp$default;
					pairs = $temp$pairs;
					continue getUnusedKey;
				} else {
					return newKey;
				}
			}
		}
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode = F3(
	function (maybeNonce, accumulatedStyles, keyedChildNodes) {
		var styleNodeKey = A2($rtfeldman$elm_css$VirtualDom$Styled$getUnusedKey, '_', keyedChildNodes);
		var finalNode = A2($rtfeldman$elm_css$VirtualDom$Styled$toStyleNode, maybeNonce, accumulatedStyles);
		return _Utils_Tuple2(styleNodeKey, finalNode);
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed = F4(
	function (maybeNonce, elemType, properties, keyedChildren) {
		var initialStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, $elm$core$Dict$empty, properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A3(
			$rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode,
			maybeNonce,
			$rtfeldman$elm_css$VirtualDom$Styled$UnscopedStyles(styles),
			keyedChildNodes);
		var unstyledProperties = A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttribute(styles),
			properties);
		return A3(
			$elm$virtual_dom$VirtualDom$keyedNode,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS = F5(
	function (maybeNonce, ns, elemType, properties, keyedChildren) {
		var initialStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, $elm$core$Dict$empty, properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateKeyedStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			keyedChildren);
		var keyedChildNodes = _v0.a;
		var styles = _v0.b;
		var keyedStyleNode = A3(
			$rtfeldman$elm_css$VirtualDom$Styled$toKeyedStyleNode,
			maybeNonce,
			$rtfeldman$elm_css$VirtualDom$Styled$UnscopedStyles(styles),
			keyedChildNodes);
		var unstyledProperties = A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttributeNS(styles),
			properties);
		return A4(
			$elm$virtual_dom$VirtualDom$keyedNodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				keyedStyleNode,
				$elm$core$List$reverse(keyedChildNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$unstyleNS = F5(
	function (maybeNonce, ns, elemType, properties, children) {
		var initialStyles = A3($elm$core$List$foldl, $rtfeldman$elm_css$VirtualDom$Styled$accumulateStyles, $elm$core$Dict$empty, properties);
		var _v0 = A3(
			$elm$core$List$foldl,
			$rtfeldman$elm_css$VirtualDom$Styled$accumulateStyledHtml,
			_Utils_Tuple2(_List_Nil, initialStyles),
			children);
		var childNodes = _v0.a;
		var styles = _v0.b;
		var styleNode = A2(
			$rtfeldman$elm_css$VirtualDom$Styled$toStyleNode,
			maybeNonce,
			$rtfeldman$elm_css$VirtualDom$Styled$UnscopedStyles(styles));
		var unstyledProperties = A2(
			$elm$core$List$map,
			$rtfeldman$elm_css$VirtualDom$Styled$extractUnstyledAttributeNS(styles),
			properties);
		return A4(
			$elm$virtual_dom$VirtualDom$nodeNS,
			ns,
			elemType,
			unstyledProperties,
			A2(
				$elm$core$List$cons,
				styleNode,
				$elm$core$List$reverse(childNodes)));
	});
var $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled = function (vdom) {
	switch (vdom.$) {
		case 4:
			var plainNode = vdom.a;
			return plainNode;
		case 0:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyle, $elm$core$Maybe$Nothing, elemType, properties, children);
		case 1:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A5($rtfeldman$elm_css$VirtualDom$Styled$unstyleNS, $elm$core$Maybe$Nothing, ns, elemType, properties, children);
		case 2:
			var elemType = vdom.a;
			var properties = vdom.b;
			var children = vdom.c;
			return A4($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyed, $elm$core$Maybe$Nothing, elemType, properties, children);
		default:
			var ns = vdom.a;
			var elemType = vdom.b;
			var properties = vdom.c;
			var children = vdom.d;
			return A5($rtfeldman$elm_css$VirtualDom$Styled$unstyleKeyedNS, $elm$core$Maybe$Nothing, ns, elemType, properties, children);
	}
};
var $rtfeldman$elm_css$Html$Styled$toUnstyled = $rtfeldman$elm_css$VirtualDom$Styled$toUnstyled;
var $rtfeldman$elm_css$Css$Transitions$propToString = function (prop) {
	switch (prop) {
		case 0:
			return 'background';
		case 1:
			return 'background-color';
		case 2:
			return 'background-position';
		case 3:
			return 'background-size';
		case 4:
			return 'border';
		case 5:
			return 'border-bottom';
		case 6:
			return 'border-bottom-color';
		case 7:
			return 'border-bottom-left-radius';
		case 8:
			return 'border-bottom-right-radius';
		case 9:
			return 'border-bottom-width';
		case 10:
			return 'border-color';
		case 11:
			return 'border-left';
		case 12:
			return 'border-left-color';
		case 13:
			return 'border-left-width';
		case 14:
			return 'border-radius';
		case 15:
			return 'border-right';
		case 16:
			return 'border-right-color';
		case 17:
			return 'border-right-width';
		case 18:
			return 'border-top';
		case 19:
			return 'border-top-color';
		case 20:
			return 'border-top-left-radius';
		case 21:
			return 'border-top-right-radius';
		case 22:
			return 'border-top-width';
		case 23:
			return 'border-width';
		case 24:
			return 'bottom';
		case 25:
			return 'box-shadow';
		case 26:
			return 'caret-color';
		case 27:
			return 'clip';
		case 28:
			return 'clip-path';
		case 29:
			return 'color';
		case 30:
			return 'column-count';
		case 31:
			return 'column-gap';
		case 32:
			return 'column-rule';
		case 33:
			return 'column-rule-color';
		case 34:
			return 'column-rule-width';
		case 35:
			return 'column-width';
		case 36:
			return 'columns';
		case 37:
			return 'filter';
		case 38:
			return 'flex';
		case 39:
			return 'flex-basis';
		case 40:
			return 'flex-grow';
		case 41:
			return 'flex-shrink';
		case 42:
			return 'font';
		case 43:
			return 'font-size';
		case 44:
			return 'font-size-adjust';
		case 45:
			return 'font-stretch';
		case 46:
			return 'font-variation-settings';
		case 47:
			return 'font-weight';
		case 48:
			return 'grid-column-gap';
		case 49:
			return 'grid-gap';
		case 50:
			return 'grid-row-gap';
		case 51:
			return 'height';
		case 52:
			return 'left';
		case 53:
			return 'letter-spacing';
		case 54:
			return 'line-height';
		case 55:
			return 'margin';
		case 56:
			return 'margin-bottom';
		case 57:
			return 'margin-left';
		case 58:
			return 'margin-right';
		case 59:
			return 'margin-top';
		case 60:
			return 'mask';
		case 61:
			return 'mask-position';
		case 62:
			return 'mask-size';
		case 63:
			return 'max-height';
		case 64:
			return 'max-width';
		case 65:
			return 'min-height';
		case 66:
			return 'min-width';
		case 67:
			return 'object-position';
		case 68:
			return 'offset';
		case 69:
			return 'offset-anchor';
		case 70:
			return 'offset-distance';
		case 71:
			return 'offset-path';
		case 72:
			return 'offset-rotate';
		case 73:
			return 'opacity';
		case 74:
			return 'order';
		case 75:
			return 'outline';
		case 76:
			return 'outline-color';
		case 77:
			return 'outline-offset';
		case 78:
			return 'outline-width';
		case 79:
			return 'padding';
		case 80:
			return 'padding-bottom';
		case 81:
			return 'padding-left';
		case 82:
			return 'padding-right';
		case 83:
			return 'padding-top';
		case 84:
			return 'right';
		case 85:
			return 'tab-size';
		case 86:
			return 'text-indent';
		case 87:
			return 'text-shadow';
		case 88:
			return 'top';
		case 89:
			return 'transform';
		case 90:
			return 'transform-origin';
		case 91:
			return 'vertical-align';
		case 92:
			return 'visibility';
		case 93:
			return 'width';
		case 94:
			return 'word-spacing';
		default:
			return 'z-index';
	}
};
var $rtfeldman$elm_css$Css$Transitions$timeToString = function (time) {
	return $elm$core$String$fromFloat(time) + 'ms';
};
var $rtfeldman$elm_css$Css$Transitions$timingFunctionToString = function (tf) {
	switch (tf.$) {
		case 0:
			return 'ease';
		case 1:
			return 'linear';
		case 2:
			return 'ease-in';
		case 3:
			return 'ease-out';
		case 4:
			return 'ease-in-out';
		case 5:
			return 'step-start';
		case 6:
			return 'step-end';
		default:
			var _float = tf.a;
			var float2 = tf.b;
			var float3 = tf.c;
			var float4 = tf.d;
			return 'cubic-bezier(' + ($elm$core$String$fromFloat(_float) + (' , ' + ($elm$core$String$fromFloat(float2) + (' , ' + ($elm$core$String$fromFloat(float3) + (' , ' + ($elm$core$String$fromFloat(float4) + ')')))))));
	}
};
var $rtfeldman$elm_css$Css$Transitions$transition = function (options) {
	var v = A3(
		$elm$core$String$slice,
		0,
		-1,
		A3(
			$elm$core$List$foldl,
			F2(
				function (_v0, s) {
					var animation = _v0.aK;
					var duration = _v0.by;
					var delay = _v0.aM;
					var timing = _v0.aY;
					return s + ($rtfeldman$elm_css$Css$Transitions$propToString(animation) + (' ' + ($rtfeldman$elm_css$Css$Transitions$timeToString(duration) + (' ' + (A2(
						$elm$core$Maybe$withDefault,
						'',
						A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Transitions$timeToString, delay)) + (' ' + (A2(
						$elm$core$Maybe$withDefault,
						'',
						A2($elm$core$Maybe$map, $rtfeldman$elm_css$Css$Transitions$timingFunctionToString, timing)) + ',')))))));
				}),
			'',
			options));
	return A2($rtfeldman$elm_css$Css$property, 'transition', v);
};
var $rtfeldman$elm_css$Css$Preprocess$WithMedia = F2(
	function (a, b) {
		return {$: 4, a: a, b: b};
	});
var $rtfeldman$elm_css$Css$Media$withMedia = $rtfeldman$elm_css$Css$Preprocess$WithMedia;
var $author$project$Sitewide$View$view = function (m) {
	return {
		cq: _List_fromArray(
			[
				$rtfeldman$elm_css$Html$Styled$toUnstyled(
				A2(
					$rtfeldman$elm_css$Html$Styled$main_,
					_List_fromArray(
						[
							$author$project$Sitewide$View$defaultStyles,
							$rtfeldman$elm_css$Html$Styled$Attributes$css(
							_List_fromArray(
								[
									$rtfeldman$elm_css$Css$margin($rtfeldman$elm_css$Css$auto),
									A2(
									$rtfeldman$elm_css$Css$Media$withMedia,
									_List_fromArray(
										[
											A2(
											$rtfeldman$elm_css$Css$Media$only,
											$rtfeldman$elm_css$Css$Media$screen,
											_List_fromArray(
												[
													$rtfeldman$elm_css$Css$Media$minWidth(
													$rtfeldman$elm_css$Css$px(660))
												]))
										]),
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$width(
											$rtfeldman$elm_css$Css$em(34))
										])),
									$rtfeldman$elm_css$Css$fontSize(
									$rtfeldman$elm_css$Css$rem(1.13)),
									$rtfeldman$elm_css$Css$width(
									$rtfeldman$elm_css$Css$pct(93))
								]))
						]),
					_List_fromArray(
						[
							$author$project$Sitewide$View$navBar(m),
							A2(
							$rtfeldman$elm_css$Html$Styled$div,
							_List_fromArray(
								[
									$rtfeldman$elm_css$Html$Styled$Attributes$css(
									_List_fromArray(
										[
											$rtfeldman$elm_css$Css$Transitions$transition(
											_List_fromArray(
												[
													$rtfeldman$elm_css$Css$Transitions$height(400)
												])),
											$rtfeldman$elm_css$Css$height(
											$rtfeldman$elm_css$Css$em(
												m.cv ? 2.4 : 0)),
											$rtfeldman$elm_css$Css$overflowY($rtfeldman$elm_css$Css$hidden),
											$rtfeldman$elm_css$Css$displayFlex,
											$rtfeldman$elm_css$Css$justifyContent($rtfeldman$elm_css$Css$center),
											$rtfeldman$elm_css$Css$alignItems($rtfeldman$elm_css$Css$center),
											$rtfeldman$elm_css$Css$textAlign($rtfeldman$elm_css$Css$center),
											$rtfeldman$elm_css$Css$fontFamilies(
											_List_fromArray(
												['courier']))
										]))
								]),
							_List_fromArray(
								[
									A2(
									$rtfeldman$elm_css$Html$Styled$span,
									_List_Nil,
									_List_fromArray(
										[
											$rtfeldman$elm_css$Html$Styled$text('EMAIL ME AT '),
											A2(
											$rtfeldman$elm_css$Html$Styled$a,
											_List_fromArray(
												[
													$rtfeldman$elm_css$Html$Styled$Attributes$href('mailto:seanlucrussell@gmail.com')
												]),
											_List_fromArray(
												[
													$rtfeldman$elm_css$Html$Styled$text('seanlucrussell@gmail.com')
												]))
										]))
								])),
							$author$project$Sitewide$Routes$urlMap(m.cx).c4(m)
						])))
			]),
		c0: 'SLR'
	};
};
var $author$project$Main$main = $elm$browser$Browser$application(
	{
		cH: $author$project$Sitewide$Init$init,
		cR: $author$project$Sitewide$Types$UrlChange,
		cS: $author$project$Sitewide$Types$UrlRequest,
		c_: $elm$core$Basics$always(
			$elm$browser$Browser$Events$onAnimationFrameDelta($author$project$Sitewide$Types$Tick)),
		c1: $author$project$Sitewide$Update$update,
		c4: $author$project$Sitewide$View$view
	});
_Platform_export({'Main':{'init':$author$project$Main$main(
	$elm$json$Json$Decode$succeed(0))(0)}});}(this));