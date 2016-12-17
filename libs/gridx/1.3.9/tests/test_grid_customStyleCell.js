require([
	'dojo/parser',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',
	"gridx/modules/RowHeader",
	'dojo/domReady!'
], function(parser){
	function cellStyle(cell){
		return ["height: 28px; background-color: rgb(",
			cell.column.index() * 8 % 255, ',',
			cell.row.index() * 28 % 255, ',',
			cell.column.index() * cell.row.index(),
		');'].join("");
	}

	items = [];
	layout = [];
	var cn = 30;
	var rn = 10;
	var i;
	for(i = 0; i < rn; ++i){
		items.push({
			id: i + 1
		});
	}
	for(i = 0; i < cn; ++i){
		layout.push({
			id: i + 1,
			name: i + 1,
			width: '20px',
			style: cellStyle
		});
	}

	parser.parse();
});
