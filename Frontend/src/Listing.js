import * as React from 'react'
//import { Link } from '@reach/router'
import classnames from 'classnames'

function Listing({ candidate }) {
  if (!candidate) {
    return null
  }

  const { candidate_id, image, first_name, last_name, candidate_info, candidate_desc } = candidate
  const columnClasses = classnames('column', 'col-4', 'col-xs-12')
  const cardClasses = classnames('card')

  return (
    <div className={columnClasses} style={{ margin: '1rem 0' }}>
      <div className={cardClasses}>
        <div className="card-image">
          {/* <img className="img-responsive" src={`/server/${image}`} alt={address} /> */}
        </div>
        <div className="card-header">
          <div className="card-title h5">{first_name} {last_name}</div>
          <div className="card-title h6">{candidate_info}</div>
          <div className="card-subtitle text-gray">{candidate_desc}</div>
        </div>
        {/* <div className="card-body">{description}</div> */}
        {/* <div className="card-footer">
          <Link className="btn btn-primary" to={`/details/${id}`}>
            Go to property
          </Link>
        </div> */}
      </div>
    </div>
  )
}

export default Listing