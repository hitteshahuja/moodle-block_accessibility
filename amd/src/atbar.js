define(['jquery'],function($){
    var ATBAR_SRC =  'https://core.atbar.org/atbar/en/latest/atbar.min.js';
    var watch =  null;
    return{
        load_atbar : function(){
        var jf = $("<script id= 'ToolBar' type='text/javascript' href='"+ATBAR_SRC+"'></script>");
        $('head').append(jf);
        },
        atbar_autoload: function(op) {
            if (op == 'on') {
                this.Y.io(M.cfg.wwwroot+'/blocks/accessibility/database.php', {
                    data: 'op=save&atbar=true',
                    method: 'get',
                    on: {
                        success: function(id, o) {
                            M.block_accessibility.show_message(M.util.get_string('saved', 'block_accessibility'));
                            //setTimeout("M.block_accessibility.show_message('')", 5000);
                        },
                        failure: function(id, o) {
                            if (o.status != '404') {
                                alert(M.util.get_string('jsnosave', 'block_accessibility')+': '+o.status+' '+o.statusText);
                            }
                        },
                        start: M.block_accessibility.show_loading,
                        end: M.block_accessibility.hide_loading
                    }
                });
            } else if (op == 'off') {
                this.Y.io(M.cfg.wwwroot+'/blocks/accessibility/database.php', {
                    data: 'op=reset&atbar=true',
                    method: 'get',
                    on: {
                        success: function(id, o) {
                            M.block_accessibility.show_message(M.util.get_string('reset', 'block_accessibility'));
                            //setTimeout("M.block_accessibility.show_message('')", 5000);
                        },
                        failure: function(id, o) {
                            if (o.status != '404') {
                                alert(M.util.get_string('jsnoreset', 'block_accessibility')+': '+o.status+' '+o.statusText);
                            }
                        },
                        start: M.block_accessibility.show_loading,
                        end: M.block_accessibility.hide_loading
                    }
                });
            }
        },
        watch_atbar_for_close: function() {
            this.watch = setInterval(function() {

                if (typeof AtKit !== 'undefined') {
                    if (AtKit.isRendered()) {
                        $('#block_accessibility_textresize').css('display', 'block');
                        $('#block_accessibility_changecolour').css('display', 'block');
                        clearInterval(this.watch);
                    }
                }
            }, 1000);
        }
    }
});