import './BentoCard.css';

function BentoGrid({ children }) {
  return (
    <div className="bento-grid">
      {children}
    </div>
  );
}

export default BentoGrid;