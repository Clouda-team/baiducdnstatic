define([
	"dojo/_base/declare",
	"dojo/_base/Deferred",
	"dojo/_base/window",
	"dojo/query",
	"dojo/dom-geometry",
	"../core/_Module"
], function(declare, Deferred, win, query, domGeometry, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: autoScroll.
		//		Automatically scroll the grid body when mouse is on the edge of grid.
		//		Useful for extended selection or drag and drop.
		//		This is a registered module, so if it is depended by other modules, no need to declare it when creating grid.

		enabled: false,
		vertical: true,
		horizontal: true,
		margin: 20
	});
=====*/

	return _Module.register(
	declare(_Module, {

		name: 'autoScroll',

		constructor: function(){
			this.connect(win.doc, 'mousemove', '_onMouseMove');
		},

		//Public ---------------------------------------------------------------------
		enabled: false,

		vertical: true,

		horizontal: true,

		margin: 30,

		rowStep: 1,

		columnStep: 1,

		//Private ---------------------------------------------------------------------

		_timeout: 300,

		_onMouseMove: function(e){
			var t = this;
			if(t.arg('enabled')){
				var d1, d2, g = t.grid, m = t.arg('margin'), 
					pos = domGeometry.position(g.bodyNode);
				if(t.arg('vertical') && g.vScroller){
					d1 = e.clientY - pos.y - m;
					d2 = d1 + 2 * m - pos.h;
					t._vdir = d1 < 0 ? d1 : (d2 > 0 ? d2 : 0);
				}
				if(t.arg('horizontal') && g.hScroller){
					d1 = e.clientX - pos.x - m;
					d2 = d1 + 2 * m - pos.w;
					t._hdir = d1 < 0 ? d1 : (d2 > 0 ? d2 : 0);
				}
				if(!t._handler){
					t._scroll();
				}
			}
		},

		_scroll: function(){
			var t = this;
			if(t.arg('enabled')){
				var dir,
					needScroll,
					g = t.grid,
					v = t._vdir,
					h = t._hdir;
				if(t.arg('vertical') && v){
					dir = v > 0 ? 1 : -1;
					var rowNode = t._findNode(g.bodyNode.childNodes, function(node){
						if(dir > 0){
							if(node.offsetTop >= g.bodyNode.scrollTop + g.bodyNode.offsetHeight){
								return -1;
							}else if(node.offsetTop + node.offsetHeight < g.bodyNode.scrollTop + g.bodyNode.offsetHeight){
								return 1;
							}
							return 0;
						}else{
							if(node.offsetTop > g.bodyNode.scrollTop){
								return -1;
							}else if(node.offsetTop + node.offsetHeight <= g.bodyNode.scrollTop){
								return 1;
							}
							return 0;
						}
					});
					if(rowNode){
						var vidx = parseInt(rowNode.getAttribute('visualindex'), 10);
						needScroll = g.vScroller.scrollToRow(vidx + dir * t.arg('rowStep'));
					}
				}
				if(t.arg('horizontal') && h){
					dir = h > 0 ? 1 : -1;
					var headerNode = t._findNode(query('.gridxCell', g.header.domNode), function(node){
						if(dir > 0){
							if(node.offsetLeft >= g.hScrollerNode.scrollLeft + g.hScrollerNode.offsetWidth){
								return -1;
							}else if(node.offsetLeft + node.offsetWidth < g.hScrollerNode.scrollLeft + g.hScrollerNode.offsetWidth){
								return 1;
							}
							return 0;
						}else{
							if(node.offsetLeft > g.hScrollerNode.scrollLeft){
								return -1;
							}else if(node.offsetLeft + node.offsetHeight <= g.vScrollerNode.scrollLeft){
								return 1;
							}
							return 0;
						}
					});
					if(headerNode){
						var col = g._columnsById[headerNode.getAttribute('colid')];
						var colIdx = col.index + dir * t.arg('columnStep');
						if(colIdx >= g._columns.length){
							colIdx = g._columns.length - 1;
						}else if(colIdx < 0){
							colIdx = 0;
						}
						var nextCol = g._columns[colIdx];
						g.hScroller.scrollToColumn(nextCol.id);
						needScroll = needScroll || 1;
					}
				}
				t._handler = needScroll;
				if(needScroll){
					//scroll to row can be async
					Deferred.when(needScroll, function(){
						t._handler = setTimeout(function(){
							t._scroll();
						}, t._timeout);
					});
				}
			}else{
				delete t._handler;
			}
		},

		_findNode: function(nodes, checker){
			var start = 0,
				end = nodes.length,
				idx = Math.floor((start + end) / 2);
			while(start < end && start != idx){
				var dir = checker(nodes[idx]);
				if(dir < 0){
					end = idx;
					idx = Math.floor((start + end) / 2);
				}else if(dir > 0){
					start = idx;
					idx = Math.floor((start + end) / 2);
				}else{
					break;
				}
			}
			return nodes[idx];
		}
	}));
});
