define([
	'dojo/store/Memory',
	'dojo/store/util/QueryResults',
	'dojo/store/util/SimpleQueryEngine'
], function(Memory, QueryResults, queryEngine){

return function(args){
	var data = args.dataSource.getData(args);
	var store = new Memory({
		data: data.items
	});
	if(args.tree){
		store.hasChildren = function(id, item){
			return item && item.children && item.children.length;
		};
		store.getChildren = function(item, options){
			return QueryResults(queryEngine(options.query, options)(item.children));
		};
	}
	return store;
};
});

