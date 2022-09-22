import { Cell, Direction } from "../CellSystem";
import Color from "colorjs.io"


export default class LogicGateAndCell extends Cell {
  constructor(_color?: any, _state?: any, direction?: Direction) {
    super(new Color("#aaaa00"), {on: false}, direction)
  }

  onUpdate() {
    if(this.direction === Direction.NONE) return this
    const near = this.read()
    
    const input = [
      near.right,
      near.down,
      near.left,
      near.up
    ]
    const output = input.splice(this.direction, 1)[0]

    const turnOn = input.every((cell) => {
      return cell?.state.on
    })

    this.state.on = turnOn

    return this
  }
}