const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// ctx.translate(0.5, 0);

ctx.fillStyle = 'rgb(0,255,0)';
ctx.fillRect(50,50,50,50);

ctx.fillStyle = 'rgb(0,0,255)';
ctx.fillRect(250,50,50,50);

let grad = ctx.createLinearGradient(100,0,250,0);
grad.addColorStop(0, 'rgb(0,255,0)');
grad.addColorStop(1, 'rgb(0,0,255)');

ctx.fillStyle = grad;
ctx.fillRect(100,50,150,50);


ctx.fillStyle = 'rgb(0,255,0)';
ctx.fillRect(50,150,50,50);

ctx.fillStyle = 'rgb(0,192,64)';
ctx.fillRect(100,150,50,50);

ctx.fillStyle = 'rgb(0,128,128)';
ctx.fillRect(150,150,50,50);

ctx.fillStyle = 'rgb(0,64,192)';
ctx.fillRect(200,150,50,50);

ctx.fillStyle = 'rgb(0,0,255)';
ctx.fillRect(250,150,50,50);

// Physically correct color mixing
// http://scottsievert.com/blog/2015/04/23/image-sqrt/

let g, b;

ctx.fillStyle = 'rgb(0,255,0)';
ctx.fillRect(50,250,50,50);

g = (255 * Math.sqrt(0.75)) | 0;
b = (255 * Math.sqrt(0.25)) | 0;

ctx.fillStyle = `rgb(0,${g},${b})`;
ctx.fillRect(100,250,50,50);

g = (255 * Math.sqrt(0.5)) | 0;
b = (255 * Math.sqrt(0.5)) | 0;

ctx.fillStyle = `rgb(0,${g},${b})`;
ctx.fillRect(150,250,50,50);

g = (255 * Math.sqrt(0.25)) | 0;
b = (255 * Math.sqrt(0.75)) | 0;

ctx.fillStyle = `rgb(0,${g},${b})`;
ctx.fillRect(200,250,50,50);

ctx.fillStyle = 'rgb(0,0,255)';
ctx.fillRect(250,250,50,50);


let c1 = [0, 0, 255];
let c2 = [128, 128, 128];

let y = 350, c;

ctx.fillStyle = `rgb(${c1.join(',')})`;
ctx.fillRect(50,y,50,50);

c1 = c1.map(x => x / 255);
c2 = c2.map(x => x / 255);

c = [
    0.75 * c1[0] * c1[0] + 0.25 * c2[0] * c2[0],
    0.75 * c1[1] * c1[1] + 0.25 * c2[1] * c2[1],
    0.75 * c1[2] * c1[2] + 0.25 * c2[2] * c2[2]
].map(x => 255 * Math.sqrt(x) | 0);

ctx.fillStyle = `rgb(${c.join(',')})`;
ctx.fillRect(100,y,50,50);

c = [
    0.5 * c1[0] * c1[0] + 0.5 * c2[0] * c2[0],
    0.5 * c1[1] * c1[1] + 0.5 * c2[1] * c2[1],
    0.5 * c1[2] * c1[2] + 0.5 * c2[2] * c2[2]
].map(x => 255 * Math.sqrt(x) | 0);

ctx.fillStyle = `rgb(${c.join(',')})`;
ctx.fillRect(150,y,50,50);

c = [
    0.25 * c1[0] * c1[0] + 0.75 * c2[0] * c2[0],
    0.25 * c1[1] * c1[1] + 0.75 * c2[1] * c2[1],
    0.25 * c1[2] * c1[2] + 0.75 * c2[2] * c2[2]
].map(x => 255 * Math.sqrt(x) | 0);

ctx.fillStyle = `rgb(${c.join(',')})`;
ctx.fillRect(200,y,50,50);

c = [
    0.0 * c1[0] * c1[0] + 1.0 * c2[0] * c2[0],
    0.0 * c1[1] * c1[1] + 1.0 * c2[1] * c2[1],
    0.0 * c1[2] * c1[2] + 1.0 * c2[2] * c2[2]
].map(x => 255 * Math.sqrt(x) | 0);

ctx.fillStyle = `rgb(${c.join(',')}`;
ctx.fillRect(250,y,50,50);

y = 450;

ctx.fillStyle = `rgb(128,128,128)`;
ctx.fillRect(50,y,250,50);

ctx.fillStyle = `rgba(0,0,255,1.0)`;
ctx.fillRect(50,y,50,50);

ctx.fillStyle = `rgba(0,0,255,0.75)`;
ctx.fillRect(100,y,50,50);

ctx.fillStyle = `rgba(0,0,255,0.5)`;
ctx.fillRect(150,y,50,50);

ctx.fillStyle = `rgba(0,0,255,0.25)`;
ctx.fillRect(200,y,50,50);


y = 550;
ctx.fillStyle = `rgb(128,128,128)`;
ctx.fillRect(50,y,250,50);

ctx.fillStyle = `rgb(0,0,255)`;
ctx.fillRect(50,y,50,50);

grad = ctx.createLinearGradient(100,0,250,0);
grad.addColorStop(0, 'rgba(0,0,255,1.0)');
grad.addColorStop(1, 'rgba(0,0,255,0.0)');

ctx.fillStyle = grad;
ctx.fillRect(100,y,150,50);

y = 650;

c1 = [0, 0, 255];
c2 = [128, 128, 128];

ctx.fillStyle = `rgb(${c1.join(',')})`;
ctx.fillRect(50,y,50,50);

c1 = c1.map(x => x / 255);
c2 = c2.map(x => x / 255);

let x = 100;

for (var i = 0; i < 75; i++) {
    let p = 1.0 - i / 75.;
    let q = i / 75.;
    c = [
        p * c1[0] * c1[0] + q * c2[0] * c2[0],
        p * c1[1] * c1[1] + q * c2[1] * c2[1],
        p * c1[2] * c1[2] + q * c2[2] * c2[2]
    ].map(x => 255 * Math.sqrt(x) | 0);

    ctx.fillStyle = `rgb(${c.join(',')})`;
    ctx.fillRect(x,y,2,50);

    x += 2;
}


c = [
    0.0 * c1[0] * c1[0] + 1.0 * c2[0] * c2[0],
    0.0 * c1[1] * c1[1] + 1.0 * c2[1] * c2[1],
    0.0 * c1[2] * c1[2] + 1.0 * c2[2] * c2[2]
].map(x => 255 * Math.sqrt(x) | 0);

ctx.fillStyle = `rgb(${c.join(',')}`;
ctx.fillRect(250,y,50,50);