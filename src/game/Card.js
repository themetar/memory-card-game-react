import './Card.css';

export default function Card(props) {
  const {contents, enabled} = props;
  return (
    <div className={"Card " + ((enabled && "enabled") || "")} onClick={props.onClick}>
      <img src={contents.src} alt={contents.title} />
      <h2>{contents.title}</h2>
    </div>
  );
}
