import { Product } from '@/types'
import { Message } from 'ai'
import { TiktokenModel, encodingForModel } from 'js-tiktoken'
import { getMaxTokenCount } from '../completions/tokenizer'
import {
  COMPLETION_MODEL,
  LARGE_MODELS,
  MAX_COMPLETION_TOKEN_COUNT,
} from '../constants'

const encoding = encodingForModel(COMPLETION_MODEL)

export function getContext(products: Product[], model = COMPLETION_MODEL) {
  let tokenCount = 0
  let contextText = ''

  for (let i = 0; i < products.length; i++) {
    const product = products[i]
    const content = product.data
    const encoded = encoding.encode(content)
    tokenCount += encoded.length

    const max = LARGE_MODELS.includes(model) ? 5000 : 1500

    if (tokenCount >= max) {
      break
    }

    contextText += `---\n ${content.trim()}\n ---`
  }

  return contextText
}

export function countMsgTokens(
  messages: Message[],
  model: TiktokenModel,
): number {
  let tokensPerMessage
  let tokensPerName
  let numTokens = 0

  switch (model) {
    case 'gpt-3.5-turbo':
    case 'gpt-3.5-turbo-0301':
      tokensPerMessage = 4 // every message follows {role/name}\n{content}\n
      tokensPerName = -1 // if there's a name, the role is omitted
      break

    case 'gpt-4':
    case 'gpt-4-32k':
    case 'gpt-4-0314':
      tokensPerMessage = 3
      tokensPerName = 1
      break

    default:
      tokensPerMessage = 4
      tokensPerName = 1
  }

  for (const message of messages) {
    numTokens += tokensPerMessage

    for (const [key, value] of Object.entries(message)) {
      if (['name', 'role', 'content'].includes(key)) {
        numTokens += encoding.encode(value as string).length
        if (key === 'name') {
          numTokens += tokensPerName
        }
      }
    }
  }

  numTokens += 3 // every reply is primed with assistant
  return numTokens
}

export function capMessages(
  initMessages: Message[],
  contextMessages: Message[],
  maxCompletionTokenCount = MAX_COMPLETION_TOKEN_COUNT,
  model = COMPLETION_MODEL,
) {
  const maxTotalTokenCount = getMaxTokenCount(model)
  const cappedContextMessages = [...contextMessages]

  let tokenCount =
    maxCompletionTokenCount +
    countMsgTokens([...initMessages, ...cappedContextMessages], model)

  // Remove earlier context messages until we fit

  while (tokenCount >= maxTotalTokenCount) {
    cappedContextMessages.shift()
    tokenCount =
      maxCompletionTokenCount +
      countMsgTokens([...initMessages, ...cappedContextMessages], model)
  }

  const mm = [...initMessages, ...cappedContextMessages]

  return mm
}
