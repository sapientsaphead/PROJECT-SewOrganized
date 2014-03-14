$(document).ready(function(){

	// $('#menu-container > ul').prepend('<li class="mobile"><a href="#"><span>Menu <i>&#9776;</i></span></a></li>');
	// $('#menu-container > ul > li > a').click(function(e) {
	// 	$('#menu-container li').removeClass('active');
	// 	$(this).closest('li').addClass('active');	
	// 	var checkElement = $(this).next();
	// 	if((checkElement.is('ul')) && (checkElement.is(':visible'))) {
	// 		$(this).closest('li').removeClass('active');
	// 		checkElement.slideUp('normal');
	// 	}
	// 	if((checkElement.is('ul')) && (!checkElement.is(':visible'))) {
	// 		$('#menu-container ul ul:visible').slideUp('normal');
	// 		checkElement.slideDown('normal');
	// 	}
	// 	if( $(this).parent().hasClass('mobile') ) {
	// 		e.preventDefault();
	// 		$('#menu-container').toggleClass('expand');
	// 	}
	// 	if($(this).closest('li').find('ul').children().length == 0) {
	// 		return true;
	// 	} else {
	// 		return false;	
	// 	}		
	// });
		
	$('.has-sub').click(function(e) {
		e.preventDefault();
		console.log(this);
		$(this).find('li').toggleClass('show');
	})


}); //end of document ready