define(['jquery','block_accessibility/util','core/config'], function ($,block_util,config) {
    var CHANGE_COLOR_LOCATION = config.wwwroot+'/blocks/accessibility/changecolour.php';
    return {
        changecolor : function (button) {
            console.log("changing color");
            console.log(button);
            var scheme = button.attr('id').substring(26);
            var data = {'scheme':scheme};
            console.log(scheme);
            var successFn = function(){
                M.block_accessibility.reload_stylesheet();
            }
            block_util.sendRequest(CHANGE_COLOR_LOCATION,data);
        }
    };
});