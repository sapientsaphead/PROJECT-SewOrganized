// declare collections
// this code should be included in both the client and the server
Patterns = new Meteor.Collection("patterns");
Library = new Meteor.Collection("library");
Fabrics = new Meteor.Collection("fabrics");
Notions = new Meteor.Collection("notions");

if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to seworganized.";
  };

  Template.hello.events({
    'click input' : function () {
      // template data, if any, is available in 'this'
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

  });
}

function addPattern (name, company, number, imageURL){
  Patterns.insert({name: name, company: company, number: number, imageURL: imageURL});
}