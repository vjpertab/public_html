let angle = 0;
let d_theta = (Math.random() * 4) + 1;

function onFrame() {
    d_theta = (Math.random() * 4) + 1;
    angle += d_theta;
    let angle2 = angle + 180;
    document.body.style = "color: hsl(" + angle + "deg,100%,50%);--rotation:" + angle2 + "deg"
    requestAnimationFrame(onFrame)
}

onFrame()