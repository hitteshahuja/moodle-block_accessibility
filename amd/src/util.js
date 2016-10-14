define(['jquery', 'block_accessibility/accessibility', 'core/config'], function ($, accessibility, config) {
    return {
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
        }

    };

});
