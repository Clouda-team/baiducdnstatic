define([
	"dojo/_base/declare",
	"dojo/DeferredList",
	"../core/_Module"
], function(declare, DeferredList, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: vLayout.
		//		This module manages the vertical layout of all the grid UI parts.
		// description:
		//		When user creates a grid with a given height, it means the height of the whole grid,
		//		which includes grid body, toobar, pagination bar, headerbar, horizontal scrollerbar, etc.
		//		So the height of the grid body must be calculated out so as to layout the grid properly.
		//		This module calculates grid body height by collecting height from all the registered
		//		grid UI parts. The reLayout function in this module will be called everytime the
		//		grid size is changed.

		register: function(mod, nodeName, hookPoint, priority, deferReady){
			// summary:
			//		When the 'mod' is loaded or "ready", hook 'mod'['nodeName'] to grid['hookPoint'] with priority 'priority'
			// mod: Object
			//		The module object
			// nodeName: String
			//		The name of the node to be hooked. Must be able to be accessed by mod[nodeName]
			// hookPoint: String
			//		The name of a hook point in grid.
			// priority: Number?
			//		The priority of the hook node. If less than 0, then it's above the base node, larger than 0, below the base node.
		},

		reLayout: function(){
			// summary:
			//		Virtically re-layout all the grid UI parts.
		}
	});
=====*/

	return declare(_Module, {
		name: 'vLayout',

		preload: function(){
			var t = this,
				g = t.grid;
			t.connect(g, '_onResizeEnd', function(changeSize, ds){
				var d, dl = [];
				for(d in ds){
					dl.push(ds[d]);
				}
				new DeferredList(dl).then(function(){
					t.reLayout();
				});
			});
			if(g.autoHeight){
				t.connect(g.body, 'onRender', 'reLayout');
				t.connect(g.body, 'onEmpty', 'reLayout');
			}else{
				t.connect(g, 'setColumns', function(){
					setTimeout(function(){
						t.reLayout();
					}, 0);
				});
			}
		},
	
		load: function(args, startup){
			var t = this;
			startup.then(function(){
				if(t._defs && t._mods){
					new DeferredList(t._defs).then(function(){
						t._layout();
						t.loaded.callback();
					});
				}else{
					t.loaded.callback();
				}
			});
		},
	
		//Public ---------------------------------------------------------------------
		register: function(mod, nodeName, hookPoint, priority, deferReady){
			var t = this;
			t._defs = t._defs || [];
			t._mods = t._mods || {};
			t._mods[hookPoint] = t._mods[hookPoint] || [];
			t._defs.push(deferReady || mod.loaded);
			t._mods[hookPoint].push({
				p: priority || 0,
				mod: mod,
				nodeName: nodeName
			});
		},
		
		reLayout: function(){
			var t = this,
				freeHeight = 0,
				hookPoint, n;
			for(hookPoint in t._mods){
				n = t.grid[hookPoint];
				if(n){
					freeHeight += n.offsetHeight;
				}
			}
			t._updateHeight(freeHeight);
		},

		//Private-------------------------------------------------------------------------------
		_layout: function(){
			var freeHeight = 0,
				t = this,
				mods = t._mods,
				hookPoint, n, i, hp, mod, nodeName;
			for(hookPoint in mods){
				n = t.grid[hookPoint];
				if(n){
					hp = mods[hookPoint];
					hp.sort(function(a, b){
						return a.p - b.p;
					});
					for(i = 0; i < hp.length; ++i){
						mod = hp[i].mod;
						nodeName = hp[i].nodeName;
						if(mod && mod[nodeName]){
							n.appendChild(mod[nodeName]);
						}
					}
					freeHeight += n.offsetHeight;
				}
			}
			t._updateHeight(freeHeight);
		},

		_updateHeight: function(freeHeight){
			var g = this.grid,
				dn = g.domNode,
				ms = g.mainNode.style;
			if(g.autoHeight){
				function update(){
					var lastRow = g.bodyNode.lastChild,
						bodyHeight = lastRow ? lastRow.offsetTop + lastRow.offsetHeight : g.emptyNode.offsetHeight;
					dn.style.height = (bodyHeight + freeHeight) + 'px';
					ms.height = bodyHeight + "px";
				}
				update();
				g.vScroller.loaded.then(update);
			}else if(dn.clientHeight > freeHeight){
				//If grid height is smaller than freeHeight, IE will throw errer.
				ms.height = (dn.clientHeight - freeHeight) + "px";
			}
		}
	});
});
