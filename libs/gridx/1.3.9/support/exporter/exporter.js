define([
/*====="dojo/_base/declare", =====*/
	"dojo/_base/lang",
	"dojo/_base/Deferred",
	"dojo/DeferredList",
	"dojo/_base/array"
], function(/*=====declare, =====*/lang, Deferred, DeferredList, array){

/*=====
	function exporter(grid, writer, args){
		// summary:
		//		Go through the grid using the given args and writer implementation.
		//		Return a dojo.Deferred object. Users can cancel and see progress 
		//		of the exporting process.
		//		Pass the exported result to the callback function of the Deferred object.
		// grid: gridx/Grid
		//		The grid instance to export
		// writer: __Writer
		//		The writer implementation.
		// args: __ExportArgs
		//		Export arguments.
		// returns:
		//		A deferred object.
	}

	exporter.__Writer = declare([], {
		beforeHeader: function(args, context){
			//summary:
			//		Triggered before exporting the header cells.
			//return: Boolean|undefined
			//		If return false, does not handle following header cells.
		},

		handleHeaderCell: function(args, context){
			//summary:
			//		Triggered when exporting a header cell.
		},

		afterHeader: function(args, context){
			//summary:
			//		Triggered when the header has been exported.
		},

		beforeBody: function(args, context){
			//summary:
			//		Triggered before exporting the grid body.
			//return: Boolean|undefined
			//		If return false, does not handle any of the grid body content.
		},

		beforeRow: function(args, context){
			//summary:
			//		Triggered before exporting a row.
			//return: Boolean|undefined
			//		If return false, does not handle the cells in this row.
		},

		handleCell: function(args, context){
			//summary:
			//		Triggered when exporting a cell.
		},

		afterRow: function(args, context){
			//summary:
			//		Triggered when a row has been exported.
		},

		afterBody: function(args, context){
			//summary:
			//		Triggered when the grid body has been exported.
		},

		getResult: function(){
			//summary:
			//		This must be implemented.
			return '';
		}
	});

	exporter.__ExportArgs = declare([], {
		// columns: String[]?
		//		An array of column ID. Indicates which columns to be exported. 
		//		If invalid or empty array, export all grid columns.
		columns: null,

		// start: Number?
		//		Indicates from which row to start exporting. If invalid, 
		//		default to 0.
		start: 0,

		// count: Number?
		//		Indicates the count of rows export.
		//		If invalid, export all rows up to the end of grid.
		count: 0,

		// selectedOnly: Boolean?
		//		Whether only export selected rows. This constraint is applied 
		//		upon the rows specified by start and count parameters.
		//		This paramter and the filter parameter can be used togetther. 
		//		Default to false.
		selectedOnly: false,

		// filter: Function?
		//		A predicate function (returns Boolean) to judge whether to 
		//		export a row. 
		//		This constraint is applied upon the result rows of the 
		//		selectedOnly parameter, if provided.
		filter: null,

		// useStoreData: Boolean?
		//		Indicates whether to export grid data (formatted data) or 
		//		store data. Default to false.
		useStoreData: false,

		// formatters: Object?
		//		A customized way to export data, if neither grid data nor store 
		//		data could meet the requirement. 
		//		This is an associative array from column id to formatter function. 
		//		A grid cell object will be passed into that function as an argument.
		formatter: null,

		// omitHeader: Boolean?
		//		Indicates whether to export grid header. Default to false.
		omitHeader: false,

		// progressStep: Number?
		//		Number of rows in each progress. Default to 0 (invalid means only one progress).
		//		After each progress, the deferred.progress() is called, so the 
		//		exporting process can be viewed by the user.
		progressStep: 0
	});

	exporter.__ExportContext = {
		// columnIds: String[]
		//		Available for header.
		columnIds: null,

		// column: Grid Column
		//		Available for header cell or a body cell.
		column: null,

		// row: Grid Row
		//		Available for a row or a body cell.
		row: null,

		// cell: Grid Cell
		//		Available for a body cell
		cell: null,

		// data: Anything
		//		Available for a body cell
		data: null
	};

	return exporter;
=====*/

	function check(writer, method, context, args){
		return !writer[method] || false !== writer[method](context || args, args);
	}

	function prepareReqs(args, rowIndexes, size){
		var reqs = [],
			i, start = 0, end = 0,
			ps = args.progressStep;
		if(typeof args.start == 'number' && args.start >= 0){
			start = args.start;
		}
		if(typeof args.count == 'number' && args.count > 0){
			end = start + args.count;
		}
		end = end || size;
		if(rowIndexes){
			rowIndexes = array.filter(rowIndexes, function(idx){
				return idx >= start && idx < end;
			});
			if(rowIndexes.length && (!ps || rowIndexes.length <= ps)){
				reqs.push(rowIndexes);
			}else{
				for(i = 0; i < rowIndexes.length; i += ps){
					reqs.push(rowIndexes.slice(i, i + ps));
				}
			}
		}else{
			var count = end - start;
			if(!ps || count <= ps){
				reqs.push({
					start: start,
					count: count,
					parentId: ''
				});
			}else{
				for(i = start; i < end; i += ps){
					reqs.push({
						start: i,
						count: i + ps < end ? ps : end - i,
						parentId: ''
					});
				}
			}
		}
		reqs.p = 0;
		return reqs;
	}

	function first(req, grid, parentId){
		return lang.isArray(req) ? {
			p: 0,
			row: grid.row(req[0], 0, parentId)
		} : {
			p: req.start,
			row: grid.row(req.start, 0, parentId)
		};
	}

	function next(req, grid, prevRow, parentId){
		var p = prevRow.p + 1,
			isArray = lang.isArray(req);
		return p < (isArray ? req.length : req.start + req.count) ? {
			p: p,
			row: grid.row(isArray ? req[p] : p, 0, parentId)
		} : null;
	}

	function format(args, cell){
		var fs = args.formatters,
			cid = cell.column.id;
		if(fs && lang.isFunction(fs[cid])){
			return fs[cid](cell);
		}else if(args.useStoreData){
			return cell.rawData() || '';
		}
		return cell.data() || '';
	}

	function fetchRows(grid, defer, writer, context, args, d, reqs){
		var dl = [];
		var f = args.filter,
			cols = context.columnIds,
			req = reqs[reqs.p++], newReq,
			fail = lang.hitch(d, d.errback),
			parentId = req && req.parentId,

			func = function(){
				defer.progress(reqs.p / reqs.length);
				grid.when(req, function(){
					var rowid,
						fetchChildren = function(id){
							//only support Sync cache currently
							var m = grid.model,
								size = m.size(id), i, childRowid;

							m.when({start: 0, parentId: id}).then(function(){
								for(i = 0; i < size; i++){
									childRowid = m.indexToId(i, id);
									writerCallback({row:grid.row(i, 0, id)});
									fetchChildren(childRowid);
								}
							});
						},

						writerCallback = function(r){
							context.row = r.row;

							if((!f || f(r.row)) && check(writer, 'beforeRow', context, args)){
								for(var i = 0; i < cols.length; ++i){
									var col = grid.column(cols[i], 1),	//1 as true
										cell = context.cell = grid.cell(r.row, col);
									// if(!cell) continue;
									context.column = col;
									context.data = format(args, cell);
									check(writer, 'handleCell', context, args);
								}
								check(writer, 'afterRow', context, args);
							}
						};

					fetchChildren(parentId);
				}).then(function(){
					fetchRows(grid, defer, writer, context, args, d, reqs);
				}, fail);
			};
		if(req){
			if(reqs.length > 1){
				setTimeout(func, 10);
			}else{
				func();
			}
		}else{
			d.callback();
		}
	}

	function getColumns(grid, args){
		var colsById = grid._columnsById,
			s = grid.select,
			sc = s && s.column,
			cols;
		if(lang.isArrayLike(args.columns) && args.columns.length){
			cols = array.filter(args.columns, function(cid){
				return colsById[cid];
			});
			cols.sort(function(a, b){
				return colsById[a].index - colsById[b].index;
			});
		}else{
			cols = array.map(grid._columns, function(c){
				return c.id;
			});
		}
		return cols;
	}

	function exporter(grid, writer, /* __ExportArgs */ args){
		// debugger;
		var d = new Deferred(),
			model = grid.model,
			cols = getColumns(grid, args),
			s = grid.select,
			sr = s && s.row,
			sc = s && s.column,
			waitForRows,
			rowIds,
			context = {
				grid: grid,
				columnIds: cols
			},
			success = function(){
				check(writer, 'afterBody', context, args);
				d.callback(writer.getResult());
			},
			fail = lang.hitch(d, d.errback);
		
		try{
			check(writer, 'initialize', context, args);
			if(!args.omitHeader && check(writer, 'beforeHeader', context, args)){
				array.forEach(cols, function(cid){
					context.column = grid.column(cid, 1);	//1 as true
					check(writer, 'handleHeaderCell', context, args);
				});
				check(writer, 'afterHeader', context, args);
			}
			if(check(writer, 'beforeBody', context, args)){
				if(args.selectedOnly && sr && (!sc || !sc.getSelected().length)){
					waitForRows = model.when().then(function(){
						rowIds = sr.getSelected();
					}, fail);
				}
				Deferred.when(waitForRows, function(){
					var rowIdxes,
						waitForRowIndex = rowIds && model.when({id: rowIds}, function(){
							rowIdxes = array.map(rowIds, function(id){
								return model.idToIndex(id);
							});
							rowIdxes.sort(function(a, b){
								return a - b;
							});
						}, fail);
					Deferred.when(waitForRowIndex, function(){
						var dd = new Deferred(),
							rowCount = model.size();
						fetchRows(grid, d, writer, context, args, dd, prepareReqs(args, rowIdxes, rowCount));
						dd.then(success, fail);
					}, fail);
				}, fail);
			}else{
				d.callback(writer.getResult());
			}
		}catch(e){
			fail(e);
		}
		return d;
	}

	return exporter;
});
