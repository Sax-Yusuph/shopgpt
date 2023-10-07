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
        role: MessageRole.User,
        content: `
          the User currently browsing on the ${storeName} store webpage, it's a shopify store.  
          You are a helpful assistant that help people to shop better 
          You will be provided with the store information delimited by triple quotes and a question. 
          Your task is to answer the question using only the provided store information
          and to cite the exact product links and product images of the products used to answer the question. 
          
          If the document does not contain the information needed to answer this question then simply write: "Insufficient information."
          
          If an answer to the question is provided, it must display the correct product link and image of the product. 
          you should provide a good description of the product, and state the reasons why it's a recommended over the others.
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
      role: MessageRole.User,
      content: `
        the User currently browsing on the ${storeName} store, it's a shopify store.  
        You are a helpful assistant that help people to shop better 

        here is the store information delimited by triple quotes, containing the list of relevant products on the store
        """
        ${contextText}
        """

        you will be provided an information of the current page delimited by triple quotes, and a question
        Your task is to answer the question using only the document above provided by the system, or the current page information by the user
        and to cite the exact product links and product images of the products used to answer the question. 

        If the document does not contain the information needed to answer this question then simply write: "Product you asked is not available", and provide alternatives using the document information as a reference

        If an answer to the question is provided, it must display the correct product link and image of the product. 
        you should provide a good description of the product, and state the reasons why it's a recommended over the others.

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

const answerFormat = (type = "product") => `
 
    You must anwser the questions in following format in markdown
      - Product name" 
      - description: also tell me why it is a better product
      - Information on available sizes, product link and price
      - product image:
      - product link:
      - also convince me on buying a better ${type}.
`;
/**
 * Use the following format for the product link [Link to product](...)
        Use the following format for the product image <img src={...} width={...} height={...} />
 */
