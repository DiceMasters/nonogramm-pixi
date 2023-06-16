import { Cell } from './Cell'

export type TCellState = 0 | 1

export class Level {
  grid: Cell[][]

  constructor (grid: TCellState[][]) {
    this.grid = grid.map(row => row.map(cell => new Cell(cell)))
  }
}
