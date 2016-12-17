define([
	"dojo/_base/declare",
	"dojo/dom-style",
	"dojo/_base/sniff",
	"dojo/_base/Deferred",
	"dojo/query",
	"dojox/html/metrics",
	"../core/_Module"
], function(declare, domStyle, has, Deferred, query, metrics, _Module){

/*=====
	return declare(_Module, {
		// summary:
		//		module name: hScroller.
		//		This module provides basic horizontal scrolling for grid

		scrollToColumn: function(colId){
			// summary:
			//	Scroll the grid to make a column fully visible.
		},

		refresh: function(){
			// summary:
			//		Refresh scroller itself to match grid body
		},

		scroll: function(left){
			// summary:
			//		Scroll the grid horizontally
			// tags:
			//		private
			// left: Number
			//		The scrollLeft value
		}
	});
=====*/

	return declare(_Module, {
		name: 'hScroller',

		constructor: function(){
			var t = this,
				g = t.grid,
				n = t.domNode = g.hScrollerNode;
			g._initEvents(['H'], ['Scroll']);
			t.container = n.parentNode;
			t.stubNode = n.firstChild;
		},

		preload: function(){
			var t = this,
				g = t.grid,
				n = g.hScrollerNode;
			if(!g.autoWidth){
				g.vLayout.register(t, 'container', 'footerNode', 0);
				n.style.display = 'block';
				t.aspect(g.columnWidth, 'onUpdate', 'refresh');
				t.connect(n, 'onscroll', '_onScroll');
				
				//In dod, tab focus in the dodNode will sometimes
				//scroll the bodyNode of gridx horizontally,
				//so need to syn scrollLeft with hscroller
				if(g.dod){
					t.connect(g.bodyNode, 'onscroll', function(){
						t.domNode.scrollLeft = g.bodyNode.scrollLeft;
					});
				}
				//FIX ME: has('ie')is not working under IE 11
				//use has('trident') here to judget IE 11
				if(has('ie') || has('trident')){
					//In IE8 the horizontal scroller bar will disappear when grid.domNode's css classes are changed.
					//In IE6 this.domNode will become a bit taller than usual, still don't know why.
					n.style.height = (metrics.getScrollbar().h + 2) + 'px';
				}
			}
		},
		
		//Public API-----------------------------------------------------------
		scroll: function(left){
			var dn = this.domNode;
			if((has('webkit') || has('ie') < 8) && !this.grid.isLeftToRight()){
				left = dn.scrollWidth - dn.offsetWidth - left;
			}
			if((has('ff')) && !this.grid.isLeftToRight() && left > 0){
				left = -left;
			}
			dn.scrollLeft = left;
		},
		
		scrollToColumn: function(colId, rowDiv){
			//when rowDiv has value, it's caused by move focus in Body.js
			//It's used only for column lock module
			
			var hNode = this.grid.header.innerNode,
				cells = query('.gridxCell', hNode),
				left = 0,
				right = 0,
				ltr = this.grid.isLeftToRight(),
				scrollLeft = this.domNode.scrollLeft;
			if(!ltr && (has('webkit') || has('ie') < 8)){
				scrollLeft = this.domNode.scrollWidth - scrollLeft - hNode.offsetWidth;//the value relative to col 0
			}

			if(rowDiv && this.grid.columnLock && this.grid.columnLock.count){
				//for column lock, row scrolls separately
				scrollLeft = rowDiv.scrollLeft;
				if(scrollLeft != this.domNode.scrollLeft){
					this.scroll(scrollLeft);
					return;
				}
			}

			scrollLeft = Math.abs(scrollLeft);
			//get cell's left border and right border position
			for(var i = 0; i < cells.length; i++){
				left = cells[i].offsetLeft;
				right = left + cells[i].offsetWidth;
				if(cells[i].getAttribute('colid') == colId){
					break;
				}
			}

			//if the cell is not visible, scroll to it
			if(ltr && left < scrollLeft){
				this.scroll(left);
			}else if(ltr && right > scrollLeft + hNode.offsetWidth){
				this.scroll(right - hNode.offsetWidth);
			}else if(!ltr && right > hNode.scrollWidth - scrollLeft){
				this.scroll(right - hNode.scrollWidth);
			}else if(!ltr && left + scrollLeft < hNode.scrollWidth - hNode.offsetWidth){
				this.scroll(hNode.scrollWidth - hNode.offsetWidth - left);
			}
		},
		
		refresh: function(){
			var t = this,
				g = t.grid,
				ltr = g.isLeftToRight(),
				lead = g.hLayout.lead,
				tail = g.hLayout.tail,
				w = (g.domNode.clientWidth || domStyle.get(g.domNode, 'width')) - lead - tail,
				bn = g.header.innerNode,
				pl = domStyle.get(bn, ltr ? 'paddingLeft' : 'paddingRight') || 0,	//TODO: It is special for column lock now.
				s = t.domNode.style,
				sw = bn.firstChild.offsetWidth + pl,
				oldDisplay = s.display,
				newDisplay = (sw <= w) ? 'none' : 'block';
				
			s[ltr ? 'marginLeft' : 'marginRight'] = lead + pl + 'px';
			s[ltr ? 'marginRight' : 'marginLeft'] = tail + 'px';
			//Ensure IE does not throw error...
			s.width = (w - pl < 0 ? 0 : w - pl) + 'px';
			t.stubNode.style.width = (sw - pl < 0 ? 0 : sw - pl) + 'px';
			s.display = newDisplay;
			if(oldDisplay != newDisplay){
				g.vLayout.reLayout();
			}
		},
		
		//Private-----------------------------------------------------------
		_lastLeft: 0,

		_onScroll: function(e){
			//	Fired by h-scroller's scrolling event
			var t = this,
				s = t.domNode.scrollLeft;
			if((has('webkit') || has('ie') < 8) && !t.grid.isLeftToRight()){
				s = t.domNode.scrollWidth - t.domNode.offsetWidth - s;
			}
			if(t._lastLeft != s){
				t._lastLeft = s;
				t._doScroll();
			}
		},

		_doScroll: function(rowNode){
			//	Sync the grid body with the scroller.
			var t = this,
				g = t.grid;
			g.bodyNode.scrollLeft = t.domNode.scrollLeft;
			g.onHScroll(t._lastLeft);
		}
	});
});
