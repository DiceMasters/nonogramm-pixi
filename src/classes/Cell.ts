export class Cell {
  state: number
  active: boolean = false
  success: boolean = false
  error: boolean = false

  constructor (state: number) {
    this.state = state
  }

  point () {
    this.active = true
  }

  setSuccess () {
    this.success = true
  }

  setError () {
    this.error = true
  }
}
