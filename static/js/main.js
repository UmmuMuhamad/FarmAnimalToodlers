

var GameState={
    preload: function(){
       this.load.image('background','static/assets/images/background.png');
       this.load.image('arrow','static/assets/images/arrow.png');
       //this.load.image('cat','/Toodlers/assets/images/cat.png')
       /*this.load.image('chicken','/Toodlers/assets/images/chicken.png');
       this.load.image('horse','/Toodlers/assets/images/horse.png');
       this.load.image('pig','/Toodlers/assets/images/pig.png');
       this.load.image('sheep','/Toodlers/assets/images/sheep3.png');*/
       
       this.load.spritesheet('chicken','static/assets/images/chicken_spritesheet.png',131,200,3);
       this.load.spritesheet('horse','static/assets/images/horse_spritesheet.png',212,200,3);
       this.load.spritesheet('pig','static/assets/images/pig_spritesheet.png',297,200,3);
       this.load.spritesheet('sheep','static/assets/images/sheep_spritesheet.png',244,200,3);
       
       this.load.audio('chickenSound',['static/assets/audio/chicken.ogg','/static/assets/audio/chicken.ogg']);
       this.load.audio('horseSound',['static/assets/audio/horse.ogg','/static/assets/audio/horse.mp3']);
       this.load.audio('pigSound',['static/assets/audio/pig.ogg','/static/assets/audio/pig.mp3']);
       this.load.audio('sheepSound',['static/assets/audio/sheep.ogg','/static/assets/audio/sheep.mp3']);
    },
    // executed after everything is loaded
    create: function(){
             
       this.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL; // make the game fir the screen
       this.scale.pageAlignHorizontally= true;// make the game centered horizontally
       this.scale.pageAlignVertically= true;
       
       this.background=this.game.add.sprite(0,0, 'background');  
       
       //group for animals
       var animalData=[
           {key: 'chicken', text: 'CHICKEN', audio: 'chickenSound'},
           {key: 'horse', text: 'HORSE', audio: 'horseSound'},
           {key: 'pig', text: 'PIG', audio: 'pigSound'},
           {key: 'sheep', text: 'SHEEP', audio: 'sheepSound'},
           //{key: 'cat', text:'CAT',audio: 'catSound'}
           ];
            
       this.animals=this.game.add.group();
       
       var self=this;
       var animal;
       
       animalData.forEach(function(element){
           //create animal and its properties
           animal=self.animals.create(-1000, self.game.world.centerY, element.key,1);
           //saving everything that's not Phaser related to object
           animal.customParams={text: element.text, sound: self.game.add.audio(element.audio)}
           animal.anchor.setTo(0.5);
           
           // create animal animaton
           animal.animations.add('animate',[0,1,2,1],3,false);
           
           animal.inputEnabled=true;
           animal.input.pixelPerfectClick=true;
           animal.events.onInputDown.add(self.animateAnimal, this)
           
       });
       //place first animal in the middle
       this.currentAnimal= this.animals.next();
       this.currentAnimal.position.set(this.game.world.centerX, this.game.world.centerY);
       
       //show animal text
       this.showText(this.currentAnimal);
       
       
       /*this.pig=this.game.add.sprite(this.game.world.centerX, this.game.world.centerY, 'pig');
       this.pig.anchor.setTo(0.5);
       
       this.pig.inputEnabled=true; 
       this.pig.input.pixelPerfectClick= true ;
       this.pig.events.onInputDown.add(this.animateAnimal, this);
       //this.pig.scale.setTo(-1,1); //to flip the image use negative sign
       
       /*this.chicken=this.game.add.sprite(this.game.world.centerX, this.game.world.centerY,'chicken');
       this.chicken.anchor.setTo(0.5,0.5); 
       this.chicken.scale.setTo(2,1); 
       
       this.sheep=this.game.add.sprite(100,250,'sheep');
       this.sheep.scale.setTo(0.5);
       this.sheep.anchor.setTo(0.5);
       this.sheep.angle=0; //to rotate the image*/
       
       this.leftArrow=this.game.add.sprite(60, this.game.world.centerY,'arrow')
       this.leftArrow.anchor.setTo(0.5); 
       this.leftArrow.scale.setTo(-1,1);
       this.leftArrow.customParams= {direction:-1};
       
       this.leftArrow.inputEnabled=true; //allow user input
       this.leftArrow.input.pixelPerfectClick = true ; // check the pixel every time the mouse moves
       this.leftArrow.events.onInputDown.add(this.switchAnimal, this); //recives a down event from pointer
       
       
       this.rightArrow=this.game.add.sprite(580, this.game.world.centerY,'arrow')
       this.rightArrow.anchor.setTo(0.5); 
       this.rightArrow.customParams= {direction:1};
       
       this.rightArrow.inputEnabled=true; 
       this.rightArrow.input.pixelPerfectClick= true ;
       this.rightArrow.events.onInputDown.add(this.switchAnimal, this);
    },
    // executed multiple times
    update: function(){
        //this.sheep.angle+=0.5;
        
    },
    
    switchAnimal: function(sprite, event) {
        
        if (this.isMoving){
            return false;
        }
        
        this.isMoving=true;
        
        //hide text
        this.animalText.visible=false;
        
        var newAnimal, endX;
        
        //get direction of animal
        if(sprite.customParams.direction>0){
            newAnimal=this.animals.next();  //get next animal
            newAnimal.x=-newAnimal.width/2
            endX=640+this.currentAnimal.width; //get final destination of current animal
            
        }
        else{
             newAnimal =this.animals.previous();
             newAnimal.x=640+newAnimal.width/2
             endX=-this.currentAnimal.width/2;
        }
        
        //make image to move
        var newAnimalMovement=this.game.add.tween(newAnimal);
        newAnimalMovement.to({x: this.game.world.centerX},1000); // the image move from x to center, thousand milisecond
        newAnimalMovement.onComplete.add(function(){
            this.isMoving=false
            this.showText(newAnimal);
        }, this);
        newAnimalMovement.start();
        
        var currentAnimalMovement=this.game.add.tween(this.currentAnimal);
        currentAnimalMovement.to({x:endX}, 1000);
        currentAnimalMovement.start();
        
        this.currentAnimal=newAnimal; //let the next animal as the new current animal
        
    },    
    
    animateAnimal:function(sprite, event){
    sprite.play('animate');
    sprite.customParams.sound.play();
    },      
    
    showText: function(animal){
        if(!this.animalText){
            var style={
                font: 'bold 30pt Arial',
                fill:'yellow',
                allign:'center'
            }
            
            this.animalText=this.game.add.text(this.game.width/2, this.game.height*0.85, '', style);
            this.animalText.anchor.setTo(0.5);
        }
        this.animalText.setText(animal.customParams.text);
        this.animalText.visible=true;
    }
};
 //initiate Phaser framework
var game=new Phaser.Game(600, 360, Phaser.AUTO);

game.state.add('GameState', GameState);
game.state.start('GameState');




