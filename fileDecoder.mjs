import { JSDOM } from 'jsdom'

const decodeUrl = async (docUrl) => {
  const response = await fetch(docUrl);
  const text = await response.text();

  const { document } = (new JSDOM(text)).window
  const table = document.querySelector('.doc-content table tbody')
  const rows = table.rows

  // fetch grid data
  const gridData = []
  let maxX = 0;
  let maxY = 0;
  for (const row in rows) {
    if(row > 0) {
      const coordinates = parseRow(rows[row])
      maxX = coordinates.x > maxX ? coordinates.x : maxX
      maxY = coordinates.y > maxY ? coordinates.y : maxY
      gridData.push(coordinates)
    }
  }
  const grid = Array.from({ length: maxY + 1 }, () => Array(maxX + 1).fill(' '));
  
  // Place characters in the grid
  gridData.forEach(({ x, y, z }) => {
    grid[y][x] = z;
  });
  
  // display grid
  grid.forEach(row => {
    console.log(row.join(''));
  });

}

const parseRow = (row) => {
  const columns = row.querySelectorAll('td p span')
  let x = parseInt(columns[0].innerHTML);
  let y = parseInt(columns[2].innerHTML);
  let z = columns[1].innerHTML;

  return {x, y, z}
}

decodeUrl('https://docs.google.com/document/d/e/2PACX-1vSHesOf9hv2sPOntssYrEdubmMQm8lwjfwv6NPjjmIRYs_FOYXtqrYgjh85jBUebK9swPXh_a5TJ5Kl/pub')