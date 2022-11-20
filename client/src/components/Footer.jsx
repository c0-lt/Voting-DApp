function Link({ uri, text }) {
  return (
    <a href={uri} target="_blank" rel="noreferrer">
      {text}
    </a>
  );
}

function Footer() {
  return (
    <footer>
      <h2>More resources</h2>
      <Link uri={"https://soliditylang.org"} text={"Solidity"} />
    </footer>
  );
}

export default Footer;
