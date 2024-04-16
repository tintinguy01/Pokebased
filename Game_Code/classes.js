class Sprite {
    constructor({position, image, frames = {max: 1, hold: 10}, sprites, animate = false, rotation = 0}) {
        this.position = position
        this.image = new Image()
        this.frames = {...frames, val: 0, elapsed: 0}

        this.image.onload = () => {
            this.width = this.image.width / this.frames.max
            this.height = this.image.height
        }

        this.image.src = image.src

        this.animate = animate
        this.sprites = sprites
        this.opacity = 1
        this.rotation = rotation
        
        
    }
    draw() {
        c.save()
        c.translate(this.position.x + this.width / 2, this.position.y + this.height / 2)
        c.rotate(this.rotation)
        c.translate(- this.position.x - this.width / 2, - this.position.y - this.height / 2)
        c.globalAlpha = this.opacity
        c.drawImage(this.image, 
            //Cropping the character
            this.frames.val * this.width, 
            0, 
            this.image.width / this.frames.max, 
            this.image.height,
            this.position.x,
            this.position.y,
            this.image.width / this.frames.max, 
            this.image.height
            
        )
        c.restore()
        
        if (!this.animate) return
        if (this.frames.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.hold === 0) {
        if (this.frames.val < this.frames.max - 1) this.frames.val++
        else this.frames.val = 0
    }
    }   
    }


class Monster extends Sprite {

    constructor({isEnemy = false, name, attacks, position, image, frames = {max: 1, hold: 10}, sprites, animate = false, rotation = 0}) {
        super({
            position, image, frames, sprites, animate, rotation
        })
        this.health = 100
        this.isEnemy = isEnemy
        this.name = name
        this.attacks = attacks
    }

    faint() {
        document.querySelector('#dialogueBox').innerHTML = this.name + ' fainted! '
        gsap.to(this.position, {
            y: this.position.y + 10
        })
        gsap.to(this, {
            opacity: 0,
            duration: 0.4
        })

        audio.battle.stop()
        audio.victory.play()

    }

    attack({attack, recipient, renderedSprites}) {

        document.querySelector('#dialogueBox').style.display = 'block'
        document.querySelector('#dialogueBox').innerHTML = this.name + ' used ' + attack.name

        let healthBar = '#enemyHealthBar'
        if (this.isEnemy) healthBar = '#playerHealthBar'
        const tl = gsap.timeline()

        let movementDistance = 30
        if (this.isEnemy) movementDistance = -30

        recipient.health -= attack.damage

        switch(attack.name) {
            //Tackle Animation
            case 'Tackle':

                tl.to(this.position, {
                    x: this.position.x - movementDistance
                }).to(this.position, {
                    x: this.position.x + movementDistance * 2,
                    duration: 0.1,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.tackleHit.play()

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                    }
                }).to(this.position, {
                    x: this.position.x
                })
            break;
            
            //Ember Animation
            case 'Fireblast':

                //Import Explode Image + Animation
                const explodeImage = new Image()
                explodeImage.src = './img/explode.png'
                const explode = new Sprite({
                    position: {
                        x: this.position.x + 640,
                        y: this.position.y - 100
                    },
                    image: explodeImage,
                    frames: {
                        max: 10,
                        hold: 8
                    },
                    animate: true
                })
                
                renderedSprites.splice(2, 0, explode)

                gsap.to(explode.position, {
                    x: this.position.x + 640,
                    y: this.position.y - 100,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                        renderedSprites.splice(2, 1)
                    
                }
                
                })

                
            break;

            //Slash Animation
            case 'Slash':

                //Import Slash Image + Animation
                const slashImage = new Image()
                slashImage.src = './img/slash.png'
                const slash = new Sprite({
                    position: {
                        x: this.position.x + 580,
                        y: this.position.y - 100,
                    
                    },
                    image: slashImage,
                    frames: {
                        max: 8,
                        hold: 6,
                    },
                    animate: true
                })

                renderedSprites.splice(1, 0, slash)

