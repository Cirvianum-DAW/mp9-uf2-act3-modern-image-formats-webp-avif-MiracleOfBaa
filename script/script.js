const images = Array.from(document.querySelectorAll("img"));
const infoContainers = Array.from(document.querySelectorAll(".image-info"));

async function getImageInfo(url) {
  try {
    const response = await fetch(url);
    const blob = await response.blob();
    const format = url.split(".").pop();
    const img = new Image();
    img.src = url;
    await img.decode(); // Esperar a que la imagen se cargue completamente para obtener sus dimensiones
    const dimensions = {
      width: img.width,
      height: img.height,
    };
    const alt = img.alt;
    const size = blob.size;

    return { format, dimensions, alt, size };
  } catch (error) {
    throw new Error("Error al obtener la información de la imagen: " + error.message);
  }
}

function displayImageInfo(url, container) {
  getImageInfo(url)
    .then((info) => {
      const formatElement = document.createElement("p");
      formatElement.textContent = `Format: ${info.format}`;
      container.appendChild(formatElement);

      const dimensionsElement = document.createElement("p");
      dimensionsElement.textContent = `Dimensions: ${info.dimensions.width}x${info.dimensions.height}`;
      container.appendChild(dimensionsElement);

      const altElement = document.createElement("p");
      altElement.textContent = `Alt: ${info.alt}`;
      container.appendChild(altElement);

      const sizeInKB = (info.size / 1024).toFixed(2);
      const sizeElement = document.createElement("p");
      sizeElement.textContent = `Size: ${sizeInKB} KB`;
      container.appendChild(sizeElement);

      // Calcular el porcentaje de reducción de tamaño solo si es una imagen comprimida (JPEG, WebP, AVIF)
      if (info.format === "jpg" || info.format === "webp" || info.format === "avif") {
        const originalSize = infoContainers[0].querySelector("p:nth-child(4)").textContent.split(": ")[1].slice(0, -3); // Tamaño original en KB
        const reduction = ((originalSize - sizeInKB) / originalSize) * 100; // Porcentaje de reducción
        const reductionElement = document.createElement("p");
        reductionElement.textContent = `Reduction: ${reduction.toFixed(2)}%`;
        container.appendChild(reductionElement);
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

images.forEach((img, i) => {
  displayImageInfo(img.src, infoContainers[i]);
});
