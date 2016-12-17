dojo.require("dojox.data.JsonRestStore");

//Clear put/delete records file, so we can always start with a brand new store.
dojo.xhrPost({url: 'test_tree_jsonRestStore.php', sync: true});

var store = new dojox.data.JsonRestStore({
	idAttribute: 'id',
	target: 'test_tree_jsonRestStore.php'
});

store.fetch({
	start: 0,
	onComplete: function(items){
		var children = store.getValues(items[3], 'children').slice();
		console.log('children: ', children);
		children = dojo.filter(children, function(child){
			return false;
		});
		store.setValues(items[3], 'children', children);
		store.setValues(items[4], 'children', children);
		store.save({
			onComplete: function(){
				store.fetch({
					query: {parentId: 'item-4-2'},
					start: 0,
					onComplete: function(items){
						console.log('lazy tree:', items);
					}
				});
			}
		});
	}
});


