import { Cell } from "../CellSystem";
import Color from "colorjs.io"


export default class TestCell extends Cell {
  constructor() {
    super(new Color("#123456"), {
      key1: 1,
      key2: 2,
      key3: "text",
      key4: true,
      key5: [1,"hola",false,4,5],
      key6: {
        key1: 1,
        key2: 2,
        key3: "text",
        key4: true,
        key5: [1,2,3,4,5],
        key6: {
          key1: 1,
          key2: 2,
          key3: "text",
          key4: true,
          key5: [1,2,3,4,5]
        }
      }
    })
  }
}