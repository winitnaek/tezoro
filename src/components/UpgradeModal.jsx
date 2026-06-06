import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap'

const premiumAssets = ['ETH', 'AVAX', 'DOGE', 'XRP', 'LTC']
const premiumFeatures = ['Historical Analytics', 'AI Intelligence', 'Future Premium Features']

function UpgradeModal({ isOpen, toggle }) {
  return (
    <Modal isOpen={isOpen} toggle={toggle} centered className="upgrade-modal">
      <ModalHeader toggle={toggle}>Unlock Premium Assets</ModalHeader>
      <ModalBody>
        <div className="upgrade-section">
          <div className="snapshot-label">Access</div>
          <div className="upgrade-list">
            {premiumAssets.map((asset) => (
              <div className="upgrade-list-item" key={asset}>
                <span aria-hidden="true">✓</span>
                <strong>{asset}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="upgrade-section">
          <div className="snapshot-label">Included</div>
          <div className="upgrade-list">
            {premiumFeatures.map((feature) => (
              <div className="upgrade-list-item" key={feature}>
                <span aria-hidden="true">✓</span>
                <strong>{feature}</strong>
              </div>
            ))}
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="warning" className="upgrade-learn-btn">
          Learn More
        </Button>
        <Button color="secondary" outline onClick={toggle}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default UpgradeModal
