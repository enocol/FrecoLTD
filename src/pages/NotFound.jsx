import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="container section empty">
      <h1 className="page-title">Page not found</h1>
      <p>Sorry, we couldn’t find the page you were looking for.</p>
      <Link to="/" className="btn btn--primary btn--lg">
        Back to home
      </Link>
    </div>
  )
}
