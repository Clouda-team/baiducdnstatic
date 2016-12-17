define([
	'require',
	'dojo/ready',
	'dojo/parser',
	'dojo/_base/lang',
	'dojo/_base/query',
	'dojo/_base/array',
	'dojo/DeferredList',
	'dojo/dom',
	'dojo/dom-construct',
	'dojo/dom-geometry',
	'dojo/dom-class',
	'dojo/dom-style',
	'dijit/registry',
	'gridx/tests/demo/util/ColumnBar',
	'gridx/tests/demo/util/modules',
	'gridx/tests/demo/util/attrs',
	'gridx/tests/demo/util/data',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/allModules',
	'gridx/core/model/cache/Sync',
	'gridx/core/model/cache/Async',
	'dojo/NodeList-manipulate',
	'dijit/form/TextBox',
	'dijit/form/NumberSpinner',
	'dijit/form/Select',
	'dijit/form/NumberTextBox',
	'gridx/support/menu/NumberFilterMenu',
	'gridx/support/menu/AZFilterMenu',
	'dojo/domReady!'
], function(require, ready, parser, lang, query, array, DeferredList,
	dom, domConstruct, domGeo, domClass, domStyle,
	registry, ColumnBar, modules, attrs, data,
Store, Grid){

	query('#showConfig').on('click', toggleConfig);
	query('#configComplete').on('click', function(){
		toggleConfig(null, false);
		createGrid();
	});
	query('#showGrid').on('click', function(){
		toggleConfig(null, false);
		toggleCode(null, false);
		createGrid();
	});
	query('#showCode').on('click', toggleCode);
	query('.codeContainerTitle').on('mouseover', function(e){
		query('.codeContainerTitle').forEach(function(node){
			domClass.toggle(node, 'codeContainerTitleSelected', e.target == node);
		});
		domClass.toggle('jscodeContainer', 'codeHidden', e.target.id != 'jscodeTitle');
		domClass.toggle('htmlcodeContainer', 'codeHidden', e.target.id != 'htmlcodeTitle');
	});

	query('.closeCode').on('click', toggleCode);
	query('.closeConfig').on('click', function(){
		query('.configDetailOpen').removeClass('configDetailOpen');
	});
	query('.storeConfigBtn', 'clientOrServer').on('click', function(){
		query('.storeConfigBtnSelected', 'clientOrServer').removeClass('storeConfigBtnSelected');
		domClass.add(this, 'storeConfigBtnSelected');
	});
	query('.storeConfigBtn', 'listOrTree').on('click', function(){
		query('.storeConfigBtnSelected', 'listOrTree').removeClass('storeConfigBtnSelected');
		domClass.add(this, 'storeConfigBtnSelected');
		dom.byId('treeDataConfig').style.height = this.id == 'treeDataBtn' ? '80px' : '0';
	});
	query('#storeConfig .closeConfig').on('click', storeSummary);
	query('#columnsConfig .closeConfig').on('click', columnsSummary);
	query('#modulesConfig .closeConfig').on('click', modulesSummary);
	query('#attributesConfig .closeConfig').on('click', attributesSummary);

	query('#storeConfigPreview').on('click', function(){
		query('#storeConfig').addClass('configDetailOpen');
	});
	query('#columnsConfigPreview').on('click', function(){
		query('#columnsConfig').addClass('configDetailOpen');
	});
	query('#modulesConfigPreview').on('click', function(){
		query('#modulesConfig').addClass('configDetailOpen');
	});
	query('#attributesConfigPreview').on('click', function(){
		query('#attributesConfig').addClass('configDetailOpen');
	});
	query('#addColumnBtn').on('click', function(){
		addColumnBar();
	});
	query('#modulesAvailable').on('dblclick', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'moduleItem')){
			n = n.parentNode;
		}
		if(n && domClass.contains(n, 'moduleItem')){
			useModule(n);
			attributesSummary();
			dom.byId('modulesLoadedCover').style.display = 'none';
		}
	});
	query('#modulesLoaded').on('dblclick', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'moduleItem')){
			n = n.parentNode;
		}
		if(n && domClass.contains(n, 'moduleItem')){
			delModule(n);
			attributesSummary();
			if(!query('.moduleItem', 'modulesLoaded').length){
				dom.byId('modulesLoadedCover').style.display = '';
			}
		}
	});
	query('#modulesConfig').on('mousedown', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'moduleItem')){
			n = n.parentNode;
		}
		if(n && domClass.contains(n, 'moduleItem')){
			query('.moduleItemFocus').removeClass('moduleItemFocus');
			domClass.add(n, 'moduleItemFocus');
			dom.byId('moduleDescCover').style.display = 'none';
			showModuleDetail(modules[n.getAttribute('data-mod-idx')]);
		}
	});
	query('.attributesPane').on('mouseover', function(e){
		var n = e.target;
		while(n && !domClass.contains(n, 'attributesPane')){
			n = n.parentNode;
		}
		query('.attributesPaneSelected').removeClass('attributesPaneSelected');
		domClass.add(n, 'attributesPaneSelected');
	});
	query('#columnsContainer').on('mousedown', function(e){
		var n = e.target;
		if(domClass.contains(n, 'columnBarBasic') || domClass.contains(n, 'columnBarIndex')){
			n = n.parentNode;
		}
		if(!domClass.contains(n, 'columnBar')){
			while(n && !domClass.contains(n, 'columnBarIndex')){
				n = n.parentNode;
			}
		}
		if(n){
			dom.setSelectable('columnsConfig', false);
			this._dndReady = true;
			this._dndColNode = n;
		}
	});
	query('body').on('mousemove', function(e){
		var container = query('#columnsContainer')[0];
		var n = container._dndColNode;
		var pos;
		if(container._dndReady){
			delete container._dndReady;
			container._dnd = true;
			pos = domGeo.position(container);
			n.style.top = (e.clientY - pos.y - 20) + 'px';
			n.previousSibling.style.height = '104px';
			container._pad = n.nextSibling;
			container.removeChild(n.nextSibling);
			domClass.add(n.previousSibling, 'betweenColumnsBarExpanded');
			domConstruct.place(n, 'addColumnBtn', 'after');
			
			domClass.add(n, 'columnBarDnD');
			setTimeout(function(){
				domClass.add(container, 'columnDnD');
			}, 1);
		}else if(container._dnd){
			pos = domGeo.position(container);
			var y = e.clientY - pos.y - 20;
			n.style.top = y + 'px';
			var found = query('.columnBar').some(function(columnBarNode){
				if(columnBarNode != n){
					var p = domGeo.position(columnBarNode);
					if((p.y + p.h / 2) > e.clientY){
						var pad = query('.betweenColumnsBarExpanded', 'columnsContainer');
						if(columnBarNode.previousSibling != pad[0]){
							pad.removeClass('betweenColumnsBarExpanded').style('height', '');
							domClass.add(columnBarNode.previousSibling, 'betweenColumnsBarExpanded');
							columnBarNode.previousSibling.style.height = '104px';
						}
						return true;
					}
				}
			});
			if(!found){
				var pad = query('.betweenColumnsBarExpanded', 'columnsContainer');
				var lastPad = dom.byId('addColumnBtn').previousSibling;
				if(lastPad != pad){
					pad.removeClass('betweenColumnsBarExpanded').style('height', '');
					domClass.add(lastPad, 'betweenColumnsBarExpanded');
					lastPad.style.height = '104px';
				}
			}
			endScrollColumns();
			if(e.clientY < pos.y + 40){
				startScrollColumns(-1);
			}else if(e.clientY > pos.y + pos.h - 40){
				startScrollColumns(1);
			}
		}
	});
	query('body').on('mouseup', function(e){
		var container = query('#columnsContainer')[0];
		if(container._dnd || container._dndReady){
			delete container._dndReady;
			delete container._dnd;
			var pad = query('.betweenColumnsBarExpanded', 'columnsContainer').removeClass('betweenColumnsBarExpanded')[0];
			if(pad){
				pad.style.height = '';
				container._dndColNode.style.top = '';
				domConstruct.place(container._dndColNode, pad, 'after');
				domConstruct.place(container._pad, container._dndColNode, 'after');
				domClass.remove(container._dndColNode, 'columnBarDnD');
				domClass.remove(container, 'columnDnD');
				dom.setSelectable('columnsConfig', true);
				updateColumnIdx();
			}
		}
	});
	colScrollHandler = null;
	otherModules = {};
	
	function startScrollColumns(dir){
		if(!colScrollHandler){
			colScrollHandler = setInterval(function(){
				dom.byId('columnsContainer').scrollTop += dir * 10;
			}, 10);
		}
	}
	function endScrollColumns(){
		clearInterval(colScrollHandler);
		colScrollHandler = null;
	}

	function toggleConfig(e, toShow){
		if(domClass.contains(query('#codeViewer')[0], 'configOpen')){
			toggleCode(null, false);
		}
		var cfg = query('#config');
		if(toShow === undefined){
			toShow = !domClass.contains(cfg[0], 'configOpen');
		}
		query('#showConfig').toggleClass('headerBtnPressed', toShow);
		cfg.toggleClass('configOpen', toShow);
		cfg.style('height', toShow ? '642px' : '0');
	}
	function toggleCode(e, toShow){
		updateJSCode();
		updateHTMLCode();
		var cfg = query('#codeViewer');
		if(toShow === undefined){
			toShow = !domClass.contains(cfg[0], 'configOpen');
		}
		query('#showCode').toggleClass('headerBtnPressed', toShow);
		cfg.toggleClass('configOpen', toShow);
		cfg.style('height', toShow ? '642px' : '0');
	}

	function updateColumnIdx(){
		var cols = dom.byId('columnsContainer').childNodes;
		for(var i = 0, idx = 1; i < cols.length; ++i){
			var col = cols[i];
			if(domClass.contains(col, 'columnBar')){
				col = registry.byNode(col);
				col.setIndex(idx);
				++idx;
			}
		}
	}
	cid = 1;
	function addColumnBar(refCol, colProps){
		colProps = colProps || {};
		var colbar = new ColumnBar({
			columnId: colProps.id || 'column_' + cid++,
			columnName: colProps.name || 'New Column',
			columnField: colProps.field || 'name',
			columnWidth: colProps.width,
			fields: data.fields,
			onAdd: function(){
				addColumnBar(this);
			},
			onDelete: function(){
				var t = this;
				t.domNode.style.height = 0;
				setTimeout(function(){
					t.domNode.parentNode.removeChild(t.domNode.nextSibling);
					t.domNode.parentNode.removeChild(t.domNode);
					updateColumnIdx();
					t.destroy();
				}, 500);
			}
		});
		if(refCol){
			colbar.placeAt(refCol.domNode, 'after');
			domConstruct.create('div', {
				'class': 'betweenColumnsPad'
			}, colbar.domNode, 'before');
		}else{
			colbar.placeAt('addColumnBtn', 'before');
			domConstruct.create('div', {
				'class': 'betweenColumnsPad'
			}, colbar.domNode, 'after');
		}
		updateColumnIdx();
		setTimeout(function(){
			colbar.domNode.style.height = '80px';
		}, 40);
	}
	function storeSummary(){
		var isClient = domClass.contains('clientStoreBtn', 'storeConfigBtnSelected');
		var isList = domClass.contains('listDataBtn', 'storeConfigBtnSelected');
		var rowCount = registry.byId('rowCountInput').get('value');
		var sb = ["<ul>",
			"<li>", isClient ? "Client" : "Server", " store</li>",
			"<li>", isList ? "List" : "Hierarchical", " data</li>",
			"<li>", rowCount, " rows</li>",
		"</ul>"];
		dom.byId('storeConfigPreviewSummary').innerHTML = sb.join('');
	}
	function columnsSummary(){
		var cols = query('.columnBar', 'columnsContainer').map(function(columnBarNode){
			return colBar = registry.byNode(columnBarNode).getColumn();
		});
		cols.sort(function(col1, col2){
			return col1.index - col2.index;
		});
		var sb = [];
		sb.push.apply(sb, cols.map(function(col){
			return ['<tr>',
				'<td class="columnsConfigPreviewSummaryIdx">', col.index, '</td>',
				'<td class="columnsConfigPreviewSummaryId">', col.id, '</td>',
				'<td class="columnsConfigPreviewSummaryName">', col.name, '</td>',
				'<td class="columnsConfigPreviewSummaryField">', col.field, '</td>',
				'<td class="columnsConfigPreviewSummaryWidth">', col.width, '</td>',
			'</tr>'].join('');
		}));
		query('tbody', 'columnsConfigPreviewSummaryInner').innerHTML(sb.join(''));
	}
	function modulesSummary(){
		dom.byId('modulesConfigPreviewSummary').innerHTML = query('.moduleItem', 'modulesLoaded').map(function(modNode){
			var bg = domStyle.get(query('.moduleIcon', modNode)[0], 'backgroundImage');
			var label = query('.moduleLabel td', modNode)[0].innerHTML;
			return ["<div class='modulePreviewItem' style='background: ", bg, ";'>",
				'<div class="modulePreviewItemLabel"><table><tr><td>', label, '</td></tr></table></div>',
			'</div>'].join('');
		}).join('');
	}
	function attributesSummary(){
		var rows = query('.attributeItemUsed', 'attributesConfig').map(function(attrNode){
			var label = attrNode.getAttribute('data-attr-name');
			var attr = attrsByName[label];
			return ["<tr><td class='attributePreviewItemLabel'>", label,
				"</td><td class='attributePreviewItemValue'>", lang.isObject(attr.curValue)? 'Object' : attr.curValue,
				"</td></tr>"].join('');
		});
		query('#attributesConfigPreviewSummary tbody')[0].innerHTML = rows.join('');
	}
	var coreMods = array.map(Grid.prototype.coreModules, function(m){
		return m.prototype.name;
	}).concat(['autoScroll', '_dnd']);
	function loadModules(){
		dom.byId('modulesAvailable').innerHTML = array.map(modules, function(mod, i){
			var prot = mod.module.prototype;
			mod.deps = array.filter((prot.forced || []).concat(prot.required || []), function(dep){
				return array.indexOf(coreMods, dep) < 0;
			});
			return [
				"<div class='moduleItem' data-mod-idx='", i, 
				"' data-mod-name='", mod.module.prototype.name,
				"' data-mod-mid='", mod.mid,
				"' title='click to show description, double click to use'><div class='moduleIcon' style='background:url(\"",
				mod.icon,
				"\");'></div><div class='moduleLabel'><table><tr><td>",
				mod.label,
				"</td></tr></table></div></div>"
			].join('');
		}).join('');
	}
	var attrsByName = {};
	function loadAttributes(){
		array.forEach(attrs, function(attr){
			var name = attr._name = attr.mod ? attr.name.slice(0, 1).toUpperCase() + attr.name.slice(1) : attr.name;
			attr.label = attr.mod ? attr.mod + name : name;
			attrsByName[attr.label] = attr;
			attr.curValue = attr.simpleValue ? attr.simpleValue : attr.value;
		});
		loadBoolAttributes();
		loadNumberAttributes();
		loadOtherAttributes();
	}
	function boolBtn(value){
		return [
			"<div class='attributeBoolBtn ", value ? "attributeBoolOn" : "", "'>",
				"<div class='attributeBoolBtnInner'>",
					"<table border='0' cellpadding='0' cellborder='0'><tbody><tr><td class='attributeBoolBtnOn'>on</td>",
					"<td class='attributeBoolBtnOff'>off</td></tr></tbody></table>",
					"<div class='attributeBoolBtnHandle'></div>",
				"</div>",
			"</div>"
		].join('');
	}
	function loadBoolAttributes(){
		dom.byId('attributesBoolInner').innerHTML = array.map(array.filter(attrs, function(attr){
			return attr.type == 'bool';
		}), function(attr, i){
			return ["<div class='attributeBoolItem attributeItem ",
				(attr.mod && array.indexOf(coreMods, attr.mod) < 0) ? 'attributeItemDisabled' : '',
				"' data-attr-mod='", attr.mod,
				"' data-attr-name='", attr.label, 
				"'><table><tbody><tr><td style='width: 200px; text-align: center;'>",
				"<span>", attr.mod, "</span><span>", attr._name, "</span>",
				"</td><td>",
				boolBtn(attr.value),
				"</td><td>",
				"<div class='attributeBoolItemDesc'>", attr.unitPost, "</div>",
			"</td></tr></tbody></table></div>"].join('');
		}).join('');
		query('.attributeBoolBtn', 'attributesBoolInner').on('click', function(){
			domClass.toggle(this, 'attributeBoolOn');
			var n = this.parentNode;
			while(!domClass.contains(n, 'attributeItem')){
				n = n.parentNode;
			}
			var attr = attrsByName[n.getAttribute('data-attr-name')];
			domClass.toggle(n, 'attributeItemUsed', domClass.contains(this, 'attributeBoolOn') != attr.value);
			attr.curValue = domClass.contains(this, 'attributeBoolOn');
		});
	}
	function loadNumberAttributes(){
		dom.byId('attributesNumberInner').innerHTML = array.map(array.filter(attrs, function(attr){
			return attr.type == 'number';
		}), function(attr, i){
			return ["<div class='attributeNumberItem attributeItem ",
				(attr.mod && array.indexOf(coreMods, attr.mod) < 0) ? 'attributeItemDisabled' : '',
				"' data-attr-mod='", attr.mod,
				"' data-attr-name='", attr.label, 
				"'><table><tbody><tr><td style='width: 200px; text-align: center;'>",
				"<span class='attributeItemMod'>", attr.mod, "</span><span class='attributeItemName'>", attr._name, "</span>",
				"</td><td>", attr.unitPre,
				{
					spinner: "<span class='attributeNumberInput' data-dojo-type='dijit/form/NumberSpinner'",
					numberTextBox: "<span class='attributeNumberInput' data-dojo-type='dijit/form/NumberTextBox'"
				}[attr.editor],
				" data-dojo-props='value: ", attr.value, "'></span>",
				attr.unitPost,
			"</td></tr></tbody></table></div>"].join('');
		}).join('');
		parser.parse(dom.byId('attributesNumberInner'));
		setTimeout(function(){
			query('.attributeNumberInput', 'attributesNumberInner').forEach(function(n){
				var valueBox = registry.byNode(n);
				var attrNode = n.parentNode.parentNode.parentNode.parentNode.parentNode;
				var attr = attrsByName[attrNode.getAttribute('data-attr-name')];
				valueBox.connect(valueBox, 'onChange', function(){
					setTimeout(function(){
						domClass.toggle(attrNode, 'attributeItemUsed', valueBox.get('value') != attr.value);
						attr.curValue = valueBox.get('value');
					}, 10);
				});
				valueBox.connect(valueBox, 'onInput', function(){
					setTimeout(function(){
						domClass.toggle(attrNode, 'attributeItemUsed', valueBox.get('value') != attr.value);
						attr.curValue = valueBox.get('value');
					}, 10);
				});
			});
		}, 500);
	}
	
	function loadOtherAttributes(){
		dom.byId('attributesOtherInner').innerHTML = array.map(array.filter(attrs, function(attr){
			return attr.type == 'other';
		}), function(attr, i){
			return ["<div class='attributeOtherItem attributeItem ",
				(attr.mod && array.indexOf(coreMods, attr.mod) < 0 || attr.overrideCore === true) ? 'attributeItemDisabled' : '',
				"' data-attr-mod='", attr.mod,
				"' data-attr-name='", attr.label, 
				"'><table><tbody><tr><td style='width: 200px; text-align: center;'>",
				"<span class='attributeItemMod'>", attr.mod, "</span><span class='attributeItemName'>", attr._name, "</span>",
				"</td><td style='width:250px'>", 
				"<div><div class='simpleValue valueSelected attributeOtherValue'>",
					"simple value",
					"<div class='valueHoverTitle'><pre>" + formatJsCode('', attr.simpleValue) +"</pre></div>",
				"</div>",
				"<div class='complexValue attributeOtherValue'>",
					"complex value",
					"<div class='valueHoverTitle'><pre>" + formatJsCode('', attr.complexValue) + "</pre></div>",
				"</div></div></td><td>",
				attr.unitPost,
			"</td></tr></tbody></table></div>"].join('');
		}).join('');
		// parser.parse(dom.byId('attributesNumberInner'));
		query('.attributeOtherValue', 'attributesOtherInner').on('click', function(evt){
			var node = this,
				v = domClass.contains(node, 'simpleValue')? 'simpleValue' : 'complexValue',
				siblingNode = this.previousSibling? this.previousSibling : this.nextSibling;
			
			domClass.toggle(node, 'valueSelected', true);
			domClass.toggle(siblingNode, 'valueSelected', false);
			
			var n = node.parentNode;
			console.log('n is', n);
			while(!domClass.contains(n, 'attributeItem')){
				n = n.parentNode;
			}
			
			var attr = attrsByName[n.getAttribute('data-attr-name')];
			// domClass.toggle(n, 'attributeItemUsed', attr.curlValue != attr.value);
			attr.curValue = attr[v];	
			console.log(attr);	
		});
		
		var attributeOtherValues = query('.attributeOtherValue');
		
		attributeOtherValues.on('mouseover', function(evt){
			var title = query('.valueHoverTitle', this)[0];
			title.style.display = 'block';
			title.style.top = '40px';
			title.style.left = '80px';
			console.log('this is the mouse hover');
		});
		
		attributeOtherValues.on('mouseout', function(evt){
			var title = query('.valueHoverTitle', this)[0];
			title.style.display = 'none';
			console.log('this is the mouse out');
		});		
		
		// attributeOtherValues.on('mousemove', function(evt){
		// });
	}

	function showModuleDetail(mod){
		query('#moduleDescIcon').style('background', 'url("' + mod.icon + '")');
		query('#moduleDescLabel').innerHTML('<a target="_blank" href="' + getApiDocUrl(mod.mid) + '">' +  mod.label + "</a>");
		query('#moduleDescName').innerHTML(mod.name);
		query('#moduleDescPathDetail').innerHTML(mod.mid + '.js');
		query('#moduleDescDetail').innerHTML(mod.description);
		query('#moduleDescApiDocUrlLabelDetail').innerHTML('<a target="_blank" href="' + getApiDocUrl(mod.mid) + '">' +  getApiDocUrl(mod.mid) + "</a>");
		var deps = array.map(mod.deps, function(dep){
			return ['<span class="moduleDescDependItem">', dep, '</span>'].join('');
		});
		query('#moduleDescDependDetail').innerHTML(deps.length ? deps.join('') : 'None');
	}
	
	function getApiDocUrl(mid){
		var curVersion = '1.2';
		var prefix = 'http://oria.github.io/gridx/apidoc/index.html';
		return prefix + '#' + curVersion + '/' + mid;
	}

	function useModule(itemNode){
		itemNode.setAttribute('title', 'click to show description, double click to remove');
		var mod = modules[itemNode.getAttribute('data-mod-idx')];
		array.forEach(mod.deps, function(dep){
			if(!query('[data-mod-name="' + dep + '"].moduleItem', 'modulesLoaded').length){
				var n = query('[data-mod-name="' + dep + '"].moduleItem', 'modulesAvailable')[0];
				if(n){
					domClass.remove(n, 'moduleItemHidden');
					useModule(n);
				}
			}
		});
		domConstruct.place(itemNode, 'modulesLoaded');
		console.log(mod.module.prototype.name);
		var nodes = query('[data-attr-mod="' + mod.module.prototype.name + '"].attributeItem', 'attributesConfig');
		
		nodes.forEach(function(node){	//other attribute are able to use once the mod is used
			if(domClass.contains(node, 'attributeOtherItem')){
				domClass.add(node, 'attributeItemUsed');
			}
		});
		nodes.removeClass('attributeItemDisabled');
	}
	
	function delModule(itemNode){
		itemNode.setAttribute('title', 'click to show description, double click to use');
		var name = itemNode.getAttribute('data-mod-name');
		query('.moduleItem', 'modulesLoaded').filter(function(n){
			var mod = modules[n.getAttribute('data-mod-idx')];
			return array.indexOf(mod.deps, name) >= 0;
		}).forEach(delModule);
		domConstruct.place(itemNode, 'modulesAvailable');
		if(!query('[data-mod-name="' + name + '"].moduleItem', 'modulesLoaded').length){
			query('[data-attr-mod="' + name + '"].attributeItem', 'attributesConfig').
				addClass('attributeItemDisabled').
				removeClass('attributeItemUsed');
		}
	}

	function createStore(){
		var rowCount = registry.byId('rowCountInput').get('value');
		var isList = domClass.contains('listDataBtn', 'storeConfigBtnSelected');
		var maxLevel = parseInt(registry.byId('levelInput').get('value'), 10);
		var maxChildrenCount = registry.byId('childrenCountInput').get('value');
		var store = new Store({
			data: !isList ? data(rowCount, maxLevel, maxChildrenCount).items : data(rowCount).items
		});
		if(!isList){
			store.hasChildren = function(id, item){
				return item.children && item.children.length;
			};
			store.getChildren = function(item){
				return item.children || [];
			};
		}
		return store;
	}
	function gatherColumns(){
		otherModules = {};
		var cols = query('.columnBar', 'columnsContainer').map(function(columnBarNode){
			var colBar = registry.byNode(columnBarNode).getColumn();
			if(colBar.menu && typeof colBar.menu == 'string'){	//FIX ME: ugly
				console.log('filter menu module is: ', colBar.menu);
				var config;
				if(colBar.menu.indexOf('AZFilterMenu') >= 0){
					config = {};
				}
				if(colBar.menu.indexOf('NumberFilterMenu') >= 0){
					config = {numbers: [0, 3, 6, 10]};
				}
				require([colBar.menu], function(m){
					colBar.menu = new m(config);
				});
				otherModules['gridx/modules/Filter'] = true;
			}
			return colBar;
			// return colBar = registry.byNode(columnBarNode).getColumn();
		});
		cols.sort(function(col1, col2){
			return col1.index - col2.index;
		});
		
		
		return cols;
	}
	function gatherModules(){
		var mods = query('.moduleItem', 'modulesLoaded').map(function(modNode){
			return modules[modNode.getAttribute('data-mod-idx')];
		});
		
		for(var i in otherModules){
			array.forEach(modules, function(module){
				if(module.mid == i){
					if(mods.indexOf(module) < 0){
						mods.push(module);
					}
				}
			});
		}
		
		return mods;
	}
	function gatherAttributes(){
		var validAttr = query('.attributeItemUsed', 'attributesConfig').map(function(attrNode){
			var label = attrNode.getAttribute('data-attr-name');
			return attrsByName[label];
		});
		
		
		/*var curMids = query('.moduleItem', 'modulesLoaded').map(function(modNode){
			return modNode.getAttribute('data-mod-mid');
		});
		
		
		for(var label in attrsByName){
			if(attrsByName[label].type == 'shadow' && curMids.indexOf(attrsByName[label].binding) >= 0){
				validAttr.push(attrsByName[label]);
			}
		}*/
		return validAttr;
	}
	grid = null;
	function createGrid(){
		if(grid){
			try{
			grid.destroy();
			}catch(e){
				alert(e);
				console.error(e);
			}
			console.log('destroy ok');
		}
		var store = createStore();
		var columns = gatherColumns();
		// console.log('columns is: ', columns);
		var mods = gatherModules();
		var attributes = gatherAttributes();
		var isClient = domClass.contains('clientStoreBtn', 'storeConfigBtnSelected');
		var cfg = {
			cacheClass: isClient ? 'gridx/core/model/cache/Sync' : 'gridx/core/model/cache/Async',
			store: store,
			structure: columns,
			modules: array.map(mods, function(mod){
				return mod.mid;
			})
		};
		array.forEach(attributes, function(attr){
				cfg[attr.label] = lang.clone(attr.curValue);	//clone attribute, some module will write the attribute
																//don't want the attr change because we need to show it 
																//in the code way.
			// }
		});
		// console.log(cfg);
		grid = new Grid(cfg);
		grid.placeAt('gridContainer');
		grid.startup();
	}
	function updateJSCode(){
		var columns = gatherColumns();
		var mods = gatherModules();
		var attributes = gatherAttributes();
		console.log(attributes);
		var i, j = 0, sb = [
			'require([\n',
				'\t"gridx/Grid",\n',
				'\t"gridx/core/model/cache/'
		];
		var isAsync = domClass.contains('serverStoreBtn', 'storeConfigBtnSelected');
		sb.push(isAsync ? 'Async' : 'Sync', '",\n');

		[].push.apply(sb, array.map(mods, function(mod){
			return ['\t"', mod.mid, '",\n'].join('');
		}));
		sb.push(isAsync ? '\t"dojo/store/JsonRest",\n' : '\t"dojo/store/Memory",\n',
				'\t"dojo/domReady!"\n',
			'], function(Grid, Cache, \n');
		array.forEach(mods, function(mod){
			++j;
			if(j % 3 == 1){
				sb.push('\t');
			}
			sb.push(mod.name, ', ');
			if(j % 3 === 0){
				sb.push('\n');
			}
		});
		sb.push('Store){\n',
				'\n',
				'\t//Create store here...\n',
				'\t//var store = new Store(...);\n',
				'\n',
				'\tvar grid = new Grid({\n',
					'\t\tstore: store,\n',
					'\t\tcacheClass: Cache,\n',
					'\t\tstructure: [\n');
		[].push.apply(sb, array.map(columns, function(col, i, cols){
			return [
				'\t\t\t{ id: "', col.id,
				'", field: "', col.field,
				'", name: "', col.name,
				col.width == 'auto' ? '"' : '", width: "' + col.width + '"',
			' }', i == cols.length - 1 ? '' : ',', '\n'].join('');
		}));
		sb.push('\t\t],\n');
		[].push.apply(sb, array.map(attributes, function(attr){
			return ['\t\t', attr.label, ': ', 
					//lang.isObject(attr.curValue)? JSON.stringify(attr.curValue) : attr.curValue, 
					formatJsCode('\t\t', attr.curValue),
					',\n'].join('');
		}));
		sb.push('\t\tmodules: [\n');
		[].push.apply(sb, array.map(mods, function(mod){
			return ['\t\t\t', mod.name, ',\n'].join('');
		}));
		sb.push('\t\t]\n',
				'\t});\n',
				'\n',
				'\tgrid.placeAt("gridContainer");\n',
				'\tgrid.startup();\n',
			'});');
		dom.byId('jscode').innerHTML = sb.join('');
	}
	function updateHTMLCode(){
		var i, sb = [
			'&lt;script type="text/javascript"&gt;\n',
				'\trequire([\n',
					'\t\t"gridx/Grid",\n',
					'\t\t"gridx/core/model/cache/'
		];
		var columns = gatherColumns();
		var mods = gatherModules();
		var attributes = gatherAttributes();
		var isAsync = domClass.contains('serverStoreBtn', 'storeConfigBtnSelected');
		sb.push(isAsync ? 'Async' : 'Sync', '",\n');
		[].push.apply(sb, array.map(mods, function(mod){
			return ['\t\t"', mod.mid, '",\n'].join('');
		}));
		sb.push(isAsync ? '\t\t"dojo/store/JsonRest"\n' : '\t\t"dojo/store/Memory"\n',
				'\t], function(){\n',
					'\t\t//Create store here.\n',
					'\t\t//store = ...\n',
				'\t});\n',
			'&lt;/script&gt;\n',
			'......\n',
			'&lt;div data-dojo-type="gridx/Grid"\n',
				'\tdata-dojo-props="\n',
				'\t\tstore: store,\n',
				'\t\tcacheClass: \'gridx/core/model/cache/',
				isAsync ? 'Async' : 'Sync',
				'\',\n',
				'\t\tstructure: [\n');
		[].push.apply(sb, array.map(columns, function(col, i, cols){
			return [
				'\t\t\t{ id: \'', col.id, 
				'\', field: \'', col.field, 
				'\', name: \'', col.name, 
				'\', width: \'', col.width, 
				'\' }', i == cols.length - 1 ? '' : ',', 
			'\n'].join('');
		}));

		sb.push('\t\t],\n');
		[].push.apply(sb, array.map(attributes, function(attr){
			return ['\t\t', attr.label, ': ', formatJsCode('\t\t', attr.curValue), ',\n'].join('');
		}));
		sb.push('\t\tmodules: [\n');
		[].push.apply(sb, array.map(mods, function(mod){
			return ['\t\t\t\'', mod.mid, '\',\n'].join('');
		}));
		sb.push('\t\t]\n',
			'"&gt;&lt;/div&gt;\n');

		dom.byId('htmlcode').innerHTML = sb.join('');
	}
	function filterModules(){
		var filter = registry.byId('modulesFilterInput').get('value').toLowerCase();
		query('.moduleItem', 'modulesAvailable').forEach(function(node){
			var mod = modules[node.getAttribute('data-mod-idx')];
			if(mod.label.toLowerCase().search(filter) >= 0 ||
				mod.name.toLowerCase().search(filter) >= 0 ||
				mod.description.toLowerCase().search(filter) >= 0 ||
				mod.mid.toLowerCase().search(filter) >= 0){
				domClass.remove(node, 'moduleItemHidden');
			}else{
				domClass.add(node, 'moduleItemHidden');
			}
		});
	}
	function filterAttributes(){
		var filter = registry.byId('attributesFilterInput').get('value').toLowerCase();
		query('.attributeItem', 'attributesConfig').forEach(function(node){
			var label = node.getAttribute('data-attr-name');
			var attr = attrsByName[label];
			if(!domClass.contains(node, 'attributeItemDisabled') && (
					attr.mod.toLowerCase().search(filter) >= 0 ||
					attr.name.toLowerCase().search(filter) >= 0 ||
					attr.description.toLowerCase().search(filter) >= 0 ||
					(attr.unitPre && attr.unitPre.toLowerCase().search(filter) >= 0) ||
					(attr.unitPost && attr.unitPost.toLowerCase().search(filter) >= 0))){
				domClass.remove(node, 'attributeItemHidden');
			}else{
				domClass.add(node, 'attributeItemHidden');
			}
		});

	}
	function initialClip(){
		var clip = new ZeroClipboard.Client();
		clip.setText(''); // will be set later on mouseDown
		clip.setHandCursor(true);
		clip.setCSSEffects(true);
		clip.addEventListener('mouseOver', function(client){
			domClass.add(dom.byId('clipBtn'), 'clipBtnHover');
		});
		clip.addEventListener('mouseOut', function(client){
			domClass.remove(dom.byId('clipBtn'), 'clipBtnHover');
		});
		clip.addEventListener('mouseDown', function(client){
			domClass.add(dom.byId('clipBtn'), 'clipBtnDown');
			if(domClass.contains(dom.byId('jscodeContainer'), 'codeHidden')){
				clip.setText(dom.byId('htmlcode').innerHTML);
			}else{
				clip.setText(dom.byId('jscode').innerHTML);
			}
		});
		clip.addEventListener('mouseUp', function(client){
			domClass.remove(dom.byId('clipBtn'), 'clipBtnDown');
		});
		clip.glue('clipBtn');
	}
	
