/**
 * @description 綁定 Add new 表單裡的數值
 */
class Application {
  constructor() {
    this.coreTeam = {
      reqr: {},
      pgr: {}
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
    this.attachedFiles = []
    this.type = ''
    this.schedule = {
      turnOnDate: '',
      UAT1: '',
      UAT2: ''
    }
  }
}

export default Application
