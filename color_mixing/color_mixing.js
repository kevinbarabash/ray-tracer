const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

// ctx.translate(0.5, 0);

ctx.fillStyle = 'rgb(0,255,0)';
ctx.fillRect(50,50,50,50);

ctx.fillStyle = 'rgb(0,0,255)';
ctx.fillRect(250,50,50,50);

var grad = ctx.createLinearGradient(100,0,250,0);
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

