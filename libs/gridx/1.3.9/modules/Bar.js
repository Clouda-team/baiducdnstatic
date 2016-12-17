define([
	"require",
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dijit/registry",
	"dijit/a11y",
	"dojo/dom-construct",
	"../core/_Module"
], function(require, declare, lang, array, registry, a11y, domConstruct, _Module){

/*=====
	var Bar = declare(_Module, {
		// summary:
		//		module name: bar.
		//		This is a general-purpose bar for gridx.
		// description:
		//		This module can be configured to hold various plugins, such as pager, pageSizer, gotoPageButton, summary, quickFilter, toobar, etc.
		//		This is a registered module, so if it is depended by other modules, no need to declare it when creating grid.
		// example:
		//		Bar with single row:
		//	|	barTop: [
		//	|		gridx.support.QuickFilter,		//can be the constructor of a bar plugin widget.
		//	|		"gridx/support/Summary"			//can also be the MID of a bar plugin widget.
		//	|		{pluginClass: gridx.support.LinkSizer, style: "text-align: center;"},		//or an object with attributes
		//	|		MyQuickFilterInstance		//or an instance of a plugin widget
		//	|		{plugin: MyQuickFilterInstance, style: "color: red;"}		//or with other attributes
		//	|	]
		//		or multiple rows:
		//	|	barTop: [
		//	|		[		//every sub-array is a table row.
		//	|			{content: "This is <b>a message</b>", style: "background-color: blue;"},	//Can add some html
		//	|			null	//if null, just an empty cell
		//	|		],
		//	|		[
		//	|			{pluginClass: gridx.support.LinkPager, 'class': 'myclass'},		//can provide custom class for the plugin
		//	|			{colSpan: 2, rowSpan: 2}	//can add colSpan and rowSpan
		//	|		]
		//	|	]

		// top: __BarItem[]?
		//		An array of bar content declarations. Located above grid header.
		//		The top bar is a big html table, and every content occupies a cell in it.
		//		If it is a single dimensional array, then the top bar will contain only one row.
		//		If it is a two dimensional array, then every sub-array represents a row.
		top: null,

		// bottom: __BarItem[]?
		//		An array of bar content declarations. Located below grid horizontal scroller.
		//		The bottom bar is a big html table, and every content occupies a cell in it.
		//		If it is a single dimensional array, then the bottom bar will contain only one row.
		//		If it is a two dimensional array, then every sub-array represents a row.
		bottom: null,

		// plugins: [readonly]Object
		//		A place to access to the plugins.
		//		For plugins in top bar, use plugins.top, which is an array of bar rows.
		//		e.g.: plugins.top[0][0] is the first plugin the first row of the top bar.
		//		plugin.bottom is similar.
		plugins: null
	});

	Bar.__BarItem = declare([], {
		// summary:
		//		Configurations for a <td> in the grid bar.
		//		This configuration object will also be passed to the constructor of the plugin, if "pluginClass" is used,
		//		so the plugin-related parameters can also be declared here.

		// content: String
		//		The HTML content in this bar position (<td>)
		content: '',

		// pluginClass: String|Function
		//		The class name (MID) or contructor of the plugin. The plugin instance will be created automatically.
		//		If there's no other configurations, this class name/constructor can be used directly in place 
		//		of the whole __BarItem configuration object.
		//		If this parameter exists, the "content" parameter will be ignored.
		pluginClass: null,

		// plugin: Object
		//		A plugin instance. If this parameter exists, the "pluginClass" and "content" parameter will be ignored.
		//		Note that if declared in this way, the same instance can not be used in other bar positions.
		//		If there's no other configurations, and this plugin has "domNode" attribute, then this instance can be used directly in place 
		//		of the whole __BarItem configuration object.
		plugin: null,

		// colSpan: Integer
		//		Column span of this <td>
		colSpan: 1,

		// rowSpan: Integer
		//		Row span of this <td>
		rowSpan: 1,

		// style: String
		//		Style of this <td>
		style: '',

		// className: String
		//		Class of this <td>
		className: ''
	});

	return Bar;
=====*/

	return _Module.register(
	declare(_Module, {
		name: 'bar',

		constructor: function(){
			this.defs = [];
		},

		load: function(args, startup){
			var t = this;
			t._init();
			t.loaded.callback();
			startup.then(function(){
				t._forEachPlugin(function(plugin){
					if(plugin && plugin.startup){
						plugin.startup();
					}
				});
				setTimeout(function(){
					t.grid.vLayout.reLayout();
				}, 10);
			});
		},

		destroy: function(){
			this.inherited(arguments);
			this._forEachPlugin(function(plugin){
				if(plugin.destroy){
					plugin.destroy();
				}
			});
		},

		//Private---------------------------------------------------------
		_init: function(){
			var t = this,
				bar,
				defDict = t._defDict = {},
				sortDefCols = function(row){
					row.sort(function(a, b){
						return a.col - b.col;
					});
				},
				normalize = function(def){
					if(lang.isArray(def) && def.length && !lang.isArray(def[0])){
						def = [def];
					}
					return def;
				},
				top = normalize(t.arg('top')),
				bottom = normalize(t.arg('bottom'));
			array.forEach(t.defs, function(def){
				var barDef = defDict[def.bar] = defDict[def.bar] || [],
					row = barDef[def.row] = barDef[def.row] || [];
				row.push(def);
				barDef.priority = 'priority' in def ? def.priority : barDef.priority || -5;
				barDef.container = def.container ? def.container : barDef.container || 'headerNode';
				barDef.barClass = def.barClass ? def.barClass : barDef.barClass || '';
			});
			for(bar in defDict){
				array.forEach(defDict[bar], sortDefCols);
			}
			if(top){
				defDict.top = top.concat(defDict.top || []);
			}
			if(defDict.top){
				defDict.top.priority = -5;
				defDict.top.container = 'headerNode';
			}
			if(bottom){
				defDict.bottom = (defDict.bottom || []).concat(bottom);
			}
			if(defDict.bottom){
				defDict.bottom.priority = 5;
				defDict.bottom.container = 'footerNode';
			}
			for(bar in defDict){
				var def = defDict[bar],
					nodeName = bar + 'Node',
					node = t[nodeName] = domConstruct.create('div', {
						'class': "gridxBar " + def.barClass || '',
						innerHTML: '<table border="0" cellspacing="0" role="presentation"></table>'
					});
				t.grid.vLayout.register(t, nodeName, def.container, def.priority);
				t._initFocus(bar, def.priority);
				t.plugins = t.plugins || {};
				t.plugins[bar] = t._parse(def, node.firstChild);
			}
		},

		_parse: function(defs, node){
			var plugin,
				plugins = [],
				tbody = domConstruct.create('tbody'),
				setAttr = function(n, def, domAttr, attr){
					if(def[attr]){
						n.setAttribute(domAttr || attr, def[attr]);
						delete def[attr];
					}
				};
			for(var i = 0, rowCount = defs.length; i < rowCount; ++i){
				var pluginRow = [],
					row = defs[i],
					tr = domConstruct.create('tr');
				for(var j = 0, colCount = row.length; j < colCount; ++j){
					var def = this._normalizePlugin(row[j]),
						td = domConstruct.create('td');
					array.forEach(['colSpan', 'rowSpan', 'style'], lang.partial(setAttr, td, def, 0));
					setAttr(td, def, 'class', 'className');
					plugin = null;
					try{
						if(def.plugin){
							plugin = registry.byId(def.plugin);
							td.appendChild(plugin.domNode);
						}else if(def.pluginClass){
							var cls = def.pluginClass;
							delete def.pluginClass;
							plugin = new cls(def);
							td.appendChild(plugin.domNode);
						}else if(def.content){
							td.innerHTML = def.content;
						}
					}catch(e){
						console.error(e);
					}
					if(def.hookPoint && def.hookName){
						def.hookPoint[def.hookName] = plugin || td;
					}
					pluginRow.push(plugin || td);
					tr.appendChild(td);
				}
				plugins.push(pluginRow);
				tbody.appendChild(tr);
			}
			node.appendChild(tbody);
			return plugins;
		},

		_normalizePlugin: function(def){
			if(!def || !lang.isObject(def) || lang.isFunction(def)){
				//def is a constructor or class name
				def = {
					pluginClass: def
				};
			}else if(def.domNode){
				//def is a widget
				def = {
					plugin: def
				};
			}else{
				//def is a configuration object.
				//Shallow copy, so user's input won't be changed.
				def = lang.mixin({}, def);
			}
			if(lang.isString(def.pluginClass)){
				try{
					def.pluginClass = require(def.pluginClass);
				}catch(e){
					console.error(e);
				}
			}
			if(lang.isFunction(def.pluginClass)){
				def.grid = this.grid;
			}else{
				def.pluginClass = null;
			}
			return def;
		},

		_forEachPlugin: function(callback){
			function forEach(plugins){
				if(plugins){
					for(var i = 0, rowCount = plugins.length; i < rowCount; ++i){
						var row = plugins[i];
						for(var j = 0, colCount = row.length; j < colCount; ++j){
							callback(row[j]);
						}
					}
				}
			}
			var plugins = this.plugins;
			for(var barName in plugins){
				forEach(plugins[barName]);
			}
		},

		//Focus---------------------
		_initFocus: function(barName, priority){
			var t = this,
				f = t.grid.focus,
				node = t[barName + 'Node'];
			if(f && node){
				f.registerArea({
					name: barName + 'bar',
					priority: priority,
					focusNode: node,
					doFocus: lang.hitch(t, t._doFocus, node),
					doBlur: lang.hitch(t, t._doBlur, node)
				});
			}
		},

		_doFocus: function(node, evt, step, forced){
			if(forced){ return; }
			this.grid.focus.stopEvent(evt);
			var elems = a11y._getTabNavigable(node),
				n = elems[step < 0 ? 'last' : 'first'];

			if(n){
				n.focus();
			}
			return !!n;
		},

		_doBlur: function(node, evt, step){
			var elems = a11y._getTabNavigable(node),
				first = elems.first,
				last = elems.last, result;

			function isChild(child, parent){
				if(!child || !parent){ return false; }
				var n = child;
				while(n && n != parent){
					n = n.parentNode;
				}
				return !!n;
			}

			if(!evt){
				return true;
			}
			if(step > 0 && !last){
				return true;
			}
			if(step < 0 && !first){
				return true;
			}

			result = (evt.target == (step < 0 ? elems.first : elems.last)) || isChild(evt.target, step < 0 ? elems.first : elems.last);
			return result;
		}
	}));
});
