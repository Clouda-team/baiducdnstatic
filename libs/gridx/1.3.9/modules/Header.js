define([
/*====="../core/Column", =====*/
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/_base/array",
	"dojo/dom-construct",
	"dojo/dom-class",
	"dojo/dom-geometry",
	"dojo/query",
	"dojo/_base/sniff",
	"dojo/on",
	"dojo/keys",
	"../core/_Module"
], function(/*=====Column, =====*/declare, lang, array, domConstruct, domClass, domGeometry, query, has, on, keys, _Module){

/*=====
	Column.headerNode = function(){
		// summary:
		//		Get header node of the column.
		// returns:
		//		The header node of this column.
	};

	return declare(_Module, {
		// summary:
		//		module name: header.
		//		The header UI of grid
		// description:
		//		This module is in charge of the rendering of the grid header. But it should not manage column width,
		//		which is the responsibility of ColumnWidth module.

		// hidden: Boolean
		//		Whether the header UI should be hidden.
		hidden: false,

		getHeaderNode: function(id){
			// summary:
			//		Get the header DOM node by column ID.
			// id: String
			//		The column ID
			// returns:
			//		The header DOM node
		},

		refresh: function(){
			// summary:
			//		Re-build the header UI.
		},

		onRender: function(){
			// summary:
			//		Fired when the header is rendered.
			// tags:
			//		callback
		},

		onMoveToHeaderCell: function(){
			// summary:
			//		Fired when the focus is moved to a header cell by keyboard.
			// tags:
			//		callback
		}
	});
=====*/

	return declare(_Module, {
		name: 'header',

		constructor: function(){
			var t = this,
				dn = t.domNode = domConstruct.create('div', {
					'class': 'gridxHeaderRow',
					role: 'presentation'
				}),
				inner = t.innerNode = domConstruct.create('div', {
					'class': 'gridxHeaderRowInner',
					role: 'row'
				});
			t.grid._connectEvents(dn, '_onEvent', t);
		},

		preload: function(args){
			var t = this,
				g = t.grid;
			t.domNode.appendChild(t.innerNode);
			t._build();
			g.headerNode.appendChild(t.domNode);
			//Add this.domNode to be a part of the grid header
			g.vLayout.register(t, 'domNode', 'headerNode');
			t.aspect(g, 'onHScroll', '_onHScroll');
			//FIXME: sometimes FF will remember the scroll position of the header row, so force aligned with body.
			//Does not occur in any other browsers.
			if(has('ff')){
				t.aspect(g, 'onModulesLoaded', function(){
					t._onHScroll(t._scrollLeft);
				});
			}
			if(g.columnResizer){
				t.aspect(g.columnResizer, 'onResize', function(){
					if(g.hScrollerNode.style.display == 'none'){
						t._onHScroll(0);
					}
				});
			}
			t.aspect(g, 'onHeaderCellMouseOver', function(){
				g.vLayout.reLayout();
			});
			t.aspect(g, 'onHeaderCellMouseOut', function(){
				g.vLayout.reLayout();
				//When mouse leave a very narrow nested sorting header, sometimes this reLayout happens before the header height change.
				//So set a timeout to ensure this gets relayout.
				//FIXME: need investigate why
				setTimeout(function(){
					g.vLayout.reLayout();
				}, 0);
			});
			t._initFocus();
		},

		load: function(){
			this.onRender();
			this.loaded.callback();
		},

		destroy: function(){
			this.inherited(arguments);
			domConstruct.destroy(this.domNode);
		},

		columnMixin: {
			headerNode: function(){
				return this.grid.header.getHeaderNode(this.id);
			}
		},

		//Public-----------------------------------------------------------------------------
		hidden: false,

		getHeaderNode: function(id){
			return query("[colid='" + this.grid._escapeId(id) + "']", this.domNode)[0];
		},

		refresh: function(){
			this._build();
			this._onHScroll(this._scrollLeft);
			this.grid.vLayout.reLayout();
			this.onRender();
		},

		onRender: function(){},

		onMoveToHeaderCell: function(){},
		
		//Private-----------------------------------------------------------------------------
		_scrollLeft: 0,

		_build: function(){
			var t = this,
				g = t.grid,
				f = g.focus,
				sb = ['<table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr>'];
			array.forEach(g._columns, function(col){
				col._domId = (g.id + '-' + col.id).replace(/\s+/, '');
				sb.push('<td id="', col._domId,
					'" role="columnheader" aria-readonly="true" tabindex="-1" colid="', col.id,
					'" class="gridxCell ',
					f && f.currentArea() == 'header' && col.id == t._focusHeaderId ? t._focusClass : '',
					(lang.isFunction(col.headerClass) ? col.headerClass(col) : col.headerClass) || '',
					'" style="width:', col.width, ';min-width:', col.width, ';',
					g.getTextDirStyle(col.id, col.name),
					(lang.isFunction(col.headerStyle) ? col.headerStyle(col) : col.headerStyle) || '',
					'"><div class="gridxSortNode">',
					(lang.isFunction(col.headerFormatter) ? col.headerFormatter(col) : col.name) || '',
					'</div></td>');
			});
			sb.push('</tr></table>');
			t.innerNode.innerHTML = sb.join('');
			domClass.toggle(t.domNode, 'gridxHeaderRowHidden', t.arg('hidden'));
		},

		_onHScroll: function(left){
			if((has('webkit') || has('ie') < 8) && !this.grid.isLeftToRight()){
				left = this.innerNode.scrollWidth - this.innerNode.offsetWidth - left;
			}
			this.innerNode.scrollLeft = this._scrollLeft = left;
		},

		_onEvent: function(eventName, e){
			var g = this.grid,
				evtCell = 'onHeaderCell' + eventName,
				evtRow = 'onHeader' + eventName;
				this._decorateEvent(e);
				
			if(e.columnIndex >= 0){
				g[evtCell](e);
				on.emit(e.target, 'headerCell' + eventName, e);
			}
			g[evtRow](e);
			on.emit(e.target, 'header' + eventName, e);
		},

		_decorateEvent: function(e){
			var n = query(e.target).closest('.gridxCell', this.domNode)[0],
				c = n && this.grid._columnsById[n.getAttribute('colid')];
			if(c){
				e.headerCellNode = n;
				e.columnId = c.id;
				e.columnIndex = c.index;
			}
		},

		// Focus
		_focusHeaderId: null,

		_focusClass: "gridxHeaderCellFocus",

		_initFocus: function(){
			var t = this, g = t.grid;
			if(g.focus){
				g.focus.registerArea({
					name: 'header',
					priority: 0,
					focusNode: t.innerNode,
					scope: t,
					doFocus: t._doFocus,
					doBlur: t._blurNode,
					onBlur: t._blurNode,
					connects: g.touch ? [
						t.aspect(g, 'onHeaderCellTouchStart', function(evt){
							domClass.add(evt.headerCellNode, t._focusClass);
						}),
						t.aspect(g, 'onHeaderCellTouchEnd', function(evt){
							domClass.remove(evt.headerCellNode, t._focusClass);
						})
					] : [
						t.aspect(g, 'onHeaderCellKeyDown', '_onKeyDown'),
						t.connect(g, 'onHeaderCellMouseDown', function(evt){
							t._focusNode(t.getHeaderNode(evt.columnId));
						})
					]
				});
			}
		},

		_doFocus: function(evt, step){
			var t = this;
			if(!t.hidden){
				var n = t._focusHeaderId && t.getHeaderNode(t._focusHeaderId),
					r = t._focusNode(n || query('.gridxCell', t.domNode)[0]);
				t.grid.focus.stopEvent(r && evt);
				return r;
			}
			return false;
		},
		
		_focusNode: function(node){
			if(node){
				var t = this, g = t.grid,
					fid = t._focusHeaderId = node.getAttribute('colid');
				if(fid){
					t._blurNode();
					
					g.body._focusCellCol = g._columnsById[fid].index;

					domClass.add(node, t._focusClass);
					//If no timeout, the header and body may be mismatch.
					setTimeout(function(){
						//For webkit browsers, when moving column using keyboard, the header cell will lose this focus class,
						//although it was set correctly before this setTimeout. So re-add it here.
						if(has('webkit')){
							domClass.add(node, t._focusClass);
						}
						node.focus();
						if(has('ie') < 8){
							t.innerNode.scrollLeft = t._scrollLeft;
						}
						if(g.hScroller){
							g.hScroller.scrollToColumn(fid, t.innerNode);
						}
					}, 0);

					return true;
				}
			}
			return false;
		},

		_blurNode: function(){
			var t = this, n = query('.' + t._focusClass, t.innerNode)[0];
			if(n){
				domClass.remove(n, t._focusClass);
			}
			return true;
		},

		_onKeyDown: function(evt) {
			var t = this, g = t.grid, col,
				dir = g.isLeftToRight() ? 1 : -1,
				delta = evt.keyCode == keys.LEFT_ARROW ? -dir : dir;
			if(t._focusHeaderId && !g._isCtrlKey(evt) && !evt.altKey &&
				(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW)){
				//Prevent scrolling the whole page.
				g.focus.stopEvent(evt);
				col = g._columnsById[t._focusHeaderId];
				col = g._columns[col.index + delta];
				if(col){
					t._focusNode(t.getHeaderNode(col.id));
					t.onMoveToHeaderCell(col.id, evt);
				}
			}
		}
	});
});
