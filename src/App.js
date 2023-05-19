import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [stocks, setStocks] = useState('');

  useEffect(() => {
    fetch(process.env.PUBLIC_URL + 'assets/stocks.json')
      .then(response => response.json())
      .then(data => {
        setData(data);
      })
      .catch((error) => {
        console.error('Error fetching data from API: ', error);
      });
  }, []);

  const navToggler = () => {
    document.querySelector('.header__icon').classList.toggle('header__icon--active');
    document.querySelector('.header__menu').classList.toggle('header__menu--expand');
  };

  const navLinks = (link) => {
    const links = document.getElementsByClassName('header__item');
    for (let index = 0; index < links.length; index++) {
      links[index].classList.remove('header__item--active');
    }
    links[link].classList.add('header__item--active');
  };

  const handleSearchInput = (event) => {
    const keyword = event.target.value.toLowerCase();
    const allstoks = document.getElementsByClassName('stocks__item');
    let currentStocksCount = 0;

    for (let index = 0; index < allstoks.length; index++) {
      const text = allstoks[index].innerText.toLowerCase();

      if (text.includes(keyword)) {
        allstoks[index].style.display = 'flex';
        currentStocksCount++;
      } else {
        allstoks[index].style.display = 'none';
      }
    }
    setStocks(currentStocksCount);
  };

  const wrapperAlignment = () => {
    const tileGroup = document.querySelector('.stocks__tile-group');
    if (!tileGroup.classList.contains('stocks__tile-group--alignment')) {
      tileGroup.classList.add('stocks__tile-group--alignment');
    }
  };

  const displayButtonGroup = (number) => {
    const allButtons = document.getElementsByClassName('stocks__btn-grp');
    if (window.innerWidth < 1024) {
      for (let index = 0; index < allButtons.length; index++) {
        allButtons[index].style.display = 'none';
      }
      allButtons[number].style.display = 'flex';
    }
  };

  const getStarted = () => {
    const firstStock = document.querySelector('.stocks__btn-grp');
    firstStock.style.display = 'flex';
    setTimeout(() => {
      firstStock.style.display = 'none';
    }, 1000);
  };

  const handleBuyClick = (index) => {
    wrapperAlignment();
    document.getElementsByClassName('stocks__tile')[index].style.display = 'flex';
    document.querySelector('.stocks__empty').style.display = 'none';
  };

  const handleSellClick = (index) => {
    const allTiles = document.getElementsByClassName('stocks__tile');
    wrapperAlignment();
    allTiles[index].classList.add('stocks__tile--sold');
    allTiles[index].style.display = 'flex';
    document.querySelector('.stocks__empty').style.display = 'none';
  };

  const handleRemoveClick = (index) => {
    const allTiles = document.getElementsByClassName('stocks__tile');
    const errorMessage = document.querySelector('.stocks__empty');
    allTiles[index].style.display = 'none';
    allTiles[index].classList.remove('stocks__tile--sold');

    let displayedTiles = 0;
    for (let index = 0; index < allTiles.length; index++) {
      if (allTiles[index].style.display === 'flex') {
        displayedTiles++;
      }
    }
    errorMessage.style.display = displayedTiles > 0 ? 'none' : 'flex';
  };

  const categoryTab = (category) => {
    const categories = document.getElementsByClassName('stocks__category');
    for (let index = 0; index < categories.length; index++) {
      categories[index].classList.remove('stocks__category--active');
    }
    categories[category].classList.add('stocks__category--active');
    document.querySelector('.stocks__empty-tab').textContent = categories[category].textContent;
  };


  return (
    <>
      <header className='header'>
        <div className='content-wrapper'>
          <div className='header__wrapper'>
            <img className='header__logo-mobile' src={process.env.PUBLIC_URL + 'assets/images/logo.png'} alt='Logo' />
            <div className='header__index'>
              <div>
                <span>Nifty 50</span>
                <span className='header__stock'>18398.85</span>
                <span className='header__percentage'>84.05 (0.46%)</span>
              </div>
              <div>
                <span>Nifty Bank</span>
                <span className='header__stock'>44072.10</span>
                <span className='header__percentage'>278.55 (0.64%)</span>
              </div>
            </div>
            <button className='header__icon' onClick={navToggler} />
            <nav className='header__menu'>
              <img className='header__logo' src={process.env.PUBLIC_URL + 'assets/images/logo.png'} alt='Logo' />
              <div className='header__list'>
                <button className='header__item' href=' ' onClick={() => navLinks(0)}>Dashboard</button>
                <button className='header__item header__item--active' href=' ' onClick={() => navLinks(1)}>Orders</button>
                <button className='header__item' href=' ' onClick={() => navLinks(2)}>Holdings</button>
                <button className='header__item' href=' ' onClick={() => navLinks(3)}>Positions</button>
                <button className='header__item' href=' ' onClick={() => navLinks(4)}>Funds</button>
                <button className='header__item' href=' ' onClick={() => navLinks(5)}>Apps</button>
                <div className='header__others'>
                  <img className='header__notification' src={process.env.PUBLIC_URL + 'assets/images/notification.png'} alt='Notifications' />
                  <div className='header__user'>KK</div>
                  <span className='header__model'>JFS022</span>
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>
      <section className='stocks' style={{ marginTop: document.querySelector('.header')?.offsetHeight }}>
        <div className='content-wrapper'>
          <div className='stocks__wrapper'>
            <div className='stocks__left'>
              <div className='stocks__search'>
                <svg className='stocks__search-icon' xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'>
                  <path
                    d='M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z' />
                </svg>
                <input className='stocks__search-box' type='search' onChange={handleSearchInput}
                  placeholder='Search eg: infy bse, nifty fut, nifty weekly, gold mcx' />
                <span className='stocks__count'>{!stocks ? data.length : stocks}/{data.length}</span>
              </div>
              <ul className='stocks__list'>
                {data.map((element, index) => {
                  const performance = (element.CLOSE - element.OPEN).toFixed(2);

                  return (
                    <li key={index} className={performance < 0 ? 'stocks__item stocks__item--negative' : 'stocks__item'}
                      onClick={() => displayButtonGroup(index)}>
                      <span className='stocks__content'>{element.SC_NAME}</span>
                      <div className='stocks__context'>
                        <span className='stocks__performance'>{performance}</span>
                        <span className='stocks__percentage'>
                          <span>{(performance / 100).toFixed(2)}</span>
                          <span className='stocks__arrow' />
                        </span>
                        <span className='stocks__final'>{element.LAST}</span>
                      </div>
                      <div className='stocks__btn-grp'>
                        <button className='stocks__btn-buy' title='Buy(B)' onClick={() => handleBuyClick(index)}>B</button>
                        <button className='stocks__btn-sell' title='Sell(S)' onClick={() => handleSellClick(index)}>S</button>
                        <button className='stocks__btn-remove' title='Remove(B)' onClick={() => handleRemoveClick(index)}>D</button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className='stocks__right'>
              <div className='stocks__categories'>
                <button className='stocks__category stocks__category--active' onClick={() => categoryTab(0)}>Orders</button>
                <button className='stocks__category' onClick={() => categoryTab(1)}>DTT</button>
                <button className='stocks__category' onClick={() => categoryTab(2)}>Baskets</button>
                <button className='stocks__category' onClick={() => categoryTab(3)}>SIP</button>
                <button className='stocks__category' onClick={() => categoryTab(4)}>Alerts</button>
                <button className='stocks__category' onClick={() => categoryTab(5)}>IPO</button>
                <button className='stocks__category' onClick={() => categoryTab(6)}>Auctions</button>
              </div>
              <div className='stocks__tile-group'>
                {data.map((element, index) => (
                  <div key={index} className='stocks__tile'>
                    <span><strong>Code: </strong>{element.SC_CODE}</span>
                    <span><strong>Name: </strong>{element.SC_NAME}</span>
                    <span><strong>Group: </strong>{element.SC_GROUP}</span>
                    <span><strong>Type: </strong>{element.SC_TYPE}</span>
                    <span><strong>Open: </strong>{element.OPEN}</span>
                    <span><strong>High: </strong>{element.HIGH}</span>
                    <span><strong>Low: </strong>{element.LOW}</span>
                    <span><strong>Close: </strong>{element.CLOSE}</span>
                    <span><strong>Last: </strong>{element.LAST}</span>
                    <span><strong>Previous Close: </strong>{element.PREVCLOSE}</span>
                    <span><strong>Number of Trades: </strong>{element.NO_TRADES}</span>
                    <span><strong>Number of Shares: </strong>{element.NO_OF_SHRS}</span>
                    <span><strong>Net Turnover: </strong>{element.NET_TURNOV}</span>
                  </div>
                ))}
              </div>
              <div className='stocks__empty'>
                <img className='stocks__empty-img' src={process.env.PUBLIC_URL + 'assets/images/order.png'} alt='No Orders' />
                <p className='stocks__empty-msg'>You haven't placed any <span className='stocks__empty-tab'>Orders</span> today</p>
                <button className='stocks__empty-btn' onClick={getStarted}>Get Started</button>
                <a className='stocks__empty-url' href=' '>
                  <span className='stocks__loader'></span>
                  <span>View History</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
