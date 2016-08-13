define('jquery','jquery-ui',function($,ui){

    var DEFAULT_FONTSIZE = 100;
    var MAX_FONTSIZE = 197;
    var MAX_FONTSIZE =  197;
    var MIN_FONTSIZE =77;

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
    return {
        init: function(Y, autoload_atbar, instance_id) {
        // keep in mind that dynamic AJAX mode cannot work properly with IE <= 8 (for now), so this script will not even be loaded in block_accessibillity.php


        // TO-DO: determine if block is visible (for example in chat session is not)

        this.instance_id = instance_id;

        this.sheetnode = Y.one('link[href="'+M.cfg.wwwroot+
            '/blocks/accessibility/userstyles.php?instance_id='+instance_id+'"]');
        //this.stylesheet = Y.StyleSheet(this.sheetnode);

        // Set default font size
        //this.log('Initial size: '+Y.one('body').getStyle('fontSize'));
        //this.defaultsize = M.block_accessibility.get_current_fontsize('body'); // this is disabled because it gives false results...
        this.defaultsize = DEFAULT_FONTSIZE;

        // Attach the click handler
            $('#block_accessibility_textresize a').on('click', function(e) {

            });

            $('#block_accessibility_changecolour a').on('click', function(e) {

            });

        Y.all('#block_accessibility_textresize a').on('click', function(e) {
            if (!e.target.hasClass('disabled')) {
                // If it is, and the button's not disabled, pass it's id to the changesize function
                M.block_accessibility.changesize(e.target);
            }
        });

        Y.all('#block_accessibility_changecolour a').on('click', function(e) {
            if (!e.target.hasClass('disabled')) {
                // If it is, and the button's not disabled, pass it's id to the changecolour function
                M.block_accessibility.changecolour(e.target);
            }
        });

        // Remove href attributes from anchors
        Y.all('#accessibility_controls a').each(function(node){
            node.removeAttribute('href');
        });

        // ATBar might be disabled in block's config
        if(Y.one('#atbar_auto') !== null){
            // checkbox for setting 'always' chackbox
            Y.one('#atbar_auto').on('click', function(e) {
                if (e.target.get('checked')) {
                    M.block_accessibility.atbar_autoload('on');
                } else {
                    M.block_accessibility.atbar_autoload('off');
                }
            });

            // Create Bookmarklet-style link using code from ATbar site
            // http://access.ecs.soton.ac.uk/StudyBar/versions
            Y.one('#block_accessibility_launchtoolbar').on('click', function() {
                M.block_accessibility.load_atbar();

                // Do we really need it?
                // Hide block buttons until ATbar is closed
                $.('#block_accessibility_textresize').css('display','none');
                $.('#block_accessibility_changecolour').css('display','none');
                Y.one('#block_accessibility_textresize').setStyle('display', 'none');
                Y.one('#block_accessibility_changecolour').setStyle('display', 'none');
                M.block_accessibility.watch_atbar_for_close();
            });

            if (autoload_atbar) {
                M.block_accessibility.load_atbar();
                // Hide block buttons until ATbar is closed
                Y.one('#block_accessibility_textresize').setStyle('display', 'none');
                Y.one('#block_accessibility_changecolour').setStyle('display', 'none');
                // Wait 1 second to give the bar a chance to load
                setTimeout("M.block_accessibility.watch_atbar_for_close();", 1000);
            }
        }



        // assign loader icon events
        // Y.on('io:start', M.block_accessibility.show_loading); // this triggers even for io actions outside block causing conflicts
        // Y.on('io:complete', M.block_accessibility.hide_loading);
    }
    }
});
