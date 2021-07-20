const canvas=document.getElementById("canvas");
const c=canvas.getContext("2d");

var UP;
var DOWN;

function resize(){
    c.canvas.height=innerHeight-5;
    c.canvas.width=innerWidth-5;
    UP=Math.floor(innerHeight/3)-30;
    DOWN=Math.floor(2*innerHeight/3)+30;
    do{
        if(secWidth>500){
            sections+=1;
        }else if(secWidth<200){
            sections-=1;
        }
        secWidth=Math.floor(innerWidth/sections);
    }while( secWidth>500 || secWidth<200)
    player.size=Math.floor((DOWN-UP)/3)-20;
    if(player.size > secWidth/2.5-30){
        player.size= Math.floor(secWidth/2.5-30);
    }
    if(player.size>secWidth/2-30){
        player.size=secWidth/2-30;
    }
    do{
        if(elements.length<sections+2){
            elements.push(randomElement());
        }else if(elements.length>sections+2){
            elements.splice(elements.length,1);
        }
    }while( elements.length != sections+2 )
}

class Player{
    constructor(x,size,pos){
        this.x=x;
        this.size=size;
        this.pos=pos;
        this.y=DOWN-size;
        this.angle=0;
        this.transition=15;
        this.invincible=false;
        this.cx=0;
        this.cy=0;
    }
    draw() {
        this.update();
        c.save();
        c.translate(this.x,this.y);
        c.rotate(this.angle);
        c.fillStyle= "#FF4F58FF";
        
        c.beginPath();
        c.moveTo(0,0);
        c.lineTo(this.size,0);
        c.lineTo(this.size/2,-this.size)
        c.fill();

        c.restore();
    }
    update(){
        let speedY=Math.floor((DOWN-UP)/this.transition);
        let speedX=Math.floor(this.size/this.transition)
        if(this.pos=="d"){
            this.y+=speedY;
            this.x-=speedX;
            this.angle+=Math.PI/this.transition;
        }else if(this.pos=="u"){
            this.x+=speedX;
            this.y-=speedY;
            this.angle-=Math.PI/this.transition;
        }
        if(this.y < UP){
            this.y=UP;
            this.x=Math.floor(secWidth/2)+this.size;
            this.angle=-Math.PI;
        }else if(this.y > DOWN){
            this.y=DOWN;
            this.x=Math.floor(secWidth/2);
            this.angle=0;
        }

        this.cx=this.x+this.size*(Math.cos(this.angle)/2+Math.sin(this.angle)/3);
        this.cy=this.y-this.size*(Math.cos(this.angle)/3-Math.sin(this.angle)/2);
    }
}

class Hole{
    constructor(start,width,pos){
        this.start=start;
        this.width=width;
        this.pos=pos;
    }
    draw(){   
        c.fillStyle="rgba(240, 246, 247, .9)";    
        if(this.pos==="u"){
            c.fillRect(this.start,0,this.width,UP);
        }
        else if(this.pos==="d"){
            c.fillRect(this.start,DOWN,this.width,innerHeight-DOWN)
        }       
    }
    checkCollision(){
        if(this.pos=="d" && player.y==DOWN){
            let flag=0;
            if(player.x > this.start && player.x < this.start+this.width){
                flag+=1;
            }
            if(player.x+player.size/2 > this.start && player.x+player.size/2 < this.start+this.width){
                flag+=1;
            }
            if(player.x+player.size > this.start && player.x+player.size < this.start+this.width){
                flag+=1;
            }
            if(flag>1){
                return true;
            }else{
                return false;
            }
        }else if(this.pos=="u" && player.y==UP){
            let flag=0;
            if(player.x > this.start && player.x < this.start+this.width){
                flag+=1;
            }
            if(player.x-player.size/2 > this.start && player.x-player.size/2 < this.start+this.width){
                flag+=1;
            }
            if(player.x-player.size > this.start && player.x-player.size < this.start+this.width){
                flag+=1;
            }
            if(flag>1){
                return true;
            }else{
                return false;
            }
        }
    }
}

