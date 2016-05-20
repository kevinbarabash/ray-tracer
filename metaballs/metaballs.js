const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

const balls = [
    {
        x: 100,
        y: 100,
        r: 100
    },
    {
        x: 250,
        y: 250,
        r: 70
    }
];


const image = ctx.getImageData(0, 0, 512, 512);


console.log(image.data);

for (var y = 0; y < 512; y++) {
    for (var x = 0; x < 512; x++) {
        const offset = 4 * (512 * y + x);

        const value = balls.reduce((result, ball) => {
            const dx = ball.x - x;
            const dy = ball.y - y;
            return result + ball.r * ball.r / (dx * dx + dy * dy);
        }, 0);

        if (value >= 1) {
            image.data[offset + 2] = ((value - 1) * 255) | 0;
        }
        image.data[offset + 3] = 255;
    }
}

console.log(image.data);

ctx.putImageData(image, 0, 0);
