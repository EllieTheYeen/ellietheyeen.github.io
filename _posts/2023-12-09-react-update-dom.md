---
layout: post
title: React update DOM
date: 2023-12-09 23:15
tags:
- javascript
- react
- html
---
Recently I decided to look into the React framework and how it actually works. It is quite interesting that it has ways to update the DOM without reloading the page. This makes switching pages incredibly fast once you have loaded up the app.

I managed to make a thing that updated a counter after a lot of tries. It was quite confusing as there was many ways to change the DOM but in general you had to do something that would update some state such as using `ReactUseState` that returns a value and a function to update that value. There was also a bunch of other things like refs to refer to other things.

`App.js`
```jsx
import './App.css';
import React from 'react';
import { Link } from 'react-router-dom';

export default function App() {
  const [count, setCount] = React.useState(0);

  function click() {
    setCount(count + 1);
  }

  return (
    <>
    <div className="App">
      <header className="App-header">
        <h2>{count}</h2>
        <button onClick={click}>Change</button>
        <Link to="/test">react link</Link>
        <a href="/test">a href</a>
      </header>
    </div>
    </>
  );
};
```

One interesting thing is that just use the `Link` element that is part of `react-router-dom` and you could switch between the different routes that you define and using the back and forward button also works here due to the usage of the JavaScript API `history.pushState` and I added some normal links too to test and they were way slower as they had to reload the page.

`index.js`
```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ToggleGroup from './Test';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={App} />
      <Route exact path="/test" component={ToggleGroup} />
    </Switch>
  </BrowserRouter>
);
```

I also found something named `styled-components` that is used to make inline CSS easier and made this below which is a page as each page is a component here and changed some example I found a bit that highlighted buttons.

`Test.js`
```jsx
import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const Button = styled.button`
  /* Same as above */
`;
const ButtonToggle = styled(Button)`
  opacity: 0.6;
  ${({ active }) =>
        active &&
        `
    opacity: 1;
  `}
`;
const ButtonGroup = styled.div`
  display: flex;
`;
const types = ['Mew', 'Meow'];
function App() {
    const [active, setActive] = useState(types[0]);
    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <ButtonGroup>
                        {types.map(type => (
                            <ButtonToggle
                                key={type}
                                active={active === type}
                                onClick={() => setActive(type)}
                            >
                                {type}
                            </ButtonToggle>
                        ))}
                    </ButtonGroup>
                    <p><Link to="/">react link</Link></p>
                    <p><a href="/">a href</a></p>
                </div>
            </header>
        </div>
    );
}

export default App
```

React is quite interesting generally as it is interesting to see how different JavaScript frameworks are made. I am unsure if I will use this in general tho as I am mostly helping a friend with it and also checking out different JavaScript libraries. Next time I will probably check out [D3](https://d3js.org/)
