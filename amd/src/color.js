define(['jquery','block_accessibility/util','core/config','core/str','block_accessibility/textsize','block_accessibility/accessibility'], function ($,block_util,config,str,textsize,accessibility) {
    var CHANGE_COLOR_LOCATION = config.wwwroot+'/blocks/accessibility/changecolour.php';
    return {
        changecolor : function (button,id) {

            var successFn = function(result,success,xhr){
                // if redirected to login page, or some other error...
                if (!(xhr.responseText === 'undefined') && xhr.responseText.length > 0) {
                    alert(str.get_string('jsnotloggedin', 'block_accessibility')+': '+xhr.status+' '+xhr.statusText);
                }
                block_util.reload_stylesheet(id);
                if(scheme == 1){
                    block_util.toggle('save', 'off'); // reset
                    block_util.toggle('colour1', 'off');
                }
                else{
                    block_util.toggle('save', 'on');
                    block_util.toggle('colour1', 'on');
                }
            };
            var failureFn = function(xhr,textStatus){
                alert(str.get_string('jsnocolour', 'block_accessibility')+': '+textStatus);
            };
            var scheme = button.attr('id').substring(26);
            var data = {'scheme': scheme };
            console.log("Changing color to : "+ scheme);
            block_util.sendRequest(CHANGE_COLOR_LOCATION,data,successFn,failureFn);
            return true;
        }
    };
});