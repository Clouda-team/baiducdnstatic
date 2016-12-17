require([
	'gridx/Grid',
	'gridx/core/model/cache/Async',
	'gridx/modules/RowLock',
	'gridx/modules/RowHeader',
//    'gridx/tests/support/data/MusicData',
	'gridx/tests/support/data/TestData',
	'gridx/tests/support/stores/ItemFileWriteStore',
//    'gridx/tests/support/stores/JsonRest',
	'gridx/tests/support/TestPane',
	'dijit/form/NumberSpinner'
], function(Grid, Cache, RowLock, RowHeader, dataSource, storeFactory, TestPane){
	grid = new Grid({
		id: 'grid',
		cacheClass: Cache,
		store: storeFactory({
			path: './support/stores',
			dataSource: dataSource, 
			size: 100
		}),
		rowLockCount: 2,
		structure: dataSource.layouts[0],
		modules: [RowLock, RowHeader]
	});
	grid.placeAt('gridContainer');
	grid.startup();

	//Test buttons
	var tp = new TestPane({});
	tp.placeAt('ctrlPane');

	tp.addTestSet('Lock/Unlock Rows', [
		'<label for="integerspinner">Rows to lock:</label><input id="integerspinner1" data-dojo-type="dijit.form.NumberSpinner" data-dojo-props="constraints:{max:10,min: 1},name:\'integerspinner1\', value: 1"/>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: lockRows">Lock Rows</div>',
		'<div data-dojo-type="dijit.form.Button" data-dojo-props="onClick: unlockRows">Unlock</div>'
	].join(''));

	tp.startup();
});

function lockRows(){
	var c = dijit.byId('integerspinner1').get('value');
	grid.rowLock.lock(c);
}

function unlockRows(){
	grid.rowLock.unlock();
}

