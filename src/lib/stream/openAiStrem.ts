import {
  AIStream,
  AIStreamCallbacks,
  CreateMessage,
  createCallbacksTransformer,
  trimStartOfStreamHelper
} from 'ai'

type JSONValue =
  | null
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>

export type OpenAIStreamCallbacks = AIStreamCallbacks & {
  /**
   * @example
   * ```js
   * const response = await openai.createChatCompletion({
   *   model: 'gpt-3.5-turbo-0613',
   *   stream: true,
   *   messages,
   *   functions,
   * })
   *
   * const stream = OpenAIStream(response, {
   *   experimental_onFunctionCall: async (functionCallPayload, createFunctionCallMessages) => {
   *     // ... run your custom logic here
   *     const result = await myFunction(functionCallPayload)
   *
   *     // Ask for another completion, or return a string to send to the client as an assistant message.
   *     return await openai.createChatCompletion({
   *       model: 'gpt-3.5-turbo-0613',
   *       stream: true,
   *       // Append the relevant "assistant" and "function" call messages
   *       messages: [...messages, ...createFunctionCallMessages(result)],
   *       functions,
   *     })
   *   }
   * })
   * ```
   */
  experimental_onFunctionCall?: (
    functionCallPayload: FunctionCallPayload,
    createFunctionCallMessages: (
      functionCallResult: JSONValue
    ) => CreateMessage[]
  ) => Promise<Response | undefined | void | string>
}

// https://github.com/openai/openai-node/blob/07b3504e1c40fd929f4aae1651b83afc19e3baf8/src/resources/chat/completions.ts#L28-L40
interface ChatCompletionChunk {
  id: string
  choices: Array<ChatCompletionChunkChoice>
  created: number
  model: string
  object: string
}

// https://github.com/openai/openai-node/blob/07b3504e1c40fd929f4aae1651b83afc19e3baf8/src/resources/chat/completions.ts#L43-L49
interface ChatCompletionChunkChoice {
  delta: ChoiceDelta

  finish_reason: 'stop' | 'length' | 'function_call' | null

  index: number
}

// https://github.com/openai/openai-node/blob/07b3504e1c40fd929f4aae1651b83afc19e3baf8/src/resources/chat/completions.ts#L123-L139
interface ChoiceDelta {
  /**
   * The contents of the chunk message.
   */
  content?: string | null

  /**
   * The name and arguments of a function that should be called, as generated by the
   * model.
   */
  function_call?: FunctionCall

  /**
   * The role of the author of this message.
   */
  role?: 'system' | 'user' | 'assistant' | 'function'
}

// https://github.com/openai/openai-node/blob/07b3504e1c40fd929f4aae1651b83afc19e3baf8/src/resources/chat/completions.ts#L146-L159
interface FunctionCall {
  /**
   * The arguments to call the function with, as generated by the model in JSON
   * format. Note that the model does not always generate valid JSON, and may
   * hallucinate parameters not defined by your function schema. Validate the
   * arguments in your code before calling your function.
   */
  arguments?: string

  /**
   * The name of the function to call.
   */
  name?: string
}

/**
 * Creates a parser function for processing the OpenAI stream data.
 * The parser extracts and trims text content from the JSON data. This parser
 * can handle data for chat or completion models.
 *
 * @return {(data: string) => string | void} A parser function that takes a JSON string as input and returns the extracted text content or nothing.
 */
function parseOpenAIStream(): (data: string) => string | void {
  const extract = chunkToText()
  return data => {
    return extract(JSON.parse(data) as ChatCompletionChunk)
  }
}

/**
 * Reads chunks from OpenAI's new Streamable interface, which is essentially
 * the same as the old Response body interface with an included SSE parser
 * doing the parsing for us.
 */
async function* streamable(stream: AsyncIterable<ChatCompletionChunk>) {
  const extract = chunkToText()
  for await (const chunk of stream) {
    const text = extract(chunk)
    if (text) yield text
  }
}

