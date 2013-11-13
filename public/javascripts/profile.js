$(document).ready(function(){

	var source   = $("#profile-results-template").html();
  var inputTemplate = Handlebars.compile(source);
  var $profileContainer = $('#profile-container');

 	var username = 'unicorn';

	// Selects user id for existing user
  $(document).on('click', '.profile-info', function(e){
    e.preventDefault();
    var objectId = $(this).attr('data-userid');
    $.post('/activeuser', {objectId: objectId}, function(user){
      // prepopulate form fields with pattern data
      var capitalize = function(str) {
        if (str.length === 2) {
          return str.toUpperCase();
        }
        else {
          return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
        }
      }
      $('input').each(function(){
        var keyname = $(this).attr('name');
        $(this).val(capitalize(user[keyname]));
      });
    });
  });
    
    // Edit profile info
  $('.editUser').on('click', '.submitButton',function(e){
    e.preventDefault();
 
    var that = $(this).closest('div.modal-content').find('form.editUserInfo');
    console.log('that', that);
    var fname = that.find('.fname').val();
    var lname = that.find('.lname').val();
    var city = that.find('.city').val();
    var state = that.find('.state').val();
    var zipcode = that.find('.zipcode').val();
    var userid = that.find('.userId').val();
    var edituser = {
      userid: userid, 
      fname: fname, 
      lname: lname, 
      city: city, 
      state: state, 
      zipcode: zipcode
    };     
    
    $.post('/edituser', edituser, function(user){
      //include error handling here
      console.log('user here', user);
      $('div').find('#profile-container').empty();
      $profileContainer.append(inputTemplate(user));
    });
  });

}); //end of document load