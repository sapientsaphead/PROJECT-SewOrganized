$(document).ready(function(){

	$(document).on('click', '.addPatternLink', function(e){
		e.preventDefault();
		var thatClosest = $(this).closest('div.patterns');
		var thatParent = $(this).parent();
		console.log('that', thatClosest);
		var addPatternForm = '<div class="patternForm">' +
							'<form class="newPattern">'+
							'<div class="form-field-group">'+
							'<label class="input-label">Company: </label><input class="form-field company" type="text" name="company"><br>' +
							'</div>' +
							'<div class="form-field-group">'+
							'<label class="input-label">Name: </label><input class="form-field name" type="text" name="name"><br>' +
							'</div>' +
							'<div class="form-field-group">'+
							'<label class="input-label">Id: </label><input class="form-field id" type="text" name="id"><br>' +
							'</div>' +
							'<div class="form-field-group">'+
							'<label class="input-label">Size: </label><input class="form-field size" type="text" name="size"><br>' +
							'</div>' +
							'<div class="form-field-group">'+
							'<label class="input-label">URL: </label><input class="form-field url" type="text" name="url"><br>' +
							'</div>' +
							'<div class="form-field-group">'+
							'<label class="input-label">ImageURL: </label><input class="form-field imageurl" type="text" name="imageurl"><br>' +
							'</div>' +
							'<div class="inputSubmit form-field-group">'+
							'<input class="submitButton" type="submit" value="Submit">' +
							'</div>' +
							'</form>' +
							'</div>'

		thatClosest.append(addPatternForm);
		thatParent.css('display', 'none');

		$('.patternForm').submit(function(e){
			e.preventDefault();
			var company = $(this).find('.company').val();
			var name = $(this).find('.name').val();
			var id = $(this).find('.id').val();
			var url = $(this).find('.url').val();
			var imageurl = $(this).find('.imageurl').val();

			$.post('/addpattern', {company: company, name: name, id: id, url: url, imageurl: imageurl}, function(pattern){
			
		});

		$('div.addPattern').css('display', 'block')
		$('div.patternForm').empty();
		});
	});
	
}); //end of document ready