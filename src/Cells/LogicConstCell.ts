import { Cell } from "../CellSystem";
import Color from "colorjs.io";


export default class LogicConstCell extends Cell {
  constructor(_color?: any, state?: {[key: string]: any}) {
    super(new Color("lightgreen"), {on: true} || state)
  }
}