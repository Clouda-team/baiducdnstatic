require([
	'dojo/parser',
	'dojo/_base/lang',
	'dojo/_base/array',
	'gridx/tests/support/data/MusicData',
	'gridx/tests/support/stores/Memory',
	'dojo/store/Memory',
	'gridx/Grid',
	'gridx/core/model/cache/Sync',

	"gridx/modules/SlantedHeader",
	"gridx/modules/HeaderRegions",
	"gridx/modules/ExpandableColumn",
	"gridx/modules/SingleSort",
	"gridx/modules/Tree",
	"gridx/modules/ColumnLock",

	//'gridx/allModules',
	'dojo/domReady!'
], function(parser, lang, array, dataSource, storeFactory, MemoryStore){

	var datasources = [
		'Production'
		,'Customers'
		,'Products'
		,'Marketing'
		,'Sales'
		,'Leads'
		,'Manufacturing'
		,'Inventory'
		,'Orders'
		,'Test'
		,'Development'
	];
	datasources.push('Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row','Dummy Row' );
	function randomData(max){
		max = max || 10;
		return Math.round(Math.random()*max);
	}
	var data = [];

	for(var i = 0; i < 20; i++){
		var item = {
			id: i + 1
			,datasource: datasources[i]
			//total
			,critical: randomData(20)
			,warning: randomData(20)

			//governance
			,monitoring: randomData()
			,policy: randomData()
			,process: randomData()

			//,ulnerability
			,configuration: randomData()
			,patches: randomData()
			,authentication: randomData()
			,privileges: randomData()
			,filesystem: randomData()

			,alerts: randomData()
			,violations: randomData()

		};
		item.total = item.critical + item.warning;
		item.governance = (item.monitoring + item.policy + item.process)/3;
		item.vulnerability = (item.configuration + item.patches + item.authentication + item.privileges + item.filesystem)/5;

		data.push(item);
	}

	store = new MemoryStore({data: data});

	function decorator(value){
		var mark;
		if(value < 7)mark = 'normal';
		else if(value < 9)mark = 'warning';
		else mark = 'critical';

		return '<span class="mark mark-' + mark + '"></span>';
	}

	layout = [
		{field: 'datasource', name: 'Data Sources', width: '130px'},

		{id: 'total', field: 'total', name: 'Total', width: '30px', expanded: true},
		{field: 'critical', name: 'Critical', width: '30px', parentColumn: 'total'},
		{field: 'warning', name: 'Warning', width: '30px', parentColumn: 'total'},

		{id: 'governance', field: 'governance', name: 'Governace', width: '30px', decorator: decorator},
		{field: 'monitoring', name: 'Monitoring', width: '30px', parentColumn: 'governance', decorator: decorator},
		{field: 'policy', name: 'Policy', width: '30px', parentColumn: 'governance', decorator: decorator},
		{field: 'process', name: 'Process', width: '30px', parentColumn: 'governance', decorator: decorator},

		{id: 'vulnerability', field: 'vulnerability', name: 'Vulnerability', width: '30px', expanded: true, decorator: decorator},
		{field: 'configuration', name: 'Configuration', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'patches', name: 'Patches', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'authentication', name: 'Authentication', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'privileges', name: 'Privileges', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'filesystem', name: 'FileSystem', width: '30px', parentColumn: 'vulnerability', decorator: decorator},

		{field: 'alerts', name: 'Alerts', width: '30px', decorator: decorator},
		{field: 'violations', name: 'Violations', width: '30px', decorator: decorator}
	];

	var treeData = lang.clone(data);
	var dummyRow = treeData.pop();
	var topLevel = array.filter(treeData, function(item){
		return /Production|Test|Development/.test(item.datasource);
	});
	var childrenMap = {
		Production: array.filter(treeData, function(item){return /Customers|Products|Marketing|Manufacturing/.test(item.datasource);})
		,Marketing: array.filter(treeData, function(item){return /Sales|Leads/.test(item.datasource);})
		,Manufacturing: array.filter(treeData, function(item){return /Inventory|Orders/.test(item.datasource);})
	};
	treeStore = new MemoryStore({data: topLevel});
	treeStore.hasChildren = function(id, item){
		return /Production|Marketing|Manufacturing|Test|Development/.test(item.datasource);
	};

	treeStore.getChildren = function(item){
		var dummyChildren = [];
		for(var i = 0; i < 3; i++){
			dummyRow = lang.clone(dummyRow);
			dummyRow.id = Math.random();
			dummyChildren.push(dummyRow);
		}
		return childrenMap[item.datasource] || dummyChildren;
	};

	treeLayout = [
		{field: 'datasource', name: 'Data Sources', width: '130px', expandLevel: 'all'},

		{id: 'total', field: 'total', name: 'Total', width: '30px', expanded: true},
		{field: 'critical', name: 'Critical', width: '30px', parentColumn: 'total'},
		{field: 'warning', name: 'Warning', width: '30px', parentColumn: 'total'},

		{id: 'governance', field: 'governance', name: 'Governace', width: '30px', decorator: decorator},
		{field: 'monitoring', name: 'Monitoring', width: '30px', parentColumn: 'governance', decorator: decorator},
		{field: 'policy', name: 'Policy', width: '30px', parentColumn: 'governance', decorator: decorator},
		{field: 'process', name: 'Process', width: '30px', parentColumn: 'governance', decorator: decorator},

		{id: 'vulnerability', field: 'vulnerability', name: 'Vulnerability', width: '30px', expanded: true, decorator: decorator},
		{field: 'configuration', name: 'Configuration', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'patches', name: 'Patches', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'authentication', name: 'Authentication', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'privileges', name: 'Privileges', width: '30px', parentColumn: 'vulnerability', decorator: decorator},
		{field: 'filesystem', name: 'FileSystem', width: '30px', parentColumn: 'vulnerability', decorator: decorator},

		{field: 'alerts', name: 'Alerts', width: '30px', decorator: decorator},
		{field: 'violations', name: 'Violations', width: '30px', decorator: decorator}
	];

	parser.parse();
});
