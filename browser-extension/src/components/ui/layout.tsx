import styled, { keyframes } from 'styled-components/macro'

export const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
`

export const FlexButton = styled.button`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`

export const Heading = styled.h3`
  font-size: 16px;
  font-weight: bold;
`

export const Text = styled.p`
  font-size: 16px;
`

export const IntroAnimation = keyframes`
  from {
    opacity: 0;
    transform: translateY(.25rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`

export const BlinkAnimation = keyframes`
  0% {
    opacity: 0;
  }
`

export const Background = styled.div`
  background-color: #181a1d;
  background-image: radial-gradient(#ffffff12 1px, transparent 0);
  background-size: 30px 30px;
  background-position: -20px -22px;
  color: #b6b8bd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1em;
  height: 100%;
  width: 100%;
  position: relative;
`


export const Layout = styled(FlexDiv)`
  height: 100%;
  width: 100%;
`