import { Button, ButtonGroup } from 'reactstrap'

function ViewModeSelector({ viewMode, onSelectViewMode }) {
  return (
    <div className="view-mode-selector" aria-label="View mode selector">
      <span className="view-mode-label">View Mode</span>
      <ButtonGroup className="view-mode-buttons" role="group" aria-label="Dashboard view mode">
        <Button
          className={`view-mode-btn ${viewMode === 'overview' ? 'view-mode-btn-active' : ''}`}
          color="light"
          outline={viewMode !== 'overview'}
          active={viewMode === 'overview'}
          aria-pressed={viewMode === 'overview'}
          onClick={() => onSelectViewMode('overview')}
        >
          Overview
        </Button>
        <Button
          className={`view-mode-btn ${viewMode === 'pro' ? 'view-mode-btn-active' : ''}`}
          color="light"
          outline={viewMode !== 'pro'}
          active={viewMode === 'pro'}
          aria-pressed={viewMode === 'pro'}
          onClick={() => onSelectViewMode('pro')}
        >
          Pro Analysis
        </Button>
      </ButtonGroup>
    </div>
  )
}

export default ViewModeSelector
