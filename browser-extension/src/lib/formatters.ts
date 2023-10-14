export const parseUrl = (url: string): string => {
    const str = url.split('//').pop()
  
    return str?.split('/')[0] ?? ''
  }
  