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

	// Edit or delete an existing pattern
	$(document).on('click', '.pattern', function(e){
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
	
}); //end of document ready