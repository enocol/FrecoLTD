import { Link } from 'react-router-dom'

// Shared wrapper for the policy / legal pages so they stay visually consistent.
export default function LegalPage({ title, intro, updated, children }) {
  return (
    <div className="container section">
      <h1 className="page-title">{title}</h1>
      {intro && <p className="page-subtitle">{intro}</p>}
      {updated && <p className="legal__updated">Last updated: {updated}</p>}

      <div className="legal panel">{children}</div>

      <p className="legal__foot">
        Can’t find what you need?{' '}
        <Link to="/contact">Contact our team</Link> and we’ll help.
      </p>
    </div>
  )
}
