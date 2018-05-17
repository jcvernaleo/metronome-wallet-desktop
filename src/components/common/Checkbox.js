import PropTypes from 'prop-types'
import styled from 'styled-components'
import React from 'react'

const Container = styled.label`
  cursor: pointer;
  display: block;
`

const Input = styled.input`
  vertical-align: middle;
  margin: 0;
  font-size: 16px;
  line-height: 1.5;
  margin-right: 12px;
`

const Label = styled.span`
  vertical-align: middle;
`

const Description = styled.div`
  font-size: 1.2rem;
  opacity: 0.5;
  margin-top: 0.4rem;
  margin-left: 26px;
`

export default class Checkbox extends React.Component {
  static propTypes = {
    children: PropTypes.node,
    label: PropTypes.string.isRequired
  }

  render() {
    const { label, children, ...other } = this.props

    return (
      <Container>
        <Input type="checkbox" {...other} />
        <Label>{label}</Label>
        {children && <Description>{children}</Description>}
      </Container>
    )
  }
}
