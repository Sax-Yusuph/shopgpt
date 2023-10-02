import { AspectRatio } from '@radix-ui/react-aspect-ratio'

import { memo } from 'react'
import styled from 'styled-components/macro'
import { useSnapshot } from 'valtio'
import { ChatState, chatState } from './store'
import { Box } from './styles'

interface Props {
  alt: string
  src: string
  id: string
  
}

const StyledImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

const StyledAspectRatio = styled(AspectRatio)`
  background-color: #f4f2eb;
  border-radius: 1px;
  margin-bottom: 10px;
`
const BlurImage = memo((props: Props) => {
  const { ...rest } = props
  const snap = useSnapshot<ChatState>(chatState)

  return (
    <StyledAspectRatio ratio={16 / 9}>
      {snap.loading ? (
        <Box className="h-full w-full" />
      ) : (
        <StyledImg
          //   className={cn(
          //     props.className,
          //     'animate-in zoom-in-75 w-full h-full object-cover !m-0',
          //   )}
          {...rest}
        />
      )}
    </StyledAspectRatio>
  )
})

BlurImage.displayName = 'BlurImage'

export default BlurImage
