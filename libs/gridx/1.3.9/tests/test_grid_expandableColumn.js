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

	function formatter(item){
		var mark, data = eval(item[this.field]);
		if(data < 7)mark = 'normal';
		else if(data < 9)mark = 'warning';
		else mark = 'critical';

		return '<span class="mark mark-' + mark + '"></span>';
	}

	layout = [
		{field: 'datasource', name: 'Data Sources', width: '130px'},

		{id: 'total', field: 'total', name: 'Total', width: '100px', expanded: true},
		{field: 'critical', name: 'Critical', width: '100px', _parentColumn: 'total'},
		{field: 'warning', name: 'Warning', width: '100px', _parentColumn: 'total'},

		{id: 'governance', field: 'governance', name: 'Governace', width: '100px', formatter: formatter},
		{field: 'monitoring', name: 'Monitoring', width: '100px', _parentColumn: 'governance', formatter: formatter},
		{field: 'policy', name: 'Policy', width: '100px', _parentColumn: 'governance', formatter: formatter},
		{field: 'process', name: 'Process', width: '100px', _parentColumn: 'governance', formatter: formatter},

		{id: 'vulnerability', field: 'vulnerability', name: 'Vulnerability', width: '100px', expanded: true, formatter: formatter},
		{field: 'configuration', name: 'Configuration', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'patches', name: 'Patches', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'authentication', name: 'Authentication', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'privileges', name: 'Privileges', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'filesystem', name: 'FileSystem', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},

		{field: 'alerts', name: 'Alerts', width: '100px', formatter: formatter},
		{field: 'violations', name: 'Violations', width: '100px', formatter: formatter}
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

		{id: 'total', field: 'total', name: 'Total', width: '100px', expanded: true},
		{field: 'critical', name: 'Critical', width: '100px', _parentColumn: 'total'},
		{field: 'warning', name: 'Warning', width: '100px', _parentColumn: 'total'},

		{id: 'governance', field: 'governance', name: 'Governace', width: '100px', formatter: formatter},
		{field: 'monitoring', name: 'Monitoring', width: '100px', _parentColumn: 'governance', formatter: formatter},
		{field: 'policy', name: 'Policy', width: '100px', _parentColumn: 'governance', formatter: formatter},
		{field: 'process', name: 'Process', width: '100px', _parentColumn: 'governance', formatter: formatter},

		{id: 'vulnerability', field: 'vulnerability', name: 'Vulnerability', width: '100px', expanded: true, formatter: formatter},
		{field: 'configuration', name: 'Configuration', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'patches', name: 'Patches', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'authentication', name: 'Authentication', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'privileges', name: 'Privileges', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},
		{field: 'filesystem', name: 'FileSystem', width: '100px', _parentColumn: 'vulnerability', formatter: formatter},

		{field: 'alerts', name: 'Alerts', width: '100px', formatter: formatter},
		{field: 'violations', name: 'Violations', width: '100px', formatter: formatter}
	];

	parser.parse();
});
