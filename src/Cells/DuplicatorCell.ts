import { Cell, Direction } from "../CellSystem";
import Color from "colorjs.io"


export default class DuplicatorCell extends Cell {
  constructor(color?: Color, _state?: any, direction?: Direction) {
    super(color || new Color("red"), {}, direction)
  }

  onUpdate() {
    if(!this.field)
      throw(Error("field property is missing"))
    if(this.x === undefined)
      throw(Error("x property is missing"))
    if(this.y === undefined)
      throw(Error("y property is missing"))

    const nearCells = this.read()
    switch(this.direction) {
      case Cell.Direction.RIGHT:
        if(nearCells.left)
          this.field.putCell(
            nearCells.left.clone(),
            this.x+1, this.y,
            true
          )
        break
      case Cell.Direction.DOWN:
        if(nearCells.up)
          this.field.putCell(
            nearCells.up.clone(),
            this.x, this.y+1,
            true
          )
        break
      case Cell.Direction.LEFT:
        if(nearCells.right)
          this.field.putCell(
            nearCells.right.clone(),
            this.x-1, this.y,
            true
          )
        break
      case Cell.Direction.UP:
        if(nearCells.down)
          this.field.putCell(
            nearCells.down.clone(),
            this.x, this.y-1,
            true
          )
        break
    }

    return this.clone()
  }
}
