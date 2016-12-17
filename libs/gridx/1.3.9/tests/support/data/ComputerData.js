define([
	'dijit/ProgressBar'
], function(ProgressBar){
	
	var names = [
		"Acai", 
		"Aceola",
		"Apple",
		"Apricots",
		"Avocado",
		"Banana",
		"Blackberry",
		"Blueberries",
		"Camu Camu berry",
		"Cherries",
		"Coconut",
		"Cranberry",
		"Cucumber",
		"Currents",
		"Dates",
		"Durian",
		"Fig",
		"Goji berries",
		"Gooseberry",
		"Grapefruit",
		"Grapes",
		"Jackfruit",
		"Kiwi",
		"Kumquat",
		"Lemon",
		"Lime",
		"Lucuma",
		"Lychee", 
		"Mango",
		"Mangosteen",
		"Melon",
		"Mulberry",
		"Nectarine",
		"Orange",
		"Papaya",
		"Passion Fruit",
		"Peach",
		"Pear",
		"Pineapple",
		"Plum",
		"Pomegranate",
		"Pomelo", 
		"Prickly Pear",
		"Prunes",
		"Raspberries",
		"Strawberries",
		"Tangerine/Clementine",
		"Watermelon"
	];

	var servers = [
		"Capricorn", 
		"Aquarius", 
		"Pisces", 
		"Aries", 
		"Taurus", 
		"Gemini", 
		"Cancer", 
		"Leo", 
		"Virgo", 
		"Libra", 
		"Scorpio", 
		"Sagittarius"
	];

	var platforms = [
		"Windows XP",
		"Windows 7",
		"Redhat Linux 6",
		"Macintosh 10.5.4",
		"Ubuntu Linux 11.10",
		"Ubuntu Linux 11.04",
		"AIX",
		"iOS",
		"Google Chrome OS",
		"Xenix",
		"Solaris",
		"FreeBSD"
	];

	var status = [
		"Normal",
		"Warning",
		"Critical"
	];

	var progresses = [0.2, 0.5, 0.7, 0.3, 0.4, 0.9, 0.6, 0.8, 0.1];

	return {
		getData: function(args){
			var size = args.size === undefined ? 100 : args.size;
			var data = {
				identifier: 'id', 
				label: 'id', 
				items: []
			};
			for(var i = 0; i < size; ++i){
				data.items.push({
					id: i + 1,
					order: i + 1,
					name: names[i % names.length],
					server: servers[i % servers.length],
					platform: platforms[i % platforms.length],
					status: status[i % status.length],
					progress: progresses[i % progresses.length]
				});
			}
			return data;
		},

		layouts: [
			[
				{id: 'id', field: 'id', name: 'Identity', width: '80px'},
				{id: 'name', field: 'name', name: 'Name', width: '100px'},
				{id: 'server', field: 'server', name: 'Server', width: '100px'},
				{id: 'platform', field: 'platform', name: 'Platform', width: '160px'},
				{id: 'status', field: 'status', name: 'Status', width: '100px',
					decorator: function(data){
						return [
							"<span class='", {
								normal: 'testDataNormalStatus',
								warning: 'testDataWarningStatus',
								critical: 'testDataCriticalStatus'
							}[data.toLowerCase()], "'></span>",
							data
						].join('');
					}
				},
				{id: 'progress', field: 'progress', name: 'Progress', width: '200px',
					widgetsInCell: true,
					decorator: function(){
						return "<div data-dojo-type='dijit.ProgressBar' data-dojo-props='minimum: 0, maximum: 1' class='gridxHasGridCellValue' style='width: 100%;'></div>";
					}
				}
			],
			[
				{id: 'id', field: 'id', name: 'System ID', width: '80px',
					formatter: function(rawData){
						return "System " + rawData.id;
					}
				},
				{id: 'name', field: 'name', name: 'Name', width: '100px'},
				{id: 'server', field: 'server', name: 'Server', width: '100px'},
				{id: 'platform', field: 'platform', name: 'Platform', width: '160px',
					formatter: function(rawData){
						if(rawData.platform == 'Ubuntu Linux 11.04' ||
								rawData.platform == 'Windows XP'){
							return rawData.platform + ' (to be upgraded...)';
						}
						return rawData.platform;
					}
				},
				{id: 'status', field: 'status', name: 'Status', width: '100px',
					decorator: function(data){
						return [
							"<span class='", {
								normal: 'testDataNormalStatus',
								warning: 'testDataWarningStatus',
								critical: 'testDataCriticalStatus'
							}[data.toLowerCase()], "'></span>",
							data
						].join('');
					}
				},
				{id: 'progress', field: 'progress', name: 'Progress', width: '200px',
					widgetsInCell: true,
					decorator: function(){
						return "<div data-dojo-type='dijit.ProgressBar' data-dojo-props='minimum: 0, maximum: 1' class='gridxHasGridCellValue' style='width: 100%;'></div>";
					}
				}
			]
		]
	};
});
