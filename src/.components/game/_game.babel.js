/**
 * Each component receives the variables explained below
 *
 * @param {HTMLElement} el - Component's main DOM element
 * @param {Object} params - Params to be used
 */

const elScreenPlaying = el.querySelector('.screen-playing');

const elPlayer = el.querySelector('.player');

const gravity = 400;

let score = 0;

const coordsToCSS = (x = 0, y = 0) => `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

const Game = {
    _distanceToNewEnemy: 0,
    _distanceDefault: 200,
    _distancePadding: 50,

    x: 0,

    checkForColisions() {
        let hasColision = false;

        Enemy._items.forEach((item) => {
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
        Enemy.process(dt);

        if (this.x > this._distanceToNewEnemy) {
            Enemy.create();

            this._distanceToNewEnemy = this.x + this._distanceDefault + this._distancePadding - (Math.random() * (this._distancePadding * 2));
        }

        Bg.render(dt);
        Player.render(dt);
        Enemy.render(dt);

        if (this.checkForColisions()) {
            Ticker.pause();

            score += dt;

            console.log('lose', score);

            window.location.reload();
        }
    },
};

const Player = {
    el: elPlayer,

    width: elPlayer.clientWidth,
    height: elPlayer.clientHeight,
    x: 80,
    y: Math.round(wH / 2),
    velocity: {
        x: 100,
        y: -200,
    },

    process(dt) {
        this.velocity.y += (gravity * dt);
        this.y += this.velocity.y * dt;

        Game.x += this.velocity.x * dt;
    },

    render() {
        this.el.style.transform = coordsToCSS(this.x, this.y);
    },
};

const Enemy = {
    _items: new Set,

    create() {
        const domEl = document.createElement('div');
        const model = Math.round(Math.random() * 2) + 1;

        domEl.classList.add(`asteroid-${model}`);

        elScreenPlaying.appendChild(domEl);

        const enemy = {
            el: domEl,

            width: domEl.clientWidth,
            height: domEl.clientHeight,
            x: wW,
            y: (Math.random() * (wH - 30 - 30 - 10 - 10)) + 30 + 10,

            destroy() {
                elScreenPlaying.removeChild(this.el);
                Enemy._items.delete(this);
            }
        };

        this._items.add(enemy);
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

const Bg = {
    el: el.querySelector('.background'),
    stars1: el.querySelector('.background .stars-1'),
    stars2: el.querySelector('.background .stars-2'),
    stars3: el.querySelector('.background .stars-3'),
    clouds1: el.querySelector('.background .clouds-1'),
    clouds2: el.querySelector('.background .clouds-2'),

    process(dt) {

    },

    render() {
        this.stars1.style.backgroundPosition    = `left -${Math.round(Game.x * .1)}px top 0`;
        this.stars2.style.backgroundPosition    = `left -${Math.round(Game.x * .15)}px top 0`;
        this.stars3.style.backgroundPosition    = `left -${Math.round(Game.x * .2)}px top 0`;
        this.clouds1.style.backgroundPosition    = `left -${Math.round(Game.x * .3)}px top 0`;
        this.clouds2.style.backgroundPosition    = `left -${Math.round(Game.x * .5)}px top 0`;
    },
};

Ticker.add(Game);

const onInput = () => {
    Player.velocity.y = -200;
};

document.addEventListener('ontouchstart' in window ? 'touchstart' : 'mousedown', onInput);
