define({     
//Body
	loadingInfo: "Lataus on meneillään...",
	emptyInfo: "Näytettäviä tietoja ei ole",
	loadFailInfo: "Tietojen lataus ei onnistunut.",
	loadMore: "Lataa seuraavat",
	loadMoreLoading: "Lataus on meneillään...",
	loadPrevious: "Lataa edelliset",
	loadPreviousLoading: "Lataus on meneillään...",

//FilterBar
	"clearFilterDialogTitle": "Tyhjennä suodatin",
	"filterDefDialogTitle": "Suodatin",
	"defaultRuleTitle": "Sääntö",
	"ruleTitleTemplate": "Sääntö ${ruleNumber}",
	"noFilterApplied": "Suodatinta ei ole käytössä.",
	"defineFilter": "Määritä suodatin",
	"defineFilterAriaLabel": "Määritä suodatin: Avaa suodattimen valintaikkunan monimutkaisten suodatussääntöjen määritystä varten. Kukin suodatussääntö koostuu sarakkeen, ehdon ja arvon yhdistelmästä. Kun valintaikkuna aukeaa, näppäimistön kohdealue on arvokentässä.",
	"conditionEqual": "on yhtä suuri kuin",
	"conditionNotEqual": "ei ole yhtä suuri kuin",
	"conditionLess": "on pienempi kuin",
	"conditionLessEqual": "on pienempi tai yhtä suuri kuin",
	"conditionGreater": "on suurempi kuin",
	"conditionGreaterEqual": "on suurempi tai yhtä suuri kuin",
	"conditionContain": "sisältää",
	"conditionIs": "on",
	"conditionStartWith": "alkaa merkeillä",
	"conditionEndWith": "loppuu merkkeihin",
	"conditionNotContain": "ei sisällä",
	"conditionIsNot": "ei ole",
	"conditionNotStartWith": "ei ala merkeillä",
	"conditionNotEndWith": "ei lopu merkkihin",
	"conditionBefore": "ennen",
	"conditionAfter": "jälkeen",
	"conditionRange": "vaihtelualue",
	"conditionIsEmpty": "on tyhjä",
	"conditionIsNotEmpty": "ei ole tyhjä",
	"all": "kaikki",
	"any": "mikä tahansa",
	"relationAll": "kaikki säännöt",
	"waiRelAll": "Vastaa kaikkia seuraavia sääntöjä:",
	"relationAny": "mikä tahansa sääntö",
	"waiRelAny": "Vastaa jotakin seuraavista säännöistä:",
	"relationMsgFront": "Vastaa",
	"relationMsgTail": "",
	"and": " -",
	"or": "tai",
	"addRuleButton": "Lisää sääntö",
	"waiAddRuleButton": "Lisää uusi sääntö",
	"removeRuleButton": "Poista sääntö",
	"waiRemoveRuleButtonTemplate": "Poista sääntö ${0}",
	"addRuleButton": "Lisää suodatussääntö",
	"cancelButton": "Peruuta",
	"waiCancelButton": "Peruuta tämä valintaikkuna",
	"clearButton": "Tyhjennä",
	"waiClearButton": "Tyhjennä suodatin.",
	"filterButton": "Suodatin",
	"waiFilterButton": "Lähetä suodatin",
	"columnSelectLabel": "Sarake:",
	"columnSelectAriaLabel": "Sarake: ehdon osa ${0}/${1}",
	"waiColumnSelectTemplate": "Sarake säännölle ${0}",

	"conditionSelectLabel": "Ehto:",
	"conditionSelectAriaLabel": "Operaattori: ehdon osa ${0}/${1}",
	"waiConditionSelectTemplate": "Ehto säännölle ${0}",

	"valueBoxLabel": "Arvo:",
	"valueBoxAriaLabel": "Arvo: ehdon osa ${0}/${1}",
	"waiValueBoxTemplate": "Anna suodatusarvo säännölle ${0}",
	"rangeTo": "-",
	"rangeTemplate": "${0} - ${1}",
	"statusTipHeaderColumn": "Sarake",
	"statusTipHeaderCondition": "Säännöt",
	"statusTipTitle": "Suodatinpalkki",
	"statusTipMsg": "Napsauta suodatinpalkkia tässä ja suodata arvot kohteessa ${0}.",
	"anycolumn": "mikä tahansa sarake",
	"statusTipTitleNoFilter": "Suodatinpalkki",
	"statusTipTitleHasFilter": "Suodatin",
	"statusTipRelPre": "Vastaa",
	"statusTipRelPost": "sääntöä.",
	"statusTipHeaderAll": "Vastaa kaikkia sääntöjä.",
	"statusTipHeaderAny": "Vastaa jotakin sääntöä.",
	"defaultItemsName": "kohdetta",
	"filterBarMsgHasFilterTemplate": "${0} / ${1} ${2} näkyy.",
	"filterBarMsgNoFilterTemplate": "Suodatinta ei ole käytössä",
	"filterBarDefButton": "Määritä suodatin",
	"waiFilterBarDefButton": "Suodata taulukko",
	"a11yFilterBarDefButton": "Suodata...",
	"filterBarClearButton": "Tyhjennä suodatin",
	"waiFilterBarClearButton": "Tyhjennä suodatin.",
	"closeFilterBarBtn": "Sulje suodatinpalkki",
	"clearFilterMsg": "Tämä poistaa suodattimen ja näyttää kaikki käytettävissä olevat tietueet.",
	"anyColumnOption": "Mikä tahansa sarake",
	"trueLabel": "Tosi",
	"falseLabel": "Epätosi",
	"radioTrueLabel": "Arvo tosi",
	"radioFalseLabel": "Arvo epätosi",
	"beginTimeRangeLabel": "Aikavälin alkuarvo",
	"endTimeRangeLabel": "Aikavälin loppuarvo",
	"beginDateRangeLabel": "Päivämäärävälin alkuarvo",
	"endDateRangeLabel": "Päivämäärävälin loppuarvo",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Yksinkertainen lajittelu",
	nestedSort: "Sisäkkäinen lajittelu",
	ascending: "Lajittele nousevaan järjestykseen napsauttamalla",
	descending: "Lajittele laskevaan järjestykseen napsauttamalla",
	sortingState: "${0} - ${1}",
	unsorted: "Älä lajittele tätä saraketta",
	waiSingleSortLabel: "${0} - on lajiteltu sarakkeen ${1} mukaan. Lajittele sarakkeen ${2} perusteella",
	waiNestedSortLabel:"${0} - on lajiteltu sisäkkäisesti sarakkeen ${1} mukaan. Lajittele sisäisesti sarakkeen ${2} perusteella",

//PaginationBar
	pagerWai: 'Sivutus',

	pageIndex: '${0}',
	pageIndexTitle: 'Sivu ${0}',

	firstPageTitle: 'Ensimmäinen sivu',
	prevPageTitle: 'Edellinen sivu',
	nextPageTitle: 'Seuraava sivu',
	lastPageTitle: 'Viimeinen sivu',

	pageSize: '${0}',
	pageSizeTitle: '${0} kohdetta sivulla',
	pageSizeAll: 'Kaikki',
	pageSizeAllTitle: 'Kaikki kohteet',

	description: '${0} - ${1} / ${2} kohdetta.',
	descriptionEmpty: 'Ruudukko on tyhjä.',

	summary: 'Kokonaismäärä: ${0}',
	summaryWithSelection: 'Kokonaismäärä: ${0} Valitut: ${1}',

	gotoBtnTitle: 'Siirry tietylle sivulle',

	gotoDialogTitle: 'Siirry sivulle',
	gotoDialogMainMsg: 'Määritä sivunumero:',
	gotoDialogPageCount: ' (${0} sivua)',
	gotoDialogOKBtn: 'Siirry',
	gotoDialogCancelBtn: 'Peruuta',
	// for drop down pagination bar
	pageLabel: 'Sivu',
	pageSizeLabel: 'Rivit',

//QuickFilter
	filterLabel: 'Suodatin',
	clearButtonTitle: 'Tyhjennä suodatin',
	buildFilterMenuLabel: 'Muodosta suodatin...',
	apply: 'Käytä suodatinta',

//Sort
	helpMsg: '${0} - Lajittele napsauttamalla tai lisää lajitteluehtoihin pitämällä Ctrl-näppäintä painettuna ja napsauttamalla',
	singleHelpMsg: '${0} - Lajittele napsauttamalla',
	priorityOrder: 'lajitteluprioriteetti ${0}',

//SummaryBar
	summaryTotal: 'Kokonaismäärä: ${0}',
	summarySelected: 'Valitut: ${0}',
	summaryRange: 'Alue: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Valitse kaikki painamalla välinäppäintä.",	//need translation
	indirectDeselectAll: "Poista kaikkien valinta painamalla välinäppäintä.",	//need translation
	treeExpanded: "Pienennä tämä rivi painamalla Ctrl- ja vasenta nuolinäppäintä.",	//need translation
	treeCollapsed: "Laajenna tämä rivi painamalla Ctrl- ja oikeaa nuolinäppäintä."	//need translation
});

