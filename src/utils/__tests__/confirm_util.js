const Confirm = require('../confirm_util.js')

const resetConfirm = () => {
  jest.resetAllMocks()
  Confirm.setConfirm(false)
  window.confirm = jest.fn((data) => data)
}

describe('Confirm Util', () => {

  beforeEach(() => resetConfirm())

  describe('setConfirm', () => {
    
    beforeEach(() => resetConfirm())
    
    it('should set CONFIRM_ACTION to true when called with a truthy param', () => {
      Confirm.setConfirm(true)
      expect(Confirm.getConfirmAction()).toEqual(true)
      Confirm.setConfirm(false)
      Confirm.setConfirm({})
      expect(Confirm.getConfirmAction()).toEqual(true)
    })

    it('should set CONFIRM_ACTION to undefined when called with a falsy param', () => {
      Confirm.setConfirm(false)
      expect(Confirm.getConfirmAction()).toEqual(undefined)
      Confirm.setConfirm(true)
      Confirm.setConfirm(0)
      expect(Confirm.getConfirmAction()).toEqual(undefined)
    })

    it('should set CUSTOM_CONFIRM to the passed in method and CONFIRM_ACTION true', () => {
      const customMeth = () => {}
      Confirm.setConfirm(customMeth)
      
      expect(Confirm.getCustomConfirm()).toEqual(customMeth)
      expect(Confirm.getConfirmAction()).toEqual(true)
    })

    it('should set CUSTOM_CONFIRM to undefined when passed a falsy value', () => {
      Confirm.setConfirm(false)
      expect(Confirm.getCustomConfirm()).toEqual(undefined)
    })

  })

  describe('checkConfirm', () => {
    
    beforeEach(() => resetConfirm())
    
    it('should return true when CONFIRM_ACTION is falsy', () => {
      expect(Confirm.getCustomConfirm() != true).toEqual(true)
      expect(Confirm.checkConfirm()).toEqual(true)
    })
    
    it('should call CUSTOM_CONFIRM method when exists, and return a boolean', () => {
      const customMeth = jest.fn((data) => { return 'duper' })
      Confirm.setConfirm(customMeth)
      const res = Confirm.checkConfirm({}, 'I am message')

      expect(res).toEqual(true)
      expect(customMeth).toHaveBeenCalled()
    })

    it('should return a boolean based on response from custom method', () => {
      const customMeth = jest.fn((data) => { return 0 })
      Confirm.setConfirm(customMeth)
      const res = Confirm.checkConfirm({}, 'I am message')

      expect(res).toEqual(false)
      expect(customMeth).toHaveBeenCalled()
    })

    it('should call window.confirm when CUSTOM_CONFIRM is not a function', () => {
      Confirm.setConfirm(true)
      const res = Confirm.checkConfirm({}, 'I am message')
  
      expect(window.confirm).toHaveBeenCalled()

    })

    it('should return a boolean based on response from window.confirm', () => {
      Confirm.setConfirm(true)
      const res = Confirm.checkConfirm('I am message')
      const res2 = Confirm.checkConfirm('')
  
      expect(res).toEqual(true)
      expect(res2).toEqual(false)
      expect(window.confirm).toHaveBeenCalledTimes(2)

    })

    it('should return true if no params are passed in', () => {
      Confirm.setConfirm(true)
      const res = Confirm.checkConfirm()
  
      expect(res).toEqual(true)
    })

  })

})