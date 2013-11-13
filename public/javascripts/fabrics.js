$(document).ready(function(){

	var source   = $("#input-results-template").html();
    var inputTemplate = Handlebars.compile(source);
    var $allfabrics = $('.allfabrics');

    $.get('/getfabrics', function(fabrics){
    	// individually log out each fabric
    	// use template for rendering a fabric
    	// append to /fabrics page
    	if (fabrics.length > 0) {
	    	for (var i = 0; i < fabrics.length; i++) {
	    		$allfabrics.append(inputTemplate(fabrics[i]));
	    	}
    	}
    });
    // Selects data-attr for existing fabrics
	$(document).on('click', '.fabric', function(e){
		e.preventDefault();
		var objectId = $(this).attr('data-attr');
		console.log($(this));
		console.log('lolz', objectId);
		$.post('/activefabric', {objectId: objectId}, function(fabric){
			// prepopulate form fields with fabric data
			console.log('active obect', fabric);
			var activefabric = fabric;
			$('input').each(function(){
				var keyname = $(this).attr('name');
				$(this).val(activefabric[keyname]);
			});
		});
	});

		
    // Add or edit a fabric
	$('.fabricForm').on('click', '.submitButton',function(e){
		e.preventDefault();
		// var fabricId = $(this).attr('name').val();
		var that = $(this).closest('div.modal-content').find('form.newfabric');
		var company = that.find('.company').val();
		var fcollection = that.find('.fcollection').val();
		var desc = that.find('.desc').val();
		var width = that.find('.width').val();
		var fcontent = that.find('.fcontent').val();
		var fwash = that.find('.fwash').val();
		var imageurl = that.find('.imageurl').val();
		var fabricId = that.find('.fabricId').val();
		console.log('my fabric id', fabricId);
		if (fabricId.length > 0) {
			console.log('I am an existing fabric');
			var editfabric = {
				fabricId: fabricId, 
				company: company, 
				fcollection: fcollection,
				desc: desc, 
				width: width, 
				fcontent: fcontent, 
				fwash: fwash, 
				imageurl: imageurl
			};			
			$.post('/addfabric', editfabric, function(fabric){
				//include error handling here
				$('div').find("[data-attr='"+fabricId+"']").remove();
				$allfabrics.append(inputTemplate(fabric));
			});
		}
		else {
			console.log('I am a new fabric');
			var newfabric = {
				company: company, 
				fcollection: fcollection,
				desc: desc, 
				width: width, 
				fcontent: fcontent, 
				fwash: fwash, 
				imageurl: imageurl
			};	
			$.post('/addfabric', newfabric, function(fabric){
				//include error handling here
				console.log('fabric console', fabric);
				$allfabrics.append(inputTemplate(fabric));
			});
		}
		objectId = '';
		that.find('.fabricId').val('');
	});

	// delete fabric
	$('.deleteButton').on('click', function(e) {
		e.preventDefault();
		var objectId = $(this).closest('div.fabricForm').find('input.fabricId').val();

		var response = confirm('Are you sure you want to remove this fabric from your library?');
		if (response == true) {
			// fabric id gets sent to server to remove from db
			$.post('/deletefabric', {objectId: objectId}, function(id){
				// remove deleted fabric from DOM
				$('div').find("[data-attr='"+id+"']").remove();
			});
		}
		else {
			console.log('Request canceled.');
		}	
	});

	// empty the fabric form input fields on modal close
	$('.fabricForm').on('click', '.closeButton', function(e){
		e.preventDefault();
		$(this).closest('div.modal-content').find('input').each(function(){
			$(this).closest('form').find('input[type=text], textarea').val('');
		});
	});
	
}); //end of document ready