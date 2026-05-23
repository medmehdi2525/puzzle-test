/** B&W stencil effect — Phase 5 */
export async function applyStencilToImageData(
  imageData: ImageData,
  threshold = 128
): Promise<ImageData> {
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
    const v = gray >= threshold ? 255 : 0;
    data[i] = data[i + 1] = data[i + 2] = v;
  }
  return imageData;
}
