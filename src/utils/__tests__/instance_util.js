import Constants from '../../constants'

const InstanceUtil = require('../instance_util.js')

const resetInstance = () => {
  jest.resetAllMocks()
  InstanceUtil.clearInstanceCache()
}

describe('Instance Util', () => {
  
  beforeEach(() => resetInstance())
  
  describe('buildInstancePos', () => {

    beforeEach(() => resetInstance())

    it('should return a string based on the key an parent.pos', () => {
      const res = InstanceUtil.buildInstancePos('12345', { pos: 'parent' })

      expect(res).toEqual('parent.12345')
    })
    
    it('should return the key when key is equal to schema root', () => {
      const res = InstanceUtil.buildInstancePos(Constants.Schema.ROOT, { pos: 'parent'})

      expect(res).toEqual(Constants.Schema.ROOT)
    })
    
  })

  describe('clearInstanceCache', () => {

    beforeEach(() => resetInstance())

    it('should set instance cache to undefined', () => {
      const testCache = { data: 'test' }
      InstanceUtil.setInstanceCache(testCache)
      expect(InstanceUtil.getInstanceCache()).toEqual(testCache)
      
      InstanceUtil.clearInstanceCache()
      expect(InstanceUtil.getInstanceCache()).toEqual(undefined)
    })
  })

  describe('getInstanceCache', () => {

    beforeEach(() => resetInstance())

    it('should get entire INSTANCE_CACHE object when no id is passed in', () => {
      const testCache = { data: 'test' }
      InstanceUtil.setInstanceCache(testCache)
      
      expect(InstanceUtil.getInstanceCache()).toEqual(testCache)
    })
    
    it('should only get the cached item when a key is passed in', () => {
      const testCache = { data: 'test' }
      InstanceUtil.setInstanceCache(testCache)
      
      expect(InstanceUtil.getInstanceCache('data')).toEqual('test')
      expect(InstanceUtil.getInstanceCache('foo')).toEqual(undefined)
    })
    
  })

  describe('clearInstance', () => {
    it('should return false when no instance is found', () => {
      const testCache = { data: 'test' }
      InstanceUtil.setInstanceCache(testCache)

      expect(InstanceUtil.clearInstance('duper')).toEqual(false)
    })
    
    it('should return true if the instance is cleared', () => {
      const testCache = { data: { test: 'foo', super: 'duper' } }
      InstanceUtil.setInstanceCache(testCache)

      expect(InstanceUtil.clearInstance('data')).toEqual(true)
    })

    it('should remove the istance from the INSTANCE_CACHE', () => {
      const testCache = { data: { test: 'foo', super: 'duper' } }
      InstanceUtil.setInstanceCache(testCache)

      expect(InstanceUtil.getInstanceCache('data')).toEqual(undefined)
      expect(Object.keys(InstanceUtil.getInstanceCache()).length).toEqual(0)
    })

    it('should call componentWillUnmount when its a function on the instance', () => {
      const unmount = jest.fn()
      const testCache = { data: { componentWillUnmount: unmount } }
      InstanceUtil.setInstanceCache(testCache)
      InstanceUtil.clearInstance('data')

      expect(unmount).toHaveBeenCalled()
    })

    it('should remove all properties from the passed in instance', () => {
      const testCache = { data: { duper: 'foo', test:'super' } }
      InstanceUtil.setInstanceCache(testCache)
      InstanceUtil.clearInstance('data')

      expect(Object.keys(testCache).length).toEqual(0)
    })

    it('should use the passed in instance, when no key is passed in', () => {
      const unmount = jest.fn()
      const testCache = { duper: 'foo', test:'super', componentWillUnmount: unmount }
      InstanceUtil.clearInstance(false, testCache)

      expect(unmount).toHaveBeenCalled()
      expect(Object.keys(testCache).length).toEqual(0)
    })

  })

  // describe('buildInstance', () => {
  // })

  // describe('addConstants.SchemaInstance', () => {
  // })
  
  // describe('addCompProp', () => {
  // })

})