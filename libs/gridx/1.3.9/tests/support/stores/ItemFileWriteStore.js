define([
	'dojo/data/ItemFileWriteStore',
	'./MockServerStore',
	"dojo/data/util/sorter"
], function(Store, MockServerStore, sorter){

return function(args){
	var data = args.dataSource.getData(args);
	var store = new (args.isAsync ? MockServerStore : Store)({
		data: data
	});
	store.asyncTimeout = args.asyncTimeout || 700;
	if(args.tree){
		store.hasChildren = function(id, item){
			return item && store.getValues(item, 'children').length;
		};
		store.getChildren = function(item, options){
			var children = store.getValues(item, 'children');
			if(options.sort){
				children.sort(sorter.createSortFunction(options.sort, store));
			}
			return children;
		};
	}
	return store;
};
});
