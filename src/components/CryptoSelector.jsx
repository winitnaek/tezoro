import { Button, ButtonGroup } from 'reactstrap'

const cryptoSymbols = ['BTC', 'ETH', 'AVAX', 'DOGE', 'XRP', 'LTC']
const premiumSymbols = ['ETH', 'AVAX', 'DOGE', 'XRP', 'LTC']

function CryptoSelector({ selectedCrypto, onSelectCrypto, onPremiumAssetClick, premiumFeatureEnabled = false }) {
  return (
    <div className="crypto-selector-wrap">
      <ButtonGroup className="flex-wrap" role="group" aria-label="Crypto selector">
        {cryptoSymbols.map((symbol) => {
          const isSelected = selectedCrypto === symbol
          const isPremium = premiumFeatureEnabled && premiumSymbols.includes(symbol)
          const selectedColor = symbol === 'BTC' ? 'warning' : 'info'

          return (
            <Button
              key={symbol}
              className={`crypto-selector-btn ${isPremium ? 'crypto-selector-premium' : ''}`}
              color={isSelected ? selectedColor : 'light'}
              outline={!isSelected}
              active={isSelected}
              onClick={() => {
                if (isPremium) {
                  onPremiumAssetClick?.(symbol)
                  return
                }

                onSelectCrypto(symbol)
              }}
            >
              {isPremium && (
                <span className="crypto-lock-icon" aria-label="Premium asset">
                  🔒
                </span>
              )}
              {symbol}
            </Button>
          )
        })}
      </ButtonGroup>
    </div>
  )
}

export default CryptoSelector

