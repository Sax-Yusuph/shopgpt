import { Icons } from '@/components/ui/icons'
import { GlobalStyles } from '@/styles'
import styled from 'styled-components/macro'
import Iframe from '../../components/ui/iframe'

const Expand = styled.div`
  width: 20px;
  background-color: #c295e9;
`

const Container = styled.div`
  user-select: none;
  height: 100%;
  left: -45px;
  all: unset;
  user-select: none;
  display: flex;
  cursor: pointer;
  background: #000000;
  border-radius: 8px 0 0 8px;
`

const Button = styled.div`
  width: 45px;
  height: 100%;
  color: #ddd8c2;
  font-size: larger;
  display: flex;
  justify-content: center;
  align-items: center;
`

export function ShopButton(): JSX.Element {
  console.log('fired script')
  return (
    <Iframe showPanel={false}>
      <GlobalStyles />
      <Container onClick={() => window.toggleDisplay?.()}>
        <Button>
          <Icons.OpenAI />
        </Button>
        <Expand />
      </Container>
    </Iframe>
  )
}
