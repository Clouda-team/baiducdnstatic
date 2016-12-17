require([
	'dojo/parser',
	'dojo/_base/lang',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/ItemFileWriteStore',
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/allModules',
	'dijit/form/NumberSpinner',
	'dijit/form/Button',
	'dojo/domReady!'
], function(parser, lang, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource,
		size: 100
	});

	layout = dataSource.layouts[0];
	layout[3] = lang.mixin(layout[3], {
		widgetsInCell: true,
		decorator: function(){
			return [
				"<div data-dojo-attach-point='valueNode'></div>",
				"<br>",
				"<div data-dojo-attach-point='textNode' data-dojo-type='dijit/form/TextBox'></div>",
			].join('');
		},
		setCellValue: function(gridData, storeData, cellWidget){
			cellWidget.valueNode.innerHTML = gridData;
			cellWidget.textNode.domNode.style.display = 'none';

			if(gridData === 'set grid data'){
				cellWidget.textNode.domNode.style.display = '';
			}
		}
	});

	lockColumns = function(){
		var c = dijit.byId('integerspinner').get('value');
		grid.columnLock.lock(c);
	};

	unlockColumns = function(){
		grid.columnLock.unlock();
	};

	showWidgetInCell = function(){
		grid.store.fetch({query: {id:2}, onItem: function(item){ grid.store.setValue(item, 'Artist', 'set grid data');}})
	};

	parser.parse();
});
