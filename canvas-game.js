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
    player.size=Math.floor((DOWN-UP)/3);
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
    }
    draw() {
        c.fillStyle="rgba(255, 23, 243,.9)";
        if(this.pos=="d"){
            c.fillRect(this.x,DOWN-this.size,this.size,this.size);
        }
        else if(this.pos=="u"){
            c.fillRect(this.x,UP,this.size,this.size);
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

//game logic
var player=new Player(secWidth/2, Math.floor((DOWN-UP)/2),"d");

var sections=5;
var secWidth=Math.floor(innerWidth/sections);

var hurdles=[];
var elements=[];

elements.push(new Empty(0,0));
elements.push(new Empty(0,0));
elements.push(new Empty(0,0));

resize(); //also updates sections and secWidth variables if change needed

var x=0;

function moveScene(){
    x+=innerWidth/200;
    resize();

    //updating elements based on new size properties and shifting them to porduce a sense of motion
    for (let i=0; i<elements.length; i++){
        elements[i].start=i*secWidth-x-15;
        elements[i].width=secWidth-30;
    }
   
    //drawing elements on the canvas
    c.clearRect(0,0,canvas.width,canvas.height)
    drawScene();
    drawElements();
    player.draw();

    //identifying 
    if(x>=secWidth){
        elements.splice(0,1);
        x=0;
    }
    requestAnimationFrame(moveScene)
}
moveScene();