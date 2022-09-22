import ConwayCell from "./Cells/ConwayCell";
import { Cell, Field } from "./CellSystem";
import "./styles.css";
import UI from "./UI";


function createCanvas(width: number, height: number, BGColor?: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas")
  canvas.style.backgroundColor = BGColor || "lightgrey"
  canvas.style.border = "solid black 4px"
  canvas.style.imageRendering = "pixelated"
  canvas.width = width
  canvas.height = height
  canvas.style.width = "350px"
  canvas.style.height = "350px"

  return canvas
}

const canvas = createCanvas(40, 40)
document.body.append(canvas)

const ui = new UI()

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D

const field = new Field(canvas.width/2, canvas.height/2)
field.fill(new ConwayCell())

canvas.addEventListener("mousedown", function(ev) {
  ev.preventDefault()
  // Get canvas size
  const width = parseInt(canvas.style.width, 10)
  const height = parseInt(canvas.style.height, 10)
  // Get the coords of the canvas pixel that is being clicked
  const x = Math.floor(canvas.width/2 * ev.offsetX/width)
  const y = Math.floor(canvas.height/2 * ev.offsetY/height)

  if (ev.buttons === 1) {       // If left click
    field.putCell(
      ui.data.selectedCell.clone(
        undefined,
        ui.data.modifier.state,
        ui.data.modifier.direction
      ), x, y
    )
    field.drawToCanvasWithDirection(ctx)
  } else if(ev.buttons === 2) { // If right click
    field.update()
    field.drawToCanvasWithDirection(ctx)
  } else {                      // If middle click
    console.log(field.getCell(x, y))
  }
})

// Avoid context menu to apear when right clicking in the canvas
canvas.addEventListener("contextmenu", function(ev) {
  ev.preventDefault()
})

field.drawToCanvasWithDirection(ctx)