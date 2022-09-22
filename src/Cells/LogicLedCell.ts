import { Cell } from "../CellSystem";
import Color from "colorjs.io"


export default class LogicLedCell extends Cell {
  constructor(color?: Color) {
    super(color || new Color("lightyellow"), {on: false})
  }

  onUpdate() {
    const near = this.read()

    const input = [
      near.right,
      near.down,
      near.left,
      near.up
    ]

    const turnOn = input.some((cell) => {
      return cell?.state.on
    })

    return this.clone(
      turnOn ? new Color("yellow") : new Color("lightyellow"),
      {on: turnOn}
    )
  }
}