class MovingObstacle{
    constructor (start,width,direction){
        this.start=start;
        this.width=width;
        this.y=Math.floor((UP+this.width/2)+(Math.random() * (DOWN-UP-this.width)));
        this.direction=direction;
    }
    draw(){
        this.update();
        c.fillStyle="red";
        c.beginPath();
        c.arc(this.start+this.width/2,this.y,this.width/4,0,Math.PI*2);
        c.fill();
    }
    update(){
        let dy =Math.floor((DOWN-UP)/(60-score/50));
        if(this.direction=="d"){
            this.y+=dy;
        }else if(this.direction=="u"){
            this.y-=dy;
        }
        let radius=this.width/4;
        if(this.y<UP+radius){
            this.y=UP+radius;
            this.direction="d";
        }else if(this.y > DOWN - radius){
            this.y=DOWN-radius;
            this.direction="u";
        }
    }
    checkCollision(){
        //because the hit boxes are circles, there can be small imperfections in collision detection as the player object is triangular shaped. but it works good enough when i tried and i decided to leave it that way 
        if ( Math.sqrt(Math.pow(this.start+this.width/2-player.cx,2)+Math.pow(this.y-player.cy,2)) < this.width/4+player.size/2.5){ 
            return true;
        }
        else{
            return false;
        }
    }
}

class Empty{
    constructor(start,width){
        this.start=start;
        this.width=width;
    }
    draw(){
        c.fillStyle="#669DB3FF"
        c.fillRect(this.start,0,this.width,UP);
        c.fillRect(this.start,DOWN,this.width,innerHeight-DOWN);
    }
    checkCollision(){
        return false;
    }
}


var icount=0;
var scount=0;

class Powerup{
    constructor(type , x, yfr){
        this.type=type;
        this.x=x;
        this.yfr=yfr;
    }

    draw(){
        let img;
        img=new Image();
        if (this.type=="invincible"){
            img.src="./svgs/invincible.svg"
        }
        else if(this.type="slowdown"){
            img.src="./svgs/slowdown.svg"
        }
        if(this.yfr*(DOWN-UP)>secWidth/4 && (1-this.yfr)*(DOWN-UP)>secWidth/4){
            c.strokeRect(this.x,this.yfr*(DOWN-UP)+UP,secWidth/4,secWidth/4);
            c.drawImage(img,this.x,this.yfr*(DOWN-UP)+UP,secWidth/4,secWidth/4);
        }else if(this.yfr*(DOWN-UP)<secWidth/4){
            c.strokeRect(this.x,UP,secWidth/4,secWidth/4);
            c.drawImage(img,this.x,UP,secWidth/4,secWidth/4);
        }else if((1-this.yfr)*(DOWN-UP)>secWidth/4){
            c.strokeRect(this.x,DOWN-secWidth/4,secWidth/4,secWidth/4);
            c.drawImage(img,this.x,DOWN-secWidth/4,secWidth/4,secWidth/4);
        }
        
    }

    checkCollision(){
        if(Math.sqrt(Math.pow(this.x-player.cx,2)+Math.pow(this.yfr*(DOWN-UP)+UP-player.cy,2)) < secWidth/3+player.size/2.5){
            const a=new Audio();
            a.src="sounds/PowerUp.wav";
            a.volume=0.3;
            a.play();
            if (this.type=="invincible"){
                icount+=1
                player.invincible=true;
                document.getElementById("invincible").style.display="";
                setTimeout(() => {
                    icount-=1;
                    if(icount==0){
                        const a=new Audio();
                        a.src="sounds/PowerDown.mp3";
                        a.volume=0.2;
                        a.play();
                        setTimeout(()=>{
                            if(icount==0){
                            document.getElementById("invincible").style.display="none";
                            player.invincible=false;
                            }
                        },200);                      
                    }           
                }, 4800);
            }
            else if(this.type="slowdown"){
                slowdown=true;
                scount+=1;
                document.getElementById("slowdown").style.display="";
                setTimeout(() => {
                    scount-=1;
                    if(icount==0){
                        const a=new Audio();
                        a.src="sounds/PowerDown.mp3";
                        a.volume=0.2;
                        a.play();
                        setTimeout(()=>{
                            if(scount==0){
                            document.getElementById("slowdown").style.display="none";
                            slowdown=false;
                            }
                        },200);                      
                    }           
                }, 4800);
            }
            this.x=-500;
        }else{
            return;
        }
    }


}
//game controls - event listeners

addEventListener("mousedown", ()=>{
    const a=new Audio();
    a.src="sounds/jump.mp3"
    a.volume=0.3;
    a.play();
    if(player.pos=="d"){
        player.pos="u";
    }else if(player.pos=="u"){
        player.pos="d";
    }
});


addEventListener("keydown", (ev) => {
    if (ev.key===" "){
        const a=new Audio();
        a.src="sounds/jump.mp3"
        a.volume=0.3;
        a.play();
        if(player.pos=="d"){
            player.pos="u";
        }else if(player.pos=="u"){
            player.pos="d";
        }       
    }
});

