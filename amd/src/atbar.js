define(['jquery', 'core/str', 'core/config', 'block_accessibility/util'], function ($, m_string, config, block_util) {
    var ATBAR_SRC = 'https://core.atbar.org/atbar/en/latest/atbar.min.js';
    var watch = null;
    return {
        load_atbar: function () {
            var jf = document.createElement('script');
            jf.src = ATBAR_SRC;
            jf.type = 'text/javascript';
            jf.id = 'ToolBar';
            document.getElementsByTagName('head')[0].appendChild(jf);
        },
        atbar_autoload: function (op) {
            var location = config.wwwroot + '/blocks/accessibility/database.php';
            var successFn = function (result, success, xhr) {
                console.log("firin success!");
                block_util.show_message(m_string.get_string('saved', 'block_accessibility'));
            };
            var failureFn = function (xhr, textStatus) {
                if (textStatus != '404') {
                    alert(m_string.get_string('jsnosave', 'block_accessibility') + ': ' + xhr.status + ' ' + xhr.statusText);
                }
            };
            if (op == 'on') {
                block_util.sendRequest(location, {'op': 'save', 'atbar': true}, successFn, failureFn);
            } else if (op == 'off') {

                block_util.sendRequest(location, {'op': 'reset', 'atbar': true}, successFn, failureFn);
            }
        },
        watch_atbar_for_close: function () {
            this.watch = setInterval(function () {

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