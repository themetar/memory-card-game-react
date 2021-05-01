export default function permutation(max) {
  const indices = new Array(max);
  for (let i = 0; i < max; i++) {
    indices[i] = i + 1; 
  }

  return () => {
    const r = Math.floor(Math.random() * indices.length);
    return indices.splice(r, 1)[0];
  };
}
