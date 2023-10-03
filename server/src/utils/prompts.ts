import { OK, safe } from "../../error";
import { MessageRole } from "./constants";
import { PAGE_TYPE, ShopifyProduct } from "./types";

export const Prompts = {
  [PAGE_TYPE.GENERAL]: (contextText: string, storeName: string) => [
    {
      role: MessageRole.User,
      content: `
        I am currently browsing on the ${storeName} store webpage, it's a shopify store.  I really want to get some good items from the store. 
    
        You are a helpful assistant that will guide me to make good decisions along the way.
    
        you will be provided a list of products in json format to choose from

        --- 
        Here are the vailable products:
        ${contextText}
        ---

        ${answerFormat()}
    `,
    },
  ],

  [PAGE_TYPE.PRODUCT]: (contextText: string, storeName: string, currentProduct: string) => {
    const json = safe(() => JSON.parse(currentProduct) as ShopifyProduct);
    let details = {} as ShopifyProduct;

    if (json.kind === OK) {
      details = json.value;
    }

    return [
      {
        role: MessageRole.User,
        content: `
        I am currently browsing on the ${storeName} store webpage, it's a shopify store. and to be more specific, i am on the ${
          details.title
        } product page.  I really want to get some good items from the store. 
            
        You are a helpful assistant that will guide me to make good decisions along the way.

        you will be provided a list of products in json format to choose from

        ---
        here is the information about the product page i'm currently on,
        ${currentProduct}
        ---
  
        ---
        and here are some recommendations i found about it
        ${contextText}
        ---

        ${answerFormat()}
 `,
      },
    ];
  },

  [PAGE_TYPE.COLLECTION]: (contextText: string, storeName: string, currentCollection: string) => {
    const json = safe(() => JSON.parse(currentCollection) as ShopifyProduct);
    let details = {} as ShopifyProduct;

    if (json.kind === OK) {
      details = json.value;
    }

    return [
      {
        role: MessageRole.User,
        content: `
        I am currently browsing on the ${storeName} store webpage, it's a shopify store. and to be more specific, i am on the ${
          details.title
        } collections page.  I really want to get some good items from the store. 
            
        You are a helpful assistant that will guide me to make good decisions along the way.
        
        you will be provided a list of products in json format to choose from
        
       
        ---
        here is the information i have about the collections page i'm currently on, 
        ${currentCollection}
        ---
        
        ---
        Recomendations:  here are some recommendations i found about it
        ${contextText}
        ---
        
        ${answerFormat("collection")}
        
        
        `,
      },
    ];
  },
};

const answerFormat = (type = "product") => `
 
    You must anwser the questions in following format in markdown
      - Product name" 
      - description: also tell me why it is a better product
      - Information on available sizes, product link and price
      - product image:
      - product link:
      - also convince me on buying a better ${type}.
`;
