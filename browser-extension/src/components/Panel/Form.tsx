import { useEnterSubmit } from '@/utils/use-enter-submit'
import { UseChatHelpers } from 'ai/react'
import { useEffect, useRef } from 'react'
import Textarea from 'react-textarea-autosize'
import styled from 'styled-components'
import { Icons } from '../ui/icons'
export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

const StyledInput = styled(Textarea)`
  flex: 1;
  &:focus-within {
    outline: 1px solid orange;
  }
  border-radius: 12px;
  border: 1px solid orange;
  background-color: rgba(200, 200, 200, 0.2);
  resize: none;
  min-height: 40px;
  padding: 10px;
  color: white;
`

const StyledForm = styled.form`
  display: flex;
  justify-content: center;
  width: 100%;
  align-items: center;
  padding: 0px 10px;
`

const StyledButton = styled.button`
  margin-left: 10px;
  border-radius: 12px;
  height: 40px;
  width: 40px;
`
export const PromptForm = ({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) => {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <StyledForm
      onSubmit={async (e) => {
        e.preventDefault()

        if (!input?.trim()) {
          return
        }

        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <StyledInput
        ref={inputRef}
        tabIndex={0}
        onKeyDown={onKeyDown}
        rows={1}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Send a message."
        spellCheck={false}
      />

      <StyledButton type="submit" disabled={isLoading || input === ''}>
        <Icons.Elbow />
      </StyledButton>
    </StyledForm>
  )
}
