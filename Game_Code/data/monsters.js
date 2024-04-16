const monsters = {

    mypokemon: {
        position: {
            x: 55,
            y: 60
        },
        image: {
            src: './img/charizard.png'
        },
        frames: {
            max: 10,
            hold: 15
        },
        animate: true,
        name: 'Charizard',
        attacks: [attacks.Tackle, attacks.Fireblast, attacks.Slash, attacks.Flamethrower]
    },

    pokemon: {
        position: {
            x: 690,
            y: -10
        },
        image: {
            src: './img/venusaur.png'
        },
        frames: {
            max: 10,
            hold: 20
        },
        animate: true,
        isEnemy: true,
        name: 'Venusaur',
        attacks: [attacks.Tackle, attacks.Seedbomb]
    },

    pokemon2: {
        position: {
            x: 730,
            y: 20
        },
        image: {
            src: './img/pokemon2.png'
        },
        frames: {
            max: 2,
            hold: 16
        },
        animate: true,
        isEnemy: true,
        name: 'Thailander',
        attacks: [attacks.Tackle, attacks.Bomb]
    }
}