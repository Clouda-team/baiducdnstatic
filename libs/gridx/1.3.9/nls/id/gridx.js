define({     
//Body
	loadingInfo: "Memuat...",
	emptyInfo: "Tidak ada item untuk ditampilkan",
	loadFailInfo: "Gagal memuat data!",
	loadMore: "Muat Lebih Banyak",
	loadMoreLoading: "Memuat...",
	loadPrevious: "Muat Sebelumnya",
	loadPreviousLoading: "Memuat...",

//FilterBar
	"clearFilterDialogTitle": "Hapus Filter",
	"filterDefDialogTitle": "Filter",
	"defaultRuleTitle": "Aturan",
	"ruleTitleTemplate": "Aturan ${ruleNumber}",
	"noFilterApplied": "Tidak ada filter yang diterapkan.",
	"defineFilter": "Tentukan filter",
	"defineFilterAriaLabel": "Menentukan filter: Buka dialog filter untuk mengonfigurasi aturan filter kompleks. Setiap aturan filter terdiri dari kombinasi kolom, kondisi, dan nilai. Ketika dialog terbuka, bidang nilai memiliki fokus keyboard.",
	"conditionEqual": "sama dengan",
	"conditionNotEqual": "tidak sama dengan",
	"conditionLess": "kurang dari",
	"conditionLessEqual": "kurang dari atau sama dengan",
	"conditionGreater": "lebih besar dari",
	"conditionGreaterEqual": "lebih besar dari atau sama dengan",
	"conditionContain": "berisi",
	"conditionIs": "adalah",
	"conditionStartWith": "dimulai dengan",
	"conditionEndWith": "diakhiri dengan",
	"conditionNotContain": "tidak berisi",
	"conditionIsNot": "tidak",
	"conditionNotStartWith": "tidak dimulai dengan",
	"conditionNotEndWith": "tidak diakhiri dengan",
	"conditionBefore": "sebelum",
	"conditionAfter": "setelah",
	"conditionRange": "rentang",
	"conditionIsEmpty": "kosog",
	"conditionIsNotEmpty": "tidak kosong",
	"all": "semua",
	"any": "beberapa",
	"relationAll": "semua aturan",
	"waiRelAll": "Sesuaikan semua aturan berikut:",
	"relationAny": "beberapa aturan",
	"waiRelAny": "Sesuaikan beberapa aturan berikut:",
	"relationMsgFront": "Sesuaikan",
	"relationMsgTail": "",
	"and": "dan",
	"or": "atau",
	"addRuleButton": "Tambahkan Aturan",
	"waiAddRuleButton": "Tambahkan aturan baru",
	"removeRuleButton": "Hapus Aturan",
	"waiRemoveRuleButtonTemplate": "Hapus aturan ${0}",
	"addRuleButton": "Tambahkan Aturan Filter",
	"cancelButton": "Batal",
	"waiCancelButton": "Batalkan dialog ini",
	"clearButton": "Hapus",
	"waiClearButton": "Hapus filter",
	"filterButton": "Filter",
	"waiFilterButton": "Kirimkan filter",
	"columnSelectLabel": "Kolom:",
	"columnSelectAriaLabel": "Kolom: bagian kondisi ${0} dari ${1}",
	"waiColumnSelectTemplate": "Kolum untuk aturan ${0}",

	"conditionSelectLabel": "Kondisi:",
	"conditionSelectAriaLabel": "Operator: bagian kondisi ${0} dari ${1}",
	"waiConditionSelectTemplate": "Kondisi untuk aturan ${0}",

	"valueBoxLabel": "Nilai:",
	"valueBoxAriaLabel": "Nilai: bagian kondisi ${0} dari ${1}",
	"waiValueBoxTemplate": "Masukkan nilai untuk memfilter aturan ${0}",
	"rangeTo": "hingga",
	"rangeTemplate": "dari ${0} hingga ${1}",
	"statusTipHeaderColumn": "Kolom",
	"statusTipHeaderCondition": "Aturan",
	"statusTipTitle": "Bar Filter",
	"statusTipMsg": "Klik bar filter di sini untuk memfilter nilai pada ${0}.",
	"anycolumn": "beberapa kolom",
	"statusTipTitleNoFilter": "Bar Filter",
	"statusTipTitleHasFilter": "Filter",
	"statusTipRelPre": "Sesuaikan",
	"statusTipRelPost": "aturan.",
	"statusTipHeaderAll": "Sesuaikan dengan semua aturan.",
	"statusTipHeaderAny": "Sesuaikan dengan beberapa aturan.",
	"defaultItemsName": "item",
	"filterBarMsgHasFilterTemplate": "${0} dari ${1} ${2} yang diperlihatkan.",
	"filterBarMsgNoFilterTemplate": "Tidak ada filter yang diterapkan",
	"filterBarDefButton": "Tentukan filter",
	"waiFilterBarDefButton": "Filter tabel",
	"a11yFilterBarDefButton": "Filter...",
	"filterBarClearButton": "Hapus filter",
	"waiFilterBarClearButton": "Hapus filter",
	"closeFilterBarBtn": "Tutup bar filter",
	"clearFilterMsg": "Menutup bar filter akan menghapus dan memperlihatkan semua catatan yang tersedia.",
	"anyColumnOption": "Beberapa Kolom",
	"trueLabel": "Benar",
	"falseLabel": "Salah",
	"radioTrueLabel": "Nilai Benar",
	"radioFalseLabel": "Nilai Salah",
	"beginTimeRangeLabel": "Awal Nilai Rentang Waktu",
	"endTimeRangeLabel": "Akhir Nilai Rentang Waktu",
	"beginDateRangeLabel": "Awal Nilai Rentang Tanggal",
	"endDateRangeLabel": "Akhir Nilai Rentang Tanggal",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Pengurutan Tunggal",
	nestedSort: "Pengurutan Berkelompok",
	ascending: "Klik untuk mengurutkan ka Atas",
	descending: "Klik untuk mengurutkan ke Bawah",
	sortingState: "${0} - ${1}",
	unsorted: "Jangan mengurutkan kolom ini",
	waiSingleSortLabel: "${0} - diurutkan berdasarkan ${1}. Pilih untuk mengurutkan berdasarkan ${2}",
	waiNestedSortLabel:"${0} - diurutkan secara berkelompok berdasarkan ${1}. Pilih untuk mengurutkan secara berkelompok berdasarkan ${2}",

//PaginationBar
	pagerWai: 'Pager',

	pageIndex: '${0}',
	pageIndexTitle: 'Halaman ${0}',

	firstPageTitle: 'Halaman pertama',
	prevPageTitle: 'Halaman sebelumnya',
	nextPageTitle: 'Halaman berikutnya',
	lastPageTitle: 'Halaman terakhir',

	pageSize: '${0}',
	pageSizeTitle: '${0} item per halaman',
	pageSizeAll: 'Semua',
	pageSizeAllTitle: 'Semua item',

	description: '${0} - ${1} dari ${2} item.',
	descriptionEmpty: 'Kisi dalam keadaan kosong.',

	summary: 'Total: ${0}',
	summaryWithSelection: 'Total: ${0} Dipilih: ${1}',

	gotoBtnTitle: 'Beralih ke halaman tertentu',

	gotoDialogTitle: 'Beralih ke Halaman',
	gotoDialogMainMsg: 'Tentukan nomor halaman:',
	gotoDialogPageCount: '(${0} halaman)',
	gotoDialogOKBtn: 'Beralih',
	gotoDialogCancelBtn: 'Batal',
	// for drop down pagination bar
	pageLabel: 'Halaman',
	pageSizeLabel: 'Baris',

//QuickFilter
	filterLabel: 'Filter',
	clearButtonTitle: 'Hapus Filter',
	buildFilterMenuLabel: 'Buat Filter...',
	apply: 'Terapkan Filter',

//Sort
	helpMsg: '${0} - Klik untuk mengurutkan atau klik kanan untuk menambahkan ke urutan',
	singleHelpMsg: '${0} - Klik untuk mengurutkan',
	priorityOrder: 'urutkan prioritas ${0}',

//SummaryBar
	summaryTotal: 'Total: ${0}',
	summarySelected: 'Terpilih: ${0}',
	summaryRange: 'Rentang: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Tekan SPASI untuk memilih semua.",	//need translation
	indirectDeselectAll: "Tekan SPASI untuk batal memilih semua.",	//need translation
	treeExpanded: "Tombol Control + panah kiri untuk menyiutkan baris ini.",	//need translation
	treeCollapsed: "Tombol Control + panah kanan untuk memperluas baris ini."	//need translation
});

