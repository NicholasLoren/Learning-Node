const { absolute } = require('../lib')

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