function formatJsCode(prefix, obj){
	var html = '',
	htmlAry = [];
	if(typeof obj == 'object'){
		if(obj instanceof Array){
			html += '[\n';
			for(var i in obj){
				htmlAry.push(prefix + '\t' +  formatJsCode(prefix + '\t', obj[i]));
			}
			html += htmlAry.join(',\n');
			html += '\n' + prefix + ']';
		}else{
			html += '{\n';
			for(var i in obj){
				htmlAry.push(prefix + '\t' +  i + ': ' + formatJsCode(prefix + '\t', obj[i]));
			}
			html += htmlAry.join(',\n');
			html += '\n' + prefix + '}'; 
		}
	}else{
		html = obj;
	}
	return html; 
}

	addColumnBar(null, {
		field: 'name',
		name: 'Name',
		width: [50, 'percent']
	});
	addColumnBar(null, {
		field: 'genre',
		name: 'Genre'
	});
	addColumnBar(null, {
		field: 'composer',
		name: 'Composer'
	});
	addColumnBar(null, {
		field: 'year',
		name: 'Year'
	});

	loadModules();
	loadAttributes();

	dom.byId('modulesLoadedCover').style.display = 'none';
	useModule(query('[data-mod-mid="gridx/modules/VirtualVScroller"].moduleItem', 'modulesConfig')[0]);
	useModule(query('[data-mod-mid="gridx/modules/ColumnResizer"].moduleItem', 'modulesConfig')[0]);
	useModule(query('[data-mod-mid="gridx/modules/extendedSelect/Row"].moduleItem', 'modulesConfig')[0]);
	useModule(query('[data-mod-mid="gridx/modules/SingleSort"].moduleItem', 'modulesConfig')[0]);

	query('[data-attr-name="selectRowTriggerOnCell"].attributeItem', 'attributesConfig').forEach(function(n){
		domClass.toggle(n, 'attributeItemUsed', true);
		query('.attributeBoolBtn', n).addClass('attributeBoolOn');
		attrsByName["selectRowTriggerOnCell"].curValue = true;
	});

	ready(function(){
		initialClip();
		storeSummary();
		columnsSummary();
		modulesSummary();
		attributesSummary();

		var moduleFilter = registry.byId('modulesFilterInput');
		var mfhandler = null;
		moduleFilter.connect(moduleFilter, 'onInput', function(){
			if(mfhandler){
				clearTimeout(mfhandler);
			}
			mfhandler = setTimeout(function(){
				mfhandler = null;
				filterModules();
			}, 100);
		});
		var attributeFilter = registry.byId('attributesFilterInput');
		var afhandler = null;
		attributeFilter.connect(attributeFilter, 'onInput', function(){
			if(afhandler){
				clearTimeout(afhandler);
			}
			afhandler = setTimeout(function(){
				afhandler = null;
				filterAttributes();
			}, 100);
		});

	});

});
