const mUtil = require('../methods_util.js')

describe('Methods Util', () => {

  describe('setLogs', () => {

    it('should allow turning logs off when passed false', () => {
      const oldLog = console.log
      console.log = jest.fn()
      mUtil.setLogs(false)
      mUtil.logData('I am test')
      
      expect(console.log).not.toHaveBeenCalled()
      console.log = oldLog
    })

    it('should allow turning logs on when passed true', () => {
      const oldLog = console.log
      console.log = jest.fn()
      mUtil.setLogs(true)
      mUtil.logData('I am test', 'log')
      
      expect(console.log).toHaveBeenCalledWith('I am test')
      console.log = oldLog
    })

  })

  describe('logData', () => {

    it('should use the last arg as the log type', () => {
      const oldWarn = console.warn
      console.warn = jest.fn()
      mUtil.logData('I am test warn', 'warn')
      const oldDir = console.dir
      console.dir = jest.fn()
      mUtil.logData('I am test dir', 'dir')
      
      expect(console.warn).toHaveBeenCalledWith('I am test warn')
      console.warn = oldWarn

      expect(console.dir).toHaveBeenCalledWith('I am test dir')
      console.dir = oldDir
    })

    it('should use dir as the default when no type is passed', () => {
      const oldDir = console.dir
      console.dir = jest.fn()
      mUtil.logData('I am test dir')

      expect(console.dir).toHaveBeenCalledWith('I am test dir')
      console.dir = oldDir
    })

    it('should not log when show logs is set to false', () => {
      const oldDir = console.dir
      console.dir = jest.fn()
      mUtil.setLogs(false)
      mUtil.logData('I am test dir')
      expect(console.dir).not.toHaveBeenCalled()
      console.dir = oldDir
      mUtil.setLogs(true)
    })

    it('should still log errors when setLogs is false', () => {
      const oldErr = console.error
      console.error = jest.fn()
      mUtil.setLogs(false)
      mUtil.logData('I am test error', 'error')
      expect(console.error).toHaveBeenCalledWith('I am test error')
      console.error = oldErr
      mUtil.setLogs(true)
    })

  })

  describe('debounce', () => {

    it('should call the passed method after the correct amount of time', done => {
      const testMethod = jest.fn(() => {})
      const boundMethod = mUtil.debounce(testMethod, 100)
      boundMethod()

      setTimeout(() => {
        expect(testMethod).not.toHaveBeenCalled()
      }, 99)
      setTimeout(() => {
        expect(testMethod).toHaveBeenCalled()
        done()
      }, 101)
    })

    it('should use 250 as default wait time when not wait time is passed', done => {
      const testMethod = jest.fn(() => {})
      const boundMethod = mUtil.debounce(testMethod)
      boundMethod()

      setTimeout(() => {
        expect(testMethod).not.toHaveBeenCalled()
      }, 50)
      setTimeout(() => {
        expect(testMethod).toHaveBeenCalled()
        done()
      }, 251)
    })

    it('should call immediately is passed in as true', done => {
      const testMethod = jest.fn(() => {})
      const boundMethod = mUtil.debounce(testMethod, 300)
      boundMethod()
      const nowMethod = mUtil.debounce(testMethod, 300, true) 
     
      setTimeout(() => {
        expect(testMethod).not.toHaveBeenCalled()
        nowMethod()
        expect(testMethod).toHaveBeenCalled()
        done()
      }, 50)
    })

    it('should not try to call the fun if a fun is not passed in', () => {
      const testMethod = jest.fn(() => {})
      const boundMethod = mUtil.debounce(undefined)

      expect(boundMethod()).toEqual(null)
    })

  })

  describe('checkCall', () => {

    it('should check if a method, and call it with passed in params', () => {
      const testMethod = jest.fn(() => {})
      mUtil.checkCall(testMethod, 1,2,3)
      expect(testMethod).toHaveBeenCalledWith(1,2,3)
    })

    it('should not try to call a method if its not a function', () => {
      expect(mUtil.checkCall(null, 1,2,3)).toEqual(undefined)
    })

  })

  describe('isFunc', () => {

    it('should return true when passed in parm is a function', () => {
      expect(mUtil.isFunc(jest.fn())).toEqual(true)
    })

    it('should return false when passed in parm is not a function', () => {
      expect(mUtil.isFunc(null)).toEqual(false)
    })

  })

  describe('isConstructor', () => {

    it('should return true when passed in parm is a constructor', () => {
      function mrConstructor(){}
      expect(mUtil.isConstructor(mrConstructor)).toEqual(true)
    })

    it('should return false when passed in parm is not a constructor', () => {
      expect(mUtil.isConstructor(1)).toEqual(false)
      expect(mUtil.isConstructor(null)).toEqual(false)
    })

  })

  describe('uuid', () => {

    it('should return a valid uuid', () => {
      const uuid = mUtil.uuid()
      if (!uuid || typeof uuid !== 'string') return false
      const regex = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i
      const isValid =  regex.test(uuid)
      
      expect(typeof uuid).toEqual('string')
      expect(isValid).toEqual(true)
    })

    it('should not return uuids that are the same', () => {
      const uuid = mUtil.uuid()
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(uuid).not.toEqual(mUtil.uuid())
      expect(mUtil.uuid()).not.toEqual(mUtil.uuid())
    })

  })

})
