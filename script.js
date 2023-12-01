let inputImage = document.getElementById('inputImage');
let sizeRange = document.getElementById('sizeRange');
let redRange = document.getElementById('redRange');
let greenRange = document.getElementById('greenRange');
let blueRange = document.getElementById('blueRange');
let rotationRange = document.getElementById('rotationRange');
let canvasWidthInput = document.getElementById('canvasWidth');
let canvasHeightInput = document.getElementById('canvasHeight');
let imageXInput = document.getElementById('imageX');
let imageYInput = document.getElementById('imageY');
let outputCanvas = document.getElementById('outputCanvas');
let totalSizeElement = document.getElementById('totalSize');
let ctx = outputCanvas.getContext('2d');
let originalImage = new Image();

function updateImage() {
  let img = new Image();
  let reader = new FileReader();

  reader.onload = function (e) {
    originalImage.src = e.target.result;
  };

  reader.readAsDataURL(inputImage.files[0]);

  originalImage.onload = function () {
    outputCanvas.width = parseInt(canvasWidthInput.value);
    outputCanvas.height = parseInt(canvasHeightInput.value);

    ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);

    ctx.save(); // Save the current state of the context

    let newSize = originalImage.width * (1 - sizeRange.value / 100);
    let newRotation = (rotationRange.value * Math.PI) / 180;

    let newX = outputCanvas.width / 2 + parseInt(imageXInput.value);
    let newY = outputCanvas.height / 2 + parseInt(imageYInput.value);

    ctx.translate(newX, newY);
    ctx.rotate(newRotation);
    ctx.drawImage(originalImage, -newSize / 2, -newSize / 2, newSize, newSize);

    let imageData = ctx.getImageData(0, 0, outputCanvas.width, outputCanvas.height);
    let data = imageData.data;

    for (let i = 0; i < data.length; i += 4) {
      data[i] += parseInt(redRange.value);
      data[i + 1] += parseInt(greenRange.value);
      data[i + 2] += parseInt(blueRange.value);
    }

    ctx.putImageData(imageData, 0, 0);

    ctx.restore(); // Restore the saved state to remove transformations

    // Calculate and display the total downloadable size
    outputCanvas.toBlob(function (blob) {
      let totalSizeInBytes = blob.size;
      let totalSizeInKB = totalSizeInBytes / 1024;
      totalSizeElement.textContent = `Total Size: ${totalSizeInKB.toFixed(2)} KB`;
    });
  };
}

function downloadImage() {
  outputCanvas.toBlob(function (blob) {
    let downloadLink = document.createElement('a');
    downloadLink.href = URL.createObjectURL(blob);
    downloadLink.download = 'compressed_image.png';
    downloadLink.click();
  });
}
