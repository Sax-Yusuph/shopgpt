import { clx } from '@medusajs/ui'
import React, { Suspense, cloneElement, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { Loading } from '../Loading'
import { DetailsSummary } from './summary'

export type DetailsProps = {
  openInitial?: boolean
  summaryContent?: React.ReactNode
  summaryElm?: React.ReactNode
} & React.HTMLAttributes<HTMLDetailsElement>

export const Details = ({
  openInitial = false,
  summaryContent,
  summaryElm,
  children,
  ...props
}: DetailsProps) => {
  const [open, setOpen] = useState(openInitial)
  const [showContent, setShowContent] = useState(openInitial)
  const ref = useRef<HTMLDetailsElement>(null)

  const handleToggle = () => {
    if (open) {
      setShowContent(false)
    } else {
      setOpen(true)
      setShowContent(true)
    }
  }

  return (
    <details
      {...props}
      ref={ref}
      open={open}
      onClick={(event) => {
        event.preventDefault()
      }}
      onToggle={(event) => {
        // this is to avoid event propagation
        // when details are nested, which is a bug
        // in react. Learn more here:
        // https://github.com/facebook/react/issues/22718
        event.stopPropagation()
      }}
      className={clx(
        'border-ui-border-base border-y border-solid border-x-0',
        'overflow-hidden [&>summary]:relative',
        props.className,
      )}
    >
      {summaryContent && (
        <DetailsSummary
          onClick={handleToggle}
          className="cursor-pointer"
          title={summaryContent}
        />
      )}
      {summaryElm &&
        cloneElement(summaryElm as React.ReactElement, {
          open,
          onClick: handleToggle,
        })}
      <CSSTransition
        unmountOnExit
        in={showContent}
        timeout={150}
        onEnter={(node: HTMLElement) => {
          node.classList.add(
            '!mb-2',
            '!mt-0',
            'translate-y-docs_1',
            'transition-transform',
          )
        }}
        onExit={(node: HTMLElement) => {
          node.classList.add('transition-transform', '!-translate-y-docs_1')
          setTimeout(() => {
            setOpen(false)
          }, 100)
        }}
      >
        <Suspense fallback={<Loading className="!mb-2 !mt-0" />}>
          {children}
        </Suspense>
      </CSSTransition>
    </details>
  )
}
