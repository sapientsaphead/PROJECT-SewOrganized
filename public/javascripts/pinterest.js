$(document).ready(function(){
	var url = "http://www.craftsy.com/classes/sewing/new"

    $.ajax({
        url: url,
        type: "get",
        dataType: "",
        success: function(data) {
        	// load the response into jquery element
            // form tags are needed to get the entire html,head and body
            $foop = $('<form>' + data.responseText + '</form>');
        	// find contents of divs
            $.each($foop.find('div.classCard'), function (idx, item) {
                mytext = $(item).children().remove().text();
                $('<div>'+mytext+'</div>').appendTo($('div.classes'));
            });

        }
     });
}); //end of document ready

