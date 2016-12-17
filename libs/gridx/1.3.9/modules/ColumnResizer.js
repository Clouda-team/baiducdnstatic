define([
	"dojo/_base/declare",
	"dojo/_base/window",
	"dojo/_base/event",
	"dojo/dom",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/dom-construct",
	"dojo/dom-geometry",
	"dojo/keys",
	"../support/query",
	"dojo/_base/sniff",
	"../core/_Module"
//    "dojo/NodeList-traverse"
], function(declare, win, event, dom, domStyle, domClass, domConstruct, domGeometry, keys, query, has, _Module){

/*=====
	Column.setWidth = function(width){
		// summary:
		//		Set width of the target column
	};

	return declare(_Module, {
		// summary:
		//		module name: columnResizer.
		//		Column Resizer machinery.
		// description:
		//		This module provides a way to resize column width. 
		
		// minWidth: Integer
		//		min column width in px
		minWidth: 20,

		detectWidth: 5,

		step: 2,

		setWidth: function(olId, width){
			// summary:
			//		Set width of the target column
		},

		onResize: function(colId, newWidth, oldWidth){
		}
	});
=====*/

	return declare(_Module, {
		name: 'columnResizer',

		load: function(){
			var t = this,
				g = t.grid;
			t.batchConnect(
				[g.header.domNode, 'onmousemove', '_mousemove'],
				[g, 'onHeaderMouseOut', '_mouseout'],
				[g, 'onHeaderMouseDown', '_mousedown', t, t.name],
				[g, 'onHeaderKeyDown', '_keydown'],
				[win.doc, 'onmousemove', '_updateResizer'],
				[win.doc, 'onmouseup', '_mouseup']);
			t.loaded.callback();
		},

		columnMixin: {
			setWidth: function(width){
				this.grid.columnResizer.setWidth(this.id, width);
			}
		},

		//Public---------------------------------------------------------------------
		minWidth: 20,

		detectWidth: 5,

		step: 2,

		setWidth: function(colId, width){
			var t = this,
				g = t.grid,
				col = g._columnsById[colId];
			if(col){
				var headerNode = g.header.getHeaderNode(colId),
					headerNodeStyle = headerNode.style,
					oldWidth = domStyle.get(headerNode, 'width'),
					minWidth = t.arg('minWidth'),
					padExtents = domGeometry.getPadExtents(headerNode),
					pads = padExtents.l + padExtents.r,
					cols = g._columns;

				width = parseInt(width, 10);
				if(width < minWidth){
					width = minWidth;
				}
				headerNodeStyle.width = width + 'px';
				headerNodeStyle.minWidth = width + 'px';
				headerNodeStyle.maxWidth = width + 'px';
				width = headerNode.clientWidth - pads;
				//set again in case actual effect is different from what we expect.
				headerNodeStyle.width = width + 'px';
				headerNodeStyle.minWidth = width + 'px';
				headerNodeStyle.maxWidth = width + 'px';
				//Use actual width as our new column width
				col.width = width + 'px';
				for(var i = 0, len = cols.length; i < len; ++i){
					cols[i].declaredWidth = cols[i].width;
				}
				query('[colid="' + g._escapeId(colId) + '"]', g.bodyNode).forEach(function(cell){
					var cs = cell.style;
					cs.width = width + 'px';
					cs.minWidth = width + 'px';
					cs.maxWidth = width + 'px';
				});
				g.body.onRender();
				g.hLayout.reLayout();
				g.vLayout.reLayout();
				t.onResize(colId, width, oldWidth);
			}
		},

		//Event--------------------------------------------------------------
		onResize: function(/* colId, newWidth, oldWidth */){},

		//Private-----------------------------------------------------------
		_mousemove: function(e){
			var t = this;
			if(!t._resizing && !t._ismousedown){
				var detectWidth = t.arg('detectWidth'),
					g = t.grid,
					ltr = g.isLeftToRight(),
					body = win.body(),
					flags = g._eventFlags;
				if(!query('.gridxCell', g.header.innerNode).some(function(cellNode){
					var pos = domGeometry.position(cellNode),
						x = ltr ? pos.x + pos.w : pos.x,
						col = g._columnsById[cellNode.getAttribute('colid')];
					//check if in resize range
					if(x - detectWidth <= e.clientX && x + detectWidth >= e.clientX){
						var n = query(e._target || e.target).closest('td', g.header.innerNode)[0],
							npos = n && domGeometry.position(n);
						if(n && (e.clientX <= npos.x + detectWidth || e.clientX >= npos.x + npos.w - detectWidth)){
							domClass.add(body, 'gridxColumnResizing');
							t._targetCell = cellNode;
							t._cellPos = pos;
							//Forbid anything else to happen when we are resizing a column!
							flags.onHeaderMouseDown = t.name;
							t._readyToResize = 1;//Intentional assignment
							return 1;
						}
					}
				})){
					//Not in resize region.
					flags.onHeaderMouseDown = undefined;
					domClass.remove(body, 'gridxColumnResizing');
				}
				flags.onHeaderCellMouseDown  = flags.onHeaderMouseDown;
			}
		},

		_mouseout: function(e){
			if(!this._resizing){
				var pos = domGeometry.position(this.grid.header.domNode);
				if(has('chrome')){
					for(var i in pos){
						pos[i] = Math.floor(pos[i]);
					}
				}
				
				if(e.clientY <= pos.y || e.clientY >= pos.y + pos.h ||
					e.clientX <= pos.x || e.clientX >= pos.x + pos.w){
					this._readyToResize = 0;
					domClass.remove(win.body(), 'gridxColumnResizing');
				}
			}
		},

		_mousedown: function(e){
			var t = this;
			if(t._readyToResize){
				//begin resize
				t._resizing = 1;
				var g = t.grid,
					refNode = query('.gridxCell', g.header.innerNode)[0];
				dom.setSelectable(g.domNode, false);
				win.doc.onselectstart = function(){
					return false;
				};
				t._containerPos = domGeometry.position(g.domNode);
				t._headerPos = domGeometry.position(g.header.domNode);
				t._padBorder = domGeometry.getMarginBox(refNode).w - domGeometry.getContentBox(refNode).w;
				t._initResizer();
				t._updateResizer(e);
				//Only mouse down, not moved yet
				t._moving = 0;
				//If column resizing should not cause any part of grid to be focused
				setTimeout(function(){
					g.focus.blur();
				}, 0);
			}else{
				t._ismousedown = 1;
			}
		},

		_initResizer: function(){
			var t = this,
				g = t.grid,
				hs = g.hScroller,
				n = hs && hs.container.offsetHeight ? hs.container : g.bodyNode,
				headerTop = g.header.domNode.offsetTop,
				h = n.parentNode.offsetTop + n.offsetHeight - g.header.domNode.offsetTop,
				resizer = t._resizer;
			if(!resizer){
				resizer = t._resizer = domConstruct.create('div', {
					className: 'gridxColumnResizer'
				}, g.domNode, 'last');
				t.connect(resizer, 'mouseup', '_mouseup');
			}
			var rs = resizer.style;
			rs.top = headerTop + 'px';
			rs.height = h + 'px';
			rs.display = 'block';
		},

		_updateResizer: function(e){
			var t = this;
			if(t._resizing){
				var ltr = t.grid.isLeftToRight(),
					minWidth = t.arg('minWidth') + t._padBorder,
					pos = t._cellPos,
					left = e.clientX,
					limit = ltr ? pos.x + minWidth : pos.x + pos.w - minWidth;
				if(ltr ? left < limit : left > limit){
					//Column is narrower than minWidth, the resizer should not move further.
					left = limit;
				}
				t._width = (ltr ? left - pos.x : pos.x + pos.w - left) - t._padBorder;
				//subtract the width of the border so that the resizer appears at center.
				t._resizer.style.left = (left - t._containerPos.x - 2) + 'px';
				//Now mouse is moving.
				t._moving = 1;
			}
		},

		_mouseup: function(e){
			var t = this;
			t._ismousedown = 0;
			if(t._resizing){
				//end resize
				t._resizing = t._readyToResize = 0;
				domClass.remove(win.body(), 'gridxColumnResizing');
				dom.setSelectable(t.grid.domNode, true);
				win.doc.onselectstart = null;
				//Only change width when mouse moved.
				if(t._moving){
					t._moving = 0;
					t.setWidth(t._targetCell.getAttribute('colid'), t._width + 'px');
				}
				t._resizer.style.display = 'none';
				//If mouse is still in header region, should get ready for next resize operation
				var x = e.clientX,
					y = e.clientY,
					headerPos = t._headerPos;
				if(x >= headerPos.x && x <= headerPos.x + headerPos.w &&
					y >= headerPos.y && y <= headerPos.y + headerPos.h){
					e._target = t._targetCell;
					t._mousemove(e);
				}
			}
		},

		_keydown: function(evt){
			var t = this,
				g = t.grid;
			//support keyboard to resize a column
			if((evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW) && g._isCtrlKey(evt) && evt.shiftKey){
				var colId = evt.columnId,
					cellNode = query('[colid="' + g._escapeId(colId) + '"].gridxCell', g.header.innerNode)[0],
					step = t.arg('step');
				step = evt.keyCode == keys.LEFT_ARROW ^ !!g.isLeftToRight() ? step : -step;
				t.setWidth(colId, domStyle.get(cellNode, 'width') + step);
				event.stop(evt);
			}
		}
	});
});
