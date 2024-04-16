const monsters = {

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
            x: 690,
            y: -10
        },
        image: {
            src: './img/pokemon2.png'
        },
        frames: {
            max: 2,
            hold: 2
        },
        animate: true,
        isEnemy: true,
        name: 'Kin',
        attacks: [attacks.Tackle, attacks.Bomb]
    }
}

var choose_one = {
    "key 1" : pokemon,
    "key 2" : pokemon2
  };
  
  var choice = rando(choose_one);