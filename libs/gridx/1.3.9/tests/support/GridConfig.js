define([
	"dojo/_base/declare",
	"dojo/_base/array",
	"dojo/_base/json",
	'dijit/_Widget',
	'dijit/_TemplatedMixin',
	'dijit/_WidgetsInTemplateMixin',
	"dojo/text!./GridConfig.html",
	"dijit/form/CheckBox",
	"dijit/form/RadioButton",
	"dijit/form/TextBox",
	"dijit/form/Select",
	"dijit/form/NumberTextBox",
	"./TestPane"
], function(declare, array, json, _Widget, _TemplatedMixin, _WidgetsInTemplateMixin, template){

return declare('gridx.tests.support.GridConfig', [_Widget, _TemplatedMixin, _WidgetsInTemplateMixin], {
	templateString: template,
	
	stores: {},

	caches: {},
	
	gridAttrs: {},
	
	modules: {},
	
	modelExts: {},
	
	getID: function(type, name){
		return this.id + "_" + type + "_" + name;
	},

	postCreate: function(){
		this.inherited(arguments);
        this.tp.addTestSet('Modules', this._createMods());
        this.tp.addTestSet('Attributes', this._createArgs());
		this.tp.addTestSet('Other Settings', [
			'<h2>Stores & Structures</h2>',
			this._createStores(),
			'<h2>Caches</h2>',
			this._createCaches(),
			'<h2>Model Extensions</h2>',
			this._createExts(),
		''].join(''));
	},

	startup: function(){
		if(!this._started){
			this.inherited(arguments);
			var storeName, cacheName, attrName, modName;
			this.connect(dijit.byId(this.getID('all', 'modules')), 'onChange', '_selectAllMods');
			for(storeName in this.stores){
				this.connect(dijit.byId(this.getID('rb', storeName)), 'onChange', dojo.hitch(this, '_onChangeCheckBox', storeName, 'rb', this.stores[storeName]));
			}
			
			for(attrName in this.gridAttrs){
				this.connect(dijit.byId(this.getID('cbattr', attrName)), 'onChange', dojo.hitch(this, '_onChangeCheckBox', attrName, 'cbattr', this.gridAttrs[attrName]));
			}
			
			var onChange = function(mods, modName){
				t._onChangeCheckBox(modName, 'cb', mods);
				t._requireDepends(mods, modName);
			};
			for(modName in this.modules){
				var t = this;
				var mods = t.modules[modName];
				this.connect(dijit.byId(this.getID('cb', modName)), 'onChange', dojo.hitch(this, onChange, mods, modName));
			}
		}
	},

	_requireDepends: function(mods, mName){
		var thisName;
		var deps = [];
		for(var implName in mods){
			var mod = mods[implName];
			var prot = mod.prototype;
			var dep = (prot.forced || []).concat(prot.required || []);
			thisName = prot.name;
			deps = deps.concat(dep);
		}
		if(dijit.byId(this.getID('cb', mName)).get('checked')){
			if(deps.length){
				var res = [];
				for(var modName in this.modules){
					var m = this.modules[modName];
					for(implName in m){
						if(!{
							// rule out core modules
							header: 1,
							body: 1,
							vScroller: 1
						}[m[implName].prototype.name]){
							if(array.indexOf(deps, m[implName].prototype.name) >= 0){
								res.push(modName);
								break;
							}
						}
					}
				}
				var t = this;
				array.forEach(res, function(modName){
					dijit.byId(t.getID('cb', modName)).set('checked', true);
				});
			}
		}else{
			var mods = [], modName;
			for(modName in this.modules){
				var mod = this.modules[modName];
				if(dijit.byId(this.getID('cb', modName)).get('checked')){
					var implName = dijit.byId(this.getID('select', modName)).get('value');
					var prot = mod[implName].prototype;
					var dep = (prot.forced || []).concat(prot.required || []);
					if(array.indexOf(dep, thisName) >= 0){
						dijit.byId(this.getID('cb', modName)).set('checked', false);
					}
				}
			}

		}
	},

	getHandle: function(type, name){
		return dijit.byId(this.getID({
			'store': 'rb',
			'layout': 'select',
			'cache': 'rb',
			'attr': 'cbattr',
			'attrValue': 'selectattr',
			'ext': 'cb',
			'mod': 'cb',
			'modImpl': 'select'
		}[type], name));
	},
	
	_createStores: function(){
		var sb = ['<table>'];
		for(var storeName in this.stores){
			var storeLayout = this.stores[storeName];
			sb.push('<tr><td><div data-dojo-type="dijit.form.RadioButton" ',
				'id="', this.getID('rb', storeName), '" ',
				'name="', this.getID('rb', 'store'), '" ',
				storeLayout.defaultCheck ? 'checked="true"' : '', 
				'></div><label for="', this.getID('rb', storeName), '">', storeName, '</label>',
				'</td><td><select data-dojo-type="dijit.form.Select" ',
				'id="', this.getID('select', storeName), '" ', 
				storeLayout.defaultCheck ? '' : 'disabled="true"',
			'>');
			var f = 0;
			for(var layoutName in storeLayout.layouts){
				sb.push("<option value='", layoutName, "' selected='", !f++, "'>", layoutName,"</option>");
			}
			sb.push("</select></td></tr>");
		}
		sb.push('</table>');
		return sb.join('');
	},

	_createCaches: function(){
		var sb = ['<table>'];
		for(var cacheName in this.caches){
			var cache = this.caches[cacheName];
			sb.push("<tr><td><div data-dojo-type='dijit.form.RadioButton' ",
				"id='", this.getID('rb', cacheName), "' ",
				"name='", this.getID('rb', 'cache'), "' ",
				cache.defaultCheck ? "checked='true'" : "",
				"></div><label for='", this.getID('rb', cacheName), "'>", cacheName, "</label>",
			"</td></tr>");
		}
		sb.push('</table>');
		return sb.join('');
	},
	
	_createArgs: function(){
		var sb = ['<table>'];
		for(var attrName in this.gridAttrs){
			var attr = this.gridAttrs[attrName];
			sb.push("<tr><td><div dojoType='dijit.form.CheckBox' ",
				"id='", this.getID('cbattr', attrName), "' ",
				attr.defaultCheck ? "checked='true'" : "",
				"></div><label for='", this.getID('cbattr', attrName), "'>", attrName, "</label>",
				"</td><td>");
			switch(attr.type){
				case 'bool':
					sb.push("<select dojoType='dijit.form.Select' id='",
						this.getID('selectattr', attrName), "' ",
						attr.defaultCheck ? '' : "disabled='true'",
						"><option value='true'>true</option>",
						"<option value='false'>false</option>",
					"</select>");
					break;
				case 'enum':
					sb.push("<select dojoType='dijit.form.Select' id='",
						this.getID('selectattr', attrName), "' ",
						attr.defaultCheck ? '' : "disabled='true'",
					">");
					for(var valueName in attr.values){
						sb.push("<option value='", attr.values[valueName], "'>", valueName, "</option>");
					}
					sb.push('</select>');
					break;
				case 'string':
				case 'json':
					sb.push("<input dojoType='dijit.form.TextBox' id='",
						this.getID('selectattr', attrName), "' ",
						attr.defaultCheck ? ' ' : "disabled='true' ",
						"value='", attr.value, "'",
					"/>");
					break;
				case 'number':
					sb.push("<input dojoType='dijit.form.NumberTextBox' id='",
						this.getID('selectattr', attrName), "' ",
						attr.defaultCheck ? ' ' : "disabled='true' ",
						"value='", attr.value, "'",
					"/>");
					break;
			}
			sb.push("</td></tr>");
		}
		sb.push('</table>');
		return sb.join('');
	},
	
	_createExts: function(){
		var sb = ['<table>'];
		for(var extName in this.modelExts){
			sb.push("<tr><td><div dojoType='dijit.form.CheckBox' ",
				"id='", this.getID('cb', extName), "' ",
				"extName='", extName, "' ",
				"></div><label for='", this.getID('cb', extName), "'>", extName, "</label>",
			"</td></tr>");
		}
		sb.push('</table>');
		return sb.join('');
	},
	
	_createMods: function(){
		var sb = ['<table class="gridxConfigAllMods"><tr><td>',
			'<div data-dojo-type="dijit.form.CheckBox" ',
			'id="', this.getID('all', 'modules'), '" ',
			'></div><label for="', this.getID('all', 'modules'), '">Select All Modules</label>',
		'</td></tr></table><table>'];
		for(var modName in this.modules){
			var mod = this.modules[modName];
			sb.push("<tr><td><div dojoType='dijit.form.CheckBox' ",
				"id='", this.getID('cb', modName), "' ",
				"modName='", modName, "' ", 
				mod.defaultCheck ? "checked='true' disabled='true'" : "", 
				"></div><label for='", this.getID('cb', modName), "'>", modName, "</label>",
				"</td><td><select dojoType='dijit.form.Select' ",
				"id='", this.getID('select', modName), "' ", 
				mod.defaultCheck ? "" : "disabled='true'", 
			">");
			var f = 0;
			for(var implName in mod){
				if(implName === 'defaultCheck')continue;
				sb.push("<option value='", implName, "'>", implName, "</option>");
			}
			sb.push("</select></td></tr>");
		}
		return sb.join('');
	},
	
	_onChangeCheckBox: function(name, type, obj){
		var b = dijit.byId(this.getID(type, name));
		var toEnable = b.get('checked');
		dijit.byId(this.getID(type == 'cbattr' ? 'selectattr' : 'select', name)).set('disabled', !toEnable);
		if(obj.onChange){
			obj.onChange(toEnable, this);
		}
	},
	
	_getStoreLayout: function(){
		var store, structure, storeName;
		for(storeName in this.stores){
			if(dijit.byId(this.getID('rb', storeName)).get('checked')){
				store = this.stores[storeName].store;
				var layoutName = dijit.byId(this.getID('select', storeName)).get('value');
				structure = this.stores[storeName].layouts[layoutName];
				break;
			}
		}
		return {
			store: store,
			structure: structure
		};
	},

	_getCache: function(){
		var cache, cacheName;
		for(cacheName in this.caches){
				if(dijit.byId(this.getID('rb', cacheName)).get('checked')){
				cache = this.caches[cacheName].cache;
				break;
			}
		}
		return cache;
	},
	
	_getAttrs: function(){
		var attrs = {}, attrName;
		for(attrName in this.gridAttrs){
			var attr = this.gridAttrs[attrName];
			if(dijit.byId(this.getID('cbattr', attrName)).get('checked')){
				switch(attr.type){
					case 'bool':
						attrs[attrName] = dijit.byId(this.getID('selectattr', attrName)).get('value') == 'true';
						break;
					case 'number':
						attrs[attrName] = parseInt(dijit.byId(this.getID('selectattr', attrName)).get('value'), 10);
						break;
					case 'string':
						attrs[attrName] = dijit.byId(this.getID('selectattr', attrName)).get('value');
						break;
					case 'enum':
						var valueName = dijit.byId(this.getID('selectattr', attrName)).get('value');
						attrs[attrName] = attr[valueName];
						break;
					case 'json':
						attrs[attrName] = json.fromJson(dijit.byId(this.getID('selectattr', attrName)).get('value'));
						break;
				}
			}
		}
		return attrs;
	},
	
	_getExts: function(){
		var modExts = [], extName;
		for(extName in this.modelExts){
			if(dijit.byId(this.getID('cb', extName)).get('checked')){
				modExts.push(this.modelExts[extName]);
			}
		}
		return modExts;
	},
	
	_getMods: function(){
		var mods = [], modName;
		for(modName in this.modules){
			var mod = this.modules[modName];
			if(dijit.byId(this.getID('cb', modName)).get('checked')){
				var implName = dijit.byId(this.getID('select', modName)).get('value');
				mods.push(mod[implName]);
			}
		}
		return mods;
	},
	
	getGridArgs: function(){
		var ret = dojo.mixin(this._getAttrs(), this._getStoreLayout(), {
			cacheClass: this._getCache(),
			modelExtensions: this._getExts(),
			modules: this._getMods()
		});
		console.log("grid args:", ret);
		return ret;
	},
		
	_selectAllMods: function(checked){
		var modName;
		for(modName in this.modules){
			if(!this.modules[modName].defaultCheck){
				dijit.byId(this.getID('cb', modName)).set('checked', checked);
			}
		}
	},
	
	_onCreate: function(){
		this.onCreate(this.getGridArgs());
	},

	onCreate: function(){},
	
	onDestroy: function(){}
});
});
