
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

const Ticker = {
    _items: [],
    _paused: false,

    time: {
        last: 0,
        now: 0,
        dt: 0,
        elapsed: 0,
    },

    add(item) {
        this._items.push(item);
    },

    pause() {
        this._paused = true;
    },

    resume() {
        this._paused = false;
    },

    timestamp() {
        return ((window.performance && window.performance.now) ? window.performance.now() : new Date().getTime());
    },

    tick() {
        this.time.now     = this.timestamp();
        this.time.dt      = Math.min(1, (this.time.now - this.time.last) / 1000);
        this.time.elapsed += this.time.dt;

        if (!this._paused) {
            for (let i = 0, len = this._items.length; i < len; i++) {
                let item = this._items[i];
                item.tick(this.time.dt);
            }
        }

        this.time.last    = this.time.now;

        requestAnimationFrame(this.tick.bind(this));
    },

    init() {
        this._paused = false;
        requestAnimationFrame(this.tick.bind(this));
    },
};
