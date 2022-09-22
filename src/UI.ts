import { isBoolean, isNumber, isObject, isString } from "util";
import ConwayCell from "./Cells/ConwayCell";
import DeleterCell from './Cells/DeleterCell';
import DuplicatorCell from "./Cells/DuplicatorCell";
import LogicConstCell from "./Cells/LogicConstCell";
import LogicGateAndCell from "./Cells/LogicGateAndCell";
import LogicLedCell from "./Cells/LogicLedCell";
import NullCell from "./Cells/NullCell";
import TestCell from "./Cells/TestCell";
import { Cell } from "./CellSystem";


interface CellSelectorReturn {
  element: HTMLSelectElement;
  cells: Cell[];
  readonly selectedCell: Cell;
}

interface PropertyDisplayReturn {
  element: HTMLDivElement;
  dataStructure: DataStructure;
  readonly value: {
      [k: string]: any;
  };
}

type DataStructure = {[key: string]: HTMLInputElement | DataStructure}


function createCellSelector(cells: Cell[]) {
  const element = document.createElement("select")
  for(const cell of cells) {
    element.add(new Option(cell.constructor.name))
  }

  return {
    element,
    cells,
    get selectedCell() {
      return cells[element.selectedIndex]
    }
  }
}

function createPropertyDisplay(obj: any) {
  const container = document.createElement("div")
  container.style.border = "2px solid black"
  container.style.display = "flex"
  container.style.flexDirection = "column"
  container.style.padding = "1px"

  const dataStructure: DataStructure = {}
  
  for(const [property, value] of Object.entries(obj)) {
    const label = document.createElement("label")
    label.innerHTML = `${property.toString()}: `
    
    if(isObject(value)) {
      container.append(label)
      const propertyDisplay = createPropertyDisplay(value)
      container.append(propertyDisplay.element)
      dataStructure[property] = propertyDisplay.dataStructure
      continue
    }

    const input = document.createElement("input")
    if(isBoolean(value)) {
      input.type = "checkbox"
      input.checked = value
    }else if(isNumber(value)) {
      input.type = "number"
      input.valueAsNumber = value
    }else if(isString(value)) {
      input.type = "text"
      input.value = value
    }

    label.append(input)

    container.append(label)

    dataStructure[property] = input
  }
  
  return {
    element: container,
    dataStructure,
    get value() {
      function dataToValues(obj: DataStructure): [string, any][] {
        return Object.entries(obj).map(function(value) {
          if(value[1] instanceof HTMLElement) {
            if(value[1].type === "checkbox") {
              return [value[0], value[1].checked]
            }
            if(value[1].type === "number") {
              return [value[0], parseInt(value[1].value, 10)]
            }
            return [value[0], value[1].value]
          }
          return [
            value[0],
            Object.fromEntries(dataToValues(value[1]))
          ]
        })
      }
      return Object.fromEntries(
        dataToValues(dataStructure)
      )
    }
  }
}

export default class UI {
  cellSelector: CellSelectorReturn
  propertyDisplay: PropertyDisplayReturn
  constructor() {
    // Cell Selector
    this.cellSelector = 
      createCellSelector([
        new NullCell(),
        new TestCell(),
        new ConwayCell(),
        new DuplicatorCell(),
        new LogicGateAndCell(),
        new LogicConstCell(),
        new LogicLedCell(),
        new DeleterCell()
      ])
      
    this.cellSelector.element.addEventListener(
      "change", this.updatePropertyDisplay.bind(this))
    
    document.body.append(this.cellSelector.element)  
    
    // Property Display
    this.propertyDisplay = createPropertyDisplay({})
    this.updatePropertyDisplay()

    document.body.append(this.propertyDisplay.element)
  }

  updatePropertyDisplay() {
    const cell = this.cellSelector.selectedCell
    const newPropertyDisplay = createPropertyDisplay({
      direction: cell.direction,
      state: cell.state
    })
    this.propertyDisplay.element.replaceWith(newPropertyDisplay.element)
    this.propertyDisplay = newPropertyDisplay
  }

  get data() {
    return {
      selectedCell: this.cellSelector.selectedCell,
      modifier: this.propertyDisplay.value
    }
  }
}