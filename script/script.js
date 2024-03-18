// Función para calcular el porcentaje de ahorro
function calculateSavingPercentage(originalSize, newSize) {
  return ((originalSize - newSize) / originalSize) * 100;
}

// Función para obtener el tamaño de una imagen en bytes
async function getImageSize(url) {
  const response = await fetch(url);
  const blob = await response.blob();
  return blob.size; // Tamaño en bytes
}

// Función para obtener la información de una imagen
async function getImageInfo(url) {
  return new Promise(async (resolve, reject) => {
    const img = new Image();
    img.src = url;

    img.onload = async () => {
      try {
        const response = await fetch(url);
        const blob = await response.blob();
        const format = url.split(".").pop();
        const dimensions = { width: img.width, height: img.height };
        const alt = img.alt;
        const size = blob.size;

        resolve({ format, dimensions, alt, size });
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = reject;
  });
}

// Función para mostrar la información de la imagen y agregar filas a la tabla
async function displayImageInfo(images, tableBody) {
  for (const img of images) {
    const originalSize = await getImageSize(img.src);
    const sizeInKB = (originalSize / 1024).toFixed(2);

    getImageInfo(img.src)
      .then(async (info) => {
        const newRow = tableBody.insertRow();
        newRow.insertCell().textContent = img.src.split("/").pop(); // Mostrar solo el nombre de la imagen
        newRow.insertCell().textContent = `${sizeInKB} kB`;

        const newSizeInKB = (info.size / 1024).toFixed(2);
        const percentageReduction = calculateSavingPercentage(originalSize, info.size);
        newRow.insertCell().textContent = `${newSizeInKB} kB (${percentageReduction.toFixed(2)}%)`;

        // Calcular el porcentaje de ahorro específico para WebP
        const webpUrl = img.src.replace("images/", "webp/").replace(/\.[^/.]+$/, ".webp");
        const webpOriginalSize = await getImageSize(webpUrl);
        const webpPercentageReduction = calculateSavingPercentage(webpOriginalSize, info.size);
        newRow.insertCell().textContent = `${(webpOriginalSize / 1024).toFixed(2)} kB (${webpPercentageReduction.toFixed(2)}%)`;

        // Calcular el porcentaje de ahorro específico para JPG
        const jpgUrl = img.src.replace("images/", "").replace(/\.[^/.]+$/, ".jpg");
        const jpgOriginalSize = await getImageSize(jpgUrl);
        const jpgPercentageReduction = calculateSavingPercentage(jpgOriginalSize, info.size);
        newRow.insertCell().textContent = `${(jpgOriginalSize / 1024).toFixed(2)} kB (${jpgPercentageReduction.toFixed(2)}%)`;
      })
      .catch((error) => {
        console.error(error);
      });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("image-info-table");

  // Definir las imágenes específicas para cada página
  const images = [
    { src: "images/homer.gif" },
    { src: "images/logotip.png" },
    // Agregar más imágenes según sea necesario
  ];

  // Mostrar la información de las imágenes en la tabla
  displayImageInfo(images, tableBody);
});
