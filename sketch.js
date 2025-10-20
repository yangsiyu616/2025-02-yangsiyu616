let table;
let outerPadding = 20, padding = 15, itemSize = 40;
let cols, rows, totalHeight;
let polygons = [];

function preload() {
  table = loadTable("asset/dataset.csv", "csv", "header");
}

function setup() {
  cols = floor((windowWidth - outerPadding * 2) / (itemSize + padding));
  rows = ceil(table.getRowCount() / cols);
  totalHeight = outerPadding * 2 + rows * itemSize + (rows - 1) * padding;
  createCanvas(windowWidth, totalHeight);
  colorMode(HSB, 360, 100, 100);
  noFill();

  let col0 = table.getColumn("column0").map(Number);
  let min0 = min(col0), max0 = max(col0);
  let col1 = table.getColumn("column1").map(Number);
  let min1 = min(col1), max1 = max(col1);
  let col2 = table.getColumn("column2").map(Number);
  let min2 = min(col2), max2 = max(col2);
  let col3 = table.getColumn("column3").map(Number);
  let min3 = min(col3), max3 = max(col3);

  let colCount = 0, rowCount = 0;
  for (let r = 0; r < table.getRowCount(); r++) {
    let row = table.getRow(r);
    let v0 = Number(row.get("column0"));
    let v1 = Number(row.get("column1"));
    let v2 = Number(row.get("column2"));
    let v3 = Number(row.get("column3"));

    let xPos = outerPadding + itemSize / 2 + colCount * (itemSize + padding);
    let yPos = outerPadding + itemSize / 2 + rowCount * (itemSize + padding);

    let sides = floor(map(v0, min0, max0, 3, 8));
    let radius = map(v0, min0, max0, 10, itemSize / 2);
    let hueValue = map(v1, min1, max1, 120, 340);

    let vertices = [];
    let angleStep = TWO_PI / sides;
    for (let a = 0; a < TWO_PI; a += angleStep) {
      vertices.push({ x: cos(a) * radius, y: sin(a) * radius });
    }

    let maxLines = floor(sides * (sides - 1) / 6);
    let numLines = floor(map(v3, min3, max3, 1, maxLines));

    let allPairs = [];
    for (let i = 0; i < sides; i++) {
      for (let j = i + 1; j < sides; j++) {
        allPairs.push([i, j]);
      }
    }
    randomSeed(r);
    allPairs = shuffle(allPairs, true);
    let connections = allPairs.slice(0, numLines);

    let swMapped = map(v2, min2, max2, 2, 8);

    polygons.push({
      xPos, yPos, hueValue, vertices,
      connections, myStroke: swMapped, mySpeed: v3
    });

    colCount++;
    if (colCount == cols) {
      colCount = 0;
      rowCount++;
    }
  }
}

function draw() {
  background(0);

  polygons.forEach(poly => {
    push();
    translate(poly.xPos, poly.yPos);

    let angle = atan2(mouseY - poly.yPos, mouseX - poly.xPos);
    rotate(angle);

    strokeWeight(poly.myStroke);
    stroke(poly.hueValue, 100, 100);

    beginShape();
    poly.vertices.forEach(v => vertex(v.x, v.y));
    endShape(CLOSE);

    poly.connections.forEach(c => {
      let v1 = poly.vertices[c[0]], v2 = poly.vertices[c[1]];
      line(v1.x, v1.y, v2.x, v2.y);
    });

    pop();
  });
}