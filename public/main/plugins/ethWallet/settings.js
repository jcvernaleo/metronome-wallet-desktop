'use strict'

const logger = require('electron-log')
const settings = require('electron-settings')

const toLowerCase = str => str.toLowerCase()

function getWalletAddresses (walletId) {
  const addressesPath = `user.wallets.${walletId}.addresses`
  return Object.keys(settings.get(addressesPath)).map(toLowerCase)
}

function setAddressBalance ({ walletId, address, balance }) {
  const _address = address.toLowerCase()
  const addressPath = `user.wallets.${walletId}.addresses.${_address}.balance`
  settings.set(addressPath, balance)
  logger.debug('ETH balance updated', { address, balance })
}

function getAddressBalance ({ walletId, address }) {
  const _address = address.toLowerCase()
  const addressPath = `user.wallets.${walletId}.addresses.${_address}.balance`
  return settings.get(addressPath)
}

function findWalletId (address) {
  const _address = address.toLowerCase()
  const walletIds = Object.keys(settings.get('user.wallets'))
  return walletIds.find(walletId =>
    getWalletAddresses(walletId).includes(_address)
  )
}

function getWallet (walletId) {
  return settings.get(`user.wallets.${walletId}`)
}

function getWalletAddressIndex ({ walletId, address }) {
  const wallet = getWallet(walletId)
  return wallet.addresses[address.toLowerCase()].index
}

function isAddressInWallet ({ walletId, address }) {
  const addresses = getWalletAddresses(walletId)
  return addresses.includes(address.toLowerCase())
}

function getTracerApiUrl () {
  return settings.get('app.tracerApiUrl')
}

function setWalletEncryptedSeed ({ walletId, encryptedSeed }) {
  settings.set(`user.wallets.${walletId}.encryptedSeed`, encryptedSeed)
  logger.debug('Updated wallet seed', { walletId })
}

function getWebsocketApiUrl () {
  return settings.get('app.node.websocketApiUrl')
}

function getJsonRpcApiUrl () {
  return settings.get('app.node.jsonRpcApiUrl')
}

module.exports = {
  findWalletId,
  getAddressBalance,
  getJsonRpcApiUrl,
  getTracerApiUrl,
  getWallet,
  getWalletAddresses,
  getWalletAddressIndex,
  getWebsocketApiUrl,
  isAddressInWallet,
  setAddressBalance,
  setWalletEncryptedSeed
}
