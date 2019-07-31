function validation (data, validator) {
  const boolres = validator(data)
  let result = ''
  if (!boolres) {
    for (const item in validator.errors) {
      result += validator.errors[item].message + '\n'
    }
    return result
  }
}

module.exports = { validation }
