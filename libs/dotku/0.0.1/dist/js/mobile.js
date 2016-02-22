var selScrollable = '.scrollable';
// Uses document because document will be topmost level in bubbling
$(document).on('touchmove',function(e){
  e.preventDefault();
});
// Uses body because jQuery on events are called off of the element they are
// added to, so bubbling would not work if we used document instead.
$('body').on('touchstart', selScrollable, function(e) {
  if (e.currentTarget.scrollTop === 0) {
    e.currentTarget.scrollTop = 1;
  } else if (e.currentTarget.scrollHeight === e.currentTarget.scrollTop + e.currentTarget.offsetHeight) {
    e.currentTarget.scrollTop -= 1;
  }
});
// Stops preventDefault from being called on document if it sees a scrollable div
$('body').on('touchmove', selScrollable, function(e) {
  e.stopPropagation();
});