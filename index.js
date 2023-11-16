/**@type{HTMLCanvasElement} */
class Cell {
  constructor(x, y, symbol, color) {
    this.x = x;
    this.y = y;
    this.symbol = symbol;
    this.color = color;
  }
  draw(context) {
    context.fillStyle = 'white';
    context.fillText(this.symbol, this.x + 0.5, this.y + 0.5);
    context.fillStyle = this.color;
    context.fillText(this.symbol, this.x, this.y);
  }
}

class AsciiEffect {
  constructor(width, height, context) {
    this.width = width;
    this.height = height;
    this.context = context;
    this.imageCellArray = [];
    this.pixels = [];
    this.image = document.getElementById("myImage");
    this.centerX = this.width * 0.5 - this.image.width * 0.5;
    this.centerY = this.height * 0.5 - this.image.height * 0.5;
    this.context.drawImage(this.image, this.centerX, this.centerY);
    this.pixels = this.context.getImageData(0, 0, this.width, this.height);
    this.cell = 0;
  }
  convertToSymbol(g) {
    if (g > 250) return "@";
    else if (g > 240) return "*";
    else if (g > 220) return "+";
    else if (g > 200) return "#";
    else if (g > 180) return "&";
    else if (g > 160) return "%";
    else if (g > 140) return "_";
    else if (g > 120) return ";";
    else if (g > 100) return "$";
    else if (g > 80) return "/";
    else if (g > 60) return "-";
    else if (g > 40) return "X";
    else if (g > 40) return "W";
    else return "";
  }
  scanImage(cellSize) {
    this.imageCellArray = [];
    for (let y = 0; y < this.pixels.height; y += cellSize) {
      for (let x = 0; x < this.pixels.width; x += cellSize) {
        const posX = x * 4;
        const posY = y * 4;
        const pos = posY * this.pixels.width + posX;

        if (this.pixels.data[pos + 3] > 128) {
          const red = this.pixels.data[pos];
          const green = this.pixels.data[pos + 1];
          const blue = this.pixels.data[pos + 2];
          const total = red + green + blue;
          const averageColorValue = total / 3;
          const color = `rgb(${red}, ${green}, ${blue})`;
          const symbol = this.convertToSymbol(averageColorValue);
          if (total > 100)
            this.imageCellArray.push(new Cell(x, y, symbol, color));
        }
      }
    }
    console.log(this.imageCellArray);
  }
  drawAscii() {
    this.context.clearRect(0, 0, this.width, this.height);
    for (let i = 0; i < this.imageCellArray.length; i++) {
      this.imageCellArray[i].draw(this.context);
    }
  }
  draw(cellSize) {
    this.scanImage(cellSize);
    this.drawAscii();
  }
}

window.addEventListener("load", () => {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = 380;
  canvas.height = 507;

  const inputSlider = document.getElementById("resolution");
  const inputLabel = document.getElementById("resolutionLabel");
  inputSlider.addEventListener("change", handleSlider);

  function handleSlider() {
    if (inputSlider.value == 1) {
      inputLabel.innerHTML = "Original Image";
      ctx.drawImage(effect.image, effect.centerX, effect.centerY);
    } else {
      inputLabel.innerHTML = "Resolution: " + inputSlider.value + "px";
      ctx.font = parseInt(inputSlider.value) + "px  Verdana";
      effect.draw(parseInt(inputSlider.value));
    }
  }

  const effect = new AsciiEffect(canvas.width, canvas.height, ctx);
});
