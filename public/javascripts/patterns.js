$(document).ready(function(){

	var source   = $("#input-results-template").html();
    var inputTemplate = Handlebars.compile(source);
    var $allpatterns = $('.allPatterns');

    $.get('/getpatterns', function(patterns){
    	// individually log out each pattern
    	// use template for rendering a pattern
    	// append to /patterns page
    	if (patterns.length > 0) {
	    	for (var i = 0; i < patterns.length; i++) {
	    		$allpatterns.append(inputTemplate(patterns[i]));
	    	}
    	}
    });

    // Add a new pattern
	$(document).on('click', '.addPatternLink', function(e){
		e.preventDefault();

		$('.patternForm').on('click', '.submitButton',function(e){
			e.preventDefault();
			var that = $(this).closest('div.modal-content').find('form.newPattern');
			var company = that.find('.company').val();
			var desc = that.find('.desc').val();
			var size = that.find('.size').val();
			var id = that.find('.id').val();
			var url = that.find('.url').val();
			var imageurl = that.find('.imageurl').val();
			var newpattern = {company: company, desc: desc, size: size, id: id, url: url, imageurl: imageurl};

			$.post('/addpattern', newpattern, function(pattern){
				//include error handling here
				$allpatterns.append(inputTemplate(newpattern));
			});
		});
	});

	//should empty the pattern form input fields BUT DOES NOT!!!!
	$(document).on('click', '.closeButton', function(){

		$(this).closest('div.modal-content').find('input').each(function(){
			console.log('this placeholder', $(this).find('placeholder'));
			$(this).find('text').val('');
			$(this).find('placeholder').remove();

			//maybe try:
			$(this).closest('form').find("input[type=text], textarea").val("");
			// console.log('empty input', $(this).each('input').empty());
		});
	});

	// Edit or delete an existing pattern
	$(document).on('click', '.pattern', function(e){
		e.preventDefault();
		var objectId = $(this).attr('data-attr');
	
		$.post('/activepattern', {objectId: objectId}, function(pattern){
			//include error handling here
			var activePattern = pattern;
			$('input:text').each(function(){
				var keyname = $(this).attr('name');
				$(this).attr('placeholder', activePattern[keyname]);
			});
			//delete pattern
			$('.patternForm').on('click', '.deleteButton', function(e) {
				e.preventDefault();
				var response = confirm('Are you sure you want to remove this pattern from your library?');
				if (response == true) {
					// pattern id gets sent to server to remove from db
					$.post('/deletepattern', {objectId: objectId}, function(id){
						// remove deleted pattern from DOM (or should)
						$('div').find("[data-attr='"+id+"']").remove();
					});
				}
				else {
					console.log('Request canceled.');
				}	
			});
		});


		$('.patternForm').on('click', '.submitButton',function(e){
			e.preventDefault();

			
		});
	});
	
}); //end of document ready