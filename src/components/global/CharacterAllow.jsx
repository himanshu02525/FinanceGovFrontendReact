import React from 'react'

export default function CharacterAllow({count, limit}) {
    return (
        <div className="d-flex justify-content-end">
            <small className={limit == count ? 'text-danger fw-bold' : 'text-muted'}>
                {count} / {limit} characters
            </small>
            
        </div>
    )
}

