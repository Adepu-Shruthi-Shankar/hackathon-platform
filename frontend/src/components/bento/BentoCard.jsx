import './BentoCard.css';

function BentoCard({ size = 'small', children, style }) {
  return (
    <div className={`bento-card bento-${size}`} style={style}>
      {children}
    </div>
  );
}

export default BentoCard;