export const downloadFractal = async ({
  canvas,
  linesRef,
  viewState,
  backgroundColor,
  title,
  scale = 4,
}) => {
  try {
    if (!canvas) return;

    // Get the original canvas dimensions
    const originalWidth = canvas.width;
    const originalHeight = canvas.height;

    // Create a high-res canvas
    const exportCanvas = document.createElement("canvas");
    exportCanvas.width = originalWidth * scale;
    exportCanvas.height = originalHeight * scale;
    const ctx = exportCanvas.getContext("2d");

    // Fill background only if backgroundColor is provided
    if (backgroundColor) {
      ctx.fillStyle = backgroundColor;
      ctx.fillRect(0, 0, exportCanvas.width, exportCanvas.height);
    }

    // Use the same coordinate system size as Display
    const COORD_SYSTEM_SIZE = 1000;

    // Calculate scale based on the smallest dimension (same as Display)
    const scaleX = exportCanvas.width / COORD_SYSTEM_SIZE;
    const scaleY = exportCanvas.height / COORD_SYSTEM_SIZE;
    const baseScale = Math.min(scaleX, scaleY);

    // Center point
    const centerX = exportCanvas.width / 2;
    const centerY = exportCanvas.height / 2;

    // Apply transformations in the same order as Display
    ctx.translate(centerX, centerY);
    ctx.translate(viewState.pan.x * scale, viewState.pan.y * scale);
    ctx.scale(viewState.zoom * baseScale, viewState.zoom * baseScale);

    // Get all the lines that need to be drawn
    const allLines = Object.values(linesRef.current.branches).flat();
    const initialLines = linesRef.current.initial;

    // Draw all lines at high resolution
    [...initialLines, ...allLines].forEach((line) => {
      ctx.beginPath();
      ctx.strokeStyle = line.color;
      ctx.lineWidth = line.width / viewState.zoom;
      ctx.moveTo(line.x1, line.y1);
      ctx.lineTo(line.x2, line.y2);
      ctx.stroke();
    });

    // Get blob with maximum quality
    const blob = await new Promise((resolve) => {
      exportCanvas.toBlob(resolve, "image/png", 1.0);
    });

    // Trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${title || "fractal"}_hq.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading fractal:", error);
  }
};
