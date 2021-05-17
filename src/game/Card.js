import './Card.css';

export default function Card(props) {
  const {contents} = props;
  return (
    <div className="Card" onClick={props.onClick}>
      <img src={contents.src} alt={contents.title} />
      <h2>{contents.title}</h2>
    </div>
  );
}