addEventListener("keydown",(ev) => {
    if (ev.key==="q"){
        this.cancelAnimationFrame(reqId)    
        play1=0
    }
});

addEventListener("resize",resize);

document.querySelector("button").addEventListener("click", () =>{
    location.reload();
})

addEventListener("load", () => {
    resize();
    document.getElementById("score").innerHTML=`SCORE :0 <br> HIGHSCORE : ${localStorage.getItem("highscore")==null ? 0 : localStorage.getItem("highscore")}`
})


//functions for the game

function drawScene(){
    c.fillStyle="rgba(240, 246, 247, .9)";
    c.fillRect(0,UP,innerWidth,DOWN-UP);
    c.fillStyle="#669DB3FF";
    c.fillRect(0,0,innerWidth,UP);
    c.fillRect(0,DOWN,innerWidth,innerHeight-DOWN);
}
function drawElements(){
    for (let i=0; i<elements.length; i++){
        elements[i].draw();
    }
}
function checkCollisions(){
    if(!player.invincible){
    elements.forEach( (e) => {
        if(e.checkCollision()){
            terminate();
        }
    })        
    }
    powerups.forEach( (e) => {
        e.checkCollision();
    })  
}
function randomElement(){
    let x=Math.random();

    if( Math.floor(100*x)%10 == 0){
        if(Math.random()>.5){
            powerups.push(new Powerup("slowdown", innerWidth+Math.random()*secWidth,Math.random()))
        }else{
            powerups.push(new Powerup("invincible", innerWidth+Math.random()*secWidth,Math.random()))
        }

    }

    if(x < .15){
        return new Hole(0,0,"d");
    }else if(x>.85){
        return new Hole(0,0,"u");
    }else if( .45<x && x<.55){
        return new MovingObstacle(0,0, (Math.random() > .75) ? "d" : "u");
    }else {
        return new Empty(0,0);
    }  
}
function terminate(){
    cancelAnimationFrame(reqId);
    c.fillStyle = "rgba(50,50,50,.2)";
    c.fillRect(0,0,c.canvas.width,c.canvas.height);
    document.getElementById("full-screen").style="display: grid"
    document.querySelector("h1").innerHTML=score;
    if(localStorage.getItem("highscore")==null){
        localStorage.setItem("highscore", score);
    }
    else if(localStorage.getItem("highscore") < score){
        localStorage.setItem("highscore", score)
    }
}

//game logic
var player=new Player(secWidth/2, Math.floor((DOWN-UP)/2),"d");

var sections=5;
var secWidth=Math.floor(innerWidth/sections);

var elements=[];
var powerups=[];

elements.push(new Empty(0,0));
elements.push(new Empty(0,0));
elements.push(new Empty(0,0));

resize(); //also updates sections and secWidth variables if change needed
player.y=DOWN-player.size;

var x=0;
var score=0;
var reqId;
var play1=1;
var slowdown=false;

document.getElementById("slowdown").style.display="none";
document.getElementById("invincible").style.display="none";

function play(){
    if(play1){
        reqId=requestAnimationFrame(play)
    }


    resize(); //updates UP, DOWN, sections, secWidth, and elements according to screen size
    if(!slowdown){
        x+=Math.floor(secWidth/30+score/100);
        player.transition=20-Math.floor(score/200)
    }else{
        x+=secWidth/30;
        player.transition=20;
    }
    

    //updating elements based on new size properties and shifting them to porduce a sense of motion
    for (let i=0; i<elements.length; i++){
        elements[i].start=i*secWidth-x-secWidth/3;
        elements[i].width=secWidth-2*secWidth/3;
    }
   
    //drawing elements on the canvas
    drawScene();
    drawElements();
    if(powerups.length){
        if(powerups[0].x < -secWidth){
            powerups.shift();
        }
    }

    powerups.forEach( (e) =>{
        e.x-=(slowdown)? secWidth/30 : secWidth/30+score/100
        e.draw();
    })
    player.draw();



    //checking for collisions
    checkCollisions();
    


    //identifying 
    if(x>=secWidth){
        score+=10;
        document.getElementById("score").innerHTML=`SCORE :${score} <br> HIGHSCORE : ${localStorage.getItem("highscore")==null ? 0 : localStorage.getItem("highscore")}`
        elements.splice(0,1);
        x=0;
    }

}
play();