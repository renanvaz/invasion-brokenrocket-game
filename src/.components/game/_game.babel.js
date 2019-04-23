/**
 * Each component receives the variables explained below
 *
 * @param {HTMLElement} el - Component's main DOM element
 * @param {Object} params - Params to be used
 */

const elScreenPlaying = el.querySelector('.screen-playing');

const gravity = 400;

let score = 0;

const coordsToCSS = (x = 0, y = 0) => `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

const Game = {
    _x: 0,
    _lastGateId: 0,
    _distanceToNewGate: 100,
    _distanceDefault: 100,
    _distancePadding: 30,

    checkForColisions() {
        let hasColision = false;

        Gate._items.forEach((item) => {
            if (Player.x < item.x + item.width &&
                Player.x + Player.width > item.x &&
                Player.y < item.y + item.height &&
                Player.y + Player.height > item.y) {
                hasColision = true;

                return false;
            }
        });

        return hasColision;
    },

    tick(dt) {
        Player.process(dt);
        Gate.process(dt);

        if (this._x > this._distanceToNewGate) {
            Gate.create();

            this._distanceToNewGate = this._x + this._distanceDefault + this._distancePadding - (Math.random() * (this._distancePadding * 2));
        }

        Bg.render(dt);
        Player.render(dt);
        Gate.render(dt);

        if (this.checkForColisions()) {
            Ticker.pause();

            score += dt;

            console.log('lose', score);
        }
    },
};

const Player = {
    el: el.querySelector('.player'),

    width: 35,
    height: 29,
    x: 80,
    y: Math.round(wW / 2),
    velocity: {
        x: 100,
        y: -200,
    },

    process(dt) {
        this.velocity.y += (gravity * dt);
        this.y += this.velocity.y * dt;

        Game._x += this.velocity.x * dt;
    },

    render() {
        this.el.style.transform = coordsToCSS(this.x, this.y);
    },
};


const Bg = {
    el: el.querySelector('.background'),
    ceiling: el.querySelector('.background .ceiling'),
    floor: el.querySelector('.background .floor'),
    mountain1: el.querySelector('.background .mountain-1'),
    mountain2: el.querySelector('.background .mountain-2'),

    process(dt) {

    },

    render() {
        this.ceiling.style.backgroundPosition   = `left -${Game._x % wW}px top 0`;
        this.floor.style.backgroundPosition     = `left -${Game._x % wW}px bottom 0`;
        this.mountain1.style.backgroundPosition = `left -${Game._x * .5 % wW}px bottom 70px`;
        this.mountain2.style.backgroundPosition = `left -${Game._x * .8 % wW}px bottom 0`;
    },
};

const Gate = {
    _items: new Set,

    create() {
        const domEl = document.createElement('div');
        domEl.classList.add('gate');
        elScreenPlaying.appendChild(domEl);

        const gate = {
            el: domEl,

            width: 36,
            height: 36,
            x: wW,
            y: Math.random() * (wH - 36),

            destroy() {
                elScreenPlaying.removeChild(this.el);
                Gate._items.delete(this);
            }
        };

        this._items.add(gate);
    },

    process(dt) {
        this._items.forEach((item, i) => {
            item.x -= Player.velocity.x * dt;

            if (item.x + item.width < 0) {
                item.destroy();
            }
        });
    },

    render() {
        this._items.forEach((item, i) => {
            item.el.style.transform = coordsToCSS(item.x, item.y);
        });
    },
};

Ticker.add(Game);

const onInput = () => {
    Player.velocity.y = -200;
};

document.addEventListener('mousedown', onInput);
document.addEventListener('touchstart', onInput);
