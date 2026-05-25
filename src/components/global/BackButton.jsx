import React from 'react'
import { useParams, useNavigate } from 'react-router-dom';

export default function BackButton(onBack) {
    const navigate = useNavigate();
    onBack = () => navigate(-1);
    return <button className="btn btn-sm btn-primary px-4 my-2" onClick={onBack}>
        Back
    </button>
}
