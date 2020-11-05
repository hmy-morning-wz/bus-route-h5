 export const getDirection = (startx, starty, endx, endy)=>{
  const angx = endx - startx;
  const angy = endy - starty;
  let result = 0;
  //如果滑动距离太短
  if (Math.abs(angx) < 2 && Math.abs(angy) < 2) {
    return result;
  }
  const angle = Math.atan2(angy, angx) * 180 / Math.PI;
  if (angle >= -135 && angle <= -45) {
    result = 1;
  } else if (angle > 45 && angle < 135) {
    result = 2;
  } else if ((angle >= 135 && angle <= 180) || (angle >= -180 && angle < -135)) {
    result = 3;
  } else if (angle >= -45 && angle <= 45) {
    result = 4;
  }
  return result;
}


