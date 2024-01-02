import model from "@dqbd/tiktoken/encoders/cl100k_base.json";
import { init, Tiktoken } from "@dqbd/tiktoken/lite/init";
import { ChatCompletionMessageParam } from "openai/resources";
import wasm from "../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm";

export default {
  async fetch(prompts: M, messages: M, maxCompletionTokenCount: number) {
    await init((imports) => WebAssembly.instantiate(wasm, imports));
    const encoder = new Tiktoken(
      model.bpe_ranks,
      model.special_tokens,
      model.pat_str
    );

    const completionMessages = await capMessages(encoder, {
      prompts,
      messages,
      maxCompletionTokenCount,
    });

    encoder.free();
    return completionMessages;
  },
};

async function capMessages(
  encoder: Tiktoken,
  opts: {
    prompts: M;
    messages: M;
    maxCompletionTokenCount: number;
  }
) {
  const { prompts, messages, maxCompletionTokenCount } = opts;

  const maxTotalTokenCount = 8_192;
  const cappedContextMessages = [...messages];

  let tokenCount =
    getChatRequestTokenCount(encoder, [...prompts, ...cappedContextMessages]) +
    maxCompletionTokenCount;

  // Remove earlier context messages until we fit
  while (tokenCount >= maxTotalTokenCount) {
    cappedContextMessages.shift();
    tokenCount =
      getChatRequestTokenCount(encoder, [
        ...prompts,
        ...cappedContextMessages,
      ]) + maxCompletionTokenCount;
  }

  return [...prompts, ...cappedContextMessages];
}

function getMessageTokenCount(
  encoder: Tiktoken,
  message: ChatCompletionMessageParam
) {
  const tokensPerMessage = 4;
  const tokensPerName = 1;

  return Object.entries(message).reduce((acc, [key, value]) => {
    acc += encoder.encode(value).length;

    if (key === "name") {
      acc += tokensPerName;
    }

    return acc;
  }, tokensPerMessage);
}

function getChatRequestTokenCount(encoder: Tiktoken, messages: M) {
  const tokensPerRequest = 3; // every reply is primed with <|im_start|>assistant<|im_sep|>
  const numTokens = messages.reduce(
    (acc, message) => acc + getMessageTokenCount(encoder, message),
    0
  );

  return numTokens + tokensPerRequest;
}

type M = Array<ChatCompletionMessageParam>;
