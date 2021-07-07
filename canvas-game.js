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
        if(elements.length<sections+1){
            elements.push(randomElement());
        }else if(elements.length>sections+1){
            elements.splice(elements.length-1,1);
        }
    }while( elements.length != sections+1 )
}

class Player{
    constructor(x,size,pos){
        this.x=x;
        this.size=size;
        this.pos=pos;
        this.y=DOWN-size;
        this.angle=0;
        this.transition=15;
        this.cx=0;
        this.cy=0;
    }
    draw() {
        this.update();
        c.save();
        c.translate(this.x,this.y);
        c.rotate(this.angle);
        c.fillStyle= "#FF4F58FF";
        
        if(this.pos=="d"){
            c.beginPath();
            c.moveTo(0,0);
            c.lineTo(this.size,0);
            c.lineTo(this.size/2,-this.size)
            c.fill();
        }
        else if(this.pos=="u"){
            c.beginPath();
            c.moveTo(0,0);
            c.lineTo(this.size,0);
            c.lineTo(this.size/2,-this.size)
            c.fill();
        }
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
    constructor (start,width){
        this.start=start;
        this.width=width;
        this.y=Math.floor(UP+this.width/2);
        this.direction="d";
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
//game controls - event listeners

addEventListener("mousedown", ()=>{
    if(player.pos=="d"){
        player.pos="u";
    }else if(player.pos=="u"){
        player.pos="d";
    }
});


addEventListener("keydown", function asdf (ev) {
    if (ev.key===" "){
        if(player.pos=="d"){
            player.pos="u";
        }else if(player.pos=="u"){
            player.pos="d";
        }       
    }
});

addEventListener("keydown", function asdf (ev) {
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
    for (let i=0; i<elements.length; i++){
        if(elements[i].checkCollision()){
            terminate();
            break;
        }
    }
}
function randomElement(){
    let x=Math.random();

    if(x < .15){
        return new Hole(0,0,"d");
    }else if(x>.85){
        return new Hole(0,0,"u");
    }else if( .45<x && x<.55){
        return new MovingObstacle(0,0);
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

elements.push(new Empty(0,0));
elements.push(new Empty(0,0));
elements.push(new Empty(0,0));

resize(); //also updates sections and secWidth variables if change needed
player.y=DOWN-player.size;

var x=0;
var score=0;
var reqId;
var play1=1;

function play(){
    if(play1){
        reqId=requestAnimationFrame(play)
    }

    resize(); //updates UP, DOWN, sections, secWidth, and elements according to screen size
    x+=Math.floor(secWidth/30+score/100);
    player.transition=20-Math.floor(score/200)

    //updating elements based on new size properties and shifting them to porduce a sense of motion
    for (let i=0; i<elements.length; i++){
        elements[i].start=i*secWidth-x-secWidth/3;
        elements[i].width=secWidth-2*secWidth/3;
    }
   
    //drawing elements on the canvas
    drawScene();
    drawElements();
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