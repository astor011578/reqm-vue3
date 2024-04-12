/**
 * @description 綁定 add new 表單 validate string
 */
class Validate {
  constructor() {
    this.coreTeam = {
      pgr: ''
    }
    this.reqTable = {
      reqName: '',
      stage: '',
      customer: '',
      device: '',
      tester: '',
      equipment: '',
      system: '',
      purpose: '',
      plant: ''
    }
    this.schedule = {
      turnOnDate: '',
      UAT1: '',
      UAT2: '',
      release: '',
      monitor: ''
    }
  }
}

export default Validate
