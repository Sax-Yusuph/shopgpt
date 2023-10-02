import { GlobalStyles } from '@/styles'
import { Router } from 'react-chrome-extension-router'
import styled from 'styled-components/macro'

import { Panel } from '@/components/Panel'
import { Iframe } from '../../components/ui/iframe'

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 12px;
`

export function App(): JSX.Element {
  return (
    <Iframe showPanel>
      <GlobalStyles />
      <Container>
        <Router>
          <Panel />
        </Router>
      </Container>
    </Iframe>
  )
}
