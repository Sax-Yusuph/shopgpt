import { ES } from './source/constants'
import {
  extractValues,
  getData,
  getFinalResult,
  sliceHeaderIfNeeded
} from './source/library'

export default function csvToJson(params: {
  data: string
  headers?: boolean
  separator?: string
}) {
  const data = getData(params)
  const headers = params.headers
    ? params.headers
    : extractValues(data[0].split(ES), params.separator)
  const dataWithOrWithoutHeader = sliceHeaderIfNeeded(params, data)
  return getFinalResult(dataWithOrWithoutHeader, headers, params.separator)
}