                tl.to(this.position, {
                    x: this.position.x - movementDistance * 2,
                    duration: 0.05
                }).to(this.position, {
                    x: this.position.x + movementDistance * 10,
                    duration: 0.1,
                    hold: 10,
                    onComplete: () => {
                       
                        
                        //Enemy get hit

                        audio.tackleHit.play()

                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })

                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })
                        renderedSprites.splice(1, 1)
                    }
                    
                })
                
                .to(this.position, {
                    x: this.position.x,
                    duration: 1
                })
            break;

            //Flamethrower Animation
            case 'Flamethrower':
                //Import Flamethrower Image + Animation

                audio.initFireball.play()
                
                const flamethrowerImage = new Image()
                flamethrowerImage.src = './img/Flamethrower.png'
                const flamethrower = new Sprite({
                    position: {
                        x: this.position.x + 200,
                        y: this.position.y - 50
                    },
                    image: flamethrowerImage,
                    frames: {
                        max: 10,
                        hold: 10
                    },
                    animate: true,
                    rotation: -0.1
                })
                renderedSprites.splice(2, 0, flamethrower)
                
                gsap.to(flamethrower.position, {
                    x: recipient.position.x,
                    y: recipient.position.y - 50,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                    renderedSprites.splice(2, 1)
                    
                }
                
                })
                
            break;

            //Flamethrower2 Animation
            case 'Flamethrower2':
                //Import Flamethrower2 Image + Animation

                audio.initFireball.play()
                
                const flamethrower2Image = new Image()
                flamethrower2Image.src = './img/flamethrower2.png'
                const flamethrower2 = new Sprite({
                    position: {
                        x: this.position.x + 250,
                        y: this.position.y - 170
                    },
                    image: flamethrower2Image,
                    frames: {
                        max: 10,
                        hold: 5
                    },
                    animate: true,
                    rotation: 1.2
                })
                renderedSprites.splice(1, 0, flamethrower2)
                
                gsap.to(flamethrower2.position, {
                    x: this.position.x + 250,
                    y: this.position.y - 170,
                    duration: 1.5,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                    renderedSprites.splice(1, 1)
                    
                }
                
                })
                
            break;

            //Flamethrower2 Animation
            case 'Flamethrower3':
                //Import Flamethrower3 Image + Animation

                audio.initFireball.play()
                
                const flamethrower3Image = new Image()
                flamethrower3Image.src = './img/flamethrower3.png'
                const flamethrower3 = new Sprite({
                    position: {
                        x: this.position.x + 200,
                        y: this.position.y -280
                    },
                    image: flamethrower3Image,
                    frames: {
                        max: 10,
                        hold: 5
                    },
                    animate: true,
                    rotation: -0.4
                })
                renderedSprites.splice(1, 0, flamethrower3)
                
                gsap.to(flamethrower3.position, {
                    x: this.position.x + 200,
                    y: this.position.y - 280,
                    duration: 1.5,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                    renderedSprites.splice(1, 1)
                    
                }
                
                })
                
            break;

            //Hyperbeam Animation
            case 'Hyperbeam':
                //Import Hyperbeam Image + Animation

                audio.initFireball.play()
                
                const HyperbeamImage = new Image()
                HyperbeamImage.src = './img/hyperbeam.png'
                const Hyperbeam = new Sprite({
                    position: {
                        x: this.position.x + 400,
                        y: this.position.y - 500
                    },
                    image: HyperbeamImage,
                    frames: {
                        max: 10,
                        hold: 2
                    },
                    animate: true,
                    rotation: -0.40
                })
                renderedSprites.splice(1, 0, Hyperbeam)
                
                gsap.to(Hyperbeam.position, {
                    x: this.position.x + 400,
                    y: this.position.y - 500,
                    duration: 1.5,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                    renderedSprites.splice(1, 1)
                    
                }
                
                })
                
            break;

            //Seedbomb Animation
            case 'Seedbomb':
                //Import Hyperbeam Image + Animation

                audio.initFireball.play()
                
                const SeedbombImage = new Image()
                SeedbombImage.src = './img/seedbomb.png'
                const Seedbomb = new Sprite({
                    position: {
                        x: this.position.x - 700,
                        y: this.position.y - 180
                    },
                    image: SeedbombImage,
                    frames: {
                        max: 10,
                        hold: 20
                    },
                    animate: true,
                    rotation: 0
                })
                renderedSprites.push(Seedbomb)
                
                gsap.to(Seedbomb.position, {
                    x: this.position.x - 700,
                    y: this.position.y - 180,
                    duration: 1,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                    renderedSprites.pop()
                    
                }
                
                })
                
            break;

            //Bomb Animation
            case 'Bomb':
                //Import Hyperbeam Image + Animation

                audio.initFireball.play()
                
                const BombImage = new Image()
                BombImage.src = './img/bomb.png'
                const Bomb = new Sprite({
                    position: {
                        x: this.position.x - 150,
                        y: this.position.y - 160
                    },
                    image: BombImage,
                    frames: {
                        max: 10,
                        hold: 12
                    },
                    animate: true,
                    rotation: 0
                })
                renderedSprites.push(Bomb)
                
                gsap.to(Bomb.position, {
                    x: recipient.position.x - 50,
                    y: recipient.position.y - 50,
                    duration: 1,
                    onComplete: () => {
                        //Enemy get hit
                        
                        audio.fireballHit.play()
                        
                        gsap.to(healthBar, {
                            width: recipient.health + '%'
                        })
                        gsap.to(recipient.position, {
                            x: recipient.position.x + 10,
                            yoyo: true,
                            repeat: 5,
                            duration: 0.08
                        })
                        
                        gsap.to(recipient, {
                            opacity: 0,
                            repeat: 5,
                            yoyo: true,
                            duration: 0.08
                        })

                    renderedSprites.pop()
                    
                }
                
                })
                
            break;
        }
    }
}

class Boundary {
    static width = 48
    static height = 48
    constructor({position}) {
        this.position = position
        this.width = 48
        this. height = 48
    }

    draw() {
        c.fillStyle = 'rgba(255, 0, 0, 0'
        c.fillRect(this.position.x, this.position.y, this.width, this.height)
    }
}