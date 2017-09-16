$(document).ready(function() {
	if ($.fn.cssOriginal!=undefined)
		$.fn.css = $.fn.cssOriginal;

	/*-------------------------------------------------*/
	
	$('.fullwidthbanner').each(function() {
		$(this).revolution({    
			delay					: 10000,
			startwidth				: 1090,
			startheight				: 492,
			onHoverStop				: "on",
			thumbWidth				: 100,
			thumbHeight				: 50,
			thumbAmount				: 3,
			hideThumbs				: 0,
			navigationType			: "bullet",
			navigationArrows		: "solo",
			navigationStyle			: "round",
			navigationHAlign		: "center",
			navigationVAlign		: "bottom",
			navigationHOffset		: 0,
			navigationVOffset		: 20,
			soloArrowLeftHalign		: "left",
			soloArrowLeftValign		: "center",
			soloArrowLeftHOffset	: 20,
			soloArrowLeftVOffset	: 0,
			soloArrowRightHalign	: "right",
			soloArrowRightValign	: "center",
			soloArrowRightHOffset	: 20,
			soloArrowRightVOffset	: 0,
			touchenabled			: "on",
			stopAtSlide				: -1,
			stopAfterLoops			: -1,
			hideCaptionAtLimit 		: 0,
			hideAllCaptionAtLilmit 	: 0,
			hideSliderAtLimit		: 0, 
			fullWidth 				: "on",
			shadow 					:0,
		});
	});

	/*-------------------------------------------------*/

	$('.b-switch').on('click', function() {
		$('.tp-rightarrow').trigger('click');
	});
});