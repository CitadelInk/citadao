import { landingSetTop, landingArrived } from '../actions';

function easeOutQuad(t) {
    return 1+(--t)*t*t*t*t;
};

export default function scrollTo(currentPos, destination, duration, dispatch) {
    currentPos = Math.abs(currentPos);
    const totalDist = destination - currentPos;
    let startTime;
    function update(timeStamp) {
        if (!startTime) {
            startTime = timeStamp;
        }
        const elapsed = timeStamp - startTime;
        const elapsedPerc = elapsed/duration;
        dispatch(landingSetTop(-(currentPos + (totalDist * easeOutQuad(elapsedPerc)))));
        if (elapsed < duration) {
            window.requestAnimationFrame(update);
        } else {
            dispatch(landingArrived());
        }
    };
    window.requestAnimationFrame(update);
}