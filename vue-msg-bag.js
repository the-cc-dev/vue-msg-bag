/*
    https://github.com/websanova/vue-msg-bag
    rob@websanova.com
    Version 0.1.0
 */
module.exports = (function () {

    var _ctx = null;

    function MsgBag(options) {
        this.msgs = [];

        this.options = {
            timeout:   options.timeout   || 1500,
            container: options.container || 'main',
            parseMsg:  options.parseMsg  || _parseMsg
        };
    }

    function _parseMsg(msg) {
        return msg;
    }

    function _display(type, msg, container) {
        var i, ii;

        if (msg && msg.constructor === Array) {
            for (i = 0, ii = msg.length; i < ii; i++) {
                _display.call(this, type, msg[i], container);
            }
        }
        else if (typeof msg === 'Object') {
            _queue.call(this, msg);
        }
        else {
            _queue.call(this, {msg: msg, type: type, container: container || this.options.container});
        }
    }

    function _queue(msg) {
        var _this = this;

        msg = this.options.parseMsg.call(this, msg);

        msg.__msgId = Math.random();

        this.msgs.unshift(msg);

        if (this.options.timeout) {
            setTimeout(function () {
                if (_this.msgs.length) {
                    _this.msgs.splice(_this.msgs.length -1, 1);
                }
            }, this.options.timeout);
        }
    }

    MsgBag.prototype.context = function(ctx) {
        if (ctx) { _ctx = ctx; }

        return _ctx;
    };

    MsgBag.prototype.success = function(msg, container) {
        _display.call(this, 'success', msg, container);
    };

    MsgBag.prototype.error = function(msg, container) {
        _display.call(this, 'error', msg, container);
    };

    MsgBag.prototype.warning = function(msg, container) {
        _display.call(this, 'warning', msg, container);
    };

    MsgBag.prototype.fatal = function(msg, container) {
        _display.call(this, 'fatal', msg, container);
    };

    MsgBag.prototype.clear = function(msg) {
        var i;

        if (msg) {
            for (i in this.msgs) {
                if (this.msgs[i].__msgId === msg.__msgId) {
                    this.msgs.splice(i, 1);

                    return;
                }
            }
        }
        else {
            this.msgs = [];
        }
    };

    MsgBag.prototype.all = function () {
        return this.msgs;
    }

    return function install(Vue, options) {
        var msgBag = new MsgBag(options || {});

        Vue.msgBag = MsgBag;

        Object.defineProperties(Vue.prototype, {
            $msgBag: {
                get: function () {
                    msgBag.context(this);

                    return msgBag;
                }
            }
        });
    }
})();