define(['jquery','block_accessibility/util','core/config','core/str','block_accessibility/accessibility'],function($,block_util,config,string,accessibility){
    var MIN_PX_FONTSIZE =  10+1;
    var MAX_PX_FONTSIZE =  26;
    var DEFAULT_PX_FONTSIZE= 13;
    var CHANGE_SIZE_LOCATION = config.wwwroot+'/blocks/accessibility/changesize.php';
    var SAVE_LOCATION = config.wwwroot+'/blocks/accessibility/database.php';
    var DEFAULT_FONTSIZE = 100;
    var defaultsize = null;
    defaultsize = DEFAULT_PX_FONTSIZE;


    /**
     * Stripes px or % and gives value only
     * For improved user experience, only in JS-mode, we can set current font size as default font size
     * We would initially put 100%, but it doesn't have to be true for all themes
     * Also font-size value can be in % or in px, there is mapping defined in lib.php in the block
     * The function needs to return percentage fontsize value as integer
     *
     * @param {String} root element to check font-size declaration (e.g. body or #page)
     */
    var get_current_fontsize = function(root_element){
        var currentsize = DEFAULT_FONTSIZE;
        //var defaultsize = Y.one(root_element).getStyle('fontSize');
        var defaultsize = $(root_element).css('fontSize');
        //var defaultsize = Y.one(root_element).getComputedStyle('fontSize');
        if (defaultsize.substr(-2) == 'px') {
            currentsize = defaultsize.substr(0, defaultsize.length-2);
        } else if (defaultsize.substr(-1) == '%') {
            currentsize = defaultsize.substr(0, defaultsize.length-1);
        }
        return currentsize;
    };
    var savesize = function() {
        var successFn = function(result,success,xhr){
            block_util.show_message(string.get_string('saved', 'block_accessibility'));
        };
        var failureFn = function(xhr,textStatus){
            alert(string.get_string('jsnosave', 'block_accessibility')+': '+textStatus);
        };
        block_util.sendRequest(SAVE_LOCATION,{'op':'save','size':true,'scheme':true},successFn,failureFn);
    };

    return{

        /**
         * This handles clicks from the buttons. If increasing, decreasing or
         * resetting size, it calls changesize.php via AJAX and sets the text
         * size to the number returned from the server. If saving the size, it
         * calls accessibility_savesize.
         * Also enables/disables buttons as required when sizes are changed.
         *
         * @requires accessibility_block_util.toggle_textsizer
         * @requires accessibility_savesize
         * @requires accessibility_resetsize
         * @requires stylesheet
         * @requires webroot
         *
         * @param {Node} button the button that was pushed
         *
         */
        changesize : function(button,id) {
        switch (button.attr('id')) {
            case "block_accessibility_inc":
                console.log("increasing f size");
                this.successFn = function(result,success,xhr){
                    console.log(xhr);
                    // if redirected to login page, or some other error...
                    if (!(xhr.responseText === undefined) && xhr.responseText.length > 0) {
                        alert(str.get_string('jsnotloggedin', 'block_accessibility')+': '+xhr.status+' '+xhr.statusText);
                    }
                    block_util.reload_stylesheet(id);
                    var new_fontsize =  get_current_fontsize(block_util.MAIN_SELECTOR);
                    console.log("Increasing f size to "+new_fontsize);
                    var max_fontsize = MAX_PX_FONTSIZE;
                    if(new_fontsize == defaultsize) {
                        block_util.toggle('reset', 'off');
                    } else {
                        block_util.toggle('reset', 'on');
                    }
                    if (new_fontsize >= max_fontsize) {
                        block_util.toggle('inc', 'off');
                    }
                    block_util.toggle('dec', 'on');
                    block_util.toggle('save', 'on');

                };

                this.failureFn = function(xhr,textStatus){
                    alert(string.get_string('jsnosize', 'block_accessibility')+': '+textStatus);
                };
                block_util.sendRequest(CHANGE_SIZE_LOCATION,{'op':'inc','cur':defaultsize},this.successFn,this.failureFn);
                //this.log('Increasing size from '+this.defaultsize);
                break;
            case "block_accessibility_dec":
                this.successFn = function(result,success,xhr){
                    // if redirected to login page, or some other error...
                    if (!(xhr.responseText === undefined) && xhr.responseText.length > 0) {
                        alert(str.get_string('jsnotloggedin', 'block_accessibility')+': '+xhr.status+' '+xhr.statusText);
                    }
                    block_util.reload_stylesheet(id);
                    var new_fontsize =  get_current_fontsize(block_util.MAIN_SELECTOR);
                    console.log("Dec f size to "+new_fontsize);
                    var min_fontsize = MIN_PX_FONTSIZE;
                    if(new_fontsize == defaultsize) {
                        block_util.toggle('reset', 'off');
                    } else {
                        block_util.toggle('reset', 'on');
                    }
                    if (new_fontsize <= min_fontsize) {
                        block_util.toggle('inc', 'off');
                    }
                    block_util.toggle('save', 'on');
                    block_util.toggle('inc', 'on');


                };
                this.failureFn = function(xhr,textStatus){
                    alert(string.get_string('jsnosize', 'block_accessibility')+': '+textStatus);
                };
                block_util.sendRequest(CHANGE_SIZE_LOCATION,{'op':'dec','cur':defaultsize},this.successFn,this.failureFn);//this.log('Decreasing size from '+this.defaultsize);
                break;
            case "block_accessibility_reset":
                var successFn = function(result,success,xhr){
                    // if redirected to login page, or some other error...
                    if (!(xhr.responseText === undefined) && xhr.responseText.length > 0) {
                        alert(str.get_string('jsnotloggedin', 'block_accessibility')+': '+o.status+' '+o.statusText);
                    }
                    block_util.reload_stylesheet(id);
                    var new_fontsize =  get_current_fontsize(block_util.MAIN_SELECTOR);
                    console.log("Resetting to : "+new_fontsize);
                    var min_fontsize = MIN_PX_FONTSIZE;
                    var max_fontsize = MAX_PX_FONTSIZE;
                    block_util.toggle('reset', 'off');
                    if(new_fontsize <= min_fontsize) {
                        block_util.toggle('dec', 'on');
                    } else if (new_fontsize >= max_fontsize){
                        block_util.toggle('inc', 'on');
                    }
                    block_util.toggle('save', 'off');

                };
                var failureFn = function () {
                    alert(string.get_string('jsnosize', 'block_accessibility')+': '+o.status+' '+o.statusText);
                };
                block_util.sendRequest(CHANGE_SIZE_LOCATION,{'op':'reset','cur':defaultsize},successFn,failureFn);
                //this.log('Resetting size from '+this.defaultsize);
                break;
            case "block_accessibility_save":
                console.log('Saving Size');
                savesize();
                break;
        }
    }

    };

});