import { BoxShadows, zIndex } from '@/styles'
import { Fragment, type ReactNode } from 'react'
import Frame, { useFrame } from 'react-frame-component'
import styled, { StyleSheetManager } from 'styled-components/macro'

export interface IframeProps {
  children?: ReactNode
  showPanel?: boolean
}

const PanelFrame = styled(Frame)`
  position: fixed;
  top: 35px;
  float: none;
  width: 375px;
  height: 650px;
  right: 20px;
  ${zIndex}
  pointer-events: auto;
  ${BoxShadows}
`

const ButtonFrame = styled.div`
  width: 65px;
  height: 48px;
  position: fixed;
  display: flex;
  top: 331px;
  right: -16px;
  transition: right 0.5s cubic-bezier(0.19, 1, 0.22, 1) 0s;
  pointer-events: auto;
  &:hover {
    right: -5px;
  }
  ${BoxShadows}
  ${zIndex}
`
export function IframeContentStyles(props: Omit<IframeProps, 'showPanel'>) {
  const { document } = useFrame()

  return (
    <StyleSheetManager target={document?.head}>
      <Fragment>{props.children}</Fragment>
    </StyleSheetManager>
  )
}

export function Iframe(props: IframeProps) {
  const { children, showPanel, ...rest } = props
  if (showPanel) {
    return (
      <PanelFrame {...rest}>
        <IframeContentStyles>{children}</IframeContentStyles>
      </PanelFrame>
    )
  }

  return (
    <ButtonFrame>
      <IframeContentStyles>{children}</IframeContentStyles>
    </ButtonFrame>
  )
}

export default Iframe

Iframe.displayName = 'Iframe'
