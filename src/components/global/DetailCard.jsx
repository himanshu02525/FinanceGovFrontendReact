import React from 'react';
import { ChevronLeft } from 'lucide-react';
import './DetailCard.css';

const DetailCard = ({
  title,
  subtitle,
  badge,
  date,
  onBack,
  actions,
  children,
}) => {
  return (
    <div className="detail-card">
      <div className="detail-card__header">
        <div className="detail-card__title-section">
          {onBack && (
            <button
              className="detail-card__back-btn"
              onClick={onBack}
              aria-label="Go back"
            >
              <ChevronLeft size={20} />
            </button>
          )}
          <div className="detail-card__titles">
            <h2 className="detail-card__title">{title}</h2>
            {subtitle && (
              <p className="detail-card__subtitle">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="detail-card__header-right">
          {badge && <div className="detail-card__badge">{badge}</div>}
          {date && (
            <small className="detail-card__date">{date}</small>
          )}
        </div>
      </div>

      {children && (
        <div className="detail-card__content">
          {children}
        </div>
      )}

      {actions && (
        <div className="detail-card__actions">
          {actions}
        </div>
      )}
    </div>
  );
};

export default DetailCard;
