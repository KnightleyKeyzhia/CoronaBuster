import Phaser from 'phaser'

export default class AmongUsScene extends 
Phaser.Scene{

    constructor(){
        super('among-us-scene')
    }
    preload(){
        this.load.image('maps', 'images/maps.png')
        this.load.image('playerRed', 'images/Red.png')
        this.load.image('playerGreen', 'images/Green.png')
        this.load.image('playerPink', 'images/Pink.png')
        this.load.image('playerOrange', 'images/Orange.png')
        this.load.image('playerCyan', 'images/Cyan.png')
    }

    create(){
        this.add.image(960, 540, 'maps')
        this.add.image(1000, 400, 'playerRed')
        this.add.image(1800, 400, 'playerGreen')
        this.add.image(400, 300, 'playerPink')
        this.add.image(400, 800, 'playerOrange')
        this.add.image(1000, 800, 'playerCyan')
    }
}
