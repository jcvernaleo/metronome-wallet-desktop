import metronome from 'metronomejs'
import settings from '../config/settings'
import Web3 from 'web3'

const mtn = metronome.getInstance(
  new Web3.providers.WebsocketProvider(settings.MTN_PUBLIC_NODE_URL)
)
mtn.web3 = new Web3(
  new Web3.providers.WebsocketProvider(settings.MTN_PUBLIC_NODE_URL)
)

mtn.mtntoken.options.address = settings.MTN_TOKEN_ADDR
mtn.auctions.options.address = settings.MTN_AUCTION_ADDR

export default mtn
