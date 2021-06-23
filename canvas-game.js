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
    player.x=Math.floor(secWidth/2);
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
    }
    draw() {
        this.update();
        c.fillStyle="rgb(255, 23, 243)";
        if(this.pos=="d"){
            c.fillRect(this.x,this.y,this.size,this.size);
        }
        else if(this.pos=="u"){
            c.fillRect(this.x,this.y,this.size,this.size);
        }
    }
    update(){
        let speed=Math.floor((DOWN-UP)/15);
        if(this.pos=="d"){
            this.y+=speed;
        }else if(this.pos=="u"){
            this.y-=speed;
        }
        if(this.y < UP){
            this.y=UP;
        }else if(this.y > DOWN-this.size){
            this.y=DOWN-this.size;
        }
    }
}

class Hole{
    constructor(start,width,pos){
        this.start=start;
        this.width=width;
        this.pos=pos;
    }
    draw(){   
        c.fillStyle="red";    
        if(this.pos==="u"){
            c.fillRect(this.start,0,this.width,UP);
        }
        else if(this.pos==="d"){
            c.fillRect(this.start,DOWN,this.width,innerHeight-DOWN)
        }       
    }
    checkCollision(){
        if((this.pos=="d" && player.y==DOWN-player.size) || (this.pos=="u" && player.y==UP)){
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
                terminate();
                return true;
            }else{
                return false;
            }
        }
    }
}

class Empty{
    constructor(start,width){
        this.start=start;
        this.width=width;
    }
    draw(){
        c.fillStyle="#202020"
        c.fillRect(this.start,0,this.width,UP);
        c.fillRect(this.start,DOWN,this.width,innerHeight-DOWN);
    }
    checkCollision(){
        return false;
    }
}
//game controls - event listeners

addEventListener("click", ()=>{
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

addEventListener("resize",resize);

document.querySelector("button").addEventListener("click", () =>{
    console.log("refreshing");
    location.reload();
})

addEventListener("load", () => {
    resize();
    document.getElementById("score").innerHTML=`SCORE :0 <br> HIGHSCORE : ${localStorage.getItem("highscore")==null ? 0 : localStorage.getItem("highscore")}`
})
//functions for the game

function drawScene(){
    c.fillStyle="#404040";
    c.fillRect(0,UP,innerWidth,DOWN-UP);
    c.fillStyle="#202020";
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
    }else {
        return new Empty(0,0);
    }
}
function terminate(){
    cancelAnimationFrame(reqId);
    document.getElementById("full-screen").style="display: grid"
    document.querySelector("h1").innerHTML=score;
    if(localStorage.getItem("highscore")==null){
        localStorage.setItem("highscore", score);
        console.log("updated highscore");
    }
    else if(localStorage.getItem("highscore") < score){
        localStorage.setItem("highscore", score)
    }
}

//game logic
var player=new Player(secWidth/2, Math.floor((DOWN-UP)/2),"d");
console.log(player);

var sections=5;
var secWidth=Math.floor(innerWidth/sections);

var elements=[];

elements.push(new Empty(0,0));
elements.push(new Empty(0,0));
elements.push(new Empty(0,0));

resize(); //also updates sections and secWidth variables if change needed
player.y=DOWN-player.size;

console.log(player)

var x=0;
var score=0;
var reqId;

function play(){
    reqId=requestAnimationFrame(play)
    resize(); //updates UP, DOWN, sections, secWidth, and elements according to screen size
    x+=Math.floor(secWidth/30);

    //updating elements based on new size properties and shifting them to porduce a sense of motion
    for (let i=0; i<elements.length; i++){
        elements[i].start=i*secWidth-x-secWidth/3;
        elements[i].width=secWidth-2*secWidth/3;
    }
   
    //drawing elements on the canvas
    c.clearRect(0,0,canvas.width,canvas.height)
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

play()

