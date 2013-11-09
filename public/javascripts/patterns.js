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

	$(document).on('click', '.addPatternLink', function(e){
		e.preventDefault();
		// var that = $(this).parent().closest('div.patterns').find('div.patternForm');

		// var addPatternForm = '<form class="newPattern">'+
		// 					'<div class="form-field-group">'+
		// 					'<label class="input-label">Company: </label><input class="form-field company" type="text" name="company"><br>' +
		// 					'</div>' +
		// 					'<div class="form-field-group">'+
		// 					'<label class="input-label">Description: </label><input class="form-field desc" type="text" name="desc"><br>' +
		// 					'</div>' +
		// 					'<div class="form-field-group">'+
		// 					'<label class="input-label">Id: </label><input class="form-field id" type="text" name="id"><br>' +
		// 					'</div>' +
		// 					'<div class="form-field-group">'+
		// 					'<label class="input-label">Size: </label><input class="form-field size" type="text" name="size"><br>' +
		// 					'</div>' +
		// 					'<div class="form-field-group">'+
		// 					'<label class="input-label">URL: </label><input class="form-field url" type="text" name="url"><br>' +
		// 					'</div>' +
		// 					'<div class="form-field-group">'+
		// 					'<label class="input-label">ImageURL: </label><input class="form-field imageurl" type="text" name="imageurl"><br>' +
		// 					'</div>' +
		// 					'<div class="inputSubmit" form-field-group">'+
		// 					'<input class="submitButton" type="submit" value="Submit">' +
		// 					'</div>' +
		// 					'</form>'
							

		// that.append(addPatternForm);


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