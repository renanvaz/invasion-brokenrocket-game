/**
 * Each component receives the variables explained below
 *
 * @param {HTMLElement} el - Component's main DOM element
 * @param {Object} params - Params to be used
 */

if (!String.prototype.padStart) {
    String.prototype.padStart = function padStart(targetLength, padString) {
        targetLength = targetLength >> 0; //truncate if number, or convert non-number to 0;
        padString = String(typeof padString !== 'undefined' ? padString : ' ');
        if (this.length >= targetLength) {
            return String(this);
        } else {
            targetLength = targetLength - this.length;
            if (targetLength > padString.length) {
                padString += padString.repeat(targetLength / padString.length); //append to original to ensure we are longer than needed
            }
            return padString.slice(0, targetLength) + String(this);
        }
    };
}

const elScreenPlaying = el.querySelector('.screen-playing');

const elScore = el.querySelector('.score');
const elPlayer = el.querySelector('.player');
const elExplosion  = el.querySelector('.explosion');

const gravity = 400;

const coordsToCSS = (x = 0, y = 0) => `translate(${Math.round(x)}px, ${Math.round(y)}px)`;

const Score = {
    _score: 0,

    el: elScore,

    get() {
        return this._score;
    },

    setRanking(score) {
        const first = localStorage.getItem('first') || 0;
        const second = localStorage.getItem('second') || 0;
        const third = localStorage.getItem('third') || 0;

        if (score > first) {
            localStorage.setItem('first', score);
        } else if (score > second) {
            localStorage.setItem('second', score);
        } else if (score > third) {
            localStorage.setItem('third', score);
        } else {

        }
    },

    add(v) {
        this._score += v;

        this.el.innerText = Math.round(this._score).toString().padStart(4, '0');
    },
};

const Game = {
    _distanceToNewEnemy: 0,
    _distanceDefault: 200,
    _distancePadding: 50,

    x: 0,

    // reset() {
    //     Player.x = 80;
    //     Player.y = Math.round(wH / 2);
    //     Player.velocity.y = -200;
    // },

    checkForColisions() {
        let hasColision = false;

        if (Player.y < 0 || Player.y + Player.height > wH) {
            hasColision
        } else {
            Enemy._items.forEach((item) => {
                if (Player.x < item.x + item.width &&
                    Player.x + Player.width > item.x &&
                    Player.y < item.y + item.height &&
                    Player.y + Player.height > item.y) {
                    hasColision = true;

                    return false;
                }
            });
        }

        return hasColision;
    },

    tick(dt) {
        Enemy.process(dt);
        Player.process(dt);

        if (this.x > this._distanceToNewEnemy) {
            Enemy.create();

            this._distanceToNewEnemy = this.x + this._distanceDefault + this._distancePadding - (Math.random() * (this._distancePadding * 2));
        }

        Bg.render();
        Player.render();
        Enemy.render();
        Explosion.render();

        if (this.checkForColisions()) {
            Explosion.setPosition(Player);
            Explosion.render();

            Player.el.style.display = 'none';

            Ticker.pause();



            // setTimeout(() => window.location.reload(), 1000);
        } else {
            Score.add(dt);
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

const Explosion = {
    el: elExplosion,

    width: elExplosion.clientWidth,
    height: elExplosion.clientHeight,
    x: 0,
    y: -500,

    setPosition({ x, y, width, height }) {
        console.log(width - this.width);

        this.x = x + (width - this.width) / 2;
        this.y = y + (height - this.height) / 2;

        this.el.classList.remove('explode');

        setTimeout(() => {
            this.el.classList.add('explode');
        }, 0);
    },

    process(dt) {
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

    process(dt) {

    },

    render() {
        this.stars1.style.backgroundPosition    = `left -${Math.round(Game.x * .15)}px top 0`;
        this.stars2.style.backgroundPosition    = `left -${Math.round(Game.x * .2)}px top 0`;
        this.stars3.style.backgroundPosition    = `left -${Math.round(Game.x * .25)}px top 0`;
    },
};

Ticker.add(Game);

const onInput = () => {
    Player.velocity.y = -200;
};

document.addEventListener('ontouchstart' in window ? 'touchstart' : 'mousedown', onInput);
document.addEventListener('rotarydetent', onInput);
