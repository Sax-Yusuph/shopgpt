import { BoxShadows } from '@/styles'
import styled from 'styled-components/macro'

export const Wrapper = styled.div`
  width: 100vh;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`

export const PanelContainer = styled.div`
  width: 375px;
  height: 650px;
  position: relative;
  background: #fbfbf8;
  border-radius: 10px;
  overflow: hidden;
  background-color: red;
  ${BoxShadows}
`

export const PanelInner = styled.div`
  background: #fbfbf8;
  color: #1b1c1d;
  padding-bottom: 68px;
  height: inherit;
  display: -webkit-box;
  display: -webkit-flex;
  display: -ms-flexbox;
  display: flex;
  flex-direction: column;
`

export const PanelHeader = styled.div`
  height: 68px;
  min-height: 68px;
  line-height: 68px;
  background: #fbfbf8;
  color: #1b1c1d;
  padding: 0 12px;
  border-bottom: 1px solid #ece9dd;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const PanelFooter = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 68px;
  background: #000000;
  z-index: 1000;
`

export const PanelChat = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`
export const MainWindow = styled.div`
  overflow-y: auto;
  overflow-x: hidden;
  scrollbar-width: none;
  position: relative;
  height: calc(650px - 68px - 68px);
  padding: 20px;
`

export const Box = styled.div`
  height: 140px;
  width: 100%;
  background-color: #f4f2eb;
  border-radius: 1px;
  margin-bottom: 10px;
`

export const Top = styled.div``

export const Flex = styled.div`
  display: flex;
  justify-content: space-between;
  flex: 1;
`
export const Title = styled.h1`
  border: none;
`
export const Header = styled.div`
  flex: 2;
`
export const StyleInput = styled.input`
  border-radius: 14px;
  height: 40px;
  width: 90%;
`

export const IconBtn = styled.div`
  padding: 3px;
  border-radius: 50%;
  height: 26px;
  height: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: #ece9dd;
  }
`
