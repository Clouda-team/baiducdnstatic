define({     
//Body
	loadingInfo: "Ðang tải...",
	emptyInfo: "Không có mục nào để hiển thị",
	loadFailInfo: "Không thể tải dữ liệu!",
	loadMore: "Tải thêm",
	loadMoreLoading: "Ðang tải...",
	loadPrevious: "Tải trước đó",
	loadPreviousLoading: "Ðang tải...",

//FilterBar
	"clearFilterDialogTitle": "Xóa bộ lọc",
	"filterDefDialogTitle": "Bộ lọc",
	"defaultRuleTitle": "Quy tắc",
	"ruleTitleTemplate": "Quy tắc ${ruleNumber}",
	"noFilterApplied": "Không có bộ lọc nào được áp dụng.",
	"defineFilter": "Xác định bộ lọc",
	"defineFilterAriaLabel": "Xác định bộ lọc: Mở hộp thoại lọc để cấu hình quy tắc lọc phức tạp. Mỗi quy tắc lọc được tạo thành từ kết hợp của cột, điều kiện và giá trị. Khi hộp thoại mở, trường giá trị có tiêu điểm bàn phím.",
	"conditionEqual": "bằng",
	"conditionNotEqual": "không bằng",
	"conditionLess": "nhỏ hơn",
	"conditionLessEqual": "nhỏ hơn hoặc bằng",
	"conditionGreater": "lớn hơn",
	"conditionGreaterEqual": "lớn hơn hoặc bằng",
	"conditionContain": "chứa",
	"conditionIs": "là",
	"conditionStartWith": "bắt đầu với",
	"conditionEndWith": "kết thúc với",
	"conditionNotContain": "không chứa",
	"conditionIsNot": "không là",
	"conditionNotStartWith": "không bắt đầu với",
	"conditionNotEndWith": "không kết thúc với",
	"conditionBefore": "trước khi",
	"conditionAfter": "sau khi",
	"conditionRange": "phạm vi",
	"conditionIsEmpty": "rỗng",
	"conditionIsNotEmpty": "không rỗng",
	"all": "tất cả",
	"any": "bất kỳ",
	"relationAll": "tất cả quy tắc",
	"waiRelAll": "Khớp tất cả các quy tắc sau:",
	"relationAny": "bất kỳ quy tắc nào",
	"waiRelAny": "Khớp bất kỳ quy tắc nào sau đây:",
	"relationMsgFront": "Khớp",
	"relationMsgTail": "",
	"and": "và",
	"or": "hoặc",
	"addRuleButton": "Thêm quy tắc",
	"waiAddRuleButton": "Thêm quy tắc mới",
	"removeRuleButton": "Xóa quy tắc",
	"waiRemoveRuleButtonTemplate": "Xóa quy tắc ${0}",
	"addRuleButton": "Thêm quy tắc lọc",
	"cancelButton": "Hủy",
	"waiCancelButton": "Hủy hội thoại này",
	"clearButton": "Xóa",
	"waiClearButton": "Xóa bộ lọc",
	"filterButton": "Bộ lọc",
	"waiFilterButton": "Gửi bộ lọc",
	"columnSelectLabel": "Cột:",
	"columnSelectAriaLabel": "Cột: phần điều kiện ${0} của ${1}",
	"waiColumnSelectTemplate": "Cột cho quy tắc ${0}",

	"conditionSelectLabel": "Ðiều kiện:",
	"conditionSelectAriaLabel": "Toán tử: phần điều kiện ${0} của ${1}",
	"waiConditionSelectTemplate": "Ðiều kiện cho quy tắc ${0}",

	"valueBoxLabel": "Giá trị:",
	"valueBoxAriaLabel": "Giá trị: phần điều kiện ${0} của ${1}",
	"waiValueBoxTemplate": "Nhập giá trị để lọc cho quy tắc ${0}",
	"rangeTo": "đến",
	"rangeTemplate": "từ ${0} đến ${1}",
	"statusTipHeaderColumn": "Cột",
	"statusTipHeaderCondition": "Quy tắc",
	"statusTipTitle": "Thanh lọc",
	"statusTipMsg": "Nhấp vào thanh lọc tại đây để lọc các giá trị trong ${0}.",
	"anycolumn": "cột bất kỳ",
	"statusTipTitleNoFilter": "Thanh lọc",
	"statusTipTitleHasFilter": "Bộ lọc",
	"statusTipRelPre": "Khớp",
	"statusTipRelPost": "quy tắc.",
	"statusTipHeaderAll": "Khớp tất cả quy tắc.",
	"statusTipHeaderAny": "Khớp bất kỳ quy tắc nào.",
	"defaultItemsName": "mục",
	"filterBarMsgHasFilterTemplate": "${0} trong ${1} ${2} được hiển thị.",
	"filterBarMsgNoFilterTemplate": "Không có bộ lọc nào được áp dụng",
	"filterBarDefButton": "Xác định bộ lọc",
	"waiFilterBarDefButton": "Lọc bảng",
	"a11yFilterBarDefButton": "Lọc...",
	"filterBarClearButton": "Xóa bộ lọc",
	"waiFilterBarClearButton": "Xóa bộ lọc",
	"closeFilterBarBtn": "Ðóng thanh lọc",
	"clearFilterMsg": "Thao tác này sẽ xóa bộ lọc và hiển thị toàn bộ bản ghi hiện có.",
	"anyColumnOption": "Cột bất kỳ",
	"trueLabel": "Ðúng",
	"falseLabel": "Sai",
	"radioTrueLabel": "Giá trị Đúng",
	"radioFalseLabel": "Giá trị Sai",
	"beginTimeRangeLabel": "Bắt đầu giá trị khoảng thời gian",
	"endTimeRangeLabel": "Kết thúc giá trị khoảng thời gian",
	"beginDateRangeLabel": "Bắt đầu giá trị phạm vi ngày",
	"endDateRangeLabel": "Kết thúc giá trị phạm vi ngày",
	"startsWithExpr": "${0}*",

//NestedSort
	singleSort: "Sắp xếp riêng lẻ",
	nestedSort: "Sắp xếp lồng nhau",
	ascending: "Nhấp để sắp xếp Tăng dần",
	descending: "Nhấp để sắp xếp Giảm dần",
	sortingState: "${0} - ${1}",
	unsorted: "Không được sắp xếp cột này",
	waiSingleSortLabel: "${0} - được sắp xếp theo ${1}. Chọn để sắp xếp theo ${2}",
	waiNestedSortLabel:"${0} - được sắp xếp lồng nhau theo ${1}. Chọn để sắp xếp lồng nhau theo ${2}",

//PaginationBar
	pagerWai: 'Người đánh số trang',

	pageIndex: '${0}',
	pageIndexTitle: 'Trang ${0}',

	firstPageTitle: 'Trang đầu',
	prevPageTitle: 'Trang trước',
	nextPageTitle: 'Trang tiếp theo',
	lastPageTitle: 'Trang cuối',

	pageSize: '${0}',
	pageSizeTitle: '${0} mục trên mỗi trang',
	pageSizeAll: 'Tất cả',
	pageSizeAllTitle: 'Tất cả các mục',

	description: '${0} - ${1} trong ${2} mục.',
	descriptionEmpty: 'Lưới rỗng.',

	summary: 'Tổng số: ${0}',
	summaryWithSelection: 'Tổng số: ${0} được chọn: ${1}',

	gotoBtnTitle: 'Ði đến trang cụ thể',

	gotoDialogTitle: 'Ði đến Trang',
	gotoDialogMainMsg: 'Ðịnh rõ số trang:',
	gotoDialogPageCount: '(${0} trang)',
	gotoDialogOKBtn: 'Ði đến',
	gotoDialogCancelBtn: 'Hủy',
	// for drop down pagination bar
	pageLabel: 'Trang',
	pageSizeLabel: 'Hàng',

//QuickFilter
	filterLabel: 'Bộ lọc',
	clearButtonTitle: 'Xóa bộ lọc',
	buildFilterMenuLabel: 'Tạo bộ lọc…',
	apply: 'Áp dụng bộ lọc',

//Sort
	helpMsg: '${0} - Nhấp để sắp xếp hoặc nhấn phím Control và nhấp để thêm để sắp xếp',
	singleHelpMsg: '${0} - Nhấp để sắp xếp',
	priorityOrder: 'mức ưu tiên sắp xếp ${0}',

//SummaryBar
	summaryTotal: 'Tổng cộng: ${0}',
	summarySelected: 'Ðã chọn: ${0}',
	summaryRange: 'Phạm vi: ${0}-${1}',	//need translation

//Other
	indirectSelectAll: "Nhấn DẤU CÁCH để chọn tất cả.",	//need translation
	indirectDeselectAll: "Nhấn DẤU CÁCH để bỏ chọn tất cả.",	//need translation
	treeExpanded: "Control + phím mũi tên trái để thu gọn hàng này.",	//need translation
	treeCollapsed: "Control + phím mũi tên phải để mở rộng hàng này."	//need translation
});

