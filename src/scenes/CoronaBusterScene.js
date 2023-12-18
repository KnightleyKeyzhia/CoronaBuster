import Phaser from "phaser";
import FallingObject from "../ui/FallingObject";
// import Laser from "../ui/Laser";
export default class CoronaBusterScene extends Phaser.Scene {
    constructor(){
        super('corona-buster-scene')
    }

    init(){
        this.clouds = undefined;

        // inisiasi tombol
        this.nav_left = false;
        this.nav_right = false;
        this.shoot = false;

        // inisialisasi tombol keyboard
        this.cursor = undefined

        //inisiasi player
        this.player = undefined;
        this.speed = 100

        // //inisiasi enemy
        this.enemies = undefined;
        this.enemySpeed = 50;

        // //inisiasi Laser
        // this.lasers = undefined;
        // this.lastFired = 10;
    }

    preload(){
        this.load.image('background', 'images/bg_layer1.png')
        this.load.image('cloud', 'images/cloud.png')

        this.load.image('left-btn', 'images/left-btn.png')
        this.load.image('right-btn', 'images/right-btn.png')
        this.load.image('shoot', 'images/shoot-btn.png')

        //upload player
        this.load.spritesheet('player', 'images/ship.png', {
            frameWidth: 66, frameHeight: 66,
        })

        // //upload enemy
        this.load.image('enemy', 'images/enemy.png');
        
        //upload laser
        // this.load.spritesheet('laser', 'images/laser-bolts.png', {
        //     frameWidth: 16,
        //     frameHeight: 16,
        // })
    }

    create(){
        const gameWidth = this.scale.width*0.5;
        const gameHeight = this.scale.height*0.5;
        this.add.image (gameWidth, gameHeight, "background")
    
        //display cloud
        this.clouds = this.physics.add.group({
            key: 'cloud',
            repeat: 10,
        })
    
        Phaser.Actions.RandomRectangle(
            this.clouds.getChildren(),
            this.physics.world.bounds
        )

        //display control button
        this.createButton()

        //untuk control player dengan keyboard button
        this.cursor = this.input.keyboard.createCursorKeys()

        //display player
        this.player = this.createPlayer()

        //display enemy
        this.enemies = this.physics.add.group({
            classType: FallingObject,
            maxSize: 10,
            runChildUpdate: true
        })
        this.time.addEvent({
            delay: Phaser.Math.Between(1000, 5000),
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        })

        //display enemy
        // this.enemies = this.physics.add.group({
        //     classType: FallingObject,
        //     maxSize: 10,
        //     runChildUpdate: true
        // })
        // this.time.addEvent({
        //     delay: Phaser.Math.Between(1000, 5000),
        //     callback: this.spawnEnemy,
        //     callbackScope: this,
        //     loop: true
        // })

        //display laser 
        // this.lasers = this.physics.add.group({
        //     classType: Laser,
        //     maxSize: 10,
        //     runChildUpdate: true
        // })

        // this.physics.add.overlap(
        //     this.lasers,
        //     this.enemies,
        //     this.hitEnemy,
        //     null,
        //     this
        // )

    }


    update(time){
        this.clouds.children.iterate((child) => {
            // @ts-ignore
            child.setVelocityY(20)
            if(child.y > this.scale.height){
                child.x = Phaser.Math.Between(10, 400)
                child.y = 0;
            }
        
        })

        // //Panggil method peswat button
        this.movePlayer(this.player, time)
    }

    // METHOD TAMBAHAN
    // 1. METHOD UNTUK MEMBUAT TOMBOL NAVIGASI
    createButton(){
        this.input.addPointer(3)

        let shoot = this.add.image(320, 550, 'shoot')
        .setInteractive()
        .setDepth(0.5)
        .setAlpha(0.8)

        let nav_left = this.add.image(50, 550, 'left-btn')
        .setInteractive()
        .setDepth(0.5)
        .setAlpha(0.8)

        let nav_right = this.add.image(
            nav_left.x + nav_left.displayWidth+20, 550, 'right-btn')
        .setInteractive()
        .setDepth(0.5)
        .setAlpha(0.8)

        //ketika tombol diklik
        //left navigation
        nav_left.on('pointerdown', () => {
            this.nav_left = true
        }, this)
        nav_left.on('pointerout', () => {
            this.nav_left = false
        }, this)

        //right navigation
        nav_right.on('pointerdown', () => {
            this.nav_right = true
        }, this)
        nav_right.on('pointerout', () => {
            this.nav_right = false
        }, this)

        //config shoot button
        shoot.on('pointerdown', () => {
            this.shoot = true
        }, this)
        shoot.on('pointerout', () => {
            this.shoot = false
        }, this)
    }

    // 2. METHOD UNTUK MEMBUAT PLAYER
    createPlayer(){
        const player = this.physics.add.sprite(200, 450, 'player')
        player.setCollideWorldBounds(true)
        
        //adjust animation and frame for player
        this.anims.create({
            key: 'turn',
            frames: [{
                key: 'player',
                frame: 0
            }]
        })

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 2
            }),
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNames('player', {
                start: 1,
                end: 2
            }),
        })

        return player
    }
    
    // 3. METOD UNTUK mengendalikan player
    movePlayer(player, time){
        if(this.cursor.left.isDown || this.nav_left) {
            this.player.setVelocityX(this.speed * -1)
            this.player.anims.play('left', true)
            this.player.setFlipX(false)
        } else if  (this.cursor.right.isDown || this.nav_right){
            this.player.setVelocityX(this.speed)
            this.player.anims.play('right', true)
            this.player.setFlipX(true)
        } else {
            this.player.setVelocityX(0)
            this.player.anims.play('turn')
        }
    
        //kondisi menembak
        if((this.shoot) && time> this.lastFired) {
            const laser = this.lasers.get(0, 0, 'laser')
            if (laser) {
                laser.fire(this.player.x, this.player.y)
                this.lastFired = time + 150
            }
        }
    }

    // 4. METHOD UNTUK MENAMPILKAN ENEMY
    spawnEnemy(){
        const config = {
            speed: 30,
            rotation: 0.1
        }

        const enemy = this.enemies.get(0, 0, 'enemy', config)
        const positionX = Phaser.Math.Between(50, 350)
        if(enemy) {
            enemy.spawn(positionX)
        }
    }

    // spawnEnemy(){
    //     const config = {
    //         speed: 30,
    //         rotation: 0.1
    //     }
    //     //@ts-ignore
    //     const enemy = this.enemies.get(0,0,'enemy', config)
    //     const positionX = Phaser.Math.Between(50, 350)
    //     if (enemy){
    //         enemy.spawn(positionX)
    //     }
    // }

    //method ketika player menabrak enemy
    // hitEnemy(Laser, enemy){
    //     Laser.die()
    //     enemy.die()
    // }
}