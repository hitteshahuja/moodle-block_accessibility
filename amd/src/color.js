define(['jquery','block_accessibility/util','core/config','core/str','block_accessibility/textsize','block_accessibility/accessibility'], function ($,block_util,config,str,textsize,accessibility) {
    var CHANGE_COLOR_LOCATION = config.wwwroot+'/blocks/accessibility/changecolour.php';
    return {
        changecolor : function (button) {
            var scheme = button.attr('id').substring(26);
            var data = {'scheme': scheme};
            var successFn = function(result,success,xhr){
                console.log(result);
                console.log(xhr);
                // if redirected to login page, or some other error...
                if (!(xhr.responseText === undefined) && xhr.responseText.length > 0) {
                    alert(str.get_string('jsnotloggedin', 'block_accessibility')+': '+xhr.status+' '+xhr.statusText);
                }


                if(scheme == 1){
                    textsize.toggle_textsizer('save', 'off'); // reset
                    textsize.toggle_textsizer('colour1', 'off');
                }
                else{
                    textsize.toggle_textsizer('save', 'on');
                    textsize.toggle_textsizer('colour1', 'on');
                }
            };
            var failureFn = function(o){
                alert(str.get_string('jsnocolour', 'block_accessibility')+': '+o.status+' '+o.statusText);
            };
            block_util.sendRequest(CHANGE_COLOR_LOCATION,data,successFn,failureFn);
        }
    };
});