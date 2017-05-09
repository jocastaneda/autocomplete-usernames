// ==UserScript==
// @name         Autocomplete usernames
// @namespace    https://blog.josemcastaneda.com
// @version      0.1.0
// @description  Super simple autocomplete for usernames on the WordPress support forums.
// @author       Jose Castaneda
// @include      https://*.wordpress.org/support/topic/*
// @include      https://wordpress.org/support/topic/*
// @require      https://code.jquery.com/jquery-1.12.4.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // create our local variables
    var nicenames = $(".bbp-user-nicename"),
        form = $( "#bbp_reply_content" ),
        names = [];

    function split( val ) {
      return val.split( /\s/ );
    }
    function extractLast( term ) {
      return split( term ).pop();
    }

    // iterate over all the user nicenames
    nicenames.each(function(){
        // remove the '(' an ')' from the string.
        var clean = this.innerHTML.substring( 1, this.innerHTML.length-1 );

        // push the clean name to the array.
        names.push( clean );

        // because we only want unique names.
        names = $.unique(names);
    });

    console.log( names );
    // add the autocomplete stuff.
     form.on("keyup", function(event) {
        if ( event.keyCode === $.ui.keyCode.TAB &&
            $( this ).autocomplete( "instance" ).menu.active ) {
            event.preventDefault();
        }
     }).autocomplete( {
         minLength: 1,
         source: function( request, response ) {
          // delegate back to autocomplete, but extract the last term
          response( $.ui.autocomplete.filter(
            names, extractLast( request.term ) ) );
        },
         appendTo: $(".bbp-the-content-wrapper"),
         focus: function() {
             return false;
         },
         select: function( event, ui ) {
          var terms = split( this.value );
          // remove the current input
          terms.pop();
          // add the selected item
          terms.push( ui.item.value );
          // add placeholder to get the comma-and-space at the end
          terms.push( "" );
          this.value = terms.join( " " );
          return false;
        }
     });
})();
