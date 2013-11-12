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
    // Selects data-attr for existing patterns
	$(document).on('click', '.pattern', function(e){
		e.preventDefault();
		var objectId = $(this).attr('data-attr');
		console.log()
		$.post('/activepattern', {objectId: objectId}, function(pattern){
			// prepopulate form fields with pattern data
			var activePattern = pattern;
			$('input').each(function(){
				var keyname = $(this).attr('name');
				$(this).val(activePattern[keyname]);
			});
		});
	});

		
    // Add or edit a pattern
	$('.patternForm').on('click', '.submitButton',function(e){
		e.preventDefault();
		// var patternId = $(this).attr('name').val();
		var that = $(this).closest('div.modal-content').find('form.newPattern');
		var company = that.find('.company').val();
		var desc = that.find('.desc').val();
		var size = that.find('.size').val();
		var id = that.find('.id').val();
		var url = that.find('.url').val();
		var imageurl = that.find('.imageurl').val();
		var patternId = that.find('.patternId').val();
		console.log('my patternid', patternId);
		if (patternId.length > 0) {
			console.log('I am an existing pattern');
			var editpattern = {patternId: patternId, company: company, desc: desc, size: size, id: id, url: url, imageurl: imageurl};			
			$.post('/addpattern', editpattern, function(pattern){
				//include error handling here
				$('div').find("[data-attr='"+patternId+"']").remove();
				$allpatterns.append(inputTemplate(pattern));
			});
		}
		else {
			console.log('I am a new pattern');
			var newpattern = {company: company, desc: desc, size: size, id: id, url: url, imageurl: imageurl};

			$.post('/addpattern', newpattern, function(pattern){
				//include error handling here
				$allpatterns.append(inputTemplate(pattern));
			});
		}
		objectId = '';
		that.find('.patternId').val('');
	});

	// delete pattern
	$('.deleteButton').on('click', function(e) {
		e.preventDefault();
		var objectId = $(this).closest('div.patternForm').find('input.patternId').val();

		var response = confirm('Are you sure you want to remove this pattern from your library?');
		if (response == true) {
			// pattern id gets sent to server to remove from db
			$.post('/deletepattern', {objectId: objectId}, function(id){
				// remove deleted pattern from DOM
				$('div').find("[data-attr='"+id+"']").remove();
			});
		}
		else {
			console.log('Request canceled.');
		}	
	});

	// empty the pattern form input fields on modal close
	$('.patternForm').on('click', '.closeButton', function(e){
		e.preventDefault();
		$(this).closest('div.modal-content').find('input').each(function(){
			$(this).closest('form').find('input[type=text], textarea').val('');
		});
	});
	
}); //end of document ready