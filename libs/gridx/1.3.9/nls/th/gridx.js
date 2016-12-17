define({     
//Body
	loadingInfo: "กำลังโหลด...",
	emptyInfo: "ไม่มีไอเท็มที่จะแสดง",
	loadFailInfo: "ไม่สามารถโหลดข้อมูล!",
	loadMore: "โหลดเพิ่มเติม",
	loadMoreLoading: "กำลังโหลด...",
	loadPrevious: "โหลดก่อนหน้านี้",
	loadPreviousLoading: "กำลังโหลด...",

//FilterBar
	"clearFilterDialogTitle": "เคลียร์ตัวกรอง",
	"filterDefDialogTitle": "ตัวกรอง",
	"defaultRuleTitle": "กฏ",
	"ruleTitleTemplate": "กฎ ${ruleNumber}",
	"noFilterApplied": "ไม่ได้ใช้ตัวกรอง",
	"defineFilter": "กำหนดตัวกรอง",
	"defineFilterAriaLabel": "กำหนดตัวกรอง: เปิดไดอะล็อกตัวกรองสำหรับการกำหนดคอนฟิกกฎตัวกรองที่ซับซ้อน กฎตัวกรองแต่ละข้อประกอบด้วยชุดของคอลัมน์ เงื่อนไข และค่า เมื่อไดอะล็อกเปิดขึ้น ฟิลด์ค่ามีโฟกัสอยู่ที่คีย์บอร์ด",
	"conditionEqual": "เท่ากับ",
	"conditionNotEqual": "ไม่เท่ากับ",
	"conditionLess": "น้อยกว่า",
	"conditionLessEqual": "น้อยกว่าหรือเท่ากับ",
	"conditionGreater": "มากกว่า",
	"conditionGreaterEqual": "มากกว่าหรือเท่ากับ",
	"conditionContain": "มี",
	"conditionIs": "เป็น",
	"conditionStartWith": "เริ่มต้นด้วย",
	"conditionEndWith": "สิ้นสุดด้วย",
	"conditionNotContain": "ไม่มี",
	"conditionIsNot": "ไม่เป็น",
	"conditionNotStartWith": "ไม่ได้เริ่มต้นด้วย",
	"conditionNotEndWith": "ไม่ได้สิ้นสุดด้วย",
	"conditionBefore": "ก่อนหน้า",
	"conditionAfter": "หลังจาก",
	"conditionRange": "ช่วง",
	"conditionIsEmpty": "ว่าง",
	"conditionIsNotEmpty": "ไม่ว่าง",
	"all": "ทั้งหมด",
	"any": "ใดๆ",
	"relationAll": "กฎทั้งหมด",
	"waiRelAll": "ตรงกับกฎทั้งหมดต่อไปนี้:",
	"relationAny": "กฎใดๆ",
	"waiRelAny": "ตรงกับกฎใดๆ ต่อไปนี้:",
	"relationMsgFront": "จับคู่",
	"relationMsgTail": "",
	"and": "และ",
	"or": "หรือ",
	"addRuleButton": "เพิ่มกฏ",
	"waiAddRuleButton": "เพิ่มกฎใหม่",
	"removeRuleButton": "ลบกฎ",
	"waiRemoveRuleButtonTemplate": "ลบกฎ ${0}",
	"addRuleButton": "เพิ่มกฎตัวกรอง",
	"cancelButton": "ยกเลิก",
	"waiCancelButton": "ยกเลิกไดอะล็อกนี้",
	"clearButton": "เคลียร์",
	"waiClearButton": "เคลียร์ตัวกรอง",
	"filterButton": "ตัวกรอง",
	"waiFilterButton": "ส่งตัวกรอง",
	"columnSelectLabel": "คอลัมน์:",
	"columnSelectAriaLabel": "คอลัมน์: ส่วนเงื่อนไข ${0} ของ ${1}",
	"waiColumnSelectTemplate": "คอลัมน์สำหรับกฎ ${0}",

	"conditionSelectLabel": "เงื่อนไข:",
	"conditionSelectAriaLabel": "ตัวดำเนินการ: ส่วนเงื่อนไข ${0} ของ ${1}",
	"waiConditionSelectTemplate": "เงื่อนไขสำหรับกฎ ${0}",

	"valueBoxLabel": "ค่า:",
	"valueBoxAriaLabel": "ค่า: ส่วนเงื่อนไข ${0} ของ ${1}",
	"waiValueBoxTemplate": "ป้อนค่าที่จะกรองสำหรับกฎ ${0}",
	"rangeTo": "ถึง",
	"rangeTemplate": "จาก ${0} ถึง ${1}",
	"statusTipHeaderColumn": "คอลัมน์",
	"statusTipHeaderCondition": "กฎ",
	"statusTipTitle": "แถบตัวกรอง",
	"statusTipMsg": "คลิกแถบตัวกรองที่นี่เพื่อกรองค่าใน ${0}",
	"anycolumn": "คอลัมน์ใดๆ",
	"statusTipTitleNoFilter": "แถบตัวกรอง",
	"statusTipTitleHasFilter": "ตัวกรอง",
	"statusTipRelPre": "จับคู่",
	"statusTipRelPost": "กฎ",
	"statusTipHeaderAll": "ตรงกับกฎทั้งหมด",
	"statusTipHeaderAny": "ตรงกับกฎใดๆ",
	"defaultItemsName": "ไอเท็ม",
	"filterBarMsgHasFilterTemplate": "${0} จาก ${1} ${2} แสดงขึ้น",
	"filterBarMsgNoFilterTemplate": "ไม่ได้ใช้ตัวกรอง",
	"filterBarDefButton": "กำหนดตัวกรอง",
	"waiFilterBarDefButton": "กรองตาราง",
	"a11yFilterBarDefButton": "ตัวกรอง...",
	"filterBarClearButton": "เคลียร์ตัวกรอง",
	"waiFilterBarClearButton": "เคลียร์ตัวกรอง",
	"closeFilterBarBtn": "ปิดแถบตัวกรอง",
	"clearFilterMsg": "ซึ่งจะลบตัวกรอง และแสดงเร็กคอร์ดที่พร้อมใช้งานทั้งหมด",
	"anyColumnOption": "คอลัมน์ใดๆ",
	"trueLabel": "จริง",
	"falseLabel": "เท็จ",
	"radioTrueLabel": "ค่าจริง",
	"radioFalseLabel": "ค่าเท็จ",
	"beginTimeRangeLabel": "ค่าเริ่มต้นช่วงเวลา",
	"endTimeRangeLabel": "ค่าสิ้นสุดช่วงเวลา",
	"beginDateRangeLabel": "ค่าเริ่มต้นช่วงวันที่",
	"endDateRangeLabel": "ค่าสิ้นสุดช่วงวันที่",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "เรียงลำดับระดับเดียว",
	nestedSort: "เรียงลำดับที่ซ้อนใน",
	ascending: "คลิกเพื่อเรียงลำดับจากน้อยไปมาก",
	descending: "คลิกเพื่อเรียงลำดับจากมากไปน้อย",
	sortingState: "${0} - ${1}",
	unsorted: "อย่าเรียงลำดับคอลัมน์นี้",
	waiSingleSortLabel: "${0} - มีการเรียงลำดับตาม ${1} เลือกเพื่อเรียงลำดับตาม ${2}",
	waiNestedSortLabel:"${0} - มีการเรียงลำดับที่ซ้อนในตาม ${1} เลือกเพื่อเรียงลำดับที่ซ้อนในตาม ${2}",

//PaginationBar
	pagerWai: 'เพเจอร์',

	pageIndex: '${0}',
	pageIndexTitle: 'หน้า ${0}',

	firstPageTitle: 'หน้าแรก',
	prevPageTitle: 'หน้าก่อนหน้านี้',
	nextPageTitle: 'หน้าถัดไป',
	lastPageTitle: 'หน้าสุดท้าย',

	pageSize: '${0}',
	pageSizeTitle: '${0} ไอเท็มต่อหน้า',
	pageSizeAll: 'ทั้งหมด',
	pageSizeAllTitle: 'ไอเท็มทั้งหมด',

	description: '${0} - ${1} จาก ${2} ไอเท็ม',
	descriptionEmpty: 'เส้นกริดว่าง',

	summary: 'ทั้งหมด: ${0}',
	summaryWithSelection: 'ทั้งหมด: ${0} ที่เลือก: ${1}',

	gotoBtnTitle: 'ไปยังหน้าที่ระบุ',

	gotoDialogTitle: 'ไปยังหน้า',
	gotoDialogMainMsg: 'ระบุหมายเลขหน้า:',
	gotoDialogPageCount: '(${0} หน้า)',
	gotoDialogOKBtn: 'ไป',
	gotoDialogCancelBtn: 'ยกเลิก',
	// for drop down pagination bar
	pageLabel: 'หน้า',
	pageSizeLabel: 'แถว',

//QuickFilter
	filterLabel: 'ตัวกรอง',
	clearButtonTitle: 'เคลียร์ตัวกรอง',
	buildFilterMenuLabel: 'สร้างตัวกรอง...',
	apply: 'ใช้ตัวกรอง',

//Sort
	helpMsg: '${0} - คลิกเพื่อเรียง หรือ control-คลิก เพื่อเพิ่มการเรียง',
	singleHelpMsg: '${0} - คลิกเพื่อเรียง',
	priorityOrder: 'เรียงลำดับความสำคัญ ${0}',

//SummaryBar
	summaryTotal: 'ทั้งหมด: ${0}',
	summarySelected: 'ที่เลือก: ${0}',
	summaryRange: 'ช่วง: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "กด SPACE เพื่อเลือกทั้งหมด",	//need translation
	indirectDeselectAll: "กด SPACE เพื่อยกเลิกการเลือกทั้งหมด",	//need translation
	treeExpanded: "Control + แป้นลูกศรซ้ายเพื่อยุบแถวนี้",	//need translation
	treeCollapsed: "Control + แป้นลูกศรขวาเพื่อขยายแถวนี้"	//need translation
});

