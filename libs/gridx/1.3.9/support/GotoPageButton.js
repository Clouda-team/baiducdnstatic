define([
	"dojo/_base/declare",
	"dojo/_base/lang",
	"dojo/string",
	"./_LinkPageBase",
	"./GotoPagePane",
	"dijit/Dialog",
	"dijit/form/Button",
	"dijit/form/NumberTextBox",
	"dojo/keys",
	"dojo/_base/event"
], function(declare, lang, string, _LinkPageBase, GotoPagePane, Dialog, Button, NumberTextBox, keys, event){

/*=====
	return declare(_LinkPageBase, {
		gotoPagePane: GotoPagePane,

		// dialogClass: [private]
		dialogClass: Dialog,

		// buttonClass: [private]
		buttonClass: Button,

		// numberTextBoxClass: [private]
		numberTextBoxClass: NumberTextBox,

		refresh: function(){
			// summary:
			//		TODOC
		}
	});
=====*/

	return declare(_LinkPageBase, {
		templateString: "<span class='gridxPagerGotoBtn' tabindex='${_tabIndex}' title='${gotoBtnTitle}' aria-label='${gotoBtnTitle}' data-dojo-attach-event='onclick: _showGotoDialog'><span class='gridxPagerA11yInner'>&#9650;</span></span>",

		gotoPagePane: GotoPagePane,

		dialogClass: Dialog,

		buttonClass: Button,

		numberTextBoxClass: NumberTextBox,

		refresh: function(){},

		//Private-----------------------------------------
		_showGotoDialog: function(){
			var t = this;
			if(!t._gotoDialog){
				var cls = t.dialogClass,
					gppane = t.gotoPagePane,
					props = lang.mixin({
						title: t.gotoDialogTitle,
						content: new gppane({
							pager: t,
							pagination: t.grid.pagination
						})
					}, t.dialogProps || {});
				var dlg = t._gotoDialog = new cls(props);
				dlg.content.dialog = dlg;
			}
			var pageCount = t.grid.pagination.pageCount(),
				pane = t._gotoDialog.content;
			pane.pageCountMsgNode.innerHTML = string.substitute(t.gotoDialogPageCount, [pageCount]);
			pane.pageInputBox.constraints = {
				fractional: false,
				min: 1,
				max: pageCount
			};
			pane.pageInputBox.set('value', pane.pagination.currentPage() + 1);
			t._gotoDialog.show();
			pane.pageInputBox.focusNode.select();
		},

		_onKey: function(evt){
			if(evt.keyCode == keys.ENTER){
				this._showGotoDialog();
				event.stop(evt);
			}
		},

		_focusNextBtn: function(){
		},
		
		destroy: function(){
			var t = this;
			if(t._gotoDialog){
				t._gotoDialog.destroy();
			}
			t.inherited(arguments);
		}
	});
});
