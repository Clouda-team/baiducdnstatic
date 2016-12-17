require([
	'dojo/parser',
	'dojo/_base/Deferred',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	'gridx/allModules',
	'dojo/domReady!'
], function(parser, Deferred, dataSource, storeFactory){

	store = storeFactory({
		dataSource: dataSource, 
		size: 100
	});

	layout = dataSource.layouts[0];

	Deferred.when(parser.parse(), function(){
		update();
	});
});

function setWidth(){
	var a = 20 + Math.random() * 200;
	console.log(a);
	grid.columnResizer.setWidth('Album', a);
	update();
}
function update(){
	document.getElementById('colWidthSpan').innerHTML = grid.column('Album').getWidth();
}
