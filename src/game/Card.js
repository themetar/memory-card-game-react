import './Card.css';

export default function Card(props) {
  const {contents, enabled, clicked, wrong, won} = props;
  
  const cssClasses = "Card" +
                ((enabled && " enabled") || "") +
                ((!enabled && clicked && " selected") || "") +
                ((!enabled && wrong && " mistake") || "") +
                ((!enabled && won && " won") || "");
  return (
    <div className={cssClasses} onClick={props.onClick}>
      <img src={contents.src} alt={contents.title} />
      <h2>{contents.title}</h2>
    </div>
  );
}
