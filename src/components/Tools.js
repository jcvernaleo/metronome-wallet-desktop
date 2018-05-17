import { DarkLayout, Btn, Sp, Checkbox, TextInput, Flex } from './common'
import { validateMnemonic } from '../validator'
import ConfirmationWizard from './ConfirmationWizard'
import { withRouter } from 'react-router-dom'
import * as utils from '../utils'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import React from 'react'

const { ipcRenderer } = window.require('electron')

const Confirmation = styled.div`
  color: ${p => p.theme.colors.danger};
  background-color: ${p => p.theme.colors.darkShade};
  border-radius: 4px;
  padding: 0.8rem 1.6rem;
`
const ValidationMsg = styled.div`
  font-size: 1.4rem;
  margin-left: 1.6rem;
  opacity: 0.75;
`

class Tools extends React.Component {
  static propTypes = {
    history: PropTypes.shape({
      push: PropTypes.func.isRequired
    }).isRequired
  }

  state = {
    isDataCollectionAllowed: ipcRenderer.sendSync('settings-get', {
      key: 'app.dataCollection'
    }),
    mnemonic: null,
    errors: {}
  }

  onRescanTransactionsClick = e => {
    e.preventDefault()
    utils
      .sendToMainProcess('cache-clear')
      .then(console.log)
      .catch(console.warn)
  }

  validate = () => {
    const errors = validateMnemonic(utils.sanitizeMnemonic(this.state.mnemonic))
    const hasErrors = Object.keys(errors).length > 0
    if (hasErrors) this.setState({ errors })
    return !hasErrors
  }

  onInputChanged = e => {
    const { id, value } = e.target
    this.setState(state => ({
      ...state,
      [id]: value,
      errors: { ...state.errors, [id]: null }
    }))
  }

  onDataCollectionToggled = e => {
    const isDataCollectionAllowed = e.target.checked
    this.setState({ isDataCollectionAllowed }, () => {
      ipcRenderer.sendSync('settings-set', {
        key: 'app.dataCollection',
        value: isDataCollectionAllowed,
        restart: false
      })
    })
  }

  onWizardSubmit = password => {
    return utils
      .sendToMainProcess('create-wallet', {
        mnemonic: utils.sanitizeMnemonic(this.state.mnemonic),
        password
      })
      .then(() => this.props.history.push('/wallets'))
  }

  renderConfirmation = () => {
    return (
      <Confirmation data-testid="confirmation">
        <h3>Are you sure?</h3>
        <p>This operation will overwrite and restart the current wallet!</p>
      </Confirmation>
    )
  }

  renderForm = goToReview => {
    const { mnemonic, errors } = this.state
    const wordsAmount = utils.sanitizeMnemonic(mnemonic || '').split(' ').length

    return (
      <Sp mt={-2}>
        <h2>Recover a Wallet</h2>
        <form data-testid="recover-form" onSubmit={goToReview}>
          <p>
            Enter a valid twelve-word recovery phrase to recover another wallet.
          </p>
          <p>This action will replace your current stored seed!</p>
          <TextInput
            data-testid="mnemonic-field"
            autoFocus
            onChange={this.onInputChanged}
            label="Recovery phrase"
            error={errors.mnemonic}
            value={mnemonic || ''}
            rows={2}
            id="mnemonic"
          />
          <Sp mt={4}>
            <Flex.Row align="center">
              <Btn disabled={wordsAmount !== 12} submit>
                Recover
              </Btn>
              {wordsAmount !== 12 && (
                <ValidationMsg>
                  A recovery phrase must have exactly 12 words
                </ValidationMsg>
              )}
            </Flex.Row>
          </Sp>
        </form>
        <Sp mt={5}>
          <hr />
          <h2>Rescan Transactions List</h2>
          <p>
            This will clear your local cache and rescan all your wallet
            transactions.
          </p>
          <Btn onClick={this.onRescanTransactionsClick}>
            Rescan Transactions
          </Btn>
        </Sp>
        <Sp mt={5}>
          <hr />
          <h2>Data collection</h2>
          <Checkbox
            data-testid="allow-data-collection"
            onChange={this.onDataCollectionToggled}
            checked={this.state.isDataCollectionAllowed}
            label="Allow anonymous data collection"
          >
            This only includes information about your platform type, application
            version and geolocation. No wallet information or keys will be
            collected.
          </Checkbox>
        </Sp>
      </Sp>
    )
  }

  render() {
    return (
      <DarkLayout title="Tools" data-testid="tools-container">
        <Sp py={4} px={6}>
          <ConfirmationWizard
            renderConfirmation={this.renderConfirmation}
            confirmationTitle=""
            onWizardSubmit={this.onWizardSubmit}
            pendingTitle="Recovering..."
            successText="Wallet successfully recovered"
            renderForm={this.renderForm}
            validate={this.validate}
            noCancel
            styles={{
              confirmation: {
                padding: 0
              },
              btns: {
                background: 'none',
                marginTop: '3.2rem',
                maxWidth: '200px',
                padding: 0
              }
            }}
          />
        </Sp>
      </DarkLayout>
    )
  }
}

export default withRouter(Tools)
