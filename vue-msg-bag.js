/*
    https://github.com/websanova/vue-msg-bag
    rob@websanova.com
    Version 0.3.0
 */
module.exports = (function () {

    function MsgBag(options) {
        this.set = false;

        this.msgs = [];

        this.options = {
            timeout:   options.timeout   || 1500,
            container: options.container || 'main',
            parseMsg:  options.parseMsg  || function (msg) { return msg; }
        };
    }

    function _parseMsg(msg) {
        msg = this.options.parseMsg.call(this, msg);

        msg.__msgId = Math.random();

        return msg;
    }

    function _display(type, msg, container, msgs, queue) {
        var i, ii,
            msgs = msgs || [];

        queue = queue === false ? false : true;

        if (msg && msg.constructor === Array) {
            for (i = 0, ii = msg.length; i < ii; i++) {
                msgs = _display.call(this, type, msg[i], container, msgs, queue);
            }
        }
        else if (typeof msg === 'Object') {
            msgs.push(_parseMsg.call(this, msg))

            if (queue) {
                _queue.call(this, msgs[msgs.length - 1]);
            }
        }
        else {
            msgs.push(_parseMsg.call(this, {msg: msg, type: type, container: container || this.options.container}));
            
            if (queue) {
                _queue.call(this, msgs[msgs.length - 1]);
            }
        }

        return msgs;
    }

    function _queue(msg) {
        var _this = this;

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
        if ( ! this.set) {
            ctx[ctx.set ? 'set' : '$set']('__msgBag', this);
            this.set = true;
        }
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

    MsgBag.prototype.parse = function(type, msg) {
        return _display.call(this, type, msg, null, [], false);
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