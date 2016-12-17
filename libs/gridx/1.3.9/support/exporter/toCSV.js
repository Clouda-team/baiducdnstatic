define([
/*====="dojo/_base/declare", =====*/
	"./exporter"
], function(/*=====declare, =====*/exporter){

/*=====
	function toCSV(grid, args){
		// summary:
		//		Export the grid contents to CSV according to the given args.
		// args: __CSVExportArgs?
		//		The args to configure the export result and the export process.
		// returns:
		//		A deferred object indicating when the export process is completed,
		//		and then pass the exported CSV string to callbacks.
	}

	toCSV.__CSVExportArgs = declare(exporter.__ExportArgs, {
		// seperator: String?
		//		The seperator string used in CSV. Default to comma ','.
		separator: '',

		// newLine: String?
		//		The new line string used in CSV. Deault to '\r\n';
		newLine: ''
	});

	return toCSV;
=====*/

	function toCSV(grid, args){
		return exporter(grid, toCSV.writer, args || {});
	}

	toCSV.writer = {
		initialize: function(context, args){
			this._s = args.separator || ",";
			this._n = args.newLine || "\r\n";
			this._lines = [];
		},

		beforeHeader: function(){
			this._cells = [];
		},

		handleHeaderCell: function(context){
			this._cells.push(context.column.name());
		},

		afterHeader: function(){
			this._lines.push(this._cells.join(this._s));
		},

		beforeRow: function(){
			this._cells = [];
		},

		handleCell: function(context){
			var data = String(context.data).replace(/"/g, '""');
			if(data.indexOf(this._s) >= 0 || data.search(/[" \t\r\n]/) >= 0){
				data = '"' + data + '"';
			}
			this._cells.push(data);
		},

		afterRow: function(){
			this._lines.push(this._cells.join(this._s));
		},

		getResult: function(){
			return this._lines.join(this._n);
		}
	};

	return toCSV;
});
