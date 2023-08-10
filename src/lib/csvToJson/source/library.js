const {
  COMMA,
  DIC,
  ES,
  NL,
  FORMAT,
  STRING,
  EMPTY_DATA_MSG,
  EMPTY_DATA_EXCEPTION,
  NOT_A_STRING_MSG,
  INVALID_DATA_EXCEPTION,
  NOT_VALID_ARG_MSG,
  INVALID_ARGUMENT_EXCEPTION,
  FILE_NOT_FOUND_EXCEPTION
} = require('./constants')

const extractValues = function (chars, separator = COMMA) {
  let value = ES
  let values = []
  let isValueComplete = true
  const lastIndex = chars.length - 1

  chars.forEach((char, index) => {
    const previousChar = chars[index - 1]
    const nextChar = chars[index + 1]
    if (char === DIC) {
      isValueComplete = !isValueComplete
      if (
        previousChar === DIC ||
        previousChar === separator ||
        nextChar === separator ||
        index === lastIndex - 1 ||
        index === 0
      ) {
        return
      }
    }

    if ((char === separator || index === lastIndex) && isValueComplete) {
      if (char !== DIC && char !== separator && char !== '\r') value += char
      values.push(value)
      value = ES
      return
    }
    value += char
  })
  return values
}

const getObj = function (headers, lineData) {
  const obj = {}

  headers.forEach((header, index) => {
    let value = lineData[index]
    if (value === 'null') {
      value = null
    }
    obj[header] = value
  })
  return obj
}

const getFinalResult = function (data, headers, separator) {
  const finalResult = []
  data.forEach(line => {
    line = line.split(ES)
    const lineData = extractValues(line, separator)
    const obj = getObj(headers, lineData)
    finalResult.push(obj)
  })
  return finalResult
}

const readData = function (data) {
  if (typeof data === STRING) {
    if (data.length) return data.trim().split(NL)
    console.error(EMPTY_DATA_MSG)
    throw Error(EMPTY_DATA_EXCEPTION)
  }
  console.error(NOT_A_STRING_MSG)
  throw Error(INVALID_DATA_EXCEPTION)
}

const getData = function (params) {
  if (params.filePath == null && params.data == null) {
    console.error(NOT_VALID_ARG_MSG)
    throw Error(INVALID_ARGUMENT_EXCEPTION)
  }

  return readData(params.data)
}

const sliceHeaderIfNeeded = (params, data) => {
  if (params.hasOwnProperty('hasHeader')) {
    return params.hasHeader ? data.slice(1) : data.slice()
  }
  return data.slice(1)
}

module.exports = {
  extractValues,
  getObj,
  getFinalResult,
  getData,
  readData,
  sliceHeaderIfNeeded
}
