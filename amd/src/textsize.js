define(['jquery','block_accessibility/util','core/config'],function($,block_util,config){
    var MIN_PX_FONTSIZE =  10+1;
    var MAX_PX_FONTSIZE =  26;
    var CHANGE_SIZE_LOCATION = M.cfg.wwwroot+'/blocks/accessibility/changesize.php';

    /**
     * Stripes px or % and gives value only
     * For improved user experience, only in JS-mode, we can set current font size as default font size
     * We would initially put 100%, but it doesn't have to be true for all themes
     * Also font-size value can be in % or in px, there is mapping defined in lib.php in the block
     * The function needs to return percentage fontsize value as integer
     *
     * @param {String} root element to check font-size declaration (e.g. body or #page)
     */
    var get_current_fontsize =  function(root_element){
        var currentsize = M.block_accessibility.DEFAULT_FONTSIZE;
        //var defaultsize = Y.one(root_element).getStyle('fontSize');
        var defaultsize = Y.one(root_element).getComputedStyle('fontSize');
        if (defaultsize.substr(-2) == 'px') {
            currentsize = defaultsize.substr(0, defaultsize.length-2);
        } else if (defaultsize.substr(-1) == '%') {
            currentsize = defaultsize.substr(0, defaultsize.length-1);
        }
        return currentsize;
    };
    var savesize = function() {
        block_util.sendRequest(SAVE_LOCATION,data,successFn,failureFn);
        this.Y.io(SAVE_LOCATION, {
            data: 'op=save&size=true&scheme=true',
            method: 'get',
            on: {
                success: function(id, o) {
                    util.show_message(M.util.get_string('saved', 'block_accessibility'));
                    //setTimeout("M.block_accessibility.show_message('')", 5000);
                },
                failure: function(id, o) {
                    alert(M.util.get_string('jsnosave', 'block_accessibility')+' '+o.status+' '+o.statusText);
                },
                start: block_util.show_loading,
                end: block_util.hide_loading
            }
        });
    };

    /**
     * Enables or disables the buttons as specified
     *
     * @requires webroot
     *
     * @param {String} id the ID of the button to enable/disable
     * @param {String} op the operation we're doing, either 'on' or 'off'.
     *
     */
    var toggle_textsizer = function(id, op) {
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
    };

    /**
     * This handles clicks from the buttons. If increasing, decreasing or
     * resetting size, it calls changesize.php via AJAX and sets the text
     * size to the number returned from the server. If saving the size, it
     * calls accessibility_savesize.
     * Also enables/disables buttons as required when sizes are changed.
     *
     * @requires accessibility_toggle_textsizer
     * @requires accessibility_savesize
     * @requires accessibility_resetsize
     * @requires stylesheet
     * @requires webroot
     *
     * @param {Node} button the button that was pushed
     *
     */
    var changesize = function(button) {


        switch (button.attr('id')) {
            case "block_accessibility_inc":
                //this.log('Increasing size from '+this.defaultsize);
                var data = {'op':'inc','cur':this.defaultsize};
                var successFn = function(xhr){

                };
                $.ajax(
                    {
                        data: 'op=inc&cur='+this.defaultsize,
                        success: function(id, o) {

                            // if redirected to login page, or some other error...
                            if (!(o.response === undefined) && o.response.length > 0) {
                                alert(M.util.get_string('jsnotloggedin', 'block_accessibility')+': '+o.status+' '+o.statusText);
                            }

                            // now that we updated user setting to the server, load updated stylesheet
                            M.block_accessibility.reload_stylesheet();
                            var new_fontsize =  M.block_accessibility.get_current_fontsize(M.block_accessibility.MAIN_SELECTOR);
                            M.block_accessibility.log('Increasing size to '+new_fontsize);

                            // Disable/enable buttons as necessary
                            var min_fontsize = MIN_PX_FONTSIZE;
                            var max_fontsize = MAX_PX_FONTSIZE;
                            if(new_fontsize == M.block_accessibility.defaultsize) {
                                M.block_accessibility.toggle_textsizer('reset', 'off');
                            } else {
                                M.block_accessibility.toggle_textsizer('reset', 'on');
                            }
                            if (new_fontsize >= max_fontsize) {
                                M.block_accessibility.toggle_textsizer('inc', 'off');
                            }
                            M.block_accessibility.toggle_textsizer('dec', 'on');
                            M.block_accessibility.toggle_textsizer('save', 'on');

                        },
                        error: function(o) {
                            alert(M.util.get_string('jsnosize', 'block_accessibility')+': '+o.status+' '+o.statusText);
                        },
                        beforeSend: util.show_loading,
                        complete: util.hide_loading,
                        url: CHANGE_SIZE_LOCATION
                    }
                );
                break;
            case "block_accessibility_dec":
                //this.log('Decreasing size from '+this.defaultsize);
                Y.io(M.cfg.wwwroot+'/blocks/accessibility/changesize.php', {
                    data: 'op=dec&cur='+this.defaultsize,
                    method: 'get',
                    on: {
                        success: function(id, o) {

                            // if redirected to login page, or some other error...
                            if (!(o.response === undefined) && o.response.length > 0) {
                                alert(M.util.get_string('jsnotloggedin', 'block_accessibility')+': '+o.status+' '+o.statusText);
                            }

                            // now that we updated user setting to the server, load updated stylesheet
                            M.block_accessibility.reload_stylesheet();
                            var new_fontsize =  M.block_accessibility.get_current_fontsize(M.block_accessibility.MAIN_SELECTOR);
                            M.block_accessibility.log('Decreasing size to '+new_fontsize);

                            // Disable/enable buttons as necessary
                            var min_fontsize = M.block_accessibility.MIN_PX_FONTSIZE;
                            var max_fontsize = M.block_accessibility.MAX_PX_FONTSIZE;
                            if(new_fontsize == M.block_accessibility.defaultsize) {
                                M.block_accessibility.toggle_textsizer('reset', 'off');
                            } else {
                                M.block_accessibility.toggle_textsizer('reset', 'on');
                            }
                            if (new_fontsize <= min_fontsize) {
                                M.block_accessibility.toggle_textsizer('dec', 'off');
                            }
                            M.block_accessibility.toggle_textsizer('inc', 'on');
                            M.block_accessibility.toggle_textsizer('save', 'on');

                        },
                        failure: function(id, o) {
                            alert(M.util.get_string('jsnosize', 'block_accessibility')+': '+o.status+' '+o.statusText);
                        },
                        start: M.block_accessibility.show_loading,
                        end: M.block_accessibility.hide_loading
                    }
                });
                break;
            case "block_accessibility_reset":
                //this.log('Resetting size from '+this.defaultsize);
                Y.io(M.cfg.wwwroot+'/blocks/accessibility/changesize.php', {
                    data: 'op=reset&cur='+this.defaultsize,
                    method: 'get',
                    on: {
                        success: function(id, o) {

                            // if redirected to login page, or some other error...
                            if (!(o.response === undefined) && o.response.length > 0) {
                                alert(M.util.get_string('jsnotloggedin', 'block_accessibility')+': '+o.status+' '+o.statusText);
                            }

                            // now that we updated user setting to the server, load updated stylesheet
                            M.block_accessibility.reload_stylesheet();
                            var new_fontsize =  M.block_accessibility.get_current_fontsize(M.block_accessibility.MAIN_SELECTOR);
                            M.block_accessibility.log('Resetting size to '+new_fontsize);

                            // Disable/enable buttons as necessary
                            var min_fontsize = M.block_accessibility.MIN_PX_FONTSIZE;
                            var max_fontsize = M.block_accessibility.MAX_PX_FONTSIZE;
                            M.block_accessibility.toggle_textsizer('reset', 'off');
                            if(new_fontsize <= min_fontsize) {
                                M.block_accessibility.toggle_textsizer('dec', 'on');
                            } else if (new_fontsize >= max_fontsize){
                                M.block_accessibility.toggle_textsizer('inc', 'on');
                            }
                            M.block_accessibility.toggle_textsizer('save', 'off');
                            //M.block_accessibility.resetsize();

                        },
                        failure: function(id, o) {
                            alert(M.util.get_string('jsnosize', 'block_accessibility')+': '+o.status+' '+o.statusText);
                        },
                        start: M.block_accessibility.show_loading,
                        end: M.block_accessibility.hide_loading
                    }
                });
                break;
            case "block_accessibility_save":
                //this.log('Saving Size');
                M.block_accessibility.savesize();
                break;
        }
    }



});