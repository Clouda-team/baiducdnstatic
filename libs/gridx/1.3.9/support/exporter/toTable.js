define([
/*====="dojo/_base/declare", =====*/
	"./exporter"
], function(/*=====declare, =====*/exporter){

/*=====
	function toTable(grid, args){
		// summary:
		//		Export the grid contents to HTML table according to the given args.
		// args: __TableExportArgs?
		//		The args to configure the export result and the export process.
		// returns:
		//		A deferred object indicating when the export process is completed,
		//		and then pass the exported HTML table (as string) to callbacks.
	}

	toTable.__TableExportArgs = declare(exporter.__ExportArgs, {
		// natualWidth: Boolean
		natualWidth: false,

		// columnWidth: Object
		columnWidth: {}
	});

	return toTable;
=====*/

	function toTable(grid, args){
		return exporter(grid, toTable.writer, args || {});	//dojo.Deferred
	}

	toTable.writer = {
		_cellattrs: function(grid, args, col, cellContent){
			var cw = args.columnWidth,
				w = (cw && cw[col.id]) || (args.natualWidth ? '' : col.getWidth()) || 'auto',
				dir = grid.getTextDirStyle(col.id, cellContent);
			return [' colid="', col.id, '" style="', dir, ' width:', w, '"'].join('');
		},	

		initialize: function(context, /* __TableExportArgs */ args){
			this._rst = ['<table class="grid"',
				args.natualWidth ? '' : ' style="table-layout:fixed;"',
				' border="0" cellpadding="0" cellspacing="0">'
			];
		},

		beforeHeader: function(){
			this._rst.push('<thead><tr class="grid_header">');
		},

		handleHeaderCell: function(/* __ExportContext */ context, /* __TableExportArgs */ args){
			var col = context.column;
			this._rst.push('<th class="grid_header_cell"',
				this._cellattrs(col.grid, args, col, col.name()),
				'>', col.name(), '</th>');
		},

		afterHeader: function(){
			this._rst.push('</tr><thead>');
		},

		beforeBody: function(){
			this._rst.push('<tbody>');
		},

		beforeRow: function(/* __ExportContext */ context){
			var r = context.row, idx = r.index();
			this._rst.push('<tr class="grid_row grid_row_', idx % 2 ? 'even' : 'odd',
				'" rowid="', r.id, '" rowindex="', idx, '">');
		},

		handleCell: function(/* __ExportContext */ context, /* __TableExportArgs */ args){
			this._rst.push('<td class="grid_cell"',
				this._cellattrs(context.grid, args, context.column, context.data),
				'>', context.data, '</td>');
		},

		afterRow: function(){
			this._rst.push('</tr>');
		},

		afterBody: function(){
			this._rst.push('</tbody></table>');
		},

		getResult: function(){
			return this._rst.join('');
		}
	};

	return toTable;
});
