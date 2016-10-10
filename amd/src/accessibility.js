 define(['jquery','block_accessibility/atbar','block_accessibility/textsize','block_accessibility/color'],
     function($,atbar,textsize,changecolor){
    var DEFAULT_FONTSIZE = 100;
    //var MAX_FONTSIZE = 197;
    //var MIN_FONTSIZE =77;
    //

    var DAFAULT_PX_FONTSIZE= 13;
    var MAX_PX_FONTSIZE= 26;
    var MIN_PX_FONTSIZE= 10+1; // +1 because of unknown error...YUI for 77% returns style of 11px
    var MAIN_SELECTOR  = '#page'; // userstyles.php applies CSS font-size to this element
    //stylesheet: '',
    var sheetnode =  '';
    var instance_id =  '';
    var defaultsize =  null;
    var watch =  null;
    var debug = false;
    var transactionsCount = 0; // AJAX transactions

    var changeTextSize = function(){

    };

    return {
        init: function( autoload_atbar, instance_id) {
            // keep in mind that dynamic AJAX mode cannot work properly with
            // IE <= 8 (for now), so this script will not even be loaded in block_accessibillity.php

            // TO-DO: determine if block is visible (for example in chat session is not)
            console.log("Im initialised!");
            this.instance_id = instance_id;
            //TODO Jquery
            this.sheetnode = $('link[href="'+M.cfg.wwwroot+
                '/blocks/accessibility/userstyles.php?instance_id='+instance_id+'"]');
            //this.stylesheet = Y.StyleSheet(this.sheetnode);


            // Set default font size
            //this.log('Initial size: '+Y.one('body').getStyle('fontSize'));
            //this.defaultsize = M.block_accessibility.get_current_fontsize('body');
            // this is disabled because it gives false results...
            this.defaultsize = DEFAULT_FONTSIZE;

            // Attach the click handler


            $('#block_accessibility_textresize a').on('click', function() {
                if (!e.target.hasClass('disabled')) {
                    // If it is, and the button's not disabled, pass it's id to the changesize function
                    changeTextSize(e.target);
                }
            });

            $('#block_accessibility_changecolour a').on('click', function() {
                if (!$(this).hasClass('disabled')) {
                    // If it is, and the button's not disabled, pass it's id to the changecolour function
                    changecolor.changecolor($(this));
                }
            });

            // Remove href attributes from anchors
            $('#accessibility_controls a').each(function(index){
               $(this).removeAttr('href');
            });

            //TODO Jquery
            // ATBar might be disabled in block's config
            if($('#atbar_auto') !== null){
                // checkbox for setting 'always' chackbox
                $('#atbar_auto').on('click', function(e) {
                    if ($(this).checked) {
                        atbar.atbar_autoload('on');
                    } else {
                        atbar.atbar_autoload('off');
                    }
                });
                //TODO Jquery
                // Create Bookmarklet-style link using code from ATbar site
                // http://access.ecs.soton.ac.uk/StudyBar/versions
                $('#block_accessibility_launchtoolbar').on('click', function() {
                    console.log("I was clicked!");
                    atbar.load_atbar();

                    // Do we really need it?
                    // Hide block buttons until ATbar is closed
                    //$('#block_accessibility_textresize').css('display','none');
                    //$('#block_accessibility_changecolour').css('display','none');
                    //watch_atbar_for_close();
                });

                if (autoload_atbar) {
                    atbar.load_atbar();
                    // Hide block buttons until ATbar is closed
                   // $('#block_accessibility_textresize').css('display','none');
                    //$('#block_accessibility_changecolour').css('display','none');
                    // Wait 1 second to give the bar a chance to load
                    //setTimeout("watch_atbar_for_close();", 1000);
                }
            }
        }
    };
});
