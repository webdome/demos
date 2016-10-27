/*!
 * built in 2016-10-10:21 version 2.1.16 by 司徒正美
 * https://github.com/RubyLouvre/avalon/tree/2.1.7
 *     fix parseExpr BUG #1768 与 #1765
 *     优化ms-effect指令,与ms-css指令共同相同的diff
 *     data-duplex-changed回调支持更多参数
 *     处理$watch监听复杂数BUG #1762
 *     处理date过滤器不解析 BUG
 *     重构ms-important后面的指令不执行的BUG
 *     改成es6 modules组织依赖,rollup.js打包
 */
;;;

(function (global, factory) {
	   if (typeof exports === 'object' && typeof module === 'object')
		module.exports = factory()
	else if (typeof define === 'function' && define.amd)
		define([], factory)
	else if (typeof exports === 'object')
		exports.avalon = factory()
	else
		global.avalon = factory()
} (this, function () {

	   //avalon的核心,这里都是一些不存在异议的*核心*方法与属性
	   function avalon(el) {
		return new avalon.init(el)
	   }

	   avalon.init = function (el) {
		this[0] = this.element = el
	   }

	   avalon.fn = avalon.prototype = avalon.init.prototype

	   avalon.shadowCopy = function (destination, source) {
		for (var property in source) {
			destination[property] = source[property]
		}
		return destination
	   }
	   var cssHooks = {}
	   var rhyphen = /([a-z\d])([A-Z]+)/g
	   var rcamelize = /[-_][^-_]/g
	   var rhashcode = /\d\.\d{4}/
	   var rescape = /[-.*+?^${}()|[\]\/\\]/g

	   var _slice = [].slice
	   function defaultParse(cur, pre, binding) {
		cur[binding.name] = avalon.parseExpr(binding)
	   }
	   var rword = /[^, ]+/g

	   var hasConsole = typeof console === 'object'

	   avalon.shadowCopy(avalon, {
		noop: function () {
		},
		version: "2.1.16",
		//切割字符串为一个个小块，以空格或逗号分开它们，结合replace实现字符串的forEach
		rword: rword,
		inspect: ({}).toString,
		ohasOwn: ({}).hasOwnProperty,
		caches: {}, //avalon2.0 新增
		vmodels: {},
		filters: {},
		components: {}, //放置组件的类
		directives: {},
		eventHooks: {},
		eventListeners: {},
		validators: {},
		scopes: {},
		effects: {},
		cssHooks: cssHooks,
		parsers: {
			number: function (a) {
				return a === '' ? '' : parseFloat(a) || 0
			},
			string: function (a) {
				return a === null || a === void 0 ? '' : a + ''
			},
			boolean: function (a) {
				if (a === '')
					return a
				return a === 'true' || a === '1'
			}
		},
		log: function () {
			if (hasConsole && avalon.config.debug) {
				// http://stackoverflow.com/questions/8785624/how-to-safely-wrap-console-log
				Function.apply.call(console.log, console, arguments)
			}
		},
		warn: function () {
			/* istanbul ignore if*/
			if (hasConsole && avalon.config.debug) {
				var method = console.warn || console.log
				// http://qiang106.iteye.com/blog/1721425
				Function.apply.call(method, console, arguments)
			}
		},
		error: function (str, e) {
			throw (e || Error)(str)
		},
		//将一个以空格或逗号隔开的字符串或数组,转换成一个键值都为1的对象
		oneObject: function (array, val) {
			/* istanbul ignore if*/
			if (typeof array === 'string') {
				array = array.match(rword) || []
			}
			var result = {},
				value = val !== void 0 ? val : 1
			for (var i = 0, n = array.length; i < n; i++) {
				result[array[i]] = value
			}
			return result
		},
		isObject: function (a) {
			return a !== null && typeof a === 'object'
		},
		/* avalon.range(10)
		 => [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
		 avalon.range(1, 11)
		 => [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
		 avalon.range(0, 30, 5)
		 => [0, 5, 10, 15, 20, 25]
		 avalon.range(0, -10, -1)
		 => [0, -1, -2, -3, -4, -5, -6, -7, -8, -9]
		 avalon.range(0)
		 => []*/
		range: function (start, end, step) { // 用于生成整数数组
			step || (step = 1)
			if (end == null) {
				end = start || 0
				start = 0
			}
			var index = - 1,
				length = Math.max(0, Math.ceil((end - start) / step)),
				result = new Array(length)
			while (++index < length) {
				result[index] = start
				start += step
			}
			return result
		},
		hyphen: function (target) {
			//转换为连字符线风格
			return target.replace(rhyphen, '$1-$2').toLowerCase()
		},
		camelize: function (target) {
			//提前判断，提高getStyle等的效率
			if (!target || target.indexOf('-') < 0 && target.indexOf('_') < 0) {
				return target
			}
			//转换为驼峰风格
			return target.replace(rcamelize, function (match) {
				return match.charAt(1).toUpperCase()
			})
		},
		slice: function (nodes, start, end) {
			return _slice.call(nodes, start, end)
		},
		css: function (node, name, value, fn) {
			//读写删除元素节点的样式
			if (node instanceof avalon) {
				node = node[0]
			}
			if (node.nodeType !== 1) {
				return
			}
			var prop = avalon.camelize(name)
			name = avalon.cssName(prop) || /* istanbul ignore next*/ prop
			if (value === void 0 || typeof value === 'boolean') { //获取样式
				fn = cssHooks[prop + ':get'] || cssHooks['@:get']
				if (name === 'background') {
					name = 'backgroundColor'
				}
				var val = fn(node, name)
				return value === true ? parseFloat(val) || 0 : val
			} else if (value === '') { //请除样式
				node.style[name] = ''
			} else { //设置样式
				if (value == null || value !== value) {
					return
				}
				if (isFinite(value) && !avalon.cssNumber[prop]) {
					value += 'px'
				}
				fn = cssHooks[prop + ':set'] || cssHooks['@:set']
				fn(node, name, value)
			}
		},
		directive: function (name, definition) {
			definition.parse = definition.parse || /* istanbul ignore next*/ defaultParse
			return this.directives[name] = definition
		},
		//生成UUID http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
		makeHashCode: function (prefix) {
			/* istanbul ignore next*/
			prefix = prefix || 'avalon'
			/* istanbul ignore next*/
			return String(Math.random() + Math.random()).replace(rhashcode, prefix)
		},
		escapeRegExp: function (target) {
			//http://stevenlevithan.com/regex/xregexp/
			//将字符串安全格式化为正则表达式的源码
			return (target + '').replace(rescape, '\\$&')
		},
		Array: {
			merge: function (target, other) {
				//合并两个数组 avalon2新增
				target.push.apply(target, other)
			},
			ensure: function (target, item) {
				//只有当前数组不存在此元素时只添加它
				if (target.indexOf(item) === - 1) {
					return target.push(item)
				}
			},
			removeAt: function (target, index) {
				//移除数组中指定位置的元素，返回布尔表示成功与否
				return !!target.splice(index, 1).length
			},
			remove: function (target, item) {
				//移除数组中第一个匹配传参的那个元素，返回布尔表示成功与否
				var index = target.indexOf(item)
				if (~index)
					return avalon.Array.removeAt(target, index)
				return false
			}
		}
	   })

	/**
	 * 此模块不依赖任何模块,用于修复语言的底层缺陷
	 */

	   var ohasOwn = Object.prototype.hasOwnProperty
	   function isNative(fn) {
	       return /\[native code\]/.test(fn)
	   }
	   /* istanbul ignore if*/
	   if (!isNative('司徒正美'.trim)) {
	       var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
	       String.prototype.trim = function () {
	           return this.replace(rtrim, '')
	       }
	   }
	   var hasDontEnumBug = !({
	       'toString': null
	   }).propertyIsEnumerable('toString');
	   var hasProtoEnumBug = (function () {
	}).propertyIsEnumerable('prototype')
	   var dontEnums = [
		'toString',
		'toLocaleString',
		'valueOf',
		'hasOwnProperty',
		'isPrototypeOf',
		'propertyIsEnumerable',
		'constructor'
	]
	   var dontEnumsLength = dontEnums.length
	   /* istanbul ignore if*/
	   if (!isNative(Object.keys)) {
	       Object.keys = function (object) { //ecma262v5 15.2.3.14
	           var theKeys = []
	           var skipProto = hasProtoEnumBug && typeof object === 'function'
	           if (typeof object === 'string' || (object && object.callee)) {
	               for (var i = 0; i < object.length; ++i) {
	                   theKeys.push(String(i))
	               }
	           } else {
	               for (var name in object) {
	                   if (!(skipProto && name === 'prototype') &&
						ohasOwn.call(object, name)) {
	                       theKeys.push(String(name))
	                   }
	               }
	           }

	           if (hasDontEnumBug) {
	               var ctor = object.constructor,
					skipConstructor = ctor && ctor.prototype === object
	               for (var j = 0; j < dontEnumsLength; j++) {
	                   var dontEnum = dontEnums[j]
	                   if (!(skipConstructor && dontEnum === 'constructor') && ohasOwn.call(object, dontEnum)) {
	                       theKeys.push(dontEnum)
	                   }
	               }
	           }
	           return theKeys
	       }
	   }
	   /* istanbul ignore if*/
	   if (!isNative(Array.isArray)) {
	       Array.isArray = function (a) {
	           return Object.prototype.toString.call(a) === '[object Array]'
	       }
	   }
	   /* istanbul ignore if*/
	   if (!isNative(isNative.bind)) {
	       Function.prototype.bind = function (scope) {
	           if (arguments.length < 2 && scope === void 0)
	               return this
	           var fn = this,
				argv = arguments
	           return function () {
	               var args = [],
					i
	               for (i = 1; i < argv.length; i++)
	                   args.push(argv[i])
	               for (i = 0; i < arguments.length; i++)
	                   args.push(arguments[i])
	               return fn.apply(scope, args)
	           }
	       }
	   }
	   //https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array/slice
	/**
	* Shim for "fixing" IE's lack of support (IE < 9) for applying slice
	* on host objects like NamedNodeMap, NodeList, and HTMLCollection
	* (technically, since host objects have been implementation-dependent,
	* at least before ES6, IE hasn't needed to work this way).
	* Also works on strings, fixes IE < 9 to allow an explicit undefined
	* for the 2nd argument (as in Firefox), and prevents errors when
	* called on other DOM objects.
	*/
	   var ap = Array.prototype

	   var _slice$1 = ap.slice
	   try {
	       // Can't be used with DOM elements in IE < 9
	       _slice$1.call(document.documentElement)
	   } catch (e) { // Fails in IE < 9
	       // This will work for genuine arrays, array-like objects,
	       // NamedNodeMap (attributes, entities, notations),
	       // NodeList (e.g., getElementsByTagName), HTMLCollection (e.g., childNodes),
	       // and will not fail on other DOM objects (as do DOM elements in IE < 9)
	       ap.slice = function (begin, end) {
	           // IE < 9 gets unhappy with an undefined end argument
	           end = (typeof end !== 'undefined') ? end : this.length

	           // For native Array objects, we use the native slice function
	           if (Array.isArray(this)) {
	               return _slice$1.call(this, begin, end)
	           }

	           // For array like object we handle it ourselves.
	           var i, cloned = [],
				size, len = this.length

	           // Handle negative value for "begin"
	           var start = begin || 0
	           start = (start >= 0) ? start : len + start

	           // Handle negative value for "end"
	           var upTo = (end) ? end : len
	           if (end < 0) {
	               upTo = len + end
	           }

	           // Actual expected size of the slice
	           size = upTo - start

	           if (size > 0) {
	               cloned = new Array(size)
	               if (this.charAt) {
	                   for (i = 0; i < size; i++) {
	                       cloned[i] = this.charAt(start + i)
	                   }
	               } else {
	                   for (i = 0; i < size; i++) {
	                       cloned[i] = this[start + i]
	                   }
	               }
	           }

	           return cloned
	       }
	   }

	   function iterator(vars, body, ret) {
	       var fun = 'for(var ' + vars + 'i=0,n = this.length; i < n; i++){' +
			body.replace('_', '((i in this) && fn.call(scope,this[i],i,this))') +
			'}' + ret
	       /* jshint ignore:start */
	       return Function('fn,scope', fun)
	       /* jshint ignore:end */
	   }
	   /* istanbul ignore if*/
	   if (!isNative(ap.map)) {
	       var shim = {
	           //定位操作，返回数组中第一个等于给定参数的元素的索引值。
	           indexOf: function (item, index) {
	               var n = this.length,
					i = ~~index
	               if (i < 0)
	                   i += n
	               for (; i < n; i++)
	                   if (this[i] === item)
	                       return i
	               return -1
	           },
	           //定位操作，同上，不过是从后遍历。
	           lastIndexOf: function (item, index) {
	               var n = this.length,
					i = index == null ? n - 1 : index
	               if (i < 0)
	                   i = Math.max(0, n + i)
	               for (; i >= 0; i--)
	                   if (this[i] === item)
	                       return i
	               return -1
	           },
	           //迭代操作，将数组的元素挨个儿传入一个函数中执行。Prototype.js的对应名字为each。
	           forEach: iterator('', '_', ''),
	           //迭代类 在数组中的每个项上运行一个函数，如果此函数的值为真，则此元素作为新数组的元素收集起来，并返回新数组
	           filter: iterator('r=[],j=0,', 'if(_)r[j++]=this[i]', 'return r'),
	           //收集操作，将数组的元素挨个儿传入一个函数中执行，然后把它们的返回值组成一个新数组返回。Prototype.js的对应名字为collect。
	           map: iterator('r=[],', 'r[i]=_', 'return r'),
	           //只要数组中有一个元素满足条件（放进给定函数返回true），那么它就返回true。Prototype.js的对应名字为any。
	           some: iterator('', 'if(_)return true', 'return false'),
	           //只有数组中的元素都满足条件（放进给定函数返回true），它才返回true。Prototype.js的对应名字为all。
	           every: iterator('', 'if(!_)return false', 'return true')
	       }

	       for (var i in shim) {
	           ap[i] = shim[i]
	       }
	   }

	   var window = Function(' return this')() || this
	   var browser = {
	       window: window,
	       document: {//方便在nodejs环境不会报错
	           createElement: Object,
	           createElementNS: Object,
	           contains: Boolean
	       },
	       root: {
	           outerHTML: 'x'
	       },
	       msie: NaN,
	       browser: false,
	       modern: true,
	       avalonDiv: {},
	       avalonFragment: null
	   }
	   window.avalon = avalon
	   /* istanbul ignore if  */
	   if (window.location && window.navigator && window.window) {
	       var doc = window.document
	       browser.inBrowser = true
	       browser.document = doc
	       browser.root = doc.documentElement
	       browser.avalonDiv = doc.createElement('div')
	       browser.avalonFragment = doc.createDocumentFragment()
	       if (window.VBArray) {
	           browser.msie = doc.documentMode || (window.XMLHttpRequest ? 7 : 6)
	           browser.modern = browser.msie > 8
	       } else {
	           browser.modern = true
	       }
	   }

	   avalon.shadowCopy(avalon, browser)

	   avalon.quote = typeof JSON !== 'undefined' ? JSON.stringify : new function () {
		//https://github.com/bestiejs/json3/blob/master/lib/json3.js
	       var Escapes = {
	           92: "\\\\",
	           34: '\\"',
	           8: "\\b",
	           12: "\\f",
	           10: "\\n",
	           13: "\\r",
	           9: "\\t"
	       }

	       var leadingZeroes = '000000'
	       var toPaddedString = function (width, value) {
	           return (leadingZeroes + (value || 0)).slice(-width)
	       };
	       var unicodePrefix = '\\u00'
	       var escapeChar = function (character) {
	           var charCode = character.charCodeAt(0), escaped = Escapes[charCode]
	           if (escaped) {
	               return escaped
	           }
	           return unicodePrefix + toPaddedString(2, charCode.toString(16))
	       };
	       var reEscape = /[\x00-\x1f\x22\x5c]/g
	       return function (value) {
	           reEscape.lastIndex = 0
	           return '"' + (reEscape.test(value) ? String(value).replace(reEscape, escapeChar) : value) + '"'
	       }
	   }



	   var tos = avalon.inspect
	   var class2type = {}
	   'Boolean Number String Function Array Date RegExp Object Error'.replace(avalon.rword, function (name) {
	       class2type['[object ' + name + ']'] = name.toLowerCase()
	   })

	   avalon.type = function (obj) { //取得目标的类型
	       if (obj == null) {
	           return String(obj)
	       }
	       // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
	       return typeof obj === 'object' || typeof obj === 'function' ?
			class2type[tos.call(obj)] || 'object' :
			typeof obj
	   }





	   var rfunction = /^\s*\bfunction\b/

	   avalon.isFunction = typeof alert === 'object' ? function (fn) {
	       try {
	           return rfunction.test(fn + '')
	       } catch (e) {
	           return false
	       }
	   } : function (fn) {
	       return tos.call(fn) === '[object Function]'
	   }




	   function isWindowCompact(obj) {
	       if (!obj)
	           return false
	       // 利用IE678 window == document为true,document == window竟然为false的神奇特性
	       // 标准浏览器及IE9，IE10等使用 正则检测
	       return obj == obj.document && obj.document != obj //jshint ignore:line
	   }

	   var rwindow = /^\[object (?:Window|DOMWindow|global)\]$/
	   function isWindowModern(obj) {
	       return rwindow.test(tos.call(obj))
	   }

	   avalon.isWindow = isWindowModern(avalon.window) ?
		isWindowModern : isWindowCompact


	   var enu;
	   var enumerateBUG;
	   for (enu in avalon({})) {
	       break
	   }

	   var ohasOwn= avalon.ohasOwn
	   enumerateBUG = enu !== '0' //IE6下为true, 其他为false

	   /*判定是否是一个朴素的javascript对象（Object），不是DOM对象，不是BOM对象，不是自定义类的实例*/
	   function isPlainObjectCompact(obj, key) {
	       if (!obj || avalon.type(obj) !== 'object' || obj.nodeType || avalon.isWindow(obj)) {
	           return false
	       }
	       try { //IE内置对象没有constructor
	           if (obj.constructor &&
				!ohasOwn.call(obj, 'constructor') &&
				!ohasOwn.call(obj.constructor.prototype || {}, 'isPrototypeOf')) {
	               return false
	           }
	       } catch (e) { //IE8 9会在这里抛错
	           return false
	       }
	       if (enumerateBUG) {
	           for (key in obj) {
	               return ohasOwn.call(obj, key)
	           }
	       }
	       for (key in obj) {
	       }
	       return key === void 0 || ohasOwn.call(obj, key)
	   }

	   function isPlainObjectModern(obj) {
	       // 简单的 typeof obj === 'object'检测，会致使用isPlainObject(window)在opera下通不过
	       return tos.call(obj) === '[object Object]' &&
			Object.getPrototypeOf(obj) === Object.prototype
	   }

	   avalon.isPlainObject = /\[native code\]/.test(Object.getPrototypeOf) ?
		isPlainObjectModern : isPlainObjectCompact


	   //与jQuery.extend方法，可用于浅拷贝，深拷贝
	   avalon.mix = avalon.fn.mix = function () {
	       var options, name, src, copy, copyIsArray, clone,
			target = arguments[0] || {},
			i = 1,
			length = arguments.length,
			deep = false

	       // 如果第一个参数为布尔,判定是否深拷贝
	       if (typeof target === 'boolean') {
	           deep = target
	           target = arguments[1] || {}
	           i++
	       }

	       //确保接受方为一个复杂的数据类型
	       if (typeof target !== 'object' && !avalon.isFunction(target)) {
	           target = {}
	       }

	       //如果只有一个参数，那么新成员添加于mix所在的对象上
	       if (i === length) {
	           target = this
	           i--
	       }

	       for (; i < length; i++) {
	           //只处理非空参数
	           if ((options = arguments[i]) != null) {
	               for (name in options) {
	                   try {
	                       src = target[name]
	                       copy = options[name] //当options为VBS对象时报错
	                   } catch (e) {
	                       continue
	                   }

	                   // 防止环引用
	                   if (target === copy) {
	                       continue
	                   }
	                   if (deep && copy && (avalon.isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {

	                       if (copyIsArray) {
	                           copyIsArray = false
	                           clone = src && Array.isArray(src) ? src : []

	                       } else {
	                           clone = src && avalon.isPlainObject(src) ? src : {}
	                       }

	                       target[name] = avalon.mix(deep, clone, copy)
	                   } else if (copy !== void 0) {
	                       target[name] = copy
	                   }
	               }
	           }
	       }
	       return target
	   }

	   var rarraylike = /(Array|List|Collection|Map|Arguments)\]$/
	   /*判定是否类数组，如节点集合，纯数组，arguments与拥有非负整数的length属性的纯JS对象*/
	   function isArrayLike(obj) {
	       if (!obj)
	           return false
	       var n = obj.length
	       /* istanbul ignore if*/
	       if (n === (n >>> 0)) { //检测length属性是否为非负整数
	           var type = tos.call(obj).slice(8, -1)
	           if (rarraylike.test(type))
	               return false
	           if (type === 'Array')
	               return true
	           try {
	               if ({}.propertyIsEnumerable.call(obj, 'length') === false) { //如果是原生对象
	                   return rfunction.test(obj.item || obj.callee)
	               }
	               return true
	           } catch (e) { //IE的NodeList直接抛错
	               return !obj.window //IE6-8 window
	           }
	       }
	       return false
	   }


	   avalon.each = function (obj, fn) {
	       if (obj) { //排除null, undefined
	           var i = 0
	           if (isArrayLike(obj)) {
	               for (var n = obj.length; i < n; i++) {
	                   if (fn(i, obj[i]) === false)
	                       break
	               }
	           } else {
	               for (i in obj) {
	                   if (obj.hasOwnProperty(i) && fn(i, obj[i]) === false) {
	                       break
	                   }
	               }
	           }
	       }
	   }

	   new function welcome() {
	       var welcomeIntro = ["%cavalon.js %c" + avalon.version + " %cin debug mode, %cmore...", "color: rgb(114, 157, 52); font-weight: normal;", "color: rgb(85, 85, 85); font-weight: normal;", "color: rgb(85, 85, 85); font-weight: normal;", "color: rgb(82, 140, 224); font-weight: normal; text-decoration: underline;"];
	       var welcomeMessage = "You're running avalon in debug mode - messages will be printed to the console to help you fix problems and optimise your application.\n\n" +
			'To disable debug mode, add this line at the start of your app:\n\n  avalon.config({debug: false});\n\n' +
			'Debug mode also automatically shut down amicably when your app is minified.\n\n' +
			"Get help and support:\n  https://segmentfault.com/t/avalon\n  http://avalonjs.coding.me/\n  http://www.baidu-x.com/?q=avalonjs\n  http://www.avalon.org.cn/\n\nFound a bug? Raise an issue:\n  https://github.com/RubyLouvre/avalon/issues\n\n";
	       if (typeof console === 'object') {
	           var con = console
	           var method = con.groupCollapsed || con.log
	           Function.apply.call(method, con, welcomeIntro)
	           con.log(welcomeMessage)
	           if (method !== console.log) {
	               con.groupEnd(welcomeIntro);
	           }
	       }
	   }

	/*
	 https://github.com/rsms/js-lru
	 entry             entry             entry             entry        
	 ______            ______            ______            ______       
	 | head |.newer => |      |.newer => |      |.newer => | tail |      
	 |  A   |          |  B   |          |  C   |          |  D   |      
	 |______| <= older.|______| <= older.|______| <= older.|______|      
	 
	 removed  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  <--  added 
	 */
	   function Cache(maxLength) {
	       // 标识当前缓存数组的大小
	       this.size = 0
	       // 标识缓存数组能达到的最大长度
	       this.limit = maxLength
	       //  head（最不常用的项），tail（最常用的项）全部初始化为undefined

	       this.head = this.tail = void 0
	       this._keymap = {}
	   }

	   var p = Cache.prototype

	   p.put = function (key, value) {
	       var entry = {
	           key: key,
	           value: value
	       }
	       this._keymap[key] = entry
	       if (this.tail) {
	           // 如果存在tail（缓存数组的长度不为0），将tail指向新的 entry
	           this.tail.newer = entry
	           entry.older = this.tail
	       } else {
	           // 如果缓存数组的长度为0，将head指向新的entry
	           this.head = entry
	       }
	       this.tail = entry
	       // 如果缓存数组达到上限，则先删除 head 指向的缓存对象
	       /* istanbul ignore if */
	       if (this.size === this.limit) {
	           this.shift()
	       } else {
	           this.size++
	       }
	       return value
	   }

	   p.shift = function () {
	       /* istanbul ignore next */
	       var entry = this.head
	       /* istanbul ignore if */
	       if (entry) {
	           // 删除 head ，并改变指向
	           this.head = this.head.newer
	           // 同步更新 _keymap 里面的属性值
	           this.head.older =
				entry.newer =
				entry.older =
				this._keymap[entry.key] =
				void 0
	           delete this._keymap[entry.key] //#1029
	           // 同步更新 缓存数组的长度
	           this.size--
	       }
	   }
	   p.get = function (key) {
	       var entry = this._keymap[key]
	       // 如果查找不到含有`key`这个属性的缓存对象
	       if (entry === void 0)
	           return
	       // 如果查找到的缓存对象已经是 tail (最近使用过的)
	       /* istanbul ignore if */
	       if (entry === this.tail) {
	           return entry.value
	       }
	       // HEAD--------------TAIL
	       //   <.older   .newer>
	       //  <--- add direction --
	       //   A  B  C  <D>  E
	       if (entry.newer) {
	           // 处理 newer 指向
	           if (entry === this.head) {
	               // 如果查找到的缓存对象是 head (最近最少使用过的)
	               // 则将 head 指向原 head 的 newer 所指向的缓存对象
	               this.head = entry.newer
	           }
	           // 将所查找的缓存对象的下一级的 older 指向所查找的缓存对象的older所指向的值
	           // 例如：A B C D E
	           // 如果查找到的是D，那么将E指向C，不再指向D
	           entry.newer.older = entry.older // C <-- E.
	       }
	       if (entry.older) {
	           // 处理 older 指向
	           // 如果查找到的是D，那么C指向E，不再指向D
	           entry.older.newer = entry.newer // C. --> E
	       }
	       // 处理所查找到的对象的 newer 以及 older 指向
	       entry.newer = void 0 // D --x
	       // older指向之前使用过的变量，即D指向E
	       entry.older = this.tail // D. --> E
	       if (this.tail) {
	           // 将E的newer指向D
	           this.tail.newer = entry // E. <-- D
	       }
	       // 改变 tail 为D 
	       this.tail = entry
	       return entry.value
	   }

	/* 
	 * 对html实体进行转义
	 * https://github.com/substack/node-ent
	 * http://www.cnblogs.com/xdp-gacl/p/3722642.html
	 * http://www.stefankrause.net/js-frameworks-benchmark2/webdriver-java/table.html
	 */

	   var rentities = /&[a-z0-9#]{2,10};/
	   var temp = avalon.avalonDiv
	   avalon.shadowCopy(avalon, {
	       evaluatorPool: new Cache(888),
	       _decode: function (str) {
	           if (rentities.test(str)) {
	               temp.innerHTML = str
	               return temp.innerText || temp.textContent
	           }
	           return str
	       }
	   })

	   var directives = avalon.directives

	   //export default avalon
	   //生成事件回调的UUID(用户通过ms-on指令)
	   function markID(fn) {
	       /* istanbul ignore next */
	       return fn.uuid || (fn.uuid = avalon.makeHashCode('e'))
	   }
	   var UUID = 1
	   //生成事件回调的UUID(用户通过avalon.bind)
	   function markID$1(fn) {
	       /* istanbul ignore next */
	       return fn.uuid || (fn.uuid = '_' + (++UUID))
	   }
	   var quote = avalon.quote
	   var win = avalon.window
	   var doc$1 = avalon.document
	   var root$1 = avalon.root
	   var W3C = avalon.modern
	   var eventHooks = avalon.eventHooks

	   function config(settings) {
	       for (var p in settings) {
			/* istanbul ignore if */
	           if (!avalon.ohasOwn.call(settings, p))
	               continue
	           var val = settings[p]
	           if (typeof config.plugins[p] === 'function') {
	               config.plugins[p](val)
	           } else {
	               config[p] = val
	           }
	       }
	       return this
	   }

	   avalon.config = config

	   var plugins = {
	       interpolate: function (array) {
	           var openTag = array[0]
	           var closeTag = array[1]
	           /*eslint-disable */
			/* istanbul ignore if */
	           if (openTag === closeTag) {
	               throw new SyntaxError('openTag!==closeTag')
	           }
	           var test = openTag + 'test' + closeTag
	           var div = avalon.avalonDiv
	           div.innerHTML = test
			/* istanbul ignore if */
	           if (div.innerHTML !== test && div.innerHTML.indexOf('&lt;') > -1) {
	               throw new SyntaxError('此定界符不合法')
	           }
	           div.innerHTML = ''
	           /*eslint-enable */
	           config.openTag = openTag
	           config.closeTag = closeTag
	           var o = avalon.escapeRegExp(openTag)
	           var c = avalon.escapeRegExp(closeTag)
	           config.rexpr = new RegExp(o + '([\\s\\S]*)' + c)
	       }
	   }
	   config.plugins = plugins
	   avalon.config({
	       interpolate: ['{{', '}}'],
	       debug: true
	   })

	   function numberFilter(number, decimals, point, thousands) {
		//form http://phpjs.org/functions/number_format/
		//number 必需，要格式化的数字
		//decimals 可选，规定多少个小数位。
		//point 可选，规定用作小数点的字符串（默认为 . ）。
		//thousands 可选，规定用作千位分隔符的字符串（默认为 , ），如果设置了该参数，那么所有其他参数都是必需的。
		number = (number + '')
			.replace(/[^0-9+\-Ee.]/g, '')
		var n = !isFinite(+number) ? 0 : +number,
			prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
			sep = thousands || ",",
			dec = point || ".",
			s = '',
			toFixedFix = function (n, prec) {
				var k = Math.pow(10, prec)
				return '' + (Math.round(n * k) / k)
					.toFixed(prec)
			}
		// Fix for IE parseFloat(0.55).toFixed(0) = 0;
		s = (prec ? toFixedFix(n, prec) : '' + Math.round(n))
			.split('.')
		if (s[0].length > 3) {
			s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep)
		}
		if ((s[1] || '')
			.length < prec) {
			s[1] = s[1] || ''
			s[1] += new Array(prec - s[1].length + 1)
				.join('0')
		}
		return s.join(dec)
	   }

	   var rscripts = /<script[^>]*>([\S\s]*?)<\/script\s*>/gim
	   var ron = /\s+(on[^=\s]+)(?:=("[^"]*"|'[^']*'|[^\s>]+))?/g
	   var ropen = /<\w+\b(?:(["'])[^"]*?(\1)|[^>])*>/ig
	   var rsanitize = {
	       a: /\b(href)\=("javascript[^"]*"|'javascript[^']*')/ig,
	       img: /\b(src)\=("javascript[^"]*"|'javascript[^']*')/ig,
	       form: /\b(action)\=("javascript[^"]*"|'javascript[^']*')/ig
	   }

	   //https://www.owasp.org/index.php/XSS_Filter_Evasion_Cheat_Sheet
	   //    <a href="javasc&NewLine;ript&colon;alert('XSS')">chrome</a> 
	   //    <a href="data:text/html;base64, PGltZyBzcmM9eCBvbmVycm9yPWFsZXJ0KDEpPg==">chrome</a>
	   //    <a href="jav	ascript:alert('XSS');">IE67chrome</a>
	   //    <a href="jav&#x09;ascript:alert('XSS');">IE67chrome</a>
	   //    <a href="jav&#x0A;ascript:alert('XSS');">IE67chrome</a>
	   function sanitizeFilter(str) {
	       return str.replace(rscripts, "").replace(ropen, function (a, b) {
	           var match = a.toLowerCase().match(/<(\w+)\s/)
	           if (match) { //处理a标签的href属性，img标签的src属性，form标签的action属性
	               var reg = rsanitize[match[1]]
	               if (reg) {
	                   a = a.replace(reg, function (s, name, value) {
	                       var quote = value.charAt(0)
	                       return name + "=" + quote + "javascript:void(0)" + quote// jshint ignore:line
	                   })
	               }
	           }
	           return a.replace(ron, " ").replace(/\s+/g, " ") //移除onXXX事件
	       })
	   }

	/*
	 'yyyy': 4 digit representation of year (e.g. AD 1 => 0001, AD 2010 => 2010)
	 'yy': 2 digit representation of year, padded (00-99). (e.g. AD 2001 => 01, AD 2010 => 10)
	 'y': 1 digit representation of year, e.g. (AD 1 => 1, AD 199 => 199)
	 'MMMM': Month in year (January-December)
	 'MMM': Month in year (Jan-Dec)
	 'MM': Month in year, padded (01-12)
	 'M': Month in year (1-12)
	 'dd': Day in month, padded (01-31)
	 'd': Day in month (1-31)
	 'EEEE': Day in Week,(Sunday-Saturday)
	 'EEE': Day in Week, (Sun-Sat)
	 'HH': Hour in day, padded (00-23)
	 'H': Hour in day (0-23)
	 'hh': Hour in am/pm, padded (01-12)
	 'h': Hour in am/pm, (1-12)
	 'mm': Minute in hour, padded (00-59)
	 'm': Minute in hour (0-59)
	 'ss': Second in minute, padded (00-59)
	 's': Second in minute (0-59)
	 'a': am/pm marker
	 'Z': 4 digit (+sign) representation of the timezone offset (-1200-+1200)
	 format string can also be one of the following predefined localizable formats:
	 
	 'medium': equivalent to 'MMM d, y h:mm:ss a' for en_US locale (e.g. Sep 3, 2010 12:05:08 pm)
	 'short': equivalent to 'M/d/yy h:mm a' for en_US locale (e.g. 9/3/10 12:05 pm)
	 'fullDate': equivalent to 'EEEE, MMMM d,y' for en_US locale (e.g. Friday, September 3, 2010)
	 'longDate': equivalent to 'MMMM d, y' for en_US locale (e.g. September 3, 2010
	 'mediumDate': equivalent to 'MMM d, y' for en_US locale (e.g. Sep 3, 2010)
	 'shortDate': equivalent to 'M/d/yy' for en_US locale (e.g. 9/3/10)
	 'mediumTime': equivalent to 'h:mm:ss a' for en_US locale (e.g. 12:05:08 pm)
	 'shortTime': equivalent to 'h:mm a' for en_US locale (e.g. 12:05 pm)
	 */

	   function toInt(str) {
	       return parseInt(str, 10) || 0
	   }

	   function padNumber(num, digits, trim) {
	       var neg = ''
	       /* istanbul ignore if*/
	       if (num < 0) {
	           neg = '-'
	           num = -num
	       }
	       num = '' + num
	       while (num.length < digits)
	           num = '0' + num
	       if (trim)
	           num = num.substr(num.length - digits)
	       return neg + num
	   }

	   function dateGetter(name, size, offset, trim) {
	       return function (date) {
	           var value = date["get" + name]()
	           if (offset > 0 || value > -offset)
	               value += offset
	           if (value === 0 && offset === -12) {
	               /* istanbul ignore next*/
	               value = 12
	           }
	           return padNumber(value, size, trim)
	       }
	   }

	   function dateStrGetter(name, shortForm) {
	       return function (date, formats) {
	           var value = date["get" + name]()
	           var get = (shortForm ? ("SHORT" + name) : name).toUpperCase()
	           return formats[get][value]
	       }
	   }

	   function timeZoneGetter(date) {
	       var zone = -1 * date.getTimezoneOffset()
	       var paddedZone = (zone >= 0) ? "+" : ""
	       paddedZone += padNumber(Math[zone > 0 ? "floor" : "ceil"](zone / 60), 2) + padNumber(Math.abs(zone % 60), 2)
	       return paddedZone
	   }
	   //取得上午下午
	   function ampmGetter(date, formats) {
	       return date.getHours() < 12 ? formats.AMPMS[0] : formats.AMPMS[1]
	   }
	   var DATE_FORMATS = {
	       yyyy: dateGetter("FullYear", 4),
	       yy: dateGetter("FullYear", 2, 0, true),
	       y: dateGetter("FullYear", 1),
	       MMMM: dateStrGetter("Month"),
	       MMM: dateStrGetter("Month", true),
	       MM: dateGetter("Month", 2, 1),
	       M: dateGetter("Month", 1, 1),
	       dd: dateGetter("Date", 2),
	       d: dateGetter("Date", 1),
	       HH: dateGetter("Hours", 2),
	       H: dateGetter("Hours", 1),
	       hh: dateGetter("Hours", 2, -12),
	       h: dateGetter("Hours", 1, -12),
	       mm: dateGetter("Minutes", 2),
	       m: dateGetter("Minutes", 1),
	       ss: dateGetter("Seconds", 2),
	       s: dateGetter("Seconds", 1),
	       sss: dateGetter("Milliseconds", 3),
	       EEEE: dateStrGetter("Day"),
	       EEE: dateStrGetter("Day", true),
	       a: ampmGetter,
	       Z: timeZoneGetter
	   }
	   var rdateFormat = /((?:[^yMdHhmsaZE']+)|(?:'(?:[^']|'')*')|(?:E+|y+|M+|d+|H+|h+|m+|s+|a|Z))(.*)/
	   var raspnetjson = /^\/Date\((\d+)\)\/$/
	   function dateFilter(date, format) {
	       var locate = dateFilter.locate,
	           text = "",
	           parts = [],
	           fn, match
	       format = format || "mediumDate"
	       format = locate[format] || format
	       if (typeof date === "string") {
	           if (/^\d+$/.test(date)) {
	               date = toInt(date)
	           } else if (raspnetjson.test(date)) {
	               date = +RegExp.$1
	           } else {
	               var trimDate = date.trim()
	               var dateArray = [0, 0, 0, 0, 0, 0, 0]
	               var oDate = new Date(0)
	               //取得年月日
	               trimDate = trimDate.replace(/^(\d+)\D(\d+)\D(\d+)/, function (_, a, b, c) {
	                   var array = c.length === 4 ? [c, a, b] : [a, b, c]
	                   dateArray[0] = toInt(array[0])     //年
	                   dateArray[1] = toInt(array[1]) - 1 //月
	                   dateArray[2] = toInt(array[2])     //日
	                   return ""
	               })
	               var dateSetter = oDate.setFullYear
	               var timeSetter = oDate.setHours
	               trimDate = trimDate.replace(/[T\s](\d+):(\d+):?(\d+)?\.?(\d)?/, function (_, a, b, c, d) {
	                   dateArray[3] = toInt(a) //小时
	                   dateArray[4] = toInt(b) //分钟
	                   dateArray[5] = toInt(c) //秒
	                   if (d) {                //毫秒
	                       dateArray[6] = Math.round(parseFloat("0." + d) * 1000)
	                   }
	                   return ""
	               })
	               var tzHour = 0
	               var tzMin = 0
	               trimDate = trimDate.replace(/Z|([+-])(\d\d):?(\d\d)/, function (z, symbol, c, d) {
	                   dateSetter = oDate.setUTCFullYear
	                   timeSetter = oDate.setUTCHours
	                   if (symbol) {
	                       tzHour = toInt(symbol + c)
	                       tzMin = toInt(symbol + d)
	                   }
	                   return ''
	               })

	               dateArray[3] -= tzHour
	               dateArray[4] -= tzMin
	               dateSetter.apply(oDate, dateArray.slice(0, 3))
	               timeSetter.apply(oDate, dateArray.slice(3))
	               date = oDate
	           }
	       }
	       if (typeof date === 'number') {
	           date = new Date(date)
	       }

	       while (format) {
	           match = rdateFormat.exec(format)
	           /* istanbul ignore else */
	           if (match) {
	               parts = parts.concat(match.slice(1))
	               format = parts.pop()
	           } else {
	               parts.push(format)
	               format = null
	           }
	       }
	       parts.forEach(function (value) {
	           fn = DATE_FORMATS[value]
	           text += fn ? fn(date, locate) : value.replace(/(^'|'$)/g, "").replace(/''/g, "'")
	       })
	       return text
	   }


	   var locate = {
	       AMPMS: {
	           0: '上午',
	           1: '下午'
	       },
	       DAY: {
	           0: '星期日',
	           1: '星期一',
	           2: '星期二',
	           3: '星期三',
	           4: '星期四',
	           5: '星期五',
	           6: '星期六'
	       },
	       MONTH: {
	           0: '1月',
	           1: '2月',
	           2: '3月',
	           3: '4月',
	           4: '5月',
	           5: '6月',
	           6: '7月',
	           7: '8月',
	           8: '9月',
	           9: '10月',
	           10: '11月',
	           11: '12月'
	       },
	       SHORTDAY: {
	           '0': '周日',
	           '1': '周一',
	           '2': '周二',
	           '3': '周三',
	           '4': '周四',
	           '5': '周五',
	           '6': '周六'
	       },
	       fullDate: 'y年M月d日EEEE',
	       longDate: 'y年M月d日',
	       medium: 'yyyy-M-d H:mm:ss',
	       mediumDate: 'yyyy-M-d',
	       mediumTime: 'H:mm:ss',
	       'short': 'yy-M-d ah:mm',
	       shortDate: 'yy-M-d',
	       shortTime: 'ah:mm'
	   }
	   locate.SHORTMONTH = locate.MONTH
	   dateFilter.locate = locate

	   function orderBy(array, criteria, reverse) {
	       var type = avalon.type(array)
	       if (type !== 'array' && type !== 'object')
	           throw 'orderBy只能处理对象或数组'
	       var order = (reverse && reverse < 0) ? -1 : 1

	       if (typeof criteria === 'string') {
	           var key = criteria
	           criteria = function (a) {
	               return a && a[key]
	           }
	       }
	       array = convertArray(array)
	       array.forEach(function (el) {
	           el.order = criteria(el.value, el.key)
	       })
	       array.sort(function (left, right) {
	           var a = left.order
	           var b = right.order
	           /* istanbul ignore if */
	           if (Number.isNaN(a) && Number.isNaN(b)) {
	               return 0
	           }
	           return a === b ? 0 : a > b ? order : -order
	       })
	       var isArray = type === 'array'
	       var target = isArray ? [] : {}
	       return recovery(target, array, function (el) {
	           if (isArray) {
	               target.push(el.value)
	           } else {
	               target[el.key] = el.value
	           }
	       })
	   }

	   function filterBy(array, search) {
	       var type = avalon.type(array)
	       if (type !== 'array' && type !== 'object')
	           throw 'filterBy只能处理对象或数组'
	       var args = avalon.slice(arguments, 2)
	       var stype = avalon.type(search)
	       if (stype === 'function') {
	           var criteria = search
	       } else if (stype === 'string' || stype === 'number') {
	           if (search === '') {
	               return array
	           } else {
	               var reg = new RegExp(avalon.escapeRegExp(search), 'i')
	               criteria = function (el) {
	                   return reg.test(el)
	               }
	           }
	       } else {
	           return array
	       }

	       array = convertArray(array).filter(function (el, i) {
	           return !!criteria.apply(el, [el.value, i].concat(args))
	       })

	       var isArray = type === 'array'
	       var target = isArray ? [] : {}
	       return recovery(target, array, function (el) {
	           if (isArray) {
	               target.push(el.value)
	           } else {
	               target[el.key] = el.value
	           }
	       })
	   }

	   function selectBy(data, array, defaults) {
	       if (avalon.isObject(data) && !Array.isArray(data)) {
	           var target = []
	           return recovery(target, array, function (name) {
	               target.push(data.hasOwnProperty(name) ? data[name] : defaults ? defaults[name] : '')
	           })
	       } else {
	           return data
	       }
	   }

	   Number.isNaN = Number.isNaN || /* istanbul ignore next*/ function (a) {
	       return a !== a
	   }

	   function limitBy(input, limit, begin) {
	       var type = avalon.type(input)
	       if (type !== 'array' && type !== 'object')
	           throw 'limitBy只能处理对象或数组'
	       //必须是数值
	       if (typeof limit !== 'number') {
	           return input
	       }
	       //不能为NaN
	       if (Number.isNaN(limit)) {
	           return input
	       }
	       //将目标转换为数组
	       if (type === 'object') {
	           input = convertArray(input)
	       }
	       var n = input.length
	       limit = Math.floor(Math.min(n, limit))
	       begin = typeof begin === 'number' ? begin : 0
	       if (begin < 0) {
	           begin = Math.max(0, n + begin)
	       }
	       var data = []
	       for (var i = begin; i < n; i++) {
	           if (data.length === limit) {
	               break
	           }
	           data.push(input[i])
	       }
	       var isArray = type === 'array'
	       if (isArray) {
	           return data
	       }
	       var target = {}
	       return recovery(target, data, function (el) {
	           target[el.key] = el.value
	       })
	   }

	   function recovery(ret, array, callback) {
	       for (var i = 0, n = array.length; i < n; i++) {
	           callback(array[i])
	       }
	       return ret
	   }


	   function convertArray(array) {
	       var ret = [], i = 0
	       avalon.each(array, function (key, value) {
	           ret[i++] = {
	               value: value,
	               key: key
	           }
	       })
	       return ret
	   }

	var arrayFilters = Object.freeze({
	       orderBy: orderBy,
	       filterBy: filterBy,
	       selectBy: selectBy,
	       limitBy: limitBy
	   });

	   var eventFilters = {
	       stop: function (e) {
	           e.stopPropagation()
	           return e
	       },
	       prevent: function (e) {
	           e.preventDefault()
	           return e
	       }
	   }
	   var keys = {
	       esc: 27,
	       tab: 9,
	       enter: 13,
	       space: 32,
	       del: 46,
	       up: 38,
	       left: 37,
	       right: 39,
	       down: 40
	   }
	   for (var name in keys) {
	       (function (filter, key) {
	           eventFilters[filter] = function (e) {
	               if (e.which !== key) {
	                   e.$return = true
	               }
	               return e
	           }
	       })(name, keys[name])
	   }

	   //https://github.com/teppeis/htmlspecialchars
	   function escapeFilter(str) {
	       if (str == null)
	           return ''

	       return String(str).
	           replace(/&/g, '&amp;').
	           replace(/</g, '&lt;').
	           replace(/>/g, '&gt;').
	           replace(/"/g, '&quot;').
	           replace(/'/g, '&#39;')
	   }

	   var filters = avalon.filters

	   function K(a) {
	       /* istanbul ignore next*/
	       return a
	   }
	   avalon.escapeHtml = escapeFilter

	   avalon.__format__ = function (name) {
	       var fn = filters[name]
	       if (fn) {
	           return fn
	       }
	       return K
	   }

	   avalon.mix(filters, {
	       uppercase: function (str) {
	           return String(str).toUpperCase()
	       },
	       lowercase: function (str) {
	           return String(str).toLowerCase()
	       },
	       truncate: function (str, length, end) {
	           //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
	           if (!str) {
	               return ''
	           }
	           str = String(str)
	           if (isNaN(length)) {
	               length = 30
	           }
	           end = typeof end === "string" ? end : "..."
	           return str.length > length ?
	               str.slice(0, length - end.length) + end :/* istanbul ignore else*/
	               str
	       },
	       camelize: avalon.camelize,
	       date: dateFilter,
	       escape: escapeFilter,
	       sanitize: sanitizeFilter,
	       number: numberFilter,
	       currency: function (amount, symbol, fractionSize) {
	           return (symbol || '\u00a5') +
	               numberFilter(amount,
	                   isFinite(fractionSize) ?/* istanbul ignore else*/ fractionSize : 2)
	       }
	   }, arrayFilters, eventFilters)

	   function VText(text) {
	       this.nodeName = '#text'
	       this.nodeValue = text
	       this.skipContent = !avalon.config.rexpr.test(text)
	   }

	   VText.prototype = {
	       constructor: VText,
	       toDOM: function () {
	           /* istanbul ignore if*/
	           if (this.dom)
	               return this.dom
	           var v = avalon._decode(this.nodeValue)
	           return this.dom = document.createTextNode(v)
	       },
	       toHTML: function () {
	           return this.nodeValue
	       }
	   }

	   function VComment(text) {
	       this.nodeName = '#comment'
	       this.nodeValue = text
	   }
	   VComment.prototype = {
	       constructor: VComment,
	       toDOM: function () {
	           return this.dom = document.createComment(this.nodeValue)
	       },
	       toHTML: function () {
	           return '<!--' + this.nodeValue + '-->'
	       }
	   }

	   function VElement(type, props, children) {
	       this.nodeName = type
	       this.props = props
	       this.children = children
	   }

	   function skipFalseAndFunction(a) {
	       return a !== false && (Object(a) !== a)
	   }

	   var specalAttrs = {
	       "class": function (dom, val) {
	           dom.className = val
	       },
	       style: function (dom, val) {
	           dom.style.cssText = val
	       },
	       type: function (dom, val) {
	           try { //textarea,button 元素在IE6,7设置 type 属性会抛错
	               dom.type = val
	           } catch (e) { }
	       },
	       'for': function (dom, val) {
	           dom.htmlFor = val
	       }
	   }

	   VElement.prototype = {
	       constructor: VElement,
	       toDOM: function () {
	           if (this.dom)
	               return this.dom
	           var dom, tagName = this.nodeName
	           if (avalon.modern && svgTags[tagName]) {
	               dom = createSVG(tagName)
	           } else if (!avalon.modern && (VMLTags[tagName] || rvml.test(tagName))) {
	               dom = createVML(tagName)
	           } else {
	               dom = document.createElement(tagName)
	           }

	           var props = this.props || {}
	           var wid = (props['ms-important'] ||
				props['ms-controller'] || this.wid)
	           if (wid) {
	               var scope = avalon.scopes[wid]
	               var element = scope && scope.vmodel && scope.vmodel.$element
	               if (element) {
	                   var oldVdom = element.vtree[0]
	                   if (oldVdom.children) {
	                       this.children = oldVdom.children
	                   }
	                   return element
	               }
	           }
	           for (var i in props) {
	               var val = props[i]
	               if (skipFalseAndFunction(val)) {
	                   if (specalAttrs[i] && avalon.msie < 8) {
	                       specalAttrs[i](dom, val)
	                   } else {
	                       dom.setAttribute(i, val + '')
	                   }
	               }
	           }
	           var c = this.children || []
	           var template = c[0] ? c[0].nodeValue : ''
	           switch (this.nodeName) {
	               case 'script':
	                   dom.text = template
	                   break
	               case 'style':
	                   if ('styleSheet' in dom) {
	                       dom.setAttribute('type', 'text/css')
	                       dom.styleSheet.cssText = template
	                   } else {
	                       dom.innerHTML = template
	                   }
	                   break
	               case 'xmp'://IE6-8,XMP元素里面只能有文本节点,不能使用innerHTML
	               case 'noscript':
	                   dom.innerText = dom.textContent = template
	                   break
	               case 'template':
	                   dom.innerHTML = template
	                   break
	               default:
	                   if (!this.isVoidTag) {
	                       this.children.forEach(function (c) {
	                           c && dom.appendChild(avalon.vdom(c, 'toDOM'))
	                       })
	                   }
	                   break
	           }
	           return this.dom = dom
	       },
	       toHTML: function () {
	           var arr = []
	           var props = this.props || {}
	           for (var i in props) {
	               var val = props[i]
	               if (skipFalseAndFunction(val)) {
	                   arr.push(i + '=' + avalon.quote(props[i] + ''))
	               }
	           }
	           arr = arr.length ? ' ' + arr.join(' ') : ''
	           var str = '<' + this.nodeName + arr
	           if (this.isVoidTag) {
	               return str + '/>'
	           }
	           str += '>'
	           if (this.children) {
	               str += this.children.map(function (c) {
	                   return c ? avalon.vdom(c, 'toHTML') : ''
	               }).join('')
	           }
	           return str + '</' + this.nodeName + '>'
	       }
	   }
	   function createSVG(type) {
	       return document.createElementNS('http://www.w3.org/2000/svg', type)
	   }
	   var svgTags = avalon.oneObject('circle,defs,ellipse,image,line,' +
		'path,polygon,polyline,rect,symbol,text,use,g,svg')

	   var rvml = /^\w+\:\w+/

	   function createVML(type) {
	       if (document.styleSheets.length < 31) {
	           document.createStyleSheet().addRule(".rvml", "behavior:url(#default#VML)");
	       } else {
	           // no more room, add to the existing one
	           // http://msdn.microsoft.com/en-us/library/ms531194%28VS.85%29.aspx
	           document.styleSheets[0].addRule(".rvml", "behavior:url(#default#VML)");
	       }
	       var arr = type.split(':')
	       if (arr.length === 1) {
	           arr.unshift('v')
	       }
	       var tag = arr[1]
	       var ns = arr[0]
	       if (!document.namespaces[ns]) {
	           document.namespaces.add(ns, "urn:schemas-microsoft-com:vml")
	       }
	       return document.createElement('<' + ns + ':' + tag + ' class="rvml">');
	   }

	   var VMLTags = avalon.oneObject('shape,line,polyline,rect,roundrect,oval,arc,' +
		'curve,background,image,shapetype,group,fill,' +
		'stroke,shadow, extrusion, textbox, imagedata, textpath')

	   function VFragment(a) {
	       this.nodeName = '#document-fragment'
	       this.children = a
	   }

	   VFragment.prototype = {
	       constructor: VFragment,
	       toDOM: function () {
	           if (this.dom)
	               return this.dom
	           var f = document.createDocumentFragment()
	           for (var i = 0, el; el = this.children[i++];) {
	               f.appendChild(avalon.vdom(el, 'toDOM'))
	           }
	           this.split = f.lastChild
	           return this.dom = f
	       },
	       toHTML: function () {
	           return this.children.map(function (a) {
	               return avalon.vdom(a, 'toHTML')
	           }).join('')
	       }
	   }

	   avalon.vdom = avalon.vdomAdaptor = function (obj, method) {
	       if (!obj) {//obj在ms-for循环里面可能是null
	           return method === "toHTML" ? '' : document.createDocumentFragment()
	       }
	       switch (obj.nodeName) {
	           case '#text':
	               return VText.prototype[method].call(obj)
	           case '#comment':
	               return VComment.prototype[method].call(obj)
	           case '#document-fragment':
	               return VFragment.prototype[method].call(obj)
	           case void (0):
	               return (new VFragment(obj))[method]()
	           default:
	               return VElement.prototype[method].call(obj)
	       }
	   }
	   var mix = {
	       VText: VText,
	       VComment: VComment,
	       VElement: VElement,
	       VFragment: VFragment
	   }

	   avalon.shadowCopy(avalon.vdom, mix)


	   avalon.domize = function (a) {
	       return avalon.vdom(a, 'toDOM')
	   }

	   var rcheckedType = /radio|checkbox/

	   function fix(dest, src) {
	       if (dest.nodeType !== 1) {
	           return
	       }
	       var nodeName = dest.nodeName.toLowerCase()
	       if (nodeName === 'object') {
	           if (dest.parentNode) {
	               dest.outerHTML = src.outerHTML
	           }

	       } else if (nodeName === 'input' && rcheckedType.test(src.nodeName)) {

	           dest.defaultChecked = dest.checked = src.checked

	           if (dest.value !== src.value) {
	               dest.value = src.value
	           }

	       } else if (nodeName === 'option') {
	           dest.defaultSelected = dest.selected = src.defaultSelected
	       } else if (nodeName === 'input' || nodeName === 'textarea') {
	           dest.defaultValue = src.defaultValue
	       }
	   }


	   function getAll(context) {
	       return typeof context.getElementsByTagName !== 'undefined' ?
			context.getElementsByTagName('*') :
			typeof context.querySelectorAll !== 'undefined' ?
	               context.querySelectorAll('*') : []
	   }

	   function fixCloneNode(src) {
	       var target = src.cloneNode(true)
	       var t = getAll(target)
	       var s = getAll(src)
	       for (var i = 0; i < s.length; i++) {
	           fix(t[i], s[i])
	       }
	       return target
	   }

	   avalon.cloneNode = function (a) {
	       return a.cloneNode(true)
	   }

	   function fixContains(root, el) {
	       try { //IE6-8,游离于DOM树外的文本节点，访问parentNode有时会抛错
	           while ((el = el.parentNode))
	               if (el === root)
	                   return true
	           return false
	       } catch (e) {
	           return false
	       }
	   }

	   avalon.contains = fixContains
	   //IE6-11的文档对象没有contains
	   if (avalon.browser) {
	       if (avalon.msie < 10) {
	           avalon.cloneNode = fixCloneNode
	       }
	       if (!document.contains) {
	           document.contains = function (b) {
	               return fixContains(document, b)
	           }
	       }
	       if (window.Node && !document.createTextNode('x').contains) {
	           Node.prototype.contains = function (arg) {//IE6-8没有Node对象
	               return !!(this.compareDocumentPosition(arg) & 16)
	           }
	       }

		//firefox 到11时才有outerHTML
	       if (window.HTMLElement && !avalon.root.outerHTML) {
	           HTMLElement.prototype.__defineGetter__('outerHTML', function () {
	               var div = document.createElement('div')
	               div.appendChild(this)
	               return div.innerHTML
	           })
	       }

	   }

	   var rnowhite = /\S+/g
	   var fakeClassListMethods = {
	       _toString: function () {
	           var node = this.node
	           var cls = node.className
	           var str = typeof cls === 'string' ? cls : cls.baseVal
	           var match = str.match(rnowhite)
	           return match ? match.join(' ') : ''
	       },
	       _contains: function (cls) {
	           return (' ' + this + ' ').indexOf(' ' + cls + ' ') > -1
	       },
	       _add: function (cls) {
	           if (!this.contains(cls)) {
	               this._set(this + ' ' + cls)
	           }
	       },
	       _remove: function (cls) {
	           this._set((' ' + this + ' ').replace(' ' + cls + ' ', ' '))
	       },
	       __set: function (cls) {
	           cls = cls.trim()
	           var node = this.node
	           if (typeof node.className === 'object') {
	               //SVG元素的className是一个对象 SVGAnimatedString { baseVal='', animVal=''}，只能通过set/getAttribute操作
	               node.setAttribute('class', cls)
	           } else {
	               node.className = cls
	           }
	       } //toggle存在版本差异，因此不使用它
	   }

	   function fakeClassList(node) {
	       if (!('classList' in node)) {
	           node.classList = {
	               node: node
	           }
	           for (var k in fakeClassListMethods) {
	               node.classList[k.slice(1)] = fakeClassListMethods[k]
	           }
	       }
	       return node.classList
	   }


	   'add,remove'.replace(avalon.rword, function (method) {
	       avalon.fn[method + 'Class'] = function (cls) {
	           var el = this[0] || {}
	           //https://developer.mozilla.org/zh-CN/docs/Mozilla/Firefox/Releases/26
	           if (cls && typeof cls === 'string' && el.nodeType === 1) {
	               cls.replace(rnowhite, function (c) {
	                   fakeClassList(el)[method](c)
	               })
	           }
	           return this
	       }
	   })

	   avalon.shadowCopy(avalon.fn, {
	       hasClass: function (cls) {
	           var el = this[0] || {}
	           return el.nodeType === 1 && fakeClassList(el).contains(cls)
	       },
	       toggleClass: function (value, stateVal) {
	           var isBool = typeof stateVal === 'boolean'
	           var me = this
	           String(value).replace(rnowhite, function (c) {
	               var state = isBool ? stateVal : !me.hasClass(c)
	               me[state ? 'addClass' : 'removeClass'](c)
	           })
	           return this
	       }
	   })

	   var propMap = {//不规则的属性名映射
	       'accept-charset': 'acceptCharset',
	       'char': 'ch',
	       charoff: 'chOff',
	       'class': 'className',
	       'for': 'htmlFor',
	       'http-equiv': 'httpEquiv'
	   }
	/*
	contenteditable不是布尔属性
	http://www.zhangxinxu.com/wordpress/2016/01/contenteditable-plaintext-only/
	contenteditable=''
	contenteditable='events'
	contenteditable='caret'
	contenteditable='plaintext-only'
	contenteditable='true'
	contenteditable='false'
	 */
	   var bools = ['autofocus,autoplay,async,allowTransparency,checked,controls',
	       'declare,disabled,defer,defaultChecked,defaultSelected,',
	       'isMap,loop,multiple,noHref,noResize,noShade',
	       'open,readOnly,selected'
	   ].join(',')

	   bools.replace(/\w+/g, function (name) {
	       propMap[name.toLowerCase()] = name
	   })

	   var anomaly = ['accessKey,bgColor,cellPadding,cellSpacing,codeBase,codeType,colSpan',
	       'dateTime,defaultValue,contentEditable,frameBorder,longDesc,maxLength,' +
	       'marginWidth,marginHeight,rowSpan,tabIndex,useMap,vSpace,valueType,vAlign'
	   ].join(',')

	   anomaly.replace(/\w+/g, function (name) {
	       propMap[name.toLowerCase()] = name
	   })

	   //module.exports = propMap

	   function isVML(src) {
	       var nodeName = src.nodeName
	       return nodeName.toLowerCase() === nodeName && src.scopeName && src.outerText === ''
	   }

	   var rsvg = /^\[object SVG\w*Element\]$/
	   var ramp = /&amp;/g

	   function attrUpdate(node, vnode) {
		/* istanbul ignore if*/
	       if (!node || node.nodeType !== 1) {
	           return
	       }
	       vnode.dynamic['ms-attr'] = 1
	       var attrs = vnode['ms-attr']
	       for (var attrName in attrs) {
	           var val = attrs[attrName]
	           // 处理路径属性
	           /* istanbul ignore if*/
	           if (attrName === 'href' || attrName === 'src') {
	               if (!node.hasAttribute) {
	                   val = String(val).replace(ramp, '&') //处理IE67自动转义的问题
	               }
	               node[attrName] = val
	               /* istanbul ignore if*/
	               if (window.chrome && node.tagName === 'EMBED') {
	                   var parent = node.parentNode //#525  chrome1-37下embed标签动态设置src不能发生请求
	                   var comment = document.createComment('ms-src')
	                   parent.replaceChild(comment, node)
	                   parent.replaceChild(node, comment)
	               }
	               //处理HTML5 data-*属性
	           } else if (attrName.indexOf('data-') === 0) {
	               node.setAttribute(attrName, val)

	           } else {
	               var propName = propMap[attrName] || attrName
	               if (typeof node[propName] === 'boolean') {
	                   node[propName] = !!val

	                   //布尔属性必须使用el.xxx = true|false方式设值
	                   //如果为false, IE全系列下相当于setAttribute(xxx,''),
	                   //会影响到样式,需要进一步处理
	               }

	               if (val === false) {//移除属性
	                   node.removeAttribute(propName)
	                   continue
	               }
	               //SVG只能使用setAttribute(xxx, yyy), VML只能使用node.xxx = yyy ,
	               //HTML的固有属性必须node.xxx = yyy

	               var isInnate = rsvg.test(node) ? false :
					(!avalon.modern && isVML(node)) ? true :
	                       attrName in node.cloneNode(false)
	               if (isInnate) {
	                   node[propName] = val + ''
	               } else {
	                   node.setAttribute(attrName, val)
	               }
	           }
	       }
	   }
	   var rvalidchars = /^[\],:{}\s]*$/;
	   var rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g;
	   var rvalidescape = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g;
	   var rvalidtokens = /"[^"\\\r\n]*"|true|false|null|-?(?:\d+\.|)\d+(?:[eE][+-]?\d+|)/g;
	   avalon.parseJSON = typeof JSON === 'object' ? JSON.parse : function (data) {
	       if (typeof data === 'string') {
	           data = data.trim()
	           if (data) {
	               if (rvalidchars.test(data.replace(rvalidescape, '@')
					.replace(rvalidtokens, ']')
					.replace(rvalidbraces, ''))) {
	                   return (new Function('return ' + data))() // jshint ignore:line
	               }
	           }
	           avalon.error('Invalid JSON: ' + data)
	       }
	       return data
	   }


	   avalon.fn.attr = function (name, value) {
	       if (arguments.length === 2) {
	           this[0].setAttribute(name, value)
	           return this
	       } else {
	           return this[0].getAttribute(name)
	       }
	   }

	   var cssHooks$1 = avalon.cssHooks
	   var cssMap = {
	       'float': 'cssFloat'
	   }
	   avalon.cssNumber = avalon.oneObject('animationIterationCount,columnCount,order,flex,flexGrow,flexShrink,fillOpacity,fontWeight,lineHeight,opacity,orphans,widows,zIndex,zoom')
	   var prefixes = ['', '-webkit-', '-o-', '-moz-', '-ms-']

	   avalon.cssName = function (name, host, camelCase) {
	       if (cssMap[name]) {
	           return cssMap[name]
	       }
	       host = host || avalon.root.style || {}
	       for (var i = 0, n = prefixes.length; i < n; i++) {
	           camelCase = avalon.camelize(prefixes[i] + name)
	           if (camelCase in host) {
	               return (cssMap[name] = camelCase)
	           }
	       }
	       return null
	   }


	   avalon.fn.css = function (name, value) {
	       if (avalon.isPlainObject(name)) {
	           for (var i in name) {
	               avalon.css(this, i, name[i])
	           }
	       } else {
	           var ret = avalon.css(this, name, value)
	       }
	       return ret !== void 0 ? ret : this
	   }

	   avalon.fn.position = function () {
	       var offsetParent, offset,
	           elem = this[0],
	           parentOffset = {
	               top: 0,
	               left: 0
	           }
	       if (!elem) {
	           return parentOffset
	       }
	       /* istanbul ignore if */
	       /* istanbul ignore else */
	       if (this.css('position') === 'fixed') {
	           offset = elem.getBoundingClientRect()
	       } else {
	           offsetParent = this.offsetParent() //得到真正的offsetParent
	           offset = this.offset() // 得到正确的offsetParent
	           if (offsetParent[0].tagName !== 'HTML') {
	               parentOffset = offsetParent.offset()
	           }
	           parentOffset.top += avalon.css(offsetParent[0], 'borderTopWidth', true)
	           parentOffset.left += avalon.css(offsetParent[0], 'borderLeftWidth', true)

	           // Subtract offsetParent scroll positions
	           parentOffset.top -= offsetParent.scrollTop()
	           parentOffset.left -= offsetParent.scrollLeft()
	       }
	       return {
	           top: offset.top - parentOffset.top - avalon.css(elem, 'marginTop', true),
	           left: offset.left - parentOffset.left - avalon.css(elem, 'marginLeft', true)
	       }
	   }

	   avalon.fn.offsetParent = function () {
	       var offsetParent = this[0].offsetParent
	       while (offsetParent && avalon.css(offsetParent, 'position') === 'static') {
	           offsetParent = offsetParent.offsetParent
	       }
	       return avalon(offsetParent || avalon.root)
	   }



	   cssHooks$1['@:set'] = function (node, name, value) {
	       try {
	           //node.style.width = NaN;node.style.width = 'xxxxxxx';
	           //node.style.width = undefine 在旧式IE下会抛异常
	           node.style[name] = value
	       } catch (e) {
	       }
	   }

	   cssHooks$1['@:get'] = function (node, name) {
	       if (!node || !node.style) {
	           throw new Error('getComputedStyle要求传入一个节点 ' + node)
	       }
	       var ret, styles = getComputedStyle(node, null)
	       if (styles) {
	           ret = name === 'filter' ? styles.getPropertyValue(name) : styles[name]
	           if (ret === '') {
	               ret = node.style[name] //其他浏览器需要我们手动取内联样式
	           }
	       }
	       return ret
	   }

	   cssHooks$1['opacity:get'] = function (node) {
	       var ret = cssHooks$1['@:get'](node, 'opacity')
	       return ret === '' ? '1' : ret
	   }

	   'top,left'.replace(avalon.rword, function (name) {
	       cssHooks$1[name + ':get'] = function (node) {
	           var computed = cssHooks$1['@:get'](node, name)
	           return /px$/.test(computed) ? computed :
	               avalon(node).position()[name] + 'px'
	       }
	   })


	   var cssShow = {
	       position: 'absolute',
	       visibility: 'hidden',
	       display: 'block'
	   }

	   var rdisplayswap = /^(none|table(?!-c[ea]).+)/

	   function showHidden(node, array) {
	       //http://www.cnblogs.com/rubylouvre/archive/2012/10/27/2742529.html
	       /* istanbul ignore if*/
	       if (node.offsetWidth <= 0) { //opera.offsetWidth可能小于0
	           if (rdisplayswap.test(cssHooks$1['@:get'](node, 'display'))) {
	               var obj = {
	                   node: node
	               }
	               for (var name in cssShow) {
	                   obj[name] = node.style[name]
	                   node.style[name] = cssShow[name]
	               }
	               array.push(obj)
	           }
	           var parent = node.parentNode
	           if (parent && parent.nodeType === 1) {
	               showHidden(parent, array)
	           }
	       }
	   }

	   avalon.each({
	       Width: 'width',
	       Height: 'height'
	   }, function (name, method) {
	       var clientProp = 'client' + name,
	           scrollProp = 'scroll' + name,
	           offsetProp = 'offset' + name
	       cssHooks$1[method + ':get'] = function (node, which, override) {
	           var boxSizing = -4
	           if (typeof override === 'number') {
	               boxSizing = override
	           }
	           which = name === 'Width' ? ['Left', 'Right'] : ['Top', 'Bottom']
	           var ret = node[offsetProp] // border-box 0
	           if (boxSizing === 2) { // margin-box 2
	               return ret + avalon.css(node, 'margin' + which[0], true) + avalon.css(node, 'margin' + which[1], true)
	           }
	           if (boxSizing < 0) { // padding-box  -2
	               ret = ret - avalon.css(node, 'border' + which[0] + 'Width', true) - avalon.css(node, 'border' + which[1] + 'Width', true)
	           }
	           if (boxSizing === -4) { // content-box -4
	               ret = ret - avalon.css(node, 'padding' + which[0], true) - avalon.css(node, 'padding' + which[1], true)
	           }
	           return ret
	       }
	       cssHooks$1[method + '&get'] = function (node) {
	           var hidden = []
	           showHidden(node, hidden)
	           var val = cssHooks$1[method + ':get'](node)
	           for (var i = 0, obj; obj = hidden[i++];) {
	               node = obj.node
	               for (var n in obj) {
	                   if (typeof obj[n] === 'string') {
	                       node.style[n] = obj[n]
	                   }
	               }
	           }
	           return val
	       }
	       avalon.fn[method] = function (value) { //会忽视其display
	           var node = this[0]
	           if (arguments.length === 0) {
	               if (node.setTimeout) { //取得窗口尺寸
	                   return node['inner' + name] ||
	                       node.document.documentElement[clientProp] ||
	                       node.document.body[clientProp] //IE6下前两个分别为undefined,0
	               }
	               if (node.nodeType === 9) { //取得页面尺寸
	                   var doc = node.documentElement
	                   //FF chrome    html.scrollHeight< body.scrollHeight
	                   //IE 标准模式 : html.scrollHeight> body.scrollHeight
	                   //IE 怪异模式 : html.scrollHeight 最大等于可视窗口多一点？
	                   return Math.max(node.body[scrollProp], doc[scrollProp], node.body[offsetProp], doc[offsetProp], doc[clientProp])
	               }
	               return cssHooks$1[method + '&get'](node)
	           } else {
	               return this.css(method, value)
	           }
	       }
	       avalon.fn['inner' + name] = function () {
	           return cssHooks$1[method + ':get'](this[0], void 0, -2)
	       }
	       avalon.fn['outer' + name] = function (includeMargin) {
	           return cssHooks$1[method + ':get'](this[0], void 0, includeMargin === true ? 2 : 0)
	       }
	   })

	   /* istanbul ignore if */
	   if (avalon.msie < 9) {
	       cssMap['float'] = 'styleFloat'
	       var rnumnonpx = /^-?(?:\d*\.)?\d+(?!px)[^\d\s]+$/i
	       var rposition = /^(top|right|bottom|left)$/
	       var ralpha = /alpha\([^)]*\)/i
	       var ie8 = avalon.msie === 8
	       var salpha = 'DXImageTransform.Microsoft.Alpha'
	       var border = {
	           thin: ie8 ? '1px' : '2px',
	           medium: ie8 ? '3px' : '4px',
	           thick: ie8 ? '5px' : '6px'
	       }
	       cssHooks$1['@:get'] = function (node, name) {
	           //取得精确值，不过它有可能是带em,pc,mm,pt,%等单位
	           var currentStyle = node.currentStyle
	           var ret = currentStyle[name]
	           if ((rnumnonpx.test(ret) && !rposition.test(ret))) {
	               //①，保存原有的style.left, runtimeStyle.left,
	               var style = node.style,
	                   left = style.left,
	                   rsLeft = node.runtimeStyle.left
	               //②由于③处的style.left = xxx会影响到currentStyle.left，
	               //因此把它currentStyle.left放到runtimeStyle.left，
	               //runtimeStyle.left拥有最高优先级，不会style.left影响
	               node.runtimeStyle.left = currentStyle.left
	               //③将精确值赋给到style.left，然后通过IE的另一个私有属性 style.pixelLeft
	               //得到单位为px的结果；fontSize的分支见http://bugs.jquery.com/ticket/760
	               style.left = name === 'fontSize' ? '1em' : (ret || 0)
	               ret = style.pixelLeft + 'px'
	               //④还原 style.left，runtimeStyle.left
	               style.left = left
	               node.runtimeStyle.left = rsLeft
	           }
	           if (ret === 'medium') {
	               name = name.replace('Width', 'Style')
	               //border width 默认值为medium，即使其为0'
	               if (currentStyle[name] === 'none') {
	                   ret = '0px'
	               }
	           }
	           return ret === '' ? 'auto' : border[ret] || ret
	       }
	       cssHooks$1['opacity:set'] = function (node, name, value) {
	           var style = node.style
	           var opacity = isFinite(value) && value <= 1 ? 'alpha(opacity=' + value * 100 + ')' : ''
	           var filter = style.filter || ''
	           style.zoom = 1
	           //不能使用以下方式设置透明度
	           //node.filters.alpha.opacity = value * 100
	           style.filter = (ralpha.test(filter) ?
	               filter.replace(ralpha, opacity) :
	               filter + ' ' + opacity).trim()
	           if (!style.filter) {
	               style.removeAttribute('filter')
	           }
	       }
	       cssHooks$1['opacity:get'] = function (node) {
	           //这是最快的获取IE透明值的方式，不需要动用正则了！
	           var alpha = node.filters.alpha || node.filters[salpha],
	               op = alpha && alpha.enabled ? alpha.opacity : 100
	           return (op / 100) + '' //确保返回的是字符串
	       }
	   }


	   avalon.fn.offset = function () { //取得距离页面左右角的坐标
	       var node = this[0],
	           box = {
	               left: 0,
	               top: 0
	           }
	       if (!node || !node.tagName || !node.ownerDocument) {
	           return box
	       }
	       var doc = node.ownerDocument
	       var body = doc.body
	       var root = doc.documentElement
	       var win = doc.defaultView || doc.parentWindow
	       if (!avalon.contains(root, node)) {
	           return box
	       }
	       //http://hkom.blog1.fc2.com/?mode=m&no=750 body的偏移量是不包含margin的
	       //我们可以通过getBoundingClientRect来获得元素相对于client的rect.
	       //http://msdn.microsoft.com/en-us/library/ms536433.aspx
	       if (node.getBoundingClientRect) {
	           box = node.getBoundingClientRect() // BlackBerry 5, iOS 3 (original iPhone)
	       }
	       //chrome/IE6: body.scrollTop, firefox/other: root.scrollTop
	       var clientTop = root.clientTop || body.clientTop,
	           clientLeft = root.clientLeft || body.clientLeft,
	           scrollTop = Math.max(win.pageYOffset || 0, root.scrollTop, body.scrollTop),
	           scrollLeft = Math.max(win.pageXOffset || 0, root.scrollLeft, body.scrollLeft)
	       // 把滚动距离加到left,top中去。
	       // IE一些版本中会自动为HTML元素加上2px的border，我们需要去掉它
	       // http://msdn.microsoft.com/en-us/library/ms533564(VS.85).aspx
	       return {
	           top: box.top + scrollTop - clientTop,
	           left: box.left + scrollLeft - clientLeft
	       }
	   }

	   //生成avalon.fn.scrollLeft, avalon.fn.scrollTop方法
	   avalon.each({
	       scrollLeft: 'pageXOffset',
	       scrollTop: 'pageYOffset'
	   }, function (method, prop) {
	       avalon.fn[method] = function (val) {
	           var node = this[0] || {},
	               win = getWindow(node),
	               top = method === 'scrollTop'
	           if (!arguments.length) {
	               return win ? (prop in win) ? win[prop] : root[method] : node[method]
	           } else {
	               if (win) {
	                   win.scrollTo(!top ? val : avalon(win).scrollLeft(), top ? val : avalon(win).scrollTop())
	               } else {
	                   node[method] = val
	               }
	           }
	       }
	   })

	   function getWindow(node) {
	       return node.window || node.defaultView || node.parentWindow || false
	   }

	   function getValType(elem) {
	       var ret = elem.tagName.toLowerCase()
	       return ret === 'input' && rcheckedType.test(elem.type) ? 'checked' : ret
	   }
	   var roption = /^<option(?:\s+\w+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?)*\s+value[\s=]/i
	   var valHooks = {
	       'option:get': avalon.msie ? function (node) {
	           //在IE11及W3C，如果没有指定value，那么node.value默认为node.text（存在trim作），但IE9-10则是取innerHTML(没trim操作)
	           //specified并不可靠，因此通过分析outerHTML判定用户有没有显示定义value
	           return roption.test(node.outerHTML) ? node.value : node.text.trim()
	       } : function (node) {
	           return node.value
	       },
	       'select:get': function (node, value) {
	           var option, options = node.options,
				index = node.selectedIndex,
				getter = valHooks['option:get'],
				one = node.type === 'select-one' || index < 0,
				values = one ? null : [],
				max = one ? index + 1 : options.length,
				i = index < 0 ? max : one ? index : 0
	           for (; i < max; i++) {
	               option = options[i]
	               //IE6-9在reset后不会改变selected，需要改用i === index判定
	               //我们过滤所有disabled的option元素，但在safari5下，
	               //如果设置optgroup为disable，那么其所有孩子都disable
	               //因此当一个元素为disable，需要检测其是否显式设置了disable及其父节点的disable情况
	               if ((option.selected || i === index) && !option.disabled &&
					(!option.parentNode.disabled || option.parentNode.tagName !== 'OPTGROUP')
				) {
	                   value = getter(option)
	                   if (one) {
	                       return value
	                   }
	                   //收集所有selected值组成数组返回
	                   values.push(value)
	               }
	           }
	           return values
	       },
	       'select:set': function (node, values, optionSet) {
	           values = [].concat(values) //强制转换为数组
	           var getter = valHooks['option:get']
	           for (var i = 0, el; el = node.options[i++];) {
	               if ((el.selected = values.indexOf(getter(el)) > -1)) {
	                   optionSet = true
	               }
	           }
	           if (!optionSet) {
	               node.selectedIndex = -1
	           }
	       }
	   }

	   avalon.fn.val = function (value) {
	       var node = this[0]
	       if (node && node.nodeType === 1) {
	           var get = arguments.length === 0
	           var access = get ? ':get' : ':set'
	           var fn = valHooks[getValType(node) + access]
	           if (fn) {
	               var val = fn(node, value)
	           } else if (get) {
	               return (node.value || '').replace(/\r/g, '')
	           } else {
	               node.value = value
	           }
	       }
	       return get ? val : this
	   }

	   var rhtml = /<|&#?\w+;/
	   var htmlCache = new Cache(128)
	   var rxhtml = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig

	   avalon.parseHTML = function (html) {
	       var fragment = avalon.avalonFragment.cloneNode(false)
	       //处理非字符串
	       if (typeof html !== 'string') {
	           return fragment
	       }
	       //处理非HTML字符串
	       if (!rhtml.test(html)) {
	           return document.createTextNode(html)
	       }

	       html = html.replace(rxhtml, '<$1></$2>').trim()
	       var hasCache = htmlCache.get(html)
	       if (hasCache) {
	           return avalon.cloneNode(hasCache)
	       }
	       var vnodes = avalon.lexer(html)
	       for (var i = 0, el; el = vnodes[i++];) {
	           fragment.appendChild(avalon.vdom(el, 'toDOM'))
	       }
	       if (html.length < 1024) {
	           htmlCache.put(html, fragment)
	       }
	       return fragment
	   }

	   avalon.innerHTML = function (node, html) {

	       var parsed = this.parseHTML(html)
	       this.clearHTML(node).appendChild(parsed)
	   }

	   //https://github.com/karloespiritu/escapehtmlent/blob/master/index.js
	   avalon.unescapeHTML = function (html) {
	       return String(html)
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, '\'')
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&amp;/g, '&')
	   }



	   avalon.clearHTML = function (node) {
	       node.textContent = ''
	       /* istanbul ignore next */
	       while (node.lastChild) {
	           node.removeChild(node.lastChild)
	       }
	       return node
	   }

	   //http://www.feiesoft.com/html/events.html
	   //http://segmentfault.com/q/1010000000687977/a-1020000000688757
	   var canBubbleUp = {
	       click: true,
	       dblclick: true,
	       keydown: true,
	       keypress: true,
	       keyup: true,
	       mousedown: true,
	       mousemove: true,
	       mouseup: true,
	       mouseover: true,
	       mouseout: true,
	       wheel: true,
	       mousewheel: true,
	       input: true,
	       change: true,
	       beforeinput: true,
	       compositionstart: true,
	       compositionupdate: true,
	       compositionend: true,
	       select: true,
	       //http://blog.csdn.net/lee_magnum/article/details/17761441
	       cut: true,
	       copy: true,
	       paste: true,
	       beforecut: true,
	       beforecopy: true,
	       beforepaste: true,
	       focusin: true,
	       focusout: true,
	       DOMFocusIn: true,
	       DOMFocusOut: true,
	       DOMActivate: true,
	       dragend: true,
	       datasetchanged: true
	   }

	   var hackSafari = avalon.modern && doc$1.ontouchstart

	   //添加fn.bind, fn.unbind, bind, unbind
	   avalon.fn.bind = function (type, fn, phase) {
	       if (this[0]) { //此方法不会链
	           return avalon.bind(this[0], type, fn, phase)
	       }
	   }

	   avalon.fn.unbind = function (type, fn, phase) {
	       if (this[0]) {
	           avalon.unbind(this[0], type, fn, phase)
	       }
	       return this
	   }

	   /*绑定事件*/
	   avalon.bind = function (elem, type, fn) {
	       if (elem.nodeType === 1) {
	           var value = elem.getAttribute('avalon-events') || ''
	           //如果是使用ms-on-*绑定的回调,其uuid格式为e12122324,
	           //如果是使用bind方法绑定的回调,其uuid格式为_12
	           var uuid = markID$1(fn)
	           var hook = eventHooks[type]
	           if (type === 'click' && hackSafari) {
	               elem.addEventListener('click', avalon.noop)
	           }
	           if (hook) {
	               type = hook.type || type
	               if (hook.fix) {
	                   fn = hook.fix(elem, fn)
	                   fn.uuid = uuid
	               }
	           }
	           var key = type + ':' + uuid
	           avalon.eventListeners[fn.uuid] = fn
	           if (value.indexOf(type + ':') === -1) {//同一种事件只绑定一次
	               if (canBubbleUp[type] || (avalon.modern && focusBlur[type])) {
	                   delegateEvent(type)
	               } else {
	                   avalon._nativeBind(elem, type, dispatch)
	               }
	           }
	           var keys = value.split(',')
	           if (keys[0] === '') {
	               keys.shift()
	           }
	           if (keys.indexOf(key) === -1) {
	               keys.push(key)
	               elem.setAttribute('avalon-events', keys.join(','))
	               //将令牌放进avalon-events属性中
	           }

	       } else {
	           avalon._nativeBind(elem, type, fn)
	       }
	       return fn //兼容之前的版本
	   }

	   avalon.unbind = function (elem, type, fn) {
	       if (elem.nodeType === 1) {
	           var value = elem.getAttribute('avalon-events') || ''
	           switch (arguments.length) {
	               case 1:
	                   avalon._nativeUnBind(elem, type, dispatch)
	                   elem.removeAttribute('avalon-events')
	                   break
	               case 2:
	                   value = value.split(',').filter(function (str) {
	                       return str.indexOf(type + ':') === -1
	                   }).join(',')
	                   elem.setAttribute('avalon-events', value)
	                   break
	               default:
	                   var search = type + ':' + fn.uuid
	                   value = value.split(',').filter(function (str) {
	                       return str !== search
	                   }).join(',')
	                   elem.setAttribute('avalon-events', value)
	                   delete avalon.eventListeners[fn.uuid]
	                   break
	           }
	       } else {
	           avalon._nativeUnBind(elem, type, fn)
	       }
	   }

	   var typeRegExp = {}
	   function collectHandlers(elem, type, handlers) {
	       var value = elem.getAttribute('avalon-events')
	       if (value && (elem.disabled !== true || type !== 'click')) {
	           var uuids = []
	           var reg = typeRegExp[type] || (typeRegExp[type] = new RegExp("\\b" + type + '\\:([^,\\s]+)', 'g'))
	           value.replace(reg, function (a, b) {
	               uuids.push(b)
	               return a
	           })
	           if (uuids.length) {
	               handlers.push({
	                   elem: elem,
	                   uuids: uuids
	               })
	           }
	       }
	       elem = elem.parentNode
	       var g = avalon.gestureEvents || {}
	       if (elem && elem.getAttribute && (canBubbleUp[type] || g[type])) {
	           collectHandlers(elem, type, handlers)
	       }
	   }

	   var rhandleHasVm = /^e/
	   var stopImmediate = false
	   function dispatch(event) {
	       event = new avEvent(event)
	       var type = event.type
	       var elem = event.target
	       var handlers = []
	       collectHandlers(elem, type, handlers)
	       var i = 0, j, uuid, handler
	       while ((handler = handlers[i++]) && !event.cancelBubble) {
	           var host = event.currentTarget = handler.elem
	           j = 0
	           while ((uuid = handler.uuids[j++])) {
	               if (stopImmediate) {
	                   stopImmediate = false
	                   break
	               }
	               var fn = avalon.eventListeners[uuid]
	               if (fn) {
	                   var vm = rhandleHasVm.test(uuid) ? handler.elem._ms_context_ : 0
	                   if (vm && vm.$hashcode === false) {
	                       return avalon.unbind(elem, type, fn)
	                   }
	                   var ret = fn.call(vm || elem, event, host._ms_local)

	                   if (ret === false) {
	                       event.preventDefault()
	                       event.stopPropagation()
	                   }
	               }
	           }
	       }
	   }

	   var focusBlur = {
	       focus: true,
	       blur: true
	   }

	   function delegateEvent(type) {
	       var value = root$1.getAttribute('delegate-events') || ''
	       if (value.indexOf(type) === -1) {
	           var arr = value.match(avalon.rword) || []
	           arr.push(type)
	           root$1.setAttribute('delegate-events', arr.join(','))
	           avalon._nativeBind(root$1, type, dispatch, !!focusBlur[type])
	       }
	   }

	   var rconstant = /^[A-Z_]+$/
	   function avEvent(event) {
	       if (event.originalEvent) {
	           return this
	       }
	       for (var i in event) {
	           if (!rconstant.test(i) && typeof event[i] !== 'function') {
	               this[i] = event[i]
	           }
	       }
	       if (!this.target) {
	           this.target = event.srcElement
	       }
	       var target = this.target
	       this.fixEvent()
	       this.timeStamp = new Date() - 0
	       this.originalEvent = event
	   }

	   avEvent.prototype = {
	       fixEvent: function () { },
	       preventDefault: function () {
	           var e = this.originalEvent || {}
	           e.returnValue = this.returnValue = false
	           if (e.preventDefault) {
	               e.preventDefault()
	           }
	       },
	       stopPropagation: function () {
	           var e = this.originalEvent || {}
	           e.cancelBubble = this.cancelBubble = true
	           if (e.stopPropagation) {
	               e.stopPropagation()
	           }
	       },
	       stopImmediatePropagation: function () {
	           stopImmediate = true;
	           this.stopPropagation()
	       },
	       toString: function () {
	           return '[object Event]'//#1619
	       }
	   }


	   //针对firefox, chrome修正mouseenter, mouseleave
	   /* istanbul ignore if */
	   if (!('onmouseenter' in root$1)) {
	       avalon.each({
	           mouseenter: 'mouseover',
	           mouseleave: 'mouseout'
	       }, function (origType, fixType) {
	           eventHooks[origType] = {
	               type: fixType,
	               fix: function (elem, fn) {
	                   return function (e) {
	                       var t = e.relatedTarget
	                       if (!t || (t !== elem && !(elem.compareDocumentPosition(t) & 16))) {
	                           delete e.type
	                           e.type = origType
	                           return fn.apply(this, arguments)
	                       }
	                   }
	               }
	           }
	       })
	   }
	   //针对IE9+, w3c修正animationend
	   avalon.each({
	       AnimationEvent: 'animationend',
	       WebKitAnimationEvent: 'webkitAnimationEnd'
	   }, function (construct, fixType) {
	       if (win[construct] && !eventHooks.animationend) {
	           eventHooks.animationend = {
	               type: fixType
	           }
	       }
	   })

	   /* istanbul ignore if */
	   if (doc$1.onmousewheel === void 0) {
		/* IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
		 firefox DOMMouseScroll detail 下3 上-3
		 firefox wheel detlaY 下3 上-3
		 IE9-11 wheel deltaY 下40 上-40
		 chrome wheel deltaY 下100 上-100 */
	       var fixWheelType = doc$1.onwheel !== void 0 ? 'wheel' : 'DOMMouseScroll'
	       var fixWheelDelta = fixWheelType === 'wheel' ? 'deltaY' : 'detail'
	       eventHooks.mousewheel = {
	           type: fixWheelType,
	           fix: function (elem, fn) {
	               return function (e) {
	                   var delta = e[fixWheelDelta] > 0 ? -120 : 120
	                   e.wheelDelta = ~~elem._ms_wheel_ + delta
	                   elem._ms_wheel_ = e.wheelDeltaY = e.wheelDelta

	                   e.wheelDeltaX = 0
	                   if (Object.defineProperty) {
	                       Object.defineProperty(e, 'type', {
	                           value: 'mousewheel'
	                       })
	                   }
	                   return fn.apply(this, arguments)
	               }
	           }
	       }
	   }

	   if (!W3C) {
	       delete canBubbleUp.change
	       delete canBubbleUp.select
	   }


	   avalon._nativeBind = W3C ? function (el, type, fn, capture) {
	       el.addEventListener(type, fn, capture)
	   } : function (el, type, fn) {
	       el.attachEvent('on' + type, fn)
	   }

	   avalon._nativeUnBind = W3C ? function (el, type, fn) {
	       el.removeEventListener(type, fn)
	   } : function (el, type, fn) {
	       el.detachEvent('on' + type, fn)
	   }

	   avalon.fireDom = function (elem, type, opts) {
	       /* istanbul ignore else */
	       if (doc$1.createEvent) {
	           var hackEvent = doc$1.createEvent('Events')
	           hackEvent.initEvent(type, true, true, opts)
	           avalon.shadowCopy(hackEvent, opts)
	           elem.dispatchEvent(hackEvent)
	       } else if (root$1.contains(elem)) {//IE6-8触发事件必须保证在DOM树中,否则报'SCRIPT16389: 未指明的错误'
	           hackEvent = doc$1.createEventObject()
	           avalon.shadowCopy(hackEvent, opts)
	           elem.fireEvent('on' + type, hackEvent)
	       }
	   }

	   var rmouseEvent = /^(?:mouse|contextmenu|drag)|click/
	   avEvent.prototype.fixEvent = function () {
	       if (this.which == null && event.type.indexOf('key') === 0) {
	           this.which = event.charCode != null ? event.charCode : event.keyCode
	       } else if (rmouseEvent.test(event.type) && !('pageX' in this)) {
	           var DOC = target.ownerDocument || doc$1
	           var box = DOC.compatMode === 'BackCompat' ? DOC.body : DOC.documentElement
	           this.pageX = event.clientX + (box.scrollLeft >> 0) - (box.clientLeft >> 0)
	           this.pageY = event.clientY + (box.scrollTop >> 0) - (box.clientTop >> 0)
	           this.wheelDeltaY = this.wheelDelta
	           this.wheelDeltaX = 0
	       }
	   }

	   //针对IE6-8修正input
	   /* istanbul ignore if */
	   if (!('oninput' in doc$1.createElement('input'))) {
	       eventHooks.input = {
	           type: 'propertychange',
	           fix: function (elem, fn) {
	               return function (e) {
	                   if (e.propertyName === 'value') {
	                       e.type = 'input'
	                       return fn.apply(this, arguments)
	                   }
	               }
	           }
	       }
	   }

	   var voidTag = {
		area: 1,
		base: 1,
		basefont: 1,
		bgsound: 1,
		br: 1,
		col: 1,
		command: 1,
		embed: 1,
		frame: 1,
		hr: 1,
		img: 1,
		input: 1,
		keygen: 1,
		link: 1,
		meta: 1,
		param: 1,
		source: 1,
		track: 1,
		wbr: 1
	   }

	   function markNode(node) {
	       var ret = {}
	       var type = node.nodeName.toLowerCase()
	       ret.nodeName = type
	       ret.dom = node
	       if (type.charAt(0) === '#') {//2, 8
	           var nodeValue = node.nodeValue
	           if (/\S/.test(nodeValue)) {
	               ret.nodeValue = nodeValue
	           }
	       } else {
	           var props = markProps(node)
	           if (voidTag[type]) {
	               ret.isVoidTag = true
	           }

	           ret.children = markChildren(node)

	           if (props) {
	               if ('selectedIndex' in props) {
	                   node.selectedIndex = props.selectedIndex
	                   delete props.selectedIndex
	               }
	               ret.props = props
	           }
	       }
	       return ret
	   }

	   var rformElement = /input|textarea|select/i
	   var rcolon = /^\:/
	   function markProps(node) {
	       var attrs = node.attributes, ret = {}
	       for (var i = 0, n = attrs.length; i < n; i++) {
	           var attr = attrs[i]
	           if (attr.specified) {
	               var name = attr.name
	               if (name.charAt(0) === ':') {
	                   name = name.replace(rcolon, 'ms-')
	               }
	               ret[name] = attr.value
	           }
	       }
	       if (rformElement.test(node.nodeName)) {
	           ret.type = node.type
	       }
	       var style = node.style.cssText
	       if (style) {
	           ret.style = style
	       }
	       //类名 = 去重(静态类名+动态类名+ hover类名? + active类名)
	       if (ret.type === 'select-one') {
	           ret.selectedIndex = node.selectedIndex
	       }
	       if (isEmpty(ret)) {
	           return null
	       }
	       return ret
	   }

	   function isEmpty(a) {
	       for (var i in a) {
	           return false
	       }
	       return true
	   }


	   //将当前元素的孩子转换成VDOM
	   function markChildren(parent) {
	       var arr = []
	       var node = parent.firstChild
	       if (!node) {
	           return arr
	       }
	       do {
	           var next = node.nextSibling
	           switch (node.nodeType) {
	               case 1:
	                   var a = node.getAttributeNode(':for') || node.getAttributeNode('ms-for')

	                   if (a) {
	                       var start = document.createComment('ms-for:' + a.value)
	                       var end = document.createComment('ms-for-end:')
	                       node.removeAttributeNode(a)

	                       if (parent) {
	                           parent.insertBefore(end, node.nextSibling)
	                           parent.insertBefore(start, node)
	                       }
	                       arr.push(markNode(start), markNode(node), markNode(end))

	                   } else {
	                       arr.push(markNode(node))
	                   }
	                   break
	               case 3:
	                   if (/\S/.test(node.nodeValue)) {
	                       arr.push(markNode(node))
	                   } else {
	                       var p = node.parentNode
	                       if (p) {
	                           p.removeChild(node)
	                       }
	                   }
	                   break
	               case 8:
	                   arr.push(markNode(node))

	           }
	           node = next

	       } while (node)
	       return arr
	   }

	   avalon.scan = function (a) {
		/* istanbul ignore if */
		if (!a || !a.nodeType) {
			avalon.warn('[avalon.scan] first argument must be element , documentFragment, or document')
			return
		}
		scanNodes([a])
	   }
	   avalon._hydrate = markNode
	   var onceWarn = true //只警告一次

	   function scanNodes(nodes) {
		for (var i = 0, elem; elem = nodes[i++];) {
			if (elem.nodeType === 1) {
				var $id = getController(elem)

				var vm = avalon.vmodels[$id]
				if (vm && !vm.$element) {
					vm.$element = elem
					/* istanbul ignore if */
					if (avalon.serverTemplates && avalon.serverTemplates[$id]) {
						var tmpl = avalon.serverTemplates[$id]
						var oldTree = avalon.speedUp(avalon.lexer(tmpl))
						var render = avalon.render(oldTree)
						var vtree = render(vm)
						var dom = avalon.vdom(vtree[0], 'toDOM')
						vm.$element = dom
						dom.vtree = vtree
						vm.$render = render
						elem.parentNode.replaceChild(dom, elem)
						avalon.diff(vtree, vtree)
						continue
					}

					//IE6-8下元素的outerHTML前面会有空白
					//第一次扫描就清空所有空白节点,并生成最初的vtree
					var vtree = [markNode(elem)]
					var now = new Date()
					elem.vtree = avalon.speedUp(vtree)

					var now2 = new Date()
					onceWarn && avalon.log('构建虚拟DOM耗时', now2 - now, 'ms')

					vm.$render = avalon.render(elem.vtree)
					avalon.scopes[vm.$id] = {
						vmodel: vm,
						local: {},
						isTemp: true
					}
					var now3 = new Date()
					if (onceWarn && (now3 - now2 > 100)) {
						avalon.log('构建当前vm的$render方法耗时 ', now3 - now2, 'ms\n',
							'如果此时间太长,达100ms以上\n',
							'建议将当前ms-controller拆分成多个ms-controller,减少每个vm管辖的区域')
						onceWarn = false
					}
					avalon.rerenderStart = now3
					avalon.batch($id)

				} else if (!$id) {
					scanNodes(elem.childNodes)
				}
			}
		}
	   }

	   function getController(a) {
		return a.getAttribute('ms-controller') ||
			a.getAttribute(':controller')
	   }

	   var readyList = [];
	   var isReady;
	   var fireReady = function (fn) {
	       isReady = true

	       while (fn = readyList.shift()) {
	           fn(avalon)
	       }
	   }
	   avalon.ready = function (fn) {
	       if (!isReady) {
	           readyList.push(fn)
	       } else {
	           fn(avalon)
	       }
	   }

	   avalon.ready(function () {
	       avalon.scan(doc$1.body)
	   })

	   new function () {
	       if (!avalon.inBrowser)
	           return

	       function doScrollCheck() {
	           try { //IE下通过doScrollCheck检测DOM树是否建完
	               root$1.doScroll('left')
	               fireReady()
	           } catch (e) {
	               setTimeout(doScrollCheck)
	           }
	       }

	       if (doc$1.readyState === 'complete') {
	           setTimeout(fireReady) //如果在domReady之外加载
	       } else if (doc$1.addEventListener) {
	           doc$1.addEventListener('DOMContentLoaded', fireReady)
	       } else if (doc$1.attachEvent) {
	           doc$1.attachEvent('onreadystatechange', function () {
	               if (doc$1.readyState === 'complete') {
	                   fireReady()
	               }
	           })
	           try {
	               var isTop = win.frameElement === null
	           } catch (e) {
	           }
	           if (root$1.doScroll && isTop && win.external) {//fix IE iframe BUG
	               doScrollCheck()
	           }
	       }

	       avalon.bind(win, 'load', fireReady)
	   }

	/**
	 * 这是一个非常重要的内部对象，构建一个vm用到的内部方法都将放在它上面
	 * 然后由它构建4大工厂 
	 */
	   var warlords = {}

	/**
	 * 调整到正确的VM
	 */
	   function adjustVm(vm, expr) {
	       var toppath = expr.split(".")[0], other
	       try {
	           if (vm.hasOwnProperty(toppath)) {
	               if (vm.$accessors) {
	                   other = vm.$accessors[toppath].get.heirloom.__vmodel__
	               } else {
	                   other = Object.getOwnPropertyDescriptor(vm, toppath).get.heirloom.__vmodel__
	               }

	           }
	       } catch (e) {
	       }
	       return other || vm
	   }


	/**
	 * 添加$watch回调
	 */
	   function $watch(expr, callback) {
	       var fuzzy = expr.indexOf('.*') > 0 || expr === '*'
	       var vm = fuzzy ? this : $watch.adjust(this, expr)
	       var hive = this.$events
	       var list = hive[expr] || (hive[expr] = [])
	       if (fuzzy) {
	           list.reg = list.reg || toRegExp(expr)
	       }
	       addFuzzy(fuzzy, hive, expr)
	       if (vm !== this) {
	           addFuzzy(fuzzy, this.$events, expr)
	       }

	       avalon.Array.ensure(list, callback)

	       return function () {
	           avalon.Array.remove(list, callback)
	       }
	   }

	   $watch.adjust = adjustVm
	/**
	 * $fire 方法的内部实现
	 * 
	 * @param {Array} list 订阅者数组
	 * @param {Component} vm
	 * @param {String} path 监听属性名或路径
	 * @param {Any} a 当前值 
	 * @param {Any} b 过去值
	 * @param {Number} i 如果抛错,让下一个继续执行
	 * @returns {undefined}
	 */
	   function $emit(list, vm, path, a, b, i) {
	       if (list && list.length) {
	           try {
	               for (i = i || list.length - 1; i >= 0; i--) {
	                   var callback = list[i]
	                   callback.call(vm, a, b, path)
	               }
	           } catch (e) {
	               if (i - 1 > 0)
	                   $emit(list, vm, path, a, b, i - 1)
	               avalon.log(e, path)
	           }

	       }
	   }

	   function toRegExp(expr) {
	       var arr = expr.split('.')
	       return new RegExp("^" + arr.map(function (el) {
	           return el === '*' ? '(?:[^.]+)' : el
	       }).join('\\.') + '$', 'i')
	   }

	   function addFuzzy(add, obj, expr) {
	       if (add) {
	           if (obj.__fuzzy__) {
	               if (obj.__fuzzy__.indexOf(',' + expr) === -1) {
	                   obj.__fuzzy__ += ',' + expr
	               }
	           } else {
	               obj.__fuzzy__ = expr
	           }
	       }
	   }

	   var $$skipArray$1 = avalon.oneObject('$id,$render,$track,$element,$watch,$fire,$events,$skipArray,$accessors,$hashcode,$run,$wait,__proxy__,__data__,__const__')

	   function notifySize(array, size) {
	       if (array.length !== size) {
	           array.notify('length', array.length, size, true)
	       }
	   }

	   var __array__ = {
	       set: function (index, val) {
	           if (((index >>> 0) === index) && this[index] !== val) {
	               if (index > this.length) {
	                   throw Error(index + 'set方法的第一个参数不能大于原数组长度')
	               }
	               this.splice(index, 1, val)
	           }
	       },
	       contains: function (el) { //判定是否包含
	           return this.indexOf(el) !== -1
	       },
	       ensure: function (el) {
	           if (!this.contains(el)) { //只有不存在才push
	               this.push(el)
	           }
	           return this
	       },
	       pushArray: function (arr) {
	           return this.push.apply(this, arr)
	       },
	       remove: function (el) { //移除第一个等于给定值的元素
	           return this.removeAt(this.indexOf(el))
	       },
	       removeAt: function (index) { //移除指定索引上的元素
	           if ((index >>> 0) === index) {
	               return this.splice(index, 1)
	           }
	           return []
	       },
	       clear: function () {
	           this.removeAll()
	           return this
	       }
	   }



	   var ap$1 = Array.prototype
	   var _splice = ap$1.splice
	   __array__.removeAll = function (all) { //移除N个元素
	       var size = this.length
	       if (Array.isArray(all)) {
	           for (var i = this.length - 1; i >= 0; i--) {
	               if (all.indexOf(this[i]) !== -1) {
	                   _splice.call(this, i, 1)
	               }
	           }
	       } else if (typeof all === 'function') {
	           for (i = this.length - 1; i >= 0; i--) {
	               var el = this[i]
	               if (all(el, i)) {
	                   _splice.call(this, i, 1)
	               }
	           }
	       } else {
	           _splice.call(this, 0, this.length)
	       }
	       warlords.toModel(this)
	       notifySize(this, size)
	       this.notify()
	   }


	   var __method__ = ['push', 'pop', 'shift', 'unshift', 'splice']

	   __method__.forEach(function (method) {
	       var original = ap$1[method]
	       __array__[method] = function (a, b) {
	           // 继续尝试劫持数组元素的属性
	           var args = [], size = this.length

	           if (method === 'splice' && Object(this[0]) === this[0]) {
	               var old = this.slice(a, b)
	               var neo = ap$1.slice.call(arguments, 2)
	               var args = [a, b]
	               for (var j = 0, jn = neo.length; j < jn; j++) {
	                   var item = old[j]

	                   args[j + 2] = warlords.modelAdaptor(neo[j], item, (item && item.$events || {}), {
	                       id: this.$id + '.*',
	                       master: true
	                   })
	               }

	           } else {
	               for (var i = 0, n = arguments.length; i < n; i++) {
	                   args[i] = warlords.modelAdaptor(arguments[i], 0, {}, {
	                       id: this.$id + '.*',
	                       master: true
	                   })
	               }
	           }
	           var result = original.apply(this, args)
	           warlords.toModel(this)
	           notifySize(this, size)
	           this.notify()
	           return result
	       }
	   })

	   'sort,reverse'.replace(/\w+/g, function (method) {
	       __array__[method] = function () {
	           ap$1[method].apply(this, arguments)
	           warlords.toModel(this)
	           this.notify()
	           return this
	       }
	   })

	   var rskip = /function|window|date|regexp|element/i
	/**
	 * 判定此属性是否能转换为访问器属性
	 * 不能以$开头， 不位于skipArray数组内，
	 * 类型不能为函数，window, date, regexp, 元素
	 * ？？？
	 * 
	 * 以后将反向操作 ，要求类型只能是array, object, undefined, null, boolean, number, string
	 */
	   function isSkip$1(key, value, skipArray) {
	       // 判定此属性能否转换访问器
	       return key.charAt(0) === '$' ||
			skipArray[key] ||
			(rskip.test(avalon.type(value))) ||
			(value && value.nodeName && value.nodeType > 0)
	   }

	   warlords.isSkip = isSkip$1

	/**
	 * 将属性值再进行转换
	 */
	   function modelAdaptor(definition, old, heirloom, options) {
	       var type = avalon.type(definition)
	       switch (type) {
	           case 'array':
				return warlords.arrayFactory(definition, old, heirloom, options)
	           case 'object':
				if (old && old.$id) {
	                   ++avalon.suspendUpdate
	                   //1.5带来的优化方案
	                   if (old.$track !== Object.keys(definition).sort().join(';;')) {
	                       var vm = warlords.slaveFactory(old, definition, heirloom, options)
	                   } else {
	                       vm = old
	                   }
	                   for (var i in definition) {
	                       if ($$skipArray$1[i])
	                           continue
	                       vm[i] = definition[i]
	                   }
	                   --avalon.suspendUpdate
	                   return vm
	               } else {
	                   vm = warlords.masterFactory(definition, heirloom, options)
	                   return vm
	               }
			default:
				return definition
	       }
	   }

	   warlords.modelAdaptor = modelAdaptor

	/**
	 * 生成访问器属性的定义对象
	 * 依赖于
	 * $emit
	 * modelAdaptor
	 * emitWidget
	 * emitArray
	 * emitWildcard
	 * batchUpdateView
	 * 
	 */
	   function makeAccessor$1(sid, spath, heirloom) {
	       var old = NaN
	       function get() {
	           return old
	       }
	       get.heirloom = heirloom
	       return {
	           get: get,
	           set: function (val) {
	               if (old === val) {
	                   return
	               }
	               var older = old
	               if (older && older.$model) {
					older = older.$model
	               }
	               var vm = heirloom.__vmodel__
	               if (val && typeof val === 'object') {
	                   val = modelAdaptor(val, old, heirloom, {
	                       pathname: spath,
	                       id: sid
	                   })
	               }
	               old = val
	               if (this.$hashcode && vm) {
	                   vm.$events.$$dirty$$ = true
	                   if (vm.$events.$$wait$$)
	                       return
	                   //★★确保切换到新的events中(这个events可能是来自oldProxy)               
	                   if (heirloom !== vm.$events) {
	                       get.heirloom = vm.$events
	                   }

	                   //如果这个属性是组件配置对象中的属性,那么它需要触发组件的回调
	                   emitWidget(get.$decompose, spath, val, older)
	                   //触发普通属性的回调
	                   if (spath.indexOf('*') === -1) {
	                       $emit(get.heirloom[spath], vm, spath, val, older)
	                   }
	                   //如果这个属性是数组元素上的属性
	                   emitArray(sid + '', vm, spath, val, older)
	                   //如果这个属性存在通配符
	                   emitWildcard(get.heirloom, vm, spath, val, older)
	                   vm.$events.$$dirty$$ = false
	                   batchUpdateView(vm.$id)
	               }
	           },
	           enumerable: true,
	           configurable: true
	       }
	   }

	   warlords.makeAccessor = makeAccessor$1

	   function batchUpdateView(id) {
	       avalon.rerenderStart = new Date
	       var dotIndex = id.indexOf('.')
	       if (dotIndex > 0) {
	           avalon.batch(id.slice(0, dotIndex))
	       } else {
	           avalon.batch(id)
	       }
	   }


	   avalon.define = function (definition) {
	       var $id = definition.$id
	       if (!$id) {
	           avalon.warn('vm.$id must be specified')
	       }
	       if (avalon.vmodels[$id]) {
	           throw Error('error:[' + $id + '] had defined!')
	       }
	       var vm = warlords.masterFactory(definition, {}, {
	           pathname: '',
	           id: $id,
	           master: true
	       })
	       return avalon.vmodels[$id] = vm
	   }


	   function arrayFactory(array, old, heirloom, options) {
	       if (old && old.splice) {
	           var args = [0, old.length].concat(array)
	           ++avalon.suspendUpdate
	           avalon.callArray = options.pathname
	           old.splice.apply(old, args)
	           --avalon.suspendUpdate
	           return old
	       } else {
	           for (var i in __array__) {
	               array[i] = __array__[i]
	           }

	           array.notify = function (a, b, c, d) {
	               var vm = heirloom.__vmodel__
	               if (vm) {
	                   var path = a === null || a === void 0 ?
						options.pathname :
						options.pathname + '.' + a
	                   vm.$fire(path, b, c)
	                   if (!d && !heirloom.$$wait$$ && !avalon.suspendUpdate) {
	                       avalon.callArray = path
	                       batchUpdateView(vm.$id)
	                       delete avalon.callArray
	                   }
	               }
	           }

	           var hashcode = avalon.makeHashCode('$')
	           options.array = true
	           options.hashcode = hashcode
	           options.id = options.id || hashcode
	           warlords.initViewModel(array, heirloom, {}, {}, options)

	           for (var j = 0, n = array.length; j < n; j++) {
	               array[j] = modelAdaptor(array[j], 0, {}, {
	                   id: array.$id + '.*',
	                   master: true
	               })
	           }
	           return array
	       }
	   }

	   warlords.arrayFactory = arrayFactory

	   //======inner start
	   var rtopsub = /([^.]+)\.(.+)/
	   function emitArray(sid, vm, spath, val, older) {
	       if (sid.indexOf('.*.') > 0) {
	           var arr = sid.match(rtopsub)
	           var top = avalon.vmodels[arr[1]]
	           if (top) {
	               var path = arr[2]
	               $emit(top.$events[path], vm, spath, val, older)
	           }
	       }
	   }

	   function emitWidget(whole, spath, val, older) {
	       if (whole && whole[spath]) {
	           var wvm = whole[spath]
	           if (!wvm.$hashcode) {
	               delete whole[spath]
	           } else {
	               var wpath = spath.replace(/^[^.]+\./, '')
	               if (wpath !== spath) {
	                   $emit(wvm.$events[wpath], wvm, wpath, val, older)
	               }
	           }
	       }
	   }

	   function emitWildcard(obj, vm, spath, val, older) {
	       if (obj.__fuzzy__) {
	           obj.__fuzzy__.replace(avalon.rword, function (expr) {
	               var list = obj[expr]
	               var reg = list.reg
	               if (reg && reg.test(spath)) {
	                   $emit(list, vm, spath, val, older)
	               }
	               return expr
	           })
	       }
	   }

	   //======inner end

	   warlords.$$skipArray = $$skipArray$1
	   //如果浏览器不支持ecma262v5的Object.defineProperties或者存在BUG，比如IE8
	   //标准浏览器使用__defineGetter__, __defineSetter__实现
	   var canHideProperty = true
	   try {
	       Object.defineProperty({}, '_', {
	           value: 'x'
	       })
	   } catch (e) {
	       /* istanbul ignore next*/
	       canHideProperty = false
	   }

	   warlords.canHideProperty = canHideProperty

	   function toJson(val) {
	       switch (avalon.type(val)) {
	           case 'array':
	               var array = []
	               for (var i = 0; i < val.length; i++) {
	                   array[i] = toJson(val[i])
	               }
	               return array
	           case 'object':
	               var obj = {}
	               for (i in val) {
	                   if (i === '__proxy__' || i === '__data__' || i === '__const__')
	                       continue
	                   if (val.hasOwnProperty(i)) {
	                       var value = val[i]
	                       obj[i] = value && value.nodeType ? value : toJson(value)
	                   }
	               }
	               return obj
	           default:
	               return val
	       }
	   }

	   warlords.toJson = toJson
	   warlords.toModel = function (obj) {
	       if (!avalon.modern) {
	           obj.$model = toJson(obj)
	       }
	   }

	   function hideProperty(host, name, value) {
	       if (canHideProperty) {
	           Object.defineProperty(host, name, {
	               value: value,
	               writable: true,
	               enumerable: false,
	               configurable: true
	           })
	       } else {
	           host[name] = value
	       }
	   }

	   warlords.hideProperty = hideProperty

	   var modelAccessor$1 = {
	       get: function () {
	           return toJson(this)
	       },
	       set: avalon.noop,
	       enumerable: false,
	       configurable: true
	   }

	   warlords.modelAccessor = modelAccessor$1

	   function initViewModel$1($vmodel, heirloom, keys, accessors, options) {
	       if (options.array) {
	           if (avalon.modern) {
	               Object.defineProperty($vmodel, '$model', modelAccessor$1)
	           } else {
	               $vmodel.$model = toJson($vmodel)
	           }
	       } else {
	           hideProperty($vmodel, '$accessors', accessors)
	           hideProperty($vmodel, 'hasOwnProperty', function (key) {
	               return keys[key] === true
	           })
	           hideProperty($vmodel, '$track', Object.keys(keys).sort().join(';;'))
	       }
	       hideProperty($vmodel, '$id', options.id)
	       hideProperty($vmodel, '$hashcode', options.hashcode)
	       if (options.master === true) {
	           hideProperty($vmodel, '$run', function () {
	               run.call($vmodel)
	           })
	           hideProperty($vmodel, '$wait', function () {
	               wait.call($vmodel)
	           })
	           hideProperty($vmodel, '$element', null)
	           hideProperty($vmodel, '$render', 0)
	           heirloom.__vmodel__ = $vmodel
	           hideProperty($vmodel, '$events', heirloom)
	           hideProperty($vmodel, '$watch', function () {
	               return $watch.apply($vmodel, arguments)
	           })
	           hideProperty($vmodel, '$fire', function (expr, a, b) {
	               var list = $vmodel.$events[expr]
	               $emit(list, $vmodel, expr, a, b)
	           })
	       }
	   }

	   warlords.initViewModel = initViewModel$1

	   function wait() {
	       this.$events.$$wait$$ = true
	   }

	   function run() {
	       var host = this.$events
	       delete host.$$wait$$
	       if (host.$$dirty$$) {
	           delete host.$$dirty$$
	           avalon.rerenderStart = new Date
	           var id = this.$id
	           var dotIndex = id.indexOf('.')
	           if (dotIndex > 0) {
	               avalon.batch(id.slice(0, dotIndex))
	           } else {
	               avalon.batch(id)
	           }
	       }
	   }

	   var defineProperties = Object.defineProperties
	   var defineProperty

	   var timeBucket = new Date() - 0
	   /* istanbul ignore if*/
	   if (!canHideProperty) {
	       if ('__defineGetter__' in avalon) {
	           defineProperty = function (obj, prop, desc) {
	               if ('value' in desc) {
	                   obj[prop] = desc.value
	               }
	               if ('get' in desc) {
	                   obj.__defineGetter__(prop, desc.get)
	               }
	               if ('set' in desc) {
	                   obj.__defineSetter__(prop, desc.set)
	               }
	               return obj
	           }
	           defineProperties = function (obj, descs) {
	               for (var prop in descs) {
	                   if (descs.hasOwnProperty(prop)) {
	                       defineProperty(obj, prop, descs[prop])
	                   }
	               }
	               return obj
	           }
	       }
	       /* istanbul ignore if*/
	       if (avalon.msie < 9) {
	           var VBClassPool = {}
	           window.execScript([// jshint ignore:line
	               'Function parseVB(code)',
	               '\tExecuteGlobal(code)',
	               'End Function' //转换一段文本为VB代码
	           ].join('\n'), 'VBScript');

	           var VBMediator = function (instance, accessors, name, value) {// jshint ignore:line
	               var accessor = accessors[name]
	               if (arguments.length === 4) {
	                   accessor.set.call(instance, value)
	               } else {
	                   return accessor.get.call(instance)
	               }
	           }
	           defineProperties = function (name, accessors, properties) {
	               // jshint ignore:line
	               var buffer = []
	               buffer.push(
	                   '\r\n\tPrivate [__data__], [__proxy__]',
	                   '\tPublic Default Function [__const__](d' + timeBucket + ', p' + timeBucket + ')',
	                   '\t\tSet [__data__] = d' + timeBucket + ': set [__proxy__] = p' + timeBucket,
	                   '\t\tSet [__const__] = Me', //链式调用
	                   '\tEnd Function')
	               //添加普通属性,因为VBScript对象不能像JS那样随意增删属性，必须在这里预先定义好
	               var uniq = {
	                   __proxy__: true,
	                   __data__: true,
	                   __const__: true
	               }

	               //添加访问器属性 
	               for (name in accessors) {
	                   if (uniq[name] || $$skipArray$1[name]) {
	                       continue
	                   }
	                   uniq[name] = true
	                   buffer.push(
	                       //由于不知对方会传入什么,因此set, let都用上
	                       '\tPublic Property Let [' + name + '](val' + timeBucket + ')', //setter
	                       '\t\tCall [__proxy__](Me,[__data__], "' + name + '", val' + timeBucket + ')',
	                       '\tEnd Property',
	                       '\tPublic Property Set [' + name + '](val' + timeBucket + ')', //setter
	                       '\t\tCall [__proxy__](Me,[__data__], "' + name + '", val' + timeBucket + ')',
	                       '\tEnd Property',
	                       '\tPublic Property Get [' + name + ']', //getter
	                       '\tOn Error Resume Next', //必须优先使用set语句,否则它会误将数组当字符串返回
	                       '\t\tSet[' + name + '] = [__proxy__](Me,[__data__],"' + name + '")',
	                       '\tIf Err.Number <> 0 Then',
	                       '\t\t[' + name + '] = [__proxy__](Me,[__data__],"' + name + '")',
	                       '\tEnd If',
	                       '\tOn Error Goto 0',
	                       '\tEnd Property')

	               }
	               for (name in properties) {
	                   if (uniq[name] || $$skipArray$1[name]) {
	                       continue
	                   }
	                   uniq[name] = true
	                   buffer.push('\tPublic [' + name + ']')
	               }
	               for (name in $$skipArray$1) {
	                   if (!uniq[name]) {
	                       buffer.push('\tPublic [' + name + ']')
	                   }
	               }
	               buffer.push('\tPublic [' + 'hasOwnProperty' + ']')
	               buffer.push('End Class')
	               var body = buffer.join('\r\n')
	               var className = VBClassPool[body]
	               if (!className) {
	                   className = avalon.makeHashCode('VBClass')
	                   window.parseVB('Class ' + className + body)
	                   window.parseVB([
	                       'Function ' + className + 'Factory(a, b)', //创建实例并传入两个关键的参数
	                       '\tDim o',
	                       '\tSet o = (New ' + className + ')(a, b)',
	                       '\tSet ' + className + 'Factory = o',
	                       'End Function'
	                   ].join('\r\n'))
	                   VBClassPool[body] = className
	               }
	               var ret = window[className + 'Factory'](accessors, VBMediator) //得到其产品
	               return ret //得到其产品
	           }
	       }
	   }

	   warlords.createViewModel = defineProperties
	/**
	 * 
	 * 
	 * 在routes.php中进行路由设置，；
	作为访问的统一入口，是控制器的统一调度；
	没有配置路由，就没有正确地访问路径；
	路由需要自己规定一定的规则，方便自己查看、使用、理解；
	必用参数
	Route::get('/blog/{name}',function($name){
		return $name; // 返回name显示
	});
	即除了 /blog/{name}的路由类型，都不能进来
	可选参数
	Route::get('/blog/{name?}',function($name = 'name'){
		return $name; // 返回name显示,如果没设置就取默认值
	});
	正则参数
	正则可以更灵活些，匹配更多需求。
	Route::get('/blog/{id?}',function($id="1"){
		return "{$id}";//输出blog的ID，
	})->where('name','^\d+$');//正则匹配为只能是数字，不然将无法找到路由；
	https://segmentfault.com/a/1190000004186135
	 */

	   var isSkip = warlords.isSkip
	   var $$skipArray = warlords.$$skipArray
	   if (warlords.canHideProperty) {
	       delete $$skipArray.$accessors
	       delete $$skipArray.__data__
	       delete $$skipArray.__proxy__
	       delete $$skipArray.__const__
	   }

	   var makeAccessor = warlords.makeAccessor
	   var modelAccessor = warlords.modelAccessor
	   var createViewModel = warlords.createViewModel
	   var initViewModel = warlords.initViewModel

	   var makeHashCode = avalon.makeHashCode


	   //一个vm总是为Observer的实例
	   function Observer() {
	   }

	   function masterFactory(definition, heirloom, options) {

	       var $skipArray = {}
	       if (definition.$skipArray) {//收集所有不可监听属性
	           $skipArray = avalon.oneObject(definition.$skipArray)
	           delete definition.$skipArray
	       }

	       var keys = {}
	       options = options || {}
	       heirloom = heirloom || {}
	       var accessors = {}
	       var hashcode = makeHashCode('$')
	       var pathname = options.pathname || ''
	       options.id = options.id || hashcode
	       options.hashcode = options.hashcode || hashcode
	       var key, sid, spath
	       for (key in definition) {
	           if ($$skipArray[key])
	               continue
	           var val = keys[key] = definition[key]
	           if (!isSkip(key, val, $skipArray)) {
	               sid = options.id + '.' + key
	               spath = pathname ? pathname + '.' + key : key
	               accessors[key] = makeAccessor(sid, spath, heirloom)
	           }
	       }

	       accessors.$model = modelAccessor
	       var $vmodel = new Observer()
	       $vmodel = createViewModel($vmodel, accessors, definition)

	       for (key in keys) {
	           //对普通监控属性或访问器属性进行赋值
	           $vmodel[key] = keys[key]

	           //删除系统属性
	           if (key in $skipArray) {
	               delete keys[key]
	           } else {
	               keys[key] = true
	           }
	       }
	       initViewModel($vmodel, heirloom, keys, accessors, options)

	       return $vmodel
	   }

	   warlords.masterFactory = masterFactory
	   var empty = {}
	   function slaveFactory(before, after, heirloom, options) {
	       var keys = {}
	       var skips = {}
	       var accessors = {}
	       heirloom = heirloom || {}
	       var pathname = options.pathname
	       var resue = before.$accessors || {}
	       var key, sid, spath
	       for (key in after) {
	           if ($$skipArray[key])
	               continue
	           keys[key] = true//包括可监控与不可监控的
	           if (!isSkip(key, after[key], empty)) {
	               if (resue[key]) {
	                   accessors[key] = resue[key]
	               } else {
	                   sid = options.id + '.' + key
	                   spath = pathname ? pathname + '.' + key : key
	                   accessors[key] = makeAccessor(sid, spath, heirloom)
	               }
	           } else {
	               skips[key] = after[key]
	               delete after[key]
	           }
	       }

	       options.hashcode = before.$hashcode || makeHashCode('$')
	       accessors.$model = modelAccessor
	       var $vmodel = new Observer()
	       $vmodel = createViewModel($vmodel, accessors, skips)

	       for (key in skips) {
	           $vmodel[key] = skips[key]
	       }

	       initViewModel($vmodel, heirloom, keys, accessors, options)

	       return $vmodel
	   }

	   warlords.slaveFactory = slaveFactory

	   function mediatorFactory(before, after) {
	       var keys = {}, key
	       var accessors = {}//新vm的访问器
	       var unresolve = {}//需要转换的属性集合
	       var heirloom = {}
	       var arr = avalon.slice(arguments)
	       var $skipArray = {}
	       var isWidget = typeof this === 'function' && this.isWidget
	       var config
	       var configName
	       for (var i = 0; i < arr.length; i++) {
	           var obj = arr[i]
	           //收集所有键值对及访问器属性
	           var $accessors = obj.$accessors
	           for (var key in obj) {
	               if (!obj.hasOwnProperty(key)) {
	                   continue
	               }
	               var cur = obj[key]
	               if (key === '$skipArray') {//处理$skipArray
	                   if (Array.isArray(cur)) {
	                       cur.forEach(function (el) {
	                           $skipArray[el] = 1
	                       })
	                   }
	                   continue
	               }

	               if (isWidget && arr.indexOf(cur) !== -1) {//处理配置对象
	                   config = cur
	                   configName = key
	                   continue
	               }

	               keys[key] = cur
	               if (accessors[key] && avalon.isObject(cur)) {//处理子vm
	                   delete accessors[key]
	               }
	               if ($accessors && $accessors[key]) {
	                   accessors[key] = $accessors[key]
	               } else if (typeof keys[key] !== 'function') {
	                   unresolve[key] = 1
	               }
	           }
	       }


	       if (typeof this === 'function') {
	           this(keys, unresolve)
	       }
	       for (key in unresolve) {
	           //系统属性跳过,已经有访问器的属性跳过
	           if ($$skipArray[key] || accessors[key])
	               continue
	           if (!isSkip(key, keys[key], $skipArray)) {

	               accessors[key] = makeAccessor(before.$id, key, heirloom)
	               accessors[key].set(keys[key])
	           }
	       }

	       var $vmodel = new Observer()
	       $vmodel = createViewModel($vmodel, accessors, keys)
	       for (key in keys) {
	           if (!accessors[key]) {//添加不可监控的属性

	               $vmodel[key] = keys[key]
	           }
	           //用于通过配置对象触发组件的$watch回调
	           if (isWidget && config && accessors[key] && config.hasOwnProperty(key)) {
	               var GET = accessors[key].get
	               //  GET.heirloom = heirloom
	               if (!GET.$decompose) {
	                   GET.$decompose = {}
	               }
	               GET.$decompose[configName + '.' + key] = $vmodel
	           }

	           if (key in $$skipArray) {
	               delete keys[key]
	           } else {
	               keys[key] = true
	           }

	       }

	       initViewModel($vmodel, heirloom, keys, accessors, {
	           id: before.$id,
	           hashcode: makeHashCode('$'),
	           master: true
	       })

	       return $vmodel
	   }


	   avalon.mediatorFactory = mediatorFactory

	   function update(vdom, update, hookName) {
	       if (hookName) {
	           vdom.afterChange = vdom.afterChange || []
	           avalon.Array.ensure(vdom.afterChange, update)
	       } else {
	           var dom = vdom.dom
	           update(vdom.dom, vdom, dom && dom.parentNode)
	       }
	   }

	   avalon.directive('important', {
	       priority: 1,
	       parse: function (copy, src, binding) {
	           var quoted = quote(binding.expr)
	           copy.local = '{}'
	           copy.vmodel = '__vmodel__'
	           copy[binding.name] = 1
	           //如果important没有定义可以进入
	           //如果important定义了,并且__vmodel__== important也可以进入
	           src.$prepend = ['(function(__top__){',
	               'var __i = avalon.scopes[' + quoted + ']',
	               'var ok = !__i || __i.vmodel === __top__',
	               'if( !ok ){',
	               'vnodes.push({skipContent:true,nodeName:"' + copy.nodeName + '"})',
	               'avalon.log("不进入"+' + quoted + ');return }',
	               'var __vmodel__ = avalon.vmodels[' + quoted + '];'

	           ].join('\n') + '\n'
	           src.$append = '\n})(__vmodel__);'
	       },
	       diff: function (copy, src, name) {
	           if (!src.dynamic[name]) {
	               src.local = copy.local
	               src.vmodel = copy.vmodel
	               update(src, this.update)
	           }
	       },
	       update: function (dom, vdom, parent) {
	           avalon.directives.controller.update(dom, vdom, parent, 'important')
	       }
	   })

	   var cacheMediator = {}
	   avalon.mediatorFactoryCache = function (top, $id) {
	       var vm = avalon.vmodels[$id]
	       if (vm && top && vm !== top) {
	           var a = top.$hashcode
	           var b = vm.$hashcode
	           var id = a + b
	           if (cacheMediator[id]) {
	               return cacheMediator[id]
	           }
	           var c = avalon.mediatorFactory(top, vm)
	           return cacheMediator[id] = c
	       } else {
	           return top
	       }
	   }
	   avalon.directive('controller', {
	       priority: 2,
	       parse: function (copy, src, binding) {
	           var quoted = quote(binding.expr)
	           copy.local = '__local__'
	           copy.vmodel = '__vmodel__'
	           copy[binding.name] = 1

	           src.$prepend = '(function(__top__){\n' +
	               'var __vmodel__ = avalon.mediatorFactoryCache(__top__,' + quoted + ')\n'
	           src.$append = '\n})(__vmodel__);'
	       },
	       diff: function (copy, src, name) {
	           if (!src.dynamic[name]) {
	               src.local = copy.local
	               src.vmodel = copy.vmodel

	               update(src, this.update)
	           }
	       },
	       update: function (dom, vdom, parent, important) {
	           var vmodel = vdom.vmodel
	           var local = vdom.local
	           var name = important ? 'ms-important' : 'ms-controller'
	           vdom.dynamic[name] = 1
	           var id = vdom.props[name]
	           var scope = avalon.scopes[id]
	           if (scope) {
	               return
	           }

	           var top = avalon.vmodels[id]
	           if (vmodel.$element && vmodel.$element.vtree[0] === vdom) {
	               var render = vmodel.$render
	           } else {
	               render = avalon.render([vdom], local)
	           }
	           vmodel.$render = render
	           vmodel.$element = dom
	           dom.vtree = [vdom]
	           if (top !== vmodel) {
	               top.$render = top.$render || render
	               top.$element = top.$element || dom
	           }
	           var needFire = important ? vmodel : top
	           var scope = avalon.scopes[id] = {
	               vmodel: vmodel,
	               local: local
	           }
	           update(vdom, function () {
	               avalon(dom).removeClass('ms-controller')
	               dom.setAttribute('wid', id)
	               if (avalon._disposeComponent)
					avalon._disposeComponent(dom)
	               var events = needFire.$events["onReady"]
	               if (events) {
	                   needFire.$fire('onReady')
	                   delete needFire.$events.onReady
	               }
	               scope.isMount = true
	           }, 'afterChange')

	       }
	   })

	   var cssDir = avalon.directive('css', {
	       diff: function (copy, src, name) {
	           var a = copy[name]
	           var p = src[name]
	           if (Object(a) === a) {
	               a = a.$model || a//安全的遍历VBscript
	               if (Array.isArray(a)) {//转换成对象
	                   var b = {}
	                   a.forEach(function (el) {
	                       el && avalon.shadowCopy(b, el)
	                   })
	                   a = b
	               }
	               var hasChange = false
	               if (!src.dynamic[name] || !p) {//如果一开始为空
	                   src[name] = a
	                   hasChange = true
	               } else {
	                   var patch = {}
	                   for (var i in a) {//diff差异点
	                       if (a[i] !== p[i]) {
	                           hasChange = true
	                       }
	                       patch[i] = a[i]
	                   }
	                   for (var i in p) {
	                       if (!(i in patch)) {
	                           hasChange = true
	                           patch[i] = ''
	                       }
	                   }
	                   src[name] = patch
	               }
	               if (hasChange) {
	                   if (name === 'ms-effect') {
	                       src[name] = a
	                   }
	                   update(src, this.update)
	               }
	           }
	           delete copy[name]//释放内存
	       },
	       update: function (dom, vdom) {
	           if (dom && dom.nodeType === 1) {
	               var wrap = avalon(dom)
	               vdom.dynamic['ms-css'] = 1
	               var change = vdom['ms-css']
	               for (var name in change) {
	                   wrap.css(name, change[name])
	               }
	           }
	       }
	   })

	   var cssDiff = cssDir.diff

	   avalon.directive('attr', {
	       diff: cssDiff,
	       //dom, vnode
	       update: attrUpdate
	   })

	   var none = 'none'
	   function parseDisplay(elem, val) {
	       //用于取得此类标签的默认display值
	       var doc = elem.ownerDocument
	       var nodeName = elem.nodeName
	       var key = '_' + nodeName
	       if (!parseDisplay[key]) {
	           var temp = doc.body.appendChild(doc.createElement(nodeName))
	           val = avalon.css(temp, 'display')
	           doc.body.removeChild(temp)
	           if (val === none) {
	               val = 'block'
	           }
	           parseDisplay[key] = val
	       }
	       return parseDisplay[key]
	   }

	   avalon.parseDisplay = parseDisplay

	   avalon.directive('visible', {
	       diff: function (copy, src, name) {
	           var c = !!copy[name]
	           if (!src.dynamic[name] || c !== src[name]) {
	               src[name] = c
	               update(src, this.update)
	           }
	       },
	       update: function (dom, vdom) {
	           if (dom && dom.nodeType === 1) {
	               vdom.dynamic['ms-visible'] = 1
	               var show = vdom['ms-visible']
	               var display = dom.style.display
	               var value
	               if (show) {
	                   if (display === none) {
	                       value = vdom.displayValue
	                       if (!value) {
	                           dom.style.display = ''
	                       }
	                   }
	                   if (dom.style.display === '' && avalon(dom).css('display') === none &&
	                       // fix firefox BUG,必须挂到页面上
	                       avalon.contains(dom.ownerDocument, dom)) {

	                       value = parseDisplay(dom)
	                   }
	               } else {
	                   if (display !== none) {
	                       value = none
	                       vdom.displayValue = display
	                   }
	               }
	               var cb = function () {
	                   if (value !== void 0) {
	                       dom.style.display = value
	                   }
	               }
	               avalon.applyEffect(dom, vdom, {
	                   hook: show ? 'onEnterDone' : 'onLeaveDone',
	                   cb: cb
	               })
	           }

	       }
	   })

	   avalon.directive('expr', {
	       parse: avalon.noop
	   })

	   avalon.directive('text', {
	       parse: function (copy, src, binding) {
	           copy[binding.name] = 1
	           src.children = []
	           copy.children = '[{\nnodeName:"#text",\ndynamic:true,' +
				'\nnodeValue:avalon.parsers.string(' +
				avalon.parseExpr(binding) + ')}]'
	       },
	       diff: function (copy, src) {
	           if (!src.children.length) {
				update(src, this.update)
	           }
	       },
	       update: function (dom, vdom) {
	           if (dom && !vdom.isVoidTag) {
	               var parent = dom
	               while (parent.firstChild) {
	                   parent.removeChild(parent.firstChild)
	               }
	               var dom = document.createTextNode('x')
	               parent.appendChild(dom)
	               var a = { nodeType: 3, nodeName: '#text', dom: dom }
	               vdom.children.push(a)
	           }
	       }
	   })

	   avalon.directive('html', {
	       parse: function (copy, src, binding) {
	           if (!src.isVoidTag) {
	               //将渲染函数的某一部分存起来,渲在c方法中转换为函数
	               copy[binding.name] = avalon.parseExpr(binding)
	               copy.vmodel = '__vmodel__'
	               copy.local = '__local__'
	           } else {
	               copy.children = '[]'
	           }
	       },
	       diff: function (copy, src, name) {
	           var copyValue = copy[name] + ''

	           if (!src.dynamic['ms-html'] || !src.render || copyValue !== src[name]) {
	               src[name] = copyValue

	               var oldTree = avalon.speedUp(avalon.lexer(copyValue))

	               var render = avalon.render(oldTree, copy.local)
	               src.render = render

	               var newTree = render(copy.vmodel, copy.local)

	               src.children = copy.children = newTree
	               update(src, this.update)
	           } else if (src.render) {
	               var newTree = src.render(copy.vmodel, copy.local)
	               copy.children = newTree
	           }
	       },
	       update: function (dom, vdom) {
	           vdom.dynamic['ms-html'] = 1
	           avalon.clearHTML(dom)
	           dom.appendChild(avalon.domize(vdom.children))
	       }
	   })

	   function classNames() {
	       var classes = []
	       for (var i = 0; i < arguments.length; i++) {
	           var arg = arguments[i]
	           var argType = typeof arg
	           if (argType === 'string' || argType === 'number' || arg === true) {
	               classes.push(arg)
	           } else if (Array.isArray(arg)) {
	               classes.push(classNames.apply(null, arg))
	           } else if (argType === 'object') {
	               for (var key in arg) {
	                   if (arg.hasOwnProperty(key) && arg[key]) {
	                       classes.push(key)
	                   }
	               }
	           }
	       }

	       return classes.join(' ')
	   }


	   avalon.directive('class', {
	       diff: function (copy, src, name) {
	           var type = name.slice(3)
	           var copyValue = copy[name]
	           var srcValue = src[name] || ''
	           var classEvent = src.classEvent || {}
	           if (type === 'hover') {//在移出移入时切换类名
	               classEvent.mouseenter = activateClass
	               classEvent.mouseleave = abandonClass
	           } else if (type === 'active') {//在获得焦点时切换类名
	               src.props.tabindex = copy.props.tabindex || -1
	               classEvent.tabIndex = src.props.tabindex
	               classEvent.mousedown = activateClass
	               classEvent.mouseup = abandonClass
	               classEvent.mouseleave = abandonClass
	           }
	           src.classEvent = classEvent

	           var className = classNames(copyValue)

	           if (!src.dynamic[name] || srcValue !== className) {
	               src[name] = className
	               src['change-' + type] = className
	               update(src, this.update, type)
	           }
	       },
	       update: function (dom, vdom) {
	           if (!dom || dom.nodeType !== 1)
	               return

	           var classEvent = vdom.classEvent
	           if (classEvent) {
	               for (var i in classEvent) {
	                   if (i === 'tabIndex') {
	                       dom[i] = classEvent[i]
	                   } else {
	                       avalon.bind(dom, i, classEvent[i])
	                   }
	               }
	               vdom.classEvent = {}
	           }
	           var names = ['class', 'hover', 'active']
	           names.forEach(function (type) {
	               var name = 'change-' + type
	               var value = vdom[name]
	               if (value === void 0)
	                   return
	               vdom.dynamic['ms-' + type] = 1
	               if (type === 'class') {
	                   dom && setClass(dom, vdom)
	               } else {
	                   var oldType = dom.getAttribute('change-' + type)
	                   if (oldType) {
	                       avalon(dom).removeClass(oldType)
	                   }
	                   dom.setAttribute(name, value)
	               }
	           })
	       }
	   })

	   directives.active = directives.hover = directives['class']


	   var classMap = {
	       mouseenter: 'change-hover',
	       mouseleave: 'change-hover',
	       mousedown: 'change-active',
	       mouseup: 'change-active'
	   }

	   function activateClass(e) {
	       var elem = e.target
	       avalon(elem).addClass(elem.getAttribute(classMap[e.type]) || '')
	   }

	   function abandonClass(e) {
	       var elem = e.target
	       var name = classMap[e.type]
	       avalon(elem).removeClass(elem.getAttribute(name) || '')
	       if (name !== 'change-active') {
	           avalon(elem).removeClass(elem.getAttribute('change-active') || '')
	       }
	   }

	   function setClass(dom, vdom) {
	       var old = dom.getAttribute('old-change-class')
	       var neo = vdom['ms-class']
	       if (old !== neo) {
	           avalon(dom).removeClass(old).addClass(neo)
	           dom.setAttribute('old-change-class', neo)
	       }

	   }

	   markID(activateClass)
	   markID(abandonClass)

	   //Ref: http://developers.whatwg.org/webappapis.html#event-handler-idl-attributes
	   // The assumption is that future DOM event attribute names will begin with
	   // 'on' and be composed of only English letters.
	   var rmson = /^ms\-on\-(\w+)/
	   //基于事件代理的高性能事件绑定
	   avalon.directive('on', {
	       priority: 3000,
	       parse: function (copy, src, binding) {
	           var underline = binding.name.replace('ms-on-', 'e').replace('-', '_')
	           var uuid = underline + '_' + binding.expr.
				replace(/\s/g, '').
				replace(/[^$a-z]/ig, function (e) {
					return e.charCodeAt(0)
				})

	           var quoted = avalon.quote(uuid)
	           var fn = '(function(){\n' +
				'var fn610 = ' +
				avalon.parseExpr(binding) +
				'\nfn610.uuid =' + quoted + ';\nreturn fn610})()'
	           copy.vmodel = '__vmodel__'
	           copy.local = '__local__'
	           copy[binding.name] = fn

	       },
	       diff: function (copy, src, name) {
	           var fn = copy[name]
	           var uuid = fn.uuid
	           var srcFn = src[name] || {}
	           var hasChange = false

	           if (!src.dynamic[name] || srcFn.uuid !== uuid) {
	               src[name] = fn
	               avalon.eventListeners[uuid] = fn
	               hasChange = true
	           }

	           if (diffObj(src.local || {}, copy.local)) {
	               hasChange = true
	           }
	           if (hasChange) {
	               src.local = copy.local
	               src.vmodel = copy.vmodel
	               update(src, this.update)
	           } else if (src.dom) {
	               src.dom._ms_local = copy.local
	           }
	       },
	       update: function (dom, vdom) {
	           if (dom && dom.nodeType === 1) { //在循环绑定中，这里为null
	               var key, listener
	               dom._ms_context_ = vdom.vmodel
	               dom._ms_local = vdom.local
	               for (key in vdom) {
	                   var match = key.match(rmson)
	                   if (match) {
	                       listener = vdom[key]
	                       vdom.dynamic[key] = 1
	                       avalon.bind(dom, match[1], listener)
	                   }
	               }
	           }
	       }
	   })

	   function diffObj(a, b) {
	       for (var i in a) {//diff差异点
	           if (a[i] !== b[i]) {
	               return true
	           }
	       }
	       return false
	   }

	   var keyMap = avalon.oneObject("break,case,catch,continue,debugger,default,delete,do,else,false," +
	       "finally,for,function,if,in,instanceof,new,null,return,switch,this," +
	       "throw,true,try,typeof,var,void,while,with," + /* 关键字*/
	       "abstract,boolean,byte,char,class,const,double,enum,export,extends," +
	       "final,float,goto,implements,import,int,interface,long,native," +
	       "package,private,protected,public,short,static,super,synchronized," +
	       "throws,transient,volatile")
	   avalon.keyMap = keyMap
	   var quoted = {
	       nodeName: 1,
	       forExpr: 1,
	       type: 1,
	       template: 1,
	       nodeValue: 1,
	       signature: 1,
	       wid: 1
	   }

	   var rneedQuote = /[W\:-]/
	   function fixKey(k) {
	       return (rneedQuote.test(k) || keyMap[k]) ? quote(k) : k
	   }

	   function stringify(obj) {
	       var arr1 = []
	       //字符不用东西包起来就变成变量
	       for (var i in obj) {
	           var type = typeof obj[i]
	           if (type === 'object') {
	               if (i === 'props') {
	                   var arr2 = []
	                   for (var k in obj.props) {
	                       var kv = obj.props[k]
	                       if (typeof kv === 'string') {
	                           kv = quote(kv)
	                       }
	                       arr2.push(fixKey(k) + ': ' + kv)
	                   }
	                   arr1.push(i + ': {' + arr2.join(',\n') + '}')

	               } else if (i === 'children') {
	                   arr1.push('children: [' + obj[i].map(function (a) {
	                       return stringify(a)
	                   }) + ']')
	               }
	           } else if (obj.hasOwnProperty(i)) {
	               var v = obj[i]
	               if (type === 'string') {
	                   v = quoted[i] ? quote(v) : v
	               }
	               arr1.push(fixKey(i) + ':' + v)
	           }
	       }
	       return '{\n' + arr1.join(',\n') + '}'
	   }

	   var updateModelMethods = {
	       input: function (prop) {//处理单个value值处理
	           var data = this
	           prop = prop || 'value'
	           var dom = data.dom
	           var rawValue = dom[prop]
	           var parsedValue = data.parse(rawValue)

	           //有时候parse后一致,vm不会改变,但input里面的值
	           data.value = rawValue
	           data.set(data.vmodel, parsedValue)
	           callback(data)
	           var pos = data.pos
	           if (dom.caret) {
	               data.setCaret(dom, pos)
	           }
	           //vm.aaa = '1234567890'
	           //处理 <input ms-duplex='@aaa|limitBy(8)'/>{{@aaa}} 这种格式化同步不一致的情况 

	       },
	       radio: function () {
	           var data = this
	           if (data.isChecked) {
	               var val = !data.value
	               data.set(data.vmodel, val)
	               callback(data)
	           } else {
	               updateModelMethods.input.call(data)
	               data.value = NaN
	           }
	       },
	       checkbox: function () {
	           var data = this
	           var array = data.value
	           if (!Array.isArray(array)) {
	               avalon.warn('ms-duplex应用于checkbox上要对应一个数组')
	               array = [array]
	           }
	           var method = data.dom.checked ? 'ensure' : 'remove'
	           if (array[method]) {
	               var val = data.parse(data.dom.value)
	               array[method](val)
	               callback(data)
	           }

	       },
	       select: function () {
	           var data = this
	           var val = avalon(data.dom).val() //字符串或字符串数组
	           if (val + '' !== this.value + '') {
	               if (Array.isArray(val)) { //转换布尔数组或其他
	                   val = val.map(function (v) {
	                       return data.parse(v)
	                   })
	               } else {
	                   val = data.parse(val)
	               }
	               data.set(data.vmodel, val)
	               callback(data)
	           }
	       },
	       contenteditable: function () {
	           updateModelMethods.input.call(this, 'innerHTML')
	       }
	   }

	   function callback(data) {
	       if (data.callback) {
	           data.callback.call(data.vmodel, {
	               type: 'changed',
	               target: data.dom
	           }, data.local)
	       }
	   }

	   function updateModelHandle(event) {
	       var elem = this
	       var field = this.__ms_duplex__
	       if (elem.composing) {
	           //防止onpropertychange引发爆栈
	           return
	       }
	       if (elem.value === field.value) {
	           return
	       }
	       if (elem.caret) {
	           try {
	               var pos = field.getCaret(elem)
	               field.pos = pos
	           } catch (e) {
	           }
	       }

	       if (field.debounceTime > 4) {
	           var timestamp = new Date()
	           var left = timestamp - field.time || 0
	           field.time = timestamp
	           if (left >= field.debounceTime) {
	               updateModelMethods[field.type].call(field)
	           } else {
	               clearTimeout(field.debounceID)
	               field.debounceID = setTimeout(function () {
	                   updateModelMethods[field.type].call(field)
	               }, left)
	           }
	       } else {
	           updateModelMethods[field.type].call(field)
	       }
	   }

	   var msie = avalon.msie

	   function updateModelByEvent(node, vnode) {
	       var events = {}
	       var data = vnode['ms-duplex']
	       data.update = updateModelHandle
	       //添加需要监听的事件
	       switch (data.type) {
	           case 'radio':
	           case 'checkbox':
	               events.click = updateModelHandle
	               break
	           case 'select':
	               events.change = updateModelHandle
	               break
	           case 'contenteditable':
	               if (data.isChanged) {
	                   events.blur = updateModelHandle
	               } else {
	                   if (avalon.modern) {
	                       if (win.webkitURL) {
	                           // http://code.metager.de/source/xref/WebKit/LayoutTests/fast/events/
	                           // https://bugs.webkit.org/show_bug.cgi?id=110742
	                           events.webkitEditableContentChanged = updateModelHandle
	                       } else if (win.MutationEvent) {
	                           events.DOMCharacterDataModified = updateModelHandle
	                       }
	                       events.input = updateModelHandle
	                   } else {
	                       events.keydown = updateModelKeyDown
	                       events.paste = updateModelDelay
	                       events.cut = updateModelDelay
	                       events.focus = closeComposition
	                       events.blur = openComposition
	                   }

	               }
	               break
	           case 'input':
	               if (data.isChanged) {
	                   events.change = updateModelHandle
	               } else {
	                   //http://www.cnblogs.com/rubylouvre/archive/2013/02/17/2914604.html
	                   //http://www.matts411.com/post/internet-explorer-9-oninput/
	                   if (msie) {//处理输入法问题
	                       events.keyup = updateModelKeyDown
	                   }

	                   if (msie < 9) {
	                       events.propertychange = updateModelHack
	                       events.paste = updateModelDelay
	                       events.cut = updateModelDelay
	                   } else {
	                       events.input = updateModelHandle
	                   }
	                   //IE6-8的propertychange有BUG,第一次用JS修改值时不会触发,而且你是全部清空value也不会触发
	                   //IE9的propertychange不支持自动完成,退格,删除,复制,贴粘,剪切或点击右边的小X的清空操作
	                   //IE11微软拼音好像才会触发compositionstart 不会触发compositionend
	                   //https://github.com/RubyLouvre/avalon/issues/1368#issuecomment-220503284
	                   if (!msie || msie > 9) {
	                       events.compositionstart = openComposition
	                       events.compositionend = closeComposition
	                   }
	                   if (!msie) {

	                       //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/TypedArray
	                       //如果当前浏览器支持Int8Array,那么我们就不需要以下这些事件来打补丁了
	                       if (!/\[native code\]/.test(win.Int8Array)) {
	                           events.keydown = updateModelKeyDown //safari < 5 opera < 11
	                           events.paste = updateModelDelay//safari < 5
	                           events.cut = updateModelDelay//safari < 5 
	                           if (win.netscape) {
	                               // Firefox <= 3.6 doesn't fire the 'input' event when text is filled in through autocomplete
	                               events.DOMAutoComplete = updateModelHandle
	                           }
	                       }
	                   }
	               }
	               break
	       }

	       if (/password|text/.test(vnode.props.type)) {
	           events.focus = openCaret //判定是否使用光标修正功能 
	           events.blur = closeCaret
	           data.getCaret = getCaret
	           data.setCaret = setCaret
	       }

	       for (var name in events) {
	           avalon.bind(node, name, events[name])
	       }
	   }


	   function updateModelHack(e) {
	       if (e.propertyName === 'value') {
	           updateModelHandle.call(this, e)
	       }
	   }

	   function updateModelDelay(e) {
	       var elem = this
	       setTimeout(function () {
	           updateModelHandle.call(elem, e)
	       }, 0)
	   }


	   function openCaret() {
	       this.caret = true
	   }

	   function closeCaret() {
	       this.caret = false
	   }
	   function openComposition() {
	       this.composing = true
	   }

	   function closeComposition(e) {
	       this.composing = false
	       updateModelDelay.call(this, e)
	   }

	   function updateModelKeyDown(e) {
	       var key = e.keyCode
	       // ignore
	       //    command            modifiers                   arrows
	       if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40))
	           return
	       updateModelHandle.call(this, e)
	   }

	   markID$1(openCaret)
	   markID$1(closeCaret)
	   markID$1(openComposition)
	   markID$1(closeComposition)
	   markID$1(updateModelHandle)
	   markID$1(updateModelHack)
	   markID$1(updateModelDelay)
	   markID$1(updateModelKeyDown)

	   //IE6-8要处理光标时需要异步
	   var mayBeAsync = function (fn) {
	       setTimeout(fn, 0)
	   }
	   var setCaret = function (target, cursorPosition) {
	       var range
	       if (target.createTextRange) {
	           mayBeAsync(function () {
	               target.focus()
	               range = target.createTextRange()
	               range.collapse(true)
	               range.moveEnd('character', cursorPosition)
	               range.moveStart('character', cursorPosition)
	               range.select()
	           })
	       } else {
	           target.focus()
	           if (target.selectionStart !== undefined) {
	               target.setSelectionRange(cursorPosition, cursorPosition)
	           }
	       }
	   }

	   var getCaret = function (target) {
	       var start = 0
	       var normalizedValue
	       var range
	       var textInputRange
	       var len
	       var endRange

	       if (typeof target.selectionStart == 'number' && typeof target.selectionEnd == 'number') {
	           start = target.selectionStart
	       } else {
	           range = doc$1.selection.createRange()

	           if (range && range.parentElement() == target) {
	               len = target.value.length
	               normalizedValue = target.value.replace(/\r\n/g, '\n')

	               textInputRange = target.createTextRange()
	               textInputRange.moveToBookmark(range.getBookmark())

	               endRange = target.createTextRange()
	               endRange.collapse(false)

	               if (textInputRange.compareEndPoints('StartToEnd', endRange) > -1) {
	                   start = len
	               } else {
	                   start = -textInputRange.moveStart('character', -len)
	                   start += normalizedValue.slice(0, start).split('\n').length - 1
	               }
	           }
	       }

	       return start
	   }

	   var valueHijack = false
	   try { //#272 IE9-IE11, firefox

	       var setters = {}
	       var aproto = HTMLInputElement.prototype
	       var bproto = HTMLTextAreaElement.prototype
	       var newSetter = function (value) { // jshint ignore:line
	           setters[this.tagName].call(this, value)
	           var data = this.__ms_duplex__
	           if (!this.caret && data && data.isString) {
	               data.update.call(this, { type: 'setter' })
	           }
	       }
	       var inputProto = HTMLInputElement.prototype
	       Object.getOwnPropertyNames(inputProto) //故意引发IE6-8等浏览器报错
	       setters['INPUT'] = Object.getOwnPropertyDescriptor(aproto, 'value').set

	       Object.defineProperty(aproto, 'value', {
	           set: newSetter
	       })
	       setters['TEXTAREA'] = Object.getOwnPropertyDescriptor(bproto, 'value').set
	       Object.defineProperty(bproto, 'value', {
	           set: newSetter
	       })
	       valueHijack = true
	   } catch (e) {
	       //在chrome 43中 ms-duplex终于不需要使用定时器实现双向绑定了
	       // http://updates.html5rocks.com/2015/04/DOM-attributes-now-on-the-prototype
	       // https://docs.google.com/document/d/1jwA8mtClwxI-QJuHT7872Z0pxpZz8PBkf2bGAbsUtqs/edit?pli=1
	   }

	   var updateView = {
	       input: function () {//处理单个value值处理
	           this.dom.value = this.value
	       },
	       radio: function () {//处理单个checked属性
	           var checked
	           if (this.isChecked) {
	               checked = !!this.value
	           } else {
	               checked = this.value + '' === this.dom.value
	           }
	           var dom = this.dom
	           if (avalon.msie === 6) {
	               setTimeout(function () {
	                   //IE8 checkbox, radio是使用defaultChecked控制选中状态，
	                   //并且要先设置defaultChecked后设置checked
	                   //并且必须设置延迟
	                   dom.defaultChecked = checked
	                   dom.checked = checked
	               }, 31)
	           } else {
	               dom.checked = checked
	           }
	       },
	       checkbox: function () {//处理多个checked属性
	           var checked = false
	           var dom = this.dom
	           var value = dom.value
	           for (var i = 0; i < this.value.length; i++) {
	               var el = this.value[i]
	               if (el + '' === value) {
	                   checked = true
	               }
	           }
	           dom.checked = checked
	       },
	       select: function () {//处理子级的selected属性
	           var a = Array.isArray(this.value) ?
	               this.value.map(String) : this.value + ''
	           avalon(this.dom).val(a)
	       },
	       contenteditable: function () {//处理单个innerHTML
	           this.dom.innerHTML = this.value
	           this.update.call(this.dom)
	       }
	   }

	   function addField(node, vnode) {
	       var field = node.__ms_duplex__
	       var rules = vnode['ms-rules']
	       if (rules && !field.validator) {
	           while (node && node.nodeType === 1) {
	               var validator = node._ms_validator_
	               if (validator) {
	                   field.rules = rules
	                   field.validator = validator
	                   if (avalon.Array.ensure(validator.fields, field)) {
	                       validator.addField(field)
	                   }
	                   break
	               }
	               node = node.parentNode
	           }
	       }
	   }

	   var rchangeFilter = /\|\s*change\b/
	   var rcheckedType$1 = /^(?:checkbox|radio)$/
	   var rdebounceFilter = /\|\s*debounce(?:\(([^)]+)\))?/
	   var duplexDir = 'ms-duplex'


	   avalon.directive('duplex', {
	       priority: 2000,
	       parse: function (copy, src, binding) {
	           var expr = binding.expr
	           var etype = src.props.type
	           //处理数据转换器
	           var parsers = binding.param, dtype
	           var isChecked = false
	           parsers = parsers ? parsers.split('-').map(function (a) {
	               if (a === 'checked') {
	                   isChecked = true
	               }
	               return a
	           }) : []

	           if (rcheckedType$1.test(etype) && isChecked) {
	               //如果是radio, checkbox,判定用户使用了checked格式函数没有
	               parsers = []
	               dtype = 'radio'
	           }

	           if (!/input|textarea|select/.test(src.nodeName)) {
	               if ('contenteditable' in src.props) {
	                   dtype = 'contenteditable'
	               }
	           } else if (!dtype) {
	               dtype = src.nodeName === 'select' ? 'select' :
	                   etype === 'checkbox' ? 'checkbox' :
	                       etype === 'radio' ? 'radio' :
	                           'input'
	           }
	           var isChanged = false, debounceTime = 0
	           //判定是否使用了 change debounce 过滤器
	           if (dtype === 'input' || dtype === 'contenteditable') {
	               var isString = true
	               if (rchangeFilter.test(expr)) {
	                   isChanged = true
	               }
	               if (!isChanged) {
	                   var match = expr.match(rdebounceFilter)
	                   if (match) {
	                       debounceTime = parseInt(match[1], 10) || 300
	                   }
	               }
	           }


	           var changed = copy.props['data-duplex-changed']
	           var get = avalon.parseExpr(binding)// 输出原始数据
	           var quoted = parsers.map(function (a) {
	               return avalon.quote(a)
	           })
	           copy[duplexDir] = stringify({
	               type: dtype, //这个决定绑定什么事件
	               vmodel: '__vmodel__',
	               local: '__local__',
	               debug: avalon.quote(binding.name + '=' + binding.expr),
	               isChecked: isChecked,
	               parsers: '[' + quoted + ']',
	               isString: !!isString,
	               isChanged: isChanged, //这个决定同步的频数
	               debounceTime: debounceTime, //这个决定同步的频数
	               get: get,
	               set: avalon.evaluatorPool.get('duplex:set:' + expr),
	               callback: changed ? avalon.parseExpr({ expr: changed, type: 'on' }) : 'avalon.noop'
	           })

	       },
	       diff: function (copy, src) {
	           if (!src.dynamic[duplexDir]) {
	               //第一次为原始虚拟DOM添加duplexData
	               var data = src[duplexDir] = copy[duplexDir]
	               data.parse = parseValue
	           } else {
	               data = src[duplexDir]
	           }
	           if (copy !== src) {//释放内存
	               copy[duplexDir] = null
	           }

	           var curValue = data.get(data.vmodel)
	           var preValue = data.value
	           if (data.isString) {//减少不必要的视图渲染
	               curValue = data.parse(curValue)
	               curValue += ''
	               if (curValue === preValue) {
	                   return
	               }
	           } else if (Array.isArray(curValue)) {
	               var hack = true
	               if (curValue + '' === data.arrayHack) {
	                   return
	               }
	           }
	           data.value = curValue
	           //如果是curValue是一个数组,当我们改变vm中的数组,
	           //那么这个data.value也是跟着改变,因此必须保持一份副本才能用于比较 
	           if (hack) {
	               data.arayHack = curValue + ''
	           }
	           update(src, this.update, 'afterChange')
	       },
	       update: function (dom, vdom) {
	           if (dom && dom.nodeType === 1) {
	               //vdom.dynamic变成字符串{}
	               vdom.dynamic[duplexDir] = 1
	               if (!dom.__ms_duplex__) {
	                   dom.__ms_duplex__ = avalon.mix(vdom[duplexDir], { dom: dom })
	                   //绑定事件
	                   updateModelByEvent(dom, vdom)
	                   //添加验证
	                   addField(dom, vdom)
	               }

	               var data = dom.__ms_duplex__
	               data.dom = dom
	               //如果不支持input.value的Object.defineProperty的属性支持,
	               //需要通过轮询同步, chrome 42及以下版本需要这个hack
	               if (data.isString
	                   && !avalon.msie
	                   && valueHijack === false
	                   && !dom.valueHijack) {

	                   dom.valueHijack = updateModelHandle
	                   var intervalID = setInterval(function () {
	                       if (!avalon.contains(avalon.root, dom)) {
	                           clearInterval(intervalID)
	                       } else {
	                           dom.valueHijack({ type: 'poll' })
	                       }
	                   }, 30)
	               }
	               //更新视图
	               updateView[data.type].call(data)
	           }
	       }
	   })

	   function parseValue(val) {
	       for (var i = 0, k; k = this.parsers[i++];) {
	           var fn = avalon.parsers[k]
	           if (fn) {
	               val = fn.call(this, val)
	           }
	       }
	       return val
	   }

	   var valiDir = avalon.directive('validate', {
	       //验证单个表单元素
	       diff: function (copy, src, name) {
	           var validator = copy[name]
	           var p = src[name]
	           /* istanbul ignore if */
	           /* istanbul ignore else */
	           if (p && p.onError && p.addField) {
	               return
	           } else if (Object(validator) === validator) {
	               src.vmValidator = validator
	               if (validator.$id) {//转换为普通对象
	                   validator = validator.$model
	               }

	               src[name] = validator
	               for (var name in valiDir.defaults) {
	                   if (!validator.hasOwnProperty(name)) {
	                       validator[name] = valiDir.defaults[name]
	                   }
	               }
	               validator.fields = validator.fields || []
	               update(src, this.update)

	           }
	       },
	       update: function (dom, vdom) {
	           var validator = vdom['ms-validate']
	           dom._ms_validator_ = validator
	           validator.dom = dom
	           var v = vdom.vmValidator
	           try {
	               v.onManual = onManual
	           } catch (e) {
	           }
	           delete vdom.vmValidator
	           dom.setAttribute('novalidate', 'novalidate')
	           function onManual() {
	               valiDir.validateAll.call(validator, validator.onValidateAll)
	           }
	           /* istanbul ignore if */
	           if (validator.validateAllInSubmit) {
	               avalon.bind(dom, 'submit', function (e) {
	                   e.preventDefault()
	                   onManual()
	               })
	           }
	           /* istanbul ignore if */
	           if (typeof validator.onInit === 'function') { //vmodels是不包括vmodel的
	               validator.onInit.call(dom, {
	                   type: 'init',
	                   target: dom,
	                   validator: validator
	               })
	           }
	       },
	       validateAll: function (callback) {
	           var validator = this
	           var fn = typeof callback === 'function' ? callback : validator.onValidateAll
	           var promise = validator.fields.filter(function (field) {
	               var el = field.dom
	               return el && !el.disabled && validator.dom.contains(el)
	           }).map(function (field) {
	               return valiDir.validate(field, true)
	           })

	           return Promise.all(promise).then(function (array) {
	               var reasons = array.concat.apply([], array)
	               if (validator.deduplicateInValidateAll) {
	                   var uniq = {}
	                   reasons = reasons.filter(function (reason) {
	                       var el = reason.element
	                       var uuid = el.uniqueID || (el.uniqueID = setTimeout('1'))
	                       if (uniq[uuid]) {
	                           return false
	                       } else {
	                           return uniq[uuid] = true
	                       }
	                   })
	               }
	               fn.call(validator.dom, reasons) //这里只放置未通过验证的组件
	           })
	       },
	       addField: function (field) {
	           var validator = this
	           var node = field.dom
	           /* istanbul ignore if */
	           if (validator.validateInKeyup && (!field.isChanged && !field.debounceTime)) {
	               avalon.bind(node, 'keyup', function (e) {
	                   validator.validate(field, 0, e)
	               })
	           }
	           /* istanbul ignore if */
	           if (validator.validateInBlur) {
	               avalon.bind(node, 'blur', function (e) {
	                   validator.validate(field, 0, e)
	               })
	           }
	           /* istanbul ignore if */
	           if (validator.resetInFocus) {
	               avalon.bind(node, 'focus', function (e) {
	                   validator.onReset.call(node, e, field)
	               })
	           }
	       },
	       validate: function (field, isValidateAll, event) {
	           var promises = []
	           var value = field.value
	           var elem = field.dom
	           var validator = field.validator
	           /* istanbul ignore if */
	           if (typeof Promise !== 'function') {
	               avalon.error('please npm install avalon-promise or bluebird')
	           }
	           /* istanbul ignore if */
	           if (elem.disabled)
	               return
	           var rules = field.rules
	           if (!(rules.norequired && value === '')) {
	               for (var ruleName in rules) {
	                   var ruleValue = rules[ruleName]
	                   if (ruleValue === false)
	                       continue
	                   var hook = avalon.validators[ruleName]
	                   var resolve, reject
	                   promises.push(new Promise(function (a, b) {
	                       resolve = a
	                       reject = b
	                   }))
	                   var next = function (a) {
	                       if (a) {
	                           resolve(true)
	                       } else {
	                           var reason = {
	                               element: elem,
	                               data: field.data,
	                               message: elem.getAttribute('data-' + ruleName + '-message') || elem.getAttribute('data-message') || hook.message,
	                               validateRule: ruleName,
	                               getMessage: getMessage
	                           }
	                           resolve(reason)
	                       }
	                   }
	                   field.data = {}
	                   field.data[ruleName] = ruleValue
	                   hook.get(value, field, next)
	               }
	           }

	           //如果promises不为空，说明经过验证拦截器
	           return Promise.all(promises).then(function (array) {
	               var reasons = array.filter(function (el) {
	                   return typeof el === 'object'
	               })
	               if (!isValidateAll) {
	                   if (reasons.length) {
	                       validator.onError.call(elem, reasons, event)
	                   } else {
	                       validator.onSuccess.call(elem, reasons, event)
	                   }
	                   validator.onComplete.call(elem, reasons, event)
	               }
	               return reasons
	           })
	       }
	   })

	   var rformat = /\\?{{([^{}]+)\}}/gm

	   function getMessage() {
	       var data = this.data || {}
	       return this.message.replace(rformat, function (_, name) {
	           return data[name] == null ? '' : data[name]
	       })
	   }
	   valiDir.defaults = {
	       addField: valiDir.addField, //供内部使用,收集此元素底下的所有ms-duplex的域对象
	       onError: avalon.noop,
	       onSuccess: avalon.noop,
	       onComplete: avalon.noop,
	       onManual: avalon.noop,
	       onReset: avalon.noop,
	       onValidateAll: avalon.noop,
	       validateInBlur: true, //@config {Boolean} true，在blur事件中进行验证,触发onSuccess, onError, onComplete回调
	       validateInKeyup: true, //@config {Boolean} true，在keyup事件中进行验证,触发onSuccess, onError, onComplete回调
	       validateAllInSubmit: true, //@config {Boolean} true，在submit事件中执行onValidateAll回调
	       resetInFocus: true, //@config {Boolean} true，在focus事件中执行onReset回调,
	       deduplicateInValidateAll: false //@config {Boolean} false，在validateAll回调中对reason数组根据元素节点进行去重
	   }

	   avalon.directive('rules', {
	       diff: function (copy, src, name) {
	           var neo = copy[name]
	           if (neo && Object.prototype.toString.call(neo) === '[object Object]') {
	               src[name] = neo.$model || neo
	               var field = src.dom && src.dom.__ms_duplex__
	               if (field) {
	                   field.rules = copy[name]
	               }
	           }
	       }
	   })
	   function isRegExp(value) {
	       return avalon.type(value) === 'regexp'
	   }
	   var rmail = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/i
	   var rurl = /^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/
	   function isCorrectDate(value) {
	       if (typeof value === "string" && value) { //是字符串但不能是空字符
	           var arr = value.split("-") //可以被-切成3份，并且第1个是4个字符
	           if (arr.length === 3 && arr[0].length === 4) {
	               var year = ~~arr[0] //全部转换为非负整数
	               var month = ~~arr[1] - 1
	               var date = ~~arr[2]
	               var d = new Date(year, month, date)
	               return d.getFullYear() === year && d.getMonth() === month && d.getDate() === date
	           }
	       }
	       return false
	   }
	   //https://github.com/adform/validator.js/blob/master/validator.js
	   avalon.shadowCopy(avalon.validators, {
	       pattern: {
	           message: '必须匹配{{pattern}}这样的格式',
	           get: function (value, field, next) {
	               var elem = field.dom
	               var data = field.data
	               if (!isRegExp(data.pattern)) {
	                   var h5pattern = elem.getAttribute("pattern")
	                   data.pattern = new RegExp('^(?:' + h5pattern + ')$')
	               }
	               next(data.pattern.test(value))
	               return value
	           }
	       },
	       digits: {
	           message: '必须整数',
	           get: function (value, field, next) {//整数
	               next(/^\-?\d+$/.test(value))
	               return value
	           }
	       },
	       number: {
	           message: '必须数字',
	           get: function (value, field, next) {//数值
	               next(!!value && isFinite(value))// isFinite('') --> true
	               return value
	           }
	       },
	       norequired: {
	           message: '',
	           get: function (value, field, next) {
	               next(true)
	               return value
	           }
	       },
	       required: {
	           message: '必须填写',
	           get: function (value, field, next) {
	               next(value !== '')
	               return value
	           }
	       },
	       equalto: {
	           message: '密码输入不一致',
	           get: function (value, field, next) {
	               var id = String(field.data.equalto)
	               var other = avalon(document.getElementById(id)).val() || ""
	               next(value === other)
	               return value
	           }
	       },
	       date: {
	           message: '日期格式不正确',
	           get: function (value, field, next) {
	               var data = field.data
	               if (isRegExp(data.date)) {
	                   next(data.date.test(value))
	               } else {
	                   next(isCorrectDate(value))
	               }
	               return value
	           }
	       },
	       url: {
	           message: 'URL格式不正确',
	           get: function (value, field, next) {
	               next(rurl.test(value))
	               return value
	           }
	       },
	       email: {
	           message: 'email格式不正确',
	           get: function (value, field, next) {
	               next(rmail.test(value))
	               return value
	           }
	       },
	       minlength: {
	           message: '最少输入{{minlength}}个字',
	           get: function (value, field, next) {
	               var num = parseInt(field.data.minlength, 10)
	               next(value.length >= num)
	               return value
	           }
	       },
	       maxlength: {
	           message: '最多输入{{maxlength}}个字',
	           get: function (value, field, next) {
	               var num = parseInt(field.data.maxlength, 10)
	               next(value.length <= num)
	               return value
	           }
	       },
	       min: {
	           message: '输入值不能小于{{min}}',
	           get: function (value, field, next) {
	               var num = parseInt(field.data.min, 10)
	               next(parseFloat(value) >= num)
	               return value
	           }
	       },
	       max: {
	           message: '输入值不能大于{{max}}',
	           get: function (value, field, next) {
	               var num = parseInt(field.data.max, 10)
	               next(parseFloat(value) <= num)
	               return value
	           }
	       },
	       chs: {
	           message: '必须是中文字符',
	           get: function (value, field, next) {
	               next(/^[\u4e00-\u9fa5]+$/.test(value))
	               return value
	           }
	       }
	   })

	   avalon.directive('if', {
	       priority: 6,
	       diff: function (copy, src, name, copys, sources, index) {
	           var cur = !!copy[name]
	           src[name] = cur
	           update(src, this.update)
	       },
	       update: function (dom, vdom, parent) {
	           var show = vdom['ms-if']
	           if (vdom.dynamic['ms-if']) {
	               vdom.dynamic['ms-if'] = vdom.nodeName
	           }
	           if (show) {
	               if (vdom.nodeName === '#comment') {
	                   vdom.nodeName = vdom.dynamic['ms-if']
	                   delete vdom.nodeValue
	                   var comment = vdom.comment
	                   if (!comment) {
	                       return
	                   }
	                   parent = comment.parentNode
	                   if (parent)
	                       parent.replaceChild(dom, comment)
	                   delete vdom.comment
	                   avalon.applyEffect(dom, vdom, {
	                       hook: 'onEnterDone'
	                   })
	               }
	           } else {
	               //要移除元素节点,在对应位置上插入注释节点
	               if (!vdom.comment) {
	                   vdom.comment = document.createComment('if')
	               }
	               vdom.nodeName = '#comment'
	               vdom.nodeValue = 'if'
	               avalon.applyEffect(dom, vdom, {
	                   hook: 'onLeaveDone',
	                   cb: function () {
	                       //去掉注释节点临时添加的ms-effect
	                       //https://github.com/RubyLouvre/avalon/issues/1577
	                       //这里必须设置nodeValue为ms-if,否则会在节点对齐算法中出现乱删节点的BUG
	                       if (!parent || parent.nodeType === 11) {
	                           parent = dom.parentNode
	                           if (!parent || parent.nodeType === 11) {
	                               return
	                           }
	                       }
	                       parent.replaceChild(vdom.comment, dom)
	                   }
	               })
	           }
	       }
	   })

	   var rforAs = /\s+as\s+([$\w]+)/
	   var rident = /^[$a-zA-Z_][$a-zA-Z0-9_]*$/
	   var rinvalid = /^(null|undefined|NaN|window|this|\$index|\$id)$/
	   var rargs = /[$\w_]+/g

	   function getTraceKey(item) {
	       var type = typeof item
	       return item && type === 'object' ? item.$hashcode : type + ':' + item
	   }

	   avalon._each = function (obj, fn, local, vnodes) {
	       var repeat = []
	       vnodes.push(repeat)
	       var arr = (fn + '').slice(0, 40).match(rargs)

	       arr.shift()

	       if (Array.isArray(obj)) {
	           for (var i = 0; i < obj.length; i++) {
	               iterator$1(i, obj[i], local, fn, arr[0], arr[1], repeat, true)
	           }
	       } else {
	           for (var i in obj) {
	               if (obj.hasOwnProperty(i)) {
	                   iterator$1(i, obj[i], local, fn, arr[0], arr[1], repeat)
	               }
	           }
	       }
	   }

	   function iterator$1(index, item, vars, fn, k1, k2, repeat, isArray) {
	       var key = isArray ? getTraceKey(item) : index
	       var local = {}
	       local[k1] = index
	       local[k2] = item
	       for (var k in vars) {
	           if (!(k in local)) {
	               local[k] = vars[k]
	           }
	       }
	       fn(index, item, key, local, repeat)
	   }


	   avalon.directive('for', {
	       priority: 3,
	       parse: function (copy, src) {
	           var str = src.forExpr, aliasAs
	           str = str.replace(rforAs, function (a, b) {
	               /* istanbul ignore if */
	               if (!rident.test(b) || rinvalid.test(b)) {
	                   avalon.error('alias ' + b + ' is invalid --- must be a valid JS identifier which is not a reserved name.')
	               } else {
	                   aliasAs = b
	               }
	               return ''
	           })

	           var arr = str.split(' in ')
	           var binding = {
	               expr: arr[1].trim(),
	               type: 'for'
	           }
	           var getLoop = avalon.parseExpr(binding)
	           var kv = (arr[0] + ' traceKey __local__ vnodes').match(rargs)
	           if (kv.length === 4) {//确保avalon._each的回调有三个参数
	               kv.unshift('$key')
	           }
	           src.$append = Array('var loop = ' + getLoop + ';',
	               'avalon._each(loop, function(' + kv + '){',
	               '__local__[' + quote(aliasAs || 'valueOf') + '] = loop',
	               'vnodes.push({',
	               '\tnodeName: "#document-fragment",',
	               '\tindex   : arguments[0],',
	               '\tkey     : traceKey,',
	               '\tchildren: new function(){\nvar vnodes = []\n').join('\n')

	       },
	       diff: function (copy, src, cpList, spList, index) {
	           //将curRepeat转换成一个个可以比较的component,并求得compareText
	           //如果这个元素没有插入
	           if (avalon.callArray) {
	               if (src.list && src.forExpr.indexOf(avalon.callArray) === -1) {
	                   return
	               }
	           }

	           var srcRepeat = spList[index + 1]
	           var curRepeat = cpList[index + 1]
	           var end = cpList[index + 2]
	           //preRepeat不为空时
	           var cache = src.cache || {}
	           //for指令只做添加删除操作
	           var i, c, p
	           var removes = []
	           if (!srcRepeat.length) {//一维数组最开始初始化时
	               src.action = 'init'

	               /* eslint-disable no-cond-assign */
	               spList[index + 1] = curRepeat
	               curRepeat.forEach(function (c, i) {
	                   srcRepeat[i] = c
	                   saveInCache(cache, c)
	               })
	               src.cache = cache
	           } else if (srcRepeat === curRepeat) {
	               curRepeat.forEach(function (c) {
	                   c.action = 'move'
	                   saveInCache(cache, c)
	               })
	               src.cache = cache
	               var noUpdate = true
	           } else {
	               src.action = 'update'
	               var newCache = {}
	               /* eslint-disable no-cond-assign */
	               var fuzzy = []
	               for (i = 0; c = curRepeat[i]; i++) {
	                   var p = isInCache(cache, c.key)
	                   if (p) {
	                       p.oldIndex = p.index
	                       p.index = c.index
	                       saveInCache(newCache, p)
	                   } else {
	                       //如果找不到就进行模糊搜索
	                       fuzzy.push(c)
	                   }
	               }
	               for (var i = 0, c; c = fuzzy[i]; i++) {
	                   p = fuzzyMatchCache(cache, c.key)
	                   if (p) {
	                       p.oldIndex = p.index
	                       p.index = c.index
	                       p.key = c.key
	                   } else {
	                       p = c
	                       srcRepeat.push(p)
	                   }

	                   saveInCache(newCache, p)
	               }
	               srcRepeat.sort(function (a, b) {
	                   return a.index - b.index
	               })

	               src.cache = newCache
	               for (var i in cache) {
	                   p = cache[i]
	                   p.action = 'leave'
	                   avalon.Array.remove(srcRepeat, p)
	                   removes.push(p)
	                   if (p.arr) {
	                       p.arr.forEach(function (m) {
	                           m.action = 'leave'
	                           removes.push(m)
	                       })
	                       delete p.arr
	                   }
	               }

	           }
	           /* istanbul ignore if */
	           if (removes.length > 1) {
	               removes.sort(function (a, b) {
	                   return a.index - b.index
	               })
	           }
	           src.removes = removes
	           var cb = avalon.caches[src.wid]
	           var vm = copy.vmodel
	           if (end && cb) {
	               end.afterChange = [function (dom) {
	                   cb.call(vm, {
	                       type: 'rendered',
	                       target: dom,
	                       signature: src.signature
	                   })
	               }]
	           }
	           if (!noUpdate) {
	               src.list = srcRepeat
	               update(src, this.update)
	           }
	           return true

	       },
	       update: function (dom, vdom, parent) {
	           if (vdom.action === 'init') {
	               var b = parent
	               parent = document.createDocumentFragment()
	           }
	           var before = dom
	           var signature = vdom.signature

	           for (var i = 0, item; item = vdom.removes[i++];) {
	               if (item.dom) {

	                   delete item.split
	                   /* istanbul ignore if*/
	                   /* istanbul ignore else*/
	                   if (vdom.hasEffect) {
	                       !function (obj) {
	                           var nodes = moveItem(obj)
	                           var children = obj.children.concat()
	                           obj.children.length = 0
	                           applyEffects(nodes, children, {
	                               hook: 'onLeaveDone',
	                               staggerKey: signature + 'leave',
	                               cb: function (node) {
	                                   if (node.parentNode) {
	                                       node.parentNode.removeChild(node)
	                                   }
	                               }
	                           })
	                       } (item)
	                   } else {
	                       moveItem(item, 'add')
	                   }

	               }
	           }
	           vdom.list.forEach(function (el, i) {
	               if (el.action === 'leave')
	                   return
	               if (!el.dom) {
	                   el.dom = avalon.domize(el)
	               }
	               var f = el.dom
	               if (el.oldIndex === void 0) {
	                   if (vdom.hasEffect)
	                       var nodes = avalon.slice(f.childNodes)
	                   if (i === 0 && vdom.action === 'init') {
	                       parent.appendChild(f)
	                   } else {
	                       parent.insertBefore(f, before.nextSibling)
	                   }
	                   if (vdom.hasEffect) {
	                       applyEffects(nodes, el.children, {
	                           hook: 'onEnterDone',
	                           staggerKey: signature + 'enter'
	                       })
	                   }
	               } else if (el.index !== el.oldIndex) {
	                   var nodes = moveItem(el, 'add')
	                   parent.insertBefore(el.dom, before.nextSibling)
	                   vdom.hasEffect && applyEffects(nodes, el.children, {
	                       hook: 'onMoveDone',
	                       staggerKey: signature + 'move'
	                   })
	               }

	               before = el.split
	           })
	           if (vdom.action === 'init') {
	               b.insertBefore(parent, dom.nextSibling)
	           }
	       }

	   })

	   function moveItem(item, addToFragment) {
	       var nodes = item.children.map(function (el) {
	           return el['ms-if'] ? el.comment : el.dom
	       })
	       if (addToFragment) {
	           nodes.forEach(function (el) {
	               item.dom.appendChild(el)
	           })
	       }
	       return nodes
	   }



	   function fuzzyMatchCache(cache) {
	       var key
	       for (var id in cache) {
	           var key = id
	           break
	       }
	       if (key) {
	           return isInCache(cache, key)
	       }
	   }



	   // 新位置: 旧位置
	   function isInCache(cache, id) {
	       var c = cache[id]
	       if (c) {
	           var arr = c.arr
	           /* istanbul ignore if*/
	           if (arr) {
	               var r = arr.pop()
	               if (!arr.length) {
	                   c.arr = 0
	               }
	               return r
	           }
	           delete cache[id]
	           return c
	       }
	   }
	   //[1,1,1] number1 number1_ number1__
	   function saveInCache(cache, component) {
	       var trackId = component.key
	       if (!cache[trackId]) {
	           cache[trackId] = component
	       } else {
	           var c = cache[trackId]
	           var arr = c.arr || (c.arr = [])
	           arr.push(component)
	       }
	   }

	   var applyEffects = function (nodes, vnodes, opts) {
	       vnodes.forEach(function (vdom, i) {
	           avalon.applyEffect(nodes[i], vdom, opts)
	       })
	   }

	/**
	 * ------------------------------------------------------------
	 * 检测浏览器对CSS动画的支持与API名
	 * ------------------------------------------------------------
	 */
	   function effectDetect(transitionDuration, animationDuration, window) {

	       var checker = {
	           TransitionEvent: 'transitionend',
	           WebKitTransitionEvent: 'webkitTransitionEnd',
	           OTransitionEvent: 'oTransitionEnd',
	           otransitionEvent: 'otransitionEnd'
	       }

	       var tran
	       //有的浏览器同时支持私有实现与标准写法，比如webkit支持前两种，Opera支持1、3、4
	       for (var name in checker) {
	           if (window[name]) {
	               tran = checker[name]
	               break
	           }
	           try {
	               var a = document.createEvent(name)
	               tran = checker[name]
	               break
	           } catch (e) {
	           }
	       }
	       if (typeof tran === 'string') {
	           var transition = true
	           var css = true
	           var transitionEndEvent = tran
	       }

	       //animationend有两个可用形态
	       //IE10+, Firefox 16+ & Opera 12.1+: animationend
	       //Chrome/Safari: webkitAnimationEnd
	       //http://blogs.msdn.com/b/davrous/archive/2011/12/06/introduction-to-css3-animat ions.aspx
	       //IE10也可以使用MSAnimationEnd监听，但是回调里的事件 type依然为animationend
	       //  el.addEventListener('MSAnimationEnd', function(e) {
	       //     alert(e.type)// animationend！！！
	       // })
	       checker = {
	           'AnimationEvent': 'animationend',
	           'WebKitAnimationEvent': 'webkitAnimationEnd'
	       }
	       var ani
	       for (name in checker) {
	           if (window[name]) {
	               ani = checker[name]
	               break
	           }
	       }
	       if (typeof ani === 'string') {
	           var animation = true
	           css = true
	           var animationEndEvent = ani
	       }
	       return {
	           css: css,
	           animation: animation,
	           transition: transition,
	           animationEndEvent: animationEndEvent,
	           transitionEndEvent: transitionEndEvent,
	           transitionDuration: transitionDuration,
	           animationDuration: animationDuration
	       }
	   }

	   var support = effectDetect(
	       avalon.cssName('transition-duration'),
	       avalon.cssName('animation-duration'),
	       avalon.window
	   )

	   avalon.directive('effect', {
	       priority: 5,
	       diff: function (copy, src, name) {

			var is = copy[name]
	           if (typeof is === 'string') {
	               copy[name] = {
	                   is: is
	               }
	               avalon.warn('ms-effect的指令值不再支持字符串,必须是一个对象')
	           }
	           cssDiff.call(this, copy, src, name, 'afterChange')
	       },
	       update: function (dom, vdom, parent, opts) {
			/* istanbul ignore if */
	           if (dom && dom.nodeType === 1) {
	               var name = 'ms-effect'
	               var option = vdom[name] || opts || {}
	               vdom.dynamic[name] = 1
	               var type = option.is
	               /* istanbul ignore if */
	               if (!type) {//如果没有指定类型
	                   return avalon.warn('need is option')
	               }
	               var effects = avalon.effects
	               /* istanbul ignore if */
	               if (support.css && !effects[type]) {
	                   avalon.effect(type)
	               }
	               var globalOption = effects[type]
	               /* istanbul ignore if */
	               if (!globalOption) {//如果没有定义特效
	                   return avalon.warn(type + ' effect is undefined')
	               }
	               var finalOption = {}
	               var action = option.action
	               if (typeof action === 'boolean') {
	                   finalOption.action = action ? 'enter' : 'leave'
	               }
	               var Effect = avalon.Effect
	               /* istanbul ignore if */

	               var effect = new Effect(dom)
	               avalon.mix(finalOption, globalOption, option)
	               dom.animating = finalOption.action
	               /* istanbul ignore if */
	               /* istanbul ignore else */
	               if (finalOption.queue) {
	                   animationQueue.push(function () {
	                       effect[action](finalOption)
	                   })
	                   callNextAnimation()
	               } else {
	                   setTimeout(function () {
	                       effect[action](finalOption)
	                   }, 4)
	               }
	           }

	       }
	   })


	   var animationQueue = []
	   function callNextAnimation() {
	       var fn = animationQueue[0]
	       if (fn) {
	           fn()
	       }
	   }


	   avalon.effect = function (name, opts) {
	       var definition = avalon.effects[name] = (opts || {})
	       if (support.css && definition.css !== false) {
	           patchObject(definition, 'enterClass', name + '-enter')
	           patchObject(definition, 'enterActiveClass', definition.enterClass + '-active')
	           patchObject(definition, 'leaveClass', name + '-leave')
	           patchObject(definition, 'leaveActiveClass', definition.leaveClass + '-active')

	       }
	       patchObject(definition, 'action', 'enter')

	   }

	   function patchObject(obj, name, value) {
	       if (!obj[name]) {
	           obj[name] = value
	       }
	   }

	   var Effect = function (el) {
	       this.el = el
	   }

	   avalon.Effect = Effect

	   Effect.prototype = {
	       enter: createAction('Enter'),
	       leave: createAction('Leave'),
	       move: createAction('Move')
	   }

	   var rsecond = /\d+s$/
	   function toMillisecond(str) {
	       var ratio = rsecond.test(str) ? 1000 : 1
	       return parseFloat(str) * ratio
	   }

	   function execHooks(options, name, el) {
	       var list = options[name]
	       list = Array.isArray(list) ? list : typeof list === 'function' ? [list] : []
	       list.forEach(function (fn) {
	           fn && fn(el)
	       })
	   }
	   var staggerCache = new Cache(128)

	   function createAction(action) {
	       var lower = action.toLowerCase()
	       return function (option) {
	           var elem = this.el
	           var $el = avalon(elem)
	           var isAnimateDone
	           var staggerTime = isFinite(option.stagger) ? option.stagger * 1000 : 0
	           /* istanbul ignore if */
	           if (staggerTime) {
	               if (option.staggerKey) {
	                   var stagger = staggerCache.get(option.staggerKey) ||
						staggerCache.put(option.staggerKey, {
							count: 0,
							items: 0
						})
	                   stagger.count++
	                   stagger.items++
	               }
	           }
	           var staggerIndex = stagger && stagger.count || 0
	           var animationDone = function (e) {
	               var isOk = e !== false
	               if (--elem.__ms_effect_ === 0) {
	                   avalon.unbind(elem, support.transitionEndEvent)
	                   avalon.unbind(elem, support.animationEndEvent)
	               }
	               elem.animating = void 0
	               isAnimateDone = true
	               var dirWord = isOk ? 'Done' : 'Abort'
	               execHooks(option, 'on' + action + dirWord, elem)

	               if (stagger) {
	                   if (--stagger.items === 0) {
	                       stagger.count = 0
	                   }
	               }
	               if (option.queue) {
	                   animationQueue.shift()
	                   callNextAnimation()
	               }
	           }
	           execHooks(option, 'onBefore' + action, elem)
	           /* istanbul ignore if */
	           /* istanbul ignore else */
	           if (option[lower]) {
	               option[lower](elem, function (ok) {
	                   animationDone(ok !== false)
	               })
	           } else if (support.css) {
	               $el.addClass(option[lower + 'Class'])
	               if (lower === 'leave') {
	                   $el.removeClass(option.enterClass + ' ' + option.enterActiveClass)
	               } else if (lower === 'enter') {
	                   $el.removeClass(option.leaveClass + ' ' + option.leaveActiveClass)
	               }
	               if (!elem.__ms_effect_) {
	                   $el.bind(support.transitionEndEvent, animationDone)
	                   $el.bind(support.animationEndEvent, animationDone)
	                   elem.__ms_effect_ = 1
	               } else {
	                   elem.__ms_effect_++
	               }
	               setTimeout(function () {
	                   isAnimateDone = avalon.root.offsetWidth === NaN
	                   $el.addClass(option[lower + 'ActiveClass'])
	                   var computedStyles = window.getComputedStyle(elem)
	                   var tranDuration = computedStyles[support.transitionDuration]
	                   var animDuration = computedStyles[support.animationDuration]
	                   var time = toMillisecond(tranDuration) || toMillisecond(animDuration)
	                   if (!time === 0) {
	                       animationDone(false)
	                   } else if (!staggerTime) {
	                       setTimeout(function () {
	                           if (!isAnimateDone) {
	                               animationDone(false)
	                           }
	                       }, time + 32)
	                   }
	               }, 17 + staggerTime * staggerIndex)// = 1000/60
	           }
	       }
	   }

	   avalon.applyEffect = function (node, vnode, opts) {
	       var cb = opts.cb
	       var curEffect = vnode['ms-effect']
	       if (curEffect && node && node.nodeType === 1) {
	           var hook = opts.hook
	           var old = curEffect[hook]
	           if (cb) {
	               if (Array.isArray(old)) {
	                   old.push(cb)
	               } else if (old) {
	                   curEffect[hook] = [old, cb]
	               } else {
	                   curEffect[hook] = [cb]
	               }
	           }
	           getAction(opts)
	           avalon.directives.effect.update(node, vnode, 0, avalon.shadowCopy({}, opts))

	       } else if (cb) {
	           cb(node)
	       }
	   }

	   function getAction(opts) {
	       if (!opts.acton) {
	           opts.action = opts.hook.replace(/^on/, '').replace(/Done$/, '').toLowerCase()
	       }
	   }

	/* 
	 * 将要检测的字符串的字符串替换成??123这样的格式
	 */
	   var stringNum = 0
	   var stringPool = {
	       map: {}
	   }
	   var rfill = /\?\?\d+/g
	   function dig(a) {
	       var key = '??' + stringNum++
	       stringPool.map[key] = a
	       return key + ' '
	   }
	   function fill(a) {
	       var val = stringPool.map[a]
	       return val
	   }
	   function clearString(str) {
	       var array = readString(str)
	       for (var i = 0, n = array.length; i < n; i++) {
	           str = str.replace(array[i], dig)
	       }
	       return str
	   }

	   function readString(str) {
	       var end, s = 0
	       var ret = []
	       for (var i = 0, n = str.length; i < n; i++) {
	           var c = str.charAt(i)
	           if (!end) {
	               if (c === "'") {
	                   end = "'"
	                   s = i
	               } else if (c === '"') {
	                   end = '"'
	                   s = i
	               }
	           } else {
	               if (c === '\\') {
	                   i += 1
	                   continue
	               }
	               if (c === end) {
	                   ret.push(str.slice(s, i + 1))
	                   end = false
	               }
	           }
	       }
	       return ret
	   }

	   //如果直接将tr元素写table下面,那么浏览器将将它们(相邻的那几个),放到一个动态创建的tbody底下
	   function addTbody(nodes) {
	       var tbody, needAddTbody = false, count = 0, start = 0, n = nodes.length
	       for (var i = 0; i < n; i++) {
	           var node = nodes[i]
	           if (!tbody) {
	               if ((node.type || node.nodeName) === 'tr') {
	                   //收集tr及tr两旁的注释节点
	                   tbody = {
	                       nodeName: 'tbody',
	                       children: []
	                   }
	                   tbody.children.push(node)
	                   if (node.type) {
	                       delete node.type
	                   }
	                   needAddTbody = true
	                   if (start === 0)
	                       start = i
	                   nodes[i] = tbody
	               }
	           } else {
	               if (node.nodeName !== 'tr' && node.children) {
	                   tbody = false
	               } else {
	                   tbody.children.push(node)
	                   count++
	                   nodes[i] = 0
	               }
	           }
	       }

	       if (needAddTbody) {
	           for (i = start; i < n; i++) {
	               if (nodes[i] === 0) {
	                   nodes.splice(i, 1)
	                   i--
	                   count--
	                   if (count === 0) {
	                       break
	                   }
	               }
	           }
	       }
	   }

	/* 
	 *  处理一些特殊情况, 只用于文本转虚拟DOM
	 */


	   function variantSpecial(node, nodeName, innerHTML) {
	       switch (nodeName) {
	           case 'style':
	           case 'script':
	           case 'noscript':
	           case 'template':
	           case 'xmp':
	               node.children = [{
	                   nodeName: '#text',
	                   skipContent: true,
	                   nodeValue: innerHTML
	               }]
	               break
	           case 'textarea':
	               var props = node.props
	               props.type = nodeName
	               props.value = innerHTML
	               node.children = [{
	                   nodeName: '#text',
	                   nodeValue: innerHTML
	               }]
	               break
	           case 'option':
	               node.children = [{
	                   nodeName: '#text',
	                   nodeValue: trimHTML(innerHTML)
	               }]
	               break
	       }

	   }

	   //专门用于处理option标签里面的标签
	   var rtrimHTML = /<\w+(\s+("[^"]*"|'[^']*'|[^>])+)?>|<\/\w+>/gi
	   function trimHTML(v) {
	       return String(v).replace(rtrimHTML, '').trim()
	   }

	   var specialTag = avalon.oneObject('script,style,textarea,xmp,noscript,option,template')

	   var ropenTag = /^<([-A-Za-z0-9_]+)\s*([^>]*?)(\/?)>/
	   var rendTag = /^<\/([^>]+)>/
	   //https://github.com/rviscomi/trunk8/blob/master/trunk8.js
	   //判定里面有没有内容
	   var rcontent = /\S/
	   function makeNode(str) {
	       stringPool.map = {}
	       str = clearString(str)
	       var stack = []
	       stack.last = function () {
	           return stack[stack.length - 1]
	       }
	       var ret = []

	       var breakIndex = 100000
	       do {
	           var node = false
	           if (str.charAt(0) !== '<') {//处理文本节点
	               var i = str.indexOf('<')
	               i = i === -1 ? str.length : i
	               var nodeValue = str.slice(0, i).replace(rfill, fill)
	               str = str.slice(i)
	               node = {
	                   nodeName: '#text',
	                   nodeValue: nodeValue
	               }
	               if (rcontent.test(nodeValue)) {
	                   makeChildren(node, stack, ret)//不收集空白节点
	               }
	           }
	           if (!node) {
	               var i = str.indexOf('<!--')//处理注释节点
	               /* istanbul ignore if*/
	               if (i === 0) {
	                   var l = str.indexOf('-->')
	                   if (l === -1) {
	                       avalon.error('注释节点没有闭合' + str)
	                   }
	                   var nodeValue = str.slice(4, l).replace(rfill, fill)
	                   str = str.slice(l + 3)
	                   node = {
	                       nodeName: '#comment',
	                       nodeValue: nodeValue
	                   }
	                   makeChildren(node, stack, ret)
	               }

	           }
	           if (!node) {
	               var match = str.match(ropenTag)//处理元素节点开始部分
	               if (match) {
	                   var nodeName = match[1].toLowerCase()
	                   var isVoidTag = voidTag[nodeName] || match[3] === '\/'
	                   node = {
	                       nodeName: nodeName,
	                       props: {},
	                       children: [],
	                       isVoidTag: isVoidTag
	                   }

	                   var attrs = match[2]
	                   if (attrs) {
	                       makeProps(attrs, node.props)
	                   }
	                   makeChildren(node, stack, ret)
	                   str = str.slice(match[0].length)
	                   if (isVoidTag) {
	                       node.end = true
	                   } else {
	                       stack.push(node)
	                       if (specialTag[nodeName]) {
	                           var index = str.indexOf('</' + nodeName + '>')
	                           var innerHTML = str.slice(0, index).trim()
	                           str = str.slice(index)

	                           variantSpecial(node, nodeName, nomalString(innerHTML))

	                       }
	                   }
	               }
	           }
	           if (!node) {
	               var match = str.match(rendTag)//处理元素节点结束部分
	               if (match) {
	                   var nodeName = match[1].toLowerCase()
	                   var last = stack.last()
	                   /* istanbul ignore if*/
	                   /* istanbul ignore else*/
	                   if (!last) {
	                       avalon.error(match[0] + '前面缺少<' + nodeName + '>')
	                   } else if (last.nodeName !== nodeName) {
	                       avalon.error(last.nodeName + '没有闭合')
	                   }
	                   node = stack.pop()
	                   node.end = true
	                   str = str.slice(match[0].length)
	               }
	           }

	           if (!node || --breakIndex === 0) {
	               break
	           }
	           if (node.end) {
	               makeTbody(node, stack, ret)
	               delete node.end
	           }

	       } while (str.length);

	       return ret

	   }



	   function makeTbody(node, stack, ret) {
	       var nodeName = node.nodeName
	       var props = node.props
	       if (nodeName === 'table') {
	           addTbody(node.children)
	       }
	       var forExpr = props['ms-for']
	       //tr两旁的注释节点还会在addTbody中挪一下位置
	       if (forExpr) {
	           delete props['ms-for']
	           var p = stack.last()
	           var arr = p ? p.children : ret
	           arr.splice(arr.length - 1, 1, {
	               nodeName: '#comment',
	               nodeValue: 'ms-for:' + forExpr,
	               type: nodeName
	           }, node, {
	                   nodeName: '#comment',
	                   nodeValue: 'ms-for-end:',
	                   type: nodeName
	               })

	       }
	   }


	   function makeChildren(node, stack, ret) {
	       var p = stack.last()
	       if (p) {
	           p.children.push(node)
	       } else {
	           ret.push(node)
	       }
	   }

	   var rlineSp = /[\n\r]s*/g
	   var rattrs = /([^=\s]+)(?:\s*=\s*(\S+))?/
	   function makeProps(attrs, props) {
	       while (attrs) {
	           var arr = rattrs.exec(attrs)
	           if (arr) {
	               var name = arr[1]
	               var value = arr[2] || ''
	               attrs = attrs.replace(arr[0], '')
	               if (name.charAt(0) === ':') {
	                   name = 'ms-' + name.slice(1)
	               }
	               if (value) {
	                   if (value.indexOf('??') === 0) {
	                       value = nomalString(value).
	                           replace(rlineSp, '').
	                           slice(1, -1)
	                   }
	               }
	               if (!(name in props)) {
	                   props[name] = value
	               }
	           } else {
	               break
	           }
	       }
	   }

	   function nomalString(str) {
	       return avalon.unescapeHTML(str.replace(rfill, fill))
	   }

	   // 防止被引用
	   var emptyObj = function () {
	       return {
	           children: [], props: {}
	       }
	   }
	   var rbinding = /^ms-(\w+)-?(.*)/

	   function diff(copys, sources) {
	       for (var i = 0; i < copys.length; i++) {
	           var copy = copys[i]
	           var src = sources[i] || copys[i]
	           switch (copy.nodeName) {
	               case '#text':
	                   if (copy.dynamic) {
	                       var curValue = copy.nodeValue + ''
	                       if (curValue !== src.nodeValue) {
	                           src.nodeValue = curValue
	                           if (src.dom) {
	                               src.dom.nodeValue = curValue
	                           }
	                       }
	                   }
	                   break
	               case '#comment':
	                   if (copy.forExpr) {//比较循环区域的元素位置
	                       directives['for'].diff(copy, src, copys, sources, i)
	                   } else if (copy.afterChange) {
	                       execHooks$1(src, copy.afterChange)
	                   }
	                   break
	               case void (0):
	                   diff(copy, src)//比较循环区域的内容
	                   break
	               case '#document-fragment':
	                   diff(copy.children, src.children)//比较循环区域的内容
	                   break
	               default:
	                   if (copy.dynamic) {
	                       var index = i
	                       if (copy['ms-widget']) {
	                           directives['widget'].diff(copy, src, 'ms-widget', copys, sources, index)
	                           copy = copys[i]
	                           src = sources[i] || emptyObj()
	                           delete copy['ms-widget']
	                       }

	                       if ('ms-if' in copy) {
	                           directives['if'].diff(copy, src, 'ms-if', copys, sources, index)
	                           copy = copys[i]
	                           src = sources[i] || emptyObj()
	                           delete copy['ms-if']
	                       }
	                       diffProps(copy, src)
	                   }

	                   if (/^\w/.test(copy.nodeName) && !copy.skipContent && !copy.isVoidTag) {
	                       diff(copy.children, src.children || [])
	                   }

	                   if (src.afterChange) {
	                       execHooks$1(src, src.afterChange)
	                   }
	                   break
	           }
	       }
	   }

	   function execHooks$1(el, hooks) {
	       if (hooks.length) {
	           for (var hook, i = 0; hook = hooks[i++];) {
	               hook(el.dom, el)
	           }
	       }
	       delete el.afterChange
	   }

	   function diffProps(copy, source) {
	       try {
	           for (var name in copy) {
	               var match = name.match(rbinding)
	               var type = match && match[1]
	               if (directives[type]) {
	                   directives[type].diff(copy, source, name)
	               }
	           }

	       } catch (e) {
	           avalon.warn(type, e, e.stack || e.message, 'diffProps error')
	       }
	   }

	   //如果正在更新一个子树,那么将它放到
	   var needRenderIds = []
	   var renderingID = false
	   avalon.suspendUpdate = 0

	   function batchUpdate(id) {
	       if (renderingID) {
	           return avalon.Array.ensure(needRenderIds, id)
	       } else {
	           renderingID = id
	       }
	       var scope = avalon.scopes[id]
	       if (!scope || !document.nodeName || avalon.suspendUpdate) {
	           return renderingID = null
	       }
	       var vm = scope.vmodel
	       var dom = vm.$element
	       var source = dom.vtree || []
	       var renderFn = vm.$render
	       var copy = renderFn(scope.vmodel, scope.local)
	       if (scope.isTemp) {
	           //在最开始时,替换作用域的所有节点,确保虚拟DOM与真实DOM是对齐的
	           delete avalon.scopes[id]
	       }

	       avalon.diff(copy, source)


	       var index = needRenderIds.indexOf(renderingID)
	       renderingID = 0
	       if (index > -1) {
	           var removed = needRenderIds.splice(index, 1)
	           return batchUpdate(removed[0])
	       }

	       var more = needRenderIds.shift()
	       if (more) {
	           batchUpdate(more)
	       }
	   }

	   var rbinding$1 = /^(\:|ms\-)\w+/
	   var eventMap = avalon.oneObject('animationend,blur,change,input,click,dblclick,focus,keydown,keypress,keyup,mousedown,mouseenter,mouseleave,mousemove,mouseout,mouseover,mouseup,scan,scroll,submit')

	   function extractBindings(cur, props) {
	       var bindings = []
	       var attrs = {}
	       var skip = 'ms-skip' in props//old
	       var uniq = {}
	       for (var i in props) {
	           var value = props[i], match
	           attrs[i] = props[i]
	           if ((match = i.match(rbinding$1))) {
	               /* istanbul ignore if  */
	               if (skip)
	                   continue

	               var arr = i.replace(match[1], '').split('-')

	               if (eventMap[arr[0]]) {
	                   arr.unshift('on')
	               }
	               if (arr[0] === 'on') {
	                   arr[2] = parseFloat(arr[2]) || 0
	               }
	               arr.unshift('ms')
	               var type = arr[1]
	               if (directives[type]) {
	                   var binding = {
	                       type: type,
	                       param: arr[2],
	                       name: arr.join('-'),
	                       expr: value,
	                       priority: directives[type].priority || type.charCodeAt(0) * 100
	                   }

	                   if (type === 'on') {
	                       binding.priority += arr[3]
	                   }
	                   if (!uniq[binding.name]) {
	                       uniq[binding.name] = value
	                       bindings.push(binding)
	                   }
	               }
	           }
	       }

	       cur.props = attrs

	       bindings.sort(byPriority)

	       return bindings
	   }

	   function byPriority(a, b) {
	       return a.priority - b.priority
	   }

	   var config$1 = avalon.config
	   var quote$1 = avalon.quote
	   var rident$1 = /^[$a-zA-Z_][$a-zA-Z0-9_]*$/
	   var rstatement = /^\s*var\s+([$\w]+)\s*\=\s*\S+/
	   var skips = { __local__: 1, vmode: 1, dom: 1 }
	   function parseNodes(source, inner) {
	       //ms-important， ms-controller ， ms-for 不可复制，省得死循环
	       //ms-important --> ms-controller --> ms-for --> ms-widget --> ms-effect --> ms-if
	       var buffer = inner ? [] : ['\nvar vnodes = [];']

	       for (var i = 0, el; el = source[i++];) {
	           var vnode = parseNode(el)
	           if (el.$prepend) {
	               buffer.push(el.$prepend)
	           }
	           var append = el.$append
	           delete el.$append
	           delete el.$prepend
	           if (vnode) {
	               buffer.push(vnode + '\n')
	           }
	           if (append) {
	               buffer.push(append)
	           }
	       }
	       if (!inner) {
	           buffer.push('return vnodes\n')
	       }
	       return buffer.join('\n')
	   }



	   function parseNode(vdom) {
	       if (!vdom.nodeName)
	           return false
	       switch (vdom.nodeName) {
	           case '#text':
	               if (vdom.dynamic) {
	                   return add(parseText(vdom))
	               } else {
	                   return addTag(vdom)
	               }

	           case '#comment':
	               var nodeValue = vdom.nodeValue
	               /* istanbul ignore else  */
	               if (vdom.forExpr) {// 处理ms-for指令
	                   var copy = {
	                       dynamic: true,
	                       vmodel: '__vmodel__'
	                   }
	                   for (var i in vdom) {
	                       if (vdom.hasOwnProperty(i) && !skips[i]) {
	                           copy[i] = vdom[i]
	                       }
	                   }
	                   avalon.directives['for'].parse(copy, vdom, vdom)

	                   vdom.$append += avalon.caches[vdom.signature] //vdom.template
	                   return addTag(copy)
	               } else if (nodeValue === 'ms-for-end:') {
	                   vdom.$append = addTag({
	                       nodeName: '#comment',
	                       nodeValue: vdom.signature

	                   }) +
	                       ' return vnodes}\n })\n},__local__,vnodes)\n' +
	                       addTag({
	                           nodeName: "#comment",
	                           signature: vdom.signature,
	                           nodeValue: "ms-for-end:"
	                       }) + '\n'
	                   return ''
	               } else if (nodeValue.indexOf('ms-js:') === 0) {//插入JS声明语句
	                   var statement = avalon.parseExpr({
	                       type: 'js',
	                       expr: nodeValue.replace('ms-js:', '')
	                   }) + '\n'
	                   var ret = addTag(vdom)
	                   var match = statement.match(rstatement)
	                   if (match && match[1]) {
	                       vdom.$append = (vdom.$append || '') + statement +
	                           "\n__local__." + match[1] + ' = ' + match[1] + '\n'
	                   } else {
	                       avalon.warn(nodeValue + ' parse fail!')
	                   }
	                   return ret
	               } else {
	                   return addTag(vdom)
	               }
	           default:
	               if (!vdom.dynamic && vdom.skipContent) {
	                   return addTag(vdom)
	               }

	               var copy = {
	                   nodeName: vdom.nodeName
	               }
	               var props = vdom.props
	               if (vdom.dynamic) {
	                   copy.dynamic = '{}'

	                   var bindings = extractBindings(copy, props)
	                   bindings.map(function (b) {
	                       //将ms-*的值变成函数,并赋给copy.props[ms-*]
	                       //如果涉及到修改结构,则在source添加$append,$prepend
	                       avalon.directives[b.type].parse(copy, vdom, b)
	                       return b.name
	                   })

	               } else if (props) {
	                   copy.props = {}
	                   for (var i in props) {
	                       copy.props[i] = props[i]
	                   }
	               }

	               if (vdom.isVoidTag) {
	                   copy.isVoidTag = true
	               } else {
	                   if (!('children' in copy)) {
	                       var c = vdom.children
	                       if (c) {
	                           if (vdom.skipContent) {
	                               copy.children = '[' + c.map(function (a) {
	                                   return stringify(a)
	                               }) + ']'
	                           } else if (c.length === 1 && c[0].nodeName === '#text') {

	                               if (c[0].dynamic) {
	                                   copy.children = '[' + parseText(c[0]) + ']'
	                               } else {
	                                   copy.children = '[' + stringify(c[0]) + ']'
	                               }

	                           } else {

	                               copy.children = '(function(){' + parseNodes(c) + '})()'
	                           }
	                       }
	                   }
	               }
	               if (vdom.template)
	                   copy.template = vdom.template
	               if (vdom.skipContent)
	                   copy.skipContent = true

	               return addTag(copy)

	       }

	   }



	   function wrapDelimiter(expr) {
	       return rident$1.test(expr) ? expr : avalon.parseExpr({
	           expr: expr,
	           type: 'text'
	       })
	   }

	   function add(a) {
	       return 'vnodes.push(' + a + ');'
	   }
	   function addTag(obj) {
	       return add(stringify(obj))
	   }

	   function parseText(el) {
	       var array = extractExpr(el.nodeValue)//返回一个数组
	       var nodeValue = ''
	       if (array.length === 1) {
	           nodeValue = wrapDelimiter(array[0].expr)
	       } else {
	           var token = array.map(function (el) {
	               return el.type ? wrapDelimiter(el.expr) : quote$1(el.expr)
	           }).join(' + ')
	           nodeValue = 'String(' + token + ')'
	       }
	       return '{\nnodeName: "#text",\ndynamic:true,\nnodeValue: ' + nodeValue + '\n}'
	   }

	   var rlineSp$1 = /\n\s*/g

	   function extractExpr(str) {
	       var ret = []
	       do {//aaa{{@bbb}}ccc
	           var index = str.indexOf(config$1.openTag)
	           index = index === -1 ? str.length : index
	           var value = str.slice(0, index)
	           if (/\S/.test(value)) {
	               ret.push({ expr: avalon._decode(value) })
	           }
	           str = str.slice(index + config$1.openTag.length)
	           if (str) {
	               index = str.indexOf(config$1.closeTag)
	               var value = str.slice(0, index)
	               ret.push({
	                   expr: avalon.unescapeHTML(value.replace(rlineSp$1, '')),
	                   type: 'text'
	               })
	               str = str.slice(index + config$1.closeTag.length)
	           }
	       } while (str.length)
	       return ret
	   }

	   var rmsForStart = /^\s*ms\-for\:\s*/
	   var rmsForEnd = /^\s*ms\-for\-end/
	   function variantCommon(array) {
	       hasDirectives(array)
	       return array
	   }
	   //variantCommon
	   var hasDirectives = function (arr) {
	       var nodes = [], hasDir = false
	       for (var i = 0; i < arr.length; i++) {
	           var el = arr[i]
	           var isComment = el.nodeName === '#comment'
	           if (isComment && rmsForStart.test(el.nodeValue)) {
	               hasDir = true//在startRepeat节点前添加一个数组,收集后面的节点
	               nodes.push(el)
	               var old = nodes
	               nodes = []
	               nodes.list = old
	               nodes.start = el
	           } else if (isComment && rmsForEnd.test(el.nodeValue)) {
	               var old = nodes
	               nodes = old.list
	               var start = old.start
	               delete old.list
	               delete old.start
	               nodes.push(old, el)
	               el.dynamic = true
	               var uuid = start.signature || (start.signature = avalon.makeHashCode('for'))
	               el.signature = uuid

	               start.forExpr = start.nodeValue.replace(rmsForStart, '')
	               if (old.length === 1) {
	                   var element = old[0]
	                   if (element.props) {
	                       if (element.props.slot) {
	                           start.props = '{slot: "' + element.props.slot + '"}'
	                       }
	                       var cb = element.props['data-for-rendered']
	                       if (cb) {
	                           delete element.props['data-for-rendered']
	                           var wid = cb + ':cb'
	                           if (!avalon.caches[wid]) {
	                               avalon.caches[wid] = Function('return ' + avalon.parseExpr({
	                                   type: 'on',
	                                   expr: cb
	                               }))()
	                           }
	                           start.wid = wid
	                       }
	                   }
	               }
	               for (var j = 0; j < old.length; j++) {
	                   var el = old[j]
	                   var elem = el.dom
	                   if (elem && elem.parentNode) {//移除真实节点
	                       elem.parentNode.removeChild(elem)
	                   }
	               }
	               start.hasEffect = hasEffect(old)
	               hasDirectives(old)
	               if (!avalon.caches[uuid]) {
	                   avalon.caches[uuid] = parseNodes(old, true)
	               }
	               old.length = 0
	           } else {
	               if (hasDirective(el)) {
	                   hasDir = true
	               }
	               nodes.push(el)
	           }
	       }
	       arr.length = 0
	       arr.push.apply(arr, nodes)
	       return hasDir
	   }



	   function hasDirective(node) {

	       var nodeName = node.nodeName
	       switch (nodeName) {
	           case '#text':
	               if (avalon.config.rexpr.test(node.nodeValue)) {
	                   return node.dynamic = true
	               } else {
	                   return false
	               }
	           case '#comment':
	               if (node.dynamic) {
	                   return true
	               }
	               return false
	           case void 0:
	               return true
	           default:
	               var props = node.props || {}
	               if ('ms-skip' in props) {
	                   node.skipContent = true
	                   return false
	               }
	               var flag = false
	               if (nodeName === 'input') {
	                   if (!props.type) {
	                       props.type = 'text'
	                   }
	               } else if (/xmp|wbr|template/.test(nodeName)) {
	                   if (!props['ms-widget'] && props.is) {
	                       props['ms-widget'] = '{is:"' + props.is + '"}'
	                   }

	               } else if (nodeName === 'select') {
	                   var postfix = props.hasOwnProperty('multiple') ? 'multiple' : 'one'
	                   props.type = nodeName + '-' + postfix
	               } else if (nodeName.indexOf('ms-') === 0) {
	                   if (!props['ms-widget']) {
	                       props.is = nodeName
	                       props['ms-widget'] = '{is:"' + nodeName + '"}'
	                   }
	               }
	               var childDir = false
	               if (props['ms-widget']) {
	                   childDir = true
	                   delDir(props, 'html', 'widget')
	                   delDir(props, 'text', 'widget')
	                   var clone = avalon.mix({}, node)
	                   var cprops = avalon.mix({}, node.props)
	                   delete cprops['ms-widget']
	                   delete clone.isVoidTag
	                   clone.nodeName = "cheng"
	                   clone.props = cprops
	                   node.template = avalon.vdom(clone, 'toHTML')
	                   if (!node.isVoidTag)
	                       node.children = []
	               }
	               if (props['ms-text']) {
	                   childDir = true
	                   delDir(props, 'html', 'text')
	                   if (!node.isVoidTag) {
	                       node.children = []
	                   }
	               }
	               if (props['ms-html']) {
	                   childDir = true
	                   if (!node.isVoidTag) {
	                       node.children = []
	                   }
	               }
	               var hasProps = false
	               for (var i in props) {
	                   hasProps = true
	                   if (i.indexOf('ms-') === 0) {
	                       flag = true
	                       node.dynamic = {}
	                       break
	                   }
	               }
	               if (hasProps) {
	                   node.props = props
	               }
	               if (node.children) {
	                   var r = hasDirectives(node.children)
	                   if (r) {
	                       delete node.skipContent
	                       return true
	                   }
	                   if (!childDir) {
	                       node.skipContent = true
	                   } else {
	                       delete node.skipContent
	                   }
	               }
	               return flag
	       }
	   }

	   function delDir(props, a, b) {
	       if (props['ms-' + a]) {
	           avalon.warn(a, '指令不能与', b, '指令共存于同一个元素')
	           delete props['ms-' + a]
	       }
	   }

	   function hasEffect(arr) {
	       for (var i = 0, el; el = arr[i++];) {
	           if (el.props && el.props['ms-effect']) {
	               return true
	           }
	       }
	       return false
	   }

	   var pool = avalon.evaluatorPool


	   var brackets = /\(([^)]*)\)/
	   var rshortCircuit = /\|\|/g
	   var rpipeline = /\|(?=\?\?)/
	   var ruselessSp = /\s*(\.|\|)\s*/g
	   var rhandleName = /^__vmodel__\.[$\w\.]+$/i

	   var rguide = /(^|[^\w\u00c0-\uFFFF_])(@|##)(?=[$\w])/g
	   var robjectProperty = /\.[\w\.\$]+/g
	   var rvar = /[$a-zA-Z_][$a-zA-Z0-9_]*/g
	   var rregexp = /(^|[^/])\/(?!\/)(\[.+?]|\\.|[^/\\\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/g


	   //传入一个包含name, type, expr的对象, 将会返回一个字符串,
	   //并为原对象添加paths, locals属性
	   function parseExpr(binding) {
	       var str = binding.expr
	       var category = binding.type
	       var cache = pool.get(category + ':' + str)
	       if (cache) {
	           avalon.shadowCopy(binding, cache)
	           return cache.text
	       }
	       /* istanbul ignore else  */
	       stringPool.map = {}
	       var paths = {}
	       var locals = {}
	       var input = str.replace(rregexp, dig)//移除所有正则
	       input = clearString(input)      //移除所有字符串
	       input = input.replace(rshortCircuit, dig).//移除所有短路运算符
	           replace(ruselessSp, '$1').//移除.|两端空白
	           replace(rguide, '$1__vmodel__.').//转换@与##
	           replace(/(\b[\$\w]+\s*):/g, dig).
	           replace(/\|(\w+)/g, function (a, b) {//移除所有过滤器的名字
	               return '|' + dig(b)
	           }).
	           replace(/__vmodel__\.([\$\w\.]+)/g, function (_, b) {
	               paths[b] = 1      //收集路径
	               return _
	           })
	       //收集本地变量
	       collectLocal(input, locals)
	       //处理过滤器
	       var filters = input.split(rpipeline)
	       var _body = filters.shift()
	       var body = _body.replace(rfill, fill)
	       //  .replace(rfill, fill)//这里必须fix 两次
	       if (category === 'js') {
	           //<!--ms-js:xxx-->指令不存在过滤器,并且只需要替换@与##
	           return cacheData(binding, body, paths, locals)
	       }
	       if (filters.length) {
	           filters = filters.map(function (filter) {
	               var bracketArgs = '(__value__'
	               filter = filter.replace(brackets, function (a, b) {
	                   if (/\S/.test(b)) {
	                       bracketArgs += ',' + b//还原字符串,正则,短路运算符
	                   }
	                   return ''
	               }).replace(rfill, fill)
	               return (filter.replace(/^(\w+)/, '__value__ =  avalon.__format__("$1")') +
	                   bracketArgs + ')')
	           })
	       }

	       var ret = []
	       if (category === 'on') {
	           if (rhandleName.test(body)) {
	               body = body + '($event)'
	           }
	           filters = filters.map(function (el) {
	               return el.replace(/__value__/g, '$event')
	           })
	           if (filters.length) {
	               filters.push('if($event.$return){\n\treturn;\n}')
	           }
	           /* istanbul ignore if  */
	           if (!avalon.modern) {
	               body = body.replace(/__vmodel__\.([^(]+)\(([^)]*)\)/, function (a, b, c) {
	                   return '__vmodel__.' + b + ".call(__vmodel__" + (/\S/.test(c) ? ',' + c : "") + ")"
	               })
	           }
	           ret = ['function ($event, __local__){',
	               'try{',
	               extLocal(locals).join('\n'),
	               '\tvar __vmodel__ = this;',
	               '\t' + body,
	               '}catch(e){',
	               quoteError(str, category),
	               '}',
	               '}']
	           filters.unshift(2, 0)
	       } else if (category === 'duplex') {
	           //给vm同步某个属性
	           var setterBody = [
	               'function (__vmodel__,__value__){',
	               'try{',
	               '\t' + body + ' = __value__',
	               '}catch(e){',
	               quoteError(str, category).replace('parse', 'set'),
	               '}',
	               '}']
	           pool.put('duplex:set:' + binding.expr, setterBody.join('\n').replace(rfill, fill))
	           //对某个值进行格式化
	           var getterBody = [
	               'function (__vmodel__){',
	               'try{',
	               'var __value__ = ' + body,
	               filters.join('\n'),
	               'return __value__',
	               '}catch(e){',
	               quoteError(str, category).replace('parse', 'get'),
	               '}',
	               '}'].join('\n')
	           return cacheData(binding, getterBody, locals, paths)
	       } else {
	           ret = [
	               '(function (){',
	               'try{',
	               'var __value__ = ' + body.replace(rfill, fill),
	               (category === 'text' ?
	                   'return avalon.parsers.string(__value__)' :
	                   'return __value__'),
	               '}catch(e){',
	               quoteError(str, category),
	               '\treturn ""',
	               '}',
	               '})()'
	           ]
	           filters.unshift(3, 0)
	       }
	       ret.splice.apply(ret, filters)
	       return cacheData(binding, ret.join('\n'), locals, paths)
	   }

	   function cacheData(binding, text, locals, paths) {
	       text = text.replace(rfill, fill)
	       var obj = {
	           text: text,
	           locals: Object.keys(locals).join(','),
	           paths: Object.keys(paths).join(',')
	       }
	       var key = binding.type + ":" + binding.expr
	       binding.locals = obj.locals
	       binding.paths = obj.paths
	       pool.put(key, obj)
	       return text
	   }

	   function collectLocal(str, local) {
	       str.replace(/__vmodel__/, ' ').
	           replace(robjectProperty, ' ').
	           replace(rvar, function (el) {
	               if (el !== '$event' && !avalon.keyMap[el]) {
	                   local[el] = 1
	               }
	           })
	   }

	   function extLocal(ret) {
	       var arr = []
	       for (var i in ret) {
	           arr.push('var ' + i + ' = __local__[' + avalon.quote(i) + ']')
	       }
	       return arr
	   }

	   function quoteError(str, type) {
	       return '\tavalon.warn(e, ' +
	           avalon.quote('parse ' + type + ' binding【 ' + str + ' 】fail')
	           + ')'
	   }

	   avalon.lexer = makeNode
	   avalon.diff = diff
	   avalon.batch = batchUpdate
	   avalon.speedUp = variantCommon
	   avalon.parseExpr = parseExpr


	   // dispatch与patch 为内置模块

	   var rquoteEscapes = /\\\\(['"])/g
	   function render(vtree, local) {
	       var _body = Array.isArray(vtree) ? parseNodes(vtree) : vtree
	       var _local = []
	       if (local) {
	           for (var i in local) {
	               _local.push('var ' + i + ' = __local__[' + quote(i) + ']')
	           }
	       }
	       //处理 props: {"ms-effect": "{is:\\'star\\',action:@action}" 的情况 
	       _body = _body.replace(rquoteEscapes, "$1")
	       var body = '__local__ = __local__ || {};\n' +
	           _local.join(';\n') + '\n' + _body

	       try {
	           var fn = Function('__vmodel__', '__local__', body)
	       } catch (e) {
	           avalon.warn(_body, 'render parse error')
	       }
	       return fn
	   }

	   avalon.render = render

	   var legalTags = { wbr: 1, xmp: 1, template: 1 }
	   var events = 'onInit,onReady,onViewChange,onDispose'
	   var componentEvents = avalon.oneObject(events)
	   var immunity = events.split(',').concat('is', 'define')
	   var onceWarn$1 = true

	   function initComponent(src, rawOption, local, template) {
	       var tag = src.nodeName
	       var is = src.props.is
	       //判定用户传入的标签名是否符合规格
	       /* istanbul ignore if */
	       if (!legalTags[tag] && !isCustomTag(tag)) {
	           avalon.warn(tag + '不合适做组件的标签')
	           return
	       }
	       //开始初始化组件
	       var hooks = {}
	       //用户只能操作顶层VM
	       //只有$id,is的对象就是emptyOption
	       /* istanbul ignore if */
	       if (!rawOption) {
	           options = []
	       } else {
	           var options = [].concat(rawOption)
	           options.forEach(function (a) {
	               if (a && typeof a === 'object') {
	                   mixinHooks(hooks, (a.$model || a), true)
	               }
	           })
	       }
	       var definition = avalon.components[is]
	       //如果连组件的定义都没有加载回来,应该立即返回 
	       /* istanbul ignore if */
	       if (!definition) {
	           return
	       }


	       //得到组件在顶层vm的配置对象名
	       var id = hooks.id || hooks.$id
	       if (!id && onceWarn$1) {
	           avalon.warn('warning!', is, '组件最好在ms-widget配置对象中指定全局不重复的$id以提高性能!\n',
	               '若在ms-for循环中可以利用 ($index,el) in @array 中的$index拼写你的$id\n',
	               '如 ms-widget="{is:\'ms-button\',id:\'btn\'+$index}"'
	           )
	           onceWarn$1 = false
	       }
	       if (hooks.define) {
	           delete hooks.define
	           avalon.warn('warning! 组件的define配置项已经被废掉')
	       }
	       var define = avalon.directives.widget.define
	       //生成组件VM
	       var $id = id || src.props.id || 'w' + (new Date - 0)
	       var defaults = avalon.mix(true, {}, definition.defaults)
	       mixinHooks(hooks, defaults, false)//src.vmodel,
	       var skipProps = immunity.concat()
	       function sweeper(a, b) {
	           skipProps.forEach(function (k) {
	               delete a[k]
	               delete b[k]
	           })
	       }

	       sweeper.isWidget = true
	       var vmodel = define.apply(sweeper, [src.vmodel, defaults].concat(options))
	       //增强对IE的兼容
	       /* istanbul ignore if */
	       if (!avalon.modern) {
	           for (var i in vmodel) {
	               if (!$$skipArray$1[i] && typeof vmodel[i] === 'function') {
	                   vmodel[i] = vmodel[i].bind(vmodel)
	               }
	           }
	       }

	       vmodel.$id = $id
	       avalon.vmodels[$id] = vmodel

	       //绑定组件的生命周期钩子
	       for (var e in componentEvents) {
	           if (hooks[e]) {
	               hooks[e].forEach(function (fn) {
	                   vmodel.$watch(e, fn)
	               })
	           }
	       }
	       // 生成外部的渲染函数
	       // template保存着最原始的组件容器信息
	       // 我们先将它转换成虚拟DOM,如果是xmp, template,
	       // 它们内部是一个纯文本节点, 需要继续转换为虚拟DOM
	       var shell = avalon.lexer(template)


	       var shellRoot = shell[0]
	       shellRoot.children = shellRoot.children || []
	       shellRoot.props.is = is
	       shellRoot.props.wid = $id
	       avalon.speedUp(shell)

	       var render = avalon.render(shell, local)

	       //生成内部的渲染函数
	       var finalTemplate = definition.template.trim()
	       if (typeof definition.getTemplate === 'function') {
	           finalTemplate = definition.getTemplate(vmodel, finalTemplate)
	       }
	       var vtree = avalon.lexer(finalTemplate)

	       if (vtree.length > 1) {
	           avalon.error('组件必须用一个元素包起来')
	       }
	       var soleSlot = definition.soleSlot
	       replaceSlot(vtree, soleSlot)
	       avalon.speedUp(vtree)

	       var render2 = avalon.render(vtree)

	       //生成最终的组件渲染函数
	       var str = fnTemplate + ''
	       var zzzzz = soleSlot ? avalon.quote(soleSlot) : "null"
	       str = str.
	           replace('XXXXX', stringifyAnonymous(render)).
	           replace('YYYYY', stringifyAnonymous(render2)).
	           replace('ZZZZZ', zzzzz)
	       var begin = str.indexOf('{') + 1
	       var end = str.lastIndexOf("}")

	       var lastFn = Function('vm', 'local', str.slice(begin, end))

	       vmodel.$render = lastFn

	       src['component-vm:' + is] = vmodel

	       return vmodel.$render = lastFn

	   }

	   function stringifyAnonymous(fn) {
	       return fn.toString().replace('anonymous', '')
	           .replace(/\s*\/\*\*\//g, '')
	   }


	   function fnTemplate() {
	       var shell = (XXXXX)(vm, local);
	       var shellRoot = shell[0]
	       var vtree = (YYYYY)(vm, local);
	       var component = vtree[0]

	       //处理diff

	       for (var i in shellRoot) {
	           if (i !== 'children' && i !== 'nodeName') {
	               if (i === 'props') {
	                   avalon.mix(component.props, shellRoot.props)
	               } else {
	                   component[i] = shellRoot[i]
	               }
	           }
	       }


	       var soleSlot = ZZZZZ
	       var slots = avalon.collectSlots(shellRoot, soleSlot)
	       if (soleSlot && (!slots[soleSlot] || !slots[soleSlot].length)) {
	           slots[soleSlot] = [{
	               nodeName: '#text',
	               nodeValue: vm[soleSlot],
	               dynamic: true
	           }]
	       }
	       avalon.insertSlots(vtree, slots)

	       delete component.skipAttrs
	       delete component.skipContent
	       return vtree

	   }

	   function replaceSlot(vtree, slotName) {
	       for (var i = 0, el; el = vtree[i]; i++) {
	           if (el.nodeName === 'slot') {
	               var name = el.props.name || slotName

	               vtree.splice(i, 1, {
	                   nodeName: '#comment',
	                   nodeValue: 'slot:' + name,
	                   dynamic: true,
	                   type: name
	               }, {
	                       nodeName: '#comment',
	                       nodeValue: 'slot-end:'
	                   })
	               i++
	           } else if (el.children) {
	               replaceSlot(el.children, slotName)
	           }
	       }
	   }

	   avalon.insertSlots = function (vtree, slots) {
	       for (var i = 0, el; el = vtree[i]; i++) {
	           if (el.nodeName === '#comment' && slots[el.type]) {
	               var args = [i + 1, 0].concat(slots[el.type])
	               vtree.splice.apply(vtree, args)
	               i += slots[el.type].length
	           } else if (el.children) {
	               avalon.insertSlots(el.children, slots)
	           }
	       }
	   }

	   avalon.collectSlots = function (node, soleSlot) {
	       var slots = {}
	       if (soleSlot) {
	           slots[soleSlot] = node.children
	           slots.__sole__ = soleSlot
	       } else {
	           node.children.forEach(function (el, i) {
	               var name = el.props && el.props.slot
	               if (!name)
	                   return
	               if (el.forExpr) {
	                   slots[name] = node.children.slice(i, i + 2)
	               } else {
	                   if (Array.isArray(slots[name])) {
	                       slots[name].push(el)
	                   } else {
	                       slots[name] = [el]
	                   }
	               }
	           })
	       }
	       return slots
	   }


	   //必须以字母开头,结尾以字母或数字结束,中间至少出现一次"-",
	   //并且不能大写字母,特殊符号,"_","$",汉字
	   var rcustomTag = /^[a-z]([a-z\d]+\-)+[a-z\d]+$/

	   function isCustomTag(type) {
	       return rcustomTag.test(type) || avalon.components[type]
	   }

	   function mixinHooks(target, option, overwrite) {
	       for (var k in option) {
	           var v = option[k]
	           //如果是生命周期钩子,总是不断收集
	           if (componentEvents[k]) {
	               if (k in target) {
	                   target[k].push(v)
	               } else {
	                   target[k] = [option[k]]
	               }
	           } else {
	               if (overwrite) {
	                   target[k] = v
	               }
	           }
	       }
	   }

	   function inDomTree(el) {
	       while (el) {
	           if (el.nodeType === 9) {
	               return true
	           }
	           el = el.parentNode
	       }
	       return false
	   }

	   function fireDisposeHook(el) {
	       if (el.nodeType === 1 && el.getAttribute('wid') && !inDomTree(el)) {
	           var wid = el.getAttribute('wid')
	           var docker = avalon.scopes[wid]

	           if (!docker)
	               return
	           var elemID = el.getAttribute('ms-controller') || el.getAttribute('ms-important')
	           var vm = elemID && avalon.vmodels[elemID] || docker.vmodel
	           vm.$fire("onDispose", {
	               type: 'dispose',
	               target: el,
	               vmodel: vm
	           })
	           if (elemID) {
	               return
	           }
	           if (!el.getAttribute('cached')) {
	               delete docker.vmodel
	               delete avalon.scopes[wid]
	               var v = el.vtree
	               detachEvents(v)
	               var is = el.getAttribute('is')
	               if (v) {
	                   v[0][is + '-mount'] = false
	                   v[0]['component-ready:' + is] = false
	               }
	           }
	           return false
	       }
	   }
	   var rtag = /^\w/
	   function detachEvents(arr) {
	       for (var i in arr) {
	           var el = arr[i]
	           if (rtag.test(el.nodeName)) {
	               for (var i in el) {
	                   if (i.indexOf('ms-on') === 0) {
	                       delete el[i]
	                   }
	               }
	               if (el.children) {
	                   detachEvents(el.children)
	               }
	           }
	       }
	   }
	   function fireDisposeHookDelay(a) {
	       setTimeout(function () {
	           fireDisposeHook(a)
	       }, 4)
	   }
	   function fireDisposeHooks(nodes) {
	       for (var i = 0, el; el = nodes[i++];) {
	           fireDisposeHook(el)
	       }
	   }



	   //http://stackoverflow.com/questions/11425209/are-dom-mutation-observers-slower-than-dom-mutation-events
	   //http://stackoverflow.com/questions/31798816/simple-mutationobserver-version-of-domnoderemovedfromdocument
	   function byMutationEvent(dom) {
	       dom.addEventListener("DOMNodeRemovedFromDocument", function () {
	           fireDisposeHookDelay(dom)
	       })
	   }
	   //用于IE8+, firefox
	   function byRewritePrototype() {
	       if (byRewritePrototype.execute) {
	           return
	       }
	       //https://www.web-tinker.com/article/20618.html?utm_source=tuicool&utm_medium=referral
	       //IE6-8虽然暴露了Element.prototype,但无法重写已有的DOM API
	       byRewritePrototype.execute = true
	       var p = Node.prototype
	       function rewite(name, fn) {
	           var cb = p[name]
	           p[name] = function (a, b) {
	               return fn.call(this, cb, a, b)
	           }
	       }
	       rewite('removeChild', function (fn, a, b) {
	           fn.call(this, a, b)
	           if (a.nodeType === 1) {
	               fireDisposeHookDelay(a)
	           }
	           return a
	       })

	       rewite('replaceChild', function (fn, a, b) {
	           fn.call(this, a, b)
	           if (b.nodeType === 1) {
	               fireDisposeHookDelay(b)
	           }
	           return a
	       })
	       //访问器属性需要用getOwnPropertyDescriptor处理
	       var ep = Element.prototype, oldSetter
	       function newSetter(html) {
	           var all = avalon.slice(this.getElementsByTagName('*'))
	           oldSetter.call(this, html)
	           fireDisposeHooks(all)
	       }
	       try {
	           var obj = Object.getOwnPropertyDescriptor(ep, 'innerHTML')
	           var oldSetter = obj.set
	           obj.set = newSetter
	           Object.defineProperty(ep, 'innerHTML', obj)
	       } catch (e) {
	           //safari 9.1.2使用Object.defineProperty重写innerHTML会抛
	           // Attempting to change the setter of an unconfigurable property.
	           if (ep && ep.__lookupSetter__) {
	               oldSetter = ep.__lookupSetter__('innerHTML')
	               ep.__defineSetter__('innerHTML', newSetter)
	           } else {
	               throw e
	           }
	       }

	       rewite('appendChild', function (fn, a) {
	           fn.call(this, a)
	           if (a.nodeType === 1 && this.nodeType === 11) {
	               fireDisposeHookDelay(a)
	           }
	           return a
	       })

	       rewite('insertBefore', function (fn, a, b) {
	           fn.call(this, a, b)
	           if (a.nodeType === 1 && this.nodeType === 11) {
	               fireDisposeHookDelay(a)
	           }
	           return a
	       })
	   }

	   //用于IE6~8
	   var checkDisposeNodes = []
	   var checkID = 0
	   function byPolling(dom) {
	       avalon.Array.ensure(checkDisposeNodes, dom)
	       if (!checkID) {
	           checkID = setInterval(function () {
	               for (var i = 0, el; el = checkDisposeNodes[i];) {
	                   if (false === fireDisposeHook(el)) {
	                       avalon.Array.removeAt(checkDisposeNodes, i)
	                   } else {
	                       i++
	                   }
	               }
	               if (checkDisposeNodes.length == 0) {
	                   clearInterval(checkID)
	                   checkID = 0
	               }
	           }, 700)
	       }
	   }


	   function disposeComponent(dom) {
	       if (window.chrome && window.MutationEvent) {
	           byMutationEvent(dom)
	       } else {
	           try {
	               byRewritePrototype(dom)
	           } catch (e) {
	               byPolling(dom)
	           }
	       }
	   }
	   disposeComponent.byMutationEvent = byMutationEvent
	   disposeComponent.byRewritePrototype = byRewritePrototype
	   disposeComponent.byPolling = byPolling

	   avalon._disposeComponent = disposeComponent

	   avalon.component = function (name, definition) {
	       //这是定义组件的分支,并将列队中的同类型对象移除
	       /* istanbul ignore if */
	       if (!avalon.components[name]) {
	           avalon.components[name] = definition
	       }//这里没有返回值
	   }
	   avalon.directive('widget', {
	       priority: 4,
	       parse: function (copy, src, binding) {
	           src.props.wid = src.props.wid || avalon.makeHashCode('w')
	           //将渲染函数的某一部分存起来,渲在c方法中转换为函数
	           copy[binding.name] = avalon.parseExpr(binding)
	           copy.template = src.template
	           copy.vmodel = '__vmodel__'
	           copy.local = '__local__'
	       },
	       define: function () {
	           return avalon.mediatorFactory.apply(this, arguments)
	       },
	       diff: function (copy, src, name, copyList, srcList, index) {
	           var a = copy[name]
	           /* istanbul ignore else */
	           if (Object(a) === a) {
	               //有三个地方可以设置is, 属性,标签名,配置对象

	               var is = src.props.is || (/^ms\-/.test(src.nodeName) ? src.nodeName : 0)

	               if (!is) {//开始大费周章地获取组件的类型
	                   a = a.$model || a//安全的遍历VBscript
	                   if (Array.isArray(a)) {//转换成对象
	                       a.unshift({})// 防止污染旧数据
	                       avalon.mix.apply(0, a)
	                       a = a.shift()
	                   }
	                   is = a.is
	               }
	               var vmName = 'component-vm:' + is

	               src.props.is = is
	               src.vmodel = copy.vmodel
	               //如果组件没有初始化,那么先初始化(生成对应的vm,$render)
	               if (!src[vmName]) {
	                   /* istanbul ignore if */
	                   if (!initComponent(src, copy[name], copy.local, copy.template)) {
	                       //替换成注释节点
	                       src.nodeValue = 'unresolved component placeholder'
	                       copyList[index] = src
	                       update(src, this.mountComment)
	                       return
	                   }
	               }

	               //如果已经存在于avalon.scopes
	               var comVm = src[vmName]
	               var scope = avalon.scopes[comVm.$id]
	               if (scope && scope.vmodel) {
	                   var com = scope.vmodel.$element
	                   if (src.dom !== com) {
	                       var component = com.vtree[0]
	                       srcList[index] = copyList[index] = component
	                       src.com = com
	                       if (!component.skipContent) {
	                           component.skipContent = 'optimize'
	                       }

	                       update(src, this.replaceCachedComponent)

	                       update(component, function () {
	                           if (component.skipContent === 'optimize') {
	                               component.skipContent = true
	                           }
	                       }, 'afterChange')
	                       return
	                   }
	               }
	               var render = comVm.$render
	               var tree = render(comVm, copy.local)
	               var component = tree[0]
	               /* istanbul ignore if */
	               /* istanbul ignore else */
	               if (component && isComponentReady(component)) {
	                   component.local = copy.local
	                   Array(
	                       vmName,
	                       'component-html:' + is,
	                       'component-ready:' + is,
	                       'dom', 'dynamic'
	                   ).forEach(function (name) {
	                       component[name] = src[name]
	                   })
	                   component.vmodel = comVm
	                   copyList[index] = component
	                   // 如果与ms-if配合使用, 会跑这分支
	                   if (src.comment && src.nodeValue) {
	                       component.dom = src.comment
	                   }
	                   if (src.nodeName !== component.nodeName) {
	                       srcList[index] = component
	                       update(component, this.mountComponent)
	                   } else {
	                       update(src, this.updateComponent)
	                   }
	               } else {

	                   src.nodeValue = 'unresolved component placeholder'
	                   copyList[index] = {
	                       nodeValue: 'unresolved component placeholder',
	                       nodeName: '#comment'
	                   }
	                   update(src, this.mountComment)
	               }
	           } else {
	               if (src.props.is === copy.props.is) {
	                   update(src, this.updateComponent)
	               }
	           }
	       },
	       replaceCachedComponent: function (dom, vdom, parent) {
	           var com = vdom.com
	           parent.replaceChild(com, dom)
	           vdom.dom = com
	           delete vdom.com
	       },
	       mountComment: function (dom, vdom, parent) {
	           var comment = document.createComment(vdom.nodeValue)
	           vdom.dom = comment
	           parent.replaceChild(comment, dom)
	       },
	       updateComponent: function (dom, vdom) {
	           var vm = vdom["component-vm:" + vdom.props.is]
	           var viewChangeObservers = vm.$events.onViewChange
	           if (viewChangeObservers && viewChangeObservers.length) {
	               update(vdom, viewChangeHandle, 'afterChange')
	           }
	       },
	       mountComponent: function (dom, vdom, parent) {
	           delete vdom.dom
	           var com = avalon.vdom(vdom, 'toDOM')

	           var is = vdom.props.is
	           var vm = vdom['component-vm:' + is]
	           vm.$fire('onInit', {
	               type: 'init',
	               vmodel: vm,
	               is: is
	           })

	           parent.replaceChild(com, dom)

	           vdom.dom = vm.$element = com
	           com.vtree = [vdom]
	           avalon._disposeComponent(com)
	           vdom['component-ready:' + is] = true
	           //--------------
	           avalon.scopes[vm.$id] = {
	               vmodel: vm,
	               top: vdom.vmodel,
	               local: vdom.local
	           }
	           //--------------
	           update(vdom, function () {
	               vm.$fire('onReady', {
	                   type: 'ready',
	                   target: com,
	                   vmodel: vm,
	                   is: is
	               })
	           }, 'afterChange')

	           update(vdom, function () {
	               vdom['component-html:' + is] = avalon.vdom(vdom, 'toHTML')
	           }, 'afterChange')
	       }
	   })



	   function viewChangeHandle(dom, vdom) {
	       var is = vdom.props.is
	       var vm = vdom['component-vm:' + is]
	       var html = 'component-html:' + is
	       var preHTML = vdom[html]
	       var curHTML = avalon.vdom(vdom, 'toHTML')
	       if (preHTML !== curHTML) {
	           vdom[html] = curHTML
	           vm.$fire('onViewChange', {
	               type: 'viewchange',
	               target: dom,
	               vmodel: vm,
	               is: is
	           })
	       }
	   }



	   function isComponentReady(vnode) {
	       var isReady = true
	       try {
	           hasUnresolvedComponent(vnode)
	       } catch (e) {
	           isReady = false
	       }
	       return isReady
	   }

	   function hasUnresolvedComponent(vnode) {
	       vnode.children.forEach(function (el) {
	           if (el.nodeName === '#comment') {
	               if (el.nodeValue === 'unresolved component placeholder') {
	                   throw 'unresolved'
	               }
	           } else if (el.children) {
	               hasUnresolvedComponent(el)
	           }
	       })
	   }

	   return avalon;

}));

