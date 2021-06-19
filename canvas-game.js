const canvas=document.getElementById("canvas");
const c=canvas.getContext("2d");

class Player{
    constructor(size,pos){
        this.x=300;
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

addEventListener("click", ()=>{
    if(player.pos=="d"){
        player.pos="u";
    }else if(player.pos=="u"){
        player.pos="d";
    }
});


addEventListener("keydown", function a (ev) {
    if (ev.key===" "){
        if(player.pos=="d"){
            player.pos="u";
        }else if(player.pos=="u"){
            player.pos="d";
        }       
    }
});

var player=new Player(100,"d");

function resize(){
    c.canvas.height=innerHeight-5;
    c.canvas.width=innerWidth-5;
    UP=Math.floor(innerHeight/3)-30;
    DOWN=Math.floor(2*innerHeight/3)+30;
}
resize();
drawScene();
player.draw();
addEventListener("resize",resize);

var UP;
var DOWN;

var animate;

function play() {
    drawScene();
    player.draw();
    requestAnimationFrame(play);
}

play();

function drawScene(){
    c.fillStyle="#404040";
    c.fillRect(0,UP,innerWidth,DOWN-UP);
}