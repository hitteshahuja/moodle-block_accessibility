define(['jquery', 'block_accessibility/accessibility', 'core/config'], function ($, accessibility, config) {
    var newStylesheet = null;
    var sheetnode = null;
    return {
        MAIN_SELECTOR: '#page',
        /**
         * Enables or disables the buttons as specified
         *
         * @requires webroot
         *
         * @param {String} id the ID of the button to enable/disable
         * @param {String} op the operation we're doing, either 'on' or 'off'.
         *
         */
        toggle:function(id,op){
            var button = $('#block_accessibility_'+id);
            if (op == 'on') {
                if (button.hasClass('disabled')) {
                    //this.log('Enabling '+button);
                    button.removeClass('disabled');
                }
            } else if (op == 'off') {
                if(!button.hasClass('disabled')) {
                    //this.log('Disabling '+button);
                    button.addClass('disabled');
                }
            }
        },
        sendRequest: function (location, data, successfn, failure) {
            $.ajax({
                url: location,
                method: 'GET',
                data: data,
                beforeSend: this.show_loading,
                complete: this.hide_loading,
                success: function (result, success, xhr) {

                    successfn(result, success, xhr);
                },

                failure: function(xhr,textStatus){
                    failure(xhr,textStatus);
                }
            });
        },
        /**
         * Displays the specified message in the block's footer
         *
         * @param {String} msg the message to display
         */
        show_message: function (msg) {
            console.log(msg);
            var msg = "Setting Saved!";
            $('#block_accessibility_message').css('display', 'block').html(msg).fadeOut('slow');

        },
        show_loading: function () {
            this.transactionsCount++;
            $('#loader-icon').css('display', 'block');
            $('#accessibility_controls').css('opacity', '0.2');
        },
        hide_loading: function () {
            if (this.transactionsCount < 0) this.transactionsCount--;
            else this.transactionsCount = 0; // prevention if count would end up to less than 0

            if (this.transactionsCount == 0) {
                $('#loader-icon').css('display', 'none');
                $('#accessibility_controls').css('opacity', '1');
            }
        },
        reload_stylesheet: function(id){
            console.log("reloading stylesheet in util...");

            var cache_prevention_salt = new Date().getTime();
            var oldStylesheet = this.sheetnode;
            console.log(oldStylesheet);
            var cssURL = config.wwwroot+
                '/blocks/accessibility/userstyles.php?instance_id='+
                id+
                '&v='+cache_prevention_salt;
            if (document.createStyleSheet) // only for IE < 11 and IE > 8
            {
                console.log("Reloading stylesheet");
                /*
                 here we use href attribute change which makes some delay while reloading stylesheet

                 1. one another idea would be to load stylesheet using this.Y.io(.. and create <style> element
                 var styleSheet = document.createElement('STYLE');
                 document.documentElement.firstChild.appendChild(styleSheet);

                 2. initial idea was the same as for non-IE browsers but somehow doesn't work:
                 oldStylesheet.remove(true);
                 newStylesheet = document.createStyleSheet(cssURL);
                 // also keep in mind that createStyleSheet can create up to 31 stylesheets
                 // http://msdn.microsoft.com/en-us/library/ie/ms531194(v=vs.85).aspx
                 */
                oldStylesheet.attr('href',cssURL);
            }
            else{
                console.log("creating new stylesheet and deleting old one makes more smooth transition");
                // IE 11 and non-IE browsers:
                // creating new stylesheet and deleting old one makes more smooth transition
                // Why wouldn't we just set the href attribute insted of creating another stylesheet node? Because before the new stylesheet is loaded and while old one is deleted, the page will lose all the styles and all the elements get unstyled for a some time (poor user experience)
                newStylesheet = oldStylesheet.clone(true);
                newStylesheet.attr('href', cssURL);
                console.log(newStylesheet);
                $('head').append(newStylesheet);
                console.log("appending new ss..");
                // remove old stylesheet
               newStylesheet.load(function(){
                    console.log("removing old ss..");
                    oldStylesheet.remove();
                });
                this.sheetnode = newStylesheet;
            }
        }

    };

});
