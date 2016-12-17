define([
	"dojo/_base/declare",
	"dojo/query",
	"dojo/_base/event",
	"dojo/string",
	"dojo/dom-class",
	"dojo/keys",
	"./_LinkPageBase",
	"dojo/text!../templates/LinkPager.html"
], function(declare, query, event, string, domClass, keys, _LinkPageBase, template){

/*=====
	return declare(_LinkPageBase, {
		// summary:
		//		This is a grid bar plugin to switch pages for grid using link buttons.
		
		// visibleSteppers: Integer
		//		Number of visible page steppers. If invalid, default to 3.
		visibleSteppers: 3,

		refresh: function(){
		}
	});
=====*/

	var hasClass = domClass.contains;

	return declare(_LinkPageBase, {
		templateString: template,

		postMixInProperties: function(){
			var t = this,
				c = 'connect',
				p = t.grid.pagination;
			t.inherited(arguments);
			t[c](p, 'onSwitchPage', 'refresh');
			t[c](p, 'onChangePageSize', 'refresh');
			t[c](t.grid.model, 'onSizeChange', 'refresh');
		},

		startup: function(){
			this.inherited(arguments);
			//Set initial page after pagination module is ready.
			//FIXME: this causes 2 times refresh, any better way?
			this.refresh();
		},

		//Public-----------------------------------------------------------------------------

		// visibleSteppers: Integer
		//		Number of visible page steppers. If invalid, default to 3.
		visibleSteppers: 3,

		refresh: function(){
			var t = this,
				p = t.grid.pagination,
				pageCount = p.pageCount(),
				currentPage = p.currentPage(),
				count = t.visibleSteppers,
				sb = [], tabIndex = t._tabIndex,
				disableNext = false,
				disablePrev = false,
				ellipsis = '<span class="gridxPagerStepperEllipsis">&hellip;</span>',
				substitute = string.substitute,
				stepper = function(page){
					return ['<span class="gridxPagerStepperBtn gridxPagerPage ',
						currentPage == page ? 'gridxPagerStepperBtnActive' : '',
						'" pageindex="', page,
						'" title="', substitute(t.pageIndexTitle, [page + 1]),
						'" aria-label="', substitute(t.pageIndexTitle, [page + 1]),
						'" tabindex="', tabIndex, '">', substitute(t.pageIndex, [page + 1]),
					'</span>'].join('');
				};
			if(typeof count != 'number' || count <= 0){
				count = 3;
			}
			if(pageCount){
				var firstPage = currentPage - Math.floor((count - 1) / 2),
					lastPage = firstPage + count - 1;
				if(firstPage < 1){
					firstPage = 1;
					lastPage = count - 1;
				}else if(pageCount > count && firstPage >= pageCount - count){
					firstPage = pageCount - count;
				}
				if(lastPage >= pageCount - 1){
					lastPage = pageCount - 2;
				}
				sb.push(stepper(0));
				if(pageCount > 2){
					if(firstPage > 1){
						sb.push(ellipsis);
					}
					for(var i = firstPage; i <= lastPage; ++i){
						sb.push(stepper(i));
					}
					if(lastPage < pageCount - 2){
						sb.push(ellipsis);
					}
				}
				if(pageCount > 1){
					sb.push(stepper(pageCount - 1));
				}
			}
			t._pageBtnContainer.innerHTML = sb.join('');
			
			if(!currentPage || currentPage === pageCount - 1){
				disablePrev = !currentPage || pageCount <= 1;
				disableNext = currentPage || pageCount <= 1;
			}
			domClass.toggle(t._nextPageBtn, 'gridxPagerStepperBtnDisable gridxPagerNextPageDisable', disableNext);
			domClass.toggle(t._prevPageBtn, 'gridxPagerStepperBtnDisable gridxPagerPrevPageDisable', disablePrev);

			t.grid.vLayout.reLayout();
			if(t.focused){
				t._focusNextBtn();
			}
		},	

		//Private----------------------------------------------------------------------------
		_onHover: function(evt){
			this._toggleHover(evt, 'gridxPagerStepperBtn', 'gridxPagerPages', 'gridxPagerStepperBtnHover');
		},
	
		_prevPage: function(){
			this._focusPageIndex = 'prev';
			var p = this.grid.pagination;
			p.gotoPage(p.currentPage() - 1);
		},
	
		_nextPage: function(){
			this._focusPageIndex = 'next';
			var p = this.grid.pagination;
			p.gotoPage(p.currentPage() + 1);
		},

		_gotoPage: function(evt){
			var n = this._findNodeByEvent(evt, 'gridxPagerStepperBtn', 'gridxPagerPages');
			if(n){
				var page = this._focusPageIndex = n.getAttribute('pageindex');
				this.grid.pagination.gotoPage(parseInt(page, 10));
			}
		},

		//Focus------------------------
		_onKey: function(evt){
			var t = this,
				p = t.grid.pagination,
				leftKey = t.grid.isLeftToRight() ? keys.LEFT_ARROW : keys.RIGHT_ARROW;
			if(evt.keyCode == keys.LEFT_ARROW || evt.keyCode == keys.RIGHT_ARROW){
				event.stop(evt);
				t._focusNextBtn(true, evt.keyCode == leftKey);
			}else if(evt.keyCode == keys.ENTER && 
				hasClass(evt.target, 'gridxPagerStepperBtn') && 
				!hasClass(evt.target, 'gridxPagerStepperBtnActive') &&
				!hasClass(evt.target, 'gridxPagerStepperBtnDisable')){
				event.stop(evt);
				if(isNaN(parseInt(t._focusPageIndex, 10))){
					t['_' + t._focusPageIndex + 'Page']();
				}else{
					p.gotoPage(parseInt(t._focusPageIndex, 10));
				}
			}
		},
	
		_focusNextBtn: function(isMove, isLeft){
			var t = this,
				c = t.domNode,
				n = query('[pageindex="' + t._focusPageIndex + '"]', c)[0];
			n = t._focus(query('.gridxPagerStepperBtn', c), n, isMove, isLeft, function(node){
				return !hasClass(node, 'gridxPagerStepperBtnActive') &&
					!hasClass(node, 'gridxPagerStepperBtnDisable');
			});
			if(n){
				t._focusPageIndex = n.getAttribute('pageindex');
			}
			return n;
		}
	});
});
