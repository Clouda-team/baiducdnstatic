define({     
//Body
	loadingInfo: "Yükleniyor...",
	emptyInfo: "Görüntülenecek öğe yok",
	loadFailInfo: "Veriler yüklenemedi!",
	loadMore: "Diğerlerini Yükle",
	loadMoreLoading: "Yükleniyor...",
	loadPrevious: "Öncekini Yükle",
	loadPreviousLoading: "Yükleniyor...",

//FilterBar
	"clearFilterDialogTitle": "Süzgeci Temizle",
	"filterDefDialogTitle": "Süzgeç",
	"defaultRuleTitle": "Kural",
	"ruleTitleTemplate": "Kural ${ruleNumber}",
	"noFilterApplied": "Süzgeç uygulanmadı.",
	"defineFilter": "Süzgeci tanımla",
	"defineFilterAriaLabel": "Süzgeci tanımla: Karmaşık süzgeç kuralları yapılandırılması için bir süzgeç iletişim kutusu açar. Her bir süzgeç kuralı bir sütun, koşul ve değer birleşiminden oluşur. İletişim kutusu açıldığında klavye odağı, değer alanında yer alır. ",
	"conditionEqual": "eşittir",
	"conditionNotEqual": "eşit değildir",
	"conditionLess": "küçüktür",
	"conditionLessEqual": "küçüktür ya da eşittir",
	"conditionGreater": "büyüktür",
	"conditionGreaterEqual": "büyüktür ya da eşittir",
	"conditionContain": "içerir",
	"conditionIs": "şudur",
	"conditionStartWith": "şununla başlar",
	"conditionEndWith": "şununla biter",
	"conditionNotContain": "içermez",
	"conditionIsNot": "şu değildir",
	"conditionNotStartWith": "şununla başlamaz",
	"conditionNotEndWith": "şununla bitmez",
	"conditionBefore": "önce",
	"conditionAfter": "sonra",
	"conditionRange": "aralık",
	"conditionIsEmpty": "boştur",
	"conditionIsNotEmpty": "boş değildir",
	"all": "tümü",
	"any": "herhangi biri",
	"relationAll": "tüm kurallar",
	"waiRelAll": "Aşağıdaki kuralların tümüyle eşleştir:",
	"relationAny": "herhangi bir kural",
	"waiRelAny": "Aşağıdaki kuralların herhangi biriyle eşleştir:",
	"relationMsgFront": "Eşleştir",
	"relationMsgTail": "",
	"and": "ve",
	"or": "veya",
	"addRuleButton": "Kural Ekle",
	"waiAddRuleButton": "Yeni kural ekle",
	"removeRuleButton": "Kuralı kaldır",
	"waiRemoveRuleButtonTemplate": "${0} kuralını kaldır",
	"addRuleButton": "Süzgeç Kuralı Ekle",
	"cancelButton": "İptal",
	"waiCancelButton": "Bu iletişim kutusunu iptal et",
	"clearButton": "Temizle",
	"waiClearButton": "Süzgeci temizle",
	"filterButton": "Süzgeç uygula",
	"waiFilterButton": "Süzgeci gönder",
	"columnSelectLabel": "Sütun:",
	"columnSelectAriaLabel": "Sütun: koşul parçası ${0} / ${1}",
	"waiColumnSelectTemplate": "${0} kuralı için sütun",

	"conditionSelectLabel": "Koşul:",
	"conditionSelectAriaLabel": "İşleç: koşul parçası ${0} / ${1}",
	"waiConditionSelectTemplate": "${0} kuralı için koşul",

	"valueBoxLabel": "Değer:",
	"valueBoxAriaLabel": "Değer: koşul parçası ${0} / ${1}",
	"waiValueBoxTemplate": "${0} kuralı için süzülecek değeri girin",
	"rangeTo": "bitiş",
	"rangeTemplate": "başlangıç: ${0} bitiş: ${1}",
	"statusTipHeaderColumn": "Sütun",
	"statusTipHeaderCondition": "Kurallar",
	"statusTipTitle": "Süzgeç Çubuğu",
	"statusTipMsg": "${0} içindeki değerlere göre süzmek için burada süzme çubuğunu tıklatın.",
	"anycolumn": "herhangi bir sütun",
	"statusTipTitleNoFilter": "Süzgeç Çubuğu",
	"statusTipTitleHasFilter": "Süzgeç",
	"statusTipRelPre": "Eşleştir",
	"statusTipRelPost": "kurallar.",
	"statusTipHeaderAll": "Kuralların tümüyle eşleştir.",
	"statusTipHeaderAny": "Kuralların herhangi biriyle eşleştir.",
	"defaultItemsName": "öğe",
	"filterBarMsgHasFilterTemplate": "${0} / ${1} ${2} gösteriliyor.",
	"filterBarMsgNoFilterTemplate": "Süzgeç uygulanmadı",
	"filterBarDefButton": "Süzgeci tanımla",
	"waiFilterBarDefButton": "Tabloyu süz",
	"a11yFilterBarDefButton": "Süz...",
	"filterBarClearButton": "Süzgeci kaldır",
	"waiFilterBarClearButton": "Süzgeci kaldır",
	"closeFilterBarBtn": "Süzgeç çubuğunu kapat",
	"clearFilterMsg": "Bu süzgeci kaldıracak ve kullanılabilir tüm kayıtları görüntüleyecektir.",
	"anyColumnOption": "Herhangi Bir Sütun",
	"trueLabel": "Doğru",
	"falseLabel": "Yanlış",
	"radioTrueLabel": "Değer Doğru",
	"radioFalseLabel": "Değer Yanlış",
	"beginTimeRangeLabel": "Saat Aralığı Değeri Başlangıcı",
	"endTimeRangeLabel": "Saat Aralığı Değeri Sonu",
	"beginDateRangeLabel": "Tarih Aralığı Değeri Başlangıcı",
	"endDateRangeLabel": "Tarih Aralığı Değeri Sonu",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Tekli Sıralama",
	nestedSort: "İç İçe Sıralama",
	ascending: "Artan düzende sıralamak için tıklatın",
	descending: "Azalan düzende sıralamak için tıklatın",
	sortingState: "${0} - ${1}",
	unsorted: "Bu sütunu sıralama",
	waiSingleSortLabel: "${0} - ${1} öğesine göre sıralı. ${2} öğesine göre sıralamak için seçin.",
	waiNestedSortLabel:"${0} - ${1} öğesine göre iç içe sıralı. ${2} öğesine göre iç içe sıralamak için seçin.",

//PaginationBar
	pagerWai: 'Sayfalayıcı',

	pageIndex: '${0}',
	pageIndexTitle: 'Sayfa ${0}',

	firstPageTitle: 'İlk sayfa',
	prevPageTitle: 'Önceki sayfa',
	nextPageTitle: 'Sonraki sayfa',
	lastPageTitle: 'Son sayfa',

	pageSize: '${0}',
	pageSizeTitle: 'Sayfa başına ${0} öğe',
	pageSizeAll: 'Tümü',
	pageSizeAllTitle: 'Tüm öğeler',

	description: '${0} - ${1} / ${2} öğe.',
	descriptionEmpty: 'Kılavuz boş.',

	summary: 'Toplam: ${0}',
	summaryWithSelection: 'Toplam: ${0} Seçilen: ${1}',

	gotoBtnTitle: 'Belirli bir sayfaya git',

	gotoDialogTitle: 'Sayfaya Git',
	gotoDialogMainMsg: 'Sayfa numarasını belirtin:',
	gotoDialogPageCount: '(${0} sayfa)',
	gotoDialogOKBtn: 'Git',
	gotoDialogCancelBtn: 'İptal',
	// for drop down pagination bar
	pageLabel: 'Sayfa',
	pageSizeLabel: 'Satırlar',

//QuickFilter
	filterLabel: 'Süzgeç',
	clearButtonTitle: 'Süzgeci Temizle',
	buildFilterMenuLabel: 'Süzgeç Oluştur...',
	apply: 'Süzgeci Uygula',

//Sort
	helpMsg: '${0} - Sıralamak için tıklatın ya da sıralamaya eklemek için Ctrl tuşunu basılı tutarak tıklatın.',
	singleHelpMsg: '${0} - Sıralamak için tıklatın',
	priorityOrder: 'sıralama önceliği ${0}',

//SummaryBar
	summaryTotal: 'Toplam: ${0}',
	summarySelected: 'Seçilen: ${0}',
	summaryRange: 'Aralık: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Tümünü seçmek için ARA ÇUBUĞU tuşuna basın.",	//need translation
	indirectDeselectAll: "Tüm seçimi kaldırmak için ARA ÇUBUĞU tuşuna basın.",	//need translation
	treeExpanded: "Bu satırı daraltmak için Control + sol ok tuşlarına basın.",	//need translation
	treeCollapsed: "Bu satırı genişletmek için Control + sağ ok tuşlarına basın."	//need translation
});

