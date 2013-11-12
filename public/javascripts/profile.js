$(document).ready(function(){

	var source   = $("#profile-results-template").html();
    var inputTemplate = Handlebars.compile(source);
    var $allpatterns = $('.allPatterns');

   	var username = 'unicorn';
   	console.log('yay!');
    $.get('/profile/'+username, function(user){
    	
  		console.log('the user', user);
	    
    });

	$(document).on('click', '.appointment-text', function appointmentClickHandler() {
                var dayEl = $(this).closest('.day');
                $(this).hide();
                var formEl = createAppointmentForm('edit-appointment', $(this).text());
                $(this).after(formEl);
                formEl.find('input:first').focus();
        });

}); //end of document load