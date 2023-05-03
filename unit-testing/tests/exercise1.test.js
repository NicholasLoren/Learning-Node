const { fizzBuzz } = require('../exercise1')

describe('FizzBuzz', () => {
  it('should throw an exception if input value is not a number', () => {
    expect(() => {
      const list = ['a', {}, [], null, undefined]
      list.forEach((arg) => {
        fizzBuzz(arg)
      })
    }).toThrow()
  })
  it('should return FizzBuzz if input is divisible by 3 and 5', () => {
    const result = fizzBuzz(15)
    expect(result).toBe('FizzBuzz')
  })
  it('should return Fizz if input is divisible by 3 but not 5', () => {
    const result = fizzBuzz(3)
    expect(result).toMatch(/Fizz/)
  })
  it('should return FizzBuzz if input is divisible by 5 but not 3', () => {
    const result = fizzBuzz(5)
    expect(result).toBe('Buzz')
  })
  it('should return input if input is divisible by 5 and 3', () => {
    const result = fizzBuzz(1)
    expect(result).toBe(1)
  })
})
