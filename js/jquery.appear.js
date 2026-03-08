(function($) {
    $.fn.appear = function(callback, options) {

        var settings = $.extend({
            accX: 0,
            accY: 0
        }, options);

        var $window = $(window);

        this.each(function() {
            var $this = $(this);

            function checkAppear() {
                var offset = $this.offset();
                var left = offset.left;
                var top = offset.top;

                var windowLeft = $window.scrollLeft();
                var windowTop = $window.scrollTop();

                if (top + $this.height() >= windowTop - settings.accY &&
                    top <= windowTop + $window.height() + settings.accY) {
                    callback.call($this);
                }
            }

            $window.scroll(checkAppear);
            $window.resize(checkAppear);
            checkAppear();
        });

        return this;
    };
})(jQuery);