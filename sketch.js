let p;
let dead, paused;
let grav, jumpSpeed, a, score, spike, side, buff, nSpikes, deadfr, frLim, jumped, jumpfr, highScore;

function init(){
    p = {
        x: width/2,
        y: height/2,
        r: 15,
        dx: 4,
        dy: 0
    }
    grav = 0.4;
    jumpSpeed = 7;
    dead = false;
    frLim = 80;
    jumped = -1;
    paused = true;
    a = 0;
    score = 0;
    spike = height/15;
    spikeH = spike*2/3;
    buff = spike/3;
    side = 1; //right
    //nSpikes = 2;
    wall = [0,0,0,0,0,0,0,0,0,0]
}

function setup() {
    createCanvas(350, 500);
    rectMode(CENTER);
    textAlign(CENTER);
    highScore = 0;
    init();
    noStroke();
}

function draw() {
    background(230);
    fill(255);
    ellipse(width/2, height/2, width*2/3, width*2/3);

    if(frameCount-jumpfr > 15 && jumped == 1) jumped = -1;

    //update
    if(!paused){
        p.x += p.dx;
        p.dy+= grav;
        p.y += p.dy;
    }

    //Side
    if(p.x > width - p.r || p.x < p.r){
        if(!dead){
            score += 1;
            side = -side;
            genSide();
        }
        p.dx = -p.dx;
    }

    //Bottom
    if(p.y > height-p.r-spikeH || p.y < p.r+spikeH){
        die()
    }
    if(p.y > height-p.r){
        p.dy = -jumpSpeed*5/4;
        p.y = height-p.r;
    }

    if(dead){
        a+= 0.2*sgn(p.dx);
    }

    for(let i = 0; i<10; i++){
        if(wall[i] == 1){
            let x = side == 1 ? width : 0;
            let y = buff*3 + spike*i + buff*(i+1) + spike/2;
            let rad = spikeH + p.r*3/4;
            //push();
            //fill(100, 100, 0);
            //ellipse(x, y, rad, rad);
            //pop();
            if(sq(p.x - x) + sq(p.y - y) < sq(rad)){
                die()
            }

        }
    }

    //Score
    textSize(150);
    fill(190);
    text(("0"+score).slice(-2), width/2, height/2+50);
    if(paused || dead){
        textSize(30);
        fill(150);
        text("Best score: "+highScore, width/2, height*4/5);
    }

    //Bird
    push();
    translate(p.x, p.y);
    rotate(a);
    drawSprite();
    pop();

    //Spikes
    push();
    translate(0, buff*3);
    if(side == 1)translate(width, 0);
    for(let i=0; i<10; i++){
        translate(0, buff);
        if(wall[i]){
            fill(150);
            if(side == 1){ //Desni zid
                triangle(0, i*spike, 0, (i+1)*spike, -spikeH, (i+1/2)*spike);
            }
            else{         //Levi zid
                triangle(0, i*spike, 0, (i+1)*spike, spikeH, (i+1/2)*spike); 
            }
        }
    }
    pop();

    push();
    fill(150);
    translate(buff, 0);
    for(let i = 0; i<7; i++){
        translate(buff, 0);
        triangle(i*spike, 0, (i+1)*spike, 0, (i+1/2)*spike, spikeH);
        translate(0, height);
        triangle(i*spike, 0, (i+1)*spike, 0, (i+1/2)*spike, -spikeH);
        translate(0, -height);
    }
    pop();

}



function mousePressed(){
    if(paused) paused = false;
    if(!dead){
        jumped = 1;
        jumpfr = frameCount;
        p.dy = -jumpSpeed;
    }
    else{
        if(frameCount - deadfr > frLim){
            init();
        }
    }
}

function sgn(x){
    return x > 0 ? 1 : -1;
}

function drawSprite(){
    fill(90);
    
    noStroke();
    //Body ------
    //rect(0, 0, p.r*2, p.r*2, 5)   unicolor
    if(!dead)fill(255, 40, 40);
    rect(0, 0, p.r*2, p.r*2, 10);
    //Tail
    triangle(-side*p.r, 0, -side*p.r, -p.r/2, -side*p.r*3/2, -p.r/2);
    if(!dead)fill(247, 40, 40);
    rect(0, p.r/2, p.r*2, p.r, 0, 0, 10, 10);

    //Wing ------
    if(!dead) fill(207, 25, 25);
    triangle(0, 0, -side*p.r*2/3, 0, -side*p.r*2/3, jumped*p.r*2/3); //poslednje menjaj za gore dole

    //Beak ------
    if(!dead)fill(255, 220, 0);
    triangle(side*p.r, -p.r/2, side*p.r, 0, side*p.r*3/2, 0);
    if(!dead)fill(240, 200, 0);
    triangle(side*p.r, p.r/2, side*p.r, 0, side*p.r*3/2, 0);

    fill(255);
    ellipse(side*p.r/2, -p.r/2, p.r/4+2, p.r/4+2);

    // fill(255, 220, 0);
    // triangle(p.r, -p.r/2, p.r, 0, p.r*3/2, 0);
    // fill(240, 200, 0);
    // triangle(p.r, p.r/2, p.r, 0, p.r*3/2, 0);

    //ellipse(0, 0, p.r, p.r);
}

function genSide(){
    nSpikes = newN(score);
    wall = [0,0,0,0,0,0,0,0,0,0];
    for(let i = 0; i<nSpikes; i++){
        let index = Math.floor(Math.random()*10);
        while(wall[index] == 1){
            index = Math.floor(Math.random()*10);
        }
        wall[index] = 1;
    }
}

function newN(score){
    let n = Math.floor(Math.sqrt(score+3));
    return n>8 ? 8 : n;
}

function die(){
    if(!dead) deadfr = frameCount;
    dead = true;
    if(score > highScore) highScore = score;
}