function chunkToText(): (chunk: ChatCompletionChunk) => string | void {
  const trimStartOfStream = trimStartOfStreamHelper()
  let isFunctionStreamingIn: boolean
  return json => {
    /*
       If the response is a function call, the first streaming chunk from OpenAI returns the name of the function like so

          {
            ...
            "choices": [{
              "index": 0,
              "delta": {
                "role": "assistant",
                "content": null,
                "function_call": {
                  "name": "get_current_weather",
                  "arguments": ""
                }
              },
              "finish_reason": null
            }]
          }

       Then, it begins streaming the arguments for the function call.
       The second chunk looks like:

          {
            ...
            "choices": [{
              "index": 0,
              "delta": {
                "function_call": {
                  "arguments": "{\n"
                }
              },
              "finish_reason": null
            }]
          }

        Third chunk:

          {
            ...
            "choices": [{
              "index": 0,
              "delta": {
                "function_call": {
                  "arguments": "\"location"
                }
              },
              "finish_reason": null
            }]
          }

        ...

        Finally, the last chunk has a `finish_reason` of either `function_call`:

          {
            ...
            "choices": [{
              "index": 0,
              "delta": {},
              "finish_reason": "function_call"
            }]
          }

        or `stop`, when the `function_call` request parameter 
        is specified with a particular function via `{\"name\": \"my_function\"}` 

          {
            ...
            "choices": [{
              "index": 0,
              "delta": {},
              "finish_reason": "stop"
            }]
          }

        With the implementation below, the client will end up getting a
        response like the one below streamed to them whenever a function call
        response is returned:

          {
            "function_call": {
              "name": "get_current_weather",
              "arguments": "{\"location\": \"San Francisco, CA\", \"format\": \"celsius\"}
            }
          }
     */
    if (json.choices[0]?.delta?.function_call?.name) {
      isFunctionStreamingIn = true
      return `{"function_call": {"name": "${json.choices[0]?.delta?.function_call.name}", "arguments": "`
    } else if (json.choices[0]?.delta?.function_call?.arguments) {
      const argumentChunk: string =
        json.choices[0].delta.function_call.arguments

      let escapedPartialJson = argumentChunk
        .replace(/\\/g, '\\\\') // Replace backslashes first to prevent double escaping
        .replace(/\//g, '\\/') // Escape slashes
        .replace(/"/g, '\\"') // Escape double quotes
        .replace(/\n/g, '\\n') // Escape new lines
        .replace(/\r/g, '\\r') // Escape carriage returns
        .replace(/\t/g, '\\t') // Escape tabs
        .replace(/\f/g, '\\f') // Escape form feeds

      return `${escapedPartialJson}`
    } else if (
      isFunctionStreamingIn &&
      (json.choices[0]?.finish_reason === 'function_call' ||
        json.choices[0]?.finish_reason === 'stop')
    ) {
      isFunctionStreamingIn = false // Reset the flag
      return '"}}'
    }

    const text = trimStartOfStream(
      json.choices[0]?.delta?.content ?? (json.choices[0] as any)?.text ?? ''
    )
    return text
  }
}

const __internal__OpenAIFnMessagesSymbol = Symbol('internal_openai_fn_messages')

export function OpenAIStream(
  res: Response | AsyncIterable<ChatCompletionChunk>,
  callbacks?: OpenAIStreamCallbacks
): ReadableStream {
  // Annotate the internal `messages` property for recursive function calls
  const cb:
    | undefined
    | (OpenAIStreamCallbacks & {
        [__internal__OpenAIFnMessagesSymbol]?: CreateMessage[]
      }) = callbacks

  let stream: ReadableStream<Uint8Array>
  if (Symbol.asyncIterator in res) {
    stream = readableFromAsyncIterable(streamable(res)).pipeThrough(
      createCallbacksTransformer(cb)
    )
  } else {
    stream = AIStream(res, parseOpenAIStream(), cb)
  }

  if (cb && cb.experimental_onFunctionCall) {
    const functionCallTransformer = createFunctionCallTransformer(cb)
    return stream.pipeThrough(functionCallTransformer)
  } else {
    return stream
  }
}

function createFunctionCallTransformer(
  callbacks: OpenAIStreamCallbacks & {
    [__internal__OpenAIFnMessagesSymbol]?: CreateMessage[]
  }
): TransformStream<Uint8Array, Uint8Array> {
  const textEncoder = new TextEncoder()
  let isFirstChunk = true
  let aggregatedResponse = ''
  let isFunctionStreamingIn = false

  let functionCallMessages: CreateMessage[] =
    callbacks[__internal__OpenAIFnMessagesSymbol] || []

  return new TransformStream({
    async transform(chunk, controller): Promise<void> {
      const message = new TextDecoder().decode(chunk)

      const shouldHandleAsFunction =
        isFirstChunk && message.startsWith('{"function_call":')

      if (shouldHandleAsFunction) {
        isFunctionStreamingIn = true
        aggregatedResponse += message
        isFirstChunk = false
        return
      }

      // Stream as normal
      if (!isFunctionStreamingIn) {
        controller.enqueue(chunk)
        return
      } else {
        aggregatedResponse += message
      }
    },
    async flush(controller): Promise<void> {
      const isEndOfFunction =
        !isFirstChunk &&
        callbacks.experimental_onFunctionCall &&
        isFunctionStreamingIn

      // This callbacks.experimental_onFunctionCall check should not be necessary but TS complains
      if (isEndOfFunction && callbacks.experimental_onFunctionCall) {
        isFunctionStreamingIn = false
        const payload = JSON.parse(aggregatedResponse)
        const argumentsPayload = JSON.parse(payload.function_call.arguments)

        // Append the function call message to the list
        let newFunctionCallMessages: CreateMessage[] = [...functionCallMessages]

        const functionResponse = await callbacks.experimental_onFunctionCall(
          {
            name: payload.function_call.name,
            arguments: argumentsPayload
          },
          result => {
            // Append the function call request and result messages to the list
            newFunctionCallMessages = [
              ...functionCallMessages,
              {
                role: 'assistant',
                content: '',
                function_call: payload.function_call
              },
              {
                role: 'function',
                name: payload.function_call.name,
                content: JSON.stringify(result)
              }
            ]

            // Return it to the user
            return newFunctionCallMessages
          }
        )

        if (!functionResponse) {
          // The user didn't do anything with the function call on the server and wants
          // to either do nothing or run it on the client
          // so we just return the function call as a message
          controller.enqueue(textEncoder.encode(aggregatedResponse))
          return
        } else if (typeof functionResponse === 'string') {
          // The user returned a string, so we just return it as a message
          controller.enqueue(textEncoder.encode(functionResponse))
          return
        }

        // Recursively:

        // We don't want to trigger onStart or onComplete recursively
        // so we remove them from the callbacks
        // see https://github.com/vercel-labs/ai/issues/351
        const filteredCallbacks: OpenAIStreamCallbacks = {
          ...callbacks,
          onStart: undefined,
          onCompletion: undefined
        }

        const openAIStream = OpenAIStream(functionResponse, {
          ...filteredCallbacks,
          [__internal__OpenAIFnMessagesSymbol]: newFunctionCallMessages
        } as AIStreamCallbacks)

        const reader = openAIStream.getReader()

        while (true) {
          const { done, value } = await reader.read()
          if (done) {
            break
          }
          controller.enqueue(value)
        }
      }
    }
  })
}
