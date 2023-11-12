import { PAGE_TYPE } from '@/types'
import { Message } from 'ai'
import { MessageRole, StorageKeys } from '../constants'
import { storage } from '../hooks/storage'

type Params = {
  contextText: string
  storeName: string
  pageType: PAGE_TYPE
  currentProduct?: string
  id: string
}

export const DEFAULT_SYSTEM_PROMPT = `
when the user asks a question,
1. Your task is to answer the question using the store information as reference and to cite the exact links and images of the products used to answer the question. 
2. If an answer to the question is provided, it must display the correct product link and image of the product. 
3. you should provide a good description of the product, and state the reasons why it's a recommended over the others.
4. try to provide a least 2 answers, so that the user can choose from a range of options.
5. you should also convince the buyer on why each is better
6. Space out your answers into nice paragraphs and make it readable
`

export async function getPrompts(params: Params): Promise<Message[]> {
  const { id, contextText, storeName, currentProduct, pageType } = params

  const instructions =
    ((await storage.get(StorageKeys.SYSTEM_PROMPT)) as string) ||
    DEFAULT_SYSTEM_PROMPT

  if (!instructions) {
    storage.set(StorageKeys.SYSTEM_PROMPT, DEFAULT_SYSTEM_PROMPT)
  }

  if (!currentProduct || pageType === PAGE_TYPE.GENERAL) {
    return [
      {
        id,
        role: MessageRole.System,
        content: `
        the buyer is currently browsing on the ${storeName?.toLowerCase()} store webpage, it's a shopify store.  
        You are a shopping assistant that help people to shop better.
        here is the store information delimited by triple quotes.
        """
        Products list:
        ${contextText}
        """
        ${instructions}
        `,
      },
    ]
  }

  return [
    {
      id,
      role: MessageRole.System,
      content: `
        the User currently browsing on the ${storeName?.toLowerCase()} store, it's a shopify store.  
        You are a shopping assistant that help people to shop better 

        here is the store information delimited by triple quotes, containing the list of relevant products on the store
        """
        ${contextText}
        """

        you will be provided an information of the current page delimited by triple quotes, and a question
        ${instructions}
    `,
    },
  ]
}
