import Color from "colorjs.io";


export const putPixel = (image: ImageData, x: number, y: number, color: Color) => {
  image.data[image.width*4*y + x*4]     = color.r * 255
  image.data[image.width*4*y + x*4 + 1] = color.g * 255
  image.data[image.width*4*y + x*4 + 2] = color.b * 255
  image.data[image.width*4*y + x*4 + 3] = 255
}