define([
	"dojo/_base/declare",
	"dojo/_base/event",
	"dijit/registry",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/keys",
	"../core/_Module",
	"./HeaderRegions"
], function(declare, event, registry, domConstruct, domClass, keys, _Module){

/*=====
	var HeaderMenu = declare(_Module, {
		// summary:
		//		module name: headerMenu.
		//		Add a dropdown menu button on header cell.
		// description:
		//		Add a dropdown menu button on the header of any column that has a "menu" defined in structure.
		//		The "menu" is a dijit/Menu widget or its ID. It can provide a "bindGrid" function with signature of
		//		function(grid, column), so that some initialization work can be done when this menu is bound to grid.
	});

	HeaderMenu.__ColumnDefinition = declare([], {
		// menu: String|dijit.Menu
		//		Any dijit.Menu widget or its ID.
		menu: null
	});

	return HeaderMenu;
=====*/

	return declare(_Module, {
		name: 'headerMenu',

		forced: ['headerRegions'],

		preload: function(){
			var t = this,
				grid = t.grid;
			grid.headerRegions.add(function(col){
				var menu = col.menu && registry.byId(col.menu);
				if(menu){
					var btn = domConstruct.create('div', {
						className: 'gridxHeaderMenuBtn',
						tabIndex: -1,
						innerHTML: '<span class="gridxHeaderMenuBtnInner">&#9662;</span>&nbsp;'
					});
					domClass.add(menu.domNode, 'gridxHeaderMenu');
					menu.bindDomNode(btn);
					t.connect(btn, 'onkeydown', function(e){
						if(e.keyCode == keys.ENTER){
							event.stop(e);
							menu._scheduleOpen(btn, undefined, undefined, btn);
						}
					});
					if(menu.bindGrid){
						menu.bindGrid(grid, col);
					}
					//handle menu close
					t.aspect(menu, 'onClose', function(e){
						grid.headerRegions._doFocus(e);
					});
					
					return btn;
				}
			}, 0, 1);
		}
	});
});
