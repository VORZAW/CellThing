import Color from "colorjs.io"
import { putPixel } from "./Utils";


export enum Direction {
  NONE = -1,
  RIGHT,
  DOWN,
  LEFT,
  UP,
}

export class Cell {
  static Direction = Direction
  x: number
  y: number
  color: Color
  direction: Direction
  state: {[key: string]: any}
  field?: Field
  private _nextState: {[key: string]: any}
  constructor(color: Color, state: {[key: string]: any}, direction?: Direction) {
    this.x = -1
    this.y = -1
    this.direction = Direction.NONE
    this.color = color
    this.state = state
    if(direction !== undefined) this.direction = direction
    this._nextState = {}
  }

  changeState(state: {[key: string]: any}) {
    this._nextState = Object.assign(this._nextState, state)
  }

  setPos(x?: number, y?: number) {
    this.x = x ?? this.x
    this.y = y ?? this.y
  }

  preUpdate() {
    if(Object.entries(this._nextState).length === 0)
      return
    this.state = this._nextState
    this._nextState = {}
  }

  onUpdate(): Cell {
    return this
  }
  
  read() {
    // Return an object with the cells around this one
    if(!this.field)
      throw(Error("field property is missing"))
    if(this.x === undefined)
      throw(Error("x property is missing"))
    if(this.y === undefined)
      throw(Error("y property is missing"))

    const x = this.x
    const y = this.y
    return {
      up: this.field.getCell(x, y-1),
      upRight: this.field.getCell(x+1, y-1),
      right: this.field.getCell(x+1, y),
      downRight: this.field.getCell(x+1, y+1),
      down: this.field.getCell(x, y+1),
      downLeft: this.field.getCell(x-1, y+1),
      left: this.field.getCell(x-1, y),
      upLeft: this.field.getCell(x-1, y-1),
    }
  }

  clone(color?: Color, stateUpdates?: {[key: string]: any}, direction?: Direction) {
    const clone = new this.constructor(
      color || this.color,
      structuredClone(this.state),
      direction ?? this.direction
    )
    clone.setPos(this.x, this.y)
    clone.field = this.field
    console.log(this._nextState)
    if(stateUpdates) {
      clone.state = Object.assign(clone.state, stateUpdates, this._nextState)
    }
    return clone
  }
}


export class Field {
  private _field: Cell[][] = []
  width: number
  height: number
  private _nextUpdatePool: Cell[] = []
  constructor(width: number, height: number) {
    this.width = width
    this.height = height
  }

  update() {
    const nextField: Cell[][] = []
    
    for(let y=0; y<this.height; y++) {
      nextField.push([])
      for(let x=0; x<this.height; x++) {
        const cell = this.getCell(x, y)
        if (!cell) throw(Error("some what this failed"))
        nextField[y][x] = cell.onUpdate()
      }
    }

    for(const cell of this._nextUpdatePool) {
      if(!cell.field)
        throw(Error("field property is missing"))
      if(cell.x === undefined)
        throw(Error("x property is missing"))
      if(cell.y === undefined)
        throw(Error("y property is missing"))
      nextField[cell.y][cell.x] = cell
    }
    this._nextUpdatePool = []
    
    this._field = nextField
  }
  
  getCell(x: number, y: number): Cell | null {
    if((x<0 || x>=this.width) || (y<0 || y>=this.height)) {
      return null
    }

    return this._field[y][x]
  }

  putCell(cell: Cell, x: number, y: number, nextUpdate?: boolean) {
    if((x < 0 || x > this.width-1) || (y < 0 || y > this.height-1))
      return
    if(nextUpdate)
      this._nextUpdatePool.push(cell)
    else
      this._field[y][x] = cell
    cell.setPos(x, y)
    cell.field = this
  }

  fill(cell: Cell) {
    for(let y=0; y<this.height; y++) {
      this._field[y] = []
      for(let x=0; x<this.height; x++) {
        this.putCell(cell.clone(), x, y)
      }
    }
  }

  drawToCanvas(ctx: CanvasRenderingContext2D) {
    if(ctx.canvas.width !== this.width)
      throw(Error("canvas with not equal to field width"))
    if(ctx.canvas.height !== this.height)
      throw(Error("canvas height not equal to field height"))
    const image = ctx.getImageData(0, 0, this.width, this.height)

    for(let y=0; y<this.height; y++) {
      for(let x=0; x<this.height; x++) {
        let color = this.getCell(x, y)?.color
        if (!color) throw(Error("lalala"))
        if (typeof color === "string") color = Color.toArray(color) || [18, 210, 79]

        image.data[image.width*4*y + x*4]     = color[0]
        image.data[image.width*4*y + x*4 + 1] = color[1]
        image.data[image.width*4*y + x*4 + 2] = color[2]
        image.data[image.width*4*y + x*4 + 3] =  255
      }
    }

    ctx.putImageData(image, 0, 0)
  }

  drawToCanvasWithDirection(ctx: CanvasRenderingContext2D) {
    const canvas = ctx.canvas
    const image = ctx.getImageData(0, 0, canvas.width, canvas.height)

    function darker(color: Color, by: number): Color {
      const newColor = new Color(color)
      newColor.hsv.v -= by
      return newColor
    }

    for(let y=0; y<canvas.height; y+=2) {
      for(let x=0; x<canvas.height; x+=2) {
        const cell = this.getCell(x/2, y/2)
        if (!cell) throw(Error("lalala"))
        let color = cell?.color
        if(!color) console.log(cell)
        
        putPixel(image, x ,  y ,
          [Direction.UP, Direction.LEFT].includes(cell.direction) ?
            darker(color, 20) : color)
        putPixel(image, x+1,  y ,
          [Direction.UP, Direction.RIGHT].includes(cell.direction) ?
            darker(color, 20) : color)
        putPixel(image, x , y+1, 
          [Direction.DOWN, Direction.LEFT].includes(cell.direction) ?
            darker(color, 20) : color)
        putPixel(image, x+1, y+1, 
          [Direction.DOWN, Direction.RIGHT].includes(cell.direction) ?
            darker(color, 20) : color)
      }
    }

    ctx.putImageData(image, 0, 0)
  }
}