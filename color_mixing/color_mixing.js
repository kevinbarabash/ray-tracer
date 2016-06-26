const draw = (canvas, callback) => {
    const ctx = canvas.getContext('2d');
    callback(ctx);
};

draw(document.querySelector('#discrete_color'), (ctx) => {
    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.fillRect(0,0,50,50);

    ctx.fillStyle = 'rgb(0,192,64)';
    ctx.fillRect(50,0,50,50);

    ctx.fillStyle = 'rgb(0,128,128)';
    ctx.fillRect(100,0,50,50);

    ctx.fillStyle = 'rgb(0,64,192)';
    ctx.fillRect(150,0,50,50);

    ctx.fillStyle = 'rgb(0,0,255)';
    ctx.fillRect(200,0,50,50);
});

// Physically correct color mixing
// http://scottsievert.com/blog/2015/04/23/image-sqrt/

draw(document.querySelector('#discrete_color_correct'), (ctx) => {
    let g, b;

    ctx.fillStyle = 'rgb(0,255,0)';
    ctx.fillRect(0,0,50,50);

    g = (255 * Math.sqrt(0.75)) | 0;
    b = (255 * Math.sqrt(0.25)) | 0;

    ctx.fillStyle = `rgb(0,${g},${b})`;
    ctx.fillRect(50,0,50,50);

    g = (255 * Math.sqrt(0.5)) | 0;
    b = (255 * Math.sqrt(0.5)) | 0;

    ctx.fillStyle = `rgb(0,${g},${b})`;
    ctx.fillRect(100,0,50,50);

    g = (255 * Math.sqrt(0.25)) | 0;
    b = (255 * Math.sqrt(0.75)) | 0;

    ctx.fillStyle = `rgb(0,${g},${b})`;
    ctx.fillRect(150,0,50,50);

    ctx.fillStyle = 'rgb(0,0,255)';
    ctx.fillRect(200,0,50,50);
});

draw(document.querySelector('#discrete_alpha'), (ctx) => {
    const y = 0;

    ctx.fillStyle = `rgb(128,128,128)`;
    ctx.fillRect(0,y,250,50);

    ctx.fillStyle = `rgba(0,0,255,1.0)`;
    ctx.fillRect(0,y,50,50);

    ctx.fillStyle = `rgba(0,0,255,0.75)`;
    ctx.fillRect(50,y,50,50);

    ctx.fillStyle = `rgba(0,0,255,0.5)`;
    ctx.fillRect(100,y,50,50);

    ctx.fillStyle = `rgba(0,0,255,0.25)`;
    ctx.fillRect(150,y,50,50);
});

draw(document.querySelector('#discrete_alpha_correct'), (ctx) => {
    let c1 = [0, 0, 255];
    let c2 = [128, 128, 128];

    let y = 0, c;

    ctx.fillStyle = `rgb(${c1.join(',')})`;
    ctx.fillRect(0,y,50,50);

    c1 = c1.map(x => x / 255);
    c2 = c2.map(x => x / 255);

    c = [
        0.75 * c1[0] * c1[0] + 0.25 * c2[0] * c2[0],
        0.75 * c1[1] * c1[1] + 0.25 * c2[1] * c2[1],
        0.75 * c1[2] * c1[2] + 0.25 * c2[2] * c2[2]
    ].map(x => 255 * Math.sqrt(x) | 0);

    ctx.fillStyle = `rgb(${c.join(',')})`;
    ctx.fillRect(50,y,50,50);

    c = [
        0.5 * c1[0] * c1[0] + 0.5 * c2[0] * c2[0],
        0.5 * c1[1] * c1[1] + 0.5 * c2[1] * c2[1],
        0.5 * c1[2] * c1[2] + 0.5 * c2[2] * c2[2]
    ].map(x => 255 * Math.sqrt(x) | 0);

    ctx.fillStyle = `rgb(${c.join(',')})`;
    ctx.fillRect(100,y,50,50);

    c = [
        0.25 * c1[0] * c1[0] + 0.75 * c2[0] * c2[0],
        0.25 * c1[1] * c1[1] + 0.75 * c2[1] * c2[1],
        0.25 * c1[2] * c1[2] + 0.75 * c2[2] * c2[2]
    ].map(x => 255 * Math.sqrt(x) | 0);

    ctx.fillStyle = `rgb(${c.join(',')})`;
    ctx.fillRect(150,y,50,50);

    c = [
        0.0 * c1[0] * c1[0] + 1.0 * c2[0] * c2[0],
        0.0 * c1[1] * c1[1] + 1.0 * c2[1] * c2[1],
        0.0 * c1[2] * c1[2] + 1.0 * c2[2] * c2[2]
    ].map(x => 255 * Math.sqrt(x) | 0);

    ctx.fillStyle = `rgb(${c.join(',')}`;
    ctx.fillRect(200,y,50,50);

});
