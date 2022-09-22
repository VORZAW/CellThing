import { Cell } from "../CellSystem";
import Color from "colorjs.io";


export default class ConwayCell extends Cell {
  constructor(color?: Color, state?: {[key: string]: any}) {
    super(color || new Color("white"), state || {live: true})
  }

  onUpdate() {
    const nextState: {[key: string]: any} = {}

    // Get the amount of live cells around
    let near = Object.values(this.read()).filter((cell) => {
      if (!cell) return false
      return cell.state.live
    }).length

    // Conway's game of life rules
    if(near === 3 && this.state.live === false) {
      nextState.live = true
    }else if(near > 3) {
      nextState.live = false
    }else if(near < 2) {
      nextState.live = false
    }else if([2, 3].includes(near) && this.state.live === true) {
      nextState.live = true
    }
     
    return this.clone(
      nextState.live ? new Color("white") : new Color("black"),
      nextState
    )
  }
}