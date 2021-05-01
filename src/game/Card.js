import './Card.css';

export default function Card(props) {
  const {contents} = props;
  return (
    <div className="Card" style={{order: props.order}} onClick={props.onClick}>{contents}</div>
  );
}
