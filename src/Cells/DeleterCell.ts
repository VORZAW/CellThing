import { Cell, Direction } from '../CellSystem'
import NullCell from "./NullCell";
import Color from 'colorjs.io'


export default class DeleterCell extends Cell {
  constructor(_color?: any, _state?: any, direction?: Direction) {
    super(new Color('crimson'), {}, direction)
  }

  onUpdate() {
    if(this.direction === 0 || this.direction === -1)
      this.field?.putCell(new NullCell(), this.x+1, this.y, true)
    if(this.direction === 1 || this.direction === -1)
      this.field?.putCell(new NullCell(), this.x, this.y+1, true)
    if(this.direction === 2 || this.direction === -1)
      this.field?.putCell(new NullCell(), this.x-1, this.y, true)
    if(this.direction === 3 || this.direction === -1)
      this.field?.putCell(new NullCell(), this.x, this.y-1, true)

    return this
  }
}
