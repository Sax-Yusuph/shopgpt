import { MessageRole } from "./constants";
import { PAGE_TYPE } from "./types";

type Params = {
  contextText: string;
  storeName: string;
  question: string;
  pageType: PAGE_TYPE;
  currentProduct?: string;
};

export function getPrompts(params: Params) {
  const { contextText, storeName, currentProduct, question, pageType } = params;

 

  if (!currentProduct || pageType === PAGE_TYPE.GENERAL) {
    return [
      {
        role: MessageRole.System,
        content: `
          the buyer is currently browsing on the ${storeName} store webpage, it's a shopify store.  
          You are a shopping assistant that help people to shop better.
          here is the store information delimited by triple quotes.
          """
          Products list:
          ${contextText}
          """

          when the user asks a question,
          1. Your task is to answer the question using the store information as reference
          and to cite the exact links and images of the products used to answer the question. 
          2. If an answer to the question is provided, it must display the correct product link and image of the product. 
          3. you should provide a good description of the product, and state the reasons why it's a recommended over the others.
          4. try to provide a least 3 answers, so that the user can choose from a range of options.
          5. you should also convince the buyer on why each is better 
          `,
      },
      {
        role: MessageRole.User,
        content: `
          """
          Products list:
          ${contextText}
          """
  
          Question: ${question}
        `,
      },
    ];
  }

  return [
    {
      role: MessageRole.System,
      content: `
        the User currently browsing on the ${storeName} store, it's a shopify store.  
        You are a shopping assistant that help people to shop better 

        here is the store information delimited by triple quotes, containing the list of relevant products on the store
        """
        ${contextText}
        """

        you will be provided an information of the current page delimited by triple quotes, and a question
        1. Your task is to answer the question using the store information as reference
        and to cite the exact links and images of the products used to answer the question. 
        2. If an answer to the question is provided, it must display the correct product link and image of the product. 
        3. you should provide a good description of the product, and state the reasons why it's a recommended over the others.
        4. try to provide a least 3 answers, so that the user can choose from a range of options.
        5. you should also convince the buyer on why each is better 

    `,
    },
    {
      role: MessageRole.User,
      content: `
        """
        ${currentProduct}
        """
        Question: ${question}
      `,
    },
  ];
}
