/*!
 * jQuery JavaScript Library v1.4.2
 * http://jquery.com/
 *
 * Copyright 2010, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2010, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Sat Feb 13 22:33:48 2010 -0500
 */
(function( window, undefined ) {

// Define a local copy of jQuery
var jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		return new jQuery.fn.init( selector, context );
	},

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$,

	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	// A central reference to the root jQuery(document)
	rootjQuery,

	// A simple way to check for HTML strings or ID strings
	// (both of which we optimize for)
	quickExpr = /^[^<]*(<[\w\W]+>)[^>]*$|^#([\w-]+)$/,

	// Is it a simple selector
	isSimple = /^.[^:#\[\.,]*$/,

	// Check if a string has a non-whitespace character in it
	rnotwhite = /\S/,

	// Used for trimming whitespace
	rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/g,

	// Match a standalone tag
	rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

	// Keep a UserAgent string for use with jQuery.browser
	userAgent = navigator.userAgent,

	// For matching the engine and version of the browser
	browserMatch,
	
	// Has the ready events already been bound?
	readyBound = false,
	
	// The functions to execute on DOM ready
	readyList = [],

	// The ready event handler
	DOMContentLoaded,

	// Save a reference to some core methods
	toString = Object.prototype.toString,
	hasOwnProperty = Object.prototype.hasOwnProperty,
	push = Array.prototype.push,
	slice = Array.prototype.slice,
	indexOf = Array.prototype.indexOf;

jQuery.fn = jQuery.prototype = {
	init: function( selector, context ) {
		var match, elem, ret, doc;

		// Handle $(""), $(null), or $(undefined)
		if ( !selector ) {
			return this;
		}

		// Handle $(DOMElement)
		if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;
		}
		
		// The body element only exists once, optimize finding it
		if ( selector === "body" && !context ) {
			this.context = document;
			this[0] = document.body;
			this.selector = "body";
			this.length = 1;
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			// Are we dealing with HTML string or an ID?
			match = quickExpr.exec( selector );

			// Verify a match, and that no context was specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					doc = (context ? context.ownerDocument || context : document);

					// If a single string is passed in and it's a single tag
					// just do a createElement and skip the rest
					ret = rsingleTag.exec( selector );

					if ( ret ) {
						if ( jQuery.isPlainObject( context ) ) {
							selector = [ document.createElement( ret[1] ) ];
							jQuery.fn.attr.call( selector, context, true );

						} else {
							selector = [ doc.createElement( ret[1] ) ];
						}

					} else {
						ret = buildFragment( [ match[1] ], [ doc ] );
						selector = (ret.cacheable ? ret.fragment.cloneNode(true) : ret.fragment).childNodes;
					}
					
					return jQuery.merge( this, selector );
					
				// HANDLE: $("#id")
				} else {
					elem = document.getElementById( match[2] );

					if ( elem ) {
						// Handle the case where IE and Opera return items
						// by name instead of ID
						if ( elem.id !== match[2] ) {
							return rootjQuery.find( selector );
						}

						// Otherwise, we inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $("TAG")
			} else if ( !context && /^\w+$/.test( selector ) ) {
				this.selector = selector;
				this.context = document;
				selector = document.getElementsByTagName( selector );
				return jQuery.merge( this, selector );

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return (context || rootjQuery).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return jQuery( context ).find( selector );
			}

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return rootjQuery.ready( selector );
		}

		if (selector.selector !== undefined) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	},

	// Start with an empty selector
	selector: "",

	// The current version of jQuery being used
	jquery: "1.4.2",

	// The default length of a jQuery object is 0
	length: 0,

	// The number of elements contained in the matched element set
	size: function() {
		return this.length;
	},

	toArray: function() {
		return slice.call( this, 0 );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num == null ?

			// Return a 'clean' array
			this.toArray() :

			// Return just the object
			( num < 0 ? this.slice(num)[ 0 ] : this[ num ] );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems, name, selector ) {
		// Build a new jQuery matched element set
		var ret = jQuery();

		if ( jQuery.isArray( elems ) ) {
			push.apply( ret, elems );
		
		} else {
			jQuery.merge( ret, elems );
		}

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		ret.context = this.context;

		if ( name === "find" ) {
			ret.selector = this.selector + (this.selector ? " " : "") + selector;
		} else if ( name ) {
			ret.selector = this.selector + "." + name + "(" + selector + ")";
		}

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},
	
	ready: function( fn ) {
		// Attach the listeners
		jQuery.bindReady();

		// If the DOM is already ready
		if ( jQuery.isReady ) {
			// Execute the function immediately
			fn.call( document, jQuery );

		// Otherwise, remember the function for later
		} else if ( readyList ) {
			// Add the function to the wait list
			readyList.push( fn );
		}

		return this;
	},
	
	eq: function( i ) {
		return i === -1 ?
			this.slice( i ) :
			this.slice( i, +i + 1 );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ),
			"slice", slice.call(arguments).join(",") );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},
	
	end: function() {
		return this.prevObject || jQuery(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: [].sort,
	splice: [].splice
};

// Give the init function the jQuery prototype for later instantiation
jQuery.fn.init.prototype = jQuery.fn;

jQuery.extend = jQuery.fn.extend = function() {
	// copy reference to target object
	var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false, options, name, src, copy;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;
		target = arguments[1] || {};
		// skip the boolean and the target
		i = 2;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// extend jQuery itself if only one argument is passed
	if ( length === i ) {
		target = this;
		--i;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging object literal values or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || jQuery.isArray(copy) ) ) {
					var clone = src && ( jQuery.isPlainObject(src) || jQuery.isArray(src) ) ? src
						: jQuery.isArray(copy) ? [] : {};

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	noConflict: function( deep ) {
		window.$ = _$;

		if ( deep ) {
			window.jQuery = _jQuery;
		}

		return jQuery;
	},
	
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,
	
	// Handle when the DOM is ready
	ready: function() {
		// Make sure that the DOM is not already loaded
		if ( !jQuery.isReady ) {
			// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
			if ( !document.body ) {
				return setTimeout( jQuery.ready, 13 );
			}

			// Remember that the DOM is ready
			jQuery.isReady = true;

			// If there are functions bound, to execute
			if ( readyList ) {
				// Execute all of them
				var fn, i = 0;
				while ( (fn = readyList[ i++ ]) ) {
					fn.call( document, jQuery );
				}

				// Reset the list of functions
				readyList = null;
			}

			// Trigger any bound ready events
			if ( jQuery.fn.triggerHandler ) {
				jQuery( document ).triggerHandler( "ready" );
			}
		}
	},
	
	bindReady: function() {
		if ( readyBound ) {
			return;
		}

		readyBound = true;

		// Catch cases where $(document).ready() is called after the
		// browser event has already occurred.
		if ( document.readyState === "complete" ) {
			return jQuery.ready();
		}

		// Mozilla, Opera and webkit nightlies currently support this event
		if ( document.addEventListener ) {
			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", DOMContentLoaded, false );
			
			// A fallback to window.onload, that will always work
			window.addEventListener( "load", jQuery.ready, false );

		// If IE event model is used
		} else if ( document.attachEvent ) {
			// ensure firing before onload,
			// maybe late but safe also for iframes
			document.attachEvent("onreadystatechange", DOMContentLoaded);
			
			// A fallback to window.onload, that will always work
			window.attachEvent( "onload", jQuery.ready );

			// If IE and not a frame
			// continually check to see if the document is ready
			var toplevel = false;

			try {
				toplevel = window.frameElement == null;
			} catch(e) {}

			if ( document.documentElement.doScroll && toplevel ) {
				doScrollCheck();
			}
		}
	},

	// See test/unit/core.js for details concerning isFunction.
	// Since version 1.3, DOM methods and functions like alert
	// aren't supported. They return false on IE (#2968).
	isFunction: function( obj ) {
		return toString.call(obj) === "[object Function]";
	},

	isArray: function( obj ) {
		return toString.call(obj) === "[object Array]";
	},

	isPlainObject: function( obj ) {
		// Must be an Object.
		// Because of IE, we also have to check the presence of the constructor property.
		// Make sure that DOM nodes and window objects don't pass through, as well
		if ( !obj || toString.call(obj) !== "[object Object]" || obj.nodeType || obj.setInterval ) {
			return false;
		}
		
		// Not own constructor property must be Object
		if ( obj.constructor
			&& !hasOwnProperty.call(obj, "constructor")
			&& !hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf") ) {
			return false;
		}
		
		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own.
	
		var key;
		for ( key in obj ) {}
		
		return key === undefined || hasOwnProperty.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		for ( var name in obj ) {
			return false;
		}
		return true;
	},
	
	error: function( msg ) {
		throw msg;
	},
	
	parseJSON: function( data ) {
		if ( typeof data !== "string" || !data ) {
			return null;
		}

		// Make sure leading/trailing whitespace is removed (IE can't handle it)
		data = jQuery.trim( data );
		
		// Make sure the incoming data is actual JSON
		// Logic borrowed from http://json.org/json2.js
		if ( /^[\],:{}\s]*$/.test(data.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, "@")
			.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, "]")
			.replace(/(?:^|:|,)(?:\s*\[)+/g, "")) ) {

			// Try to use the native JSON parser first
			return window.JSON && window.JSON.parse ?
				window.JSON.parse( data ) :
				(new Function("return " + data))();

		} else {
			jQuery.error( "Invalid JSON: " + data );
		}
	},

	noop: function() {},

	// Evalulates a script in a global context
	globalEval: function( data ) {
		if ( data && rnotwhite.test(data) ) {
			// Inspired by code by Andrea Giammarchi
			// http://webreflection.blogspot.com/2007/08/global-scope-evaluation-and-dom.html
			var head = document.getElementsByTagName("head")[0] || document.documentElement,
				script = document.createElement("script");

			script.type = "text/javascript";

			if ( jQuery.support.scriptEval ) {
				script.appendChild( document.createTextNode( data ) );
			} else {
				script.text = data;
			}

			// Use insertBefore instead of appendChild to circumvent an IE6 bug.
			// This arises when a base node is used (#2709).
			head.insertBefore( script, head.firstChild );
			head.removeChild( script );
		}
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
	},

	// args is for internal usage only
	each: function( object, callback, args ) {
		var name, i = 0,
			length = object.length,
			isObj = length === undefined || jQuery.isFunction(object);

		if ( args ) {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.apply( object[ name ], args ) === false ) {
						break;
					}
				}
			} else {
				for ( ; i < length; ) {
					if ( callback.apply( object[ i++ ], args ) === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isObj ) {
				for ( name in object ) {
					if ( callback.call( object[ name ], name, object[ name ] ) === false ) {
						break;
					}
				}
			} else {
				for ( var value = object[0];
					i < length && callback.call( value, i, value ) !== false; value = object[++i] ) {}
			}
		}

		return object;
	},

	trim: function( text ) {
		return (text || "").replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( array, results ) {
		var ret = results || [];

		if ( array != null ) {
			// The window, strings (and functions) also have 'length'
			// The extra typeof function check is to prevent crashes
			// in Safari 2 (See: #3039)
			if ( array.length == null || typeof array === "string" || jQuery.isFunction(array) || (typeof array !== "function" && array.setInterval) ) {
				push.call( ret, array );
			} else {
				jQuery.merge( ret, array );
			}
		}

		return ret;
	},

	inArray: function( elem, array ) {
		if ( array.indexOf ) {
			return array.indexOf( elem );
		}

		for ( var i = 0, length = array.length; i < length; i++ ) {
			if ( array[ i ] === elem ) {
				return i;
			}
		}

		return -1;
	},

	merge: function( first, second ) {
		var i = first.length, j = 0;

		if ( typeof second.length === "number" ) {
			for ( var l = second.length; j < l; j++ ) {
				first[ i++ ] = second[ j ];
			}
		
		} else {
			while ( second[j] !== undefined ) {
				first[ i++ ] = second[ j++ ];
			}
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, inv ) {
		var ret = [];

		// Go through the array, only saving the items
		// that pass the validator function
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			if ( !inv !== !callback( elems[ i ], i ) ) {
				ret.push( elems[ i ] );
			}
		}

		return ret;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var ret = [], value;

		// Go through the array, translating each of the items to their
		// new value (or values).
		for ( var i = 0, length = elems.length; i < length; i++ ) {
			value = callback( elems[ i ], i, arg );

			if ( value != null ) {
				ret[ ret.length ] = value;
			}
		}

		return ret.concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	proxy: function( fn, proxy, thisObject ) {
		if ( arguments.length === 2 ) {
			if ( typeof proxy === "string" ) {
				thisObject = fn;
				fn = thisObject[ proxy ];
				proxy = undefined;

			} else if ( proxy && !jQuery.isFunction( proxy ) ) {
				thisObject = proxy;
				proxy = undefined;
			}
		}

		if ( !proxy && fn ) {
			proxy = function() {
				return fn.apply( thisObject || this, arguments );
			};
		}

		// Set the guid of unique handler to the same of original handler, so it can be removed
		if ( fn ) {
			proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;
		}

		// So proxy can be declared as an argument
		return proxy;
	},

	// Use of jQuery.browser is frowned upon.
	// More details: http://docs.jquery.com/Utilities/jQuery.browser
	uaMatch: function( ua ) {
		ua = ua.toLowerCase();

		var match = /(webkit)[ \/]([\w.]+)/.exec( ua ) ||
			/(opera)(?:.*version)?[ \/]([\w.]+)/.exec( ua ) ||
			/(msie) ([\w.]+)/.exec( ua ) ||
			!/compatible/.test( ua ) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec( ua ) ||
		  	[];

		return { browser: match[1] || "", version: match[2] || "0" };
	},

	browser: {}
});

browserMatch = jQuery.uaMatch( userAgent );
if ( browserMatch.browser ) {
	jQuery.browser[ browserMatch.browser ] = true;
	jQuery.browser.version = browserMatch.version;
}

// Deprecated, use jQuery.browser.webkit instead
if ( jQuery.browser.webkit ) {
	jQuery.browser.safari = true;
}

if ( indexOf ) {
	jQuery.inArray = function( elem, array ) {
		return indexOf.call( array, elem );
	};
}

// All jQuery objects should point back to these
rootjQuery = jQuery(document);

// Cleanup functions for the document ready method
if ( document.addEventListener ) {
	DOMContentLoaded = function() {
		document.removeEventListener( "DOMContentLoaded", DOMContentLoaded, false );
		jQuery.ready();
	};

} else if ( document.attachEvent ) {
	DOMContentLoaded = function() {
		// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
		if ( document.readyState === "complete" ) {
			document.detachEvent( "onreadystatechange", DOMContentLoaded );
			jQuery.ready();
		}
	};
}

// The DOM ready check for Internet Explorer
function doScrollCheck() {
	if ( jQuery.isReady ) {
		return;
	}

	try {
		// If IE is used, use the trick by Diego Perini
		// http://javascript.nwbox.com/IEContentLoaded/
		document.documentElement.doScroll("left");
	} catch( error ) {
		setTimeout( doScrollCheck, 1 );
		return;
	}

	// and execute any waiting functions
	jQuery.ready();
}

function evalScript( i, elem ) {
	if ( elem.src ) {
		jQuery.ajax({
			url: elem.src,
			async: false,
			dataType: "script"
		});
	} else {
		jQuery.globalEval( elem.text || elem.textContent || elem.innerHTML || "" );
	}

	if ( elem.parentNode ) {
		elem.parentNode.removeChild( elem );
	}
}

// Mutifunctional method to get and set values to a collection
// The value/s can be optionally by executed if its a function
function access( elems, key, value, exec, fn, pass ) {
	var length = elems.length;
	
	// Setting many attributes
	if ( typeof key === "object" ) {
		for ( var k in key ) {
			access( elems, k, key[k], exec, fn, value );
		}
		return elems;
	}
	
	// Setting one attribute
	if ( value !== undefined ) {
		// Optionally, function values get executed if exec is true
		exec = !pass && exec && jQuery.isFunction(value);
		
		for ( var i = 0; i < length; i++ ) {
			fn( elems[i], key, exec ? value.call( elems[i], i, fn( elems[i], key ) ) : value, pass );
		}
		
		return elems;
	}
	
	// Getting an attribute
	return length ? fn( elems[0], key ) : undefined;
}

function now() {
	return (new Date).getTime();
}
(function() {

	jQuery.support = {};

	var root = document.documentElement,
		script = document.createElement("script"),
		div = document.createElement("div"),
		id = "script" + now();

	div.style.display = "none";
	div.innerHTML = "   <link/><table></table><a href='/a' style='color:red;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

	var all = div.getElementsByTagName("*"),
		a = div.getElementsByTagName("a")[0];

	// Can't get basic test support
	if ( !all || !all.length || !a ) {
		return;
	}

	jQuery.support = {
		// IE strips leading whitespace when .innerHTML is used
		leadingWhitespace: div.firstChild.nodeType === 3,

		// Make sure that tbody elements aren't automatically inserted
		// IE will insert them into empty tables
		tbody: !div.getElementsByTagName("tbody").length,

		// Make sure that link elements get serialized correctly by innerHTML
		// This requires a wrapper element in IE
		htmlSerialize: !!div.getElementsByTagName("link").length,

		// Get the style information from getAttribute
		// (IE uses .cssText insted)
		style: /red/.test( a.getAttribute("style") ),

		// Make sure that URLs aren't manipulated
		// (IE normalizes it by default)
		hrefNormalized: a.getAttribute("href") === "/a",

		// Make sure that element opacity exists
		// (IE uses filter instead)
		// Use a regex to work around a WebKit issue. See #5145
		opacity: /^0.55$/.test( a.style.opacity ),

		// Verify style float existence
		// (IE uses styleFloat instead of cssFloat)
		cssFloat: !!a.style.cssFloat,

		// Make sure that if no value is specified for a checkbox
		// that it defaults to "on".
		// (WebKit defaults to "" instead)
		checkOn: div.getElementsByTagName("input")[0].value === "on",

		// Make sure that a selected-by-default option has a working selected property.
		// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
		optSelected: document.createElement("select").appendChild( document.createElement("option") ).selected,

		parentNode: div.removeChild( div.appendChild( document.createElement("div") ) ).parentNode === null,

		// Will be defined later
		deleteExpando: true,
		checkClone: false,
		scriptEval: false,
		noCloneEvent: true,
		boxModel: null
	};

	script.type = "text/javascript";
	try {
		script.appendChild( document.createTextNode( "window." + id + "=1;" ) );
	} catch(e) {}

	root.insertBefore( script, root.firstChild );

	// Make sure that the execution of code works by injecting a script
	// tag with appendChild/createTextNode
	// (IE doesn't support this, fails, and uses .text instead)
	if ( window[ id ] ) {
		jQuery.support.scriptEval = true;
		delete window[ id ];
	}

	// Test to see if it's possible to delete an expando from an element
	// Fails in Internet Explorer
	try {
		delete script.test;
	
	} catch(e) {
		jQuery.support.deleteExpando = false;
	}

	root.removeChild( script );

	if ( div.attachEvent && div.fireEvent ) {
		div.attachEvent("onclick", function click() {
			// Cloning a node shouldn't copy over any
			// bound event handlers (IE does this)
			jQuery.support.noCloneEvent = false;
			div.detachEvent("onclick", click);
		});
		div.cloneNode(true).fireEvent("onclick");
	}

	div = document.createElement("div");
	div.innerHTML = "<input type='radio' name='radiotest' checked='checked'/>";

	var fragment = document.createDocumentFragment();
	fragment.appendChild( div.firstChild );

	// WebKit doesn't clone checked state correctly in fragments
	jQuery.support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

	// Figure out if the W3C box model works as expected
	// document.body must exist before we can do this
	jQuery(function() {
		var div = document.createElement("div");
		div.style.width = div.style.paddingLeft = "1px";

		document.body.appendChild( div );
		jQuery.boxModel = jQuery.support.boxModel = div.offsetWidth === 2;
		document.body.removeChild( div ).style.display = 'none';

		div = null;
	});

	// Technique from Juriy Zaytsev
	// http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
	var eventSupported = function( eventName ) { 
		var el = document.createElement("div"); 
		eventName = "on" + eventName; 

		var isSupported = (eventName in el); 
		if ( !isSupported ) { 
			el.setAttribute(eventName, "return;"); 
			isSupported = typeof el[eventName] === "function"; 
		} 
		el = null; 

		return isSupported; 
	};
	
	jQuery.support.submitBubbles = eventSupported("submit");
	jQuery.support.changeBubbles = eventSupported("change");

	// release memory in IE
	root = script = div = all = a = null;
})();

jQuery.props = {
	"for": "htmlFor",
	"class": "className",
	readonly: "readOnly",
	maxlength: "maxLength",
	cellspacing: "cellSpacing",
	rowspan: "rowSpan",
	colspan: "colSpan",
	tabindex: "tabIndex",
	usemap: "useMap",
	frameborder: "frameBorder"
};
var expando = "jQuery" + now(), uuid = 0, windowData = {};

jQuery.extend({
	cache: {},
	
	expando:expando,

	// The following elements throw uncatchable exceptions if you
	// attempt to add expando properties to them.
	noData: {
		"embed": true,
		"object": true,
		"applet": true
	},

	data: function( elem, name, data ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache;

		if ( !id && typeof name === "string" && data === undefined ) {
			return null;
		}

		// Compute a unique ID for the element
		if ( !id ) { 
			id = ++uuid;
		}

		// Avoid generating a new cache unless none exists and we
		// want to manipulate it.
		if ( typeof name === "object" ) {
			elem[ expando ] = id;
			thisCache = cache[ id ] = jQuery.extend(true, {}, name);

		} else if ( !cache[ id ] ) {
			elem[ expando ] = id;
			cache[ id ] = {};
		}

		thisCache = cache[ id ];

		// Prevent overriding the named cache with undefined values
		if ( data !== undefined ) {
			thisCache[ name ] = data;
		}

		return typeof name === "string" ? thisCache[ name ] : thisCache;
	},

	removeData: function( elem, name ) {
		if ( elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()] ) {
			return;
		}

		elem = elem == window ?
			windowData :
			elem;

		var id = elem[ expando ], cache = jQuery.cache, thisCache = cache[ id ];

		// If we want to remove a specific section of the element's data
		if ( name ) {
			if ( thisCache ) {
				// Remove the section of cache data
				delete thisCache[ name ];

				// If we've removed all the data, remove the element's cache
				if ( jQuery.isEmptyObject(thisCache) ) {
					jQuery.removeData( elem );
				}
			}

		// Otherwise, we want to remove all of the element's data
		} else {
			if ( jQuery.support.deleteExpando ) {
				delete elem[ jQuery.expando ];

			} else if ( elem.removeAttribute ) {
				elem.removeAttribute( jQuery.expando );
			}

			// Completely remove the data cache
			delete cache[ id ];
		}
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		if ( typeof key === "undefined" && this.length ) {
			return jQuery.data( this[0] );

		} else if ( typeof key === "object" ) {
			return this.each(function() {
				jQuery.data( this, key );
			});
		}

		var parts = key.split(".");
		parts[1] = parts[1] ? "." + parts[1] : "";

		if ( value === undefined ) {
			var data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

			if ( data === undefined && this.length ) {
				data = jQuery.data( this[0], key );
			}
			return data === undefined && parts[1] ?
				this.data( parts[0] ) :
				data;
		} else {
			return this.trigger("setData" + parts[1] + "!", [parts[0], value]).each(function() {
				jQuery.data( this, key, value );
			});
		}
	},

	removeData: function( key ) {
		return this.each(function() {
			jQuery.removeData( this, key );
		});
	}
});
jQuery.extend({
	queue: function( elem, type, data ) {
		if ( !elem ) {
			return;
		}

		type = (type || "fx") + "queue";
		var q = jQuery.data( elem, type );

		// Speed up dequeue by getting out quickly if this is just a lookup
		if ( !data ) {
			return q || [];
		}

		if ( !q || jQuery.isArray(data) ) {
			q = jQuery.data( elem, type, jQuery.makeArray(data) );

		} else {
			q.push( data );
		}

		return q;
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ), fn = queue.shift();

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
		}

		if ( fn ) {
			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift("inprogress");
			}

			fn.call(elem, function() {
				jQuery.dequeue(elem, type);
			});
		}
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
		}

		if ( data === undefined ) {
			return jQuery.queue( this[0], type );
		}
		return this.each(function( i, elem ) {
			var queue = jQuery.queue( this, type, data );

			if ( type === "fx" && queue[0] !== "inprogress" ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},

	// Based off of the plugin by Clint Helfers, with permission.
	// http://blindsignals.com/index.php/2009/07/jquery-delay/
	delay: function( time, type ) {
		time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
		type = type || "fx";

		return this.queue( type, function() {
			var elem = this;
			setTimeout(function() {
				jQuery.dequeue( elem, type );
			}, time );
		});
	},

	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	}
});
var rclass = /[\n\t]/g,
	rspace = /\s+/,
	rreturn = /\r/g,
	rspecialurl = /href|src|style/,
	rtype = /(button|input)/i,
	rfocusable = /(button|input|object|select|textarea)/i,
	rclickable = /^(a|area)$/i,
	rradiocheck = /radio|checkbox/;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, name, value, true, jQuery.attr );
	},

	removeAttr: function( name, fn ) {
		return this.each(function(){
			jQuery.attr( this, name, "" );
			if ( this.nodeType === 1 ) {
				this.removeAttribute( name );
			}
		});
	},

	addClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.addClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( value && typeof value === "string" ) {
			var classNames = (value || "").split( rspace );

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 ) {
					if ( !elem.className ) {
						elem.className = value;

					} else {
						var className = " " + elem.className + " ", setClass = elem.className;
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							if ( className.indexOf( " " + classNames[c] + " " ) < 0 ) {
								setClass += " " + classNames[c];
							}
						}
						elem.className = jQuery.trim( setClass );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.removeClass( value.call(this, i, self.attr("class")) );
			});
		}

		if ( (value && typeof value === "string") || value === undefined ) {
			var classNames = (value || "").split(rspace);

			for ( var i = 0, l = this.length; i < l; i++ ) {
				var elem = this[i];

				if ( elem.nodeType === 1 && elem.className ) {
					if ( value ) {
						var className = (" " + elem.className + " ").replace(rclass, " ");
						for ( var c = 0, cl = classNames.length; c < cl; c++ ) {
							className = className.replace(" " + classNames[c] + " ", " ");
						}
						elem.className = jQuery.trim( className );

					} else {
						elem.className = "";
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, isBool = typeof stateVal === "boolean";

		if ( jQuery.isFunction( value ) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.toggleClass( value.call(this, i, self.attr("class"), stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// toggle individual class names
				var className, i = 0, self = jQuery(this),
					state = stateVal,
					classNames = value.split( rspace );

				while ( (className = classNames[ i++ ]) ) {
					// check each className given, space seperated list
					state = isBool ? state : !self.hasClass( className );
					self[ state ? "addClass" : "removeClass" ]( className );
				}

			} else if ( type === "undefined" || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					jQuery.data( this, "__className__", this.className );
				}

				// toggle whole className
				this.className = this.className || value === false ? "" : jQuery.data( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ";
		for ( var i = 0, l = this.length; i < l; i++ ) {
			if ( (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) > -1 ) {
				return true;
			}
		}

		return false;
	},

	val: function( value ) {
		if ( value === undefined ) {
			var elem = this[0];

			if ( elem ) {
				if ( jQuery.nodeName( elem, "option" ) ) {
					return (elem.attributes.value || {}).specified ? elem.value : elem.text;
				}

				// We need to handle select boxes special
				if ( jQuery.nodeName( elem, "select" ) ) {
					var index = elem.selectedIndex,
						values = [],
						options = elem.options,
						one = elem.type === "select-one";

					// Nothing was selected
					if ( index < 0 ) {
						return null;
					}

					// Loop through all the selected options
					for ( var i = one ? index : 0, max = one ? index + 1 : options.length; i < max; i++ ) {
						var option = options[ i ];

						if ( option.selected ) {
							// Get the specifc value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if ( one ) {
								return value;
							}

							// Multi-Selects return an array
							values.push( value );
						}
					}

					return values;
				}

				// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
				if ( rradiocheck.test( elem.type ) && !jQuery.support.checkOn ) {
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
				

				// Everything else, we just grab the value
				return (elem.value || "").replace(rreturn, "");

			}

			return undefined;
		}

		var isFunction = jQuery.isFunction(value);

		return this.each(function(i) {
			var self = jQuery(this), val = value;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call(this, i, self.val());
			}

			// Typecast each time if the value is a Function and the appended
			// value is therefore different each time.
			if ( typeof val === "number" ) {
				val += "";
			}

			if ( jQuery.isArray(val) && rradiocheck.test( this.type ) ) {
				this.checked = jQuery.inArray( self.val(), val ) >= 0;

			} else if ( jQuery.nodeName( this, "select" ) ) {
				var values = jQuery.makeArray(val);

				jQuery( "option", this ).each(function() {
					this.selected = jQuery.inArray( jQuery(this).val(), values ) >= 0;
				});

				if ( !values.length ) {
					this.selectedIndex = -1;
				}

			} else {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	attrFn: {
		val: true,
		css: true,
		html: true,
		text: true,
		data: true,
		width: true,
		height: true,
		offset: true
	},
		
	attr: function( elem, name, value, pass ) {
		// don't set attributes on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		if ( pass && name in jQuery.attrFn ) {
			return jQuery(elem)[name](value);
		}

		var notxml = elem.nodeType !== 1 || !jQuery.isXMLDoc( elem ),
			// Whether we are setting (or getting)
			set = value !== undefined;

		// Try to normalize/fix the name
		name = notxml && jQuery.props[ name ] || name;

		// Only do all the following if this is a node (faster for style)
		if ( elem.nodeType === 1 ) {
			// These attributes require special treatment
			var special = rspecialurl.test( name );

			// Safari mis-reports the default selected property of an option
			// Accessing the parent's selectedIndex property fixes it
			if ( name === "selected" && !jQuery.support.optSelected ) {
				var parent = elem.parentNode;
				if ( parent ) {
					parent.selectedIndex;
	
					// Make sure that it also works with optgroups, see #5701
					if ( parent.parentNode ) {
						parent.parentNode.selectedIndex;
					}
				}
			}

			// If applicable, access the attribute via the DOM 0 way
			if ( name in elem && notxml && !special ) {
				if ( set ) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if ( name === "type" && rtype.test( elem.nodeName ) && elem.parentNode ) {
						jQuery.error( "type property can't be changed" );
					}

					elem[ name ] = value;
				}

				// browsers index elements by id/name on forms, give priority to attributes.
				if ( jQuery.nodeName( elem, "form" ) && elem.getAttributeNode(name) ) {
					return elem.getAttributeNode( name ).nodeValue;
				}

				// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				if ( name === "tabIndex" ) {
					var attributeNode = elem.getAttributeNode( "tabIndex" );

					return attributeNode && attributeNode.specified ?
						attributeNode.value :
						rfocusable.test( elem.nodeName ) || rclickable.test( elem.nodeName ) && elem.href ?
							0 :
							undefined;
				}

				return elem[ name ];
			}

			if ( !jQuery.support.style && notxml && name === "style" ) {
				if ( set ) {
					elem.style.cssText = "" + value;
				}

				return elem.style.cssText;
			}

			if ( set ) {
				// convert the value to a string (all browsers do this but IE) see #1070
				elem.setAttribute( name, "" + value );
			}

			var attr = !jQuery.support.hrefNormalized && notxml && special ?
					// Some attributes require a special call on IE
					elem.getAttribute( name, 2 ) :
					elem.getAttribute( name );

			// Non-existent attributes return null, we normalize to undefined
			return attr === null ? undefined : attr;
		}

		// elem is actually elem.style ... set the style
		// Using attr for specific style information is now deprecated. Use style instead.
		return jQuery.style( elem, name, value );
	}
});
var rnamespaces = /\.(.*)$/,
	fcleanup = function( nm ) {
		return nm.replace(/[^\w\s\.\|`]/g, function( ch ) {
			return "\\" + ch;
		});
	};

/*
 * A number of helper functions used for managing events.
 * Many of the ideas behind this code originated from
 * Dean Edwards' addEvent library.
 */
jQuery.event = {

	// Bind an event to an element
	// Original by Dean Edwards
	add: function( elem, types, handler, data ) {
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// For whatever reason, IE has trouble passing the window object
		// around, causing it to be cloned in the process
		if ( elem.setInterval && ( elem !== window && !elem.frameElement ) ) {
			elem = window;
		}

		var handleObjIn, handleObj;

		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
		}

		// Make sure that the function being executed has a unique ID
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure
		var elemData = jQuery.data( elem );

		// If no elemData is found then we must be trying to bind to one of the
		// banned noData elements
		if ( !elemData ) {
			return;
		}

		var events = elemData.events = elemData.events || {},
			eventHandle = elemData.handle, eventHandle;

		if ( !eventHandle ) {
			elemData.handle = eventHandle = function() {
				// Handle the second event of a trigger and when
				// an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && !jQuery.event.triggered ?
					jQuery.event.handle.apply( eventHandle.elem, arguments ) :
					undefined;
			};
		}

		// Add elem as a property of the handle function
		// This is to prevent a memory leak with non-native events in IE.
		eventHandle.elem = elem;

		// Handle multiple events separated by a space
		// jQuery(...).bind("mouseover mouseout", fn);
		types = types.split(" ");

		var type, i = 0, namespaces;

		while ( (type = types[ i++ ]) ) {
			handleObj = handleObjIn ?
				jQuery.extend({}, handleObjIn) :
				{ handler: handler, data: data };

			// Namespaced event handlers
			if ( type.indexOf(".") > -1 ) {
				namespaces = type.split(".");
				type = namespaces.shift();
				handleObj.namespace = namespaces.slice(0).sort().join(".");

			} else {
				namespaces = [];
				handleObj.namespace = "";
			}

			handleObj.type = type;
			handleObj.guid = handler.guid;

			// Get the current list of functions bound to this event
			var handlers = events[ type ],
				special = jQuery.event.special[ type ] || {};

			// Init the event handler queue
			if ( !handlers ) {
				handlers = events[ type ] = [];

				// Check for a special event handler
				// Only use addEventListener/attachEvent if the special
				// events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					// Bind the global event handler to the element
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );

					} else if ( elem.attachEvent ) {
						elem.attachEvent( "on" + type, eventHandle );
					}
				}
			}
			
			if ( special.add ) { 
				special.add.call( elem, handleObj ); 

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add the function to the element's handler list
			handlers.push( handleObj );

			// Keep track of which events have been used, for global triggering
			jQuery.event.global[ type ] = true;
		}

		// Nullify elem to prevent memory leaks in IE
		elem = null;
	},

	global: {},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, pos ) {
		// don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		var ret, type, fn, i = 0, all, namespaces, namespace, special, eventType, handleObj, origType,
			elemData = jQuery.data( elem ),
			events = elemData && elemData.events;

		if ( !elemData || !events ) {
			return;
		}

		// types is actually an event object here
		if ( types && types.type ) {
			handler = types.handler;
			types = types.type;
		}

		// Unbind all events for the element
		if ( !types || typeof types === "string" && types.charAt(0) === "." ) {
			types = types || "";

			for ( type in events ) {
				jQuery.event.remove( elem, type + types );
			}

			return;
		}

		// Handle multiple events separated by a space
		// jQuery(...).unbind("mouseover mouseout", fn);
		types = types.split(" ");

		while ( (type = types[ i++ ]) ) {
			origType = type;
			handleObj = null;
			all = type.indexOf(".") < 0;
			namespaces = [];

			if ( !all ) {
				// Namespaced event handlers
				namespaces = type.split(".");
				type = namespaces.shift();

				namespace = new RegExp("(^|\\.)" + 
					jQuery.map( namespaces.slice(0).sort(), fcleanup ).join("\\.(?:.*\\.)?") + "(\\.|$)")
			}

			eventType = events[ type ];

			if ( !eventType ) {
				continue;
			}

			if ( !handler ) {
				for ( var j = 0; j < eventType.length; j++ ) {
					handleObj = eventType[ j ];

					if ( all || namespace.test( handleObj.namespace ) ) {
						jQuery.event.remove( elem, origType, handleObj.handler, j );
						eventType.splice( j--, 1 );
					}
				}

				continue;
			}

			special = jQuery.event.special[ type ] || {};

			for ( var j = pos || 0; j < eventType.length; j++ ) {
				handleObj = eventType[ j ];

				if ( handler.guid === handleObj.guid ) {
					// remove the given handler for the given type
					if ( all || namespace.test( handleObj.namespace ) ) {
						if ( pos == null ) {
							eventType.splice( j--, 1 );
						}

						if ( special.remove ) {
							special.remove.call( elem, handleObj );
						}
					}

					if ( pos != null ) {
						break;
					}
				}
			}

			// remove generic event handler if no more handlers exist
			if ( eventType.length === 0 || pos != null && eventType.length === 1 ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces ) === false ) {
					removeEvent( elem, type, elemData.handle );
				}

				ret = null;
				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			var handle = elemData.handle;
			if ( handle ) {
				handle.elem = null;
			}

			delete elemData.events;
			delete elemData.handle;

			if ( jQuery.isEmptyObject( elemData ) ) {
				jQuery.removeData( elem );
			}
		}
	},

	// bubbling is internal
	trigger: function( event, data, elem /*, bubbling */ ) {
		// Event object or event type
		var type = event.type || event,
			bubbling = arguments[3];

		if ( !bubbling ) {
			event = typeof event === "object" ?
				// jQuery.Event object
				event[expando] ? event :
				// Object literal
				jQuery.extend( jQuery.Event(type), event ) :
				// Just the event type (string)
				jQuery.Event(type);

			if ( type.indexOf("!") >= 0 ) {
				event.type = type = type.slice(0, -1);
				event.exclusive = true;
			}

			// Handle a global trigger
			if ( !elem ) {
				// Don't bubble custom events when global (to avoid too much overhead)
				event.stopPropagation();

				// Only trigger if we've ever bound an event for it
				if ( jQuery.event.global[ type ] ) {
					jQuery.each( jQuery.cache, function() {
						if ( this.events && this.events[type] ) {
							jQuery.event.trigger( event, data, this.handle.elem );
						}
					});
				}
			}

			// Handle triggering a single element

			// don't do events on text and comment nodes
			if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
				return undefined;
			}

			// Clean up in case it is reused
			event.result = undefined;
			event.target = elem;

			// Clone the incoming data, if any
			data = jQuery.makeArray( data );
			data.unshift( event );
		}

		event.currentTarget = elem;

		// Trigger the event, it is assumed that "handle" is a function
		var handle = jQuery.data( elem, "handle" );
		if ( handle ) {
			handle.apply( elem, data );
		}

		var parent = elem.parentNode || elem.ownerDocument;

		// Trigger an inline bound script
		try {
			if ( !(elem && elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) ) {
				if ( elem[ "on" + type ] && elem[ "on" + type ].apply( elem, data ) === false ) {
					event.result = false;
				}
			}

		// prevent IE from throwing an error for some elements with some event types, see #3533
		} catch (e) {}

		if ( !event.isPropagationStopped() && parent ) {
			jQuery.event.trigger( event, data, parent, true );

		} else if ( !event.isDefaultPrevented() ) {
			var target = event.target, old,
				isClick = jQuery.nodeName(target, "a") && type === "click",
				special = jQuery.event.special[ type ] || {};

			if ( (!special._default || special._default.call( elem, event ) === false) && 
				!isClick && !(target && target.nodeName && jQuery.noData[target.nodeName.toLowerCase()]) ) {

				try {
					if ( target[ type ] ) {
						// Make sure that we don't accidentally re-trigger the onFOO events
						old = target[ "on" + type ];

						if ( old ) {
							target[ "on" + type ] = null;
						}

						jQuery.event.triggered = true;
						target[ type ]();
					}

				// prevent IE from throwing an error for some elements with some event types, see #3533
				} catch (e) {}

				if ( old ) {
					target[ "on" + type ] = old;
				}

				jQuery.event.triggered = false;
			}
		}
	},

	handle: function( event ) {
		var all, handlers, namespaces, namespace, events;

		event = arguments[0] = jQuery.event.fix( event || window.event );
		event.currentTarget = this;

		// Namespaced event handlers
		all = event.type.indexOf(".") < 0 && !event.exclusive;

		if ( !all ) {
			namespaces = event.type.split(".");
			event.type = namespaces.shift();
			namespace = new RegExp("(^|\\.)" + namespaces.slice(0).sort().join("\\.(?:.*\\.)?") + "(\\.|$)");
		}

		var events = jQuery.data(this, "events"), handlers = events[ event.type ];

		if ( events && handlers ) {
			// Clone the handlers to prevent manipulation
			handlers = handlers.slice(0);

			for ( var j = 0, l = handlers.length; j < l; j++ ) {
				var handleObj = handlers[ j ];

				// Filter the functions by class
				if ( all || namespace.test( handleObj.namespace ) ) {
					// Pass in a reference to the handler function itself
					// So that we can later remove it
					event.handler = handleObj.handler;
					event.data = handleObj.data;
					event.handleObj = handleObj;
	
					var ret = handleObj.handler.apply( this, arguments );

					if ( ret !== undefined ) {
						event.result = ret;
						if ( ret === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}

					if ( event.isImmediatePropagationStopped() ) {
						break;
					}
				}
			}
		}

		return event.result;
	},

	props: "altKey attrChange attrName bubbles button cancelable charCode clientX clientY ctrlKey currentTarget data detail eventPhase fromElement handler keyCode layerX layerY metaKey newValue offsetX offsetY originalTarget pageX pageY prevValue relatedNode relatedTarget screenX screenY shiftKey srcElement target toElement view wheelDelta which".split(" "),

	fix: function( event ) {
		if ( event[ expando ] ) {
			return event;
		}

		// store a copy of the original event object
		// and "clone" to set read-only properties
		var originalEvent = event;
		event = jQuery.Event( originalEvent );

		for ( var i = this.props.length, prop; i; ) {
			prop = this.props[ --i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Fix target property, if necessary
		if ( !event.target ) {
			event.target = event.srcElement || document; // Fixes #1925 where srcElement might not be defined either
		}

		// check if target is a textnode (safari)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		// Add relatedTarget, if necessary
		if ( !event.relatedTarget && event.fromElement ) {
			event.relatedTarget = event.fromElement === event.target ? event.toElement : event.fromElement;
		}

		// Calculate pageX/Y if missing and clientX/Y available
		if ( event.pageX == null && event.clientX != null ) {
			var doc = document.documentElement, body = document.body;
			event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
			event.pageY = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
		}

		// Add which for key events
		if ( !event.which && ((event.charCode || event.charCode === 0) ? event.charCode : event.keyCode) ) {
			event.which = event.charCode || event.keyCode;
		}

		// Add metaKey to non-Mac browsers (use ctrl for PC's and Meta for Macs)
		if ( !event.metaKey && event.ctrlKey ) {
			event.metaKey = event.ctrlKey;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		// Note: button is not normalized, so don't use it
		if ( !event.which && event.button !== undefined ) {
			event.which = (event.button & 1 ? 1 : ( event.button & 2 ? 3 : ( event.button & 4 ? 2 : 0 ) ));
		}

		return event;
	},

	// Deprecated, use jQuery.guid instead
	guid: 1E8,

	// Deprecated, use jQuery.proxy instead
	proxy: jQuery.proxy,

	special: {
		ready: {
			// Make sure the ready event is setup
			setup: jQuery.bindReady,
			teardown: jQuery.noop
		},

		live: {
			add: function( handleObj ) {
				jQuery.event.add( this, handleObj.origType, jQuery.extend({}, handleObj, {handler: liveHandler}) ); 
			},

			remove: function( handleObj ) {
				var remove = true,
					type = handleObj.origType.replace(rnamespaces, "");
				
				jQuery.each( jQuery.data(this, "events").live || [], function() {
					if ( type === this.origType.replace(rnamespaces, "") ) {
						remove = false;
						return false;
					}
				});

				if ( remove ) {
					jQuery.event.remove( this, handleObj.origType, liveHandler );
				}
			}

		},

		beforeunload: {
			setup: function( data, namespaces, eventHandle ) {
				// We only want to do this special case on windows
				if ( this.setInterval ) {
					this.onbeforeunload = eventHandle;
				}

				return false;
			},
			teardown: function( namespaces, eventHandle ) {
				if ( this.onbeforeunload === eventHandle ) {
					this.onbeforeunload = null;
				}
			}
		}
	}
};

var removeEvent = document.removeEventListener ?
	function( elem, type, handle ) {
		elem.removeEventListener( type, handle, false );
	} : 
	function( elem, type, handle ) {
		elem.detachEvent( "on" + type, handle );
	};

jQuery.Event = function( src ) {
	// Allow instantiation without the 'new' keyword
	if ( !this.preventDefault ) {
		return new jQuery.Event( src );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;
	// Event type
	} else {
		this.type = src;
	}

	// timeStamp is buggy for some events on Firefox(#3843)
	// So we won't rely on the native value
	this.timeStamp = now();

	// Mark it as fixed
	this[ expando ] = true;
};

function returnFalse() {
	return false;
}
function returnTrue() {
	return true;
}

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	preventDefault: function() {
		this.isDefaultPrevented = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		
		// if preventDefault exists run it on the original event
		if ( e.preventDefault ) {
			e.preventDefault();
		}
		// otherwise set the returnValue property of the original event to false (IE)
		e.returnValue = false;
	},
	stopPropagation: function() {
		this.isPropagationStopped = returnTrue;

		var e = this.originalEvent;
		if ( !e ) {
			return;
		}
		// if stopPropagation exists run it on the original event
		if ( e.stopPropagation ) {
			e.stopPropagation();
		}
		// otherwise set the cancelBubble property of the original event to true (IE)
		e.cancelBubble = true;
	},
	stopImmediatePropagation: function() {
		this.isImmediatePropagationStopped = returnTrue;
		this.stopPropagation();
	},
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse
};

// Checks if an event happened on an element within another element
// Used in jQuery.event.special.mouseenter and mouseleave handlers
var withinElement = function( event ) {
	// Check if mouse(over|out) are still within the same parent element
	var parent = event.relatedTarget;

	// Firefox sometimes assigns relatedTarget a XUL element
	// which we cannot access the parentNode property of
	try {
		// Traverse up the tree
		while ( parent && parent !== this ) {
			parent = parent.parentNode;
		}

		if ( parent !== this ) {
			// set the correct event type
			event.type = event.data;

			// handle event if we actually just moused on to a non sub-element
			jQuery.event.handle.apply( this, arguments );
		}

	// assuming we've left the element since we most likely mousedover a xul element
	} catch(e) { }
},

// In case of event delegation, we only need to rename the event.type,
// liveHandler will take care of the rest.
delegate = function( event ) {
	event.type = event.data;
	jQuery.event.handle.apply( this, arguments );
};

// Create mouseenter and mouseleave events
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		setup: function( data ) {
			jQuery.event.add( this, fix, data && data.selector ? delegate : withinElement, orig );
		},
		teardown: function( data ) {
			jQuery.event.remove( this, fix, data && data.selector ? delegate : withinElement );
		}
	};
});

// submit delegation
if ( !jQuery.support.submitBubbles ) {

	jQuery.event.special.submit = {
		setup: function( data, namespaces ) {
			if ( this.nodeName.toLowerCase() !== "form" ) {
				jQuery.event.add(this, "click.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "submit" || type === "image") && jQuery( elem ).closest("form").length ) {
						return trigger( "submit", this, arguments );
					}
				});
	 
				jQuery.event.add(this, "keypress.specialSubmit", function( e ) {
					var elem = e.target, type = elem.type;

					if ( (type === "text" || type === "password") && jQuery( elem ).closest("form").length && e.keyCode === 13 ) {
						return trigger( "submit", this, arguments );
					}
				});

			} else {
				return false;
			}
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialSubmit" );
		}
	};

}

// change delegation, happens here so we have bind.
if ( !jQuery.support.changeBubbles ) {

	var formElems = /textarea|input|select/i,

	changeFilters,

	getVal = function( elem ) {
		var type = elem.type, val = elem.value;

		if ( type === "radio" || type === "checkbox" ) {
			val = elem.checked;

		} else if ( type === "select-multiple" ) {
			val = elem.selectedIndex > -1 ?
				jQuery.map( elem.options, function( elem ) {
					return elem.selected;
				}).join("-") :
				"";

		} else if ( elem.nodeName.toLowerCase() === "select" ) {
			val = elem.selectedIndex;
		}

		return val;
	},

	testChange = function testChange( e ) {
		var elem = e.target, data, val;

		if ( !formElems.test( elem.nodeName ) || elem.readOnly ) {
			return;
		}

		data = jQuery.data( elem, "_change_data" );
		val = getVal(elem);

		// the current data will be also retrieved by beforeactivate
		if ( e.type !== "focusout" || elem.type !== "radio" ) {
			jQuery.data( elem, "_change_data", val );
		}
		
		if ( data === undefined || val === data ) {
			return;
		}

		if ( data != null || val ) {
			e.type = "change";
			return jQuery.event.trigger( e, arguments[1], elem );
		}
	};

	jQuery.event.special.change = {
		filters: {
			focusout: testChange, 

			click: function( e ) {
				var elem = e.target, type = elem.type;

				if ( type === "radio" || type === "checkbox" || elem.nodeName.toLowerCase() === "select" ) {
					return testChange.call( this, e );
				}
			},

			// Change has to be called before submit
			// Keydown will be called before keypress, which is used in submit-event delegation
			keydown: function( e ) {
				var elem = e.target, type = elem.type;

				if ( (e.keyCode === 13 && elem.nodeName.toLowerCase() !== "textarea") ||
					(e.keyCode === 32 && (type === "checkbox" || type === "radio")) ||
					type === "select-multiple" ) {
					return testChange.call( this, e );
				}
			},

			// Beforeactivate happens also before the previous element is blurred
			// with this event you can't trigger a change event, but you can store
			// information/focus[in] is not needed anymore
			beforeactivate: function( e ) {
				var elem = e.target;
				jQuery.data( elem, "_change_data", getVal(elem) );
			}
		},

		setup: function( data, namespaces ) {
			if ( this.type === "file" ) {
				return false;
			}

			for ( var type in changeFilters ) {
				jQuery.event.add( this, type + ".specialChange", changeFilters[type] );
			}

			return formElems.test( this.nodeName );
		},

		teardown: function( namespaces ) {
			jQuery.event.remove( this, ".specialChange" );

			return formElems.test( this.nodeName );
		}
	};

	changeFilters = jQuery.event.special.change.filters;
}

function trigger( type, elem, args ) {
	args[0].type = type;
	return jQuery.event.handle.apply( elem, args );
}

// Create "bubbling" focus and blur events
if ( document.addEventListener ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {
		jQuery.event.special[ fix ] = {
			setup: function() {
				this.addEventListener( orig, handler, true );
			}, 
			teardown: function() { 
				this.removeEventListener( orig, handler, true );
			}
		};

		function handler( e ) { 
			e = jQuery.event.fix( e );
			e.type = fix;
			return jQuery.event.handle.call( this, e );
		}
	});
}

jQuery.each(["bind", "one"], function( i, name ) {
	jQuery.fn[ name ] = function( type, data, fn ) {
		// Handle object literals
		if ( typeof type === "object" ) {
			for ( var key in type ) {
				this[ name ](key, data, type[key], fn);
			}
			return this;
		}
		
		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		var handler = name === "one" ? jQuery.proxy( fn, function( event ) {
			jQuery( this ).unbind( event, handler );
			return fn.apply( this, arguments );
		}) : fn;

		if ( type === "unload" && name !== "one" ) {
			this.one( type, data, fn );

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.add( this[i], type, handler, data );
			}
		}

		return this;
	};
});

jQuery.fn.extend({
	unbind: function( type, fn ) {
		// Handle object literals
		if ( typeof type === "object" && !type.preventDefault ) {
			for ( var key in type ) {
				this.unbind(key, type[key]);
			}

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				jQuery.event.remove( this[i], type, fn );
			}
		}

		return this;
	},
	
	delegate: function( selector, types, data, fn ) {
		return this.live( types, data, fn, selector );
	},
	
	undelegate: function( selector, types, fn ) {
		if ( arguments.length === 0 ) {
				return this.unbind( "live" );
		
		} else {
			return this.die( types, null, fn, selector );
		}
	},
	
	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},

	triggerHandler: function( type, data ) {
		if ( this[0] ) {
			var event = jQuery.Event( type );
			event.preventDefault();
			event.stopPropagation();
			jQuery.event.trigger( event, data, this[0] );
			return event.result;
		}
	},

	toggle: function( fn ) {
		// Save reference to arguments for access in closure
		var args = arguments, i = 1;

		// link all the functions, so any of them can unbind this click handler
		while ( i < args.length ) {
			jQuery.proxy( fn, args[ i++ ] );
		}

		return this.click( jQuery.proxy( fn, function( event ) {
			// Figure out which function to execute
			var lastToggle = ( jQuery.data( this, "lastToggle" + fn.guid ) || 0 ) % i;
			jQuery.data( this, "lastToggle" + fn.guid, lastToggle + 1 );

			// Make sure that clicks stop
			event.preventDefault();

			// and execute the function
			return args[ lastToggle ].apply( this, arguments ) || false;
		}));
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
});

var liveMap = {
	focus: "focusin",
	blur: "focusout",
	mouseenter: "mouseover",
	mouseleave: "mouseout"
};

jQuery.each(["live", "die"], function( i, name ) {
	jQuery.fn[ name ] = function( types, data, fn, origSelector /* Internal Use Only */ ) {
		var type, i = 0, match, namespaces, preType,
			selector = origSelector || this.selector,
			context = origSelector ? this : jQuery( this.context );

		if ( jQuery.isFunction( data ) ) {
			fn = data;
			data = undefined;
		}

		types = (types || "").split(" ");

		while ( (type = types[ i++ ]) != null ) {
			match = rnamespaces.exec( type );
			namespaces = "";

			if ( match )  {
				namespaces = match[0];
				type = type.replace( rnamespaces, "" );
			}

			if ( type === "hover" ) {
				types.push( "mouseenter" + namespaces, "mouseleave" + namespaces );
				continue;
			}

			preType = type;

			if ( type === "focus" || type === "blur" ) {
				types.push( liveMap[ type ] + namespaces );
				type = type + namespaces;

			} else {
				type = (liveMap[ type ] || type) + namespaces;
			}

			if ( name === "live" ) {
				// bind live handler
				context.each(function(){
					jQuery.event.add( this, liveConvert( type, selector ),
						{ data: data, selector: selector, handler: fn, origType: type, origHandler: fn, preType: preType } );
				});

			} else {
				// unbind live handler
				context.unbind( liveConvert( type, selector ), fn );
			}
		}
		
		return this;
	}
});

function liveHandler( event ) {
	var stop, elems = [], selectors = [], args = arguments,
		related, match, handleObj, elem, j, i, l, data,
		events = jQuery.data( this, "events" );

	// Make sure we avoid non-left-click bubbling in Firefox (#3861)
	if ( event.liveFired === this || !events || !events.live || event.button && event.type === "click" ) {
		return;
	}

	event.liveFired = this;

	var live = events.live.slice(0);

	for ( j = 0; j < live.length; j++ ) {
		handleObj = live[j];

		if ( handleObj.origType.replace( rnamespaces, "" ) === event.type ) {
			selectors.push( handleObj.selector );

		} else {
			live.splice( j--, 1 );
		}
	}

	match = jQuery( event.target ).closest( selectors, event.currentTarget );

	for ( i = 0, l = match.length; i < l; i++ ) {
		for ( j = 0; j < live.length; j++ ) {
			handleObj = live[j];

			if ( match[i].selector === handleObj.selector ) {
				elem = match[i].elem;
				related = null;

				// Those two events require additional checking
				if ( handleObj.preType === "mouseenter" || handleObj.preType === "mouseleave" ) {
					related = jQuery( event.relatedTarget ).closest( handleObj.selector )[0];
				}

				if ( !related || related !== elem ) {
					elems.push({ elem: elem, handleObj: handleObj });
				}
			}
		}
	}

	for ( i = 0, l = elems.length; i < l; i++ ) {
		match = elems[i];
		event.currentTarget = match.elem;
		event.data = match.handleObj.data;
		event.handleObj = match.handleObj;

		if ( match.handleObj.origHandler.apply( match.elem, args ) === false ) {
			stop = false;
			break;
		}
	}

	return stop;
}

function liveConvert( type, selector ) {
	return "live." + (type && type !== "*" ? type + "." : "") + selector.replace(/\./g, "`").replace(/ /g, "&");
}

jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( fn ) {
		return fn ? this.bind( name, fn ) : this.trigger( name );
	};

	if ( jQuery.attrFn ) {
		jQuery.attrFn[ name ] = true;
	}
});

// Prevent memory leaks in IE
// Window isn't included so as not to unbind existing unload events
// More info:
//  - http://isaacschlueter.com/2006/10/msie-memory-leaks/
if ( window.attachEvent && !window.addEventListener ) {
	window.attachEvent("onunload", function() {
		for ( var id in jQuery.cache ) {
			if ( jQuery.cache[ id ].handle ) {
				// Try/Catch is to handle iframes being unloaded, see #4280
				try {
					jQuery.event.remove( jQuery.cache[ id ].handle.elem );
				} catch(e) {}
			}
		}
	});
}
/*!
 * Sizzle CSS Selector Engine - v1.0
 *  Copyright 2009, The Dojo Foundation
 *  Released under the MIT, BSD, and GPL Licenses.
 *  More information: http://sizzlejs.com/
 */
(function(){

var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g,
	done = 0,
	toString = Object.prototype.toString,
	hasDuplicate = false,
	baseHasDuplicate = true;

// Here we check if the JavaScript engine is using some sort of
// optimization where it does not always call our comparision
// function. If that is the case, discard the hasDuplicate value.
//   Thus far that includes Google Chrome.
[0, 0].sort(function(){
	baseHasDuplicate = false;
	return 0;
});

var Sizzle = function(selector, context, results, seed) {
	results = results || [];
	var origContext = context = context || document;

	if ( context.nodeType !== 1 && context.nodeType !== 9 ) {
		return [];
	}
	
	if ( !selector || typeof selector !== "string" ) {
		return results;
	}

	var parts = [], m, set, checkSet, extra, prune = true, contextXML = isXML(context),
		soFar = selector;
	
	// Reset the position of the chunker regexp (start from head)
	while ( (chunker.exec(""), m = chunker.exec(soFar)) !== null ) {
		soFar = m[3];
		
		parts.push( m[1] );
		
		if ( m[2] ) {
			extra = m[3];
			break;
		}
	}

	if ( parts.length > 1 && origPOS.exec( selector ) ) {
		if ( parts.length === 2 && Expr.relative[ parts[0] ] ) {
			set = posProcess( parts[0] + parts[1], context );
		} else {
			set = Expr.relative[ parts[0] ] ?
				[ context ] :
				Sizzle( parts.shift(), context );

			while ( parts.length ) {
				selector = parts.shift();

				if ( Expr.relative[ selector ] ) {
					selector += parts.shift();
				}
				
				set = posProcess( selector, set );
			}
		}
	} else {
		// Take a shortcut and set the context if the root selector is an ID
		// (but not if it'll be faster if the inner selector is an ID)
		if ( !seed && parts.length > 1 && context.nodeType === 9 && !contextXML &&
				Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1]) ) {
			var ret = Sizzle.find( parts.shift(), context, contextXML );
			context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
		}

		if ( context ) {
			var ret = seed ?
				{ expr: parts.pop(), set: makeArray(seed) } :
				Sizzle.find( parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML );
			set = ret.expr ? Sizzle.filter( ret.expr, ret.set ) : ret.set;

			if ( parts.length > 0 ) {
				checkSet = makeArray(set);
			} else {
				prune = false;
			}

			while ( parts.length ) {
				var cur = parts.pop(), pop = cur;

				if ( !Expr.relative[ cur ] ) {
					cur = "";
				} else {
					pop = parts.pop();
				}

				if ( pop == null ) {
					pop = context;
				}

				Expr.relative[ cur ]( checkSet, pop, contextXML );
			}
		} else {
			checkSet = parts = [];
		}
	}

	if ( !checkSet ) {
		checkSet = set;
	}

	if ( !checkSet ) {
		Sizzle.error( cur || selector );
	}

	if ( toString.call(checkSet) === "[object Array]" ) {
		if ( !prune ) {
			results.push.apply( results, checkSet );
		} else if ( context && context.nodeType === 1 ) {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && contains(context, checkSet[i])) ) {
					results.push( set[i] );
				}
			}
		} else {
			for ( var i = 0; checkSet[i] != null; i++ ) {
				if ( checkSet[i] && checkSet[i].nodeType === 1 ) {
					results.push( set[i] );
				}
			}
		}
	} else {
		makeArray( checkSet, results );
	}

	if ( extra ) {
		Sizzle( extra, origContext, results, seed );
		Sizzle.uniqueSort( results );
	}

	return results;
};

Sizzle.uniqueSort = function(results){
	if ( sortOrder ) {
		hasDuplicate = baseHasDuplicate;
		results.sort(sortOrder);

		if ( hasDuplicate ) {
			for ( var i = 1; i < results.length; i++ ) {
				if ( results[i] === results[i-1] ) {
					results.splice(i--, 1);
				}
			}
		}
	}

	return results;
};

Sizzle.matches = function(expr, set){
	return Sizzle(expr, null, null, set);
};

Sizzle.find = function(expr, context, isXML){
	var set, match;

	if ( !expr ) {
		return [];
	}

	for ( var i = 0, l = Expr.order.length; i < l; i++ ) {
		var type = Expr.order[i], match;
		
		if ( (match = Expr.leftMatch[ type ].exec( expr )) ) {
			var left = match[1];
			match.splice(1,1);

			if ( left.substr( left.length - 1 ) !== "\\" ) {
				match[1] = (match[1] || "").replace(/\\/g, "");
				set = Expr.find[ type ]( match, context, isXML );
				if ( set != null ) {
					expr = expr.replace( Expr.match[ type ], "" );
					break;
				}
			}
		}
	}

	if ( !set ) {
		set = context.getElementsByTagName("*");
	}

	return {set: set, expr: expr};
};

Sizzle.filter = function(expr, set, inplace, not){
	var old = expr, result = [], curLoop = set, match, anyFound,
		isXMLFilter = set && set[0] && isXML(set[0]);

	while ( expr && set.length ) {
		for ( var type in Expr.filter ) {
			if ( (match = Expr.leftMatch[ type ].exec( expr )) != null && match[2] ) {
				var filter = Expr.filter[ type ], found, item, left = match[1];
				anyFound = false;

				match.splice(1,1);

				if ( left.substr( left.length - 1 ) === "\\" ) {
					continue;
				}

				if ( curLoop === result ) {
					result = [];
				}

				if ( Expr.preFilter[ type ] ) {
					match = Expr.preFilter[ type ]( match, curLoop, inplace, result, not, isXMLFilter );

					if ( !match ) {
						anyFound = found = true;
					} else if ( match === true ) {
						continue;
					}
				}

				if ( match ) {
					for ( var i = 0; (item = curLoop[i]) != null; i++ ) {
						if ( item ) {
							found = filter( item, match, i, curLoop );
							var pass = not ^ !!found;

							if ( inplace && found != null ) {
								if ( pass ) {
									anyFound = true;
								} else {
									curLoop[i] = false;
								}
							} else if ( pass ) {
								result.push( item );
								anyFound = true;
							}
						}
					}
				}

				if ( found !== undefined ) {
					if ( !inplace ) {
						curLoop = result;
					}

					expr = expr.replace( Expr.match[ type ], "" );

					if ( !anyFound ) {
						return [];
					}

					break;
				}
			}
		}

		// Improper expression
		if ( expr === old ) {
			if ( anyFound == null ) {
				Sizzle.error( expr );
			} else {
				break;
			}
		}

		old = expr;
	}

	return curLoop;
};

Sizzle.error = function( msg ) {
	throw "Syntax error, unrecognized expression: " + msg;
};

var Expr = Sizzle.selectors = {
	order: [ "ID", "NAME", "TAG" ],
	match: {
		ID: /#((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		CLASS: /\.((?:[\w\u00c0-\uFFFF-]|\\.)+)/,
		NAME: /\[name=['"]*((?:[\w\u00c0-\uFFFF-]|\\.)+)['"]*\]/,
		ATTR: /\[\s*((?:[\w\u00c0-\uFFFF-]|\\.)+)\s*(?:(\S?=)\s*(['"]*)(.*?)\3|)\s*\]/,
		TAG: /^((?:[\w\u00c0-\uFFFF\*-]|\\.)+)/,
		CHILD: /:(only|nth|last|first)-child(?:\((even|odd|[\dn+-]*)\))?/,
		POS: /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^-]|$)/,
		PSEUDO: /:((?:[\w\u00c0-\uFFFF-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
	},
	leftMatch: {},
	attrMap: {
		"class": "className",
		"for": "htmlFor"
	},
	attrHandle: {
		href: function(elem){
			return elem.getAttribute("href");
		}
	},
	relative: {
		"+": function(checkSet, part){
			var isPartStr = typeof part === "string",
				isTag = isPartStr && !/\W/.test(part),
				isPartStrNotTag = isPartStr && !isTag;

			if ( isTag ) {
				part = part.toLowerCase();
			}

			for ( var i = 0, l = checkSet.length, elem; i < l; i++ ) {
				if ( (elem = checkSet[i]) ) {
					while ( (elem = elem.previousSibling) && elem.nodeType !== 1 ) {}

					checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ?
						elem || false :
						elem === part;
				}
			}

			if ( isPartStrNotTag ) {
				Sizzle.filter( part, checkSet, true );
			}
		},
		">": function(checkSet, part){
			var isPartStr = typeof part === "string";

			if ( isPartStr && !/\W/.test(part) ) {
				part = part.toLowerCase();

				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						var parent = elem.parentNode;
						checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
					}
				}
			} else {
				for ( var i = 0, l = checkSet.length; i < l; i++ ) {
					var elem = checkSet[i];
					if ( elem ) {
						checkSet[i] = isPartStr ?
							elem.parentNode :
							elem.parentNode === part;
					}
				}

				if ( isPartStr ) {
					Sizzle.filter( part, checkSet, true );
				}
			}
		},
		"": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
		},
		"~": function(checkSet, part, isXML){
			var doneName = done++, checkFn = dirCheck;

			if ( typeof part === "string" && !/\W/.test(part) ) {
				var nodeCheck = part = part.toLowerCase();
				checkFn = dirNodeCheck;
			}

			checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
		}
	},
	find: {
		ID: function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? [m] : [];
			}
		},
		NAME: function(match, context){
			if ( typeof context.getElementsByName !== "undefined" ) {
				var ret = [], results = context.getElementsByName(match[1]);

				for ( var i = 0, l = results.length; i < l; i++ ) {
					if ( results[i].getAttribute("name") === match[1] ) {
						ret.push( results[i] );
					}
				}

				return ret.length === 0 ? null : ret;
			}
		},
		TAG: function(match, context){
			return context.getElementsByTagName(match[1]);
		}
	},
	preFilter: {
		CLASS: function(match, curLoop, inplace, result, not, isXML){
			match = " " + match[1].replace(/\\/g, "") + " ";

			if ( isXML ) {
				return match;
			}

			for ( var i = 0, elem; (elem = curLoop[i]) != null; i++ ) {
				if ( elem ) {
					if ( not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n]/g, " ").indexOf(match) >= 0) ) {
						if ( !inplace ) {
							result.push( elem );
						}
					} else if ( inplace ) {
						curLoop[i] = false;
					}
				}
			}

			return false;
		},
		ID: function(match){
			return match[1].replace(/\\/g, "");
		},
		TAG: function(match, curLoop){
			return match[1].toLowerCase();
		},
		CHILD: function(match){
			if ( match[1] === "nth" ) {
				// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
				var test = /(-?)(\d*)n((?:\+|-)?\d*)/.exec(
					match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" ||
					!/\D/.test( match[2] ) && "0n+" + match[2] || match[2]);

				// calculate the numbers (first)n+(last) including if they are negative
				match[2] = (test[1] + (test[2] || 1)) - 0;
				match[3] = test[3] - 0;
			}

			// TODO: Move to normal caching system
			match[0] = done++;

			return match;
		},
		ATTR: function(match, curLoop, inplace, result, not, isXML){
			var name = match[1].replace(/\\/g, "");
			
			if ( !isXML && Expr.attrMap[name] ) {
				match[1] = Expr.attrMap[name];
			}

			if ( match[2] === "~=" ) {
				match[4] = " " + match[4] + " ";
			}

			return match;
		},
		PSEUDO: function(match, curLoop, inplace, result, not){
			if ( match[1] === "not" ) {
				// If we're dealing with a complex expression, or a simple one
				if ( ( chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3]) ) {
					match[3] = Sizzle(match[3], null, null, curLoop);
				} else {
					var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);
					if ( !inplace ) {
						result.push.apply( result, ret );
					}
					return false;
				}
			} else if ( Expr.match.POS.test( match[0] ) || Expr.match.CHILD.test( match[0] ) ) {
				return true;
			}
			
			return match;
		},
		POS: function(match){
			match.unshift( true );
			return match;
		}
	},
	filters: {
		enabled: function(elem){
			return elem.disabled === false && elem.type !== "hidden";
		},
		disabled: function(elem){
			return elem.disabled === true;
		},
		checked: function(elem){
			return elem.checked === true;
		},
		selected: function(elem){
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			elem.parentNode.selectedIndex;
			return elem.selected === true;
		},
		parent: function(elem){
			return !!elem.firstChild;
		},
		empty: function(elem){
			return !elem.firstChild;
		},
		has: function(elem, i, match){
			return !!Sizzle( match[3], elem ).length;
		},
		header: function(elem){
			return /h\d/i.test( elem.nodeName );
		},
		text: function(elem){
			return "text" === elem.type;
		},
		radio: function(elem){
			return "radio" === elem.type;
		},
		checkbox: function(elem){
			return "checkbox" === elem.type;
		},
		file: function(elem){
			return "file" === elem.type;
		},
		password: function(elem){
			return "password" === elem.type;
		},
		submit: function(elem){
			return "submit" === elem.type;
		},
		image: function(elem){
			return "image" === elem.type;
		},
		reset: function(elem){
			return "reset" === elem.type;
		},
		button: function(elem){
			return "button" === elem.type || elem.nodeName.toLowerCase() === "button";
		},
		input: function(elem){
			return /input|select|textarea|button/i.test(elem.nodeName);
		}
	},
	setFilters: {
		first: function(elem, i){
			return i === 0;
		},
		last: function(elem, i, match, array){
			return i === array.length - 1;
		},
		even: function(elem, i){
			return i % 2 === 0;
		},
		odd: function(elem, i){
			return i % 2 === 1;
		},
		lt: function(elem, i, match){
			return i < match[3] - 0;
		},
		gt: function(elem, i, match){
			return i > match[3] - 0;
		},
		nth: function(elem, i, match){
			return match[3] - 0 === i;
		},
		eq: function(elem, i, match){
			return match[3] - 0 === i;
		}
	},
	filter: {
		PSEUDO: function(elem, match, i, array){
			var name = match[1], filter = Expr.filters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			} else if ( name === "contains" ) {
				return (elem.textContent || elem.innerText || getText([ elem ]) || "").indexOf(match[3]) >= 0;
			} else if ( name === "not" ) {
				var not = match[3];

				for ( var i = 0, l = not.length; i < l; i++ ) {
					if ( not[i] === elem ) {
						return false;
					}
				}

				return true;
			} else {
				Sizzle.error( "Syntax error, unrecognized expression: " + name );
			}
		},
		CHILD: function(elem, match){
			var type = match[1], node = elem;
			switch (type) {
				case 'only':
				case 'first':
					while ( (node = node.previousSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					if ( type === "first" ) { 
						return true; 
					}
					node = elem;
				case 'last':
					while ( (node = node.nextSibling) )	 {
						if ( node.nodeType === 1 ) { 
							return false; 
						}
					}
					return true;
				case 'nth':
					var first = match[2], last = match[3];

					if ( first === 1 && last === 0 ) {
						return true;
					}
					
					var doneName = match[0],
						parent = elem.parentNode;
	
					if ( parent && (parent.sizcache !== doneName || !elem.nodeIndex) ) {
						var count = 0;
						for ( node = parent.firstChild; node; node = node.nextSibling ) {
							if ( node.nodeType === 1 ) {
								node.nodeIndex = ++count;
							}
						} 
						parent.sizcache = doneName;
					}
					
					var diff = elem.nodeIndex - last;
					if ( first === 0 ) {
						return diff === 0;
					} else {
						return ( diff % first === 0 && diff / first >= 0 );
					}
			}
		},
		ID: function(elem, match){
			return elem.nodeType === 1 && elem.getAttribute("id") === match;
		},
		TAG: function(elem, match){
			return (match === "*" && elem.nodeType === 1) || elem.nodeName.toLowerCase() === match;
		},
		CLASS: function(elem, match){
			return (" " + (elem.className || elem.getAttribute("class")) + " ")
				.indexOf( match ) > -1;
		},
		ATTR: function(elem, match){
			var name = match[1],
				result = Expr.attrHandle[ name ] ?
					Expr.attrHandle[ name ]( elem ) :
					elem[ name ] != null ?
						elem[ name ] :
						elem.getAttribute( name ),
				value = result + "",
				type = match[2],
				check = match[4];

			return result == null ?
				type === "!=" :
				type === "=" ?
				value === check :
				type === "*=" ?
				value.indexOf(check) >= 0 :
				type === "~=" ?
				(" " + value + " ").indexOf(check) >= 0 :
				!check ?
				value && result !== false :
				type === "!=" ?
				value !== check :
				type === "^=" ?
				value.indexOf(check) === 0 :
				type === "$=" ?
				value.substr(value.length - check.length) === check :
				type === "|=" ?
				value === check || value.substr(0, check.length + 1) === check + "-" :
				false;
		},
		POS: function(elem, match, i, array){
			var name = match[2], filter = Expr.setFilters[ name ];

			if ( filter ) {
				return filter( elem, i, match, array );
			}
		}
	}
};

var origPOS = Expr.match.POS;

for ( var type in Expr.match ) {
	Expr.match[ type ] = new RegExp( Expr.match[ type ].source + /(?![^\[]*\])(?![^\(]*\))/.source );
	Expr.leftMatch[ type ] = new RegExp( /(^(?:.|\r|\n)*?)/.source + Expr.match[ type ].source.replace(/\\(\d+)/g, function(all, num){
		return "\\" + (num - 0 + 1);
	}));
}

var makeArray = function(array, results) {
	array = Array.prototype.slice.call( array, 0 );

	if ( results ) {
		results.push.apply( results, array );
		return results;
	}
	
	return array;
};

// Perform a simple check to determine if the browser is capable of
// converting a NodeList to an array using builtin methods.
// Also verifies that the returned array holds DOM nodes
// (which is not the case in the Blackberry browser)
try {
	Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType;

// Provide a fallback method if it does not work
} catch(e){
	makeArray = function(array, results) {
		var ret = results || [];

		if ( toString.call(array) === "[object Array]" ) {
			Array.prototype.push.apply( ret, array );
		} else {
			if ( typeof array.length === "number" ) {
				for ( var i = 0, l = array.length; i < l; i++ ) {
					ret.push( array[i] );
				}
			} else {
				for ( var i = 0; array[i]; i++ ) {
					ret.push( array[i] );
				}
			}
		}

		return ret;
	};
}

var sortOrder;

if ( document.documentElement.compareDocumentPosition ) {
	sortOrder = function( a, b ) {
		if ( !a.compareDocumentPosition || !b.compareDocumentPosition ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.compareDocumentPosition ? -1 : 1;
		}

		var ret = a.compareDocumentPosition(b) & 4 ? -1 : a === b ? 0 : 1;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( "sourceIndex" in document.documentElement ) {
	sortOrder = function( a, b ) {
		if ( !a.sourceIndex || !b.sourceIndex ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.sourceIndex ? -1 : 1;
		}

		var ret = a.sourceIndex - b.sourceIndex;
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
} else if ( document.createRange ) {
	sortOrder = function( a, b ) {
		if ( !a.ownerDocument || !b.ownerDocument ) {
			if ( a == b ) {
				hasDuplicate = true;
			}
			return a.ownerDocument ? -1 : 1;
		}

		var aRange = a.ownerDocument.createRange(), bRange = b.ownerDocument.createRange();
		aRange.setStart(a, 0);
		aRange.setEnd(a, 0);
		bRange.setStart(b, 0);
		bRange.setEnd(b, 0);
		var ret = aRange.compareBoundaryPoints(Range.START_TO_END, bRange);
		if ( ret === 0 ) {
			hasDuplicate = true;
		}
		return ret;
	};
}

// Utility function for retreiving the text value of an array of DOM nodes
function getText( elems ) {
	var ret = "", elem;

	for ( var i = 0; elems[i]; i++ ) {
		elem = elems[i];

		// Get the text from text nodes and CDATA nodes
		if ( elem.nodeType === 3 || elem.nodeType === 4 ) {
			ret += elem.nodeValue;

		// Traverse everything else, except comment nodes
		} else if ( elem.nodeType !== 8 ) {
			ret += getText( elem.childNodes );
		}
	}

	return ret;
}

// Check to see if the browser returns elements by name when
// querying by getElementById (and provide a workaround)
(function(){
	// We're going to inject a fake input element with a specified name
	var form = document.createElement("div"),
		id = "script" + (new Date).getTime();
	form.innerHTML = "<a name='" + id + "'/>";

	// Inject it into the root element, check its status, and remove it quickly
	var root = document.documentElement;
	root.insertBefore( form, root.firstChild );

	// The workaround has to do additional checks after a getElementById
	// Which slows things down for other browsers (hence the branching)
	if ( document.getElementById( id ) ) {
		Expr.find.ID = function(match, context, isXML){
			if ( typeof context.getElementById !== "undefined" && !isXML ) {
				var m = context.getElementById(match[1]);
				return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
			}
		};

		Expr.filter.ID = function(elem, match){
			var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
			return elem.nodeType === 1 && node && node.nodeValue === match;
		};
	}

	root.removeChild( form );
	root = form = null; // release memory in IE
})();

(function(){
	// Check to see if the browser returns only elements
	// when doing getElementsByTagName("*")

	// Create a fake element
	var div = document.createElement("div");
	div.appendChild( document.createComment("") );

	// Make sure no comments are found
	if ( div.getElementsByTagName("*").length > 0 ) {
		Expr.find.TAG = function(match, context){
			var results = context.getElementsByTagName(match[1]);

			// Filter out possible comments
			if ( match[1] === "*" ) {
				var tmp = [];

				for ( var i = 0; results[i]; i++ ) {
					if ( results[i].nodeType === 1 ) {
						tmp.push( results[i] );
					}
				}

				results = tmp;
			}

			return results;
		};
	}

	// Check to see if an attribute returns normalized href attributes
	div.innerHTML = "<a href='#'></a>";
	if ( div.firstChild && typeof div.firstChild.getAttribute !== "undefined" &&
			div.firstChild.getAttribute("href") !== "#" ) {
		Expr.attrHandle.href = function(elem){
			return elem.getAttribute("href", 2);
		};
	}

	div = null; // release memory in IE
})();

if ( document.querySelectorAll ) {
	(function(){
		var oldSizzle = Sizzle, div = document.createElement("div");
		div.innerHTML = "<p class='TEST'></p>";

		// Safari can't handle uppercase or unicode characters when
		// in quirks mode.
		if ( div.querySelectorAll && div.querySelectorAll(".TEST").length === 0 ) {
			return;
		}
	
		Sizzle = function(query, context, extra, seed){
			context = context || document;

			// Only use querySelectorAll on non-XML documents
			// (ID selectors don't work in non-HTML documents)
			if ( !seed && context.nodeType === 9 && !isXML(context) ) {
				try {
					return makeArray( context.querySelectorAll(query), extra );
				} catch(e){}
			}
		
			return oldSizzle(query, context, extra, seed);
		};

		for ( var prop in oldSizzle ) {
			Sizzle[ prop ] = oldSizzle[ prop ];
		}

		div = null; // release memory in IE
	})();
}

(function(){
	var div = document.createElement("div");

	div.innerHTML = "<div class='test e'></div><div class='test'></div>";

	// Opera can't find a second classname (in 9.6)
	// Also, make sure that getElementsByClassName actually exists
	if ( !div.getElementsByClassName || div.getElementsByClassName("e").length === 0 ) {
		return;
	}

	// Safari caches class attributes, doesn't catch changes (in 3.2)
	div.lastChild.className = "e";

	if ( div.getElementsByClassName("e").length === 1 ) {
		return;
	}
	
	Expr.order.splice(1, 0, "CLASS");
	Expr.find.CLASS = function(match, context, isXML) {
		if ( typeof context.getElementsByClassName !== "undefined" && !isXML ) {
			return context.getElementsByClassName(match[1]);
		}
	};

	div = null; // release memory in IE
})();

function dirNodeCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 && !isXML ){
					elem.sizcache = doneName;
					elem.sizset = i;
				}

				if ( elem.nodeName.toLowerCase() === cur ) {
					match = elem;
					break;
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

function dirCheck( dir, cur, doneName, checkSet, nodeCheck, isXML ) {
	for ( var i = 0, l = checkSet.length; i < l; i++ ) {
		var elem = checkSet[i];
		if ( elem ) {
			elem = elem[dir];
			var match = false;

			while ( elem ) {
				if ( elem.sizcache === doneName ) {
					match = checkSet[elem.sizset];
					break;
				}

				if ( elem.nodeType === 1 ) {
					if ( !isXML ) {
						elem.sizcache = doneName;
						elem.sizset = i;
					}
					if ( typeof cur !== "string" ) {
						if ( elem === cur ) {
							match = true;
							break;
						}

					} else if ( Sizzle.filter( cur, [elem] ).length > 0 ) {
						match = elem;
						break;
					}
				}

				elem = elem[dir];
			}

			checkSet[i] = match;
		}
	}
}

var contains = document.compareDocumentPosition ? function(a, b){
	return !!(a.compareDocumentPosition(b) & 16);
} : function(a, b){
	return a !== b && (a.contains ? a.contains(b) : true);
};

var isXML = function(elem){
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833) 
	var documentElement = (elem ? elem.ownerDocument || elem : 0).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

var posProcess = function(selector, context){
	var tmpSet = [], later = "", match,
		root = context.nodeType ? [context] : context;

	// Position selectors must be done after the filter
	// And so must :not(positional) so we move all PSEUDOs to the end
	while ( (match = Expr.match.PSEUDO.exec( selector )) ) {
		later += match[0];
		selector = selector.replace( Expr.match.PSEUDO, "" );
	}

	selector = Expr.relative[selector] ? selector + "*" : selector;

	for ( var i = 0, l = root.length; i < l; i++ ) {
		Sizzle( selector, root[i], tmpSet );
	}

	return Sizzle.filter( later, tmpSet );
};

// EXPOSE
jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.filters;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = getText;
jQuery.isXMLDoc = isXML;
jQuery.contains = contains;

return;

window.Sizzle = Sizzle;

})();
var runtil = /Until$/,
	rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/,
	slice = Array.prototype.slice;

// Implement the identical functionality for filter and not
var winnow = function( elements, qualifier, keep ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep(elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) === keep;
		});

	} else if ( qualifier.nodeType ) {
		return jQuery.grep(elements, function( elem, i ) {
			return (elem === qualifier) === keep;
		});

	} else if ( typeof qualifier === "string" ) {
		var filtered = jQuery.grep(elements, function( elem ) {
			return elem.nodeType === 1;
		});

		if ( isSimple.test( qualifier ) ) {
			return jQuery.filter(qualifier, filtered, !keep);
		} else {
			qualifier = jQuery.filter( qualifier, filtered );
		}
	}

	return jQuery.grep(elements, function( elem, i ) {
		return (jQuery.inArray( elem, qualifier ) >= 0) === keep;
	});
};

jQuery.fn.extend({
	find: function( selector ) {
		var ret = this.pushStack( "", "find", selector ), length = 0;

		for ( var i = 0, l = this.length; i < l; i++ ) {
			length = ret.length;
			jQuery.find( selector, this[i], ret );

			if ( i > 0 ) {
				// Make sure that the results are unique
				for ( var n = length; n < ret.length; n++ ) {
					for ( var r = 0; r < length; r++ ) {
						if ( ret[r] === ret[n] ) {
							ret.splice(n--, 1);
							break;
						}
					}
				}
			}
		}

		return ret;
	},

	has: function( target ) {
		var targets = jQuery( target );
		return this.filter(function() {
			for ( var i = 0, l = targets.length; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	not: function( selector ) {
		return this.pushStack( winnow(this, selector, false), "not", selector);
	},

	filter: function( selector ) {
		return this.pushStack( winnow(this, selector, true), "filter", selector );
	},
	
	is: function( selector ) {
		return !!selector && jQuery.filter( selector, this ).length > 0;
	},

	closest: function( selectors, context ) {
		if ( jQuery.isArray( selectors ) ) {
			var ret = [], cur = this[0], match, matches = {}, selector;

			if ( cur && selectors.length ) {
				for ( var i = 0, l = selectors.length; i < l; i++ ) {
					selector = selectors[i];

					if ( !matches[selector] ) {
						matches[selector] = jQuery.expr.match.POS.test( selector ) ? 
							jQuery( selector, context || this.context ) :
							selector;
					}
				}

				while ( cur && cur.ownerDocument && cur !== context ) {
					for ( selector in matches ) {
						match = matches[selector];

						if ( match.jquery ? match.index(cur) > -1 : jQuery(cur).is(match) ) {
							ret.push({ selector: selector, elem: cur });
							delete matches[selector];
						}
					}
					cur = cur.parentNode;
				}
			}

			return ret;
		}

		var pos = jQuery.expr.match.POS.test( selectors ) ? 
			jQuery( selectors, context || this.context ) : null;

		return this.map(function( i, cur ) {
			while ( cur && cur.ownerDocument && cur !== context ) {
				if ( pos ? pos.index(cur) > -1 : jQuery(cur).is(selectors) ) {
					return cur;
				}
				cur = cur.parentNode;
			}
			return null;
		});
	},
	
	// Determine the position of an element within
	// the matched set of elements
	index: function( elem ) {
		if ( !elem || typeof elem === "string" ) {
			return jQuery.inArray( this[0],
				// If it receives a string, the selector is used
				// If it receives nothing, the siblings are used
				elem ? jQuery( elem ) : this.parent().children() );
		}
		// Locate the position of the desired element
		return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this );
	},

	add: function( selector, context ) {
		var set = typeof selector === "string" ?
				jQuery( selector, context || this.context ) :
				jQuery.makeArray( selector ),
			all = jQuery.merge( this.get(), set );

		return this.pushStack( isDisconnected( set[0] ) || isDisconnected( all[0] ) ?
			all :
			jQuery.unique( all ) );
	},

	andSelf: function() {
		return this.add( this.prevObject );
	}
});

// A painfully simple check to see if an element is disconnected
// from a document (should be improved, where feasible).
function isDisconnected( node ) {
	return !node || !node.parentNode || node.parentNode.nodeType === 11;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return jQuery.nth( elem, 2, "nextSibling" );
	},
	prev: function( elem ) {
		return jQuery.nth( elem, 2, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( elem.parentNode.firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return jQuery.nodeName( elem, "iframe" ) ?
			elem.contentDocument || elem.contentWindow.document :
			jQuery.makeArray( elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var ret = jQuery.map( this, fn, until );
		
		if ( !runtil.test( name ) ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			ret = jQuery.filter( selector, ret );
		}

		ret = this.length > 1 ? jQuery.unique( ret ) : ret;

		if ( (this.length > 1 || rmultiselector.test( selector )) && rparentsprev.test( name ) ) {
			ret = ret.reverse();
		}

		return this.pushStack( ret, name, slice.call(arguments).join(",") );
	};
});

jQuery.extend({
	filter: function( expr, elems, not ) {
		if ( not ) {
			expr = ":not(" + expr + ")";
		}

		return jQuery.find.matches(expr, elems);
	},
	
	dir: function( elem, dir, until ) {
		var matched = [], cur = elem[dir];
		while ( cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery( cur ).is( until )) ) {
			if ( cur.nodeType === 1 ) {
				matched.push( cur );
			}
			cur = cur[dir];
		}
		return matched;
	},

	nth: function( cur, result, dir, elem ) {
		result = result || 1;
		var num = 0;

		for ( ; cur; cur = cur[dir] ) {
			if ( cur.nodeType === 1 && ++num === result ) {
				break;
			}
		}

		return cur;
	},

	sibling: function( n, elem ) {
		var r = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				r.push( n );
			}
		}

		return r;
	}
});
var rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g,
	rleadingWhitespace = /^\s+/,
	rxhtmlTag = /(<([\w:]+)[^>]*?)\/>/g,
	rselfClosing = /^(?:area|br|col|embed|hr|img|input|link|meta|param)$/i,
	rtagName = /<([\w:]+)/,
	rtbody = /<tbody/i,
	rhtml = /<|&#?\w+;/,
	rnocache = /<script|<object|<embed|<option|<style/i,
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,  // checked="checked" or checked (html5)
	fcloseTag = function( all, front, tag ) {
		return rselfClosing.test( tag ) ?
			all :
			front + "></" + tag + ">";
	},
	wrapMap = {
		option: [ 1, "<select multiple='multiple'>", "</select>" ],
		legend: [ 1, "<fieldset>", "</fieldset>" ],
		thead: [ 1, "<table>", "</table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],
		col: [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ],
		area: [ 1, "<map>", "</map>" ],
		_default: [ 0, "", "" ]
	};

wrapMap.optgroup = wrapMap.option;
wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// IE can't serialize <link> and <script> tags normally
if ( !jQuery.support.htmlSerialize ) {
	wrapMap._default = [ 1, "div<div>", "</div>" ];
}

jQuery.fn.extend({
	text: function( text ) {
		if ( jQuery.isFunction(text) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				self.text( text.call(this, i, self.text()) );
			});
		}

		if ( typeof text !== "object" && text !== undefined ) {
			return this.empty().append( (this[0] && this[0].ownerDocument || document).createTextNode( text ) );
		}

		return jQuery.text( this );
	},

	wrapAll: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapAll( html.call(this, i) );
			});
		}

		if ( this[0] ) {
			// The elements to wrap the target around
			var wrap = jQuery( html, this[0].ownerDocument ).eq(0).clone(true);

			if ( this[0].parentNode ) {
				wrap.insertBefore( this[0] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstChild && elem.firstChild.nodeType === 1 ) {
					elem = elem.firstChild;
				}

				return elem;
			}).append(this);
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function(i) {
				jQuery(this).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ), contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		return this.each(function() {
			jQuery( this ).wrapAll( html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	},

	append: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip(arguments, true, function( elem ) {
			if ( this.nodeType === 1 ) {
				this.insertBefore( elem, this.firstChild );
			}
		});
	},

	before: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this );
			});
		} else if ( arguments.length ) {
			var set = jQuery(arguments[0]);
			set.push.apply( set, this.toArray() );
			return this.pushStack( set, "before", arguments );
		}
	},

	after: function() {
		if ( this[0] && this[0].parentNode ) {
			return this.domManip(arguments, false, function( elem ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			});
		} else if ( arguments.length ) {
			var set = this.pushStack( this, "after", arguments );
			set.push.apply( set, jQuery(arguments[0]).toArray() );
			return set;
		}
	},
	
	// keepData is for internal use only--do not document
	remove: function( selector, keepData ) {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			if ( !selector || jQuery.filter( selector, [ elem ] ).length ) {
				if ( !keepData && elem.nodeType === 1 ) {
					jQuery.cleanData( elem.getElementsByTagName("*") );
					jQuery.cleanData( [ elem ] );
				}

				if ( elem.parentNode ) {
					 elem.parentNode.removeChild( elem );
				}
			}
		}
		
		return this;
	},

	empty: function() {
		for ( var i = 0, elem; (elem = this[i]) != null; i++ ) {
			// Remove element nodes and prevent memory leaks
			if ( elem.nodeType === 1 ) {
				jQuery.cleanData( elem.getElementsByTagName("*") );
			}

			// Remove any remaining nodes
			while ( elem.firstChild ) {
				elem.removeChild( elem.firstChild );
			}
		}
		
		return this;
	},

	clone: function( events ) {
		// Do the clone
		var ret = this.map(function() {
			if ( !jQuery.support.noCloneEvent && !jQuery.isXMLDoc(this) ) {
				// IE copies events bound via attachEvent when
				// using cloneNode. Calling detachEvent on the
				// clone will also remove the events from the orignal
				// In order to get around this, we use innerHTML.
				// Unfortunately, this means some modifications to
				// attributes in IE that are actually only stored
				// as properties will not be copied (such as the
				// the name attribute on an input).
				var html = this.outerHTML, ownerDocument = this.ownerDocument;
				if ( !html ) {
					var div = ownerDocument.createElement("div");
					div.appendChild( this.cloneNode(true) );
					html = div.innerHTML;
				}

				return jQuery.clean([html.replace(rinlinejQuery, "")
					// Handle the case in IE 8 where action=/test/> self-closes a tag
					.replace(/=([^="'>\s]+\/)>/g, '="$1">')
					.replace(rleadingWhitespace, "")], ownerDocument)[0];
			} else {
				return this.cloneNode(true);
			}
		});

		// Copy the events from the original to the clone
		if ( events === true ) {
			cloneCopyEvent( this, ret );
			cloneCopyEvent( this.find("*"), ret.find("*") );
		}

		// Return the cloned set
		return ret;
	},

	html: function( value ) {
		if ( value === undefined ) {
			return this[0] && this[0].nodeType === 1 ?
				this[0].innerHTML.replace(rinlinejQuery, "") :
				null;

		// See if we can take a shortcut and just use innerHTML
		} else if ( typeof value === "string" && !rnocache.test( value ) &&
			(jQuery.support.leadingWhitespace || !rleadingWhitespace.test( value )) &&
			!wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase() ] ) {

			value = value.replace(rxhtmlTag, fcloseTag);

			try {
				for ( var i = 0, l = this.length; i < l; i++ ) {
					// Remove element nodes and prevent memory leaks
					if ( this[i].nodeType === 1 ) {
						jQuery.cleanData( this[i].getElementsByTagName("*") );
						this[i].innerHTML = value;
					}
				}

			// If using innerHTML throws an exception, use the fallback method
			} catch(e) {
				this.empty().append( value );
			}

		} else if ( jQuery.isFunction( value ) ) {
			this.each(function(i){
				var self = jQuery(this), old = self.html();
				self.empty().append(function(){
					return value.call( this, i, old );
				});
			});

		} else {
			this.empty().append( value );
		}

		return this;
	},

	replaceWith: function( value ) {
		if ( this[0] && this[0].parentNode ) {
			// Make sure that the elements are removed from the DOM before they are inserted
			// this can help fix replacing a parent with child elements
			if ( jQuery.isFunction( value ) ) {
				return this.each(function(i) {
					var self = jQuery(this), old = self.html();
					self.replaceWith( value.call( this, i, old ) );
				});
			}

			if ( typeof value !== "string" ) {
				value = jQuery(value).detach();
			}

			return this.each(function() {
				var next = this.nextSibling, parent = this.parentNode;

				jQuery(this).remove();

				if ( next ) {
					jQuery(next).before( value );
				} else {
					jQuery(parent).append( value );
				}
			});
		} else {
			return this.pushStack( jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value );
		}
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, table, callback ) {
		var results, first, value = args[0], scripts = [], fragment, parent;

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( !jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test( value ) ) {
			return this.each(function() {
				jQuery(this).domManip( args, table, callback, true );
			});
		}

		if ( jQuery.isFunction(value) ) {
			return this.each(function(i) {
				var self = jQuery(this);
				args[0] = value.call(this, i, table ? self.html() : undefined);
				self.domManip( args, table, callback );
			});
		}

		if ( this[0] ) {
			parent = value && value.parentNode;

			// If we're in a fragment, just use that instead of building a new one
			if ( jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length ) {
				results = { fragment: parent };

			} else {
				results = buildFragment( args, this, scripts );
			}
			
			fragment = results.fragment;
			
			if ( fragment.childNodes.length === 1 ) {
				first = fragment = fragment.firstChild;
			} else {
				first = fragment.firstChild;
			}

			if ( first ) {
				table = table && jQuery.nodeName( first, "tr" );

				for ( var i = 0, l = this.length; i < l; i++ ) {
					callback.call(
						table ?
							root(this[i], first) :
							this[i],
						i > 0 || results.cacheable || this.length > 1  ?
							fragment.cloneNode(true) :
							fragment
					);
				}
			}

			if ( scripts.length ) {
				jQuery.each( scripts, evalScript );
			}
		}

		return this;

		function root( elem, cur ) {
			return jQuery.nodeName(elem, "table") ?
				(elem.getElementsByTagName("tbody")[0] ||
				elem.appendChild(elem.ownerDocument.createElement("tbody"))) :
				elem;
		}
	}
});

function cloneCopyEvent(orig, ret) {
	var i = 0;

	ret.each(function() {
		if ( this.nodeName !== (orig[i] && orig[i].nodeName) ) {
			return;
		}

		var oldData = jQuery.data( orig[i++] ), curData = jQuery.data( this, oldData ), events = oldData && oldData.events;

		if ( events ) {
			delete curData.handle;
			curData.events = {};

			for ( var type in events ) {
				for ( var handler in events[ type ] ) {
					jQuery.event.add( this, type, events[ type ][ handler ], events[ type ][ handler ].data );
				}
			}
		}
	});
}

function buildFragment( args, nodes, scripts ) {
	var fragment, cacheable, cacheresults,
		doc = (nodes && nodes[0] ? nodes[0].ownerDocument || nodes[0] : document);

	// Only cache "small" (1/2 KB) strings that are associated with the main document
	// Cloning options loses the selected state, so don't cache them
	// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
	// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
	if ( args.length === 1 && typeof args[0] === "string" && args[0].length < 512 && doc === document &&
		!rnocache.test( args[0] ) && (jQuery.support.checkClone || !rchecked.test( args[0] )) ) {

		cacheable = true;
		cacheresults = jQuery.fragments[ args[0] ];
		if ( cacheresults ) {
			if ( cacheresults !== 1 ) {
				fragment = cacheresults;
			}
		}
	}

	if ( !fragment ) {
		fragment = doc.createDocumentFragment();
		jQuery.clean( args, doc, fragment, scripts );
	}

	if ( cacheable ) {
		jQuery.fragments[ args[0] ] = cacheresults ? fragment : 1;
	}

	return { fragment: fragment, cacheable: cacheable };
}

jQuery.fragments = {};

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var ret = [], insert = jQuery( selector ),
			parent = this.length === 1 && this[0].parentNode;
		
		if ( parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1 ) {
			insert[ original ]( this[0] );
			return this;
			
		} else {
			for ( var i = 0, l = insert.length; i < l; i++ ) {
				var elems = (i > 0 ? this.clone(true) : this).get();
				jQuery.fn[ original ].apply( jQuery(insert[i]), elems );
				ret = ret.concat( elems );
			}
		
			return this.pushStack( ret, name, insert.selector );
		}
	};
});

jQuery.extend({
	clean: function( elems, context, fragment, scripts ) {
		context = context || document;

		// !context.createElement fails in IE with an error but returns typeof 'object'
		if ( typeof context.createElement === "undefined" ) {
			context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
		}

		var ret = [];

		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			if ( typeof elem === "number" ) {
				elem += "";
			}

			if ( !elem ) {
				continue;
			}

			// Convert html string into DOM nodes
			if ( typeof elem === "string" && !rhtml.test( elem ) ) {
				elem = context.createTextNode( elem );

			} else if ( typeof elem === "string" ) {
				// Fix "XHTML"-style tags in all browsers
				elem = elem.replace(rxhtmlTag, fcloseTag);

				// Trim whitespace, otherwise indexOf won't work as expected
				var tag = (rtagName.exec( elem ) || ["", ""])[1].toLowerCase(),
					wrap = wrapMap[ tag ] || wrapMap._default,
					depth = wrap[0],
					div = context.createElement("div");

				// Go to html and back, then peel off extra wrappers
				div.innerHTML = wrap[1] + elem + wrap[2];

				// Move to the right depth
				while ( depth-- ) {
					div = div.lastChild;
				}

				// Remove IE's autoinserted <tbody> from table fragments
				if ( !jQuery.support.tbody ) {

					// String was a <table>, *may* have spurious <tbody>
					var hasBody = rtbody.test(elem),
						tbody = tag === "table" && !hasBody ?
							div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ?
								div.childNodes :
								[];

					for ( var j = tbody.length - 1; j >= 0 ; --j ) {
						if ( jQuery.nodeName( tbody[ j ], "tbody" ) && !tbody[ j ].childNodes.length ) {
							tbody[ j ].parentNode.removeChild( tbody[ j ] );
						}
					}

				}

				// IE completely kills leading whitespace when innerHTML is used
				if ( !jQuery.support.leadingWhitespace && rleadingWhitespace.test( elem ) ) {
					div.insertBefore( context.createTextNode( rleadingWhitespace.exec(elem)[0] ), div.firstChild );
				}

				elem = div.childNodes;
			}

			if ( elem.nodeType ) {
				ret.push( elem );
			} else {
				ret = jQuery.merge( ret, elem );
			}
		}

		if ( fragment ) {
			for ( var i = 0; ret[i]; i++ ) {
				if ( scripts && jQuery.nodeName( ret[i], "script" ) && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript") ) {
					scripts.push( ret[i].parentNode ? ret[i].parentNode.removeChild( ret[i] ) : ret[i] );
				
				} else {
					if ( ret[i].nodeType === 1 ) {
						ret.splice.apply( ret, [i + 1, 0].concat(jQuery.makeArray(ret[i].getElementsByTagName("script"))) );
					}
					fragment.appendChild( ret[i] );
				}
			}
		}

		return ret;
	},
	
	cleanData: function( elems ) {
		var data, id, cache = jQuery.cache,
			special = jQuery.event.special,
			deleteExpando = jQuery.support.deleteExpando;
		
		for ( var i = 0, elem; (elem = elems[i]) != null; i++ ) {
			id = elem[ jQuery.expando ];
			
			if ( id ) {
				data = cache[ id ];
				
				if ( data.events ) {
					for ( var type in data.events ) {
						if ( special[ type ] ) {
							jQuery.event.remove( elem, type );

						} else {
							removeEvent( elem, type, data.handle );
						}
					}
				}
				
				if ( deleteExpando ) {
					delete elem[ jQuery.expando ];

				} else if ( elem.removeAttribute ) {
					elem.removeAttribute( jQuery.expando );
				}
				
				delete cache[ id ];
			}
		}
	}
});
// exclude the following css properties to add px
var rexclude = /z-?index|font-?weight|opacity|zoom|line-?height/i,
	ralpha = /alpha\([^)]*\)/,
	ropacity = /opacity=([^)]*)/,
	rfloat = /float/i,
	rdashAlpha = /-([a-z])/ig,
	rupper = /([A-Z])/g,
	rnumpx = /^-?\d+(?:px)?$/i,
	rnum = /^-?\d/,

	cssShow = { position: "absolute", visibility: "hidden", display:"block" },
	cssWidth = [ "Left", "Right" ],
	cssHeight = [ "Top", "Bottom" ],

	// cache check for defaultView.getComputedStyle
	getComputedStyle = document.defaultView && document.defaultView.getComputedStyle,
	// normalize float css property
	styleFloat = jQuery.support.cssFloat ? "cssFloat" : "styleFloat",
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn.css = function( name, value ) {
	return access( this, name, value, true, function( elem, name, value ) {
		if ( value === undefined ) {
			return jQuery.curCSS( elem, name );
		}
		
		if ( typeof value === "number" && !rexclude.test(name) ) {
			value += "px";
		}

		jQuery.style( elem, name, value );
	});
};

jQuery.extend({
	style: function( elem, name, value ) {
		// don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 ) {
			return undefined;
		}

		// ignore negative width and height values #1599
		if ( (name === "width" || name === "height") && parseFloat(value) < 0 ) {
			value = undefined;
		}

		var style = elem.style || elem, set = value !== undefined;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" ) {
			if ( set ) {
				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// Set the alpha filter to set the opacity
				var opacity = parseInt( value, 10 ) + "" === "NaN" ? "" : "alpha(opacity=" + value * 100 + ")";
				var filter = style.filter || jQuery.curCSS( elem, "filter" ) || "";
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : opacity;
			}

			return style.filter && style.filter.indexOf("opacity=") >= 0 ?
				(parseFloat( ropacity.exec(style.filter)[1] ) / 100) + "":
				"";
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		name = name.replace(rdashAlpha, fcamelCase);

		if ( set ) {
			style[ name ] = value;
		}

		return style[ name ];
	},

	css: function( elem, name, force, extra ) {
		if ( name === "width" || name === "height" ) {
			var val, props = cssShow, which = name === "width" ? cssWidth : cssHeight;

			function getWH() {
				val = name === "width" ? elem.offsetWidth : elem.offsetHeight;

				if ( extra === "border" ) {
					return;
				}

				jQuery.each( which, function() {
					if ( !extra ) {
						val -= parseFloat(jQuery.curCSS( elem, "padding" + this, true)) || 0;
					}

					if ( extra === "margin" ) {
						val += parseFloat(jQuery.curCSS( elem, "margin" + this, true)) || 0;
					} else {
						val -= parseFloat(jQuery.curCSS( elem, "border" + this + "Width", true)) || 0;
					}
				});
			}

			if ( elem.offsetWidth !== 0 ) {
				getWH();
			} else {
				jQuery.swap( elem, props, getWH );
			}

			return Math.max(0, Math.round(val));
		}

		return jQuery.curCSS( elem, name, force );
	},

	curCSS: function( elem, name, force ) {
		var ret, style = elem.style, filter;

		// IE uses filters for opacity
		if ( !jQuery.support.opacity && name === "opacity" && elem.currentStyle ) {
			ret = ropacity.test(elem.currentStyle.filter || "") ?
				(parseFloat(RegExp.$1) / 100) + "" :
				"";

			return ret === "" ?
				"1" :
				ret;
		}

		// Make sure we're using the right name for getting the float value
		if ( rfloat.test( name ) ) {
			name = styleFloat;
		}

		if ( !force && style && style[ name ] ) {
			ret = style[ name ];

		} else if ( getComputedStyle ) {

			// Only "float" is needed here
			if ( rfloat.test( name ) ) {
				name = "float";
			}

			name = name.replace( rupper, "-$1" ).toLowerCase();

			var defaultView = elem.ownerDocument.defaultView;

			if ( !defaultView ) {
				return null;
			}

			var computedStyle = defaultView.getComputedStyle( elem, null );

			if ( computedStyle ) {
				ret = computedStyle.getPropertyValue( name );
			}

			// We should always get a number back from opacity
			if ( name === "opacity" && ret === "" ) {
				ret = "1";
			}

		} else if ( elem.currentStyle ) {
			var camelCase = name.replace(rdashAlpha, fcamelCase);

			ret = elem.currentStyle[ name ] || elem.currentStyle[ camelCase ];

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if ( !rnumpx.test( ret ) && rnum.test( ret ) ) {
				// Remember the original values
				var left = style.left, rsLeft = elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				elem.runtimeStyle.left = elem.currentStyle.left;
				style.left = camelCase === "fontSize" ? "1em" : (ret || 0);
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				elem.runtimeStyle.left = rsLeft;
			}
		}

		return ret;
	},

	// A method for quickly swapping in/out CSS properties to get correct calculations
	swap: function( elem, options, callback ) {
		var old = {};

		// Remember the old values, and insert the new ones
		for ( var name in options ) {
			old[ name ] = elem.style[ name ];
			elem.style[ name ] = options[ name ];
		}

		callback.call( elem );

		// Revert the old values
		for ( var name in options ) {
			elem.style[ name ] = old[ name ];
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.hidden = function( elem ) {
		var width = elem.offsetWidth, height = elem.offsetHeight,
			skip = elem.nodeName.toLowerCase() === "tr";

		return width === 0 && height === 0 && !skip ?
			true :
			width > 0 && height > 0 && !skip ?
				false :
				jQuery.curCSS(elem, "display") === "none";
	};

	jQuery.expr.filters.visible = function( elem ) {
		return !jQuery.expr.filters.hidden( elem );
	};
}
var jsc = now(),
	rscript = /<script(.|\s)*?\/script>/gi,
	rselectTextarea = /select|textarea/i,
	rinput = /color|date|datetime|email|hidden|month|number|password|range|search|tel|text|time|url|week/i,
	jsre = /=\?(&|$)/,
	rquery = /\?/,
	rts = /(\?|&)_=.*?(&|$)/,
	rurl = /^(\w+:)?\/\/([^\/?#]+)/,
	r20 = /%20/g,

	// Keep a copy of the old load method
	_load = jQuery.fn.load;

jQuery.fn.extend({
	load: function( url, params, callback ) {
		if ( typeof url !== "string" ) {
			return _load.call( this, url );

		// Don't do a request if no elements are being requested
		} else if ( !this.length ) {
			return this;
		}

		var off = url.indexOf(" ");
		if ( off >= 0 ) {
			var selector = url.slice(off, url.length);
			url = url.slice(0, off);
		}

		// Default to a GET request
		var type = "GET";

		// If the second parameter was provided
		if ( params ) {
			// If it's a function
			if ( jQuery.isFunction( params ) ) {
				// We assume that it's the callback
				callback = params;
				params = null;

			// Otherwise, build a param string
			} else if ( typeof params === "object" ) {
				params = jQuery.param( params, jQuery.ajaxSettings.traditional );
				type = "POST";
			}
		}

		var self = this;

		// Request the remote document
		jQuery.ajax({
			url: url,
			type: type,
			dataType: "html",
			data: params,
			complete: function( res, status ) {
				// If successful, inject the HTML into all the matched elements
				if ( status === "success" || status === "notmodified" ) {
					// See if a selector was specified
					self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div />")
							// inject the contents of the document in, removing the scripts
							// to avoid any 'Permission Denied' errors in IE
							.append(res.responseText.replace(rscript, ""))

							// Locate the specified elements
							.find(selector) :

						// If not, just inject the full result
						res.responseText );
				}

				if ( callback ) {
					self.each( callback, [res.responseText, status, res] );
				}
			}
		});

		return this;
	},

	serialize: function() {
		return jQuery.param(this.serializeArray());
	},
	serializeArray: function() {
		return this.map(function() {
			return this.elements ? jQuery.makeArray(this.elements) : this;
		})
		.filter(function() {
			return this.name && !this.disabled &&
				(this.checked || rselectTextarea.test(this.nodeName) ||
					rinput.test(this.type));
		})
		.map(function( i, elem ) {
			var val = jQuery(this).val();

			return val == null ?
				null :
				jQuery.isArray(val) ?
					jQuery.map( val, function( val, i ) {
						return { name: elem.name, value: val };
					}) :
					{ name: elem.name, value: val };
		}).get();
	}
});

// Attach a bunch of functions for handling common AJAX events
jQuery.each( "ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function( i, o ) {
	jQuery.fn[o] = function( f ) {
		return this.bind(o, f);
	};
});

jQuery.extend({

	get: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = null;
		}

		return jQuery.ajax({
			type: "GET",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	getScript: function( url, callback ) {
		return jQuery.get(url, null, callback, "script");
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get(url, data, callback, "json");
	},

	post: function( url, data, callback, type ) {
		// shift arguments if data argument was omited
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = {};
		}

		return jQuery.ajax({
			type: "POST",
			url: url,
			data: data,
			success: callback,
			dataType: type
		});
	},

	ajaxSetup: function( settings ) {
		jQuery.extend( jQuery.ajaxSettings, settings );
	},

	ajaxSettings: {
		url: location.href,
		global: true,
		type: "GET",
		contentType: "application/x-www-form-urlencoded",
		processData: true,
		async: true,
		/*
		timeout: 0,
		data: null,
		username: null,
		password: null,
		traditional: false,
		*/
		// Create the request object; Microsoft failed to properly
		// implement the XMLHttpRequest in IE7 (can't request local files),
		// so we use the ActiveXObject when it is available
		// This function can be overriden by calling jQuery.ajaxSetup
		xhr: window.XMLHttpRequest && (window.location.protocol !== "file:" || !window.ActiveXObject) ?
			function() {
				return new window.XMLHttpRequest();
			} :
			function() {
				try {
					return new window.ActiveXObject("Microsoft.XMLHTTP");
				} catch(e) {}
			},
		accepts: {
			xml: "application/xml, text/xml",
			html: "text/html",
			script: "text/javascript, application/javascript",
			json: "application/json, text/javascript",
			text: "text/plain",
			_default: "*/*"
		}
	},

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajax: function( origSettings ) {
		var s = jQuery.extend(true, {}, jQuery.ajaxSettings, origSettings);
		
		var jsonp, status, data,
			callbackContext = origSettings && origSettings.context || s,
			type = s.type.toUpperCase();

		// convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Handle JSONP Parameter Callbacks
		if ( s.dataType === "jsonp" ) {
			if ( type === "GET" ) {
				if ( !jsre.test( s.url ) ) {
					s.url += (rquery.test( s.url ) ? "&" : "?") + (s.jsonp || "callback") + "=?";
				}
			} else if ( !s.data || !jsre.test(s.data) ) {
				s.data = (s.data ? s.data + "&" : "") + (s.jsonp || "callback") + "=?";
			}
			s.dataType = "json";
		}

		// Build temporary JSONP function
		if ( s.dataType === "json" && (s.data && jsre.test(s.data) || jsre.test(s.url)) ) {
			jsonp = s.jsonpCallback || ("jsonp" + jsc++);

			// Replace the =? sequence both in the query string and the data
			if ( s.data ) {
				s.data = (s.data + "").replace(jsre, "=" + jsonp + "$1");
			}

			s.url = s.url.replace(jsre, "=" + jsonp + "$1");

			// We need to make sure
			// that a JSONP style response is executed properly
			s.dataType = "script";

			// Handle JSONP-style loading
			window[ jsonp ] = window[ jsonp ] || function( tmp ) {
				data = tmp;
				success();
				complete();
				// Garbage collect
				window[ jsonp ] = undefined;

				try {
					delete window[ jsonp ];
				} catch(e) {}

				if ( head ) {
					head.removeChild( script );
				}
			};
		}

		if ( s.dataType === "script" && s.cache === null ) {
			s.cache = false;
		}

		if ( s.cache === false && type === "GET" ) {
			var ts = now();

			// try replacing _= if it is there
			var ret = s.url.replace(rts, "$1_=" + ts + "$2");

			// if nothing was replaced, add timestamp to the end
			s.url = ret + ((ret === s.url) ? (rquery.test(s.url) ? "&" : "?") + "_=" + ts : "");
		}

		// If data is available, append data to url for get requests
		if ( s.data && type === "GET" ) {
			s.url += (rquery.test(s.url) ? "&" : "?") + s.data;
		}

		// Watch for a new set of requests
		if ( s.global && ! jQuery.active++ ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Matches an absolute URL, and saves the domain
		var parts = rurl.exec( s.url ),
			remote = parts && (parts[1] && parts[1] !== location.protocol || parts[2] !== location.host);

		// If we're requesting a remote document
		// and trying to load JSON or Script with a GET
		if ( s.dataType === "script" && type === "GET" && remote ) {
			var head = document.getElementsByTagName("head")[0] || document.documentElement;
			var script = document.createElement("script");
			script.src = s.url;
			if ( s.scriptCharset ) {
				script.charset = s.scriptCharset;
			}

			// Handle Script loading
			if ( !jsonp ) {
				var done = false;

				// Attach handlers for all browsers
				script.onload = script.onreadystatechange = function() {
					if ( !done && (!this.readyState ||
							this.readyState === "loaded" || this.readyState === "complete") ) {
						done = true;
						success();
						complete();

						// Handle memory leak in IE
						script.onload = script.onreadystatechange = null;
						if ( head && script.parentNode ) {
							head.removeChild( script );
						}
					}
				};
			}

			// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
			// This arises when a base node is used (#2709 and #4378).
			head.insertBefore( script, head.firstChild );

			// We handle everything using the script element injection
			return undefined;
		}

		var requestDone = false;

		// Create the request object
		var xhr = s.xhr();

		if ( !xhr ) {
			return;
		}

		// Open the socket
		// Passing null username, generates a login popup on Opera (#2865)
		if ( s.username ) {
			xhr.open(type, s.url, s.async, s.username, s.password);
		} else {
			xhr.open(type, s.url, s.async);
		}

		// Need an extra try/catch for cross domain requests in Firefox 3
		try {
			// Set the correct header, if data is being sent
			if ( s.data || origSettings && origSettings.contentType ) {
				xhr.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if ( s.ifModified ) {
				if ( jQuery.lastModified[s.url] ) {
					xhr.setRequestHeader("If-Modified-Since", jQuery.lastModified[s.url]);
				}

				if ( jQuery.etag[s.url] ) {
					xhr.setRequestHeader("If-None-Match", jQuery.etag[s.url]);
				}
			}

			// Set header so the called script knows that it's an XMLHttpRequest
			// Only send the header if it's not a remote XHR
			if ( !remote ) {
				xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
			}

			// Set the Accepts header for the server, depending on the dataType
			xhr.setRequestHeader("Accept", s.dataType && s.accepts[ s.dataType ] ?
				s.accepts[ s.dataType ] + ", */*" :
				s.accepts._default );
		} catch(e) {}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && s.beforeSend.call(callbackContext, xhr, s) === false ) {
			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}

			// close opended socket
			xhr.abort();
			return false;
		}

		if ( s.global ) {
			trigger("ajaxSend", [xhr, s]);
		}

		// Wait for a response to come back
		var onreadystatechange = xhr.onreadystatechange = function( isTimeout ) {
			// The request was aborted
			if ( !xhr || xhr.readyState === 0 || isTimeout === "abort" ) {
				// Opera doesn't call onreadystatechange before this point
				// so we simulate the call
				if ( !requestDone ) {
					complete();
				}

				requestDone = true;
				if ( xhr ) {
					xhr.onreadystatechange = jQuery.noop;
				}

			// The transfer is complete and the data is available, or the request timed out
			} else if ( !requestDone && xhr && (xhr.readyState === 4 || isTimeout === "timeout") ) {
				requestDone = true;
				xhr.onreadystatechange = jQuery.noop;

				status = isTimeout === "timeout" ?
					"timeout" :
					!jQuery.httpSuccess( xhr ) ?
						"error" :
						s.ifModified && jQuery.httpNotModified( xhr, s.url ) ?
							"notmodified" :
							"success";

				var errMsg;

				if ( status === "success" ) {
					// Watch for, and catch, XML document parse errors
					try {
						// process the data (runs the xml through httpData regardless of callback)
						data = jQuery.httpData( xhr, s.dataType, s );
					} catch(err) {
						status = "parsererror";
						errMsg = err;
					}
				}

				// Make sure that the request was successful or notmodified
				if ( status === "success" || status === "notmodified" ) {
					// JSONP handles its own success callback
					if ( !jsonp ) {
						success();
					}
				} else {
					jQuery.handleError(s, xhr, status, errMsg);
				}

				// Fire the complete handlers
				complete();

				if ( isTimeout === "timeout" ) {
					xhr.abort();
				}

				// Stop memory leaks
				if ( s.async ) {
					xhr = null;
				}
			}
		};

		// Override the abort handler, if we can (IE doesn't allow it, but that's OK)
		// Opera doesn't fire onreadystatechange at all on abort
		try {
			var oldAbort = xhr.abort;
			xhr.abort = function() {
				if ( xhr ) {
					oldAbort.call( xhr );
				}

				onreadystatechange( "abort" );
			};
		} catch(e) { }

		// Timeout checker
		if ( s.async && s.timeout > 0 ) {
			setTimeout(function() {
				// Check to see if the request is still happening
				if ( xhr && !requestDone ) {
					onreadystatechange( "timeout" );
				}
			}, s.timeout);
		}

		// Send the data
		try {
			xhr.send( type === "POST" || type === "PUT" || type === "DELETE" ? s.data : null );
		} catch(e) {
			jQuery.handleError(s, xhr, null, e);
			// Fire the complete handlers
			complete();
		}

		// firefox 1.5 doesn't fire statechange for sync requests
		if ( !s.async ) {
			onreadystatechange();
		}

		function success() {
			// If a local callback was specified, fire it and pass it the data
			if ( s.success ) {
				s.success.call( callbackContext, data, status, xhr );
			}

			// Fire the global callback
			if ( s.global ) {
				trigger( "ajaxSuccess", [xhr, s] );
			}
		}

		function complete() {
			// Process result
			if ( s.complete ) {
				s.complete.call( callbackContext, xhr, status);
			}

			// The request was completed
			if ( s.global ) {
				trigger( "ajaxComplete", [xhr, s] );
			}

			// Handle the global AJAX counter
			if ( s.global && ! --jQuery.active ) {
				jQuery.event.trigger( "ajaxStop" );
			}
		}
		
		function trigger(type, args) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger(type, args);
		}

		// return XMLHttpRequest to allow aborting the request etc.
		return xhr;
	},

	handleError: function( s, xhr, status, e ) {
		// If a local callback was specified, fire it
		if ( s.error ) {
			s.error.call( s.context || s, xhr, status, e );
		}

		// Fire the global callback
		if ( s.global ) {
			(s.context ? jQuery(s.context) : jQuery.event).trigger( "ajaxError", [xhr, s, e] );
		}
	},

	// Counter for holding the number of active queries
	active: 0,

	// Determines if an XMLHttpRequest was successful or not
	httpSuccess: function( xhr ) {
		try {
			// IE error sometimes returns 1223 when it should be 204 so treat it as success, see #1450
			return !xhr.status && location.protocol === "file:" ||
				// Opera returns 0 when status is 304
				( xhr.status >= 200 && xhr.status < 300 ) ||
				xhr.status === 304 || xhr.status === 1223 || xhr.status === 0;
		} catch(e) {}

		return false;
	},

	// Determines if an XMLHttpRequest returns NotModified
	httpNotModified: function( xhr, url ) {
		var lastModified = xhr.getResponseHeader("Last-Modified"),
			etag = xhr.getResponseHeader("Etag");

		if ( lastModified ) {
			jQuery.lastModified[url] = lastModified;
		}

		if ( etag ) {
			jQuery.etag[url] = etag;
		}

		// Opera returns 0 when status is 304
		return xhr.status === 304 || xhr.status === 0;
	},

	httpData: function( xhr, type, s ) {
		var ct = xhr.getResponseHeader("content-type") || "",
			xml = type === "xml" || !type && ct.indexOf("xml") >= 0,
			data = xml ? xhr.responseXML : xhr.responseText;

		if ( xml && data.documentElement.nodeName === "parsererror" ) {
			jQuery.error( "parsererror" );
		}

		// Allow a pre-filtering function to sanitize the response
		// s is checked to keep backwards compatibility
		if ( s && s.dataFilter ) {
			data = s.dataFilter( data, type );
		}

		// The filter can actually parse the response
		if ( typeof data === "string" ) {
			// Get the JavaScript object, if JSON is used.
			if ( type === "json" || !type && ct.indexOf("json") >= 0 ) {
				data = jQuery.parseJSON( data );

			// If the type is "script", eval it in global context
			} else if ( type === "script" || !type && ct.indexOf("javascript") >= 0 ) {
				jQuery.globalEval( data );
			}
		}

		return data;
	},

	// Serialize an array of form elements or a set of
	// key/values into a query string
	param: function( a, traditional ) {
		var s = [];
		
		// Set traditional to true for jQuery <= 1.3.2 behavior.
		if ( traditional === undefined ) {
			traditional = jQuery.ajaxSettings.traditional;
		}
		
		// If an array was passed in, assume that it is an array of form elements.
		if ( jQuery.isArray(a) || a.jquery ) {
			// Serialize the form elements
			jQuery.each( a, function() {
				add( this.name, this.value );
			});
			
		} else {
			// If traditional, encode the "old" way (the way 1.3.2 or older
			// did it), otherwise encode params recursively.
			for ( var prefix in a ) {
				buildParams( prefix, a[prefix] );
			}
		}

		// Return the resulting serialization
		return s.join("&").replace(r20, "+");

		function buildParams( prefix, obj ) {
			if ( jQuery.isArray(obj) ) {
				// Serialize array item.
				jQuery.each( obj, function( i, v ) {
					if ( traditional || /\[\]$/.test( prefix ) ) {
						// Treat each array item as a scalar.
						add( prefix, v );
					} else {
						// If array item is non-scalar (array or object), encode its
						// numeric index to resolve deserialization ambiguity issues.
						// Note that rack (as of 1.0.0) can't currently deserialize
						// nested arrays properly, and attempting to do so may cause
						// a server error. Possible fixes are to modify rack's
						// deserialization algorithm or to provide an option or flag
						// to force array serialization to be shallow.
						buildParams( prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v );
					}
				});
					
			} else if ( !traditional && obj != null && typeof obj === "object" ) {
				// Serialize object item.
				jQuery.each( obj, function( k, v ) {
					buildParams( prefix + "[" + k + "]", v );
				});
					
			} else {
				// Serialize scalar item.
				add( prefix, obj );
			}
		}

		function add( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction(value) ? value() : value;
			s[ s.length ] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
		}
	}
});
var elemdisplay = {},
	rfxtypes = /toggle|show|hide/,
	rfxnum = /^([+-]=)?([\d+-.]+)(.*)$/,
	timerId,
	fxAttrs = [
		// height animations
		[ "height", "marginTop", "marginBottom", "paddingTop", "paddingBottom" ],
		// width animations
		[ "width", "marginLeft", "marginRight", "paddingLeft", "paddingRight" ],
		// opacity animations
		[ "opacity" ]
	];

jQuery.fn.extend({
	show: function( speed, callback ) {
		if ( speed || speed === 0) {
			return this.animate( genFx("show", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");

				this[i].style.display = old || "";

				if ( jQuery.css(this[i], "display") === "none" ) {
					var nodeName = this[i].nodeName, display;

					if ( elemdisplay[ nodeName ] ) {
						display = elemdisplay[ nodeName ];

					} else {
						var elem = jQuery("<" + nodeName + " />").appendTo("body");

						display = elem.css("display");

						if ( display === "none" ) {
							display = "block";
						}

						elem.remove();

						elemdisplay[ nodeName ] = display;
					}

					jQuery.data(this[i], "olddisplay", display);
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = jQuery.data(this[j], "olddisplay") || "";
			}

			return this;
		}
	},

	hide: function( speed, callback ) {
		if ( speed || speed === 0 ) {
			return this.animate( genFx("hide", 3), speed, callback);

		} else {
			for ( var i = 0, l = this.length; i < l; i++ ) {
				var old = jQuery.data(this[i], "olddisplay");
				if ( !old && old !== "none" ) {
					jQuery.data(this[i], "olddisplay", jQuery.css(this[i], "display"));
				}
			}

			// Set the display of the elements in a second loop
			// to avoid the constant reflow
			for ( var j = 0, k = this.length; j < k; j++ ) {
				this[j].style.display = "none";
			}

			return this;
		}
	},

	// Save the old toggle function
	_toggle: jQuery.fn.toggle,

	toggle: function( fn, fn2 ) {
		var bool = typeof fn === "boolean";

		if ( jQuery.isFunction(fn) && jQuery.isFunction(fn2) ) {
			this._toggle.apply( this, arguments );

		} else if ( fn == null || bool ) {
			this.each(function() {
				var state = bool ? fn : jQuery(this).is(":hidden");
				jQuery(this)[ state ? "show" : "hide" ]();
			});

		} else {
			this.animate(genFx("toggle", 3), fn, fn2);
		}

		return this;
	},

	fadeTo: function( speed, to, callback ) {
		return this.filter(":hidden").css("opacity", 0).show().end()
					.animate({opacity: to}, speed, callback);
	},

	animate: function( prop, speed, easing, callback ) {
		var optall = jQuery.speed(speed, easing, callback);

		if ( jQuery.isEmptyObject( prop ) ) {
			return this.each( optall.complete );
		}

		return this[ optall.queue === false ? "each" : "queue" ](function() {
			var opt = jQuery.extend({}, optall), p,
				hidden = this.nodeType === 1 && jQuery(this).is(":hidden"),
				self = this;

			for ( p in prop ) {
				var name = p.replace(rdashAlpha, fcamelCase);

				if ( p !== name ) {
					prop[ name ] = prop[ p ];
					delete prop[ p ];
					p = name;
				}

				if ( prop[p] === "hide" && hidden || prop[p] === "show" && !hidden ) {
					return opt.complete.call(this);
				}

				if ( ( p === "height" || p === "width" ) && this.style ) {
					// Store display property
					opt.display = jQuery.css(this, "display");

					// Make sure that nothing sneaks out
					opt.overflow = this.style.overflow;
				}

				if ( jQuery.isArray( prop[p] ) ) {
					// Create (if needed) and add to specialEasing
					(opt.specialEasing = opt.specialEasing || {})[p] = prop[p][1];
					prop[p] = prop[p][0];
				}
			}

			if ( opt.overflow != null ) {
				this.style.overflow = "hidden";
			}

			opt.curAnim = jQuery.extend({}, prop);

			jQuery.each( prop, function( name, val ) {
				var e = new jQuery.fx( self, opt, name );

				if ( rfxtypes.test(val) ) {
					e[ val === "toggle" ? hidden ? "show" : "hide" : val ]( prop );

				} else {
					var parts = rfxnum.exec(val),
						start = e.cur(true) || 0;

					if ( parts ) {
						var end = parseFloat( parts[2] ),
							unit = parts[3] || "px";

						// We need to compute starting value
						if ( unit !== "px" ) {
							self.style[ name ] = (end || 1) + unit;
							start = ((end || 1) / e.cur(true)) * start;
							self.style[ name ] = start + unit;
						}

						// If a +=/-= token was provided, we're doing a relative animation
						if ( parts[1] ) {
							end = ((parts[1] === "-=" ? -1 : 1) * end) + start;
						}

						e.custom( start, end, unit );

					} else {
						e.custom( start, val, "" );
					}
				}
			});

			// For JS strict compliance
			return true;
		});
	},

	stop: function( clearQueue, gotoEnd ) {
		var timers = jQuery.timers;

		if ( clearQueue ) {
			this.queue([]);
		}

		this.each(function() {
			// go in reverse order so anything added to the queue during the loop is ignored
			for ( var i = timers.length - 1; i >= 0; i-- ) {
				if ( timers[i].elem === this ) {
					if (gotoEnd) {
						// force the next step to be the last
						timers[i](true);
					}

					timers.splice(i, 1);
				}
			}
		});

		// start the next in the queue if the last step wasn't forced
		if ( !gotoEnd ) {
			this.dequeue();
		}

		return this;
	}

});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show", 1),
	slideUp: genFx("hide", 1),
	slideToggle: genFx("toggle", 1),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, callback ) {
		return this.animate( props, speed, callback );
	};
});

jQuery.extend({
	speed: function( speed, easing, fn ) {
		var opt = speed && typeof speed === "object" ? speed : {
			complete: fn || !fn && easing ||
				jQuery.isFunction( speed ) && speed,
			duration: speed,
			easing: fn && easing || easing && !jQuery.isFunction(easing) && easing
		};

		opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
			jQuery.fx.speeds[opt.duration] || jQuery.fx.speeds._default;

		// Queueing
		opt.old = opt.complete;
		opt.complete = function() {
			if ( opt.queue !== false ) {
				jQuery(this).dequeue();
			}
			if ( jQuery.isFunction( opt.old ) ) {
				opt.old.call( this );
			}
		};

		return opt;
	},

	easing: {
		linear: function( p, n, firstNum, diff ) {
			return firstNum + diff * p;
		},
		swing: function( p, n, firstNum, diff ) {
			return ((-Math.cos(p*Math.PI)/2) + 0.5) * diff + firstNum;
		}
	},

	timers: [],

	fx: function( elem, options, prop ) {
		this.options = options;
		this.elem = elem;
		this.prop = prop;

		if ( !options.orig ) {
			options.orig = {};
		}
	}

});

jQuery.fx.prototype = {
	// Simple function for setting a style value
	update: function() {
		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		(jQuery.fx.step[this.prop] || jQuery.fx.step._default)( this );

		// Set display property to block for height/width animations
		if ( ( this.prop === "height" || this.prop === "width" ) && this.elem.style ) {
			this.elem.style.display = "block";
		}
	},

	// Get the current size
	cur: function( force ) {
		if ( this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null) ) {
			return this.elem[ this.prop ];
		}

		var r = parseFloat(jQuery.css(this.elem, this.prop, force));
		return r && r > -10000 ? r : parseFloat(jQuery.curCSS(this.elem, this.prop)) || 0;
	},

	// Start an animation from one number to another
	custom: function( from, to, unit ) {
		this.startTime = now();
		this.start = from;
		this.end = to;
		this.unit = unit || this.unit || "px";
		this.now = this.start;
		this.pos = this.state = 0;

		var self = this;
		function t( gotoEnd ) {
			return self.step(gotoEnd);
		}

		t.elem = this.elem;

		if ( t() && jQuery.timers.push(t) && !timerId ) {
			timerId = setInterval(jQuery.fx.tick, 13);
		}
	},

	// Simple 'show' function
	show: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.show = true;

		// Begin the animation
		// Make sure that we start at a small width/height to avoid any
		// flash of content
		this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());

		// Start by showing the element
		jQuery( this.elem ).show();
	},

	// Simple 'hide' function
	hide: function() {
		// Remember where we started, so that we can go back to it later
		this.options.orig[this.prop] = jQuery.style( this.elem, this.prop );
		this.options.hide = true;

		// Begin the animation
		this.custom(this.cur(), 0);
	},

	// Each step of an animation
	step: function( gotoEnd ) {
		var t = now(), done = true;

		if ( gotoEnd || t >= this.options.duration + this.startTime ) {
			this.now = this.end;
			this.pos = this.state = 1;
			this.update();

			this.options.curAnim[ this.prop ] = true;

			for ( var i in this.options.curAnim ) {
				if ( this.options.curAnim[i] !== true ) {
					done = false;
				}
			}

			if ( done ) {
				if ( this.options.display != null ) {
					// Reset the overflow
					this.elem.style.overflow = this.options.overflow;

					// Reset the display
					var old = jQuery.data(this.elem, "olddisplay");
					this.elem.style.display = old ? old : this.options.display;

					if ( jQuery.css(this.elem, "display") === "none" ) {
						this.elem.style.display = "block";
					}
				}

				// Hide the element if the "hide" operation was done
				if ( this.options.hide ) {
					jQuery(this.elem).hide();
				}

				// Reset the properties, if the item has been hidden or shown
				if ( this.options.hide || this.options.show ) {
					for ( var p in this.options.curAnim ) {
						jQuery.style(this.elem, p, this.options.orig[p]);
					}
				}

				// Execute the complete function
				this.options.complete.call( this.elem );
			}

			return false;

		} else {
			var n = t - this.startTime;
			this.state = n / this.options.duration;

			// Perform the easing function, defaults to swing
			var specialEasing = this.options.specialEasing && this.options.specialEasing[this.prop];
			var defaultEasing = this.options.easing || (jQuery.easing.swing ? "swing" : "linear");
			this.pos = jQuery.easing[specialEasing || defaultEasing](this.state, n, 0, 1, this.options.duration);
			this.now = this.start + ((this.end - this.start) * this.pos);

			// Perform the next step of the animation
			this.update();
		}

		return true;
	}
};

jQuery.extend( jQuery.fx, {
	tick: function() {
		var timers = jQuery.timers;

		for ( var i = 0; i < timers.length; i++ ) {
			if ( !timers[i]() ) {
				timers.splice(i--, 1);
			}
		}

		if ( !timers.length ) {
			jQuery.fx.stop();
		}
	},
		
	stop: function() {
		clearInterval( timerId );
		timerId = null;
	},
	
	speeds: {
		slow: 600,
 		fast: 200,
 		// Default speed
 		_default: 400
	},

	step: {
		opacity: function( fx ) {
			jQuery.style(fx.elem, "opacity", fx.now);
		},

		_default: function( fx ) {
			if ( fx.elem.style && fx.elem.style[ fx.prop ] != null ) {
				fx.elem.style[ fx.prop ] = (fx.prop === "width" || fx.prop === "height" ? Math.max(0, fx.now) : fx.now) + fx.unit;
			} else {
				fx.elem[ fx.prop ] = fx.now;
			}
		}
	}
});

if ( jQuery.expr && jQuery.expr.filters ) {
	jQuery.expr.filters.animated = function( elem ) {
		return jQuery.grep(jQuery.timers, function( fn ) {
			return elem === fn.elem;
		}).length;
	};
}

function genFx( type, num ) {
	var obj = {};

	jQuery.each( fxAttrs.concat.apply([], fxAttrs.slice(0,num)), function() {
		obj[ this ] = type;
	});

	return obj;
}
if ( "getBoundingClientRect" in document.documentElement ) {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		var box = elem.getBoundingClientRect(), doc = elem.ownerDocument, body = doc.body, docElem = doc.documentElement,
			clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0,
			top  = box.top  + (self.pageYOffset || jQuery.support.boxModel && docElem.scrollTop  || body.scrollTop ) - clientTop,
			left = box.left + (self.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft) - clientLeft;

		return { top: top, left: left };
	};

} else {
	jQuery.fn.offset = function( options ) {
		var elem = this[0];

		if ( options ) { 
			return this.each(function( i ) {
				jQuery.offset.setOffset( this, options, i );
			});
		}

		if ( !elem || !elem.ownerDocument ) {
			return null;
		}

		if ( elem === elem.ownerDocument.body ) {
			return jQuery.offset.bodyOffset( elem );
		}

		jQuery.offset.initialize();

		var offsetParent = elem.offsetParent, prevOffsetParent = elem,
			doc = elem.ownerDocument, computedStyle, docElem = doc.documentElement,
			body = doc.body, defaultView = doc.defaultView,
			prevComputedStyle = defaultView ? defaultView.getComputedStyle( elem, null ) : elem.currentStyle,
			top = elem.offsetTop, left = elem.offsetLeft;

		while ( (elem = elem.parentNode) && elem !== body && elem !== docElem ) {
			if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
				break;
			}

			computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
			top  -= elem.scrollTop;
			left -= elem.scrollLeft;

			if ( elem === offsetParent ) {
				top  += elem.offsetTop;
				left += elem.offsetLeft;

				if ( jQuery.offset.doesNotAddBorder && !(jQuery.offset.doesAddBorderForTableAndCells && /^t(able|d|h)$/i.test(elem.nodeName)) ) {
					top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
					left += parseFloat( computedStyle.borderLeftWidth ) || 0;
				}

				prevOffsetParent = offsetParent, offsetParent = elem.offsetParent;
			}

			if ( jQuery.offset.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible" ) {
				top  += parseFloat( computedStyle.borderTopWidth  ) || 0;
				left += parseFloat( computedStyle.borderLeftWidth ) || 0;
			}

			prevComputedStyle = computedStyle;
		}

		if ( prevComputedStyle.position === "relative" || prevComputedStyle.position === "static" ) {
			top  += body.offsetTop;
			left += body.offsetLeft;
		}

		if ( jQuery.offset.supportsFixedPosition && prevComputedStyle.position === "fixed" ) {
			top  += Math.max( docElem.scrollTop, body.scrollTop );
			left += Math.max( docElem.scrollLeft, body.scrollLeft );
		}

		return { top: top, left: left };
	};
}

jQuery.offset = {
	initialize: function() {
		var body = document.body, container = document.createElement("div"), innerDiv, checkDiv, table, td, bodyMarginTop = parseFloat( jQuery.curCSS(body, "marginTop", true) ) || 0,
			html = "<div style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;'><div></div></div><table style='position:absolute;top:0;left:0;margin:0;border:5px solid #000;padding:0;width:1px;height:1px;' cellpadding='0' cellspacing='0'><tr><td></td></tr></table>";

		jQuery.extend( container.style, { position: "absolute", top: 0, left: 0, margin: 0, border: 0, width: "1px", height: "1px", visibility: "hidden" } );

		container.innerHTML = html;
		body.insertBefore( container, body.firstChild );
		innerDiv = container.firstChild;
		checkDiv = innerDiv.firstChild;
		td = innerDiv.nextSibling.firstChild.firstChild;

		this.doesNotAddBorder = (checkDiv.offsetTop !== 5);
		this.doesAddBorderForTableAndCells = (td.offsetTop === 5);

		checkDiv.style.position = "fixed", checkDiv.style.top = "20px";
		// safari subtracts parent border width here which is 5px
		this.supportsFixedPosition = (checkDiv.offsetTop === 20 || checkDiv.offsetTop === 15);
		checkDiv.style.position = checkDiv.style.top = "";

		innerDiv.style.overflow = "hidden", innerDiv.style.position = "relative";
		this.subtractsBorderForOverflowNotVisible = (checkDiv.offsetTop === -5);

		this.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== bodyMarginTop);

		body.removeChild( container );
		body = container = innerDiv = checkDiv = table = td = null;
		jQuery.offset.initialize = jQuery.noop;
	},

	bodyOffset: function( body ) {
		var top = body.offsetTop, left = body.offsetLeft;

		jQuery.offset.initialize();

		if ( jQuery.offset.doesNotIncludeMarginInBodyOffset ) {
			top  += parseFloat( jQuery.curCSS(body, "marginTop",  true) ) || 0;
			left += parseFloat( jQuery.curCSS(body, "marginLeft", true) ) || 0;
		}

		return { top: top, left: left };
	},
	
	setOffset: function( elem, options, i ) {
		// set position first, in-case top/left are set even on static elem
		if ( /static/.test( jQuery.curCSS( elem, "position" ) ) ) {
			elem.style.position = "relative";
		}
		var curElem   = jQuery( elem ),
			curOffset = curElem.offset(),
			curTop    = parseInt( jQuery.curCSS( elem, "top",  true ), 10 ) || 0,
			curLeft   = parseInt( jQuery.curCSS( elem, "left", true ), 10 ) || 0;

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		var props = {
			top:  (options.top  - curOffset.top)  + curTop,
			left: (options.left - curOffset.left) + curLeft
		};
		
		if ( "using" in options ) {
			options.using.call( elem, props );
		} else {
			curElem.css( props );
		}
	}
};


jQuery.fn.extend({
	position: function() {
		if ( !this[0] ) {
			return null;
		}

		var elem = this[0],

		// Get *real* offsetParent
		offsetParent = this.offsetParent(),

		// Get correct offsets
		offset       = this.offset(),
		parentOffset = /^body|html$/i.test(offsetParent[0].nodeName) ? { top: 0, left: 0 } : offsetParent.offset();

		// Subtract element margins
		// note: when an element has margin: auto the offsetLeft and marginLeft
		// are the same in Safari causing offset.left to incorrectly be 0
		offset.top  -= parseFloat( jQuery.curCSS(elem, "marginTop",  true) ) || 0;
		offset.left -= parseFloat( jQuery.curCSS(elem, "marginLeft", true) ) || 0;

		// Add offsetParent borders
		parentOffset.top  += parseFloat( jQuery.curCSS(offsetParent[0], "borderTopWidth",  true) ) || 0;
		parentOffset.left += parseFloat( jQuery.curCSS(offsetParent[0], "borderLeftWidth", true) ) || 0;

		// Subtract the two offsets
		return {
			top:  offset.top  - parentOffset.top,
			left: offset.left - parentOffset.left
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || document.body;
			while ( offsetParent && (!/^body|html$/i.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static") ) {
				offsetParent = offsetParent.offsetParent;
			}
			return offsetParent;
		});
	}
});


// Create scrollLeft and scrollTop methods
jQuery.each( ["Left", "Top"], function( i, name ) {
	var method = "scroll" + name;

	jQuery.fn[ method ] = function(val) {
		var elem = this[0], win;
		
		if ( !elem ) {
			return null;
		}

		if ( val !== undefined ) {
			// Set the scroll offset
			return this.each(function() {
				win = getWindow( this );

				if ( win ) {
					win.scrollTo(
						!i ? val : jQuery(win).scrollLeft(),
						 i ? val : jQuery(win).scrollTop()
					);

				} else {
					this[ method ] = val;
				}
			});
		} else {
			win = getWindow( elem );

			// Return the scroll offset
			return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset" ] :
				jQuery.support.boxModel && win.document.documentElement[ method ] ||
					win.document.body[ method ] :
				elem[ method ];
		}
	};
});

function getWindow( elem ) {
	return ("scrollTo" in elem && elem.document) ?
		elem :
		elem.nodeType === 9 ?
			elem.defaultView || elem.parentWindow :
			false;
}
// Create innerHeight, innerWidth, outerHeight and outerWidth methods
jQuery.each([ "Height", "Width" ], function( i, name ) {

	var type = name.toLowerCase();

	// innerHeight and innerWidth
	jQuery.fn["inner" + name] = function() {
		return this[0] ?
			jQuery.css( this[0], type, false, "padding" ) :
			null;
	};

	// outerHeight and outerWidth
	jQuery.fn["outer" + name] = function( margin ) {
		return this[0] ?
			jQuery.css( this[0], type, false, margin ? "margin" : "border" ) :
			null;
	};

	jQuery.fn[ type ] = function( size ) {
		// Get window width or height
		var elem = this[0];
		if ( !elem ) {
			return size == null ? null : this;
		}
		
		if ( jQuery.isFunction( size ) ) {
			return this.each(function( i ) {
				var self = jQuery( this );
				self[ type ]( size.call( this, i, self[ type ]() ) );
			});
		}

		return ("scrollTo" in elem && elem.document) ? // does it walk and quack like a window?
			// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
			elem.document.compatMode === "CSS1Compat" && elem.document.documentElement[ "client" + name ] ||
			elem.document.body[ "client" + name ] :

			// Get document width or height
			(elem.nodeType === 9) ? // is it a document
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				Math.max(
					elem.documentElement["client" + name],
					elem.body["scroll" + name], elem.documentElement["scroll" + name],
					elem.body["offset" + name], elem.documentElement["offset" + name]
				) :

				// Get or set width or height on the element
				size === undefined ?
					// Get width or height on the element
					jQuery.css( elem, type ) :

					// Set the width or height on the element (default to pixels if value is unitless)
					this.css( type, typeof size === "string" ? size : size + "px" );
	};

});
// Expose jQuery to the global object
window.jQuery = window.$ = jQuery;

})(window);
/**
 * The MIT License
 *
 * Copyright (c) 2010 Adam Abrons and Misko Hevery http://getangular.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
(function(window, document, previousOnLoad){
  var _jQuery = window.jQuery.noConflict(true);
////////////////////////////////////

if (typeof document.getAttribute == $undefined)
  document.getAttribute = function() {};

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.lowercase
 * @function
 *
 * @description Converts string to lowercase
 * @param {string} string String to be lowercased.
 * @returns {string} Lowercased string.
 */
var lowercase = function (string){ return isString(string) ? string.toLowerCase() : string; };


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.uppercase
 * @function
 *
 * @description Converts string to uppercase.
 * @param {string} string String to be uppercased.
 * @returns {string} Uppercased string.
 */
var uppercase = function (string){ return isString(string) ? string.toUpperCase() : string; };


var manualLowercase = function (s) {
  return isString(s) ? s.replace(/[A-Z]/g,
      function (ch) {return fromCharCode(ch.charCodeAt(0) | 32); }) : s;
};
var manualUppercase = function (s) {
  return isString(s) ? s.replace(/[a-z]/g,
      function (ch) {return fromCharCode(ch.charCodeAt(0) & ~32); }) : s;
};


// String#toLowerCase and String#toUpperCase don't produce correct results in browsers with Turkish
// locale, for this reason we need to detect this case and redefine lowercase/uppercase methods with
// correct but slower alternatives.
if ('i' !== 'I'.toLowerCase()) {
  lowercase = manualLowercase;
  uppercase = manualUppercase;
}

function fromCharCode(code) { return String.fromCharCode(code); }


var _undefined        = undefined,
    _null             = null,
    $$element         = '$element',
    $$update          = '$update',
    $$scope           = '$scope',
    $$validate        = '$validate',
    $angular          = 'angular',
    $array            = 'array',
    $boolean          = 'boolean',
    $console          = 'console',
    $date             = 'date',
    $display          = 'display',
    $element          = 'element',
    $function         = 'function',
    $length           = 'length',
    $name             = 'name',
    $none             = 'none',
    $noop             = 'noop',
    $null             = 'null',
    $number           = 'number',
    $object           = 'object',
    $string           = 'string',
    $value            = 'value',
    $selected         = 'selected',
    $undefined        = 'undefined',
    NG_EXCEPTION      = 'ng-exception',
    NG_VALIDATION_ERROR = 'ng-validation-error',
    NOOP              = 'noop',
    PRIORITY_FIRST    = -99999,
    PRIORITY_WATCH    = -1000,
    PRIORITY_LAST     =  99999,
    PRIORITY          = {'FIRST': PRIORITY_FIRST, 'LAST': PRIORITY_LAST, 'WATCH':PRIORITY_WATCH},
    Error             = window.Error,
    jQuery            = window['jQuery'] || window['$'], // weirdness to make IE happy
    _                 = window['_'],
    /** holds major version number for IE or NaN for real browsers */
    msie              = parseInt((/msie (\d+)/.exec(lowercase(navigator.userAgent)) || [])[1], 10),
    jqLite            = jQuery || jqLiteWrap,
    slice             = Array.prototype.slice,
    push              = Array.prototype.push,
    error             = window[$console] ? bind(window[$console], window[$console]['error'] || noop) : noop,

    angular           = window[$angular]    || (window[$angular] = {}),
    angularTextMarkup = extensionMap(angular, 'markup'),
    angularAttrMarkup = extensionMap(angular, 'attrMarkup'),
    /** @name angular.directive */
    angularDirective  = extensionMap(angular, 'directive'),
    /** @name angular.widget */
    angularWidget     = extensionMap(angular, 'widget', lowercase),
    /** @name angular.validator */
    angularValidator  = extensionMap(angular, 'validator'),
    /** @name angular.fileter */
    angularFilter     = extensionMap(angular, 'filter'),
    /** @name angular.formatter */
    angularFormatter  = extensionMap(angular, 'formatter'),
    /** @name angular.service */
    angularService    = extensionMap(angular, 'service'),
    angularCallbacks  = extensionMap(angular, 'callbacks'),
    nodeName,
    rngScript         = /^(|.*\/)angular(-.*?)?(\.min)?.js(\?[^#]*)?(#(.*))?$/;

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.foreach
 * @function
 *
 * @description
 * Invokes the `iterator` function once for each item in `obj` collection. The collection can either
 * be an object or an array. The `iterator` function is invoked with `iterator(value, key)`, where
 * `value` is the value of an object property or an array element and `key` is the object property
 * key or array element index. Optionally, `context` can be specified for the iterator function.
 *
   <pre>
     var values = {name: 'misko', gender: 'male'};
     var log = [];
     angular.foreach(values, function(value, key){
       this.push(key + ': ' + value);
     }, log);
     expect(log).toEqual(['name: misko', 'gender:male']);
   </pre>
 *
 * @param {Object|Array} obj Object to iterate over.
 * @param {function()} iterator Iterator function.
 * @param {Object} context Object to become context (`this`) for the iterator function.
 * @returns {Objet|Array} Reference to `obj`.
 */
function foreach(obj, iterator, context) {
  var key;
  if (obj) {
    if (isFunction(obj)){
      for (key in obj) {
        if (key != 'prototype' && key != $length && key != $name && obj.hasOwnProperty(key)) {
          iterator.call(context, obj[key], key);
        }
      }
    } else if (obj.forEach) {
      obj.forEach(iterator, context);
    } else if (isObject(obj) && isNumber(obj.length)) {
      for (key = 0; key < obj.length; key++)
        iterator.call(context, obj[key], key);
    } else {
      for (key in obj)
        iterator.call(context, obj[key], key);
    }
  }
  return obj;
}

function foreachSorted(obj, iterator, context) {
  var keys = [];
  for (var key in obj) keys.push(key);
  keys.sort();
  for ( var i = 0; i < keys.length; i++) {
    iterator.call(context, obj[keys[i]], keys[i]);
  }
  return keys;
}


function formatError(arg) {
  if (arg instanceof Error) {
    if (arg.stack) {
      arg = arg.stack;
    } else if (arg.sourceURL) {
      arg = arg.message + '\n' + arg.sourceURL + ':' + arg.line;
    }
  }
  return arg;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.extend
 * @function
 *
 * @description
 * Extends the destination object `dst` by copying all of the properties from the `src` objects to
 * `dst`. You can specify multiple `src` objects.
 *
 * @param {Object} dst The destination object.
 * @param {...Object} src The source object(s).
 */
function extend(dst) {
  foreach(arguments, function(obj){
    if (obj !== dst) {
      foreach(obj, function(value, key){
        dst[key] = value;
      });
    }
  });
  return dst;
}


function inherit(parent, extra) {
  return extend(new (extend(function(){}, {prototype:parent}))(), extra);
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.noop
 * @function
 *
 * @description
 * Empty function that performs no operation whatsoever. This function is useful when writing code
 * in the functional style.
   <pre>
     function foo(callback) {
       var result = calculateResult();
       (callback || angular.noop)(result);
     }
   </pre>
 */
function noop() {}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.identity
 * @function
 *
 * @description
 * A function that does nothing except for returning its first argument. This function is useful
 * when writing code in the functional style.
 *
   <pre>
     function transformer(transformationFn, value) {
       return (transformationFn || identity)(value);
     };
   </pre>
 */
function identity($) {return $;}


function valueFn(value) {return function(){ return value; };}


function extensionMap(angular, name, transform) {
  var extPoint;
  return angular[name] || (extPoint = angular[name] = function (name, fn, prop){
    name = (transform || identity)(name);
    if (isDefined(fn)) {
      if (isDefined(extPoint[name])) {
        foreach(extPoint[name], function(property, key) {
          if (key.charAt(0) == '$' && isUndefined(fn[key]))
            fn[key] = property;
        });
      }
      extPoint[name] = extend(fn, prop || {});
    }
    return extPoint[name];
  });
}

function jqLiteWrap(element) {
  // for some reasons the parentNode of an orphan looks like _null but its typeof is object.
  if (element) {
    if (isString(element)) {
      var div = document.createElement('div');
      div.innerHTML = element;
      element = new JQLite(div.childNodes);
    } else if (!(element instanceof JQLite) && isElement(element)) {
      element =  new JQLite(element);
    }
  }
  return element;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isUndefined
 * @function
 *
 * @description
 * Checks if a reference is undefined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is undefined.
 */
function isUndefined(value){ return typeof value == $undefined; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isDefined
 * @function
 *
 * @description
 * Checks if a reference is defined.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is defined.
 */
function isDefined(value){ return typeof value != $undefined; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isObject
 * @function
 *
 * @description
 * Checks if a reference is an `Object`. Unlike in JavaScript `null`s are not considered to be
 * objects.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Object` but not `null`.
 */
function isObject(value){ return value!=_null && typeof value == $object;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isString
 * @function
 *
 * @description
 * Checks if a reference is a `String`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `String`.
 */
function isString(value){ return typeof value == $string;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isNumber
 * @function
 *
 * @description
 * Checks if a reference is a `Number`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Number`.
 */
function isNumber(value){ return typeof value == $number;}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isDate
 * @function
 *
 * @description
 * Checks if value is a date.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Date`.
 */
function isDate(value){ return value instanceof Date; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isArray
 * @function
 *
 * @description
 * Checks if a reference is an `Array`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is an `Array`.
 */
function isArray(value) { return value instanceof Array; }


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.isFunction
 * @function
 *
 * @description
 * Checks if a reference is a `Function`.
 *
 * @param {*} value Reference to check.
 * @returns {boolean} True if `value` is a `Function`.
 */
function isFunction(value){ return typeof value == $function;}


function isBoolean(value) { return typeof value == $boolean;}
function isTextNode(node) { return nodeName(node) == '#text'; }
function trim(value) { return isString(value) ? value.replace(/^\s*/, '').replace(/\s*$/, '') : value; }
function isElement(node) {
  return node && (node.nodeName || node instanceof JQLite || (jQuery && node instanceof jQuery));
}

/**
 * HTML class which is the only class which can be used in ng:bind to inline HTML for security reasons.
 * @constructor
 * @param html raw (unsafe) html
 * @param {string=} option if set to 'usafe' then get method will return raw (unsafe/unsanitized) html
 */
function HTML(html, option) {
  this.html = html;
  this.get = lowercase(option) == 'unsafe' ?
    valueFn(html) :
    function htmlSanitize() {
      var buf = [];
      htmlParser(html, htmlSanitizeWriter(buf));
      return buf.join('');
    };
}

if (msie) {
  nodeName = function(element) {
    element = element.nodeName ? element : element[0];
    return (element.scopeName && element.scopeName != 'HTML' ) ? uppercase(element.scopeName + ':' + element.nodeName) : element.nodeName;
  };
} else {
  nodeName = function(element) {
    return element.nodeName ? element.nodeName : element[0].nodeName;
  };
}

function quickClone(element) {
  return jqLite(element[0].cloneNode(true));
}

function isVisible(element) {
  var rect = element[0].getBoundingClientRect(),
      width = (rect.width || (rect.right||0 - rect.left||0)),
      height = (rect.height || (rect.bottom||0 - rect.top||0));
  return width>0 && height>0;
}

function map(obj, iterator, context) {
  var results = [];
  foreach(obj, function(value, index, list) {
    results.push(iterator.call(context, value, index, list));
  });
  return results;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.Object.size
 * @function
 *
 * @description
 * Determines the number of elements in an array or number of properties of an object.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {Object|Array} obj Object or array to inspect.
 * @returns {number} The size of `obj` or `0` if `obj` is not an object or array.
 *
 * @example
 * Number of items in array: {{ [1,2].$size() }}<br/>
 * Number of items in object: {{ {a:1, b:2, c:3}.$size() }}<br/>
 */
function size(obj) {
  var size = 0;
  if (obj) {
    if (isNumber(obj.length)) {
      return obj.length;
    } else if (isObject(obj)){
      for (key in obj)
        size++;
    }
  }
  return size;
}
function includes(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return true;
  }
  return false;
}

function indexOf(array, obj) {
  for ( var i = 0; i < array.length; i++) {
    if (obj === array[i]) return i;
  }
  return -1;
}

function isLeafNode (node) {
  if (node) {
    switch (node.nodeName) {
    case "OPTION":
    case "PRE":
    case "TITLE":
      return true;
    }
  }
  return false;
}

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.Object.copy
 * @function
 *
 * @description
 * Creates a deep copy of `source`.
 *
 * If `destination` is not provided and `source` is an object or an array, a copy is created &
 * returned, otherwise the `source` is returned.
 *
 * If `destination` is provided, all of its properties will be deleted.
 *
 * If `source` is an object or an array, all of its members will be copied into the `destination`
 * object.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {*} source The source to be used to make a copy.
 *                   Can be any type including primitives, `null` and `undefined`.
 * @param {(Object|Array)=} destination Optional destination into which the source is copied.
 * @returns {*} The copy or updated `destination` if `destination` was specified.
 *
 * @example
   Salutation: <input type="text" name="master.salutation" value="Hello" /><br/>
   Name: <input type="text" name="master.name" value="world"/><br/>
   <button ng:click="form = master.$copy()">copy</button>
   <hr/>

   Master is <span ng:hide="master.$equals(form)">NOT</span> same as form.

   <pre>master={{master}}</pre>
   <pre>form={{form}}</pre>
 */
function copy(source, destination){
  if (!destination) {
    destination = source;
    if (source) {
      if (isArray(source)) {
        destination = copy(source, []);
      } else if (isDate(source)) {
        destination = new Date(source.getTime());
      } else if (isObject(source)) {
        destination = copy(source, {});
      }
    }
  } else {
    if (isArray(source)) {
      while(destination.length) {
        destination.pop();
      }
      for ( var i = 0; i < source.length; i++) {
        destination.push(copy(source[i]));
      }
    } else {
      foreach(destination, function(value, key){
        delete destination[key];
      });
      for ( var key in source) {
        destination[key] = copy(source[key]);
      }
    }
  }
  return destination;
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.Object.equals
 * @function
 *
 * @description
 * Determines if two objects or value are equivalent.
 *
 * To be equivalent, they must pass `==` comparison or be of the same type and have all their
 * properties pass `==` comparison.
 *
 * Supports values types, arrays and objects.
 *
 * For objects `function` properties and properties that start with `$` are not considered during
 * comparisons.
 *
 * Note: this function is used to augment the Object type in angular expressions. See
 * {@link angular.Object} for more info.
 *
 * @param {*} o1 Object or value to compare.
 * @param {*} o2 Object or value to compare.
 * @returns {boolean} True if arguments are equal.
 *
 * @example
   Salutation: <input type="text" name="master.salutation" value="Hello" /><br/>
   Name: <input type="text" name="master.name" value="world"/><br/>
   <button ng:click="form = master.$copy()">copy</button>
   <hr/>

   Master is <span ng:hide="master.$equals(form)">NOT</span> same as form.

   <pre>master={{master}}</pre>
   <pre>form={{form}}</pre>
 */
function equals(o1, o2) {
  if (o1 == o2) return true;
  var t1 = typeof o1, t2 = typeof o2, length, key, keySet;
  if (t1 == t2 && t1 == 'object') {
    if (o1 instanceof Array) {
      if ((length = o1.length) == o2.length) {
        for(key=0; key<length; key++) {
          if (!equals(o1[key], o2[key])) return false;
        }
        return true;
      }
    } else {
      keySet = {};
      for(key in o1) {
        if (key.charAt(0) !== '$' && !isFunction(o1[key]) && !equals(o1[key], o2[key])) return false;
        keySet[key] = true;
      }
      for(key in o2) {
        if (!keySet[key] && key.charAt(0) !== '$' && !isFunction(o2[key])) return false;
      }
      return true;
    }
  }
  return false;
}

function setHtml(node, html) {
  if (isLeafNode(node)) {
    if (msie) {
      node.innerText = html;
    } else {
      node.textContent = html;
    }
  } else {
    node.innerHTML = html;
  }
}

function isRenderableElement(element) {
  var name = element && element[0] && element[0].nodeName;
  return name && name.charAt(0) != '#' &&
    !includes(['TR', 'COL', 'COLGROUP', 'TBODY', 'THEAD', 'TFOOT'], name);
}
function elementError(element, type, error) {
  while (!isRenderableElement(element)) {
    element = element.parent() || jqLite(document.body);
  }
  if (element[0]['$NG_ERROR'] !== error) {
    element[0]['$NG_ERROR'] = error;
    if (error) {
      element.addClass(type);
      element.attr(type, error);
    } else {
      element.removeClass(type);
      element.removeAttr(type);
    }
  }
}

function concat(array1, array2, index) {
  return array1.concat(slice.call(array2, index, array2.length));
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.bind
 * @function
 *
 * @description
 * Returns function which calls function `fn` bound to `self` (`self` becomes the `this` for `fn`).
 * Optional `args` can be supplied which are prebound to the function, also known as
 * [function currying](http://en.wikipedia.org/wiki/Currying).
 *
 * @param {Object} self Context in which `fn` should be evaluated in.
 * @param {function()} fn Function to be bound.
 * @param {(...*)=} args Optional arguments to be prebound to the `fn` function call.
 * @returns {function()} Function that wraps the `fn` with all the specified bindings.
 */
function bind(self, fn) {
  var curryArgs = arguments.length > 2 ? slice.call(arguments, 2, arguments.length) : [];
  if (typeof fn == $function) {
    return curryArgs.length ? function() {
      return arguments.length ? fn.apply(self, curryArgs.concat(slice.call(arguments, 0, arguments.length))) : fn.apply(self, curryArgs);
    }: function() {
      return arguments.length ? fn.apply(self, arguments) : fn.call(self);
    };
  } else {
    // in IE, native methods are not functions and so they can not be bound (but they don't need to be)
    return fn;
  }
}

function toBoolean(value) {
  if (value && value.length !== 0) {
    var v = lowercase("" + value);
    value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
  } else {
    value = false;
  }
  return value;
}

function merge(src, dst) {
  for ( var key in src) {
    var value = dst[key];
    var type = typeof value;
    if (type == $undefined) {
      dst[key] = fromJson(toJson(src[key]));
    } else if (type == 'object' && value.constructor != array &&
        key.substring(0, 1) != "$") {
      merge(src[key], value);
    }
  }
}


/**
 * @workInProgress
 * @ngdoc function
 * @name angular.compile
 * @function
 *
 * @description
 * Compiles a piece of HTML or DOM into a {@link angular.scope scope} object.
   <pre>
    var scope1 = angular.compile(window.document);
    scope1.$init();

    var scope2 = angular.compile('<div ng:click="clicked = true">click me</div>');
    scope2.$init();
   </pre>
 *
 * @param {string|DOMElement} element Element to compile.
 * @param {Object=} parentScope Scope to become the parent scope of the newly compiled scope.
 * @returns {Object} Compiled scope object.
 */
function compile(element, parentScope) {
  var compiler = new Compiler(angularTextMarkup, angularAttrMarkup, angularDirective, angularWidget),
      $element = jqLite(element);
  return compiler.compile($element)($element, parentScope);
}
/////////////////////////////////////////////////

/**
 * Parses an escaped url query string into key-value pairs.
 * @returns Object.<(string|boolean)>
 */
function parseKeyValue(/**string*/keyValue) {
  var obj = {}, key_value, key;
  foreach((keyValue || "").split('&'), function(keyValue){
    if (keyValue) {
      key_value = keyValue.split('=');
      key = unescape(key_value[0]);
      obj[key] = isDefined(key_value[1]) ? unescape(key_value[1]) : true;
    }
  });
  return obj;
}

function toKeyValue(obj) {
  var parts = [];
  foreach(obj, function(value, key) {
    parts.push(escape(key) + (value === true ? '' : '=' + escape(value)));
  });
  return parts.length ? parts.join('&') : '';
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:autobind
 * @element script
 *
 * @TODO ng:autobind is not a directive!! it should be documented as bootstrap parameter in a
 *     separate bootstrap section.
 * @TODO rename to ng:autobind to ng:autoboot
 *
 * @description
 * This section explains how to bootstrap your application with angular using either the angular
 * javascript file.
 *
 *
 * ## The angular distribution
 * Note that there are two versions of the angular javascript file that you can use:
 * 
 * * `angular.js` - the development version - this file is unobfuscated, uncompressed, and thus
 *    human-readable and useful when developing your angular applications.
 * * `angular.min.js` - the production version - this is a minified and obfuscated version of
 *    `angular.js`. You want to use this version when you want to load a smaller but functionally
 *    equivalent version of the code in your application. We use the Closure compiler to create this
 *    file.
 *     
 * 
 * ## Auto-bootstrap with `ng:autobind`
 * The simplest way to get an <angular/> application up and running is by inserting a script tag in
 * your HTML file that bootstraps the `http://code.angularjs.org/angular-x.x.x.min.js` code and uses
 * the special `ng:autobind` attribute, like in this snippet of HTML:
 * 
 * <pre>
    &lt;!doctype html&gt;
    &lt;html xmlns:ng="http://angularjs.org"&gt;
     &lt;head&gt;
      &lt;script type="text/javascript" src="http://code.angularjs.org/angular-0.9.3.min.js"
              ng:autobind&gt;&lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       Hello {{'world'}}!
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * The `ng:autobind` attribute tells <angular/> to compile and manage the whole HTML document. The
 * compilation occurs in the page's `onLoad` handler. Note that you don't need to explicitly add an
 * `onLoad` event; auto bind mode takes care of all the magic for you.
 *
 *
 * ## Auto-bootstrap with `#autobind`
 * In rare cases when you can't define the `ng` namespace before the script tag (e.g. in some CMS
 * systems, etc), it is possible to auto-bootstrap angular by appending `#autobind` to the script
 * src URL, like in this snippet:
 *
 * <pre>
    &lt;!doctype html&gt;
    &lt;html&gt;
     &lt;head&gt;
      &lt;script type="text/javascript"
              src="http://code.angularjs.org/angular-0.9.3.min.js#autobind"&gt;&lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       &lt;div xmlns:ng="http://angularjs.org"&gt;
         Hello {{'world'}}!
       &lt;/div&gt;
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 *
 * In this case it's the `#autobind` URL fragment that tells angular to auto-bootstrap.
 *
 *
 * ## Filename Restrictions for Auto-bootstrap
 * In order for us to find the auto-bootstrap script attribute or URL fragment, the value of the
 * `script` `src` attribute that loads angular script must match one of these naming
 * conventions:
 *
 * - `angular.js`
 * - `angular-min.js`
 * - `angular-x.x.x.js`
 * - `angular-x.x.x.min.js`
 * - `angular-x.x.x-xxxxxxxx.js` (dev snapshot)
 * - `angular-x.x.x-xxxxxxxx.min.js` (dev snapshot)
 * - `angular-bootstrap.js` (used for development of angular)
 *
 * Optionally, any of the filename format above can be prepended with relative or absolute URL that
 * ends with `/`.
 *
 *
 * ## Manual Bootstrap
 * Using auto-bootstrap is a handy way to start using <angular/>, but advanced users who want more
 * control over the initialization process might prefer to use manual bootstrap instead.
 * 
 * The best way to get started with manual bootstraping is to look at the magic behind `ng:autobind`
 * by writing out each step of the autobind process explicitly. Note that the following code is
 * equivalent to the code in the previous section.
 * 
 * <pre>
    &lt;!doctype html&gt;
    &lt;html xmlns:ng="http://angularjs.org"&gt;
     &lt;head&gt;
      &lt;script type="text/javascript" src="http://code.angularjs.org/angular-0.9.3.min.js"
              ng:autobind&gt;&lt;/script&gt;
      &lt;script type="text/javascript"&gt;
       (function(window, previousOnLoad){
         window.onload = function(){
          try { (previousOnLoad||angular.noop)(); } catch(e) {}
          angular.compile(window.document).$init();
         };
       })(window, window.onload);
      &lt;/script&gt;
     &lt;/head&gt;
     &lt;body&gt;
       Hello {{'World'}}!
     &lt;/body&gt;
    &lt;/html&gt;
 * </pre>
 * 
 * This is the sequence that your code should follow if you're bootstrapping angular on your own:
 * 
 * * After the page is loaded, find the root of the HTML template, which is typically the root of
 *   the document.
 * * Run the HTML compiler, which converts the templates into an executable, bi-directionally bound
 *   application.
 *
 *
 * ##XML Namespace
 * *IMPORTANT:* When using <angular/> you must declare the ng namespace using the xmlns tag. If you
 * don't declare the namespace, Internet Explorer does not render widgets properly.
 *    
 * <pre>
 * &lt;html xmlns:ng="http://angularjs.org"&gt;
 * </pre>
 *
 *
 * ## Create your own namespace
 * If you want to define your own widgets, you must create your own namespace and use that namespace
 * to form the fully qualified widget name. For example, you could map the alias `my` to your domain
 * and create a widget called my:widget. To create your own namespace, simply add another xmlsn tag
 * to your page, create an alias, and set it to your unique domain:
 * 
 * <pre>
 * &lt;html xmlns:ng="http://angularjs.org" xmlns:my="http://mydomain.com"&gt;
 * </pre>
 *
 *
 * ## Global Object
 * The <angular/> script creates a single global variable `angular` in the global namespace. All
 * APIs are bound to fields of this global object.
 * 
 */
function angularInit(config){
  if (config.autobind) {
    // TODO default to the source of angular.js
    var scope = compile(window.document, _null, {'$config':config}),
        $browser = scope.$inject('$browser');

    if (config.css)
      $browser.addCss(config.base_url + config.css);
    else if(msie<8)
      $browser.addJs(config.base_url + config.ie_compat, config.ie_compat_id);

    scope.$init();
  }
}

function angularJsConfig(document, config) {
  var scripts = document.getElementsByTagName("script"),
      match;
  config = extend({
    ie_compat_id: 'ng-ie-compat'
  }, config);
  for(var j = 0; j < scripts.length; j++) {
    match = (scripts[j].src || "").match(rngScript);
    if (match) {
      config.base_url = match[1];
      config.ie_compat = match[1] + 'angular-ie-compat' + (match[2] || '') + '.js';
      extend(config, parseKeyValue(match[6]));
      eachAttribute(jqLite(scripts[j]), function(value, name){
        if (/^ng:/.exec(name)) {
          name = name.substring(3).replace(/-/g, '_');
          if (name == 'autobind') value = true;
          config[name] = value;
        }
      });
    }
  }
  return config;
}
var array = [].constructor;

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.toJson
 * @function
 *
 * @description
 * Serializes the input into a JSON formated string.
 *
 * @param {Object|Array|Date|string|number} obj Input to jsonify.
 * @param {boolean=} pretty If set to true, the JSON output will contain newlines and whitespace.
 * @returns {string} Jsonified string representing `obj`.
 */
function toJson(obj, pretty) {
  var buf = [];
  toJsonArray(buf, obj, pretty ? "\n  " : _null, []);
  return buf.join('');
}

/**
 * @workInProgress
 * @ngdoc function
 * @name angular.fromJson
 * @function
 *
 * @description
 * Deserializes a string in the JSON format.
 *
 * @param {string} json JSON string to deserialize.
 * @returns {Object|Array|Date|string|number} Deserialized thingy.
 */
function fromJson(json) {
  if (!json) return json;
  try {
    var p = parser(json, true);
    var expression =  p.primary();
    p.assertAllConsumed();
    return expression();
  } catch (e) {
    error("fromJson error: ", json, e);
    throw e;
  }
}

angular['toJson'] = toJson;
angular['fromJson'] = fromJson;

function toJsonArray(buf, obj, pretty, stack) {
  if (isObject(obj)) {
    if (obj === window) {
      buf.push('WINDOW');
      return;
    }

    if (obj === document) {
      buf.push('DOCUMENT');
      return;
    }

    if (includes(stack, obj)) {
      buf.push('RECURSION');
      return;
    }
    stack.push(obj);
  }
  if (obj === _null) {
    buf.push($null);
  } else if (obj instanceof RegExp) {
    buf.push(angular['String']['quoteUnicode'](obj.toString()));
  } else if (isFunction(obj)) {
    return;
  } else if (isBoolean(obj)) {
    buf.push('' + obj);
  } else if (isNumber(obj)) {
    if (isNaN(obj)) {
      buf.push($null);
    } else {
      buf.push('' + obj);
    }
  } else if (isString(obj)) {
    return buf.push(angular['String']['quoteUnicode'](obj));
  } else if (isObject(obj)) {
    if (isArray(obj)) {
      buf.push("[");
      var len = obj.length;
      var sep = false;
      for(var i=0; i<len; i++) {
        var item = obj[i];
        if (sep) buf.push(",");
        if (!(item instanceof RegExp) && (isFunction(item) || isUndefined(item))) {
          buf.push($null);
        } else {
          toJsonArray(buf, item, pretty, stack);
        }
        sep = true;
      }
      buf.push("]");
    } else if (isDate(obj)) {
      buf.push(angular['String']['quoteUnicode'](angular['Date']['toString'](obj)));
    } else {
      buf.push("{");
      if (pretty) buf.push(pretty);
      var comma = false;
      var childPretty = pretty ? pretty + "  " : false;
      var keys = [];
      for(var k in obj) {
        if (obj[k] === _undefined)
          continue;
        keys.push(k);
      }
      keys.sort();
      for ( var keyIndex = 0; keyIndex < keys.length; keyIndex++) {
        var key = keys[keyIndex];
        var value = obj[key];
        if (typeof value != $function) {
          if (comma) {
            buf.push(",");
            if (pretty) buf.push(pretty);
          }
          buf.push(angular['String']['quote'](key));
          buf.push(":");
          toJsonArray(buf, value, childPretty, stack);
          comma = true;
        }
      }
      buf.push("}");
    }
  }
  if (isObject(obj)) {
    stack.pop();
  }
}
/**
 * Template provides directions an how to bind to a given element.
 * It contains a list of init functions which need to be called to
 * bind to a new instance of elements. It also provides a list
 * of child paths which contain child templates
 */
function Template(priority) {
  this.paths = [];
  this.children = [];
  this.inits = [];
  this.priority = priority;
  this.newScope = false;
}

Template.prototype = {
  init: function(element, scope) {
    var inits = {};
    this.collectInits(element, inits, scope);
    foreachSorted(inits, function(queue){
      foreach(queue, function(fn) {fn();});
    });
  },

  collectInits: function(element, inits, scope) {
    var queue = inits[this.priority], childScope = scope;
    if (!queue) {
      inits[this.priority] = queue = [];
    }
    element = jqLite(element);
    if (this.newScope) {
      childScope = createScope(scope);
      scope.$onEval(childScope.$eval);
      element.data($$scope, childScope);
    }
    foreach(this.inits, function(fn) {
      queue.push(function() {
        childScope.$tryEval(function(){
          return childScope.$inject(fn, childScope, element);
        }, element);
      });
    });
    var i,
        childNodes = element[0].childNodes,
        children = this.children,
        paths = this.paths,
        length = paths.length;
    for (i = 0; i < length; i++) {
      children[i].collectInits(childNodes[paths[i]], inits, childScope);
    }
  },


  addInit:function(init) {
    if (init) {
      this.inits.push(init);
    }
  },


  addChild: function(index, template) {
    if (template) {
      this.paths.push(index);
      this.children.push(template);
    }
  },

  empty: function() {
    return this.inits.length === 0 && this.paths.length === 0;
  }
};

/*
 * Function walks up the element chain looking for the scope associated with the give element.
 */
function retrieveScope(element) {
  var scope;
  while (element && !(scope = element.data($$scope))) {
    element = element.parent();
  }
  return scope;
}

///////////////////////////////////
//Compiler
//////////////////////////////////
function Compiler(markup, attrMarkup, directives, widgets){
  this.markup = markup;
  this.attrMarkup = attrMarkup;
  this.directives = directives;
  this.widgets = widgets;
}

Compiler.prototype = {
  compile: function(rawElement) {
    rawElement = jqLite(rawElement);
    var index = 0,
        template,
        parent = rawElement.parent();
    if (parent && parent[0]) {
      parent = parent[0];
      for(var i = 0; i < parent.childNodes.length; i++) {
        if (parent.childNodes[i] == rawElement[0]) {
          index = i;
        }
      }
    }
    template = this.templatize(rawElement, index, 0) || new Template();
    return function(element, parentScope){
      element = jqLite(element);
      var scope = parentScope && parentScope.$eval ?
          parentScope : createScope(parentScope);
      element.data($$scope, scope);
      return extend(scope, {
        $element:element,
        $init: function() {
          template.init(element, scope);
          scope.$eval();
          delete scope.$init;
          return scope;
        }
      });
    };
  },

  
  /**
   * @workInProgress
   * @ngdoc directive
   * @name angular.directive.ng:eval-order
   *
   * @description
   * Normally the view is updated from top to bottom. This usually is 
   * not a problem, but under some circumstances the values for data 
   * is not available until after the full view is computed. If such 
   * values are needed before they are computed the order of 
   * evaluation can be change using ng:eval-order
   * 
   * @element ANY
   * @param {integer|string=} [priority=0] priority integer, or FIRST, LAST constant
   *
   * @exampleDescription
   * try changing the invoice and see that the Total will lag in evaluation
   * @example
      <div>TOTAL: without ng:eval-order {{ items.$sum('total') | currency }}</div>
      <div ng:eval-order='LAST'>TOTAL: with ng:eval-order {{ items.$sum('total') | currency }}</div>
      <table ng:init="items=[{qty:1, cost:9.99, desc:'gadget'}]">
        <tr>
          <td>QTY</td>
          <td>Description</td>
          <td>Cost</td>
          <td>Total</td>
          <td></td>
        </tr>
        <tr ng:repeat="item in items">
          <td><input name="item.qty"/></td>
          <td><input name="item.desc"/></td>
          <td><input name="item.cost"/></td>
          <td>{{item.total = item.qty * item.cost | currency}}</td>
          <td><a href="" ng:click="items.$remove(item)">X</a></td>
        </tr>
        <tr>
          <td colspan="3"><a href="" ng:click="items.$add()">add</a></td>
          <td>{{ items.$sum('total') | currency }}</td>
        </tr>
      </table>
   * 
   * @scenario
     it('should check ng:format', function(){
       expect(using('.doc-example-live div:first').binding("items.$sum('total')")).toBe('$9.99');
       expect(using('.doc-example-live div:last').binding("items.$sum('total')")).toBe('$9.99');
       input('item.qty').enter('2');
       expect(using('.doc-example-live div:first').binding("items.$sum('total')")).toBe('$9.99');
       expect(using('.doc-example-live div:last').binding("items.$sum('total')")).toBe('$19.98');
     });
   */

  templatize: function(element, elementIndex, priority){
    var self = this,
        widget,
        fn,
        directiveFns = self.directives,
        descend = true,
        directives = true,
        elementName = nodeName(element),
        template,
        selfApi = {
          compile: bind(self, self.compile),
          comment:function(text) {return jqLite(document.createComment(text));},
          element:function(type) {return jqLite(document.createElement(type));},
          text:function(text) {return jqLite(document.createTextNode(text));},
          descend: function(value){ if(isDefined(value)) descend = value; return descend;},
          directives: function(value){ if(isDefined(value)) directives = value; return directives;},
          scope: function(value){ if(isDefined(value)) template.newScope = template.newScope || value; return template.newScope;}
        };
    try {
      priority = element.attr('ng:eval-order') || priority || 0;
    } catch (e) {
      // for some reason IE throws error under some weird circumstances. so just assume nothing
      priority = priority || 0;
    }
    if (isString(priority)) {
      priority = PRIORITY[uppercase(priority)] || parseInt(priority, 10);
    }
    template = new Template(priority);
    eachAttribute(element, function(value, name){
      if (!widget) {
        if (widget = self.widgets('@' + name)) {
          element.addClass('ng-attr-widget');
          widget = bind(selfApi, widget, value, element);
        }
      }
    });
    if (!widget) {
      if (widget = self.widgets(elementName)) {
        if (elementName.indexOf(':') > 0)
          element.addClass('ng-widget');
        widget = bind(selfApi, widget, element);
      }
    }
    if (widget) {
      descend = false;
      directives = false;
      var parent = element.parent();
      template.addInit(widget.call(selfApi, element));
      if (parent && parent[0]) {
        element = jqLite(parent[0].childNodes[elementIndex]);
      }
    }
    if (descend){
      // process markup for text nodes only
      for(var i=0, child=element[0].childNodes;
          i<child.length; i++) {
        if (isTextNode(child[i])) {
          foreach(self.markup, function(markup){
            if (i<child.length) {
              var textNode = jqLite(child[i]);
              markup.call(selfApi, textNode.text(), textNode, element);
            }
          });
        }
      }
    }

    if (directives) {
      // Process attributes/directives
      eachAttribute(element, function(value, name){
        foreach(self.attrMarkup, function(markup){
          markup.call(selfApi, value, name, element);
        });
      });
      eachAttribute(element, function(value, name){
        fn = directiveFns[name];
        if (fn) {
          element.addClass('ng-directive');
          template.addInit((directiveFns[name]).call(selfApi, value, element));
        }
      });
    }
    // Process non text child nodes
    if (descend) {
      eachNode(element, function(child, i){
        template.addChild(i, self.templatize(child, i, priority));
      });
    }
    return template.empty() ? _null : template;
  }
};

function eachNode(element, fn){
  var i, chldNodes = element[0].childNodes || [], chld;
  for (i = 0; i < chldNodes.length; i++) {
    if(!isTextNode(chld = chldNodes[i])) {
      fn(jqLite(chld), i);
    }
  }
}

function eachAttribute(element, fn){
  var i, attrs = element[0].attributes || [], chld, attr, name, value, attrValue = {};
  for (i = 0; i < attrs.length; i++) {
    attr = attrs[i];
    name = attr.name;
    value = attr.value;
    if (msie && name == 'href') {
      value = decodeURIComponent(element[0].getAttribute(name, 2));
    }
    attrValue[name] = value;
  }
  foreachSorted(attrValue, fn);
}

function getter(instance, path, unboundFn) {
  if (!path) return instance;
  var element = path.split('.');
  var key;
  var lastInstance = instance;
  var len = element.length;
  for ( var i = 0; i < len; i++) {
    key = element[i];
    if (!key.match(/^[\$\w][\$\w\d]*$/))
        throw "Expression '" + path + "' is not a valid expression for accesing variables.";
    if (instance) {
      lastInstance = instance;
      instance = instance[key];
    }
    if (isUndefined(instance)  && key.charAt(0) == '$') {
      var type = angular['Global']['typeOf'](lastInstance);
      type = angular[type.charAt(0).toUpperCase()+type.substring(1)];
      var fn = type ? type[[key.substring(1)]] : _undefined;
      if (fn) {
        instance = bind(lastInstance, fn, lastInstance);
        return instance;
      }
    }
  }
  if (!unboundFn && isFunction(instance)) {
    return bind(lastInstance, instance);
  }
  return instance;
}

function setter(instance, path, value){
  var element = path.split('.');
  for ( var i = 0; element.length > 1; i++) {
    var key = element.shift();
    var newInstance = instance[key];
    if (!newInstance) {
      newInstance = {};
      instance[key] = newInstance;
    }
    instance = newInstance;
  }
  instance[element.shift()] = value;
  return value;
}

///////////////////////////////////
var scopeId = 0,
    getterFnCache = {},
    compileCache = {},
    JS_KEYWORDS = {};
foreach(
    ("abstract,boolean,break,byte,case,catch,char,class,const,continue,debugger,default," +
    "delete,do,double,else,enum,export,extends,false,final,finally,float,for,function,goto," +
    "if,implements,import,ininstanceof,intinterface,long,native,new,null,package,private," +
    "protected,public,return,short,static,super,switch,synchronized,this,throw,throws," +
    "transient,true,try,typeof,var,volatile,void,undefined,while,with").split(/,/),
  function(key){ JS_KEYWORDS[key] = true;}
);
function getterFn(path){
  var fn = getterFnCache[path];
  if (fn) return fn;

  var code = 'var l, fn, t;\n';
  foreach(path.split('.'), function(key) {
    key = (JS_KEYWORDS[key]) ? '["' + key + '"]' : '.' + key;
    code += 'if(!s) return s;\n' +
            'l=s;\n' +
            's=s' + key + ';\n' +
            'if(typeof s=="function") s = function(){ return l'+key+'.apply(l, arguments); };\n';
    if (key.charAt(1) == '$') {
      // special code for super-imposed functions
      var name = key.substr(2);
      code += 'if(!s) {\n' +
              '  t = angular.Global.typeOf(l);\n' +
              '  fn = (angular[t.charAt(0).toUpperCase() + t.substring(1)]||{})["' + name + '"];\n' +
              '  if (fn) s = function(){ return fn.apply(l, [l].concat(Array.prototype.slice.call(arguments, 0, arguments.length))); };\n' +
              '}\n';
    }
  });
  code += 'return s;';
  fn = Function('s', code);
  fn["toString"] = function(){ return code; };

  return getterFnCache[path] = fn;
}

///////////////////////////////////

function expressionCompile(exp){
  if (typeof exp === $function) return exp;
  var fn = compileCache[exp];
  if (!fn) {
    var p = parser(exp);
    var fnSelf = p.statements();
    p.assertAllConsumed();
    fn = compileCache[exp] = extend(
      function(){ return fnSelf(this);},
      {fnSelf: fnSelf});
  }
  return fn;
}

function errorHandlerFor(element, error) {
  elementError(element, NG_EXCEPTION, isDefined(error) ? formatError(error) : error);
}

/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.scope
 *
 * @description
 * Scope is a JavaScript object and the execution context for expressions. You can think about
 * scopes as JavaScript objects that have extra APIs for registering watchers. A scope is the model
 * in the model-view-controller design pattern.
 *
 * A few other characteristics of scopes:
 *
 * - Scopes can be nested. A scope (prototypically) inherits properties from its parent scope.
 * - Scopes can be attached (bound) to the HTML DOM tree (the view).
 * - A scope {@link angular.scope.$become becomes} `this` for a controller.
 * - Scope's {@link angular.scope.$eval $eval} is used to update its view.
 * - Scopes can {@link angular.scope.$watch watch} properties and fire events.
 *
 * # Basic Operations
 * Scopes can be created by calling {@link angular.scope() angular.scope()} or by compiling HTML.
 *
 * {@link angular.widget Widgets} and data bindings register listeners on the current scope to get
 * notified of changes to the scope state. When notified, these listeners push the updated state
 * through to the DOM.
 *
 * Here is a simple scope snippet to show how you can interact with the scope.
 * <pre>
       var scope = angular.scope();
       scope.salutation = 'Hello';
       scope.name = 'World';

       expect(scope.greeting).toEqual(undefined);

       scope.$watch('name', function(){
         this.greeting = this.salutation + ' ' + this.name + '!';
       });

       expect(scope.greeting).toEqual('Hello World!');
       scope.name = 'Misko';
       // scope.$eval() will propagate the change to listeners
       expect(scope.greeting).toEqual('Hello World!');

       scope.$eval();
       expect(scope.greeting).toEqual('Hello Misko!');
 * </pre>
 *
 * # Inheritance
 * A scope can inherit from a parent scope, as in this example:
 * <pre>
     var parent = angular.scope();
     var child = angular.scope(parent);

     parent.salutation = "Hello";
     child.name = "World";
     expect(child.salutation).toEqual('Hello');

     child.salutation = "Welcome";
     expect(child.salutation).toEqual('Welcome');
     expect(parent.salutation).toEqual('Hello');
 * </pre>
 *
 * # Dependency Injection
 * Scope also acts as a simple dependency injection framework.
 *
 * **TODO**: more info needed
 *
 * # When scopes are evaluated
 * Anyone can update a scope by calling its {@link angular.scope.$eval $eval()} method. By default
 * angular widgets listen to user change events (e.g. the user enters text into text field), copy
 * the data from the widget to the scope (the MVC model), and then call the `$eval()` method on the
 * root scope to update dependents. This creates a spreadsheet-like behavior: the bound views update
 * immediately as the user types into the text field.
 *
 * Similarly, when a request to fetch data from a server is made and the response comes back, the
 * data is written into the model and then $eval() is called to push updates through to the view and
 * any other dependents.
 *
 * Because a change in the model that's triggered either by user input or by server response calls
 * `$eval()`, it is unnecessary to call `$eval()` from within your controller. The only time when
 * calling `$eval()` is needed, is when implementing a custom widget or service.
 *
 * Because scopes are inherited, the child scope `$eval()` overrides the parent `$eval()` method.
 * So to update the whole page you need to call `$eval()` on the root scope as `$root.$eval()`.
 *
 * Note: A widget that creates scopes (i.e. {@link angular.widget.@ng:repeat ng:repeat}) is
 * responsible for forwarding `$eval()` calls from the parent to those child scopes. That way,
 * calling $eval() on the root scope will update the whole page.
 *
 *
 * @TODO THESE PARAMS AND RETURNS ARE NOT RENDERED IN THE TEMPLATE!! FIX THAT!
 * @param {Object} parent The scope that should become the parent for the newly created scope.
 * @param {Object.<string, function()>=} providers Map of service factory which need to be provided
 *     for the current scope. Usually {@link angular.service}.
 * @param {Object.<string, *>=} instanceCache Provides pre-instantiated services which should
 *     append/override services provided by `providers`.
 * @returns {Object} Newly created scope.
 *
 *
 * @exampleDescription
 * This example demonstrates scope inheritance and property overriding.
 *
 * In this example, the root scope encompasses the whole HTML DOM tree. This scope has `salutation`,
 * `name`, and `names` properties. The {@link angular.widget@ng:repeat ng:repeat} creates a child
 * scope, one for each element in the names array. The repeater also assigns $index and name into
 * the child scope.
 *
 * Notice that:
 *
 * - While the name is set in the child scope it does not change the name defined in the root scope.
 * - The child scope inherits the salutation property from the root scope.
 * - The $index property does not leak from the child scope to the root scope.
 *
 * @example
   <ul ng:init="salutation='Hello'; name='Misko'; names=['World', 'Earth']">
     <li ng:repeat="name in names">
       {{$index}}: {{salutation}} {{name}}!
     </li>
   </ul>
   <pre>
   $index={{$index}}
   salutation={{salutation}}
   name={{name}}</pre>

   @scenario
   it('should inherit the salutation property and override the name property', function() {
     expect(using('.doc-example-live').repeater('li').row(0)).
       toEqual(['0', 'Hello', 'World']);
     expect(using('.doc-example-live').repeater('li').row(1)).
       toEqual(['1', 'Hello', 'Earth']);
     expect(using('.doc-example-live').element('pre').text()).
       toBe('$index=\nsalutation=Hello\nname=Misko');
   });

 */
function createScope(parent, providers, instanceCache) {
  function Parent(){}
  parent = Parent.prototype = (parent || {});
  var instance = new Parent();
  var evalLists = {sorted:[]};

  extend(instance, {
    'this': instance,
    $id: (scopeId++),
    $parent: parent,

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$bind
     * @function
     *
     * @description
     * Binds a function `fn` to the current scope. See: {@link angular.bind}.

       <pre>
         var scope = angular.scope();
         var fn = scope.$bind(function(){
           return this;
         });
         expect(fn()).toEqual(scope);
       </pre>
     *
     * @param {function()} fn Function to be bound.
     */
    $bind: bind(instance, bind, instance),


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$get
     * @function
     *
     * @description
     * Returns the value for `property_chain` on the current scope. Unlike in JavaScript, if there
     * are any `undefined` intermediary properties, `undefined` is returned instead of throwing an
     * exception.
     *
       <pre>
         var scope = angular.scope();
         expect(scope.$get('person.name')).toEqual(undefined);
         scope.person = {};
         expect(scope.$get('person.name')).toEqual(undefined);
         scope.person.name = 'misko';
         expect(scope.$get('person.name')).toEqual('misko');
       </pre>
     *
     * @param {string} property_chain String representing name of a scope property. Optionally
     *     properties can be chained with `.` (dot), e.g. `'person.name.first'`
     * @returns {*} Value for the (nested) property.
     */
    $get: bind(instance, getter, instance),


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$set
     * @function
     *
     * @description
     * Assigns a value to a property of the current scope specified via `property_chain`. Unlike in
     * JavaScript, if there are any `undefined` intermediary properties, empty objects are created
     * and assigned in to them instead of throwing an exception.
     *
       <pre>
         var scope = angular.scope();
         expect(scope.person).toEqual(undefined);
         scope.$set('person.name', 'misko');
         expect(scope.person).toEqual({name:'misko'});
         expect(scope.person.name).toEqual('misko');
       </pre>
     *
     * @param {string} property_chain String representing name of a scope property. Optionally
     *     properties can be chained with `.` (dot), e.g. `'person.name.first'`
     * @param {*} value Value to assign to the scope property.
     */
    $set: bind(instance, setter, instance),


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$eval
     * @function
     *
     * @description
     * Without the `exp` parameter triggers an eval cycle, for this scope and it's child scopes.
     *
     * With the `exp` parameter, compiles the expression to a function and calls it with `this` set
     * to the current scope and returns the result.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.a = 1;
         scope.b = 2;

         expect(scope.$eval('a+b')).toEqual(3);
         expect(scope.$eval(function(){ return this.a + this.b; })).toEqual(3);

         scope.$onEval('sum = a+b');
         expect(scope.sum).toEqual(undefined);
         scope.$eval();
         expect(scope.sum).toEqual(3);
       </pre>
     *
     * @param {(string|function())=} exp An angular expression to be compiled to a function or a js
     *     function.
     *
     * @returns {*} The result of calling compiled `exp` with `this` set to the current scope.
     */
    $eval: function(exp) {
      var type = typeof exp;
      var i, iSize;
      var j, jSize;
      var queue;
      var fn;
      if (type == $undefined) {
        for ( i = 0, iSize = evalLists.sorted.length; i < iSize; i++) {
          for ( queue = evalLists.sorted[i],
              jSize = queue.length,
              j= 0; j < jSize; j++) {
            instance.$tryEval(queue[j].fn, queue[j].handler);
          }
        }
      } else if (type === $function) {
        return exp.call(instance);
      } else  if (type === 'string') {
        return expressionCompile(exp).call(instance);
      }
    },


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$tryEval
     * @function
     *
     * @description
     * Evaluates the expression in the context of the current scope just like
     * {@link angular.scope.$eval()} with expression parameter, but also wraps it in a try/catch
     * block.
     *
     * If exception is thrown then `exceptionHandler` is used to handle the exception.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.error = function(){ throw 'myerror'; };
         scope.$exceptionHandler = function(e) {this.lastException = e; };

         expect(scope.$eval('error()'));
         expect(scope.lastException).toEqual('myerror');
         this.lastException = null;

         expect(scope.$eval('error()'),  function(e) {this.lastException = e; });
         expect(scope.lastException).toEqual('myerror');

         var body = angular.element(window.document.body);
         expect(scope.$eval('error()'), body);
         expect(body.attr('ng-exception')).toEqual('"myerror"');
         expect(body.hasClass('ng-exception')).toEqual(true);
       </pre>
     *
     * @param {string|function()} expression Angular expression to evaluate.
     * @param {function()|DOMElement} exceptionHandler Function to be called or DOMElement to be
     *     decorated.
     * @returns {*} The result of `expression` evaluation.
     */
    $tryEval: function (expression, exceptionHandler) {
      var type = typeof expression;
      try {
        if (type == $function) {
          return expression.call(instance);
        } else if (type == 'string'){
          return expressionCompile(expression).call(instance);
        }
      } catch (e) {
        (instance.$log || {error:error}).error(e);
        if (isFunction(exceptionHandler)) {
          exceptionHandler(e);
        } else if (exceptionHandler) {
          errorHandlerFor(exceptionHandler, e);
        } else if (isFunction(instance.$exceptionHandler)) {
          instance.$exceptionHandler(e);
        }
      }
    },


    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$watch
     * @function
     *
     * @description
     * Registers `listener` as a callback to be executed every time the `watchExp` changes. Be aware
     * that callback gets, by default, called upon registration, this can be prevented via the
     * `initRun` parameter.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.name = 'misko';
         scope.counter = 0;

         expect(scope.counter).toEqual(0);
         scope.$watch('name', 'counter = counter + 1');
         expect(scope.counter).toEqual(1);

         scope.$eval();
         expect(scope.counter).toEqual(1);

         scope.name = 'adam';
         scope.$eval();
         expect(scope.counter).toEqual(2);
       </pre>
     *
     * @param {function()|string} watchExp Expression that should be evaluated and checked for
     *    change during each eval cycle. Can be an angular string expression or a function.
     * @param {function()|string} listener Function (or angular string expression) that gets called
     *    every time the value of the `watchExp` changes. The function will be called with two
     *    parameters, `newValue` and `oldValue`.
     * @param {(function()|DOMElement)=} [exceptionHanlder=angular.service.$exceptionHandler] Handler
     *    that gets called when `watchExp` or `listener` throws an exception. If a DOMElement is
     *    specified as handler, the element gets decorated by angular with the information about the
     *    exception.
     * @param {boolean=} [initRun=true] Flag that prevents the first execution of the listener upon
     *    registration.
     *
     */
    $watch: function(watchExp, listener, exceptionHandler, initRun) {
      var watch = expressionCompile(watchExp),
          last = watch.call(instance);
      listener = expressionCompile(listener);
      function watcher(firstRun){
        var value = watch.call(instance),
            // we have to save the value because listener can call ourselves => inf loop
            lastValue = last;
        if (firstRun || lastValue !== value) {
          last = value;
          instance.$tryEval(function(){
            return listener.call(instance, value, lastValue);
          }, exceptionHandler);
        }
      }
      instance.$onEval(PRIORITY_WATCH, watcher);
      if (isUndefined(initRun)) initRun = true;
      if (initRun) watcher(true);
    },

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$onEval
     * @function
     *
     * @description
     * Evaluates the `expr` expression in the context of the current scope during each
     * {@link angular.scope.$eval eval cycle}.
     *
     * # Example
       <pre>
         var scope = angular.scope();
         scope.counter = 0;
         scope.$onEval('counter = counter + 1');
         expect(scope.counter).toEqual(0);
         scope.$eval();
         expect(scope.counter).toEqual(1);
       </pre>
     *
     * @param {number} [priority=0] Execution priority. Lower priority numbers get executed first.
     * @param {string|function()} expr Angular expression or function to be executed.
     * @param {(function()|DOMElement)=} [exceptionHandler=angular.service.$exceptionHandler] Handler
     *     function to call or DOM element to decorate when an exception occurs.
     *
     */
    $onEval: function(priority, expr, exceptionHandler){
      if (!isNumber(priority)) {
        exceptionHandler = expr;
        expr = priority;
        priority = 0;
      }
      var evalList = evalLists[priority];
      if (!evalList) {
        evalList = evalLists[priority] = [];
        evalList.priority = priority;
        evalLists.sorted.push(evalList);
        evalLists.sorted.sort(function(a,b){return a.priority-b.priority;});
      }
      evalList.push({
        fn: expressionCompile(expr),
        handler: exceptionHandler
      });
    },

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$become
     * @function
     * @deprecated This method will be removed before 1.0
     *
     * @description
     * Modifies the scope to act like an instance of the given class by:
     *
     * - copying the class's prototype methods
     * - applying the class's initialization function to the scope instance (without using the new
     *   operator)
     *
     * That makes the scope be a `this` for the given class's methods — effectively an instance of
     * the given class with additional (scope) stuff. A scope can later `$become` another class.
     *
     * `$become` gets used to make the current scope act like an instance of a controller class.
     * This allows for use of a controller class in two ways.
     *
     * - as an ordinary JavaScript class for standalone testing, instantiated using the new
     *   operator, with no attached view.
     * - as a controller for an angular model stored in a scope, "instantiated" by
     *   `scope.$become(ControllerClass)`.
     *
     * Either way, the controller's methods refer to the model  variables like `this.name`. When
     * stored in a scope, the model supports data binding. When bound to a view, {{name}} in the
     * HTML template refers to the same variable.
     */
    $become: function(Class) {
      if (isFunction(Class)) {
        instance.constructor = Class;
        foreach(Class.prototype, function(fn, name){
          instance[name] = bind(instance, fn);
        });
        instance.$inject.apply(instance, concat([Class, instance], arguments, 1));

        //TODO: backwards compatibility hack, remove when we don't depend on init methods
        if (isFunction(Class.prototype.init)) {
          instance.init();
        }
      }
    },

    /**
     * @workInProgress
     * @ngdoc function
     * @name angular.scope.$new
     * @function
     *
     * @description
     * Creates a new {@link angular.scope scope}, that:
     *
     * - is a child of the current scope
     * - will {@link angular.scope.$become $become} of type specified via `constructor`
     *
     * @param {function()} constructor Constructor function of the type the new scope should assume.
     * @returns {Object} The newly created child scope.
     *
     */
    $new: function(constructor) {
      var child = createScope(instance);
      child.$become.apply(instance, concat([constructor], arguments, 1));
      instance.$onEval(child.$eval);
      return child;
    }

  });

  if (!parent.$root) {
    instance.$root = instance;
    instance.$parent = instance;
    (instance.$inject = createInjector(instance, providers, instanceCache))();
  }

  return instance;
}
/**
 * @ngdoc function
 * @name angular.injector
 * @function
 *
 * @description
 * Creates an inject function that can be used for dependency injection.
 *
 * @param {Object=} [providerScope={}] provider's `this`
 * @param {Object.<string, function()>=} [providers=angular.service] Map of provider (factory)
 *     function.
 * @param {Object.<string, function()>=} [cache={}] Place where instances are saved for reuse. Can
 *     also be used to override services speciafied by `providers` (useful in tests).
 * @returns {function()} Injector function.
 *
 * @TODO These docs need a lot of work. Specifically the returned function should be described in
 *     great detail + we need to provide some examples.
 */
function createInjector(providerScope, providers, cache) {
  providers = providers || angularService;
  cache = cache || {};
  providerScope = providerScope || {};
  /**
   * injection function
   * @param value: string, array, object or function.
   * @param scope: optional function "this"
   * @param args: optional arguments to pass to function after injection
   *              parameters
   * @returns depends on value:
   *   string: return an instance for the injection key.
   *   array of keys: returns an array of instances.
   *   function: look at $inject property of function to determine instances
   *             and then call the function with instances and `scope`. Any
   *             additional arguments (`args`) are appended to the function 
   *             arguments.
   *   object: initialize eager providers and publish them the ones with publish here.
   *   none:   same as object but use providerScope as place to publish.
   */
  return function inject(value, scope, args){
    var returnValue, provider, creation;
    if (isString(value)) {
      if (!cache.hasOwnProperty(value)) {
        provider = providers[value];
        if (!provider) throw "Unknown provider for '"+value+"'.";
        cache[value] = inject(provider, providerScope);
      }
      returnValue = cache[value];
    } else if (isArray(value)) {
      returnValue = [];
      foreach(value, function(name) {
        returnValue.push(inject(name));
      });
    } else if (isFunction(value)) {
      returnValue = inject(value.$inject || []);
      returnValue = value.apply(scope, concat(returnValue, arguments, 2));
    } else if (isObject(value)) {
      foreach(providers, function(provider, name){
        creation = provider.$creation;
        if (creation == 'eager') {
          inject(name);
        }
        if (creation == 'eager-published') {
          setter(value, name, inject(name));
        }
      });
    } else {
      returnValue = inject(providerScope);
    }
    return returnValue;
  };
}var OPERATORS = {
    'null':function(self){return _null;},
    'true':function(self){return true;},
    'false':function(self){return false;},
    $undefined:noop,
    '+':function(self, a,b){return (isDefined(a)?a:0)+(isDefined(b)?b:0);},
    '-':function(self, a,b){return (isDefined(a)?a:0)-(isDefined(b)?b:0);},
    '*':function(self, a,b){return a*b;},
    '/':function(self, a,b){return a/b;},
    '%':function(self, a,b){return a%b;},
    '^':function(self, a,b){return a^b;},
    '=':function(self, a,b){return setter(self, a, b);},
    '==':function(self, a,b){return a==b;},
    '!=':function(self, a,b){return a!=b;},
    '<':function(self, a,b){return a<b;},
    '>':function(self, a,b){return a>b;},
    '<=':function(self, a,b){return a<=b;},
    '>=':function(self, a,b){return a>=b;},
    '&&':function(self, a,b){return a&&b;},
    '||':function(self, a,b){return a||b;},
    '&':function(self, a,b){return a&b;},
//    '|':function(self, a,b){return a|b;},
    '|':function(self, a,b){return b(self, a);},
    '!':function(self, a){return !a;}
};
var ESCAPE = {"n":"\n", "f":"\f", "r":"\r", "t":"\t", "v":"\v", "'":"'", '"':'"'};

function lex(text, parseStringsForObjects){
  var dateParseLength = parseStringsForObjects ? 24 : -1,
      tokens = [],
      token,
      index = 0,
      json = [],
      ch,
      lastCh = ':'; // can start regexp

  while (index < text.length) {
    ch = text.charAt(index);
    if (is('"\'')) {
      readString(ch);
    } else if (isNumber(ch) || is('.') && isNumber(peek())) {
      readNumber();
    } else if ( was('({[:,;') && is('/') ) {
      readRegexp();
    } else if (isIdent(ch)) {
      readIdent();
      if (was('{,') && json[0]=='{' &&
         (token=tokens[tokens.length-1])) {
        token.json = token.text.indexOf('.') == -1;
      }
    } else if (is('(){}[].,;:')) {
      tokens.push({index:index, text:ch, json:is('{}[]:,')});
      if (is('{[')) json.unshift(ch);
      if (is('}]')) json.shift();
      index++;
    } else if (isWhitespace(ch)) {
      index++;
      continue;
    } else {
      var ch2 = ch + peek(),
          fn = OPERATORS[ch],
          fn2 = OPERATORS[ch2];
      if (fn2) {
        tokens.push({index:index, text:ch2, fn:fn2});
        index += 2;
      } else if (fn) {
        tokens.push({index:index, text:ch, fn:fn, json: was('[,:') && is('+-')});
        index += 1;
      } else {
        throwError("Unexpected next character ", index, index+1);
      }
    }
    lastCh = ch;
  }
  return tokens;

  function is(chars) {
    return chars.indexOf(ch) != -1;
  }

  function was(chars) {
    return chars.indexOf(lastCh) != -1;
  }

  function peek() {
    return index + 1 < text.length ? text.charAt(index + 1) : false;
  }
  function isNumber(ch) {
    return '0' <= ch && ch <= '9';
  }
  function isWhitespace(ch) {
    return ch == ' ' || ch == '\r' || ch == '\t' ||
           ch == '\n' || ch == '\v' || ch == '\u00A0'; // IE treats non-breaking space as \u00A0
  }
  function isIdent(ch) {
    return 'a' <= ch && ch <= 'z' ||
           'A' <= ch && ch <= 'Z' ||
           '_' == ch || ch == '$';
  }
  function isExpOperator(ch) {
    return ch == '-' || ch == '+' || isNumber(ch);
  }

  function throwError(error, start, end) {
    end = end || index;
    throw Error("Lexer Error: " + error + " at column" +
        (isDefined(start) ?
            "s " + start +  "-" + index + " [" + text.substring(start, end) + "]" : 
            " " + end) + 
        " in expression [" + text + "].");
  }

  function readNumber() {
    var number = "";
    var start = index;
    while (index < text.length) {
      var ch = lowercase(text.charAt(index));
      if (ch == '.' || isNumber(ch)) {
        number += ch;
      } else {
        var peekCh = peek();
        if (ch == 'e' && isExpOperator(peekCh)) {
          number += ch;
        } else if (isExpOperator(ch) &&
            peekCh && isNumber(peekCh) &&
            number.charAt(number.length - 1) == 'e') {
          number += ch;
        } else if (isExpOperator(ch) &&
            (!peekCh || !isNumber(peekCh)) &&
            number.charAt(number.length - 1) == 'e') {
          throwError('Invalid exponent');
        } else {
          break;
        }
      }
      index++;
    }
    number = 1 * number;
    tokens.push({index:start, text:number, json:true,
      fn:function(){return number;}});
  }
  function readIdent() {
    var ident = "";
    var start = index;
    while (index < text.length) {
      var ch = text.charAt(index);
      if (ch == '.' || isIdent(ch) || isNumber(ch)) {
        ident += ch;
      } else {
        break;
      }
      index++;
    }
    var fn = OPERATORS[ident];
    if (!fn) {
      fn = getterFn(ident);
      fn.isAssignable = ident;
    }
    tokens.push({index:start, text:ident, fn:fn, json: OPERATORS[ident]});
  }
  
  function readString(quote) {
    var start = index;
    index++;
    var string = "";
    var rawString = quote;
    var escape = false;
    while (index < text.length) {
      var ch = text.charAt(index);
      rawString += ch;
      if (escape) {
        if (ch == 'u') {
          var hex = text.substring(index + 1, index + 5);
          if (!hex.match(/[\da-f]{4}/i))
            throwError( "Invalid unicode escape [\\u" + hex + "]");
          index += 4;
          string += String.fromCharCode(parseInt(hex, 16));
        } else {
          var rep = ESCAPE[ch];
          if (rep) {
            string += rep;
          } else {
            string += ch;
          }
        }
        escape = false;
      } else if (ch == '\\') {
        escape = true;
      } else if (ch == quote) {
        index++;
        tokens.push({index:start, text:rawString, string:string, json:true,
          fn:function(){
            return (string.length == dateParseLength) ?
              angular['String']['toDate'](string) : string;
          }});
        return;
      } else {
        string += ch;
      }
      index++;
    }
    throwError("Unterminated quote", start);
  }
  function readRegexp(quote) {
    var start = index;
    index++;
    var regexp = "";
    var escape = false;
    while (index < text.length) {
      var ch = text.charAt(index);
      if (escape) {
        regexp += ch;
        escape = false;
      } else if (ch === '\\') {
        regexp += ch;
        escape = true;
      } else if (ch === '/') {
        index++;
        var flags = "";
        if (isIdent(text.charAt(index))) {
          readIdent();
          flags = tokens.pop().text;
        }
        var compiledRegexp = new RegExp(regexp, flags);
        tokens.push({index:start, text:regexp, flags:flags,
          fn:function(){return compiledRegexp;}});
        return;
      } else {
        regexp += ch;
      }
      index++;
    }
    throwError("Unterminated RegExp", start);
  }
}

/////////////////////////////////////////

function parser(text, json){
  var ZERO = valueFn(0),
      tokens = lex(text, json);
  return {
      assertAllConsumed: assertAllConsumed,
      primary: primary,
      statements: statements,
      validator: validator,
      filter: filter,
      //TODO: delete me, since having watch in UI is logic in UI. (leftover form getangular)
      watch: watch
  };

  ///////////////////////////////////
  function throwError(msg, token) {
    throw Error("Parse Error: Token '" + token.text +
      "' " + msg + " at column " +
      (token.index + 1) + " of expression [" +
      text + "] starting at [" + text.substring(token.index) + "].");
  }

  function peekToken() {
    if (tokens.length === 0)
      throw Error("Unexpected end of expression: " + text);
    return tokens[0];
  }

  function peek(e1, e2, e3, e4) {
    if (tokens.length > 0) {
      var token = tokens[0];
      var t = token.text;
      if (t==e1 || t==e2 || t==e3 || t==e4 ||
          (!e1 && !e2 && !e3 && !e4)) {
        return token;
      }
    }
    return false;
  }

  function expect(e1, e2, e3, e4){
    var token = peek(e1, e2, e3, e4);
    if (token) {
      if (json && !token.json) {
        index = token.index;
        throwError("is not valid json", token);
      }
      tokens.shift();
      this.currentToken = token;
      return token;
    }
    return false;
  }

  function consume(e1){
    if (!expect(e1)) {
      throwError("is unexpected, expecting [" + e1 + "]", peek());
    }
  }

  function unaryFn(fn, right) {
    return function(self) {
      return fn(self, right(self));
    };
  }

  function binaryFn(left, fn, right) {
    return function(self) {
      return fn(self, left(self), right(self));
    };
  }

  function hasTokens () {
    return tokens.length > 0;
  }

  function assertAllConsumed(){
    if (tokens.length !== 0) {
      throwError("is extra token not part of expression", tokens[0]);
    }
  }

  function statements(){
    var statements = [];
    while(true) {
      if (tokens.length > 0 && !peek('}', ')', ';', ']'))
        statements.push(filterChain());
      if (!expect(';')) {
        return function (self){
          var value;
          for ( var i = 0; i < statements.length; i++) {
            var statement = statements[i];
            if (statement)
              value = statement(self);
          }
          return value;
        };
      }
    }
  }

  function filterChain(){
    var left = expression();
    var token;
    while(true) {
      if ((token = expect('|'))) {
        left = binaryFn(left, token.fn, filter());
      } else {
        return left;
      }
    }
  }

  function filter(){
    return pipeFunction(angularFilter);
  }

  function validator(){
    return pipeFunction(angularValidator);
  }

  function pipeFunction(fnScope){
    var fn = functionIdent(fnScope);
    var argsFn = [];
    var token;
    while(true) {
      if ((token = expect(':'))) {
        argsFn.push(expression());
      } else {
        var fnInvoke = function(self, input){
          var args = [input];
          for ( var i = 0; i < argsFn.length; i++) {
            args.push(argsFn[i](self));
          }
          return fn.apply(self, args);
        };
        return function(){
          return fnInvoke;
        };
      }
    }
  }

  function expression(){
    return assignment();
  }

  function assignment(){
    var left = logicalOR();
    var token;
    if (token = expect('=')) {
      if (!left.isAssignable) {
        throwError("implies assignment but [" +
          text.substring(0, token.index) + "] can not be assigned to", token);
      }
      var ident = function(){return left.isAssignable;};
      return binaryFn(ident, token.fn, logicalOR());
    } else {
      return left;
    }
  }

  function logicalOR(){
    var left = logicalAND();
    var token;
    while(true) {
      if ((token = expect('||'))) {
        left = binaryFn(left, token.fn, logicalAND());
      } else {
        return left;
      }
    }
  }

  function logicalAND(){
    var left = equality();
    var token;
    if ((token = expect('&&'))) {
      left = binaryFn(left, token.fn, logicalAND());
    }
    return left;
  }

  function equality(){
    var left = relational();
    var token;
    if ((token = expect('==','!='))) {
      left = binaryFn(left, token.fn, equality());
    }
    return left;
  }

  function relational(){
    var left = additive();
    var token;
    if (token = expect('<', '>', '<=', '>=')) {
      left = binaryFn(left, token.fn, relational());
    }
    return left;
  }

  function additive(){
    var left = multiplicative();
    var token;
    while(token = expect('+','-')) {
      left = binaryFn(left, token.fn, multiplicative());
    }
    return left;
  }

  function multiplicative(){
    var left = unary();
    var token;
    while(token = expect('*','/','%')) {
      left = binaryFn(left, token.fn, unary());
    }
    return left;
  }

  function unary(){
    var token;
    if (expect('+')) {
      return primary();
    } else if (token = expect('-')) {
      return binaryFn(ZERO, token.fn, unary());
    } else if (token = expect('!')) {
      return unaryFn(token.fn, unary());
    } else {
      return primary();
    }
  }

  function functionIdent(fnScope) {
    var token = expect();
    var element = token.text.split('.');
    var instance = fnScope;
    var key;
    for ( var i = 0; i < element.length; i++) {
      key = element[i];
      if (instance)
        instance = instance[key];
    }
    if (typeof instance != $function) {
      throwError("should be a function", token);
    }
    return instance;
  }

  function primary() {
    var primary;
    if (expect('(')) {
      var expression = filterChain();
      consume(')');
      primary = expression;
    } else if (expect('[')) {
      primary = arrayDeclaration();
    } else if (expect('{')) {
      primary = object();
    } else {
      var token = expect();
      primary = token.fn;
      if (!primary) {
        throwError("not a primary expression", token);
      }
    }
    var next;
    while (next = expect('(', '[', '.')) {
      if (next.text === '(') {
        primary = functionCall(primary);
      } else if (next.text === '[') {
        primary = objectIndex(primary);
      } else if (next.text === '.') {
        primary = fieldAccess(primary);
      } else {
        throwError("IMPOSSIBLE");
      }
    }
    return primary;
  }

  function fieldAccess(object) {
    var field = expect().text;
    var getter = getterFn(field);
    var fn = function (self){
      return getter(object(self));
    };
    fn.isAssignable = field;
    return fn;
  }

  function objectIndex(obj) {
    var indexFn = expression();
    consume(']');
    if (expect('=')) {
      var rhs = expression();
      return function (self){
        return obj(self)[indexFn(self)] = rhs(self);
      };
    } else {
      return function (self){
        var o = obj(self);
        var i = indexFn(self);
        return (o) ? o[i] : _undefined;
      };
    }
  }

  function functionCall(fn) {
    var argsFn = [];
    if (peekToken().text != ')') {
      do {
        argsFn.push(expression());
      } while (expect(','));
    }
    consume(')');
    return function (self){
      var args = [];
      for ( var i = 0; i < argsFn.length; i++) {
        args.push(argsFn[i](self));
      }
      var fnPtr = fn(self) || noop;
      // IE stupidity!
      return fnPtr.apply ?
          fnPtr.apply(self, args) :
            fnPtr(args[0], args[1], args[2], args[3], args[4]);
    };
  }

  // This is used with json array declaration
  function arrayDeclaration () {
    var elementFns = [];
    if (peekToken().text != ']') {
      do {
        elementFns.push(expression());
      } while (expect(','));
    }
    consume(']');
    return function (self){
      var array = [];
      for ( var i = 0; i < elementFns.length; i++) {
        array.push(elementFns[i](self));
      }
      return array;
    };
  }

  function object () {
    var keyValues = [];
    if (peekToken().text != '}') {
      do {
        var token = expect(),
        key = token.string || token.text;
        consume(":");
        var value = expression();
        keyValues.push({key:key, value:value});
      } while (expect(','));
    }
    consume('}');
    return function (self){
      var object = {};
      for ( var i = 0; i < keyValues.length; i++) {
        var keyValue = keyValues[i];
        var value = keyValue.value(self);
        object[keyValue.key] = value;
      }
      return object;
    };
  }

  //TODO: delete me, since having watch in UI is logic in UI. (leftover form getangular)
  function watch () {
    var decl = [];
    while(hasTokens()) {
      decl.push(watchDecl());
      if (!expect(';')) {
        assertAllConsumed();
      }
    }
    assertAllConsumed();
    return function (self){
      for ( var i = 0; i < decl.length; i++) {
        var d = decl[i](self);
        self.addListener(d.name, d.fn);
      }
    };
  }

  function watchDecl () {
    var anchorName = expect().text;
    consume(":");
    var expressionFn;
    if (peekToken().text == '{') {
      consume("{");
      expressionFn = statements();
      consume("}");
    } else {
      expressionFn = expression();
    }
    return function(self) {
      return {name:anchorName, fn:expressionFn};
    };
  }
}






function Route(template, defaults) {
  this.template = template = template + '#';
  this.defaults = defaults || {};
  var urlParams = this.urlParams = {};
  foreach(template.split(/\W/), function(param){
    if (param && template.match(new RegExp(":" + param + "\\W"))) {
      urlParams[param] = true;
    }
  });
}

Route.prototype = {
  url: function(params) {
    var path = [];
    var self = this;
    var url = this.template;
    params = params || {};
    foreach(this.urlParams, function(_, urlParam){
      var value = params[urlParam] || self.defaults[urlParam] || "";
      url = url.replace(new RegExp(":" + urlParam + "(\\W)"), value + "$1");
    });
    url = url.replace(/\/?#$/, '');
    var query = [];
    foreachSorted(params, function(value, key){
      if (!self.urlParams[key]) {
        query.push(encodeURI(key) + '=' + encodeURI(value));
      }
    });
    url = url.replace(/\/*$/, '');
    return url + (query.length ? '?' + query.join('&') : '');
  }
};

function ResourceFactory(xhr) {
  this.xhr = xhr;
}

ResourceFactory.DEFAULT_ACTIONS = {
  'get':    {method:'GET'},
  'save':   {method:'POST'},
  'query':  {method:'GET', isArray:true},
  'remove': {method:'DELETE'},
  'delete': {method:'DELETE'}
};

ResourceFactory.prototype = {
  route: function(url, paramDefaults, actions){
    var self = this;
    var route = new Route(url);
    actions = extend({}, ResourceFactory.DEFAULT_ACTIONS, actions);
    function extractParams(data){
      var ids = {};
      foreach(paramDefaults || {}, function(value, key){
        ids[key] = value.charAt && value.charAt(0) == '@' ? getter(data, value.substr(1)) : value;
      });
      return ids;
    }

    function Resource(value){
      copy(value || {}, this);
    }

    foreach(actions, function(action, name){
      var isPostOrPut = action.method == 'POST' || action.method == 'PUT';
      Resource[name] = function (a1, a2, a3) {
        var params = {};
        var data;
        var callback = noop;
        switch(arguments.length) {
        case 3: callback = a3;
        case 2:
          if (isFunction(a2)) {
            callback = a2;
          } else {
            params = a1;
            data = a2;
            break;
          }
        case 1:
          if (isFunction(a1)) callback = a1;
          else if (isPostOrPut) data = a1;
          else params = a1;
          break;
        case 0: break;
        default:
          throw "Expected between 0-3 arguments [params, data, callback], got " + arguments.length + " arguments.";
        }

        var value = this instanceof Resource ? this : (action.isArray ? [] : new Resource(data));
        self.xhr(
          action.method,
          route.url(extend({}, action.params || {}, extractParams(data), params)),
          data,
          function(status, response, clear) {
            if (status == 200) {
              if (action.isArray) {
                value.length = 0;
                foreach(response, function(item){
                  value.push(new Resource(item));
                });
              } else {
                copy(response, value);
              }
              (callback||noop)(value);
            } else {
              throw {status: status, response:response, message: status + ": " + response};
            }
          },
          action.verifyCache);
        return value;
      };

      Resource.bind = function(additionalParamDefaults){
        return self.route(url, extend({}, paramDefaults, additionalParamDefaults), actions);
      };

      Resource.prototype['$' + name] = function(a1, a2){
        var params = extractParams(this);
        var callback = noop;
        switch(arguments.length) {
        case 2: params = a1; callback = a2;
        case 1: if (typeof a1 == $function) callback = a1; else params = a1;
        case 0: break;
        default:
          throw "Expected between 1-2 arguments [params, callback], got " + arguments.length + " arguments.";
        }
        var data = isPostOrPut ? this : _undefined;
        Resource[name].call(this, params, data, callback);
      };
    });
    return Resource;
  }
};
//////////////////////////////
// Browser
//////////////////////////////
var XHR = window.XMLHttpRequest || function () {
  try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); } catch (e1) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); } catch (e2) {}
  try { return new ActiveXObject("Msxml2.XMLHTTP"); } catch (e3) {}
  throw new Error("This browser does not support XMLHttpRequest.");
};

function Browser(location, document, head, XHR, $log, setTimeout) {
  var self = this;
  self.isMock = false;

  //////////////////////////////////////////////////////////////
  // XHR API
  //////////////////////////////////////////////////////////////
  var idCounter = 0;
  var outstandingRequestCount = 0;
  var outstandingRequestCallbacks = [];


  /**
   * Executes the `fn` function (supports currying) and decrements the `outstandingRequestCallbacks`
   * counter. If the counter reaches 0, all the `outstandingRequestCallbacks` are executed.
   */
  function completeOutstandingRequest(fn) {
    try {
      fn.apply(null, slice.call(arguments, 1));
    } finally {
      outstandingRequestCount--;
      if (outstandingRequestCount === 0) {
        while(outstandingRequestCallbacks.length) {
          try {
            outstandingRequestCallbacks.pop()();
          } catch (e) {
            $log.error(e);
          }
        }
      }
    }
  }

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#xhr
   * @methodOf angular.service.$browser
   * 
   * @param {string} method Requested method (get|post|put|delete|head|json)
   * @param {string} url Requested url
   * @param {string=} post Post data to send 
   * @param {function(number, string)} callback Function that will be called on response
   * 
   * @description
   * Send ajax request
   */
  self.xhr = function(method, url, post, callback) {
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (lowercase(method) == 'json') {
      var callbackId = "angular_" + Math.random() + '_' + (idCounter++);
      callbackId = callbackId.replace(/\d\./, '');
      var script = document[0].createElement('script');
      script.type = 'text/javascript';
      script.src = url.replace('JSON_CALLBACK', callbackId);
      window[callbackId] = function(data){
        window[callbackId] = _undefined;
        callback(200, data);
      };
      head.append(script);
    } else {
      var xhr = new XHR();
      xhr.open(method, url, true);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.setRequestHeader("Accept", "application/json, text/plain, */*");
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      outstandingRequestCount ++;
      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
          completeOutstandingRequest(callback, xhr.status || 200, xhr.responseText);
        }
      };
      xhr.send(post || '');
    }
  };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#notifyWhenNoOutstandingRequests
   * @methodOf angular.service.$browser
   * 
   * @param {function()} callback Function that will be called when no outstanding request
   */
  self.notifyWhenNoOutstandingRequests = function(callback) {
    if (outstandingRequestCount === 0) {
      callback();
    } else {
      outstandingRequestCallbacks.push(callback);
    }
  };

  //////////////////////////////////////////////////////////////
  // Poll Watcher API
  //////////////////////////////////////////////////////////////
  var pollFns = [];

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#poll
   * @methodOf angular.service.$browser
   */
  self.poll = function() {
    foreach(pollFns, function(pollFn){ pollFn(); });
  };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#addPollFn
   * @methodOf angular.service.$browser
   * 
   * @param {function()} fn Poll function to add
   * 
   * @description
   * Adds a function to the list of functions that poller periodically executes
   * 
   * @returns {function()} the added function
   */
  self.addPollFn = function(fn) {
    pollFns.push(fn);
    return fn;
  };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#startPoller
   * @methodOf angular.service.$browser
   * 
   * @param {number} interval How often should browser call poll functions (ms)
   * @param {function()} setTimeout Reference to a real or fake `setTimeout` function.
   * 
   * @description
   * Configures the poller to run in the specified intervals, using the specified
   * setTimeout fn and kicks it off.
   */
  self.startPoller = function(interval, setTimeout) {
    (function check(){
      self.poll();
      setTimeout(check, interval);
    })();
  };

  //////////////////////////////////////////////////////////////
  // URL API
  //////////////////////////////////////////////////////////////
  
  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#setUrl
   * @methodOf angular.service.$browser
   * 
   * @param {string} url New url
   * 
   * @description
   * Sets browser's url
   */
  self.setUrl = function(url) {
    var existingURL = location.href;
    if (!existingURL.match(/#/)) existingURL += '#';
    if (!url.match(/#/)) url += '#';
    location.href = url;
   };

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#getUrl
   * @methodOf angular.service.$browser
   * 
   * @description
   * Get current browser's url
   * 
   * @returns {string} Browser's url
   */
  self.getUrl = function() {
    return location.href;
  };

  //////////////////////////////////////////////////////////////
  // Cookies API
  //////////////////////////////////////////////////////////////
  var rawDocument = document[0];
  var lastCookies = {};
  var lastCookieString = '';

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#cookies
   * @methodOf angular.service.$browser
   * 
   * @param {string=} name Cookie name
   * @param {string=} value Cokkie value
   * 
   * @description
   * The cookies method provides a 'private' low level access to browser cookies.
   * It is not meant to be used directly, use the $cookie service instead.
   *
   * The return values vary depending on the arguments that the method was called with as follows:
   * <ul>
   *   <li>cookies() -> hash of all cookies, this is NOT a copy of the internal state, so do not modify it</li>
   *   <li>cookies(name, value) -> set name to value, if value is undefined delete the cookie</li>
   *   <li>cookies(name) -> the same as (name, undefined) == DELETES (no one calls it right now that way)</li>
   * </ul>
   * 
   * @returns {Object} Hash of all cookies (if called without any parameter)
   */
  self.cookies = function (name, value) {
    var cookieLength, cookieArray, i, keyValue;

    if (name) {
      if (value === _undefined) {
        rawDocument.cookie = escape(name) + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
      } else {
        if (isString(value)) {
          rawDocument.cookie = escape(name) + '=' + escape(value);

          cookieLength = name.length + value.length + 1;
          if (cookieLength > 4096) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because it was too large ("+
              cookieLength + " > 4096 bytes)!");
          }
          if (lastCookies.length > 20) {
            $log.warn("Cookie '"+ name +"' possibly not set or overflowed because too many cookies " +
              "were already set (" + lastCookies.length + " > 20 )");
          }
        }
      }
    } else {
      if (rawDocument.cookie !== lastCookieString) {
        lastCookieString = rawDocument.cookie;
        cookieArray = lastCookieString.split("; ");
        lastCookies = {};

        for (i = 0; i < cookieArray.length; i++) {
          keyValue = cookieArray[i].split("=");
          if (keyValue.length === 2) { //ignore nameless cookies
            lastCookies[unescape(keyValue[0])] = unescape(keyValue[1]);
          }
        }
      }
      return lastCookies;
    }
  };


  /**
   * @workInProgress
   * @ngdoc
   * @name angular.service.$browser#defer
   * @methodOf angular.service.$browser
   *
   * @description
   * Executes a fn asynchroniously via `setTimeout(fn, 0)`.
   *
   * Unlike when calling `setTimeout` directly, in test this function is mocked and instead of using
   * `setTimeout` in tests, the fns are queued in an array, which can be programaticaly flushed via
   * `$browser.defer.flush()`.
   *
   * @param {function()} fn A function, who's execution should be defered.
   */
  self.defer = function(fn) {
    outstandingRequestCount++;
    setTimeout(function() { completeOutstandingRequest(fn); }, 0);
  };

  //////////////////////////////////////////////////////////////
  // Misc API
  //////////////////////////////////////////////////////////////
  var hoverListener = noop;
  
  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#hover
   * @methodOf angular.service.$browser
   *
   * @description
   * Set hover listener.
   *
   * @param {function(Object, boolean)} listener Function that will be called when hover event
   *    occurs.
   */
  self.hover = function(listener) { hoverListener = listener; };
  
  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#bind
   * @methodOf angular.service.$browser
   * 
   * @description
   * Register hover function to real browser
   */
  self.bind = function() {
    document.bind("mouseover", function(event){
      hoverListener(jqLite(msie ? event.srcElement : event.target), true);
      return true;
    });
    document.bind("mouseleave mouseout click dblclick keypress keyup", function(event){
      hoverListener(jqLite(event.target), false);
      return true;
    });
  };


  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#addCss
   * @methodOf angular.service.$browser
   * 
   * @param {string} url Url to css file
   * @description
   * Adds a stylesheet tag to the head.
   */
  self.addCss = function(url) {
    var link = jqLite(rawDocument.createElement('link'));
    link.attr('rel', 'stylesheet');
    link.attr('type', 'text/css');
    link.attr('href', url);
    head.append(link);
  };


  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$browser#addJs
   * @methodOf angular.service.$browser
   * 
   * @param {string} url Url to js file
   * @param {string=} dom_id Optional id for the script tag 
   * 
   * @description
   * Adds a script tag to the head.
   */
  self.addJs = function(url, dom_id) {
    var script = jqLite(rawDocument.createElement('script'));
    script.attr('type', 'text/javascript');
    script.attr('src', url);
    if (dom_id) script.attr('id', dom_id);
    head.append(script);
  };
}
/*
 * HTML Parser By Misko Hevery (misko@hevery.com)
 * based on:  HTML Parser By John Resig (ejohn.org)
 * Original code by Erik Arvidsson, Mozilla Public License
 * http://erik.eae.net/simplehtmlparser/simplehtmlparser.js
 *
 * // Use like so:
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 */

// Regular Expressions for parsing tags and attributes
var START_TAG_REGEXP = /^<\s*([\w:]+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)\s*>/,
  END_TAG_REGEXP = /^<\s*\/\s*([\w:]+)[^>]*>/,
  ATTR_REGEXP = /(\w+)(?:\s*=\s*(?:(?:"((?:[^"])*)")|(?:'((?:[^'])*)')|([^>\s]+)))?/g,
  BEGIN_TAG_REGEXP = /^</,
  BEGING_END_TAGE_REGEXP = /^<\s*\//,
  COMMENT_REGEXP = /<!--(.*?)-->/g,
  CDATA_REGEXP = /<!\[CDATA\[(.*?)]]>/g,
  URI_REGEXP = /^((ftp|https?):\/\/|mailto:|#)/,
  NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g; // Match everything outside of normal chars and " (quote character)

// Empty Elements - HTML 4.01
var emptyElements = makeMap("area,br,col,hr,img");

// Block Elements - HTML 4.01
var blockElements = makeMap("address,blockquote,center,dd,del,dir,div,dl,dt,"+
    "hr,ins,li,map,menu,ol,p,pre,script,table,tbody,td,tfoot,th,thead,tr,ul");

// Inline Elements - HTML 4.01
var inlineElements = makeMap("a,abbr,acronym,b,bdo,big,br,cite,code,del,dfn,em,font,i,img,"+
    "ins,kbd,label,map,q,s,samp,small,span,strike,strong,sub,sup,tt,u,var");
// Elements that you can, intentionally, leave open
// (and which close themselves)
var closeSelfElements = makeMap("colgroup,dd,dt,li,p,td,tfoot,th,thead,tr");
// Special Elements (can contain anything)
var specialElements = makeMap("script,style");
var validElements = extend({}, emptyElements, blockElements, inlineElements, closeSelfElements);

//see: http://www.w3.org/TR/html4/index/attributes.html
//Attributes that have their values filled in disabled="disabled"
var fillAttrs = makeMap("compact,ismap,nohref,nowrap");
//Attributes that have href and hence need to be sanitized
var uriAttrs = makeMap("background,href,longdesc,src,usemap");
var validAttrs = extend({}, fillAttrs, uriAttrs, makeMap(
    'abbr,align,alt,axis,bgcolor,border,cellpadding,cellspacing,class,clear,'+
    'color,cols,colspan,coords,dir,face,headers,height,hreflang,hspace,'+
    'lang,language,rel,rev,rows,rowspan,rules,'+
    'scope,scrolling,shape,span,start,summary,target,title,type,'+
    'valign,value,vspace,width'));

/**
 * @example
 * htmlParser(htmlString, {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * });
 *
 * @param {string} html string
 * @param {object} handler
 */
function htmlParser( html, handler ) {
  var index, chars, match, stack = [], last = html;
  stack.last = function(){ return stack[ stack.length - 1 ]; };

  while ( html ) {
    chars = true;

    // Make sure we're not in a script or style element
    if ( !stack.last() || !specialElements[ stack.last() ] ) {

      // Comment
      if ( html.indexOf("<!--") === 0 ) {
        index = html.indexOf("-->");

        if ( index >= 0 ) {
          if ( handler.comment )
            handler.comment( html.substring( 4, index ) );
          html = html.substring( index + 3 );
          chars = false;
        }

      // end tag
      } else if ( BEGING_END_TAGE_REGEXP.test(html) ) {
        match = html.match( END_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( END_TAG_REGEXP, parseEndTag );
          chars = false;
        }

      // start tag
      } else if ( BEGIN_TAG_REGEXP.test(html) ) {
        match = html.match( START_TAG_REGEXP );

        if ( match ) {
          html = html.substring( match[0].length );
          match[0].replace( START_TAG_REGEXP, parseStartTag );
          chars = false;
        }
      }

      if ( chars ) {
        index = html.indexOf("<");

        var text = index < 0 ? html : html.substring( 0, index );
        html = index < 0 ? "" : html.substring( index );

        handler.chars( decodeEntities(text) );
      }

    } else {
      html = html.replace(new RegExp("(.*)<\\s*\\/\\s*" + stack.last() + "[^>]*>", 'i'), function(all, text){
        text = text.
          replace(COMMENT_REGEXP, "$1").
          replace(CDATA_REGEXP, "$1");

        handler.chars( decodeEntities(text) );

        return "";
      });

      parseEndTag( "", stack.last() );
    }

    if ( html == last ) {
      throw "Parse Error: " + html;
    }
    last = html;
  }

  // Clean up any remaining tags
  parseEndTag();

  function parseStartTag( tag, tagName, rest, unary ) {
    tagName = lowercase(tagName);
    if ( blockElements[ tagName ] ) {
      while ( stack.last() && inlineElements[ stack.last() ] ) {
        parseEndTag( "", stack.last() );
      }
    }

    if ( closeSelfElements[ tagName ] && stack.last() == tagName ) {
      parseEndTag( "", tagName );
    }

    unary = emptyElements[ tagName ] || !!unary;

    if ( !unary )
      stack.push( tagName );

    var attrs = {};

    rest.replace(ATTR_REGEXP, function(match, name) {
      var value = arguments[2] ? arguments[2] :
        arguments[3] ? arguments[3] :
        arguments[4] ? arguments[4] :
        fillAttrs[name] ? name : "";

      attrs[name] = decodeEntities(value); //value.replace(/(^|[^\\])"/g, '$1\\\"') //"
    });

    handler.start( tagName, attrs, unary );
  }

  function parseEndTag( tag, tagName ) {
    var pos = 0, i;
    tagName = lowercase(tagName);
    if ( tagName )
      // Find the closest opened tag of the same type
      for ( pos = stack.length - 1; pos >= 0; pos-- )
        if ( stack[ pos ] == tagName )
          break;

    if ( pos >= 0 ) {
      // Close all the open elements, up the stack
      for ( i = stack.length - 1; i >= pos; i-- )
        handler.end( stack[ i ] );

      // Remove the open elements from the stack
      stack.length = pos;
    }
  }
}

/**
 * @param str 'key1,key2,...'
 * @returns {object} in the form of {key1:true, key2:true, ...}
 */
function makeMap(str){
  var obj = {}, items = str.split(","), i;
  for ( i = 0; i < items.length; i++ )
    obj[ items[i] ] = true;
  return obj;
}

/**
 * decodes all entities into regular string
 * @param value
 * @returns {string} A string with decoded entities.
 */
var hiddenPre=document.createElement("pre");
function decodeEntities(value) {
  hiddenPre.innerHTML=value.replace(/</g,"&lt;");
  return hiddenPre.innerText || hiddenPre.textContent;
}

/**
 * Escapes all potentially dangerous characters, so that the 
 * resulting string can be safely inserted into attribute or
 * element text.
 * @param value
 * @returns escaped text
 */
function encodeEntities(value) {
  return value.
    replace(/&/g, '&amp;').
    replace(NON_ALPHANUMERIC_REGEXP, function(value){
      return '&#' + value.charCodeAt(0) + ';';
    }).
    replace(/</g, '&lt;').
    replace(/>/g, '&gt;');
}

/**
 * create an HTML/XML writer which writes to buffer
 * @param {Array} buf use buf.jain('') to get out sanitized html string
 * @returns {object} in the form of {
 *     start: function(tag, attrs, unary) {},
 *     end: function(tag) {},
 *     chars: function(text) {},
 *     comment: function(text) {}
 * }
 */
function htmlSanitizeWriter(buf){
  var ignore = false;
  var out = bind(buf, buf.push);
  return {
    start: function(tag, attrs, unary){
      tag = lowercase(tag);
      if (!ignore && specialElements[tag]) {
        ignore = tag;
      }
      if (!ignore && validElements[tag] == true) {
        out('<');
        out(tag);
        foreach(attrs, function(value, key){
          var lkey=lowercase(key);
          if (validAttrs[lkey]==true && (uriAttrs[lkey]!==true || value.match(URI_REGEXP))) {
            out(' ');
            out(key);
            out('="');
            out(encodeEntities(value));
            out('"');
          }
        });
        out(unary ? '/>' : '>');
      }
    },
    end: function(tag){
        tag = lowercase(tag);
        if (!ignore && validElements[tag] == true) {
          out('</');
          out(tag);
          out('>');
        }
        if (tag == ignore) {
          ignore = false;
        }
      },
    chars: function(chars){
        if (!ignore) {
          out(encodeEntities(chars));
        }
      }
  };
}
//////////////////////////////////
//JQLite
//////////////////////////////////

var jqCache = {},
    jqName = 'ng-' + new Date().getTime(),
    jqId = 1,
    addEventListener = (window.document.attachEvent ?
      function(element, type, fn) {element.attachEvent('on' + type, fn);} :
      function(element, type, fn) {element.addEventListener(type, fn, false);}),
    removeEventListener = (window.document.detachEvent ?
      function(element, type, fn) {element.detachEvent('on' + type, fn); } :
      function(element, type, fn) { element.removeEventListener(type, fn, false); });

function jqNextId() { return (jqId++); }

function jqClearData(element) {
  var cacheId = element[jqName],
      cache = jqCache[cacheId];
  if (cache) {
    foreach(cache.bind || {}, function(fn, type){
      removeEventListener(element, type, fn);
    });
    delete jqCache[cacheId];
    if (msie)
      element[jqName] = ''; // ie does not allow deletion of attributes on elements.
    else
      delete element[jqName];
  }
}

function getStyle(element) {
  var current = {}, style = element[0].style, value, name, i;
  if (typeof style.length == 'number') {
    for(i = 0; i < style.length; i++) {
      name = style[i];
      current[name] = style[name];
    }
  } else {
    for (name in style) {
      value = style[name];
      if (1*name != name && name != 'cssText' && value && typeof value == 'string' && value !='false')
        current[name] = value;
    }
  }
  return current;
}

function JQLite(element) {
  if (isElement(element)) {
    this[0] = element;
    this.length = 1;
  } else if (isDefined(element.length) && element.item) {
    for(var i=0; i < element.length; i++) {
      this[i] = element[i];
    }
    this.length = element.length;
  }
}

JQLite.prototype = {
  data: function(key, value) {
    var element = this[0],
        cacheId = element[jqName],
        cache = jqCache[cacheId || -1];
    if (isDefined(value)) {
      if (!cache) {
        element[jqName] = cacheId = jqNextId();
        cache = jqCache[cacheId] = {};
      }
      cache[key] = value;
    } else {
      return cache ? cache[key] : _null;
    }
  },

  removeData: function(){
    jqClearData(this[0]);
  },

  dealoc: function(){
    (function dealoc(element){
      jqClearData(element);
      for ( var i = 0, children = element.childNodes; i < children.length; i++) {
        dealoc(children[i]);
      }
    })(this[0]);
  },

  bind: function(type, fn){
    var self = this,
        element = self[0],
        bind = self.data('bind'),
        eventHandler;
    if (!bind) this.data('bind', bind = {});
    foreach(type.split(' '), function(type){
      eventHandler = bind[type];
      if (!eventHandler) {
        bind[type] = eventHandler = function(event) {
          if (!event.preventDefault) {
            event.preventDefault = function(){
              event.returnValue = false; //ie
            };
          }
          if (!event.stopPropagation) {
            event.stopPropagation = function() {
              event.cancelBubble = true; //ie
            };
          }
          foreach(eventHandler.fns, function(fn){
            fn.call(self, event);
          });
        };
        eventHandler.fns = [];
        addEventListener(element, type, eventHandler);
      }
      eventHandler.fns.push(fn);
    });
  },

  replaceWith: function(replaceNode) {
    this[0].parentNode.replaceChild(jqLite(replaceNode)[0], this[0]);
  },

  children: function() {
    return new JQLite(this[0].childNodes);
  },

  append: function(node) {
    var self = this[0];
    node = jqLite(node);
    foreach(node, function(child){
      self.appendChild(child);
    });
  },

  remove: function() {
    this.dealoc();
    var parentNode = this[0].parentNode;
    if (parentNode) parentNode.removeChild(this[0]);
  },

  removeAttr: function(name) {
    this[0].removeAttribute(name);
  },

  after: function(element) {
    this[0].parentNode.insertBefore(jqLite(element)[0], this[0].nextSibling);
  },

  hasClass: function(selector) {
    var className = " " + selector + " ";
    if ( (" " + this[0].className + " ").replace(/[\n\t]/g, " ").indexOf( className ) > -1 ) {
      return true;
    }
    return false;
  },

  removeClass: function(selector) {
    this[0].className = trim((" " + this[0].className + " ").replace(/[\n\t]/g, " ").replace(" " + selector + " ", ""));
  },

  toggleClass: function(selector, condition) {
   var self = this;
   (condition ? self.addClass : self.removeClass).call(self, selector);
  },

  addClass: function( selector ) {
    if (!this.hasClass(selector)) {
      this[0].className = trim(this[0].className + ' ' + selector);
    }
  },

  css: function(name, value) {
    var style = this[0].style;
    if (isString(name)) {
      if (isDefined(value)) {
        style[name] = value;
      } else {
        return style[name];
      }
    } else {
      extend(style, name);
    }
  },

  attr: function(name, value){
    var e = this[0];
    if (isObject(name)) {
      foreach(name, function(value, name){
        e.setAttribute(name, value);
      });
    } else if (isDefined(value)) {
      e.setAttribute(name, value);
    } else {
      // the extra argument is to get the right thing for a.href in IE, see jQuery code
      return e.getAttribute(name, 2);
    }
  },

  text: function(value) {
    if (isDefined(value)) {
      this[0].textContent = value;
    }
    return this[0].textContent;
  },

  val: function(value) {
    if (isDefined(value)) {
      this[0].value = value;
    }
    return this[0].value;
  },

  html: function(value) {
    if (isDefined(value)) {
      var i = 0, childNodes = this[0].childNodes;
      for ( ; i < childNodes.length; i++) {
        jqLite(childNodes[i]).dealoc();
      }
      this[0].innerHTML = value;
    }
    return this[0].innerHTML;
  },

  parent: function() {
    return jqLite(this[0].parentNode);
  },

  clone: function() { return jqLite(this[0].cloneNode(true)); }
};

if (msie) {
  extend(JQLite.prototype, {
    text: function(value) {
      var e = this[0];
      // NodeType == 3 is text node
      if (e.nodeType == 3) {
        if (isDefined(value)) e.nodeValue = value;
        return e.nodeValue;
      } else {
        if (isDefined(value)) e.innerText = value;
        return e.innerText;
      }
    }
  });
}
var angularGlobal = {
  'typeOf':function(obj){
    if (obj === _null) return $null;
    var type = typeof obj;
    if (type == $object) {
      if (obj instanceof Array) return $array;
      if (isDate(obj)) return $date;
      if (obj.nodeType == 1) return $element;
    }
    return type;
  }
};


/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.Object
 * @function
 *
 * @description
 * Utility functions for manipulation with JavaScript objects.
 *
 * These functions are exposed in two ways:
 *
 * - **in angular expressions**: the functions are bound to all objects and augment the Object
 *   type. The names of these methods are prefixed with `$` character to minimize naming collisions.
 *   To call a method, invoke the function without the first argument, e.g, `myObject.$foo(param2)`.
 *
 * - **in JavaScript code**: the functions don't augment the Object type and must be invoked as
 *   functions of `angular.Object` as `angular.Object.foo(myObject, param2)`.
 *
 */
var angularCollection = {
  'copy': copy,
  'size': size,
  'equals': equals
};
var angularObject = {
  'extend': extend
};

/**
 * @workInProgress
 * @ngdoc overview
 * @name angular.Array
 *
 * @description
 * Utility functions for manipulation with JavaScript Array objects.
 *
 * These functions are exposed in two ways:
 *
 * - **in angular expressions**: the functions are bound to the Array objects and augment the Array
 *   type as array methods. The names of these methods are prefixed with `$` character to minimize
 *   naming collisions. To call a method, invoke `myArrayObject.$foo(params)`.
 *
 * - **in JavaScript code**: the functions don't augment the Array type and must be invoked as
 *   functions of `angular.Array` as `angular.Array.foo(myArrayObject, params)`.
 *
 */
var angularArray = {


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.indexOf
   * @function
   *
   * @description
   * Determines the index of `value` in `array`.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Array to search.
   * @param {*} value Value to search for.
   * @returns {number} The position of the element in `array`. The position is 0-based. `-1` is returned if the value can't be found.
   *
   * @example
     <div ng:init="books = ['Moby Dick', 'Great Gatsby', 'Romeo and Juliet']"></div>
     <input name='bookName' value='Romeo and Juliet'> <br>
     Index of '{{bookName}}' in the list {{books}} is <em>{{books.$indexOf(bookName)}}</em>.

     @scenario
     it('should correctly calculate the initial index', function() {
       expect(binding('books.$indexOf(bookName)')).toBe('2');
     });

     it('should recalculate', function() {
       input('bookName').enter('foo');
       expect(binding('books.$indexOf(bookName)')).toBe('-1');

       input('bookName').enter('Moby Dick');
       expect(binding('books.$indexOf(bookName)')).toBe('0');
     });
   */
  'indexOf': indexOf,


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.sum
   * @function
   *
   * @description
   * This function calculates the sum of all numbers in `array`. If the `expressions` is supplied,
   * it is evaluated once for each element in `array` and then the sum of these values is returned.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The source array.
   * @param {(string|function())=} expression Angular expression or a function to be evaluated for each
   *     element in `array`. The array element becomes the `this` during the evaluation.
   * @returns {number} Sum of items in the array.
   *
   * @example
     <table ng:init="invoice= {items:[{qty:10, description:'gadget', cost:9.95}]}">
       <tr><th>Qty</th><th>Description</th><th>Cost</th><th>Total</th><th></th></tr>
       <tr ng:repeat="item in invoice.items">
         <td><input name="item.qty" value="1" size="4" ng:required ng:validate="integer"></td>
        <td><input name="item.description"></td>
          <td><input name="item.cost" value="0.00" ng:required ng:validate="number" size="6"></td>
         <td>{{item.qty * item.cost | currency}}</td>
         <td>[<a href ng:click="invoice.items.$remove(item)">X</a>]</td>
       </tr>
       <tr>
         <td><a href ng:click="invoice.items.$add()">add item</a></td>
         <td></td>
         <td>Total:</td>
         <td>{{invoice.items.$sum('qty*cost') | currency}}</td>
       </tr>
     </table>

     @scenario
     //TODO: these specs are lame because I had to work around issues #164 and #167
     it('should initialize and calculate the totals', function() {
       expect(repeater('.doc-example-live table tr', 'item in invoice.items').count()).toBe(3);
       expect(repeater('.doc-example-live table tr', 'item in invoice.items').row(1)).
         toEqual(['$99.50']);
       expect(binding("invoice.items.$sum('qty*cost')")).toBe('$99.50');
       expect(binding("invoice.items.$sum('qty*cost')")).toBe('$99.50');
     });

     it('should add an entry and recalculate', function() {
       element('.doc-example a:contains("add item")').click();
       using('.doc-example-live tr:nth-child(3)').input('item.qty').enter('20');
       using('.doc-example-live tr:nth-child(3)').input('item.cost').enter('100');

       expect(repeater('.doc-example-live table tr', 'item in invoice.items').row(2)).
         toEqual(['$2,000.00']);
       expect(binding("invoice.items.$sum('qty*cost')")).toBe('$2,099.50');
     });
   */
  'sum':function(array, expression) {
    var fn = angular['Function']['compile'](expression);
    var sum = 0;
    for (var i = 0; i < array.length; i++) {
      var value = 1 * fn(array[i]);
      if (!isNaN(value)){
        sum += value;
      }
    }
    return sum;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.remove
   * @function
   *
   * @description
   * Modifies `array` by removing an element from it. The element will be looked up using the
   * {@link angular.Array.indexOf indexOf} function on the `array` and only the first instance of
   * the element will be removed.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Array from which an element should be removed.
   * @param {*} value Element to be removed.
   * @returns {*} The removed element.
   *
   * @example
     <ul ng:init="tasks=['Learn Angular', 'Read Documentation',
                         'Check out demos', 'Build cool applications']">
       <li ng:repeat="task in tasks">
         {{task}} [<a href="" ng:click="tasks.$remove(task)">X</a>]
       </li>
     </ul>
     <hr/>
     tasks = {{tasks}}

     @scenario
     it('should initialize the task list with for tasks', function() {
       expect(repeater('.doc-example ul li', 'task in tasks').count()).toBe(4);
       expect(repeater('.doc-example ul li', 'task in tasks').column('task')).
         toEqual(['Learn Angular', 'Read Documentation', 'Check out demos',
                  'Build cool applications']);
     });

     it('should initialize the task list with for tasks', function() {
       element('.doc-example ul li a:contains("X"):first').click();
       expect(repeater('.doc-example ul li', 'task in tasks').count()).toBe(3);

       element('.doc-example ul li a:contains("X"):last').click();
       expect(repeater('.doc-example ul li', 'task in tasks').count()).toBe(2);

       expect(repeater('.doc-example ul li', 'task in tasks').column('task')).
         toEqual(['Read Documentation', 'Check out demos']);
     });
   */
  'remove':function(array, value) {
    var index = indexOf(array, value);
    if (index >=0)
      array.splice(index, 1);
    return value;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.filter
   * @function
   *
   * @description
   * Selects a subset of items from `array` and returns it as a new array.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The source array.
   * @param {string|Object|function()} expression The predicate to be used for selecting items from
   *   `array`.
   *
   *   Can be one of:
   *
   *   - `string`: Predicate that results in a substring match using the value of `expression`
   *     string. All strings or objects with string properties in `array` that contain this string
   *     will be returned. The predicate can be negated by prefixing the string with `!`.
   *
   *   - `Object`: A pattern object can be used to filter specific properties on objects contained
   *     by `array`. For example `{name:"M", phone:"1"}` predicate will return an array of items
   *     which have property `name` containing "M" and property `phone` containing "1". A special
   *     property name `$` can be used (as in `{$:"text"}`) to accept a match against any
   *     property of the object. That's equivalent to the simple substring match with a `string`
   *     as described above.
   *
   *   - `function`: A predicate function can be used to write arbitrary filters. The function is
   *     called for each element of `array`. The final result is an array of those elements that
   *     the predicate returned true for.
   *
   * @example
     <div ng:init="friends = [{name:'John', phone:'555-1276'},
                              {name:'Mary', phone:'800-BIG-MARY'},
                              {name:'Mike', phone:'555-4321'},
                              {name:'Adam', phone:'555-5678'},
                              {name:'Julie', phone:'555-8765'}]"></div>

     Search: <input name="searchText"/>
     <table id="searchTextResults">
       <tr><th>Name</th><th>Phone</th><tr>
       <tr ng:repeat="friend in friends.$filter(searchText)">
         <td>{{friend.name}}</td>
         <td>{{friend.phone}}</td>
       <tr>
     </table>
     <hr>
     Any: <input name="search.$"/> <br>
     Name only <input name="search.name"/><br>
     Phone only <input name="search.phone"/><br>
     <table id="searchObjResults">
       <tr><th>Name</th><th>Phone</th><tr>
       <tr ng:repeat="friend in friends.$filter(search)">
         <td>{{friend.name}}</td>
         <td>{{friend.phone}}</td>
       <tr>
     </table>

     @scenario
     it('should search across all fields when filtering with a string', function() {
       input('searchText').enter('m');
       expect(repeater('#searchTextResults tr', 'friend in friends').column('name')).
         toEqual(['Mary', 'Mike', 'Adam']);

       input('searchText').enter('76');
       expect(repeater('#searchTextResults tr', 'friend in friends').column('name')).
         toEqual(['John', 'Julie']);
     });

     it('should search in specific fields when filtering with a predicate object', function() {
       input('search.$').enter('i');
       expect(repeater('#searchObjResults tr', 'friend in friends').column('name')).
         toEqual(['Mary', 'Mike', 'Julie']);
     });
   */
  'filter':function(array, expression) {
    var predicates = [];
    predicates.check = function(value) {
      for (var j = 0; j < predicates.length; j++) {
        if(!predicates[j](value)) {
          return false;
        }
      }
      return true;
    };
    var search = function(obj, text){
      if (text.charAt(0) === '!') {
        return !search(obj, text.substr(1));
      }
      switch (typeof obj) {
      case "boolean":
      case "number":
      case "string":
        return ('' + obj).toLowerCase().indexOf(text) > -1;
      case "object":
        for ( var objKey in obj) {
          if (objKey.charAt(0) !== '$' && search(obj[objKey], text)) {
            return true;
          }
        }
        return false;
      case "array":
        for ( var i = 0; i < obj.length; i++) {
          if (search(obj[i], text)) {
            return true;
          }
        }
        return false;
      default:
        return false;
      }
    };
    switch (typeof expression) {
      case "boolean":
      case "number":
      case "string":
        expression = {$:expression};
      case "object":
        for (var key in expression) {
          if (key == '$') {
            (function(){
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(value, text);
              });
            })();
          } else {
            (function(){
              var path = key;
              var text = (''+expression[key]).toLowerCase();
              if (!text) return;
              predicates.push(function(value) {
                return search(getter(value, path), text);
              });
            })();
          }
        }
        break;
      case $function:
        predicates.push(expression);
        break;
      default:
        return array;
    }
    var filtered = [];
    for ( var j = 0; j < array.length; j++) {
      var value = array[j];
      if (predicates.check(value)) {
        filtered.push(value);
      }
    }
    return filtered;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.add
   * @function
   *
   * @description
   * `add` is a function similar to JavaScript's `Array#push` method, in that it appends a new
   * element to an array, but it differs in that the value being added is optional and defaults to
   * an emty object.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array expand.
   * @param {*=} [value={}] The value to be added.
   * @returns {Array} The expanded array.
   *
   * @exampleDescription
   * This example shows how an initially empty array can be filled with objects created from user
   * input via the `$add` method.
   *
   * @example
     [<a href="" ng:click="people.$add()">add empty</a>]
     [<a href="" ng:click="people.$add({name:'John', sex:'male'})">add 'John'</a>]
     [<a href="" ng:click="people.$add({name:'Mary', sex:'female'})">add 'Mary'</a>]

     <ul ng:init="people=[]">
       <li ng:repeat="person in people">
         <input name="person.name">
         <select name="person.sex">
           <option value="">--chose one--</option>
           <option>male</option>
           <option>female</option>
         </select>
         [<a href="" ng:click="people.$remove(person)">X</a>]
       </li>
     </ul>
     <pre>people = {{people}}</pre>

     @scenario
     beforeEach(function() {
        expect(binding('people')).toBe('people = []');
     });

     it('should create an empty record when "add empty" is clicked', function() {
       element('.doc-example a:contains("add empty")').click();
       expect(binding('people')).toBe('people = [{\n  "name":"",\n  "sex":null}]');
     });

     it('should create a "John" record when "add \'John\'" is clicked', function() {
       element('.doc-example a:contains("add \'John\'")').click();
       expect(binding('people')).toBe('people = [{\n  "name":"John",\n  "sex":"male"}]');
     });

     it('should create a "Mary" record when "add \'Mary\'" is clicked', function() {
       element('.doc-example a:contains("add \'Mary\'")').click();
       expect(binding('people')).toBe('people = [{\n  "name":"Mary",\n  "sex":"female"}]');
     });

     it('should delete a record when "X" is clicked', function() {
        element('.doc-example a:contains("add empty")').click();
        element('.doc-example li a:contains("X"):first').click();
        expect(binding('people')).toBe('people = []');
     });
   */
  'add':function(array, value) {
    array.push(isUndefined(value)? {} : value);
    return array;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.count
   * @function
   *
   * @description
   * Determines the number of elements in an array. Optionally it will count only those elements
   * for which the `condition` evaluets to `true`.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array to count elements in.
   * @param {(function()|string)=} condition A function to be evaluated or angular expression to be
   *     compiled and evaluated. The element that is currently being iterated over, is exposed to
   *     the `condition` as `this`.
   * @returns {number} Number of elements in the array (for which the condition evaluates to true).
   *
   * @example
     <pre ng:init="items = [{name:'knife', points:1},
                            {name:'fork', points:3},
                            {name:'spoon', points:1}]"></pre>
     <ul>
       <li ng:repeat="item in items">
          {{item.name}}: points=
          <input type="text" name="item.points"/> <!-- id="item{{$index}} -->
       </li>
     </ul>
     <p>Number of items which have one point: <em>{{ items.$count('points==1') }}</em></p>
     <p>Number of items which have more than one point: <em>{{items.$count('points&gt;1')}}</em></p>

     @scenario
     it('should calculate counts', function() {
       expect(binding('items.$count(\'points==1\')')).toEqual(2);
       expect(binding('items.$count(\'points>1\')')).toEqual(1);
     });

     it('should recalculate when updated', function() {
       using('.doc-example li:first-child').input('item.points').enter('23');
       expect(binding('items.$count(\'points==1\')')).toEqual(1);
       expect(binding('items.$count(\'points>1\')')).toEqual(2);
     });
   */
  'count':function(array, condition) {
    if (!condition) return array.length;
    var fn = angular['Function']['compile'](condition), count = 0;
    foreach(array, function(value){
      if (fn(value)) {
        count ++;
      }
    });
    return count;
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.orderBy
   * @function
   *
   * @description
   * Orders `array` by the `expression` predicate.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array The array to sort.
   * @param {function()|string|Array.<(function()|string)>} expression A predicate to be used by the
   *    comparator to determine the order of elements.
   *
   *    Can be one of:
   *
   *    - `function`: JavaScript's Array#sort comparator function
   *    - `string`: angular expression which evaluates to an object to order by, such as 'name' to
   *      sort by a property called 'name'. Optionally prefixed with `+` or `-` to control ascending
   *      or descending sort order (e.g. +name or -name).
   *    - `Array`: array of function or string predicates, such that a first predicate in the array
   *      is used for sorting, but when the items are equivalent next predicate is used.
   *
   * @param {boolean=} reverse Reverse the order the array.
   * @returns {Array} Sorted copy of the source array.
   *
   * @example
     <div ng:init="friends = [{name:'John', phone:'555-1212', age:10},
                              {name:'Mary', phone:'555-9876', age:19},
                              {name:'Mike', phone:'555-4321', age:21},
                              {name:'Adam', phone:'555-5678', age:35},
                              {name:'Julie', phone:'555-8765', age:29}]"></div>

     <pre>Sorting predicate = {{predicate}}</pre>
     <hr/>
     <table ng:init="predicate='-age'">
       <tr>
         <th><a href="" ng:click="predicate = 'name'">Name</a>
             (<a href ng:click="predicate = '-name'">^</a>)</th>
         <th><a href="" ng:click="predicate = 'phone'">Phone</a>
             (<a href ng:click="predicate = '-phone'">^</a>)</th>
         <th><a href="" ng:click="predicate = 'age'">Age</a>
             (<a href ng:click="predicate = '-age'">^</a>)</th>
       <tr>
       <tr ng:repeat="friend in friends.$orderBy(predicate)">
         <td>{{friend.name}}</td>
         <td>{{friend.phone}}</td>
         <td>{{friend.age}}</td>
       <tr>
     </table>

     @scenario
     it('should be reverse ordered by aged', function() {
       expect(binding('predicate')).toBe('Sorting predicate = -age');
       expect(repeater('.doc-example table', 'friend in friends').column('friend.age')).
         toEqual(['35', '29', '21', '19', '10']);
       expect(repeater('.doc-example table', 'friend in friends').column('friend.name')).
         toEqual(['Adam', 'Julie', 'Mike', 'Mary', 'John']);
     });

     it('should reorder the table when user selects different predicate', function() {
       element('.doc-example a:contains("Name")').click();
       expect(repeater('.doc-example table', 'friend in friends').column('friend.name')).
         toEqual(['Adam', 'John', 'Julie', 'Mary', 'Mike']);
       expect(repeater('.doc-example table', 'friend in friends').column('friend.age')).
         toEqual(['35', '10', '29', '19', '21']);

       element('.doc-example a:contains("Phone")+a:contains("^")').click();
       expect(repeater('.doc-example table', 'friend in friends').column('friend.phone')).
         toEqual(['555-9876', '555-8765', '555-5678', '555-4321', '555-1212']);
       expect(repeater('.doc-example table', 'friend in friends').column('friend.name')).
         toEqual(['Mary', 'Julie', 'Adam', 'Mike', 'John']);
     });
   */
  //TODO: WTH is descend param for and how/when it should be used, how is it affected by +/- in
  //      predicate? the code below is impossible to read and specs are not very good.
  'orderBy':function(array, expression, descend) {
    expression = isArray(expression) ? expression: [expression];
    expression = map(expression, function($){
      var descending = false, get = $ || identity;
      if (isString($)) {
        if (($.charAt(0) == '+' || $.charAt(0) == '-')) {
          descending = $.charAt(0) == '-';
          $ = $.substring(1);
        }
        get = expressionCompile($).fnSelf;
      }
      return reverse(function(a,b){
        return compare(get(a),get(b));
      }, descending);
    });
    var arrayCopy = [];
    for ( var i = 0; i < array.length; i++) { arrayCopy.push(array[i]); }
    return arrayCopy.sort(reverse(comparator, descend));

    function comparator(o1, o2){
      for ( var i = 0; i < expression.length; i++) {
        var comp = expression[i](o1, o2);
        if (comp !== 0) return comp;
      }
      return 0;
    }
    function reverse(comp, descending) {
      return toBoolean(descending) ?
          function(a,b){return comp(b,a);} : comp;
    }
    function compare(v1, v2){
      var t1 = typeof v1;
      var t2 = typeof v2;
      if (t1 == t2) {
        if (t1 == "string") v1 = v1.toLowerCase();
        if (t1 == "string") v2 = v2.toLowerCase();
        if (v1 === v2) return 0;
        return v1 < v2 ? -1 : 1;
      } else {
        return t1 < t2 ? -1 : 1;
      }
    }
  },


  /**
   * @workInProgress
   * @ngdoc function
   * @name angular.Array.limitTo
   * @function
   *
   * @description
   * Creates a new array containing only the first, or last `limit` number of elements of the
   * source `array`.
   *
   * Note: this function is used to augment the Array type in angular expressions. See
   * {@link angular.Array} for more info.
   *
   * @param {Array} array Source array to be limited.
   * @param {string|Number} limit The length of the returned array. If the number is positive, the
   *     first `limit` items from the source array will be copied, if the number is negative, the
   *     last `limit` items will be copied.
   * @returns {Array} New array of length `limit`.
   *
   */
  limitTo: function(array, limit) {
    limit = parseInt(limit, 10);
    var out = [],
        i, n;

    if (limit > 0) {
      i = 0;
      n = limit;
    } else {
      i = array.length + limit;
      n = array.length;
    }

    for (; i<n; i++) {
      out.push(array[i]);
    }

    return out;
  }
};

var R_ISO8061_STR = /^(\d{4})-(\d\d)-(\d\d)(?:T(\d\d)(?:\:(\d\d)(?:\:(\d\d)(?:\.(\d{3}))?)?)?Z)?$/;

var angularString = {
  'quote':function(string) {
    return '"' + string.replace(/\\/g, '\\\\').
                        replace(/"/g, '\\"').
                        replace(/\n/g, '\\n').
                        replace(/\f/g, '\\f').
                        replace(/\r/g, '\\r').
                        replace(/\t/g, '\\t').
                        replace(/\v/g, '\\v') +
             '"';
  },
  'quoteUnicode':function(string) {
    var str = angular['String']['quote'](string);
    var chars = [];
    for ( var i = 0; i < str.length; i++) {
      var ch = str.charCodeAt(i);
      if (ch < 128) {
        chars.push(str.charAt(i));
      } else {
        var encode = "000" + ch.toString(16);
        chars.push("\\u" + encode.substring(encode.length - 4));
      }
    }
    return chars.join('');
  },

  /**
   * Tries to convert input to date and if successful returns the date, otherwise returns the input.
   * @param {string} string
   * @return {(Date|string)}
   */
  'toDate':function(string){
    var match;
    if (isString(string) && (match = string.match(R_ISO8061_STR))){
      var date = new Date(0);
      date.setUTCFullYear(match[1], match[2] - 1, match[3]);
      date.setUTCHours(match[4]||0, match[5]||0, match[6]||0, match[7]||0);
      return date;
    }
    return string;
  }
};

var angularDate = {
    'toString':function(date){
      return !date ?
                date :
                date.toISOString ?
                  date.toISOString() :
                  padNumber(date.getUTCFullYear(), 4) + '-' +
                  padNumber(date.getUTCMonth() + 1, 2) + '-' +
                  padNumber(date.getUTCDate(), 2) + 'T' +
                  padNumber(date.getUTCHours(), 2) + ':' +
                  padNumber(date.getUTCMinutes(), 2) + ':' +
                  padNumber(date.getUTCSeconds(), 2) + '.' +
                  padNumber(date.getUTCMilliseconds(), 3) + 'Z';
    }
  };

var angularFunction = {
  'compile':function(expression) {
    if (isFunction(expression)){
      return expression;
    } else if (expression){
      return expressionCompile(expression).fnSelf;
    } else {
      return identity;
    }
  }
};

function defineApi(dst, chain){
  angular[dst] = angular[dst] || {};
  foreach(chain, function(parent){
    extend(angular[dst], parent);
  });
}
defineApi('Global', [angularGlobal]);
defineApi('Collection', [angularGlobal, angularCollection]);
defineApi('Array', [angularGlobal, angularCollection, angularArray]);
defineApi('Object', [angularGlobal, angularCollection, angularObject]);
defineApi('String', [angularGlobal, angularString]);
defineApi('Date', [angularGlobal, angularDate]);
//IE bug
angular['Date']['toString'] = angularDate['toString'];
defineApi('Function', [angularGlobal, angularCollection, angularFunction]);
/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.currency
 * @function
 *
 * @description
 *   Formats a number as a currency (ie $1,234.56).
 *
 * @param {number} amount Input to filter.
 * @returns {string} Formated number.
 *
 * @css ng-format-negative
 *   When the value is negative, this css class is applied to the binding making it by default red.
 *
 * @example
     <input type="text" name="amount" value="1234.56"/> <br/>
     {{amount | currency}}
 *
 * @scenario
     it('should init with 1234.56', function(){
       expect(binding('amount | currency')).toBe('$1,234.56');
     });
     it('should update', function(){
       input('amount').enter('-1234');
       expect(binding('amount | currency')).toBe('$-1,234.00');
       expect(element('.doc-example-live .ng-binding').attr('className')).
         toMatch(/ng-format-negative/);
     });
 */
angularFilter.currency = function(amount){
  this.$element.toggleClass('ng-format-negative', amount < 0);
  return '$' + angularFilter['number'].apply(this, [amount, 2]);
};

/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.number
 * @function
 *
 * @description
 *   Formats a number as text.
 *
 *   If the input is not a number empty string is returned.
 *
 * @param {number|string} number Number to format.
 * @param {(number|string)=} [fractionSize=2] Number of decimal places to round the number to.
 * @returns {string} Number rounded to decimalPlaces and places a “,” after each third digit.
 *
 * @example
     Enter number: <input name='val' value='1234.56789' /><br/>
     Default formatting: {{val | number}}<br/>
     No fractions: {{val | number:0}}<br/>
     Negative number: {{-val | number:4}}

 * @scenario
     it('should format numbers', function(){
       expect(binding('val | number')).toBe('1,234.57');
       expect(binding('val | number:0')).toBe('1,235');
       expect(binding('-val | number:4')).toBe('-1,234.5679');
     });

     it('should update', function(){
       input('val').enter('3374.333');
       expect(binding('val | number')).toBe('3,374.33');
       expect(binding('val | number:0')).toBe('3,374');
       expect(binding('-val | number:4')).toBe('-3,374.3330');
     });
 */
angularFilter.number = function(number, fractionSize){
  if (isNaN(number) || !isFinite(number)) {
    return '';
  }
  fractionSize = typeof fractionSize == $undefined ? 2 : fractionSize;
  var isNegative = number < 0;
  number = Math.abs(number);
  var pow = Math.pow(10, fractionSize);
  var text = "" + Math.round(number * pow);
  var whole = text.substring(0, text.length - fractionSize);
  whole = whole || '0';
  var frc = text.substring(text.length - fractionSize);
  text = isNegative ? '-' : '';
  for (var i = 0; i < whole.length; i++) {
    if ((whole.length - i)%3 === 0 && i !== 0) {
      text += ',';
    }
    text += whole.charAt(i);
  }
  if (fractionSize > 0) {
    for (var j = frc.length; j < fractionSize; j++) {
      frc += '0';
    }
    text += '.' + frc.substring(0, fractionSize);
  }
  return text;
};


function padNumber(num, digits, trim) {
  var neg = '';
  if (num < 0) {
    neg =  '-';
    num = -num;
  }
  num = '' + num;
  while(num.length < digits) num = '0' + num;
  if (trim)
    num = num.substr(num.length - digits);
  return neg + num;
}


function dateGetter(name, size, offset, trim) {
  return function(date) {
    var value = date['get' + name]();
    if (offset > 0 || value > -offset)
      value += offset;
    if (value === 0 && offset == -12 ) value = 12;
    return padNumber(value, size, trim);
  };
}


var DATE_FORMATS = {
  yyyy: dateGetter('FullYear', 4),
  yy:   dateGetter('FullYear', 2, 0, true),
  MM:   dateGetter('Month', 2, 1),
   M:   dateGetter('Month', 1, 1),
  dd:   dateGetter('Date', 2),
   d:   dateGetter('Date', 1),
  HH:   dateGetter('Hours', 2),
   H:   dateGetter('Hours', 1),
  hh:   dateGetter('Hours', 2, -12),
   h:   dateGetter('Hours', 1, -12),
  mm:   dateGetter('Minutes', 2),
   m:   dateGetter('Minutes', 1),
  ss:   dateGetter('Seconds', 2),
   s:   dateGetter('Seconds', 1),
  a:    function(date){return date.getHours() < 12 ? 'am' : 'pm';},
  Z:    function(date){
          var offset = date.getTimezoneOffset();
          return padNumber(offset / 60, 2) + padNumber(Math.abs(offset % 60), 2);
        }
};


var DATE_FORMATS_SPLIT = /([^yMdHhmsaZ]*)(y+|M+|d+|H+|h+|m+|s+|a|Z)(.*)/;
var NUMBER_STRING = /^\d+$/;


/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.date
 * @function
 *
 * @description
 *   Formats `date` to a string based on the requested `format`.
 *
 *   `format` string can be composed of the following elements:
 *
 *   * `'yyyy'`: 4 digit representation of year e.g. 2010
 *   * `'yy'`: 2 digit representation of year, padded (00-99)
 *   * `'MM'`: Month in year, padded (01‒12)
 *   * `'M'`: Month in year (1‒12)
 *   * `'dd'`: Day in month, padded (01‒31)
 *   * `'d'`: Day in month (1-31)
 *   * `'HH'`: Hour in day, padded (00‒23)
 *   * `'H'`: Hour in day (0-23)
 *   * `'hh'`: Hour in am/pm, padded (01‒12)
 *   * `'h'`: Hour in am/pm, (1-12)
 *   * `'mm'`: Minute in hour, padded (00‒59)
 *   * `'m'`: Minute in hour (0-59)
 *   * `'ss'`: Second in minute, padded (00‒59)
 *   * `'s'`: Second in minute (0‒59)
 *   * `'a'`: am/pm marker
 *   * `'Z'`: 4 digit (+sign) representation of the timezone offset (-1200‒1200)
 *
 * @param {(Date|number|string)} date Date to format either as Date object, milliseconds (string or
 *    number) or ISO 8601 extended datetime string (yyyy-MM-ddTHH:mm:ss.SSSZ).
 * @param {string=} format Formatting rules. If not specified, Date#toLocaleDateString is used.
 * @returns {string} Formatted string or the input if input is not recognized as date/millis.
 *
 * @example
     <span ng:non-bindable>{{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}</span>:
        {{1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'}}<br/>
     <span ng:non-bindable>{{1288323623006 | date:'MM/dd/yyyy @ h:mma'}}</span>:
        {{'1288323623006' | date:'MM/dd/yyyy @ h:mma'}}<br/>
 *
 * @scenario
     it('should format date', function(){
       expect(binding("1288323623006 | date:'yyyy-MM-dd HH:mm:ss Z'")).
          toMatch(/2010\-10\-2\d \d{2}:\d{2}:\d{2} \-?\d{4}/);
       expect(binding("'1288323623006' | date:'MM/dd/yyyy @ h:mma'")).
          toMatch(/10\/2\d\/2010 @ \d{1,2}:\d{2}(am|pm)/);
     });
 *
 */
angularFilter.date = function(date, format) {
  if (isString(date)) {
    if (NUMBER_STRING.test(date)) {
      date = parseInt(date, 10);
    } else {
      date = angularString.toDate(date);
    }
  }

  if (isNumber(date)) {
    date = new Date(date);
  }

  if (!isDate(date)) {
    return date;
  }

  var text = date.toLocaleDateString(), fn;
  if (format && isString(format)) {
    text = '';
    var parts = [];
    while(format) {
      parts = concat(parts, DATE_FORMATS_SPLIT.exec(format), 1);
      format = parts.pop();
    }
    foreach(parts, function(value){
      fn = DATE_FORMATS[value];
      text += fn ? fn(date) : value;
    });
  }
  return text;
};


/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.json
 * @function
 *
 * @description
 *   Allows you to convert a JavaScript object into JSON string.
 *
 *   This filter is mostly useful for debugging. When using the double curly {{value}} notation
 *   the binding is automatically converted to JSON.
 *
 * @param {*} object Any JavaScript object (including arrays and primitive types) to filter.
 * @returns {string} JSON string.
 *
 * @css ng-monospace Always applied to the encapsulating element.
 *
 * @example:
     <input type="text" name="objTxt" value="{a:1, b:[]}"
            ng:eval="obj = $eval(objTxt)"/>
     <pre>{{ obj | json }}</pre>
 *
 * @scenario
     it('should jsonify filtered objects', function() {
       expect(binding('obj | json')).toBe('{\n  "a":1,\n  "b":[]}');
     });

     it('should update', function() {
       input('objTxt').enter('[1, 2, 3]');
       expect(binding('obj | json')).toBe('[1,2,3]');
     });
 *
 */
angularFilter.json = function(object) {
  this.$element.addClass("ng-monospace");
  return toJson(object, true);
};


/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.lowercase
 * @function
 *
 * @see angular.lowercase
 */
angularFilter.lowercase = lowercase;


/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.uppercase
 * @function
 *
 * @see angular.uppercase
 */
angularFilter.uppercase = uppercase;


/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.html
 * @function
 *
 * @description
 *   Prevents the input from getting escaped by angular. By default the input is sanitized and
 *   inserted into the DOM as is.
 *
 *   The input is sanitized by parsing the html into tokens. All safe tokens (from a whitelist) are
 *   then serialized back to properly escaped html string. This means that no unsafe input can make
 *   it into the returned string, however since our parser is more strict than a typical browser
 *   parser, it's possible that some obscure input, which would be recognized as valid HTML by a
 *   browser, won't make it through the sanitizer.
 *
 *   If you hate your users, you may call the filter with optional 'unsafe' argument, which bypasses
 *   the html sanitizer, but makes your application vulnerable to XSS and other attacks. Using this
 *   option is strongly discouraged and should be used only if you absolutely trust the input being
 *   filtered and you can't get the content through the sanitizer.
 *
 * @param {string} html Html input.
 * @param {string=} option If 'unsafe' then do not sanitize the HTML input.
 * @returns {string} Sanitized or raw html.
 *
 * @example
     Snippet: <textarea name="snippet" cols="60" rows="3">
&lt;p style="color:blue"&gt;an html
&lt;em onmouseover="this.textContent='PWN3D!'"&gt;click here&lt;/em&gt;
snippet&lt;/p&gt;</textarea>
     <table>
       <tr>
         <td>Filter</td>
         <td>Source</td>
         <td>Rendered</td>
       </tr>
       <tr id="html-filter">
         <td>html filter</td>
         <td>
           <pre>&lt;div ng:bind="snippet | html"&gt;<br/>&lt;/div&gt;</pre>
         </td>
         <td>
           <div ng:bind="snippet | html"></div>
         </td>
       </tr>
       <tr id="escaped-html">
         <td>no filter</td>
         <td><pre>&lt;div ng:bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
         <td><div ng:bind="snippet"></div></td>
       </tr>
       <tr id="html-unsafe-filter">
         <td>unsafe html filter</td>
         <td><pre>&lt;div ng:bind="snippet | html:'unsafe'"&gt;<br/>&lt;/div&gt;</pre></td>
         <td><div ng:bind="snippet | html:'unsafe'"></div></td>
       </tr>
     </table>
 *
 * @scenario
     it('should sanitize the html snippet ', function(){
       expect(using('#html-filter').binding('snippet | html')).
         toBe('<p>an html\n<em>click here</em>\nsnippet</p>');
     });

     it ('should escape snippet without any filter', function() {
       expect(using('#escaped-html').binding('snippet')).
         toBe("&lt;p style=\"color:blue\"&gt;an html\n" +
              "&lt;em onmouseover=\"this.textContent='PWN3D!'\"&gt;click here&lt;/em&gt;\n" +
              "snippet&lt;/p&gt;");
     });

     it ('should inline raw snippet if filtered as unsafe', function() {
       expect(using('#html-unsafe-filter').binding("snippet | html:'unsafe'")).
         toBe("<p style=\"color:blue\">an html\n" +
              "<em onmouseover=\"this.textContent='PWN3D!'\">click here</em>\n" +
              "snippet</p>");
     });

     it('should update', function(){
       input('snippet').enter('new <b>text</b>');
       expect(using('#html-filter').binding('snippet | html')).toBe('new <b>text</b>');
       expect(using('#escaped-html').binding('snippet')).toBe("new &lt;b&gt;text&lt;/b&gt;");
       expect(using('#html-unsafe-filter').binding("snippet | html:'unsafe'")).toBe('new <b>text</b>');
     });
 */
angularFilter.html =  function(html, option){
  return new HTML(html, option);
};


/**
 * @workInProgress
 * @ngdoc filter
 * @name angular.filter.linky
 * @function
 *
 * @description
 *   Finds links in text input and turns them into html links. Supports http/https/ftp/mailto and
 *   plane email address links.
 *
 * @param {string} text Input text.
 * @returns {string} Html-linkified text.
 *
 * @example
     Snippet: <textarea name="snippet" cols="60" rows="3">
Pretty text with some links:
http://angularjs.org/,
mailto:us@somewhere.org,
another@somewhere.org,
and one more: ftp://127.0.0.1/.</textarea>
     <table>
       <tr>
         <td>Filter</td>
         <td>Source</td>
         <td>Rendered</td>
       </tr>
       <tr id="linky-filter">
         <td>linky filter</td>
         <td>
           <pre>&lt;div ng:bind="snippet | linky"&gt;<br/>&lt;/div&gt;</pre>
         </td>
         <td>
           <div ng:bind="snippet | linky"></div>
         </td>
       </tr>
       <tr id="escaped-html">
         <td>no filter</td>
         <td><pre>&lt;div ng:bind="snippet"&gt;<br/>&lt;/div&gt;</pre></td>
         <td><div ng:bind="snippet"></div></td>
       </tr>
     </table>

   @scenario
     it('should linkify the snippet with urls', function(){
       expect(using('#linky-filter').binding('snippet | linky')).
         toBe('Pretty text with some links:\n' +
              '<a href="http://angularjs.org/">http://angularjs.org/</a>,\n' +
              '<a href="mailto:us@somewhere.org">us@somewhere.org</a>,\n' +
              '<a href="mailto:another@somewhere.org">another@somewhere.org</a>,\n' +
              'and one more: <a href="ftp://127.0.0.1/">ftp://127.0.0.1/</a>.');
     });

     it ('should not linkify snippet without the linky filter', function() {
       expect(using('#escaped-html').binding('snippet')).
         toBe("Pretty text with some links:\n" +
              "http://angularjs.org/,\n" +
              "mailto:us@somewhere.org,\n" +
              "another@somewhere.org,\n" +
              "and one more: ftp://127.0.0.1/.");
     });

     it('should update', function(){
       input('snippet').enter('new http://link.');
       expect(using('#linky-filter').binding('snippet | linky')).
         toBe('new <a href="http://link">http://link</a>.');
       expect(using('#escaped-html').binding('snippet')).toBe('new http://link.');
     });
 */
//TODO: externalize all regexps
angularFilter.linky = function(text){
  if (!text) return text;
  var URL = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}\<\>]/;
  var match;
  var raw = text;
  var html = [];
  var writer = htmlSanitizeWriter(html);
  var url;
  var i;
  while (match=raw.match(URL)) {
    // We can not end in these as they are sometimes found at the end of the sentence
    url = match[0];
    // if we did not match ftp/http/mailto then assume mailto
    if (match[2]==match[3]) url = 'mailto:' + url;
    i = match.index;
    writer.chars(raw.substr(0, i));
    writer.start('a', {href:url});
    writer.chars(match[0].replace(/^mailto:/, ''));
    writer.end('a');
    raw = raw.substring(i + match[0].length);
  }
  writer.chars(raw);
  return new HTML(html.join(''));
};
function formatter(format, parse) {return {'format':format, 'parse':parse || format};}
function toString(obj) {
  return (isDefined(obj) && obj !== _null) ? "" + obj : obj;
}

var NUMBER = /^\s*[-+]?\d*(\.\d*)?\s*$/;

angularFormatter.noop = formatter(identity, identity);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.json
 *
 * @description
 *   Formats the user input as JSON text.
 *
 * @returns {string} A JSON string representation of the model.
 *
 * @example
 * <div ng:init="data={name:'misko', project:'angular'}">
 *   <input type="text" size='50' name="data" ng:format="json"/>
 *   <pre>data={{data}}</pre>
 * </div>
 *
 * @scenario
 * it('should format json', function(){
 *   expect(binding('data')).toEqual('data={\n  \"name\":\"misko\",\n  \"project\":\"angular\"}');
 *   input('data').enter('{}');
 *   expect(binding('data')).toEqual('data={\n  }');
 * });
 */
angularFormatter.json = formatter(toJson, fromJson);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.boolean
 *
 * @description
 *   Use boolean formatter if you wish to store the data as boolean.
 *
 * @returns {boolean} Converts to `true` unless user enters (blank), `f`, `false`, `0`, `no`, `[]`.
 *
 * @example
 * Enter truthy text:
 * <input type="text" name="value" ng:format="boolean" value="no"/>
 * <input type="checkbox" name="value"/>
 * <pre>value={{value}}</pre>
 *
 * @scenario
 * it('should format boolean', function(){
 *   expect(binding('value')).toEqual('value=false');
 *   input('value').enter('truthy');
 *   expect(binding('value')).toEqual('value=true');
 * });
 */
angularFormatter['boolean'] = formatter(toString, toBoolean);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.number
 *
 * @description
 * Use number formatter if you wish to convert the user entered string to a number.
 *
 * @returns {number} Number from the parsed string.
 *
 * @example
 * Enter valid number:
 * <input type="text" name="value" ng:format="number" value="1234"/>
 * <pre>value={{value}}</pre>
 *
 * @scenario
 * it('should format numbers', function(){
 *   expect(binding('value')).toEqual('value=1234');
 *   input('value').enter('5678');
 *   expect(binding('value')).toEqual('value=5678');
 * });
 */
angularFormatter.number = formatter(toString, function(obj){
  if (obj == _null || NUMBER.exec(obj)) {
    return obj===_null || obj === '' ? _null : 1*obj;
  } else {
    throw "Not a number";
  }
});

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.list
 *
 * @description
 * Use list formatter if you wish to convert the user entered string to an array.
 *
 * @returns {Array} Array parsed from the entered string.
 *
 * @example
 * Enter a list of items:
 * <input type="text" name="value" ng:format="list" value=" chair ,, table"/>
 * <input type="text" name="value" ng:format="list"/>
 * <pre>value={{value}}</pre>
 *
 * @scenario
 * it('should format lists', function(){
 *   expect(binding('value')).toEqual('value=["chair","table"]');
 *   this.addFutureAction('change to XYZ', function($window, $document, done){
 *     $document.elements('.doc-example :input:last').val(',,a,b,').trigger('change');
 *     done();
 *   });
 *   expect(binding('value')).toEqual('value=["a","b"]');
 * });
 */
angularFormatter.list = formatter(
  function(obj) { return obj ? obj.join(", ") : obj; },
  function(value) {
    var list = [];
    foreach((value || '').split(','), function(item){
      item = trim(item);
      if (item) list.push(item);
    });
    return list;
  }
);

/**
 * @workInProgress
 * @ngdoc formatter
 * @name angular.formatter.trim
 *
 * @description
 * Use trim formatter if you wish to trim extra spaces in user text.
 *
 * @returns {String} Trim excess leading and trailing space.
 *
 * @example
 * Enter text with leading/trailing spaces:
 * <input type="text" name="value" ng:format="trim" value="  book  "/>
 * <input type="text" name="value" ng:format="trim"/>
 * <pre>value={{value|json}}</pre>
 *
 * @scenario
 * it('should format trim', function(){
 *   expect(binding('value')).toEqual('value="book"');
 *   this.addFutureAction('change to XYZ', function($window, $document, done){
 *     $document.elements('.doc-example :input:last').val('  text  ').trigger('change');
 *     done();
 *   });
 *   expect(binding('value')).toEqual('value="text"');
 * });
 */
angularFormatter.trim = formatter(
  function(obj) { return obj ? trim("" + obj) : ""; }
);
extend(angularValidator, {
  'noop': function() { return _null; },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.regexp
   * @description
   * Use regexp validator to restrict the input to any Regular Expression.
   * 
   * @param {string} value value to validate
   * @param {regexp} expression regular expression.
   * @css ng-validation-error
   * 
   * @example
   * Enter valid SSN:
   * <input name="ssn" value="123-45-6789" ng:validate="regexp:/^\d\d\d-\d\d-\d\d\d\d$/" >
   * 
   * @scenario
   * it('should invalidate non ssn', function(){
   *   var textBox = element('.doc-example :input');
   *   expect(textBox.attr('className')).not().toMatch(/ng-validation-error/);
   *   expect(textBox.val()).toEqual('123-45-6789');
   *   
   *   input('ssn').enter('123-45-67890');
   *   expect(textBox.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'regexp': function(value, regexp, msg) {
    if (!value.match(regexp)) {
      return msg ||
        "Value does not match expected format " + regexp + ".";
    } else {
      return _null;
    }
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.number
   * @description
   * Use number validator to restrict the input to numbers with an 
   * optional range. (See integer for whole numbers validator).
   * 
   * @param {string} value value to validate
   * @param {int=} [min=MIN_INT] minimum value.
   * @param {int=} [max=MAX_INT] maximum value.
   * @css ng-validation-error
   * 
   * @example
   * Enter number: <input name="n1" ng:validate="number" > <br>
   * Enter number greater than 10: <input name="n2" ng:validate="number:10" > <br>
   * Enter number between 100 and 200: <input name="n3" ng:validate="number:100:200" > <br>
   * 
   * @scenario
   * it('should invalidate number', function(){
   *   var n1 = element('.doc-example :input[name=n1]');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n1').enter('1.x');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n2 = element('.doc-example :input[name=n2]');
   *   expect(n2.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n2').enter('9');
   *   expect(n2.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n3 = element('.doc-example :input[name=n3]');
   *   expect(n3.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n3').enter('201');
   *   expect(n3.attr('className')).toMatch(/ng-validation-error/);
   *   
   * });
   * 
   */
  'number': function(value, min, max) {
    var num = 1 * value;
    if (num == value) {
      if (typeof min != $undefined && num < min) {
        return "Value can not be less than " + min + ".";
      }
      if (typeof min != $undefined && num > max) {
        return "Value can not be greater than " + max + ".";
      }
      return _null;
    } else {
      return "Not a number";
    }
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.integer
   * @description
   * Use number validator to restrict the input to integers with an 
   * optional range. (See integer for whole numbers validator).
   * 
   * @param {string} value value to validate
   * @param {int=} [min=MIN_INT] minimum value.
   * @param {int=} [max=MAX_INT] maximum value.
   * @css ng-validation-error
   * 
   * @example
   * Enter integer: <input name="n1" ng:validate="integer" > <br>
   * Enter integer equal or greater than 10: <input name="n2" ng:validate="integer:10" > <br>
   * Enter integer between 100 and 200 (inclusive): <input name="n3" ng:validate="integer:100:200" > <br>
   * 
   * @scenario
   * it('should invalidate integer', function(){
   *   var n1 = element('.doc-example :input[name=n1]');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n1').enter('1.1');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n2 = element('.doc-example :input[name=n2]');
   *   expect(n2.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n2').enter('10.1');
   *   expect(n2.attr('className')).toMatch(/ng-validation-error/);
   *   
   *   var n3 = element('.doc-example :input[name=n3]');
   *   expect(n3.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('n3').enter('100.1');
   *   expect(n3.attr('className')).toMatch(/ng-validation-error/);
   *   
   * });
   */
  'integer': function(value, min, max) {
    var numberError = angularValidator['number'](value, min, max);
    if (numberError) return numberError;
    if (!("" + value).match(/^\s*[\d+]*\s*$/) || value != Math.round(value)) {
      return "Not a whole number";
    }
    return _null;
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.date
   * @description
   * Use date validator to restrict the user input to a valid date
   * in format in format MM/DD/YYYY.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid date:
   * <input name="text" value="1/1/2009" ng:validate="date" >
   * 
   * @scenario
   * it('should invalidate date', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('123/123/123');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'date': function(value) {
    var fields = /^(\d\d?)\/(\d\d?)\/(\d\d\d\d)$/.exec(value);
    var date = fields ? new Date(fields[3], fields[1]-1, fields[2]) : 0;
    return (date &&
            date.getFullYear() == fields[3] &&
            date.getMonth() == fields[1]-1 &&
            date.getDate() == fields[2]) ?
              _null : "Value is not a date. (Expecting format: 12/31/2009).";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.email
   * @description
   * Use email validator if you wist to restrict the user input to a valid email.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid email:
   * <input name="text" ng:validate="email" value="me@example.com">
   * 
   * @scenario
   * it('should invalidate email', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('a@b.c');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'email': function(value) {
    if (value.match(/^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$/)) {
      return _null;
    }
    return "Email needs to be in username@host.com format.";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.phone
   * @description
   * Use phone validator to restrict the input phone numbers.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid phone number:
   * <input name="text" value="1(234)567-8901" ng:validate="phone" >
   * 
   * @scenario
   * it('should invalidate phone', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('+12345678');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'phone': function(value) {
    if (value.match(/^1\(\d\d\d\)\d\d\d-\d\d\d\d$/)) {
      return _null;
    }
    if (value.match(/^\+\d{2,3} (\(\d{1,5}\))?[\d ]+\d$/)) {
      return _null;
    }
    return "Phone number needs to be in 1(987)654-3210 format in North America or +999 (123) 45678 906 internationaly.";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.url
   * @description
   * Use phone validator to restrict the input URLs.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * Enter valid phone number:
   * <input name="text" value="http://example.com/abc.html" size="40" ng:validate="url" >
   * 
   * @scenario
   * it('should invalidate url', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('text').enter('abc://server/path');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'url': function(value) {
    if (value.match(/^(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?$/)) {
      return _null;
    }
    return "URL needs to be in http://server[:port]/path format.";
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.json
   * @description
   * Use json validator if you wish to restrict the user input to a valid JSON.
   * 
   * @param {string} value value to validate
   * @css ng-validation-error
   * 
   * @example
   * <textarea name="json" cols="60" rows="5" ng:validate="json">
   * {name:'abc'}
   * </textarea>
   * 
   * @scenario
   * it('should invalidate json', function(){
   *   var n1 = element('.doc-example :input');
   *   expect(n1.attr('className')).not().toMatch(/ng-validation-error/);
   *   input('json').enter('{name}');
   *   expect(n1.attr('className')).toMatch(/ng-validation-error/);
   * });
   * 
   */
  'json': function(value) {
    try {
      fromJson(value);
      return _null;
    } catch (e) {
      return e.toString();
    }
  },

  /**
   * @workInProgress
   * @ngdoc validator
   * @name angular.validator.asynchronous
   * @description
   * Use asynchronous validator if the validation can not be computed 
   * immediately, but is provided through a callback. The widget 
   * automatically shows a spinning indicator while the validity of 
   * the widget is computed. This validator caches the result.
   * 
   * @param {string} value value to validate
   * @param {function(inputToValidate,validationDone)} validate function to call to validate the state
   *         of the input.
   * @param {function(data)=} [update=noop] function to call when state of the 
   *    validator changes
   *    
   * @paramDescription
   * The `validate` function (specified by you) is called as 
   * `validate(inputToValidate, validationDone)`:
   * 
   *    * `inputToValidate`: value of the input box.
   *    * `validationDone`: `function(error, data){...}`
   *       * `error`: error text to display if validation fails
   *       * `data`: data object to pass to update function
   *       
   * The `update` function is optionally specified by you and is
   * called by <angular/> on input change. Since the 
   * asynchronous validator caches the results, the update 
   * function can be called without a call to `validate` 
   * function. The function is called as `update(data)`:
   * 
   *    * `data`: data object as passed from validate function
   * 
   * @css ng-input-indicator-wait, ng-validation-error
   * 
   * @example
   * <script>
   *   function myValidator(inputToValidate, validationDone) {
   *    setTimeout(function(){
   *      validationDone(inputToValidate.length % 2);
   *    }, 500);
   *  }
   * </script>
   *  This input is validated asynchronously:
   *  <input name="text" ng:validate="asynchronous:$window.myValidator">
   * 
   * @scenario
   * it('should change color in delayed way', function(){
   *   var textBox = element('.doc-example :input');
   *   expect(textBox.attr('className')).not().toMatch(/ng-input-indicator-wait/);
   *   expect(textBox.attr('className')).not().toMatch(/ng-validation-error/);
   *   
   *   input('text').enter('X');
   *   expect(textBox.attr('className')).toMatch(/ng-input-indicator-wait/);
   *   
   *   pause(.6);
   *   
   *   expect(textBox.attr('className')).not().toMatch(/ng-input-indicator-wait/);
   *   expect(textBox.attr('className')).toMatch(/ng-validation-error/);
   *   
   * });
   * 
   */
  /*
   * cache is attached to the element
   * cache: {
   *   inputs : {
   *     'user input': {
   *        response: server response,
   *        error: validation error
   *     },
   *   current: 'current input'
   * }
   *
   */
  'asynchronous': function(input, asynchronousFn, updateFn) {
    if (!input) return;
    var scope = this;
    var element = scope.$element;
    var cache = element.data('$asyncValidator');
    if (!cache) {
      element.data('$asyncValidator', cache = {inputs:{}});
    }

    cache.current = input;

    var inputState = cache.inputs[input];
    if (!inputState) {
      cache.inputs[input] = inputState = { inFlight: true };
      scope.$invalidWidgets.markInvalid(scope.$element);
      element.addClass('ng-input-indicator-wait');
      asynchronousFn(input, function(error, data) {
        inputState.response = data;
        inputState.error = error;
        inputState.inFlight = false;
        if (cache.current == input) {
          element.removeClass('ng-input-indicator-wait');
          scope.$invalidWidgets.markValid(element);
        }
        element.data($$validate)();
        scope.$root.$eval();
      });
    } else if (inputState.inFlight) {
      // request in flight, mark widget invalid, but don't show it to user
      scope.$invalidWidgets.markInvalid(scope.$element);
    } else {
      (updateFn||noop)(inputState.response);
    }
    return inputState.error;
  }

});
var URL_MATCH = /^(file|ftp|http|https):\/\/(\w+:{0,1}\w*@)?([\w\.-]*)(:([0-9]+))?(\/[^\?#]*)?(\?([^#]*))?(#(.*))?$/,
    HASH_MATCH = /^([^\?]*)?(\?([^\?]*))?$/,
    DEFAULT_PORTS = {'http': 80, 'https': 443, 'ftp':21},
    EAGER = 'eager',
    EAGER_PUBLISHED = EAGER + '-published';

function angularServiceInject(name, fn, inject, eager) {
  angularService(name, fn, {$inject:inject, $creation:eager});
}

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$window
 * 
 * @description
 * Is reference to the browser's <b>window</b> object. While <b>window</b>
 * is globally available in JavaScript, it causes testability problems, because
 * it is a global variable. In <b><angular/></b> we always refer to it through the
 * $window service, so it may be overriden, removed or mocked for testing.
 * 
 * All expressions are evaluated with respect to current scope so they don't
 * suffer from window globality.
 * 
 * @example
   <input ng:init="greeting='Hello World!'" type="text" name="greeting" />
   <button ng:click="$window.alert(greeting)">ALERT</button>
 */
angularServiceInject("$window", bind(window, identity, window), [], EAGER_PUBLISHED);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$document
 * @requires $window
 * 
 * @description
 * Reference to the browser window.document, but wrapped into angular.element().
 */
angularServiceInject("$document", function(window){
  return jqLite(window.document);
}, ['$window'], EAGER_PUBLISHED);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$location
 * @requires $browser
 * 
 * @property {string} href
 * @property {string} protocol
 * @property {string} host
 * @property {number} port
 * @property {string} path
 * @property {Object.<string|boolean>} search
 * @property {string} hash
 * @property {string} hashPath
 * @property {Object.<string|boolean>} hashSearch
 * 
 * @description
 * Parses the browser location url and makes it available to your application.
 * Any changes to the url are reflected into $location service and changes to
 * $location are reflected to url.
 * Notice that using browser's forward/back buttons changes the $location.
 * 
 * @example
   <a href="#">clear hash</a> | 
   <a href="#myPath?name=misko">test hash</a><br/>
   <input type='text' name="$location.hash"/>
   <pre>$location = {{$location}}</pre>
 */
angularServiceInject("$location", function(browser) {
  var scope = this,
      location = {toString:toString, update:update, updateHash: updateHash},
      lastBrowserUrl = browser.getUrl(),
      lastLocationHref,
      lastLocationHash;

  browser.addPollFn(function() {
    if (lastBrowserUrl != browser.getUrl()) {
      update(lastBrowserUrl = browser.getUrl());
      updateLastLocation();
      scope.$eval();
    }
  });

  this.$onEval(PRIORITY_FIRST, updateBrowser);
  this.$onEval(PRIORITY_LAST, updateBrowser);

  update(lastBrowserUrl);
  updateLastLocation();

  return location;

  // PUBLIC METHODS

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#update
   * @methodOf angular.service.$location
   * 
   * @description
   * Update location object
   * Does not immediately update the browser
   * Browser is updated at the end of $eval()
   *
   * @example
   * scope.$location.update('http://www.angularjs.org/path#hash?search=x');
   * scope.$location.update({host: 'www.google.com', protocol: 'https'});
   * scope.$location.update({hashPath: '/path', hashSearch: {a: 'b', x: true}});
   *
   * @param {(string|Object)} href Full href as a string or hash object with properties
   */
  function update(href) {
    if (isString(href)) {
      extend(location, parseHref(href));
    } else {
      if (isDefined(href.hash)) {
        extend(href, parseHash(href.hash));
      }

      extend(location, href);

      if (isDefined(href.hashPath || href.hashSearch)) {
        location.hash = composeHash(location);
      }

      location.href = composeHref(location);
    }
  }

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#updateHash
   * @methodOf angular.service.$location
   * 
   * @description
   * Update location hash part
   * @see update()
   *
   * @example
   * scope.$location.updateHash('/hp')
   *   ==> update({hashPath: '/hp'})
   *
   * scope.$location.updateHash({a: true, b: 'val'})
   *   ==> update({hashSearch: {a: true, b: 'val'}})
   *
   * scope.$location.updateHash('/hp', {a: true})
   *   ==> update({hashPath: '/hp', hashSearch: {a: true}})
   *
   * @param {(string|Object)} path A hashPath or hashSearch object
   * @param {Object=} search A hashSearch object
   */
  function updateHash(path, search) {
    var hash = {};

    if (isString(path)) {
      hash.hashPath = path;
      if (isDefined(search))
        hash.hashSearch = search;
    } else
      hash.hashSearch = path;

    update(hash);
  }

  /**
   * @workInProgress
   * @ngdoc method
   * @name angular.service.$location#toString
   * @methodOf angular.service.$location
   * 
   * @description
   * Returns string representation - href
   */
  function toString() {
    updateLocation();
    return location.href;
  }

  // INNER METHODS

  /**
   * Update location object
   *
   * User is allowed to change properties, so after property change,
   * location object is not in consistent state.
   *
   * @example
   * scope.$location.href = 'http://www.angularjs.org/path#a/b'
   * immediately after this call, other properties are still the old ones...
   *
   * This method checks the changes and update location to the consistent state
   */
  function updateLocation() {
    if (location.href == lastLocationHref) {
      if (location.hash == lastLocationHash) {
        location.hash = composeHash(location);
      }
      location.href = composeHref(location);
    }
    update(location.href);
  }

  /**
   * Update information about last location
   */
  function updateLastLocation() {
    lastLocationHref = location.href;
    lastLocationHash = location.hash;
  }

  /**
   * If location has changed, update the browser
   * This method is called at the end of $eval() phase
   */
  function updateBrowser() {
    updateLocation();

    if (location.href != lastLocationHref) {    	
      browser.setUrl(lastBrowserUrl = location.href);
      updateLastLocation();
    }
  }

  /**
   * Compose href string from a location object
   *
   * @param {Object} loc The location object with all properties
   * @return {string} Composed href
   */
  function composeHref(loc) {
    var url = toKeyValue(loc.search);
    var port = (loc.port == DEFAULT_PORTS[loc.protocol] ? _null : loc.port);

    return loc.protocol  + '://' + loc.host +
          (port ? ':' + port : '') + loc.path +
          (url ? '?' + url : '') + (loc.hash ? '#' + loc.hash : '');
  }

  /**
   * Compose hash string from location object
   *
   * @param {Object} loc Object with hashPath and hashSearch properties
   * @return {string} Hash string
   */
  function composeHash(loc) {
    var hashSearch = toKeyValue(loc.hashSearch);
    //TODO: temporary fix for issue #158
    return escape(loc.hashPath).replace(/%21/gi, '!').replace(/%3A/gi, ':').replace(/%24/gi, '$') +
          (hashSearch ? '?' + hashSearch : '');
  }

  /**
   * Parse href string into location object
   *
   * @param {string} href
   * @return {Object} The location object
   */
  function parseHref(href) {
    var loc = {};
    var match = URL_MATCH.exec(href);

    if (match) {
      loc.href = href.replace(/#$/, '');
      loc.protocol = match[1];
      loc.host = match[3] || '';
      loc.port = match[5] || DEFAULT_PORTS[loc.protocol] || _null;
      loc.path = match[6] || '';
      loc.search = parseKeyValue(match[8]);
      loc.hash = match[10] || '';

      extend(loc, parseHash(loc.hash));
    }

    return loc;
  }

  /**
   * Parse hash string into object
   *
   * @param {string} hash
   */
  function parseHash(hash) {
    var h = {};
    var match = HASH_MATCH.exec(hash);

    if (match) {
      h.hash = hash;
      h.hashPath = unescape(match[1] || '');
      h.hashSearch = parseKeyValue(match[3]);
    }

    return h;
  }
}, ['$browser'], EAGER_PUBLISHED);


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$log
 * @requires $window
 * 
 * @description
 * Is simple service for logging. Default implementation writes the message
 * into the browser's console (if present).
 * 
 * This is useful for debugging.
 * 
 * @example
   <p>Reload this page with open console, enter text and hit the log button...</p>
   Message:
   <input type="text" name="message" value="Hello World!"/>
   <button ng:click="$log.log(message)">log</button>
   <button ng:click="$log.warn(message)">warn</button>
   <button ng:click="$log.info(message)">info</button>
   <button ng:click="$log.error(message)">error</button>
 */
angularServiceInject("$log", function($window){
  return {
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#log
     * @methodOf angular.service.$log
     * 
     * @description
     * Write a log message
     */
    log: consoleLog('log'),
    
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#warn
     * @methodOf angular.service.$log
     * 
     * @description
     * Write a warning message
     */
    warn: consoleLog('warn'),
    
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#info
     * @methodOf angular.service.$log
     * 
     * @description
     * Write an information message
     */
    info: consoleLog('info'),
    
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$log#error
     * @methodOf angular.service.$log
     * 
     * @description
     * Write an error message
     */
    error: consoleLog('error')
  };
  
  function consoleLog(type) {
    var console = $window.console || {};
    var logFn = console[type] || console.log || noop;
    if (logFn.apply) {
      return function(){
        var args = [];
        foreach(arguments, function(arg){
          args.push(formatError(arg));
        });
        return logFn.apply(console, args);
      };
    } else {
      // we are IE, in which case there is nothing we can do
      return logFn;
    }
  }
}, ['$window'], EAGER_PUBLISHED);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$exceptionHandler
 * @requires $log
 * 
 * @description
 * Any uncaught exception in <angular/> is delegated to this service.
 * The default implementation simply delegates to $log.error which logs it into
 * the browser console.
 * 
 * When unit testing it is useful to have uncaught exceptions propagate
 * to the test so the test will fail rather than silently log the exception
 * to the browser console. For this purpose you can override this service with
 * a simple rethrow. 
 * 
 * @example
 */
angularServiceInject('$exceptionHandler', function($log){
  return function(e) {
    $log.error(e);
  };
}, ['$log'], EAGER_PUBLISHED);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$hover
 * @requires $browser
 * @requires $document
 * 
 * @description
 * 
 * @example
 */
angularServiceInject("$hover", function(browser, document) {
  var tooltip, self = this, error, width = 300, arrowWidth = 10, body = jqLite(document[0].body);
  browser.hover(function(element, show){
    if (show && (error = element.attr(NG_EXCEPTION) || element.attr(NG_VALIDATION_ERROR))) {
      if (!tooltip) {
        tooltip = {
            callout: jqLite('<div id="ng-callout"></div>'),
            arrow: jqLite('<div></div>'),
            title: jqLite('<div class="ng-title"></div>'),
            content: jqLite('<div class="ng-content"></div>')
        };
        tooltip.callout.append(tooltip.arrow);
        tooltip.callout.append(tooltip.title);
        tooltip.callout.append(tooltip.content);
        body.append(tooltip.callout);
      }
      var docRect = body[0].getBoundingClientRect(),
          elementRect = element[0].getBoundingClientRect(),
          leftSpace = docRect.right - elementRect.right - arrowWidth;
      tooltip.title.text(element.hasClass("ng-exception") ? "EXCEPTION:" : "Validation error...");
      tooltip.content.text(error);
      if (leftSpace < width) {
        tooltip.arrow.addClass('ng-arrow-right');
        tooltip.arrow.css({left: (width + 1)+'px'});
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.left - arrowWidth - width - 4) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      } else {
        tooltip.arrow.addClass('ng-arrow-left');
        tooltip.callout.css({
          position: 'fixed',
          left: (elementRect.right + arrowWidth) + "px",
          top: (elementRect.top - 3) + "px",
          width: width + "px"
        });
      }
    } else if (tooltip) {
      tooltip.callout.remove();
      tooltip = _null;
    }
  });
}, ['$browser', '$document'], EAGER);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$invalidWidgets
 * 
 * @description
 * Keeps references to all invalid widgets found during validation.
 * Can be queried to find whether there are any invalid widgets currently displayed.
 * 
 * @example
 */
angularServiceInject("$invalidWidgets", function(){
  var invalidWidgets = [];


  /** Remove an element from the array of invalid widgets */
  invalidWidgets.markValid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index != -1)
      invalidWidgets.splice(index, 1);
  };


  /** Add an element to the array of invalid widgets */
  invalidWidgets.markInvalid = function(element){
    var index = indexOf(invalidWidgets, element);
    if (index === -1)
      invalidWidgets.push(element);
  };


  /** Return count of all invalid widgets that are currently visible */
  invalidWidgets.visible = function() {
    var count = 0;
    foreach(invalidWidgets, function(widget){
      count = count + (isVisible(widget) ? 1 : 0);
    });
    return count;
  };


  /* At the end of each eval removes all invalid widgets that are not part of the current DOM. */
  this.$onEval(PRIORITY_LAST, function() {
    for(var i = 0; i < invalidWidgets.length;) {
      var widget = invalidWidgets[i];
      if (isOrphan(widget[0])) {
        invalidWidgets.splice(i, 1);
        if (widget.dealoc) widget.dealoc();
      } else {
        i++;
      }
    }
  });


  /**
   * Traverses DOM element's (widget's) parents and considers the element to be an orphant if one of
   * it's parents isn't the current window.document.
   */
  function isOrphan(widget) {
    if (widget == window.document) return false;
    var parent = widget.parentNode;
    return !parent || isOrphan(parent);
  }

  return invalidWidgets;
}, [], EAGER_PUBLISHED);



function switchRouteMatcher(on, when, dstName) {
  var regex = '^' + when.replace(/[\.\\\(\)\^\$]/g, "\$1") + '$',
      params = [],
      dst = {};
  foreach(when.split(/\W/), function(param){
    if (param) {
      var paramRegExp = new RegExp(":" + param + "([\\W])");
      if (regex.match(paramRegExp)) {
        regex = regex.replace(paramRegExp, "([^\/]*)$1");
        params.push(param);
      }
    }
  });
  var match = on.match(new RegExp(regex));
  if (match) {
    foreach(params, function(name, index){
      dst[name] = match[index + 1];
    });
    if (dstName) this.$set(dstName, dst);
  }
  return match ? dst : _null;
}

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$route
 * @requires $location
 * 
 * @property {Object} current Name of the current route
 * @property {Array.<Object>} routes List of configured routes
 * 
 * @description
 * Watches $location.hashPath and tries to map the hash to an existing route
 * definition. It is used for deep-linking URLs to controllers and views (HTML partials).
 * 
 * $route is typically used in conjunction with ng:include widget. 
 * 
 * @example
<p>
	This example shows how changing the URL hash causes the <tt>$route</tt>
	to match a route against the URL, and the <tt>[[ng:include]]</tt> pulls in the partial.
	Try changing the URL in the input box to see changes.
</p>
   
<script>
	angular.service('myApp', function($route) {
	  $route.when('/Book/:bookId', {template:'rsrc/book.html', controller:BookCntl});
	  $route.when('/Book/:bookId/ch/:chapterId', {template:'rsrc/chapter.html', controller:ChapterCntl});
	  $route.onChange(function() {
	    $route.current.scope.params = $route.current.params;
	  });
	}, {$inject: ['$route']});
	
	function BookCntl() {
	  this.name = "BookCntl";
	}
	
	function ChapterCntl() {
	  this.name = "ChapterCntl";
	}
</script>

Chose: 
<a href="#/Book/Moby">Moby</a> | 
<a href="#/Book/Moby/ch/1">Moby: Ch1</a> | 
<a href="#/Book/Gatsby">Gatsby</a> | 
<a href="#/Book/Gatsby/ch/4?key=value">Gatsby: Ch4</a><br/>
<input type="text" name="$location.hashPath" size="80" />
<pre>$location={{$location}}</pre>
<pre>$route.current.template={{$route.current.template}}</pre>
<pre>$route.current.params={{$route.current.params}}</pre>
<pre>$route.current.scope.name={{$route.current.scope.name}}</pre>
<hr/>
<ng:include src="$route.current.template" scope="$route.current.scope"/>
 */
angularServiceInject('$route', function(location) {
  var routes = {},
      onChange = [],
      matcher = switchRouteMatcher,
      parentScope = this,
      dirty = 0,
      $route = {
        routes: routes,
        
        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#onChange
         * @methodOf angular.service.$route
         * 
         * @param {function()} fn Function that will be called on route change
         * 
         * @description
         * Register a handler function that will be called when route changes
         */
        onChange: bind(onChange, onChange.push),
        
        /**
         * @workInProgress
         * @ngdoc method
         * @name angular.service.$route#when
         * @methodOf angular.service.$route
         * 
         * @param {string} path Route path (matched against $location.hash)
         * @param {Object} params Mapping information to be assigned to `$route.current` on route
         *    match.
         * @returns {Object} route object
         * 
         * @description
         * Add new route
         */
        when:function (path, params) {
          if (angular.isUndefined(path)) return routes;
          var route = routes[path];
          if (!route) route = routes[path] = {};
          if (params) angular.extend(route, params);
          dirty++;
          return route;
        }
      };
  function updateRoute(){
    var childScope;
    $route.current = _null;
    angular.foreach(routes, function(routeParams, route) {
      if (!childScope) {
        var pathParams = matcher(location.hashPath, route);
        if (pathParams) {
          childScope = angular.scope(parentScope);
          $route.current = angular.extend({}, routeParams, {
            scope: childScope,
            params: angular.extend({}, location.hashSearch, pathParams)
          });
        }
      }
    });
    angular.foreach(onChange, parentScope.$tryEval);
    if (childScope) {
      childScope.$become($route.current.controller);
    }
  }
  this.$watch(function(){return dirty + location.hash;}, updateRoute);
  return $route;
}, ['$location'], EAGER_PUBLISHED);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr
 * @requires $browser
 * @requires $xhr.error
 * @requires $log
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr', function($browser, $error, $log){
  var self = this;
  return function(method, url, post, callback){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (post && isObject(post)) {
      post = toJson(post);
    }
    $browser.xhr(method, url, post, function(code, response){
      try {
        if (isString(response) && /^\s*[\[\{]/.exec(response) && /[\}\]]\s*$/.exec(response)) {
          response = fromJson(response);
        }
        if (code == 200) {
          callback(code, response);
        } else {
          $error(
            {method: method, url:url, data:post, callback:callback},
            {status: code, body:response});
        }
      } catch (e) {
        $log.error(e);
      } finally {
        self.$eval();
      }
    });
  };
}, ['$browser', '$xhr.error', '$log']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.error
 * @requires $log
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr.error', function($log){
  return function(request, response){
    $log.error('ERROR: XHR: ' + request.url, request, response);
  };
}, ['$log']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.bulk
 * @requires $xhr
 * @requires $xhr.error
 * @requires $log
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr.bulk', function($xhr, $error, $log){
  var requests = [],
      scope = this;
  function bulkXHR(method, url, post, callback) {
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    var currentQueue;
    foreach(bulkXHR.urls, function(queue){
      if (isFunction(queue.match) ? queue.match(url) : queue.match.exec(url)) {
        currentQueue = queue;
      }
    });
    if (currentQueue) {
      if (!currentQueue.requests) currentQueue.requests = [];
      currentQueue.requests.push({method: method, url: url, data:post, callback:callback});
    } else {
      $xhr(method, url, post, callback);
    }
  }
  bulkXHR.urls = {};
  bulkXHR.flush = function(callback){
    foreach(bulkXHR.urls, function(queue, url){
      var currentRequests = queue.requests;
      if (currentRequests && currentRequests.length) {
        queue.requests = [];
        queue.callbacks = [];
        $xhr('POST', url, {requests:currentRequests}, function(code, response){
          foreach(response, function(response, i){
            try {
              if (response.status == 200) {
                (currentRequests[i].callback || noop)(response.status, response.response);
              } else {
                $error(currentRequests[i], response);
              }
            } catch(e) {
              $log.error(e);
            }
          });
          (callback || noop)();
        });
        scope.$eval();
      }
    });
  };
  this.$onEval(PRIORITY_LAST, bulkXHR.flush);
  return bulkXHR;
}, ['$xhr', '$xhr.error', '$log']);


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$defer
 * @requires $browser
 * @requires $log
 *
 * @description
 * Delegates to {@link angular.service.$browser.defer $browser.defer}, but wraps the `fn` function
 * into a try/catch block and delegates any exceptions to
 * {@link angular.services.$exceptionHandler $exceptionHandler} service.
 *
 * In tests you can use `$browser.defer.flush()` to flush the queue of deferred functions.
 *
 * @param {function()} fn A function, who's execution should be deferred.
 */
angularServiceInject('$defer', function($browser, $exceptionHandler) {
  return function(fn) {
    $browser.defer(function() {
      try {
        fn();
      } catch(e) {
        $exceptionHandler(e);
      }
    });
  };
}, ['$browser', '$exceptionHandler']);


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$xhr.cache
 * @requires $xhr
 * 
 * @description
 * 
 * @example
 */
angularServiceInject('$xhr.cache', function($xhr, $defer){
  var inflight = {}, self = this;
  function cache(method, url, post, callback, verifyCache){
    if (isFunction(post)) {
      callback = post;
      post = _null;
    }
    if (method == 'GET') {
      var data, dataCached;
      if (dataCached = cache.data[url]) {
        $defer(function() { callback(200, copy(dataCached.value)); });
        if (!verifyCache)
          return;
      }

      if (data = inflight[url]) {
        data.callbacks.push(callback);
      } else {
        inflight[url] = {callbacks: [callback]};
        cache.delegate(method, url, post, function(status, response){
          if (status == 200)
            cache.data[url] = { value: response };
          var callbacks = inflight[url].callbacks;
          delete inflight[url];
          foreach(callbacks, function(callback){
            try {
              (callback||noop)(status, copy(response));
            } catch(e) {
              self.$log.error(e);
            }
          });
        });
      }

    } else {
      cache.data = {};
      cache.delegate(method, url, post, callback);
    }
  }
  cache.data = {};
  cache.delegate = $xhr;
  return cache;
}, ['$xhr.bulk', '$defer']);


/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$resource
 * @requires $xhr
 *
 * @description
 * Is a factory which creates a resource object which lets you interact with 
 * <a href="http://en.wikipedia.org/wiki/Representational_State_Transfer" target="_blank">RESTful</a>
 * server-side data sources.
 * Resource object has action methods which provide high-level behaviors without
 * the need to interact with the low level $xhr or XMLHttpRequest().
 *
 * <pre>
     // Define CreditCard class
     var CreditCard = $resource('/user/:userId/card/:cardId',
      {userId:123, cardId:'@id'}, {
       charge: {method:'POST', params:{charge:true}}
      });

     // We can retrieve a collection from the server
     var cards = CreditCard.query();
     // GET: /user/123/card
     // server returns: [ {id:456, number:'1234', name:'Smith'} ];

     var card = cards[0];
     // each item is an instance of CreditCard
     expect(card instanceof CreditCard).toEqual(true);
     card.name = "J. Smith";
     // non GET methods are mapped onto the instances
     card.$save();
     // POST: /user/123/card/456 {id:456, number:'1234', name:'J. Smith'}
     // server returns: {id:456, number:'1234', name: 'J. Smith'};

     // our custom method is mapped as well.
     card.$charge({amount:9.99});
     // POST: /user/123/card/456?amount=9.99&charge=true {id:456, number:'1234', name:'J. Smith'}
     // server returns: {id:456, number:'1234', name: 'J. Smith'};

     // we can create an instance as well
     var newCard = new CreditCard({number:'0123'});
     newCard.name = "Mike Smith";
     newCard.$save();
     // POST: /user/123/card {number:'0123', name:'Mike Smith'}
     // server returns: {id:789, number:'01234', name: 'Mike Smith'};
     expect(newCard.id).toEqual(789);
 * </pre>
 *
 *
 * @param {string} url A parameterized URL template with parameters prefixed by `:` as in
 *     `/user/:username`.
 * @param {Object=} paramDefaults Default values for `url` parameters. These can be overridden in
 *     `actions` methods.
 * @param {Object.<Object>=} actions Map of actions available for the resource.
 *
 *     Each resource comes preconfigured with `get`, `save`, `query`, `remove`, and `delete` to
 *     mimic the RESTful philosophy.
 *
 *     To create your own actions, pass in a map keyed on action names (e.g. `'charge'`) with
 *     elements consisting of these properties:
 *
 *     - `{string} method`:  Request method type. Valid methods are: `GET`, `POST`, `PUT`, `DELETE`,
 *        and [`JSON`](http://en.wikipedia.org/wiki/JSON#JSONP) (also known as JSONP).
 *     - `{Object=} params`: Set of pre-bound parameters for the action.
 *     - `{boolean=} isArray`: If true then the returned object for this action is an array, see the
 *       pre-binding section.
 *     - `{boolean=} verifyCache`: If true then items returned from cache, are double checked by
 *       running the query again and updating the resource asynchroniously.
 *
 *     Each service comes preconfigured with the following overridable actions:
 *     <pre>
 *       { 'get':    {method:'GET'},
           'save':   {method:'POST'},
           'query':  {method:'GET', isArray:true},
           'remove': {method:'DELETE'},
           'delete': {method:'DELETE'} };
 *     </pre>
 *
 * @returns {Object} A resource "class" which has "static" method for each action in the definition.
 *     Calling these methods invoke `$xhr` on the `url` template with the given `method` and
 *     `params`. When the data is returned from the server then the object is an instance of the
 *     resource type and all of the non-GET methods are available with `$` prefix. This allows you
 *     to easily support CRUD operations (create, read, update, delete) on server-side data.

       <pre>
         var User = $resource('/user/:userId', {userId:'@id'});
         var user = User.get({userId:123}, function(){
           user.abc = true;
           user.$save();
         });
       </pre>
 *
 *
 * @example
   <script>
     function BuzzController($resource) {
       this.Activity = $resource(
         'https://www.googleapis.com/buzz/v1/activities/:userId/:visibility/:activityId/:comments',
         {alt:'json', callback:'JSON_CALLBACK'},
         {get:{method:'JSON', params:{visibility:'@self'}}, replies: {method:'JSON', params:{visibility:'@self', comments:'@comments'}}}
       );
     }
     
     BuzzController.prototype = {
       fetch: function() {
         this.activities = this.Activity.get({userId:this.userId});
       },
       expandReplies: function(activity) {
         activity.replies = this.Activity.replies({userId:this.userId, activityId:activity.id});
       }
     };
     BuzzController.$inject = ['$resource'];
   </script>

   <div ng:controller="BuzzController">
     <input name="userId" value="googlebuzz"/>
     <button ng:click="fetch()">fetch</button>
     <hr/>
     <div ng:repeat="item in activities.data.items">
       <h1 style="font-size: 15px;">
	       <img src="{{item.actor.thumbnailUrl}}" style="max-height:30px;max-width:30px;"/>
	       <a href="{{item.actor.profileUrl}}">{{item.actor.name}}</a>
	       <a href ng:click="expandReplies(item)" style="float: right;">Expand replies: {{item.links.replies[0].count}}</a>
       </h1>
       {{item.object.content | html}}
       <div ng:repeat="reply in item.replies.data.items" style="margin-left: 20px;">
         <img src="{{reply.actor.thumbnailUrl}}" style="max-height:30px;max-width:30px;"/>
         <a href="{{reply.actor.profileUrl}}">{{reply.actor.name}}</a>: {{reply.content | html}}
       </div>
     </div>
   </div>
 */
angularServiceInject('$resource', function($xhr){
  var resource = new ResourceFactory($xhr);
  return bind(resource, resource.route);
}, ['$xhr.cache']);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$cookies
 * @requires $browser
 * 
 * @description
 * Provides read/write access to browser's cookies.
 * 
 * Only a simple Object is exposed and by adding or removing properties to/from
 * this object, new cookies are created/deleted at the end of current $eval.
 * 
 * @example
 */
angularServiceInject('$cookies', function($browser) {
  var rootScope = this,
      cookies = {},
      lastCookies = {},
      lastBrowserCookies;

  //creates a poller fn that copies all cookies from the $browser to service & inits the service
  $browser.addPollFn(function() {
    var currentCookies = $browser.cookies();
    if (lastBrowserCookies != currentCookies) { //relies on browser.cookies() impl
      lastBrowserCookies = currentCookies;
      copy(currentCookies, lastCookies);
      copy(currentCookies, cookies);
      rootScope.$eval();
    }
  })();

  //at the end of each eval, push cookies
  this.$onEval(PRIORITY_LAST, push);

  return cookies;


  /**
   * Pushes all the cookies from the service to the browser and verifies if all cookies were stored.
   */
  function push(){
    var name,
        browserCookies,
        updated;

    //delete any cookies deleted in $cookies
    for (name in lastCookies) {
      if (isUndefined(cookies[name])) {
        $browser.cookies(name, _undefined);
      }
    }

    //update all cookies updated in $cookies
    for(name in cookies) {
      if (cookies[name] !== lastCookies[name]) {
        $browser.cookies(name, cookies[name]);
        updated = true;
      }
    }

    //verify what was actually stored
    if (updated){
      updated = !updated;
      browserCookies = $browser.cookies();

      for (name in cookies) {
        if (cookies[name] !== browserCookies[name]) {
          //delete or reset all cookies that the browser dropped from $cookies
          if (isUndefined(browserCookies[name])) {
            delete cookies[name];
          } else {
            cookies[name] = browserCookies[name];
          }
          updated = true;
        }

      }

      if (updated) {
        rootScope.$eval();
      }
    }
  }
}, ['$browser'], EAGER_PUBLISHED);

/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$cookieStore
 * @requires $cookies
 * 
 * @description
 * Provides a key-value (string-object) storage, that is backed by session cookies.
 * Objects put or retrieved from this storage are automatically serialized or
 * deserialized by angular's toJson/fromJson.
 * @example
 */
angularServiceInject('$cookieStore', function($store) {

  return {
    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$cookieStore#get
     * @methodOf angular.service.$cookieStore
     * 
     * @description
     * Returns the value of given cookie key
     * 
     * @param {string} key Id to use for lookup.
     * @returns {Object} Deserialized cookie value.
     */
    get: function(key) {
      return fromJson($store[key]);
    },

    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$cookieStore#put
     * @methodOf angular.service.$cookieStore
     * 
     * @description
     * Sets a value for given cookie key
     * 
     * @param {string} key Id for the `value`.
     * @param {Object} value Value to be stored.
     */
    put: function(key, value) {
      $store[key] = toJson(value);
    },

    /**
     * @workInProgress
     * @ngdoc method
     * @name angular.service.$cookieStore#remove
     * @methodOf angular.service.$cookieStore
     * 
     * @description
     * Remove given cookie
     * 
     * @param {string} key Id of the key-value pair to delete.
     */
    remove: function(key) {
      delete $store[key];
    }
  };

}, ['$cookies']);
/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:init
 *
 * @description
 * `ng:init` attribute allows the for initialization tasks to be executed 
 *  before the template enters execution mode during bootstrap.
 *
 * @element ANY
 * @param {expression} expression to eval.
 *
 * @example
    <div ng:init="greeting='Hello'; person='World'">
      {{greeting}} {{person}}!
    </div>
 *
 * @scenario
   it('should check greeting', function(){
     expect(binding('greeting')).toBe('Hello');
     expect(binding('person')).toBe('World');
   });
 */
angularDirective("ng:init", function(expression){
  return function(element){
    this.$tryEval(expression, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:controller
 *
 * @description
 * To support the Model-View-Controller design pattern, it is possible 
 * to assign behavior to a scope through `ng:controller`. The scope is 
 * the MVC model. The HTML (with data bindings) is the MVC view. 
 * The `ng:controller` directive specifies the MVC controller class
 *
 * @element ANY
 * @param {expression} expression to eval.
 *
 * @example
    <script type="text/javascript">
      function SettingsController() {
        this.name = "John Smith";
        this.contacts = [
          {type:'phone', value:'408 555 1212'},
          {type:'email', value:'john.smith@example.org'} ];
      }
      SettingsController.prototype = {
       greet: function(){
         alert(this.name);
       },
       addContact: function(){
         this.contacts.push({type:'email', value:'yourname@example.org'});
       },
       removeContact: function(contactToRemove) {
         angular.Array.remove(this.contacts, contactToRemove);
       },
       clearContact: function(contact) {
         contact.type = 'phone';
         contact.value = '';
       }
      };
    </script>
    <div ng:controller="SettingsController">
      Name: <input type="text" name="name"/> 
      [ <a href="" ng:click="greet()">greet</a> ]<br/>
      Contact:
      <ul>
        <li ng:repeat="contact in contacts">
          <select name="contact.type">
             <option>phone</option>
             <option>email</option>
          </select>
          <input type="text" name="contact.value"/>
          [ <a href="" ng:click="clearContact(contact)">clear</a> 
          | <a href="" ng:click="removeContact(contact)">X</a> ]
        </li>
        <li>[ <a href="" ng:click="addContact()">add</a> ]</li>
     </ul>
    </div>
 *
 * @scenario
   it('should check controller', function(){
     expect(element('.doc-example-live div>:input').val()).toBe('John Smith');
     expect(element('.doc-example-live li[ng\\:repeat-index="0"] input').val()).toBe('408 555 1212');
     expect(element('.doc-example-live li[ng\\:repeat-index="1"] input').val()).toBe('john.smith@example.org');
     element('.doc-example-live li:first a:contains("clear")').click();
     expect(element('.doc-example-live li:first input').val()).toBe('');
     element('.doc-example-live li:last a:contains("add")').click();
     expect(element('.doc-example-live li[ng\\:repeat-index="2"] input').val()).toBe('yourname@example.org');
   });
 */
angularDirective("ng:controller", function(expression){
  this.scope(true);
  return function(element){
    var controller = getter(window, expression, true) || getter(this, expression, true);
    if (!controller)
      throw "Can not find '"+expression+"' controller.";
    if (!isFunction(controller))
      throw "Reference '"+expression+"' is not a class.";
    this.$become(controller);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:eval
 *
 * @description
 * The `ng:eval` allows you to execute a binding which has side effects 
 * without displaying the result to the user.
 *
 * @element ANY
 * @param {expression} expression to eval.
 *
 * @exampleDescription
 * Notice that `{{` `obj.multiplied = obj.a * obj.b` `}}` has a side effect of assigning 
 * a value to `obj.multiplied` and displaying the result to the user. Sometimes, 
 * however, it is desirable to execute a side effect without showing the value to 
 * the user. In such a case `ng:eval` allows you to execute code without updating 
 * the display.
 * 
 * @example
 *   <input name="obj.a" value="6" > 
 *     * <input name="obj.b" value="2"> 
 *     = {{obj.multiplied = obj.a * obj.b}} <br>
 *   <span ng:eval="obj.divide = obj.a / obj.b"></span>
 *   <span ng:eval="obj.updateCount = 1 + (obj.updateCount||0)"></span>
 *   <tt>obj.divide = {{obj.divide}}</tt><br/>
 *   <tt>obj.updateCount = {{obj.updateCount}}</tt>
 *
 * @scenario
   it('should check eval', function(){
     expect(binding('obj.divide')).toBe('3');
     expect(binding('obj.updateCount')).toBe('2');
     input('obj.a').enter('12');
     expect(binding('obj.divide')).toBe('6');
     expect(binding('obj.updateCount')).toBe('3');
   });
 */
angularDirective("ng:eval", function(expression){
  return function(element){
    this.$onEval(expression, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:bind
 *
 * @description
 * The `ng:bind` attribute asks <angular/> to replace the text content of this 
 * HTML element with the value of the given expression and kept it up to 
 * date when the expression's value changes. Usually you just write 
 * {{expression}} and let <angular/> compile it into 
 * `<span ng:bind="expression"></span>` at bootstrap time.
 * 
 * @element ANY
 * @param {expression} expression to eval.
 *
 * @exampleDescription
 * Try it here: enter text in text box and watch the greeting change.
 * @example
 * Enter name: <input type="text" name="name" value="Whirled">. <br>
 * Hello <span ng:bind="name" />!
 * 
 * @scenario
   it('should check ng:bind', function(){
     expect(using('.doc-example-live').binding('name')).toBe('Whirled');
     using('.doc-example-live').input('name').enter('world');
     expect(using('.doc-example-live').binding('name')).toBe('world');
   });
 */
angularDirective("ng:bind", function(expression, element){
  element.addClass('ng-binding');
  return function(element) {
    var lastValue = noop, lastError = noop;
    this.$onEval(function() {
      var error, value, html, isHtml, isDomElement,
          oldElement = this.hasOwnProperty($$element) ? this.$element : _undefined;
      this.$element = element;
      value = this.$tryEval(expression, function(e){
        error = formatError(e);
      });
      this.$element = oldElement;
      // If we are HTML than save the raw HTML data so that we don't
      // recompute sanitization since it is expensive.
      // TODO: turn this into a more generic way to compute this
      if (isHtml = (value instanceof HTML))
        value = (html = value).html;
      if (lastValue === value && lastError == error) return;
      isDomElement = isElement(value);
      if (!isHtml && !isDomElement && isObject(value)) {
        value = toJson(value);
      }
      if (value != lastValue || error != lastError) {
        lastValue = value;
        lastError = error;
        elementError(element, NG_EXCEPTION, error);
        if (error) value = error;
        if (isHtml) {
          element.html(html.get());
        } else if (isDomElement) {
          element.html('');
          element.append(value);
        } else {
          element.text(value === _undefined ? '' : value);
        }
      }
    }, element);
  };
});

var bindTemplateCache = {};
function compileBindTemplate(template){
  var fn = bindTemplateCache[template];
  if (!fn) {
    var bindings = [];
    foreach(parseBindings(template), function(text){
      var exp = binding(text);
      bindings.push(exp ? function(element){
        var error, value = this.$tryEval(exp, function(e){
          error = toJson(e);
        });
        elementError(element, NG_EXCEPTION, error);
        return error ? error : value;
      } : function() {
        return text;
      });
    });
    bindTemplateCache[template] = fn = function(element){
      var parts = [], self = this,
         oldElement = this.hasOwnProperty($$element) ? self.$element : _undefined;
      self.$element = element;
      for ( var i = 0; i < bindings.length; i++) {
        var value = bindings[i].call(self, element);
        if (isElement(value))
          value = '';
        else if (isObject(value))
          value = toJson(value, true);
        parts.push(value);
      }
      self.$element = oldElement;
      return parts.join('');
    };
  }
  return fn;
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:bind-template
 *
 * @description
 * The `ng:bind-template` attribute specifies that the element 
 * text should be replaced with the template in ng:bind-template. 
 * Unlike ng:bind the ng:bind-template can contain multiple `{{` `}}` 
 * expressions. (This is required since some HTML elements 
 * can not have SPAN elements such as TITLE, or OPTION to name a few.
 * 
 * @element ANY
 * @param {string} template of form
 *   <tt>{{</tt> <tt>expression</tt> <tt>}}</tt> to eval.
 *
 * @exampleDescription
 * Try it here: enter text in text box and watch the greeting change.
 * @example
    Salutation: <input type="text" name="salutation" value="Hello"><br/>
    Name: <input type="text" name="name" value="World"><br/>
    <pre ng:bind-template="{{salutation}} {{name}}!"></pre>
 * 
 * @scenario
   it('should check ng:bind', function(){
     expect(using('.doc-example-live').binding('{{salutation}} {{name}}')).
       toBe('Hello World!');
     using('.doc-example-live').input('salutation').enter('Greetings');
     using('.doc-example-live').input('name').enter('user');
     expect(using('.doc-example-live').binding('{{salutation}} {{name}}')).
       toBe('Greetings user!');
   });
 */
angularDirective("ng:bind-template", function(expression, element){
  element.addClass('ng-binding');
  var templateFn = compileBindTemplate(expression);
  return function(element) {
    var lastValue;
    this.$onEval(function() {
      var value = templateFn.call(this, element);
      if (value != lastValue) {
        element.text(value);
        lastValue = value;
      }
    }, element);
  };
});

var REMOVE_ATTRIBUTES = {
  'disabled':'disabled',
  'readonly':'readOnly',
  'checked':'checked',
  'selected':'selected'
};
/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:bind-attr
 *
 * @description
 * The `ng:bind-attr` attribute specifies that the element attributes 
 * which should be replaced by the expression in it. Unlike `ng:bind` 
 * the `ng:bind-attr` contains a JSON key value pairs representing 
 * which attributes need to be changed. You don’t usually write the 
 * `ng:bind-attr` in the HTML since embedding 
 * <tt ng:non-bindable>{{expression}}</tt> into the 
 * attribute directly is the preferred way. The attributes get
 * translated into `<span ng:bind-attr="{attr:expression}"/>` at
 * bootstrap time.
 * 
 * This HTML snippet is preferred way of working with `ng:bind-attr`
 * <pre>
 *   <a href="http://www.google.com/search?q={{query}}">Google</a>
 * </pre>
 * 
 * The above gets translated to bellow during bootstrap time.
 * <pre>
 *   <a ng:bind-attr='{"href":"http://www.google.com/search?q={{query}}"}'>Google</a>
 * </pre>
 * 
 * @element ANY
 * @param {string} attribute_json a JSON key-value pairs representing 
 *    the attributes to replace. Each key matches the attribute 
 *    which needs to be replaced. Each value is a text template of 
 *    the attribute with embedded 
 *    <tt ng:non-bindable>{{expression}}</tt>s. Any number of 
 *    key-value pairs can be specified.
 *
 * @exampleDescription
 * Try it here: enter text in text box and click Google.
 * @example
    Google for: 
    <input type="text" name="query" value="AngularJS"/> 
    <a href="http://www.google.com/search?q={{query}}">Google</a>
 * 
 * @scenario
   it('should check ng:bind-attr', function(){
     expect(using('.doc-example-live').element('a').attr('href')).
       toBe('http://www.google.com/search?q=AngularJS');
     using('.doc-example-live').input('query').enter('google');
     expect(using('.doc-example-live').element('a').attr('href')).
       toBe('http://www.google.com/search?q=google');
   });
 */
angularDirective("ng:bind-attr", function(expression){
  return function(element){
    var lastValue = {};
    var updateFn = element.data($$update) || noop;
    this.$onEval(function(){
      var values = this.$eval(expression),
          dirty = noop;
      for(var key in values) {
        var value = compileBindTemplate(values[key]).call(this, element),
            specialName = REMOVE_ATTRIBUTES[lowercase(key)];
        if (lastValue[key] !== value) {
          lastValue[key] = value;
          if (specialName) {
            if (toBoolean(value)) {
              element.attr(specialName, specialName);
              element.attr('ng-' + specialName, value);
            } else {
              element.removeAttr(specialName);
              element.removeAttr('ng-' + specialName);
            }
            (element.data($$validate)||noop)();
          } else {
            element.attr(key, value);
          }
          dirty = updateFn;
        }
      }
      dirty();
    }, element);
  };
});


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:click
 *
 * @description
 * The ng:click allows you to specify custom behavior when 
 * element is clicked.
 * 
 * @element ANY
 * @param {expression} expression to eval upon click.
 *
 * @example
    <button ng:click="count = count + 1" ng:init="count=0">
      Increment
    </button>
    count: {{count}}
 * @scenario
   it('should check ng:click', function(){
     expect(binding('count')).toBe('0');
     element('.doc-example-live :button').click();
     expect(binding('count')).toBe('1');
   });
 */
/*
 * A directive that allows creation of custom onclick handlers that are defined as angular
 * expressions and are compiled and executed within the current scope.
 *
 * Events that are handled via these handler are always configured not to propagate further.
 *
 * TODO: maybe we should consider allowing users to control event propagation in the future.
 */
angularDirective("ng:click", function(expression, element){
  return function(element){
    var self = this;
    element.bind('click', function(event){
      self.$tryEval(expression, element);
      self.$root.$eval();
      event.stopPropagation();
    });
  };
});


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:submit
 *
 * @description
 * 
 * @element form
 * @param {expression} expression to eval.
 *
 * @exampleDescription
 * @example
 * <form ng:submit="list.push(text);text='';" ng:init="list=[]">
 *   Enter text and hit enter: 
 *   <input type="text" name="text" value="hello"/>
 * </form>
 * <pre>list={{list}}</pre>
 * @scenario
   it('should check ng:submit', function(){
     expect(binding('list')).toBe('list=[]');
     element('.doc-example-live form input').click();
     this.addFutureAction('submit from', function($window, $document, done) {
       $window.angular.element(
         $document.elements('.doc-example-live form')).
           trigger('submit');
       done();
     });
     expect(binding('list')).toBe('list=["hello"]');
   });
 */
/**
 * Enables binding angular expressions to onsubmit events.
 *
 * Additionally it prevents the default action (which for form means sending the request to the
 * server and reloading the current page).
 */
angularDirective("ng:submit", function(expression, element) {
  return function(element) {
    var self = this;
    element.bind('submit', function(event) {
      self.$tryEval(expression, element);
      self.$root.$eval();
      event.preventDefault();
    });
  };
});


/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:watch
 *
 * @description
 * The `ng:watch` allows you watch a variable and then execute 
 * an evaluation on variable change.
 * 
 * @element ANY
 * @param {expression} expression to eval.
 *
 * @exampleDescription
 * Notice that the counter is incremented 
 * every time you change the text.
 * @example
    <div ng:init="counter=0" ng:watch="name: counter = counter+1">
      <input type="text" name="name" value="hello"><br/>
      Change counter: {{counter}} Name: {{name}}
    </div>
 * @scenario
   it('should check ng:watch', function(){
     expect(using('.doc-example-live').binding('counter')).toBe('2');
     using('.doc-example-live').input('name').enter('abc');
     expect(using('.doc-example-live').binding('counter')).toBe('3');
   });
 */
//TODO: delete me, since having watch in UI is logic in UI. (leftover form getangular)
angularDirective("ng:watch", function(expression, element){
  return function(element){
    var self = this;
    parser(expression).watch()({
      addListener:function(watch, exp){
        self.$watch(watch, function(){
          return exp(self);
        }, element);
      }
    });
  };
});

function ngClass(selector) {
  return function(expression, element){
    var existing = element[0].className + ' ';
    return function(element){
      this.$onEval(function(){
        if (selector(this.$index)) {
          var value = this.$eval(expression);
          if (isArray(value)) value = value.join(' ');
          element[0].className = trim(existing + value);
        }
      }, element);
    };
  };
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:class
 *
 * @description
 * The `ng:class` allows you to set CSS class on HTML element 
 * conditionally.
 * 
 * @element ANY
 * @param {expression} expression to eval.
 *
 * @exampleDescription
 * @example
    <input type="button" value="set" ng:click="myVar='ng-input-indicator-wait'">
    <input type="button" value="clear" ng:click="myVar=''">
    <br>
    <span ng:class="myVar">Sample Text &nbsp;&nbsp;&nbsp;&nbsp;</span>
 * 
 * @scenario
   it('should check ng:class', function(){
     expect(element('.doc-example-live span').attr('className')).not().
       toMatch(/ng-input-indicator-wait/);

     using('.doc-example-live').element(':button:first').click();

     expect(element('.doc-example-live span').attr('className')).
       toMatch(/ng-input-indicator-wait/);

     using('.doc-example-live').element(':button:last').click();
     
     expect(element('.doc-example-live span').attr('className')).not().
       toMatch(/ng-input-indicator-wait/);
   });
 */
angularDirective("ng:class", ngClass(function(){return true;}));

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:class-odd
 *
 * @description
 * The `ng:class-odd` and `ng:class-even` works exactly as 
 * `ng:class`, except it works in conjunction with `ng:repeat` 
 * and takes affect only on odd (even) rows.
 *
 * @element ANY
 * @param {expression} expression to eval. Must be inside 
 * `ng:repeat`.

 *
 * @exampleDescription
 * @example
    <ol ng:init="names=['John', 'Mary', 'Cate', 'Suz']">
      <li ng:repeat="name in names">
       <span ng:class-odd="'ng-format-negative'"
             ng:class-even="'ng-input-indicator-wait'">
         {{name}} &nbsp; &nbsp; &nbsp; 
       </span>
      </li>
    </ol>
 * 
 * @scenario
   it('should check ng:class-odd and ng:class-even', function(){
     expect(element('.doc-example-live li:first span').attr('className')).
       toMatch(/ng-format-negative/);
     expect(element('.doc-example-live li:last span').attr('className')).
       toMatch(/ng-input-indicator-wait/);
   });
 */
angularDirective("ng:class-odd", ngClass(function(i){return i % 2 === 0;}));

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:class-even
 *
 * @description
 * The `ng:class-odd` and `ng:class-even` works exactly as 
 * `ng:class`, except it works in conjunction with `ng:repeat` 
 * and takes affect only on odd (even) rows.
 *
 * @element ANY
 * @param {expression} expression to eval. Must be inside 
 * `ng:repeat`.

 *
 * @exampleDescription
 * @example
    <ol ng:init="names=['John', 'Mary', 'Cate', 'Suz']">
      <li ng:repeat="name in names">
       <span ng:class-odd="'ng-format-negative'"
             ng:class-even="'ng-input-indicator-wait'">
         {{name}} &nbsp; &nbsp; &nbsp; 
       </span>
      </li>
    </ol>
 * 
 * @scenario
   it('should check ng:class-odd and ng:class-even', function(){
     expect(element('.doc-example-live li:first span').attr('className')).
       toMatch(/ng-format-negative/);
     expect(element('.doc-example-live li:last span').attr('className')).
       toMatch(/ng-input-indicator-wait/);
   });
 */
angularDirective("ng:class-even", ngClass(function(i){return i % 2 === 1;}));

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:show
 *
 * @description
 * The `ng:show` and `ng:hide` allows you to show or hide a portion
 * of the HTML conditionally.
 * 
 * @element ANY
 * @param {expression} expression if truthy then the element is 
 * shown or hidden respectively.
 *
 * @exampleDescription
 * @example
    Click me: <input type="checkbox" name="checked"><br/>
    Show: <span ng:show="checked">I show up when you checkbox is checked?</span> <br/>
    Hide: <span ng:hide="checked">I hide when you checkbox is checked?</span>
 * 
 * @scenario
   it('should check ng:show / ng:hide', function(){
     expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
     expect(element('.doc-example-live span:last:visible').count()).toEqual(1);
     
     input('checked').check();
     
     expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
     expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
   });
 */
angularDirective("ng:show", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css($display, toBoolean(this.$eval(expression)) ? '' : $none);
    }, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:hide
 *
 * @description
 * The `ng:show` and `ng:hide` allows you to show or hide a portion
 * of the HTML conditionally.
 * 
 * @element ANY
 * @param {expression} expression if truthy then the element is 
 * shown or hidden respectively.
 *
 * @exampleDescription
 * @example
    Click me: <input type="checkbox" name="checked"><br/>
    Show: <span ng:show="checked">I show up when you checkbox is checked?</span> <br/>
    Hide: <span ng:hide="checked">I hide when you checkbox is checked?</span>
 * 
 * @scenario
   it('should check ng:show / ng:hide', function(){
     expect(element('.doc-example-live span:first:hidden').count()).toEqual(1);
     expect(element('.doc-example-live span:last:visible').count()).toEqual(1);
     
     input('checked').check();
     
     expect(element('.doc-example-live span:first:visible').count()).toEqual(1);
     expect(element('.doc-example-live span:last:hidden').count()).toEqual(1);
   });
 */
angularDirective("ng:hide", function(expression, element){
  return function(element){
    this.$onEval(function(){
      element.css($display, toBoolean(this.$eval(expression)) ? $none : '');
    }, element);
  };
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:style
 *
 * @description
 * The ng:style allows you to set CSS style on an HTML element conditionally.
 * 
 * @element ANY
 * @param {expression} expression which evals to an object whes key's are 
 *        CSS style names and values are coresponding values for those 
 *        CSS keys.
 *
 * @exampleDescription
 * @example
    <input type="button" value="set" ng:click="myStyle={color:'red'}">
    <input type="button" value="clear" ng:click="myStyle={}">
    <br/>
    <span ng:style="myStyle">Sample Text</span>
    <pre>myStyle={{myStyle}}</pre>
 * 
 * @scenario
   it('should check ng:style', function(){
     expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
     element('.doc-example-live :button[value=set]').click();
     expect(element('.doc-example-live span').css('color')).toBe('red');
     element('.doc-example-live :button[value=clear]').click();
     expect(element('.doc-example-live span').css('color')).toBe('rgb(0, 0, 0)');
   });
 */
angularDirective("ng:style", function(expression, element){
  return function(element){
    var resetStyle = getStyle(element);
    this.$onEval(function(){
      var style = this.$eval(expression) || {}, key, mergedStyle = {};
      for(key in style) {
        if (resetStyle[key] === _undefined) resetStyle[key] = '';
        mergedStyle[key] = style[key];
      }
      for(key in resetStyle) {
        mergedStyle[key] = mergedStyle[key] || resetStyle[key];
      }
      element.css(mergedStyle);
    }, element);
  };
});

function parseBindings(string) {
  var results = [];
  var lastIndex = 0;
  var index;
  while((index = string.indexOf('{{', lastIndex)) > -1) {
    if (lastIndex < index)
      results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;

    index = string.indexOf('}}', index);
    index = index < 0 ? string.length : index + 2;

    results.push(string.substr(lastIndex, index - lastIndex));
    lastIndex = index;
  }
  if (lastIndex != string.length)
    results.push(string.substr(lastIndex, string.length - lastIndex));
  return results.length === 0 ? [ string ] : results;
}

function binding(string) {
  var binding = string.replace(/\n/gm, ' ').match(/^\{\{(.*)\}\}$/);
  return binding ? binding[1] : _null;
}

function hasBindings(bindings) {
  return bindings.length > 1 || binding(bindings[0]) !== _null;
}

angularTextMarkup('{{}}', function(text, textNode, parentElement) {
  var bindings = parseBindings(text),
      self = this;
  if (hasBindings(bindings)) {
    if (isLeafNode(parentElement[0])) {
      parentElement.attr('ng:bind-template', text);
    } else {
      var cursor = textNode, newElement;
      foreach(parseBindings(text), function(text){
        var exp = binding(text);
        if (exp) {
          newElement = self.element('span');
          newElement.attr('ng:bind', exp);
        } else {
          newElement = self.text(text);
        }
        if (msie && text.charAt(0) == ' ') {
          newElement = jqLite('<span>&nbsp;</span>');
          var nbsp = newElement.html();
          newElement.text(text.substr(1));
          newElement.html(nbsp + newElement.html());
        }
        cursor.after(newElement);
        cursor = newElement;
      });
      textNode.remove();
    }
  }
});

// TODO: this should be widget not a markup
angularTextMarkup('OPTION', function(text, textNode, parentElement){
  if (nodeName(parentElement) == "OPTION") {
    var select = document.createElement('select');
    select.insertBefore(parentElement[0].cloneNode(true), _null);
    if (!select.innerHTML.match(/<option(\s.*\s|\s)value\s*=\s*.*>.*<\/\s*option\s*>/gi)) {
      parentElement.attr('value', text);
    }
  }
});

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:href
 *
 * @description
 * Using <angular/> markup like {{hash}} in an href attribute makes 
 * the page open to a wrong URL, ff the user clicks that link before 
 * angular has a chance to replace the {{hash}} with actual URL, the 
 * link will be broken and will most likely return a 404 error. 
 * The `ng:href` solves this problem by placing the `href` in the 
 * `ng:` namespace.
 *
 * The buggy way to write it:
 * <pre>
 * <a href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 * 
 * The correct way to write it:
 * <pre>
 * <a ng:href="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element ANY
 * @param {template} template any string which can contain `{{}}` markup.
 */

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:src
 *
 * @description
 * Using <angular/> markup like `{{hash}}` in a `src` attribute doesn't 
 * work right: The browser will fetch from the URL with the literal 
 * text `{{hash}}` until <angular/> replaces the expression inside
 * `{{hash}}`. The `ng:src` attribute solves this problem by placing
 *  the `src` attribute in the `ng:` namespace.
 *
 * The buggy way to write it:
 * <pre>
 * <img src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 * 
 * The correct way to write it:
 * <pre>
 * <img ng:src="http://www.gravatar.com/avatar/{{hash}}"/>
 * </pre>
 *
 * @element ANY
 * @param {template} template any string which can contain `{{}}` markup.
 */

var NG_BIND_ATTR = 'ng:bind-attr';
var SPECIAL_ATTRS = {'ng:src': 'src', 'ng:href': 'href'};
angularAttrMarkup('{{}}', function(value, name, element){
  // don't process existing attribute markup
  if (angularDirective(name) || angularDirective("@" + name)) return;
  if (msie && name == 'src')
    value = decodeURI(value);
  var bindings = parseBindings(value),
      bindAttr;
  if (hasBindings(bindings)) {
    element.removeAttr(name);
    bindAttr = fromJson(element.attr(NG_BIND_ATTR) || "{}");
    bindAttr[SPECIAL_ATTRS[name] || name] = value;
    element.attr(NG_BIND_ATTR, toJson(bindAttr));
  }
});
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.HTML
 *
 * @description
 * The most common widgets you will use will be in the from of the
 * standard HTML set. These widgets are bound using the name attribute
 * to an expression. In addition they can have `ng:validate`, `ng:required`,
 * `ng:format`, `ng:change` attribute to further control their behavior.
 * 
 * @usageContent
 *   see example below for usage
 * 
 *   <input type="text|checkbox|..." ... />
 *   <textarea ... />
 *   <select ...>
 *     <option>...</option>
 *   </select>
 * 
 * @example
<table style="font-size:.9em;">
  <tr>
    <th>Name</th>
    <th>Format</th>
    <th>HTML</th>
    <th>UI</th>
    <th ng:non-bindable>{{input#}}</th>
  </tr>
  <tr>
    <th>text</th>
    <td>String</td>
    <td><tt>&lt;input type="text" name="input1"&gt;</tt></td>
    <td><input type="text" name="input1" size="4"></td>
    <td><tt>{{input1|json}}</tt></td>
  </tr>
  <tr>
    <th>textarea</th>
    <td>String</td>
    <td><tt>&lt;textarea name="input2"&gt;&lt;/textarea&gt;</tt></td>
    <td><textarea name="input2" cols='6'></textarea></td>
    <td><tt>{{input2|json}}</tt></td>
  </tr>
  <tr>
    <th>radio</th>
    <td>String</td>
    <td><tt>
      &lt;input type="radio" name="input3" value="A"&gt;<br>
      &lt;input type="radio" name="input3" value="B"&gt;
    </tt></td>
    <td>
      <input type="radio" name="input3" value="A">
      <input type="radio" name="input3" value="B">
    </td>
    <td><tt>{{input3|json}}</tt></td>
  </tr>
  <tr>
    <th>checkbox</th>
    <td>Boolean</td>
    <td><tt>&lt;input type="checkbox" name="input4" value="checked"&gt;</tt></td>
    <td><input type="checkbox" name="input4" value="checked"></td>
    <td><tt>{{input4|json}}</tt></td>
  </tr>
  <tr>
    <th>pulldown</th>
    <td>String</td>
    <td><tt>
      &lt;select name="input5"&gt;<br>
      &nbsp;&nbsp;&lt;option value="c"&gt;C&lt;/option&gt;<br>
      &nbsp;&nbsp;&lt;option value="d"&gt;D&lt;/option&gt;<br>
      &lt;/select&gt;<br>
    </tt></td>
    <td>
      <select name="input5">
        <option value="c">C</option>
        <option value="d">D</option>
      </select>
    </td>
    <td><tt>{{input5|json}}</tt></td>
  </tr>
  <tr>
    <th>multiselect</th>
    <td>Array</td>
    <td><tt>
      &lt;select name="input6" multiple size="4"&gt;<br>
      &nbsp;&nbsp;&lt;option value="e"&gt;E&lt;/option&gt;<br>
      &nbsp;&nbsp;&lt;option value="f"&gt;F&lt;/option&gt;<br>
      &lt;/select&gt;<br>
    </tt></td>
    <td>
      <select name="input6" multiple size="4">
        <option value="e">E</option>
        <option value="f">F</option>
      </select>
    </td>
    <td><tt>{{input6|json}}</tt></td>
  </tr>
</table>
 
 * @scenario
 * it('should exercise text', function(){
 *   input('input1').enter('Carlos');
 *   expect(binding('input1')).toEqual('"Carlos"');
 * });
 * it('should exercise textarea', function(){
 *   input('input2').enter('Carlos');
 *   expect(binding('input2')).toEqual('"Carlos"');
 * });
 * it('should exercise radio', function(){
 *   expect(binding('input3')).toEqual('null');
 *   input('input3').select('A');
 *   expect(binding('input3')).toEqual('"A"');
 *   input('input3').select('B');
 *   expect(binding('input3')).toEqual('"B"');
 * });
 * it('should exercise checkbox', function(){
 *   expect(binding('input4')).toEqual('false');
 *   input('input4').check();
 *   expect(binding('input4')).toEqual('true');
 * });
 * it('should exercise pulldown', function(){
 *   expect(binding('input5')).toEqual('"c"');
 *   select('input5').option('d');
 *   expect(binding('input5')).toEqual('"d"');
 * });
 * it('should exercise multiselect', function(){
 *   expect(binding('input6')).toEqual('[]');
 *   select('input6').options('e');
 *   expect(binding('input6')).toEqual('["e"]');
 *   select('input6').options('e', 'f');
 *   expect(binding('input6')).toEqual('["e","f"]');
 * });
 */

function modelAccessor(scope, element) {
  var expr = element.attr('name');
  if (!expr) throw "Required field 'name' not found.";
  return {
    get: function() {
      return scope.$eval(expr);
    },
    set: function(value) {
      if (value !== _undefined) {
        return scope.$tryEval(expr + '=' + toJson(value), element);
      }
    }
  };
}

function modelFormattedAccessor(scope, element) {
  var accessor = modelAccessor(scope, element),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = angularFormatter(formatterName);
  if (!formatter) throw "Formatter named '" + formatterName + "' not found.";
  return {
    get: function() {
      return formatter.format(accessor.get());
    },
    set: function(value) {
      return accessor.set(formatter.parse(value));
    }
  };
}

function compileValidator(expr) {
  return parser(expr).validator()();
}

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:validate
 *
 * @description
 * The `ng:validate` attribute widget validates the user input. If the input does not pass
 * validation, the `ng-validation-error` CSS class and the `ng:error` attribute are set on the input
 * element. Check out {@link angular.validator validators} to find out more.
 *
 * @param {string} validator The name of a built-in or custom {@link angular.validator validator} to
 *     to be used.
 *
 * @element INPUT
 * @css ng-validation-error
 *
 * @exampleDescription
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
 * @example
    I don't validate:
    <input type="text" name="value" value="NotANumber"><br/>

    I need an integer or nothing:
    <input type="text" name="value" ng:validate="integer"><br/>
 * 
 * @scenario
   it('should check ng:validate', function(){
     expect(element('.doc-example-live :input:last').attr('className')).
       toMatch(/ng-validation-error/);

     input('value').enter('123');
     expect(element('.doc-example-live :input:last').attr('className')).
       not().toMatch(/ng-validation-error/);
   });
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:required
 *
 * @description
 * The `ng:required` attribute widget validates that the user input is present. It is a special case
 * of the {@link angular.widget.@ng:validate ng:validate} attribute widget.
 * 
 * @element INPUT
 * @css ng-validation-error
 *
 * @exampleDescription
 * This example shows how the input element becomes red when it contains invalid input. Correct
 * the input to make the error disappear.
 *
 * @example
    I cannot be blank: <input type="text" name="value" ng:required><br/>
 *
 * @scenario
   it('should check ng:required', function(){
     expect(element('.doc-example-live :input').attr('className')).toMatch(/ng-validation-error/);
     input('value').enter('123');
     expect(element('.doc-example-live :input').attr('className')).not().toMatch(/ng-validation-error/);
   });
 */
/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:format
 *
 * @description
 * The `ng:format` attribute widget formats stored data to user-readable text and parses the text
 * back to the stored form. You might find this useful for example if you collect user input in a
 * text field but need to store the data in the model as a list. Check out
 * {@link angular.formatter formatters} to learn more.
 *
 * @param {string} formatter The name of the built-in or custom {@link angular.formatter formatter}
 *     to be used.
 *
 * @element INPUT
 *
 * @exampleDescription
 * This example shows how the user input is converted from a string and internally represented as an
 * array.
 *
 * @example
    Enter a comma separated list of items: 
    <input type="text" name="list" ng:format="list" value="table, chairs, plate">
    <pre>list={{list}}</pre>
 * 
 * @scenario
   it('should check ng:format', function(){
     expect(binding('list')).toBe('list=["table","chairs","plate"]');
     input('list').enter(',,, a ,,,');
     expect(binding('list')).toBe('list=["a"]');
   });
 */
function valueAccessor(scope, element) {
  var validatorName = element.attr('ng:validate') || NOOP,
      validator = compileValidator(validatorName),
      requiredExpr = element.attr('ng:required'),
      formatterName = element.attr('ng:format') || NOOP,
      formatter = angularFormatter(formatterName),
      format, parse, lastError, required,
      invalidWidgets = scope.$invalidWidgets || {markValid:noop, markInvalid:noop};
  if (!validator) throw "Validator named '" + validatorName + "' not found.";
  if (!formatter) throw "Formatter named '" + formatterName + "' not found.";
  format = formatter.format;
  parse = formatter.parse;
  if (requiredExpr) {
    scope.$watch(requiredExpr, function(newValue) {
      required = newValue;
      validate();
    });
  } else {
    required = requiredExpr === '';
  }

  element.data($$validate, validate);
  return {
    get: function(){
      if (lastError)
        elementError(element, NG_VALIDATION_ERROR, _null);
      try {
        var value = parse(element.val());
        validate();
        return value;
      } catch (e) {
        lastError = e;
        elementError(element, NG_VALIDATION_ERROR, e);
      }
    },
    set: function(value) {
      var oldValue = element.val(),
          newValue = format(value);
      if (oldValue != newValue) {
        element.val(newValue || ''); // needed for ie
      }
      validate();
    }
  };

  function validate() {
    var value = trim(element.val());
    if (element[0].disabled || element[0].readOnly) {
      elementError(element, NG_VALIDATION_ERROR, _null);
      invalidWidgets.markValid(element);
    } else {
      var error, validateScope = inherit(scope, {$element:element});
      error = required && !value ?
              'Required' :
              (value ? validator(validateScope, value) : _null);
      elementError(element, NG_VALIDATION_ERROR, error);
      lastError = error;
      if (error) {
        invalidWidgets.markInvalid(element);
      } else {
        invalidWidgets.markValid(element);
      }
    }
  }
}

function checkedAccessor(scope, element) {
  var domElement = element[0], elementValue = domElement.value;
  return {
    get: function(){
      return !!domElement.checked;
    },
    set: function(value){
      domElement.checked = toBoolean(value);
    }
  };
}

function radioAccessor(scope, element) {
  var domElement = element[0];
  return {
    get: function(){
      return domElement.checked ? domElement.value : _null;
    },
    set: function(value){
      domElement.checked = value == domElement.value;
    }
  };
}

function optionsAccessor(scope, element) {
  var options = element[0].options;
  return {
    get: function(){
      var values = [];
      foreach(options, function(option){
        if (option.selected) values.push(option.value);
      });
      return values;
    },
    set: function(values){
      var keys = {};
      foreach(values, function(value){ keys[value] = true; });
      foreach(options, function(option){
        option.selected = keys[option.value];
      });
    }
  };
}

function noopAccessor() { return { get: noop, set: noop }; }

var textWidget = inputWidget('keyup change', modelAccessor, valueAccessor, initWidgetValue()),
    buttonWidget = inputWidget('click', noopAccessor, noopAccessor, noop),
    INPUT_TYPE = {
      'text':            textWidget,
      'textarea':        textWidget,
      'hidden':          textWidget,
      'password':        textWidget,
      'button':          buttonWidget,
      'submit':          buttonWidget,
      'reset':           buttonWidget,
      'image':           buttonWidget,
      'checkbox':        inputWidget('click', modelFormattedAccessor, checkedAccessor, initWidgetValue(false)),
      'radio':           inputWidget('click', modelFormattedAccessor, radioAccessor, radioInit),
      'select-one':      inputWidget('change', modelFormattedAccessor, valueAccessor, initWidgetValue(_null)),
      'select-multiple': inputWidget('change', modelFormattedAccessor, optionsAccessor, initWidgetValue([]))
//      'file':            fileWidget???
    };


function initWidgetValue(initValue) {
  return function (model, view) {
    var value = view.get();
    if (!value && isDefined(initValue)) {
      value = copy(initValue);
    }
    if (isUndefined(model.get()) && isDefined(value)) {
      model.set(value);
    }
  };
}

function radioInit(model, view, element) {
 var modelValue = model.get(), viewValue = view.get(), input = element[0];
 input.checked = false;
 input.name = this.$id + '@' + input.name;
 if (isUndefined(modelValue)) {
   model.set(modelValue = _null);
 }
 if (modelValue == _null && viewValue !== _null) {
   model.set(viewValue);
 }
 view.set(modelValue);
}

/**
 * @workInProgress
 * @ngdoc directive
 * @name angular.directive.ng:change
 *
 * @description
 * The directive executes an expression whenever the input widget changes.
 * 
 * @element INPUT
 * @param {expression} expression to execute.
 *
 * @exampleDescription
 * @example
    <div ng:init="checkboxCount=0; textCount=0"></div>
    <input type="text" name="text" ng:change="textCount = 1 + textCount">
       changeCount {{textCount}}<br/>
    <input type="checkbox" name="checkbox" ng:change="checkboxCount = 1 + checkboxCount">
       changeCount {{checkboxCount}}<br/>
 * 
 * @scenario
   it('should check ng:change', function(){
     expect(binding('textCount')).toBe('0');
     expect(binding('checkboxCount')).toBe('0');
     
     using('.doc-example-live').input('text').enter('abc');
     expect(binding('textCount')).toBe('1');
     expect(binding('checkboxCount')).toBe('0');
     
     
     using('.doc-example-live').input('checkbox').check();
     expect(binding('textCount')).toBe('1');
     expect(binding('checkboxCount')).toBe('1');
   });
 */
function inputWidget(events, modelAccessor, viewAccessor, initFn) {
  return function(element) {
    var scope = this,
        model = modelAccessor(scope, element),
        view = viewAccessor(scope, element),
        action = element.attr('ng:change') || '',
        lastValue;
    initFn.call(scope, model, view, element);
    this.$eval(element.attr('ng:init')||'');
    // Don't register a handler if we are a button (noopAccessor) and there is no action
    if (action || modelAccessor !== noopAccessor) {
      element.bind(events, function (){
        model.set(view.get());
        lastValue = model.get();
        scope.$tryEval(action, element);
        scope.$root.$eval();
      });
    }
    scope.$watch(model.get, function(value){
      if (lastValue !== value) {
        view.set(lastValue = value);
      }
    });
  };
}

function inputWidgetSelector(element){
  this.directives(true);
  return INPUT_TYPE[lowercase(element[0].type)] || noop;
}

angularWidget('input', inputWidgetSelector);
angularWidget('textarea', inputWidgetSelector);
angularWidget('button', inputWidgetSelector);
angularWidget('select', function(element){
  this.descend(true);
  return inputWidgetSelector.call(this, element);
});


/*
 * Consider this:
 * <select name="selection">
 *   <option ng:repeat="x in [1,2]">{{x}}</option>
 * </select>
 * 
 * The issue is that the select gets evaluated before option is unrolled.
 * This means that the selection is undefined, but the browser
 * default behavior is to show the top selection in the list. 
 * To fix that we register a $update function on the select element
 * and the option creation then calls the $update function when it is 
 * unrolled. The $update function then calls this update function, which 
 * then tries to determine if the model is unassigned, and if so it tries to
 * chose one of the options from the list.
 */
angularWidget('option', function(){
  this.descend(true);
  this.directives(true);
  return function(element) {
    var select = element.parent();
    var scope = retrieveScope(select);
    var model = modelFormattedAccessor(scope, select);
    var view = valueAccessor(scope, select);
    var option = element;
    var lastValue = option.attr($value);
    var lastSelected = option.attr('ng-' + $selected);
    element.data($$update, function(){
      var value = option.attr($value);
      var selected = option.attr('ng-' + $selected);
      var modelValue = model.get();
      if (lastSelected != selected || lastValue != value) {
        lastSelected = selected;
        lastValue = value;
        if (selected || modelValue == _null || modelValue == _undefined) 
          model.set(value);
        if (value == modelValue) {
          view.set(lastValue);
        }
      }
    });
  };
});

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.ng:include
 *
 * @description
 * Include external HTML fragment.
 * 
 * Keep in mind that Same Origin Policy applies to included resources 
 * (e.g. ng:include won't work for file:// access).
 *
 * @param {string} src expression evaluating to URL.
 * @param {Scope=} [scope=new_child_scope] expression evaluating to angular.scope
 * @param {string=} onload Expression to evaluate when a new partial is loaded.
 *
 * @example
 *   <select name="url">
 *    <option value="angular.filter.date.html">date filter</option>
 *    <option value="angular.filter.html.html">html filter</option>
 *    <option value="">(blank)</option>
 *   </select>
 *   <tt>url = <a href="{{url}}">{{url}}</a></tt>
 *   <hr/>
 *   <ng:include src="url"></ng:include>
 *
 * @scenario
 * it('should load date filter', function(){
 *   expect(element('.doc-example ng\\:include').text()).toMatch(/angular\.filter\.date/);
 * });
 * it('should change to hmtl filter', function(){
 *   select('url').option('angular.filter.html.html');
 *   expect(element('.doc-example ng\\:include').text()).toMatch(/angular\.filter\.html/);
 * });
 * it('should change to blank', function(){
 *   select('url').option('(blank)');
 *   expect(element('.doc-example ng\\:include').text()).toEqual('');
 * });
 */
angularWidget('ng:include', function(element){
  var compiler = this,
      srcExp = element.attr("src"),
      scopeExp = element.attr("scope") || '',
      onloadExp = element[0].getAttribute('onload') || ''; //workaround for jquery bug #7537
  if (element[0]['ng:compiled']) {
    this.descend(true);
    this.directives(true);
  } else {
    element[0]['ng:compiled'] = true;
    return extend(function(xhr, element){
      var scope = this, childScope;
      var changeCounter = 0;
      var preventRecursion = false;
      function incrementChange(){ changeCounter++;}
      this.$watch(srcExp, incrementChange);
      this.$watch(scopeExp, incrementChange);
      scope.$onEval(function(){
        if (childScope && !preventRecursion) {
          preventRecursion = true;
          try {
            childScope.$eval();
          } finally {
            preventRecursion = false;
          }
        }
      });
      this.$watch(function(){return changeCounter;}, function(){
        var src = this.$eval(srcExp),
            useScope = this.$eval(scopeExp);

        if (src) {
          xhr('GET', src, function(code, response){
            element.html(response);
            childScope = useScope || createScope(scope);
            compiler.compile(element)(element, childScope);
            childScope.$init();
            scope.$eval(onloadExp);
          });
        } else {
          childScope = null;
          element.html('');
        }
      });
    }, {$inject:['$xhr.cache']});
  }
});

/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.ng:switch
 *
 * @description
 * Conditionally change the DOM structure.
 * 
 * @usageContent
 * <any ng:switch-when="matchValue1">...</any>
 *   <any ng:switch-when="matchValue2">...</any>
 *   ...
 *   <any ng:switch-default>...</any>
 * 
 * @param {*} on expression to match against <tt>ng:switch-when</tt>.
 * @paramDescription 
 * On child elments add:
 * 
 * * `ng:switch-when`: the case statement to match against. If match then this
 *   case will be displayed.
 * * `ng:switch-default`: the default case when no other casses match.
 *
 * @example
    <select name="switch">
      <option>settings</option>
      <option>home</option>
      <option>other</option>
    </select>
    <tt>switch={{switch}}</tt>
    </hr>
    <ng:switch on="switch" >
      <div ng:switch-when="settings">Settings Div</div>
      <span ng:switch-when="home">Home Span</span>
      <span ng:switch-default>default</span>
    </ng:switch>
    </code>
 *
 * @scenario
 * it('should start in settings', function(){
 *   expect(element('.doc-example ng\\:switch').text()).toEqual('Settings Div');
 * });
 * it('should change to home', function(){
 *   select('switch').option('home');
 *   expect(element('.doc-example ng\\:switch').text()).toEqual('Home Span');
 * });
 * it('should select deafault', function(){
 *   select('switch').option('other');
 *   expect(element('.doc-example ng\\:switch').text()).toEqual('default');
 * });
 */
var ngSwitch = angularWidget('ng:switch', function (element){
  var compiler = this,
      watchExpr = element.attr("on"),
      usingExpr = (element.attr("using") || 'equals'),
      usingExprParams = usingExpr.split(":"),
      usingFn = ngSwitch[usingExprParams.shift()],
      changeExpr = element.attr('change') || '',
      cases = [];
  if (!usingFn) throw "Using expression '" + usingExpr + "' unknown.";
  if (!watchExpr) throw "Missing 'on' attribute.";
  eachNode(element, function(caseElement){
    var when = caseElement.attr('ng:switch-when');
    var switchCase = {
        change: changeExpr,
        element: caseElement,
        template: compiler.compile(caseElement)
      };
    if (isString(when)) {
      switchCase.when = function(scope, value){
        var args = [value, when];
        foreach(usingExprParams, function(arg){
          args.push(arg);
        });
        return usingFn.apply(scope, args);
      };
      cases.unshift(switchCase);
    } else if (isString(caseElement.attr('ng:switch-default'))) {
      switchCase.when = valueFn(true);
      cases.push(switchCase);
    }
  });

  // this needs to be here for IE
  foreach(cases, function(_case){
    _case.element.remove();
  });

  element.html('');
  return function(element){
    var scope = this, childScope;
    this.$watch(watchExpr, function(value){
      var found = false;
      element.html('');
      childScope = createScope(scope);
      foreach(cases, function(switchCase){
        if (!found && switchCase.when(childScope, value)) {
          found = true;
          var caseElement = quickClone(switchCase.element);
          element.append(caseElement);
          childScope.$tryEval(switchCase.change, element);
          switchCase.template(caseElement, childScope);
          childScope.$init();
        }
      });
    });
    scope.$onEval(function(){
      if (childScope) childScope.$eval();
    });
  };
}, {
  equals: function(on, when) {
    return ''+on == when;
  },
  route: switchRouteMatcher
});


/*
 * Modifies the default behavior of html A tag, so that the default action is prevented when href
 * attribute is empty.
 *
 * The reasoning for this change is to allow easy creation of action links with ng:click without
 * changing the location or causing page reloads, e.g.:
 * <a href="" ng:click="model.$save()">Save</a>
 */
angularWidget('a', function() {
  this.descend(true);
  this.directives(true);

  return function(element) {
    if (element.attr('href') === '') {
      element.bind('click', function(event){
        event.preventDefault();
      });
    }
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:repeat
 *
 * @description
 * `ng:repeat` instantiates a template once per item from a collection. The collection is enumerated
 * with `ng:repeat-index` attribute starting from 0. Each template instance gets its own scope where
 * the given loop variable is set to the current collection item and `$index` is set to the item
 * index or key.
 *
 * There are special properties exposed on the local scope of each template instance:
 *
 *   * `$index` – `{number}` – iterator offset of the repeated element (0..length-1)
 *   * `$position` – {string} – position of the repeated element in the iterator. One of: `'first'`,
 *     `'middle'` or `'last'`.
 *
 * NOTE: `ng:repeat` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 * @param {string} repeat_expression The expression indicating how to enumerate a collection. Two
 *   formats are currently supported:
 *
 *   * `variable in expression` – where variable is the user defined loop variable and `expression`
 *     is a scope expression giving the collection to enumerate.
 *
 *     For example: `track in cd.tracks`.
 *   * `(key, value) in expression` – where `key` and `value` can be any user defined identifiers,
 *     and `expression` is the scope expression giving the collection to enumerate.
 *
 *     For example: `(name, age) in {'adam':10, 'amalie':12}`.
 *
 * @exampleDescription
 * This example initializes the scope to a list of names and
 * than uses `ng:repeat` to display every person.
 * @example
    <div ng:init="friends = [{name:'John', age:25}, {name:'Mary', age:28}]">
      I have {{friends.length}} friends. They are:
      <ul>
        <li ng:repeat="friend in friends">
          [{{$index + 1}}] {{friend.name}} who is {{friend.age}} years old.
        </li>
      </ul>
    </div>
 * @scenario
   it('should check ng:repeat', function(){
     var r = using('.doc-example-live').repeater('ul li');
     expect(r.count()).toBe(2);
     expect(r.row(0)).toEqual(["1","John","25"]);
     expect(r.row(1)).toEqual(["2","Mary","28"]);
   });
 */
angularWidget("@ng:repeat", function(expression, element){
  element.removeAttr('ng:repeat');
  element.replaceWith(this.comment("ng:repeat: " + expression));
  var template = this.compile(element);
  return function(reference){
    var match = expression.match(/^\s*(.+)\s+in\s+(.*)\s*$/),
        lhs, rhs, valueIdent, keyIdent;
    if (! match) {
      throw Error("Expected ng:repeat in form of 'item in collection' but got '" +
      expression + "'.");
    }
    lhs = match[1];
    rhs = match[2];
    match = lhs.match(/^([\$\w]+)|\(([\$\w]+)\s*,\s*([\$\w]+)\)$/);
    if (!match) {
      throw Error("'item' in 'item in collection' should be identifier or (key, value) but got '" +
      keyValue + "'.");
    }
    valueIdent = match[3] || match[1];
    keyIdent = match[2];

    var children = [], currentScope = this;
    this.$onEval(function(){
      var index = 0,
          childCount = children.length,
          lastElement = reference,
          collection = this.$tryEval(rhs, reference),
          is_array = isArray(collection),
          collectionLength = 0,
          childScope,
          key;

      if (is_array) {
        collectionLength = collection.length;
      } else {
        for (key in collection)
          if (collection.hasOwnProperty(key))
            collectionLength++;
      }

      for (key in collection) {
        if (!is_array || collection.hasOwnProperty(key)) {
          if (index < childCount) {
            // reuse existing child
            childScope = children[index];
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
          } else {
            // grow children
            childScope = template(quickClone(element), createScope(currentScope));
            childScope[valueIdent] = collection[key];
            if (keyIdent) childScope[keyIdent] = key;
            lastElement.after(childScope.$element);
            childScope.$index = index;
            childScope.$position = index == 0 ?
                                      'first' :
                                      (index == collectionLength - 1 ? 'last' : 'middle');
            childScope.$element.attr('ng:repeat-index', index);
            childScope.$init();
            children.push(childScope);
          }
          childScope.$eval();
          lastElement = childScope.$element;
          index ++;
        }
      }
      // shrink children
      while(children.length > index) {
        children.pop().$element.remove();
      }
    }, reference);
  };
});


/**
 * @workInProgress
 * @ngdoc widget
 * @name angular.widget.@ng:non-bindable
 *
 * @description
 * Sometimes it is necessary to write code which looks like bindings but which should be left alone
 * by angular. Use `ng:non-bindable` to make angular ignore a chunk of HTML.
 *
 * NOTE: `ng:non-bindable` looks like a directive, but is actually an attribute widget.
 *
 * @element ANY
 *
 * @exampleDescription
 * In this example there are two location where a siple binding (`{{}}`) is present, but the one
 * wrapped in `ng:non-bindable` is left alone.
 *
 * @example
    <div>Normal: {{1 + 2}}</div>
    <div ng:non-bindable>Ignored: {{1 + 2}}</div>
 *
 * @scenario
   it('should check ng:non-bindable', function(){
     expect(using('.doc-example-live').binding('1 + 2')).toBe('3');
     expect(using('.doc-example-live').element('div:last').text()).
       toMatch(/1 \+ 2/);
   });
 */
angularWidget("@ng:non-bindable", noop);
var browserSingleton;
/**
 * @workInProgress
 * @ngdoc service
 * @name angular.service.$browser
 * @requires $log
 * 
 * @description
 * Represents the browser.
 */
angularService('$browser', function($log){
  if (!browserSingleton) {
    browserSingleton = new Browser(
        window.location,
        jqLite(window.document),
        jqLite(window.document.getElementsByTagName('head')[0]),
        XHR,
        $log,
        window.setTimeout);
    browserSingleton.startPoller(50, function(delay, fn){setTimeout(delay,fn);});
    browserSingleton.bind();
  }
  return browserSingleton;
}, {inject:['$log']});

extend(angular, {
  'element': jqLite,
  'compile': compile,
  'scope': createScope,
  'copy': copy,
  'extend': extend,
  'equals': equals,
  'foreach': foreach,
  'injector': createInjector,
  'noop':noop,
  'bind':bind,
  'toJson': toJson,
  'fromJson': fromJson,
  'identity':identity,
  'isUndefined': isUndefined,
  'isDefined': isDefined,
  'isString': isString,
  'isFunction': isFunction,
  'isObject': isObject,
  'isNumber': isNumber,
  'isArray': isArray
});


/**
 * Setup file for the Scenario.
 * Must be first in the compilation/bootstrap list.
 */

// Public namespace
angular.scenario = angular.scenario || {};

/**
 * Defines a new output format.
 *
 * @param {string} name the name of the new output format
 * @param {Function} fn function(context, runner) that generates the output
 */
angular.scenario.output = angular.scenario.output || function(name, fn) {
  angular.scenario.output[name] = fn;
};

/**
 * Defines a new DSL statement. If your factory function returns a Future
 * it's returned, otherwise the result is assumed to be a map of functions
 * for chaining. Chained functions are subject to the same rules.
 *
 * Note: All functions on the chain are bound to the chain scope so values
 *   set on "this" in your statement function are available in the chained
 *   functions.
 *
 * @param {string} name The name of the statement
 * @param {Function} fn Factory function(), return a function for
 *  the statement.
 */
angular.scenario.dsl = angular.scenario.dsl || function(name, fn) {
  angular.scenario.dsl[name] = function() {
    function executeStatement(statement, args) {
      var result = statement.apply(this, args);
      if (angular.isFunction(result) || result instanceof angular.scenario.Future)
        return result;
      var self = this;
      var chain = angular.extend({}, result);
      angular.foreach(chain, function(value, name) {
        if (angular.isFunction(value)) {
          chain[name] = function() {
            return executeStatement.call(self, value, arguments);
          };
        } else {
          chain[name] = value;
        }
      });
      return chain;
    }
    var statement = fn.apply(this, arguments);
    return function() {
      return executeStatement.call(this, statement, arguments);
    };
  };
};

/**
 * Defines a new matcher for use with the expects() statement. The value
 * this.actual (like in Jasmine) is available in your matcher to compare
 * against. Your function should return a boolean. The future is automatically
 * created for you.
 *
 * @param {string} name The name of the matcher
 * @param {Function} fn The matching function(expected).
 */
angular.scenario.matcher = angular.scenario.matcher || function(name, fn) {
  angular.scenario.matcher[name] = function(expected) {
    var prefix = 'expect ' + this.future.name + ' ';
    if (this.inverse) {
      prefix += 'not ';
    }
    var self = this;
    this.addFuture(prefix + name + ' ' + angular.toJson(expected),
      function(done) {
        var error;
        self.actual = self.future.value;
        if ((self.inverse && fn.call(self, expected)) ||
            (!self.inverse && !fn.call(self, expected))) {
          error = 'expected ' + angular.toJson(expected) +
            ' but was ' + angular.toJson(self.actual);
        }
        done(error);
    });
  };
};

/**
 * Initialization function for the scenario runner.
 *
 * @param {angular.scenario.Runner} $scenario The runner to setup
 * @param {Object} config Config options
 */
function angularScenarioInit($scenario, config) {
  var href = window.location.href;
  var body = _jQuery(document.body);
  var output = [];

  if (config.scenario_output) {
    output = config.scenario_output.split(',');
  }

  angular.foreach(angular.scenario.output, function(fn, name) {
    if (!output.length || indexOf(output,name) != -1) {
      var context = body.append('<div></div>').find('div:last');
      context.attr('id', name);
      fn.call({}, context, $scenario);
    }
  });

  if (!/^http/.test(href) && !/^https/.test(href)) {
    body.append('<p id="system-error"></p>');
    body.find('#system-error').text(
      'Scenario runner must be run using http or https. The protocol ' +
      href.split(':')[0] + ':// is not supported.'
    );
    return;
  }

  var appFrame = body.append('<div id="application"></div>').find('#application');
  var application = new angular.scenario.Application(appFrame);

  $scenario.on('RunnerEnd', function() {
    appFrame.css('display', 'none');
    appFrame.find('iframe').attr('src', 'about:blank');
  });

  $scenario.on('RunnerError', function(error) {
    if (window.console) {
      console.log(formatException(error));
    } else {
      // Do something for IE
      alert(error);
    }
  });

  $scenario.run(application);
}

/**
 * Iterates through list with iterator function that must call the
 * continueFunction to continute iterating.
 *
 * @param {Array} list list to iterate over
 * @param {Function} iterator Callback function(value, continueFunction)
 * @param {Function} done Callback function(error, result) called when
 *   iteration finishes or an error occurs.
 */
function asyncForEach(list, iterator, done) {
  var i = 0;
  function loop(error, index) {
    if (index && index > i) {
      i = index;
    }
    if (error || i >= list.length) {
      done(error);
    } else {
      try {
        iterator(list[i++], loop);
      } catch (e) {
        done(e);
      }
    }
  }
  loop();
}

/**
 * Formats an exception into a string with the stack trace, but limits
 * to a specific line length.
 *
 * @param {Object} error The exception to format, can be anything throwable
 * @param {Number} maxStackLines Optional. max lines of the stack trace to include
 *  default is 5.
 */
function formatException(error, maxStackLines) {
  maxStackLines = maxStackLines || 5;
  var message = error.toString();
  if (error.stack) {
    var stack = error.stack.split('\n');
    if (stack[0].indexOf(message) === -1) {
      maxStackLines++;
      stack.unshift(error.message);
    }
    message = stack.slice(0, maxStackLines).join('\n');
  }
  return message;
}

/**
 * Returns a function that gets the file name and line number from a
 * location in the stack if available based on the call site.
 *
 * Note: this returns another function because accessing .stack is very
 * expensive in Chrome.
 *
 * @param {Number} offset Number of stack lines to skip
 */
function callerFile(offset) {
  var error = new Error();

  return function() {
    var line = (error.stack || '').split('\n')[offset];

    // Clean up the stack trace line
    if (line) {
      if (line.indexOf('@') !== -1) {
        // Firefox
        line = line.substring(line.indexOf('@')+1);
      } else {
        // Chrome
        line = line.substring(line.indexOf('(')+1).replace(')', '');
      }
    }

    return line || '';
  };
}

/**
 * Triggers a browser event. Attempts to choose the right event if one is
 * not specified.
 *
 * @param {Object} Either a wrapped jQuery/jqLite node or a DOMElement
 * @param {string} Optional event type.
 */
function browserTrigger(element, type) {
  if (element && !element.nodeName) element = element[0];
  if (!element) return;
  if (!type) {
    type = {
        'text':            'change',
        'textarea':        'change',
        'hidden':          'change',
        'password':        'change',
        'button':          'click',
        'submit':          'click',
        'reset':           'click',
        'image':           'click',
        'checkbox':        'click',
        'radio':           'click',
        'select-one':      'change',
        'select-multiple': 'change'
    }[element.type] || 'click';
  }
  if (lowercase(nodeName(element)) == 'option') {
    element.parentNode.value = element.value;
    element = element.parentNode;
    type = 'change';
  }
  if (msie) {
    switch(element.type) {
      case 'radio':
      case 'checkbox':
        element.checked = !element.checked;
        break;
    }
    element.fireEvent('on' + type);
    if (lowercase(element.type) == 'submit') {
      while(element) {
        if (lowercase(element.nodeName) == 'form') {
          element.fireEvent('onsubmit');
          break;
        }
        element = element.parentNode;
      }
    }
  } else {
    var evnt = document.createEvent('MouseEvents');
    evnt.initMouseEvent(type, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
    element.dispatchEvent(evnt);
  }
}

/**
 * Don't use the jQuery trigger method since it works incorrectly.
 *
 * jQuery notifies listeners and then changes the state of a checkbox and
 * does not create a real browser event. A real click changes the state of
 * the checkbox and then notifies listeners.
 *
 * To work around this we instead use our own handler that fires a real event.
 */
(function(fn){
  var parentTrigger = fn.trigger;
  fn.trigger = function(type) {
    if (/(click|change|keyup)/.test(type)) {
      return this.each(function(index, node) {
        browserTrigger(node, type);
      });
    }
    return parentTrigger.apply(this, arguments);
  };
})(_jQuery.fn);

/**
 * Finds all bindings with the substring match of name and returns an
 * array of their values.
 *
 * @param {string} name The name to match
 * @return {Array.<string>} String of binding values
 */
_jQuery.fn.bindings = function(name) {
  function contains(text, value) {
    return value instanceof RegExp ?
      value.test(text) :
      text && text.indexOf(value) >= 0;
  }
  var result = [];
  this.find('.ng-binding:visible').each(function() {
    var element = new _jQuery(this);
    if (!angular.isDefined(name) ||
      contains(element.attr('ng:bind'), name) ||
      contains(element.attr('ng:bind-template'), name)) {
      if (element.is('input, textarea')) {
        result.push(element.val());
      } else {
        result.push(element.html());
      }
    }
  });
  return result;
};
/**
 * Represents the application currently being tested and abstracts usage
 * of iframes or separate windows.
 *
 * @param {Object} context jQuery wrapper around HTML context.
 */
angular.scenario.Application = function(context) {
  this.context = context;
  context.append(
    '<h2>Current URL: <a href="about:blank">None</a></h2>' +
    '<div id="test-frames"></div>'
  );
};

/**
 * Gets the jQuery collection of frames. Don't use this directly because
 * frames may go stale.
 *
 * @private
 * @return {Object} jQuery collection
 */
angular.scenario.Application.prototype.getFrame_ = function() {
  return this.context.find('#test-frames iframe:last');
};

/**
 * Gets the window of the test runner frame. Always favor executeAction()
 * instead of this method since it prevents you from getting a stale window.
 *
 * @private
 * @return {Object} the window of the frame
 */
angular.scenario.Application.prototype.getWindow_ = function() {
  var contentWindow = this.getFrame_().attr('contentWindow');
  if (!contentWindow)
    throw 'Frame window is not accessible.';
  return contentWindow;
};

/**
 * Checks that a URL would return a 2xx success status code. Callback is called
 * with no arguments on success, or with an error on failure.
 *
 * Warning: This requires the server to be able to respond to HEAD requests
 * and not modify the state of your application.
 *
 * @param {string} url Url to check
 * @param {Function} callback function(error) that is called with result.
 */
angular.scenario.Application.prototype.checkUrlStatus_ = function(url, callback) {
  var self = this;
  _jQuery.ajax({
    url: url,
    type: 'HEAD',
    complete: function(request) {
      if (request.status < 200 || request.status >= 300) {
        if (!request.status) {
          callback.call(self, 'Sandbox Error: Cannot access ' + url);
        } else {
          callback.call(self, request.status + ' ' + request.statusText);
        }
      } else {
        callback.call(self);
      }
    }
  });
};

/**
 * Changes the location of the frame.
 *
 * @param {string} url The URL. If it begins with a # then only the
 *   hash of the page is changed.
 * @param {Function} loadFn function($window, $document) Called when frame loads.
 * @param {Function} errorFn function(error) Called if any error when loading.
 */
angular.scenario.Application.prototype.navigateTo = function(url, loadFn, errorFn) {
  var self = this;
  var frame = this.getFrame_();
  //TODO(esprehn): Refactor to use rethrow()
  errorFn = errorFn || function(e) { throw e; };
  if (url === 'about:blank') {
    errorFn('Sandbox Error: Navigating to about:blank is not allowed.');
  } else if (url.charAt(0) === '#') {
    url = frame.attr('src').split('#')[0] + url;
    frame.attr('src', url);
    this.executeAction(loadFn);
  } else {
    frame.css('display', 'none').attr('src', 'about:blank');
    this.checkUrlStatus_(url, function(error) {
      if (error) {
        return errorFn(error);
      }
      self.context.find('#test-frames').append('<iframe>');
      frame = this.getFrame_();
      frame.load(function() {
        frame.unbind();
        try {
          self.executeAction(loadFn);
        } catch (e) {
          errorFn(e);
        }
      }).attr('src', url);
    });
  }
  this.context.find('> h2 a').attr('href', url).text(url);
};

/**
 * Executes a function in the context of the tested application. Will wait
 * for all pending angular xhr requests before executing.
 *
 * @param {Function} action The callback to execute. function($window, $document)
 *  $document is a jQuery wrapped document.
 */
angular.scenario.Application.prototype.executeAction = function(action) {
  var self = this;
  var $window = this.getWindow_();
  if (!$window.document) {
    throw 'Sandbox Error: Application document not accessible.';
  }
  if (!$window.angular) {
    return action.call(this, $window, _jQuery($window.document));
  }
  var $browser = $window.angular.service.$browser();
  $browser.poll();
  $browser.notifyWhenNoOutstandingRequests(function() {
    action.call(self, $window, _jQuery($window.document));
  });
};
/**
 * The representation of define blocks. Don't used directly, instead use
 * define() in your tests.
 *
 * @param {string} descName Name of the block
 * @param {Object} parent describe or undefined if the root.
 */
angular.scenario.Describe = function(descName, parent) {
  this.only = parent && parent.only;
  this.beforeEachFns = [];
  this.afterEachFns = [];
  this.its = [];
  this.children = [];
  this.name = descName;
  this.parent = parent;
  this.id = angular.scenario.Describe.id++;

  /**
   * Calls all before functions.
   */
  var beforeEachFns = this.beforeEachFns;
  this.setupBefore = function() {
    if (parent) parent.setupBefore.call(this);
    angular.foreach(beforeEachFns, function(fn) { fn.call(this); }, this);
  };

  /**
   * Calls all after functions.
   */
  var afterEachFns = this.afterEachFns;
  this.setupAfter  = function() {
    angular.foreach(afterEachFns, function(fn) { fn.call(this); }, this);
    if (parent) parent.setupAfter.call(this);
  };
};

// Shared Unique ID generator for every describe block
angular.scenario.Describe.id = 0;

/**
 * Defines a block to execute before each it or nested describe.
 *
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.beforeEach = function(body) {
  this.beforeEachFns.push(body);
};

/**
 * Defines a block to execute after each it or nested describe.
 *
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.afterEach = function(body) {
  this.afterEachFns.push(body);
};

/**
 * Creates a new describe block that's a child of this one.
 *
 * @param {string} name Name of the block. Appended to the parent block's name.
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.describe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  this.children.push(child);
  body.call(child);
};

/**
 * Same as describe() but makes ddescribe blocks the only to run.
 *
 * @param {string} name Name of the test.
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.ddescribe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  child.only = true;
  this.children.push(child);
  body.call(child);
};

/**
 * Use to disable a describe block.
 */
angular.scenario.Describe.prototype.xdescribe = angular.noop;

/**
 * Defines a test.
 *
 * @param {string} name Name of the test.
 * @param {Function} vody Body of the block.
 */
angular.scenario.Describe.prototype.it = function(name, body) {
  this.its.push({
    definition: this,
    only: this.only,
    name: name,
    before: this.setupBefore,
    body: body,
    after: this.setupAfter
  });
};

/**
 * Same as it() but makes iit tests the only test to run.
 *
 * @param {string} name Name of the test.
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.iit = function(name, body) {
  this.it.apply(this, arguments);
  this.its[this.its.length-1].only = true;
};

/**
 * Use to disable a test block.
 */
angular.scenario.Describe.prototype.xit = angular.noop;

/**
 * Gets an array of functions representing all the tests (recursively).
 * that can be executed with SpecRunner's.
 *
 * @return {Array<Object>} Array of it blocks {
 *   definition : Object // parent Describe
 *   only: boolean
 *   name: string
 *   before: Function
 *   body: Function
 *   after: Function
 *  }
 */
angular.scenario.Describe.prototype.getSpecs = function() {
  var specs = arguments[0] || [];
  angular.foreach(this.children, function(child) {
    child.getSpecs(specs);
  });
  angular.foreach(this.its, function(it) {
    specs.push(it);
  });
  var only = [];
  angular.foreach(specs, function(it) {
    if (it.only) {
      only.push(it);
    }
  });
  return (only.length && only) || specs;
};
/**
 * A future action in a spec.
 *
 * @param {string} name of the future action
 * @param {Function} future callback(error, result)
 * @param {Function} Optional. function that returns the file/line number.
 */
angular.scenario.Future = function(name, behavior, line) {
  this.name = name;
  this.behavior = behavior;
  this.fulfilled = false;
  this.value = undefined;
  this.parser = angular.identity;
  this.line = line || function() { return ''; };
};

/**
 * Executes the behavior of the closure.
 *
 * @param {Function} doneFn Callback function(error, result)
 */
angular.scenario.Future.prototype.execute = function(doneFn) {
  var self = this;
  this.behavior(function(error, result) {
    self.fulfilled = true;
    if (result) {
      try {
        result = self.parser(result);
      } catch(e) {
        error = e;
      }
    }
    self.value = error || result;
    doneFn(error, result);
  });
};

/**
 * Configures the future to convert it's final with a function fn(value)
 *
 * @param {Function} fn function(value) that returns the parsed value
 */
angular.scenario.Future.prototype.parsedWith = function(fn) {
  this.parser = fn;
  return this;
};

/**
 * Configures the future to parse it's final value from JSON
 * into objects.
 */
angular.scenario.Future.prototype.fromJson = function() {
  return this.parsedWith(angular.fromJson);
};

/**
 * Configures the future to convert it's final value from objects
 * into JSON.
 */
angular.scenario.Future.prototype.toJson = function() {
  return this.parsedWith(angular.toJson);
};
/**
 * Maintains an object tree from the runner events.
 *
 * @param {Object} runner The scenario Runner instance to connect to.
 *
 * TODO(esprehn): Every output type creates one of these, but we probably
 *  want one glonal shared instance. Need to handle events better too
 *  so the HTML output doesn't need to do spec model.getSpec(spec.id)
 *  silliness.
 */
angular.scenario.ObjectModel = function(runner) {
  var self = this;

  this.specMap = {};
  this.value = {
    name: '',
    children: {}
  };

  runner.on('SpecBegin', function(spec) {
    var block = self.value;
    angular.foreach(self.getDefinitionPath(spec), function(def) {
      if (!block.children[def.name]) {
        block.children[def.name] = {
          id: def.id,
          name: def.name,
          children: {},
          specs: {}
        };
      }
      block = block.children[def.name];
    });
    self.specMap[spec.id] = block.specs[spec.name] =
      new angular.scenario.ObjectModel.Spec(spec.id, spec.name);
  });

  runner.on('SpecError', function(spec, error) {
    var it = self.getSpec(spec.id);
    it.status = 'error';
    it.error = error;
  });

  runner.on('SpecEnd', function(spec) {
    var it = self.getSpec(spec.id);
    complete(it);
  });

  runner.on('StepBegin', function(spec, step) {
    var it = self.getSpec(spec.id);
    it.steps.push(new angular.scenario.ObjectModel.Step(step.name));
  });

  runner.on('StepEnd', function(spec, step) {
    var it = self.getSpec(spec.id);
    if (it.getLastStep().name !== step.name)
      throw 'Events fired in the wrong order. Step names don\' match.';
    complete(it.getLastStep());
  });

  runner.on('StepFailure', function(spec, step, error) {
    var it = self.getSpec(spec.id);
    var item = it.getLastStep();
    item.error = error;
    if (!it.status) {
      it.status = item.status = 'failure';
    }
  });

  runner.on('StepError', function(spec, step, error) {
    var it = self.getSpec(spec.id);
    var item = it.getLastStep();
    it.status = 'error';
    item.status = 'error';
    item.error = error;
  });

  function complete(item) {
    item.endTime = new Date().getTime();
    item.duration = item.endTime - item.startTime;
    item.status = item.status || 'success';
  }
};

/**
 * Computes the path of definition describe blocks that wrap around
 * this spec.
 *
 * @param spec Spec to compute the path for.
 * @return {Array<Describe>} The describe block path
 */
angular.scenario.ObjectModel.prototype.getDefinitionPath = function(spec) {
  var path = [];
  var currentDefinition = spec.definition;
  while (currentDefinition && currentDefinition.name) {
    path.unshift(currentDefinition);
    currentDefinition = currentDefinition.parent;
  }
  return path;
};

/**
 * Gets a spec by id.
 *
 * @param {string} The id of the spec to get the object for.
 * @return {Object} the Spec instance
 */
angular.scenario.ObjectModel.prototype.getSpec = function(id) {
  return this.specMap[id];
};

/**
 * A single it block.
 *
 * @param {string} id Id of the spec
 * @param {string} name Name of the spec
 */
angular.scenario.ObjectModel.Spec = function(id, name) {
  this.id = id;
  this.name = name;
  this.startTime = new Date().getTime();
  this.steps = [];
};

/**
 * Adds a new step to the Spec.
 *
 * @param {string} step Name of the step (really name of the future)
 * @return {Object} the added step
 */
angular.scenario.ObjectModel.Spec.prototype.addStep = function(name) {
  var step = new angular.scenario.ObjectModel.Step(name);
  this.steps.push(step);
  return step;
};

/**
 * Gets the most recent step.
 *
 * @return {Object} the step
 */
angular.scenario.ObjectModel.Spec.prototype.getLastStep = function() {
  return this.steps[this.steps.length-1];
};

/**
 * A single step inside a Spec.
 *
 * @param {string} step Name of the step
 */
angular.scenario.ObjectModel.Step = function(name) {
  this.name = name;
  this.startTime = new Date().getTime();
};
/**
 * The representation of define blocks. Don't used directly, instead use
 * define() in your tests.
 *
 * @param {string} descName Name of the block
 * @param {Object} parent describe or undefined if the root.
 */
angular.scenario.Describe = function(descName, parent) {
  this.only = parent && parent.only;
  this.beforeEachFns = [];
  this.afterEachFns = [];
  this.its = [];
  this.children = [];
  this.name = descName;
  this.parent = parent;
  this.id = angular.scenario.Describe.id++;

  /**
   * Calls all before functions.
   */
  var beforeEachFns = this.beforeEachFns;
  this.setupBefore = function() {
    if (parent) parent.setupBefore.call(this);
    angular.foreach(beforeEachFns, function(fn) { fn.call(this); }, this);
  };

  /**
   * Calls all after functions.
   */
  var afterEachFns = this.afterEachFns;
  this.setupAfter  = function() {
    angular.foreach(afterEachFns, function(fn) { fn.call(this); }, this);
    if (parent) parent.setupAfter.call(this);
  };
};

// Shared Unique ID generator for every describe block
angular.scenario.Describe.id = 0;

/**
 * Defines a block to execute before each it or nested describe.
 *
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.beforeEach = function(body) {
  this.beforeEachFns.push(body);
};

/**
 * Defines a block to execute after each it or nested describe.
 *
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.afterEach = function(body) {
  this.afterEachFns.push(body);
};

/**
 * Creates a new describe block that's a child of this one.
 *
 * @param {string} name Name of the block. Appended to the parent block's name.
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.describe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  this.children.push(child);
  body.call(child);
};

/**
 * Same as describe() but makes ddescribe blocks the only to run.
 *
 * @param {string} name Name of the test.
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.ddescribe = function(name, body) {
  var child = new angular.scenario.Describe(name, this);
  child.only = true;
  this.children.push(child);
  body.call(child);
};

/**
 * Use to disable a describe block.
 */
angular.scenario.Describe.prototype.xdescribe = angular.noop;

/**
 * Defines a test.
 *
 * @param {string} name Name of the test.
 * @param {Function} vody Body of the block.
 */
angular.scenario.Describe.prototype.it = function(name, body) {
  this.its.push({
    definition: this,
    only: this.only,
    name: name,
    before: this.setupBefore,
    body: body,
    after: this.setupAfter
  });
};

/**
 * Same as it() but makes iit tests the only test to run.
 *
 * @param {string} name Name of the test.
 * @param {Function} body Body of the block.
 */
angular.scenario.Describe.prototype.iit = function(name, body) {
  this.it.apply(this, arguments);
  this.its[this.its.length-1].only = true;
};

/**
 * Use to disable a test block.
 */
angular.scenario.Describe.prototype.xit = angular.noop;

/**
 * Gets an array of functions representing all the tests (recursively).
 * that can be executed with SpecRunner's.
 *
 * @return {Array<Object>} Array of it blocks {
 *   definition : Object // parent Describe
 *   only: boolean
 *   name: string
 *   before: Function
 *   body: Function
 *   after: Function
 *  }
 */
angular.scenario.Describe.prototype.getSpecs = function() {
  var specs = arguments[0] || [];
  angular.foreach(this.children, function(child) {
    child.getSpecs(specs);
  });
  angular.foreach(this.its, function(it) {
    specs.push(it);
  });
  var only = [];
  angular.foreach(specs, function(it) {
    if (it.only) {
      only.push(it);
    }
  });
  return (only.length && only) || specs;
};
/**
 * Runner for scenarios.
 */
angular.scenario.Runner = function($window) {
  this.listeners = [];
  this.$window = $window;
  this.rootDescribe = new angular.scenario.Describe();
  this.currentDescribe = this.rootDescribe;
  this.api = {
    it: this.it,
    iit: this.iit,
    xit: angular.noop,
    describe: this.describe,
    ddescribe: this.ddescribe,
    xdescribe: angular.noop,
    beforeEach: this.beforeEach,
    afterEach: this.afterEach
  };
  angular.foreach(this.api, angular.bind(this, function(fn, key) {
    this.$window[key] = angular.bind(this, fn);
  }));
};

/**
 * Emits an event which notifies listeners and passes extra
 * arguments.
 *
 * @param {string} eventName Name of the event to fire.
 */
angular.scenario.Runner.prototype.emit = function(eventName) {
  var self = this;
  var args = Array.prototype.slice.call(arguments, 1);
  eventName = eventName.toLowerCase();
  if (!this.listeners[eventName])
    return;
  angular.foreach(this.listeners[eventName], function(listener) {
    listener.apply(self, args);
  });
};

/**
 * Adds a listener for an event.
 *
 * @param {string} eventName The name of the event to add a handler for
 * @param {string} listener The fn(...) that takes the extra arguments from emit()
 */
angular.scenario.Runner.prototype.on = function(eventName, listener) {
  eventName = eventName.toLowerCase();
  this.listeners[eventName] = this.listeners[eventName] || [];
  this.listeners[eventName].push(listener);
};

/**
 * Defines a describe block of a spec.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {Function} body Body of the block
 */
angular.scenario.Runner.prototype.describe = function(name, body) {
  var self = this;
  this.currentDescribe.describe(name, function() {
    var parentDescribe = self.currentDescribe;
    self.currentDescribe = this;
    try {
      body.call(this);
    } finally {
      self.currentDescribe = parentDescribe;
    }
  });
};

/**
 * Same as describe, but makes ddescribe the only blocks to run.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {Function} body Body of the block
 */
angular.scenario.Runner.prototype.ddescribe = function(name, body) {
  var self = this;
  this.currentDescribe.ddescribe(name, function() {
    var parentDescribe = self.currentDescribe;
    self.currentDescribe = this;
    try {
      body.call(this);
    } finally {
      self.currentDescribe = parentDescribe;
    }
  });
};

/**
 * Defines a test in a describe block of a spec.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {Function} body Body of the block
 */
angular.scenario.Runner.prototype.it = function(name, body) {
  this.currentDescribe.it(name, body);
};

/**
 * Same as it, but makes iit tests the only tests to run.
 *
 * @see Describe.js
 *
 * @param {string} name Name of the block
 * @param {Function} body Body of the block
 */
angular.scenario.Runner.prototype.iit = function(name, body) {
  this.currentDescribe.iit(name, body);
};

/**
 * Defines a function to be called before each it block in the describe
 * (and before all nested describes).
 *
 * @see Describe.js
 *
 * @param {Function} Callback to execute
 */
angular.scenario.Runner.prototype.beforeEach = function(body) {
  this.currentDescribe.beforeEach(body);
};

/**
 * Defines a function to be called after each it block in the describe
 * (and before all nested describes).
 *
 * @see Describe.js
 *
 * @param {Function} Callback to execute
 */
angular.scenario.Runner.prototype.afterEach = function(body) {
  this.currentDescribe.afterEach(body);
};

/**
 * Creates a new spec runner.
 *
 * @private
 * @param {Object} scope parent scope
 */
angular.scenario.Runner.prototype.createSpecRunner_ = function(scope) {
  return scope.$new(angular.scenario.SpecRunner);
};

/**
 * Runs all the loaded tests with the specified runner class on the
 * provided application.
 *
 * @param {angular.scenario.Application} application App to remote control.
 */
angular.scenario.Runner.prototype.run = function(application) {
  var self = this;
  var $root = angular.scope(this);
  $root.application = application;
  this.emit('RunnerBegin');
  asyncForEach(this.rootDescribe.getSpecs(), function(spec, specDone) {
    var dslCache = {};
    var runner = self.createSpecRunner_($root);
    angular.foreach(angular.scenario.dsl, function(fn, key) {
      dslCache[key] = fn.call($root);
    });
    angular.foreach(angular.scenario.dsl, function(fn, key) {
      self.$window[key] = function() {
        var line = callerFile(3);
        var scope = angular.scope(runner);

        // Make the dsl accessible on the current chain
        scope.dsl = {};
        angular.foreach(dslCache, function(fn, key) {
          scope.dsl[key] = function() {
            return dslCache[key].apply(scope, arguments);
          };
        });

        // Make these methods work on the current chain
        scope.addFuture = function() {
          Array.prototype.push.call(arguments, line);
          return angular.scenario.SpecRunner.
            prototype.addFuture.apply(scope, arguments);
        };
        scope.addFutureAction = function() {
          Array.prototype.push.call(arguments, line);
          return angular.scenario.SpecRunner.
            prototype.addFutureAction.apply(scope, arguments);
        };

        return scope.dsl[key].apply(scope, arguments);
      };
    });
    runner.run(spec, specDone);
  },
  function(error) {
    if (error) {
      self.emit('RunnerError', error);
    }
    self.emit('RunnerEnd');
  });
};
/**
 * This class is the "this" of the it/beforeEach/afterEach method.
 * Responsibilities:
 *   - "this" for it/beforeEach/afterEach
 *   - keep state for single it/beforeEach/afterEach execution
 *   - keep track of all of the futures to execute
 *   - run single spec (execute each future)
 */
angular.scenario.SpecRunner = function() {
  this.futures = [];
  this.afterIndex = 0;
};

/**
 * Executes a spec which is an it block with associated before/after functions
 * based on the describe nesting.
 *
 * @param {Object} spec A spec object
 * @param {Object} specDone An angular.scenario.Application instance
 * @param {Function} Callback function that is called when the  spec finshes.
 */
angular.scenario.SpecRunner.prototype.run = function(spec, specDone) {
  var self = this;
  this.spec = spec;

  this.emit('SpecBegin', spec);

  try {
    spec.before.call(this);
    spec.body.call(this);
    this.afterIndex = this.futures.length;
    spec.after.call(this);
  } catch (e) {
    this.emit('SpecError', spec, e);
    this.emit('SpecEnd', spec);
    specDone();
    return;
  }

  var handleError = function(error, done) {
    if (self.error) {
      return done();
    }
    self.error = true;
    done(null, self.afterIndex);
  };

  asyncForEach(
    this.futures,
    function(future, futureDone) {
      self.step = future;
      self.emit('StepBegin', spec, future);
      try {
        future.execute(function(error) {
          if (error) {
            self.emit('StepFailure', spec, future, error);
            self.emit('StepEnd', spec, future);
            return handleError(error, futureDone);
          }
          self.emit('StepEnd', spec, future);
          self.$window.setTimeout(function() { futureDone(); }, 0);
        });
      } catch (e) {
        self.emit('StepError', spec, future, e);
        self.emit('StepEnd', spec, future);
        handleError(e, futureDone);
      }
    },
    function(e) {
      if (e) {
        self.emit('SpecError', spec, e);
      }
      self.emit('SpecEnd', spec);
      // Call done in a timeout so exceptions don't recursively
      // call this function
      self.$window.setTimeout(function() { specDone(); }, 0);
    }
  );
};

/**
 * Adds a new future action.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {string} name Name of the future
 * @param {Function} behavior Behavior of the future
 * @param {Function} line fn() that returns file/line number
 */
angular.scenario.SpecRunner.prototype.addFuture = function(name, behavior, line) {
  var future = new angular.scenario.Future(name, angular.bind(this, behavior), line);
  this.futures.push(future);
  return future;
};

/**
 * Adds a new future action to be executed on the application window.
 *
 * Note: Do not pass line manually. It happens automatically.
 *
 * @param {string} name Name of the future
 * @param {Function} behavior Behavior of the future
 * @param {Function} line fn() that returns file/line number
 */
angular.scenario.SpecRunner.prototype.addFutureAction = function(name, behavior, line) {
  var self = this;
  return this.addFuture(name, function(done) {
    this.application.executeAction(function($window, $document) {

      //TODO(esprehn): Refactor this so it doesn't need to be in here.
      $document.elements = function(selector) {
        var args = Array.prototype.slice.call(arguments, 1);
        selector = (self.selector || '') + ' ' + (selector || '');
        selector = _jQuery.trim(selector) || '*';
        angular.foreach(args, function(value, index) {
          selector = selector.replace('$' + (index + 1), value);
        });
        var result = $document.find(selector);
        if (!result.length) {
          throw {
            type: 'selector',
            message: 'Selector ' + selector + ' did not match any elements.'
          };
        }

        return result;
      };

      try {
        behavior.call(self, $window, $document, done);
      } catch(e) {
        if (e.type && e.type === 'selector') {
          done(e.message);
        } else {
          throw e;
        }
      }
    });
  }, line);
};
/**
 * Shared DSL statements that are useful to all scenarios.
 */

 /**
 * Usage:
 *    wait() waits until you call resume() in the console
 */
angular.scenario.dsl('wait', function() {
  return function() {
    return this.addFuture('waiting for you to resume', function(done) {
      this.emit('InteractiveWait', this.spec, this.step);
      this.$window.resume = function() { done(); };
    });
  };
});

/**
 * Usage:
 *    pause(seconds) pauses the test for specified number of seconds
 */
angular.scenario.dsl('pause', function() {
  return function(time) {
    return this.addFuture('pause for ' + time + ' seconds', function(done) {
      this.$window.setTimeout(function() { done(null, time * 1000); }, time * 1000);
    });
  };
});

/**
 * Usage:
 *    browser().navigateTo(url) Loads the url into the frame
 *    browser().navigateTo(url, fn) where fn(url) is called and returns the URL to navigate to
 *    browser().reload() refresh the page (reload the same URL)
 *    browser().location().href() the full URL of the page
 *    browser().location().hash() the full hash in the url
 *    browser().location().path() the full path in the url
 *    browser().location().hashSearch() the hashSearch Object from angular
 *    browser().location().hashPath() the hashPath string from angular
 */
angular.scenario.dsl('browser', function() {
  var chain = {};

  chain.navigateTo = function(url, delegate) {
    var application = this.application;
    return this.addFuture("browser navigate to '" + url + "'", function(done) {
      if (delegate) {
        url = delegate.call(this, url);
      }
      application.navigateTo(url, function() {
        done(null, url);
      }, done);
    });
  };

  chain.reload = function() {
    var application = this.application;
    return this.addFutureAction('browser reload', function($window, $document, done) {
      var href = $window.location.href;
      application.navigateTo(href, function() {
        done(null, href);
      }, done);
    });
  };

  chain.location = function() {
    var api = {};

    api.href = function() {
      return this.addFutureAction('browser url', function($window, $document, done) {
        done(null, $window.location.href);
      });
    };

    api.hash = function() {
      return this.addFutureAction('browser url hash', function($window, $document, done) {
        done(null, $window.location.hash.replace('#', ''));
      });
    };

    api.path = function() {
      return this.addFutureAction('browser url path', function($window, $document, done) {
        done(null, $window.location.pathname);
      });
    };

    api.search = function() {
      return this.addFutureAction('browser url search', function($window, $document, done) {
        done(null, $window.angular.scope().$location.search);
      });
    };

    api.hashSearch = function() {
      return this.addFutureAction('browser url hash search', function($window, $document, done) {
        done(null, $window.angular.scope().$location.hashSearch);
      });
    };

    api.hashPath = function() {
      return this.addFutureAction('browser url hash path', function($window, $document, done) {
        done(null, $window.angular.scope().$location.hashPath);
      });
    };

    return api;
  };

  return function(time) {
    return chain;
  };
});

/**
 * Usage:
 *    expect(future).{matcher} where matcher is one of the matchers defined
 *    with angular.scenario.matcher
 *
 * ex. expect(binding("name")).toEqual("Elliott")
 */
angular.scenario.dsl('expect', function() {
  var chain = angular.extend({}, angular.scenario.matcher);

  chain.not = function() {
    this.inverse = true;
    return chain;
  };

  return function(future) {
    this.future = future;
    return chain;
  };
});

/**
 * Usage:
 *    using(selector, label) scopes the next DSL element selection
 *
 * ex.
 *   using('#foo', "'Foo' text field").input('bar')
 */
angular.scenario.dsl('using', function() {
  return function(selector, label) {
    this.selector = _jQuery.trim((this.selector||'') + ' ' + selector);
    if (angular.isString(label) && label.length) {
      this.label = label + ' ( ' + this.selector + ' )';
    } else {
      this.label = this.selector;
    }
    return this.dsl;
  };
});

/**
 * Usage:
 *    binding(name) returns the value of the first matching binding
 */
angular.scenario.dsl('binding', function() {
  return function(name) {
    return this.addFutureAction("select binding '" + name + "'", function($window, $document, done) {
      var values = $document.elements().bindings(name);
      if (!values.length) {
        return done("Binding selector '" + name + "' did not match.");
      }
      done(null, values[0]);
    });
  };
});

/**
 * Usage:
 *    input(name).enter(value) enters value in input with specified name
 *    input(name).check() checks checkbox
 *    input(name).select(value) selects the readio button with specified name/value
 */
angular.scenario.dsl('input', function() {
  var chain = {};

  chain.enter = function(value) {
    return this.addFutureAction("input '" + this.name + "' enter '" + value + "'", function($window, $document, done) {
      var input = $document.elements(':input[name="$1"]', this.name);
      input.val(value);
      input.trigger('change');
      done();
    });
  };

  chain.check = function() {
    return this.addFutureAction("checkbox '" + this.name + "' toggle", function($window, $document, done) {
      var input = $document.elements(':checkbox[name="$1"]', this.name);
      input.trigger('click');
      done();
    });
  };

  chain.select = function(value) {
    return this.addFutureAction("radio button '" + this.name + "' toggle '" + value + "'", function($window, $document, done) {
      var input = $document.
        elements(':radio[name$="@$1"][value="$2"]', this.name, value);
      input.trigger('click');
      done();
    });
  };

  return function(name) {
    this.name = name;
    return chain;
  };
});


/**
 * Usage:
 *    repeater('#products table', 'Product List').count() number of rows
 *    repeater('#products table', 'Product List').row(1) all bindings in row as an array
 *    repeater('#products table', 'Product List').column('product.name') all values across all rows in an array
 */
angular.scenario.dsl('repeater', function() {
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("repeater '" + this.label + "' count", function($window, $document, done) {
      try {
        done(null, $document.elements().length);
      } catch (e) {
        done(null, 0);
      }
    });
  };

  chain.column = function(binding) {
    return this.addFutureAction("repeater '" + this.label + "' column '" + binding + "'", function($window, $document, done) {
      done(null, $document.elements().bindings(binding));
    });
  };

  chain.row = function(index) {
    return this.addFutureAction("repeater '" + this.label + "' row '" + index + "'", function($window, $document, done) {
      var values = [];
      var matches = $document.elements().slice(index, index + 1);
      if (!matches.length)
        return done('row ' + index + ' out of bounds');
      done(null, matches.bindings());
    });
  };

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});

/**
 * Usage:
 *    select(name).option('value') select one option
 *    select(name).options('value1', 'value2', ...) select options from a multi select
 */
angular.scenario.dsl('select', function() {
  var chain = {};

  chain.option = function(value) {
    return this.addFutureAction("select '" + this.name + "' option '" + value + "'", function($window, $document, done) {
      var select = $document.elements('select[name="$1"]', this.name);
      select.val(value);
      select.trigger('change');
      done();
    });
  };

  chain.options = function() {
    var values = arguments;
    return this.addFutureAction("select '" + this.name + "' options '" + values + "'", function($window, $document, done) {
      var select = $document.elements('select[multiple][name="$1"]', this.name);
      select.val(values);
      select.trigger('change');
      done();
    });
  };

  return function(name) {
    this.name = name;
    return chain;
  };
});

/**
 * Usage:
 *    element(selector, label).count() get the number of elements that match selector
 *    element(selector, label).click() clicks an element
 *    element(selector, label).query(fn) executes fn(selectedElements, done)
 *    element(selector, label).{method}() gets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(value) sets the value (as defined by jQuery, ex. val)
 *    element(selector, label).{method}(key) gets the value (as defined by jQuery, ex. attr)
 *    element(selector, label).{method}(key, value) sets the value (as defined by jQuery, ex. attr)
 */
angular.scenario.dsl('element', function() {
  var KEY_VALUE_METHODS = ['attr', 'css'];
  var VALUE_METHODS = [
    'val', 'text', 'html', 'height', 'innerHeight', 'outerHeight', 'width',
    'innerWidth', 'outerWidth', 'position', 'scrollLeft', 'scrollTop', 'offset'
  ];
  var chain = {};

  chain.count = function() {
    return this.addFutureAction("element '" + this.label + "' count", function($window, $document, done) {
      try {
        done(null, $document.elements().length);
      } catch (e) {
        done(null, 0);
      }
    });
  };

  chain.click = function() {
    return this.addFutureAction("element '" + this.label + "' click", function($window, $document, done) {
      var elements = $document.elements();
      var href = elements.attr('href');
      elements.trigger('click');
      if (href && elements[0].nodeName.toUpperCase() === 'A') {
        this.application.navigateTo(href, function() {
          done();
        }, done);
      } else {
        done();
      }
    });
  };

  chain.query = function(fn) {
    return this.addFutureAction('element ' + this.label + ' custom query', function($window, $document, done) {
      fn.call(this, $document.elements(), done);
    });
  };

  angular.foreach(KEY_VALUE_METHODS, function(methodName) {
    chain[methodName] = function(name, value) {
      var futureName = "element '" + this.label + "' get " + methodName + " '" + name + "'";
      if (angular.isDefined(value)) {
        futureName = "element '" + this.label + "' set " + methodName + " '" + name + "' to " + "'" + value + "'";
      }
      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].call(element, name, value));
      });
    };
  });

  angular.foreach(VALUE_METHODS, function(methodName) {
    chain[methodName] = function(value) {
      var futureName = "element '" + this.label + "' " + methodName;
      if (angular.isDefined(value)) {
        futureName = "element '" + this.label + "' set " + methodName + " to '" + value + "'";
      }
      return this.addFutureAction(futureName, function($window, $document, done) {
        var element = $document.elements();
        done(null, element[methodName].call(element, value));
      });
    };
  });

  return function(selector, label) {
    this.dsl.using(selector, label);
    return chain;
  };
});
/**
 * Matchers for implementing specs. Follows the Jasmine spec conventions.
 */

angular.scenario.matcher('toEqual', function(expected) {
  return angular.equals(this.actual, expected);
});

angular.scenario.matcher('toBe', function(expected) {
  return this.actual === expected;
});

angular.scenario.matcher('toBeDefined', function() {
  return angular.isDefined(this.actual);
});

angular.scenario.matcher('toBeTruthy', function() {
  return this.actual;
});

angular.scenario.matcher('toBeFalsy', function() {
  return !this.actual;
});

angular.scenario.matcher('toMatch', function(expected) {
  return new RegExp(expected).test(this.actual);
});

angular.scenario.matcher('toBeNull', function() {
  return this.actual === null;
});

angular.scenario.matcher('toContain', function(expected) {
  return includes(this.actual, expected);
});

angular.scenario.matcher('toBeLessThan', function(expected) {
  return this.actual < expected;
});

angular.scenario.matcher('toBeGreaterThan', function(expected) {
  return this.actual > expected;
});
/**
 * User Interface for the Scenario Runner.
 *
 * TODO(esprehn): This should be refactored now that ObjectModel exists
 *  to use angular bindings for the UI.
 */
angular.scenario.output('html', function(context, runner) {
  var model = new angular.scenario.ObjectModel(runner);

  context.append(
    '<div id="header">' +
    '  <h1><span class="angular">&lt;angular/&gt;</span>: Scenario Test Runner</h1>' +
    '  <ul id="status-legend" class="status-display">' +
    '    <li class="status-error">0 Errors</li>' +
    '    <li class="status-failure">0 Failures</li>' +
    '    <li class="status-success">0 Passed</li>' +
    '  </ul>' +
    '</div>' +
    '<div id="specs">' +
    '  <div class="test-children"></div>' +
    '</div>'
  );

  runner.on('InteractiveWait', function(spec, step) {
    var ui = model.getSpec(spec.id).getLastStep().ui;
    ui.find('.test-title').
      html('waiting for you to <a href="javascript:resume()">resume</a>.');
  });

  runner.on('SpecBegin', function(spec) {
    var ui = findContext(spec);
    ui.find('> .tests').append(
      '<li class="status-pending test-it"></li>'
    );
    ui = ui.find('> .tests li:last');
    ui.append(
      '<div class="test-info">' +
      '  <p class="test-title">' +
      '    <span class="timer-result"></span>' +
      '    <span class="test-name"></span>' +
      '  </p>' +
      '</div>' +
      '<div class="scrollpane">' +
      '  <ol class="test-actions"></ol>' +
      '</div>'
    );
    ui.find('> .test-info .test-name').text(spec.name);
    ui.find('> .test-info').click(function() {
      var scrollpane = ui.find('> .scrollpane');
      var actions = scrollpane.find('> .test-actions');
      var name = context.find('> .test-info .test-name');
      if (actions.find(':visible').length) {
        actions.hide();
        name.removeClass('open').addClass('closed');
      } else {
        actions.show();
        scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
        name.removeClass('closed').addClass('open');
      }
    });
    model.getSpec(spec.id).ui = ui;
  });

  runner.on('SpecError', function(spec, error) {
    var ui = model.getSpec(spec.id).ui;
    ui.append('<pre></pre>');
    ui.find('> pre').text(formatException(error));
  });

  runner.on('SpecEnd', function(spec) {
    spec = model.getSpec(spec.id);
    spec.ui.removeClass('status-pending');
    spec.ui.addClass('status-' + spec.status);
    spec.ui.find("> .test-info .timer-result").text(spec.duration + "ms");
    if (spec.status === 'success') {
      spec.ui.find('> .test-info .test-name').addClass('closed');
      spec.ui.find('> .scrollpane .test-actions').hide();
    }
    updateTotals(spec.status);
  });

  runner.on('StepBegin', function(spec, step) {
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    spec.ui.find('> .scrollpane .test-actions').
      append('<li class="status-pending"></li>');
    step.ui = spec.ui.find('> .scrollpane .test-actions li:last');
    step.ui.append(
      '<div class="timer-result"></div>' +
      '<div class="test-title"></div>'
    );
    step.ui.find('> .test-title').text(step.name);
    var scrollpane = step.ui.parents('.scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  runner.on('StepFailure', function(spec, step, error) {
    var ui = model.getSpec(spec.id).getLastStep().ui;
    addError(ui, step.line, error);
  });

  runner.on('StepError', function(spec, step, error) {
    var ui = model.getSpec(spec.id).getLastStep().ui;
    addError(ui, step.line, error);
  });

  runner.on('StepEnd', function(spec, step) {
    spec = model.getSpec(spec.id);
    step = spec.getLastStep();
    step.ui.find('.timer-result').text(step.duration + 'ms');
    step.ui.removeClass('status-pending');
    step.ui.addClass('status-' + step.status);
    var scrollpane = spec.ui.find('> .scrollpane');
    scrollpane.attr('scrollTop', scrollpane.attr('scrollHeight'));
  });

  /**
   * Finds the context of a spec block defined by the passed definition.
   *
   * @param {Object} The definition created by the Describe object.
   */
  function findContext(spec) {
    var currentContext = context.find('#specs');
    angular.foreach(model.getDefinitionPath(spec), function(defn) {
      var id = 'describe-' + defn.id;
      if (!context.find('#' + id).length) {
        currentContext.find('> .test-children').append(
          '<div class="test-describe" id="' + id + '">' +
          '  <h2></h2>' +
          '  <div class="test-children"></div>' +
          '  <ul class="tests"></ul>' +
          '</div>'
        );
        context.find('#' + id).find('> h2').text('describe: ' + defn.name);
      }
      currentContext = context.find('#' + id);
    });
    return context.find('#describe-' + spec.definition.id);
  };

  /**
   * Updates the test counter for the status.
   *
   * @param {string} the status.
   */
  function updateTotals(status) {
    var legend = context.find('#status-legend .status-' + status);
    var parts = legend.text().split(' ');
    var value = (parts[0] * 1) + 1;
    legend.text(value + ' ' + parts[1]);
  }

  /**
   * Add an error to a step.
   *
   * @param {Object} The JQuery wrapped context
   * @param {Function} fn() that should return the file/line number of the error
   * @param {Object} the error.
   */
  function addError(context, line, error) {
    context.find('.test-title').append('<pre></pre>');
    var message = _jQuery.trim(line() + '\n\n' + formatException(error));
    context.find('.test-title pre:last').text(message);
  };
});
/**
 * Generates JSON output into a context.
 */
angular.scenario.output('json', function(context, runner) {
  var model = new angular.scenario.ObjectModel(runner);
  
  runner.on('RunnerEnd', function() {
    context.text(angular.toJson(model.value));
  });
});
/**
 * Generates XML output into a context.
 */
angular.scenario.output('xml', function(context, runner) {
  var model = new angular.scenario.ObjectModel(runner);
  var $ = function(args) {return new context.init(args);};
  runner.on('RunnerEnd', function() {
    var scenario = $('<scenario></scenario>');
    context.append(scenario);
    serializeXml(scenario, model.value);
  });

  /**
   * Convert the tree into XML.
   *
   * @param {Object} context jQuery context to add the XML to.
   * @param {Object} tree node to serialize
   */
  function serializeXml(context, tree) {
     angular.foreach(tree.children, function(child) {
       var describeContext = $('<describe></describe>');
       describeContext.attr('id', child.id);
       describeContext.attr('name', child.name);
       context.append(describeContext);
       serializeXml(describeContext, child);
     });
     var its = $('<its></its>');
     context.append(its);
     angular.foreach(tree.specs, function(spec) {
       var it = $('<it></it>');
       it.attr('id', spec.id);
       it.attr('name', spec.name);
       it.attr('duration', spec.duration);
       it.attr('status', spec.status);
       its.append(it);
       angular.foreach(spec.steps, function(step) {
         var stepContext = $('<step></step>');
         stepContext.attr('name', step.name);
         stepContext.attr('duration', step.duration);
         stepContext.attr('status', step.status);
         it.append(stepContext);
         if (step.error) {
           var error = $('<error></error');
           stepContext.append(error);
           error.text(formatException(stepContext.error));
         }
       });
     });
   }
});
/**
 * Creates a global value $result with the result of the runner.
 */
angular.scenario.output('object', function(context, runner) {
  runner.$window.$result = new angular.scenario.ObjectModel(runner).value;
});
  var $scenario = new angular.scenario.Runner(window);

  window.onload = function() {
    try {
      if (previousOnLoad) previousOnLoad();
    } catch(e) {}
    angularScenarioInit($scenario, angularJsConfig(document));
  };

})(window, document, window.onload);
document.write('<style type="text/css">@charset "UTF-8";\n\n.ng-format-negative {\n  color: red;\n}\n\n.ng-exception {\n  border: 2px solid #FF0000;\n  font-family: "Courier New", Courier, monospace;\n  font-size: smaller;\n  white-space: pre;\n}\n\n.ng-validation-error {\n  border: 2px solid #FF0000;\n}\n\n\n/*****************\n * TIP\n *****************/\n#ng-callout {\n  margin: 0;\n  padding: 0;\n  border: 0;\n  outline: 0;\n  font-size: 13px;\n  font-weight: normal;\n  font-family: Verdana, Arial, Helvetica, sans-serif;\n  vertical-align: baseline;\n  background: transparent;\n  text-decoration: none;\n}\n\n#ng-callout .ng-arrow-left{\n  background-image: url("data:image/gif;base64,R0lGODlhCwAXAKIAAMzMzO/v7/f39////////wAAAAAAAAAAACH5BAUUAAQALAAAAAALABcAAAMrSLoc/AG8FeUUIN+sGebWAnbKSJodqqlsOxJtqYooU9vvk+vcJIcTkg+QAAA7");\n  background-repeat: no-repeat;\n  background-position: left top;\n  position: absolute;\n  z-index:101;\n  left:-12px;\n  height:23px;\n  width:10px;\n  top:-3px;\n}\n\n#ng-callout .ng-arrow-right{\n  background-image: url("data:image/gif;base64,R0lGODlhCwAXAKIAAMzMzO/v7/f39////////wAAAAAAAAAAACH5BAUUAAQALAAAAAALABcAAAMrCLTcoM29yN6k9socs91e5X3EyJloipYrO4ohTMqA0Fn2XVNswJe+H+SXAAA7");\n  background-repeat: no-repeat;\n  background-position: left top;\n  position: absolute;\n  z-index:101;\n  height:23px;\n  width:11px;\n    top:-2px;\n}\n\n#ng-callout {\n  position: absolute;\n  z-index:100;\n  border: 2px solid #CCCCCC;\n  background-color: #fff;\n}\n\n#ng-callout .ng-content{\n  padding:10px 10px 10px 10px;\n  color:#333333;\n}\n\n#ng-callout .ng-title{\n  background-color: #CCCCCC;\n  text-align: left;\n  padding-left: 8px;\n  padding-bottom: 5px;\n  padding-top: 2px;\n  font-weight:bold;\n}\n\n\n/*****************\n * indicators\n *****************/\n.ng-input-indicator-wait {\n  background-image: url("data:image/png;base64,R0lGODlhEAAQAPQAAP///wAAAPDw8IqKiuDg4EZGRnp6egAAAFhYWCQkJKysrL6+vhQUFJycnAQEBDY2NmhoaAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFdyAgAgIJIeWoAkRCCMdBkKtIHIngyMKsErPBYbADpkSCwhDmQCBethRB6Vj4kFCkQPG4IlWDgrNRIwnO4UKBXDufzQvDMaoSDBgFb886MiQadgNABAokfCwzBA8LCg0Egl8jAggGAA1kBIA1BAYzlyILczULC2UhACH5BAkKAAAALAAAAAAQABAAAAV2ICACAmlAZTmOREEIyUEQjLKKxPHADhEvqxlgcGgkGI1DYSVAIAWMx+lwSKkICJ0QsHi9RgKBwnVTiRQQgwF4I4UFDQQEwi6/3YSGWRRmjhEETAJfIgMFCnAKM0KDV4EEEAQLiF18TAYNXDaSe3x6mjidN1s3IQAh+QQJCgAAACwAAAAAEAAQAAAFeCAgAgLZDGU5jgRECEUiCI+yioSDwDJyLKsXoHFQxBSHAoAAFBhqtMJg8DgQBgfrEsJAEAg4YhZIEiwgKtHiMBgtpg3wbUZXGO7kOb1MUKRFMysCChAoggJCIg0GC2aNe4gqQldfL4l/Ag1AXySJgn5LcoE3QXI3IQAh+QQJCgAAACwAAAAAEAAQAAAFdiAgAgLZNGU5joQhCEjxIssqEo8bC9BRjy9Ag7GILQ4QEoE0gBAEBcOpcBA0DoxSK/e8LRIHn+i1cK0IyKdg0VAoljYIg+GgnRrwVS/8IAkICyosBIQpBAMoKy9dImxPhS+GKkFrkX+TigtLlIyKXUF+NjagNiEAIfkECQoAAAAsAAAAABAAEAAABWwgIAICaRhlOY4EIgjH8R7LKhKHGwsMvb4AAy3WODBIBBKCsYA9TjuhDNDKEVSERezQEL0WrhXucRUQGuik7bFlngzqVW9LMl9XWvLdjFaJtDFqZ1cEZUB0dUgvL3dgP4WJZn4jkomWNpSTIyEAIfkECQoAAAAsAAAAABAAEAAABX4gIAICuSxlOY6CIgiD8RrEKgqGOwxwUrMlAoSwIzAGpJpgoSDAGifDY5kopBYDlEpAQBwevxfBtRIUGi8xwWkDNBCIwmC9Vq0aiQQDQuK+VgQPDXV9hCJjBwcFYU5pLwwHXQcMKSmNLQcIAExlbH8JBwttaX0ABAcNbWVbKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICSRBlOY7CIghN8zbEKsKoIjdFzZaEgUBHKChMJtRwcWpAWoWnifm6ESAMhO8lQK0EEAV3rFopIBCEcGwDKAqPh4HUrY4ICHH1dSoTFgcHUiZjBhAJB2AHDykpKAwHAwdzf19KkASIPl9cDgcnDkdtNwiMJCshACH5BAkKAAAALAAAAAAQABAAAAV3ICACAkkQZTmOAiosiyAoxCq+KPxCNVsSMRgBsiClWrLTSWFoIQZHl6pleBh6suxKMIhlvzbAwkBWfFWrBQTxNLq2RG2yhSUkDs2b63AYDAoJXAcFRwADeAkJDX0AQCsEfAQMDAIPBz0rCgcxky0JRWE1AmwpKyEAIfkECQoAAAAsAAAAABAAEAAABXkgIAICKZzkqJ4nQZxLqZKv4NqNLKK2/Q4Ek4lFXChsg5ypJjs1II3gEDUSRInEGYAw6B6zM4JhrDAtEosVkLUtHA7RHaHAGJQEjsODcEg0FBAFVgkQJQ1pAwcDDw8KcFtSInwJAowCCA6RIwqZAgkPNgVpWndjdyohACH5BAkKAAAALAAAAAAQABAAAAV5ICACAimc5KieLEuUKvm2xAKLqDCfC2GaO9eL0LABWTiBYmA06W6kHgvCqEJiAIJiu3gcvgUsscHUERm+kaCxyxa+zRPk0SgJEgfIvbAdIAQLCAYlCj4DBw0IBQsMCjIqBAcPAooCBg9pKgsJLwUFOhCZKyQDA3YqIQAh+QQJCgAAACwAAAAAEAAQAAAFdSAgAgIpnOSonmxbqiThCrJKEHFbo8JxDDOZYFFb+A41E4H4OhkOipXwBElYITDAckFEOBgMQ3arkMkUBdxIUGZpEb7kaQBRlASPg0FQQHAbEEMGDSVEAA1QBhAED1E0NgwFAooCDWljaQIQCE5qMHcNhCkjIQAh+QQJCgAAACwAAAAAEAAQAAAFeSAgAgIpnOSoLgxxvqgKLEcCC65KEAByKK8cSpA4DAiHQ/DkKhGKh4ZCtCyZGo6F6iYYPAqFgYy02xkSaLEMV34tELyRYNEsCQyHlvWkGCzsPgMCEAY7Cg04Uk48LAsDhRA8MVQPEF0GAgqYYwSRlycNcWskCkApIyEAOwAAAAAAAAAAAA==");\n  background-position: right;\n  background-repeat: no-repeat;\n}\n</style>');
document.write('<style type="text/css">@charset "UTF-8";\n/* CSS Document */\n\n/** Structure */\nbody {\n  font-family: Arial, sans-serif;\n  margin: 0;\n  font-size: 14px;\n}\n\n#system-error {\n  font-size: 1.5em;\n  text-align: center;\n}\n\n#json, #xml {\n  display: none;\n}\n\n#header {\n  position: fixed;\n  width: 100%;\n}\n\n#specs {\n  padding-top: 50px;\n}\n\n#header .angular {\n  font-family: Courier New, monospace;\n  font-weight: bold;\n}\n\n#header h1 {\n  font-weight: normal;\n  float: left;\n  font-size: 30px;\n  line-height: 30px;\n  margin: 0;\n  padding: 10px 10px;\n  height: 30px;\n}\n\n#application h2,\n#specs h2 {\n  margin: 0;\n  padding: 0.5em;\n  font-size: 1.1em;\n}\n\n#status-legend {\n  margin-top: 10px;\n  margin-right: 10px;\n}\n\n#header,\n#application,\n.test-info,\n.test-actions li {\n  overflow: hidden;\n}\n\n#application {\n  margin: 10px;\n}\n\n#application iframe {\n  width: 100%;\n  height: 758px;\n}\n\n#application .popout {\n  float: right;\n}\n\n#application iframe {\n  border: none;\n}\n\n.tests li,\n.test-actions li,\n.test-it li,\n.test-it ol,\n.status-display {\n  list-style-type: none;\n}\n\n.tests,\n.test-it ol,\n.status-display {\n  margin: 0;\n  padding: 0;\n}\n\n.test-info {\n  margin-left: 1em;\n  margin-top: 0.5em;\n  border-radius: 8px 0 0 8px;\n  -webkit-border-radius: 8px 0 0 8px;\n  -moz-border-radius: 8px 0 0 8px;\n  cursor: pointer;\n}\n\n.test-info:hover .test-name {\n  text-decoration: underline;\n}\n\n.test-info .closed:before {\n  content: \'\\25b8\\00A0\';\n}\n\n.test-info .open:before {\n  content: \'\\25be\\00A0\';\n  font-weight: bold;\n}\n\n.test-it ol {\n  margin-left: 2.5em;\n}\n\n.status-display,\n.status-display li {\n  float: right;\n}\n\n.status-display li {\n  padding: 5px 10px;\n}\n\n.timer-result,\n.test-title {\n  display: inline-block;\n  margin: 0;\n  padding: 4px;\n}\n\n.test-actions .test-title,\n.test-actions .test-result {\n  display: table-cell;\n  padding-left: 0.5em;\n  padding-right: 0.5em;\n}\n\n.test-actions {\n  display: table;\n}\n\n.test-actions li {\n  display: table-row;\n}\n\n.timer-result {\n  width: 4em;\n  padding: 0 10px;\n  text-align: right;\n  font-family: monospace;\n}\n\n.test-it pre,\n.test-actions pre {\n  clear: left;\n  color: black;\n  margin-left: 6em;\n}\n\n.test-describe {\n  padding-bottom: 0.5em;\n}\n\n.test-describe .test-describe {\n  margin: 5px 5px 10px 2em;\n}\n\n.test-actions .status-pending .test-title:before {\n  content: \'\\00bb\\00A0\';\n}\n\n.scrollpane {\n   max-height: 20em;\n   overflow: auto;\n}\n\n/** Colors */\n\n#header {\n  background-color: #F2C200;\n}\n\n#specs h2 {\n  border-top: 2px solid #BABAD1;\n}\n\n#specs h2,\n#application h2 {\n  background-color: #efefef;\n}\n\n#application {\n  border: 1px solid #BABAD1;\n}\n\n.test-describe .test-describe {\n  border-left: 1px solid #BABAD1;\n  border-right: 1px solid #BABAD1;\n  border-bottom: 1px solid #BABAD1;\n}\n\n.status-display {\n  border: 1px solid #777;\n}\n\n.status-display .status-pending,\n.status-pending .test-info {\n  background-color: #F9EEBC;\n}\n\n.status-display .status-success,\n.status-success .test-info {\n  background-color: #B1D7A1;\n}\n\n.status-display .status-failure,\n.status-failure .test-info {\n  background-color: #FF8286;\n}\n\n.status-display .status-error,\n.status-error .test-info {\n  background-color: black;\n  color: white;\n}\n\n.test-actions .status-success .test-title {\n  color: #30B30A;\n}\n\n.test-actions .status-failure .test-title {\n  color: #DF0000;\n}\n\n.test-actions .status-error .test-title {\n  color: black;\n}\n\n.test-actions .timer-result {\n  color: #888;\n}\n</style>');