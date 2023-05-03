const { absolute, greet, getCurrencies,getProduct, registerUser } = require('../lib')

describe('absolute', () => {
  it('absolute - return a positive number if input value is positive', () => {
    const result = absolute(1)
    expect(result).toBe(1)
  })
  it('absolute - return a positive number if input value is negative', () => {
    const result = absolute(-1)
    expect(result).toBe(1)
  })
  it('absolute - return zero if input value is zero', () => {
    const result = absolute(0)
    expect(result).toBe(0)
  })
})

describe('greet', () => {
  it('should contain username', () => {
    const result = greet('Nicholas')
    expect(result).toContain('Nicholas')
  })
})

describe('getCurrencies', () => {
  it('should contain supported currencies', () => {
    const result = getCurrencies()
    expect(result).toEqual(expect.arrayContaining(['USD', 'EUR', 'AUD']))
  })
})

describe('getProduct',()=>{
    it('should return an object with a object id',()=>{
        const product = getProduct(1)
        expect(product).toMatchObject({id:1})
    })
})

describe('registerUser', () => {
  it('should throw an exception if username iss falsy', () => {
    expect(() => {
      const falsy = ['', null, undefined, 0, false]
      falsy.forEach((a) => {
        registerUser(a)
      })
    }).toThrow()
  })
})
