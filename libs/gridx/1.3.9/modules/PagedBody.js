define([
	"dojo/_base/declare",
	"dojo/query",
	"dojo/dom-construct",
	"dojo/dom-style",
	"dojo/dom-class",
	"dojo/keys",
	"dojo/sniff",
	"./Body",
	"./_PagedBodyMixin"
], function(declare, query, domConstruct, domStyle, domClass, keys, has, Body, _PagedBodyMixin){

/*=====
	return declare(Body, {
		// summary:
		//		module name: body.
		//		This module provides a "load more" button (and a "load previous" button if necessary) inside grid body.
		// description:
		//		Page size can be set to indicate how many rows to show in one page. Clicking "load more" button or 
		//		"load previous" button loads a new page. If the current visible page count exceeds the max allowed page count,
		//		Some previous pages will be destroyed and "load previous" button will be shown.
		//		This module is designed especially for mobile devices, so it should almost always be used together with TouchVScroller.
		//		NOTE: This module is NOT compatible with VirtualVScroller and Pagination.

		// maxPageCount: Integer
		//		The max allowed page count. If this value > 0, when visible pages exceeds this value, some previous pages will be destroyed
		//		and the "load previous" button will be shown. If this value <= 0, grid will never destroy and previous pages, 
		//		and the "load previous" button will never be shown. Default to 0.
		maxPageCount: 0
	});
=====*/

	return declare([Body, _PagedBodyMixin], {
		maxPageCount: 0,
		
		_onHScroll: function(left){
			var t = this,
				g = t.grid;
				
			t.inherited(arguments);
			
			if((has('webkit') || has('ie') < 8) && !g.isLeftToRight()){
				left = g.header.innerNode.scrollWidth - g.header.innerNode.offsetWidth - left;
			}
			
			domStyle.set(t._prevBtn, "marginLeft", left+"px");
			domStyle.set(t._moreBtn, "marginLeft", left+"px");
		},

		createBottom: function(bottomNode){
			var t = this,
				moreBtn = t._moreBtn = domConstruct.create('button', {
					innerHTML: t.arg('loadMoreLabel', t.grid.nls.loadMore)
				}, bottomNode, 'last');
			t.connect(moreBtn, 'onclick', function(){
				t._load(1);
			});
			t.connect(moreBtn, 'onkeydown', function(evt){
				if(evt.keyCode == keys.ENTER){
					t._load(1);
				}
			});
		},

		createTop: function(topNode){
			var t = this,
				prevBtn = t._prevBtn = domConstruct.create('button', {
					innerHTML: t.arg('loadPreviousLabel', t.grid.nls.loadPrevious)
				}, topNode, 'last');
			t.connect(prevBtn, 'onclick', function(){
				t._load();
			});
			t.connect(prevBtn, 'onkeydown', function(evt){
				if(evt.keyCode == keys.ENTER){
					t._load();
				}
			});
		},

		_onLoadFinish: function(isPost, start, count, onFinish){
			var t = this,
				view = t.grid.view,
				maxPageCount = t.arg('maxPageCount'),
				maxRowCount = maxPageCount * t.arg('pageSize'),
				btnNode = isPost ? t._bottomNode : t._topNode;
			if(maxPageCount > 0 && view.rootCount > maxRowCount){
				var newRootStart = isPost ? view.rootStart : view.rootStart + view.rootCount - maxRowCount;
				view.updateRootRange(newRootStart, maxRowCount).then(function(){
					if(btnNode.parentNode){
						btnNode.parentNode.removeChild(btnNode);
					}
					t.unrenderRows(t.renderCount - view.visualCount, isPost ? 'post' : '');
					t.renderStart = 0;
					t.renderCount = view.visualCount;
					query('.gridxRow', t.domNode).forEach(function(node, i){
						node.setAttribute('visualindex', i);
						domClass.toggle(node, 'gridxRowOdd', i % 2);
					});
					domConstruct.place(btnNode, t.domNode, isPost ? 'last' : 'first');
					if(!isPost){
						t.grid.vScroller.scrollToRow(view.visualCount - 1);
					}
					onFinish();
				});
			}else{
				onFinish();
			}
		},

		_busy: function(isPost, begin){
			var t = this,
				btn = isPost ? t._moreBtn : t._prevBtn,
				cls = isPost ? "More" : "Previous";
			btn.innerHTML = begin ?
				'<span class="gridxLoadingMore"></span>' + t.arg('load' + cls + 'LoadingLabel', t.grid.nls['load' + cls + 'Loading']) :
				t.arg('load' + cls + 'Label', t.grid.nls['load' + cls]);
			btn.disabled = !!begin;
		}/*,

		_checkSpace: function(){
			return this.inherited(arguments) && this.renderCount < this.arg('maxPageCount') * this.arg('pageSize');
		}*/
	});
});
