const battleBackgroundImage = new Image()
battleBackgroundImage.src = './img/battlebg.png'
const battleBackground = new Sprite({position: {
    x: 0,
    y: 0
    },
    image: battleBackgroundImage
})

//Animate battle
let choice
let pokemon
let mypokemon
let enemy
let renderedSprites
let battleAnimationId
let queue

function initBattle() {

    document.querySelector('#userInterface').style.display = 'block'
    document.querySelector('#dialogueBox').style.display = 'none'
    document.querySelector('#enemyHealthBar').style.width = '100%'
    document.querySelector('#playerHealthBar').style.width = '100%'
    document.querySelector('#attacksBox').replaceChildren()
    
    pokemon = new Monster(monsters.pokemon2)
    mypokemon = new Monster(monsters.mypokemon)
    renderedSprites = [pokemon, mypokemon]
    queue = []

    mypokemon.attacks.forEach(attack => {
        const button = document.createElement('button')
        button.innerHTML = attack.name
        document.querySelector('#attacksBox').append(button)
    })

    //Event listeners for buttons (attacks)
    document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        mypokemon.attack({
            attack: selectedAttack,
            recipient: pokemon,
            renderedSprites
        })

        if (pokemon.health <= 0) {
            queue.push(() => {
                pokemon.faint()
            })
            queue.push(() => {
               //Fade back to black
               gsap.to('#overlappingDiv', {
                opacity: 1,
                onComplete: () => {
                    cancelAnimationFrame(battleAnimationId)
                    animate()
                    document.querySelector('#userInterface').style.display = 'none'

                    gsap.to('#overlappingDiv', {
                        opacity: 0
                    })

                    battle.initiated = false
                    audio.victory.stop()
                    audio.Map.play()
                }
               }) 
            })
        }

        const randomAttack = 
        pokemon.attacks[Math.floor(Math.random() * pokemon.attacks.length)]
        queue.push(() => {
            pokemon.attack({
                attack: randomAttack,
                recipient: mypokemon,
                renderedSprites
            })

            if (mypokemon.health <= 0) {
                queue.push(() => {
                    mypokemon.faint()
                })

                queue.push(() => {
                    //Fade back to black
                    gsap.to('#overlappingDiv', {
                     opacity: 1,
                     onComplete: () => {
                         cancelAnimationFrame(battleAnimationId)
                         animate()
                         
     
                         gsap.to('#overlappingDiv', {
                             opacity: 0
                         })
                         document.querySelector('#userInterface').style.display = 'none'
                         battle.initiated = false

                         audio.victory.stop()
                         audio.Map.play()

                     }
                    }) 
                 })
            }
        })

    })

    button.addEventListener('mouseenter', (e) => {
        const selectedAttack = attacks[e.currentTarget.innerHTML]
        document.querySelector('#attackType').innerHTML = selectedAttack.type
        document.querySelector('#attackType').style.color = selectedAttack.color
    })
})
}

function animateBattle() {
    battleAnimationId = window.requestAnimationFrame(animateBattle)
    battleBackground.draw()

    renderedSprites.forEach((sprite) => {
        sprite.draw()
    })
}

animate()
//initBattle()
//animateBattle()

document.querySelector('#dialogueBox').addEventListener('click', (e) => {
    if (queue.length > 0) {
        queue[0]()
        queue.shift()
    } else e.currentTarget.style.display = 'none'
})