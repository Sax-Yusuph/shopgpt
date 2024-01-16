export const parseUrl = (url: string): string => {
  const str = url.split('//').pop()

  return str?.split('/')[0] ?? ''
}

export const formatPrice = (num: string) => {

  const value= +num
  if(isNaN(value)) return num

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    maximumFractionDigits: 8,
  })

  const formattedNumber = formatter.format(value)

  //this escape prevents -900 from appearing as 900- in rtl mode.
  return `\u202D ${formattedNumber} \u202C`
}
