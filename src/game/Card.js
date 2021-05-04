import './Card.css';

export default function Card(props) {
  const {contents} = props;
  return (
    <div className="Card" onClick={props.onClick}>{contents}</div>
  );
}
