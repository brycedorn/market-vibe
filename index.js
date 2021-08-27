import { render, h } from 'preact';
import htm from 'htm';
import { useState, useEffect } from 'preact/hooks';

const emoji = ["😖","☹️","🙁","😐","🙂","😄","🤤"];

function getEmoji(change) {
  if (change < -5) {
    return emoji[0];
  } else if (change < -3) {
    return emoji[1];
  } else if (change < -0.5) {
    return emoji[2];
  } else if (change >= -0.5 && change <= 0.5) {
    return emoji[3];
  } else if (change > 0.5) {
    return emoji[4];
  } else if (change > 3) {
    return emoji[5];
  } else if (change > 5) {
    return emoji[5];
  }
}

function getColor(change, opacityOverride) {
  const positive = change >= 0;
  const opacity = Math.abs(change * 20) / 100;
  return `rgba(${positive ? 0 : 255}, ${positive ? 255 : 0}, 0, ${opacityOverride || opacity})`;
}

function getContainerStyle(change) {
  return {
    width: '100%',
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: getColor(change),
    fontFamily: 'sans-serif'
  }
};

function getEmojiStyle() {
  return {
    fontSize: '12em',
    cursor: 'default',
    margin: 0
  }
}

function getTextStyle(change) {
  return { 
    borderRadius: '40px',
    background: 'white',
    cursor: 'default',
    padding: '30px 20px 20px 20px',
    color: getColor(change),
    fontSize: '4em'
  }
}

function App (props) {
  const [change, setChange] = useState(0);
  
  useEffect(() => {
    fetch(`https://finnhub.io/api/v1/quote?symbol=SPY&token=${process.env.TOKEN}`)
      .then(res => res.json())
      .then(data => setChange(data.dp.toFixed(2)));
  }, []);

  useEffect(() => {
    document.title = `Market is ${getEmoji(change)} today.`
  }, [change])
  
  return (
    <div style={getContainerStyle(change)}>
      <h1 style={getEmojiStyle()}>{getEmoji(change)}</h1>
      <h2 style={getTextStyle(change)}>{change >= 0 ? "+" : ""}{change}%</h2>
    </div>
  );
}

render(htm.bind(h)`<${App} />`, document.body);
