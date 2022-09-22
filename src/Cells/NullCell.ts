import { Cell } from "../CellSystem";
import Color from 'colorjs.io'

export default class NullCell extends Cell {
  constructor() {
    super(new Color('black'), {})
  }
}