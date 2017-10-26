import coords from "./gridCoords";
const TILE_SIZE = [337, 246];

const buildPoints = (x, y) => {
  let gridCoords = [];
  let offsetX;
  let offsetY;
  for (let i = 0; i < y; i++) {
    for (let j = 0; j < x; j++) {
      offsetX = j * TILE_SIZE[0];
      offsetY = i * TILE_SIZE[1];
      gridCoords = gridCoords.concat(coords.map(item => [item[0] + offsetX, item[1] + offsetY]))
    }
  }
  return gridCoords;
};

const distance = (start, end) => {
  return Math.sqrt(Math.pow(end[0] - start[0], 2) + Math.pow(end[1] - start[1], 2));
};

const sortPoints = (points) => {
  const start = points[0];
  return points.sort((a, b) => {
    return distance(start, a) - distance(start, b);
  });
};

export const getPoints = (width, height) => {
  const timesX = Math.ceil(width/TILE_SIZE[0]);
  const timesY = Math.ceil(height/TILE_SIZE[1]);
  console.log(timesX, timesY)
  return sortPoints(buildPoints(timesX, timesY));
};
