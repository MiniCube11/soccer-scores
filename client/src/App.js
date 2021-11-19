import React from 'react';
import './App.css';
import MatchCard from './MatchCard'

export const MatchContext = React.createContext()

export default function App() {
  const headers = {'X-Auth-Token': process.env.REACT_APP_FOOTBALL_API_KEY}
  const [gameStatus, setStatus] = React.useState('LIVE')
  const [matches, setMatches] = React.useState([1])
  const [expanded, setExpanded] = React.useState(-1)
  const [matchRequests, setRequests] = React.useState(0)
  const [currentMatchData, setMatchData] = React.useState({})
  const [matchInfo, setMatchInfo] = React.useState({})

  const expandCard = {
    expanded: expanded,
    cardClicked: (id) => {
      if (expanded === id) {
        setExpanded(-1)
      } else {
        setExpanded(id)
        let reqId = matches[id].id
        if (matchInfo[reqId] === undefined) {
          setMatchData({})
          setRequests(x => x+1)
        } else {
          setMatchData(matchInfo[reqId])
        }
      }
    }
  }

  const changeStatus = (status) => {
    setStatus(status)
    setMatches([1])
    setExpanded(-1)
  }

  React.useEffect(() => {
    fetch(`/matches/${gameStatus}`)
      .then((res) => res.json())
      .then((data) => {
        setMatches(data.matches)
      });
  }, [gameStatus]);

  React.useEffect(() => {
    if (matches[0] !== undefined && matches[0] !== 1) {
      fetch(`/match/${matches[expanded].id}`)
        .then((res) => res.json())
        .then((data) => {
          setMatchData(data)
          setMatchInfo(m => ({
            ...m,
            [matches[expanded].id]: data
          }))
          console.log(data)
        })
    }
  }, [matchRequests])

  return (
    <div className="App">
      <h1>Football Scores</h1>
      <div className="buttons">
        <button key="btn2" onClick={() => changeStatus('LIVE')} className={`${gameStatus === 'LIVE' ? 'selected-btn' : 'normal-btn'}`}>LIVE</button>
        <button key="btn1" onClick={() => changeStatus('FINISHED')} className={`${gameStatus === 'FINISHED' ? 'selected-btn' : 'normal-btn'}`}>FINISHED</button>
        <button key="btn3" onClick={() => changeStatus('SCHEDULED')} className={`${gameStatus === 'SCHEDULED' ? 'selected-btn' : 'normal-btn'}`}>SCHEDULED</button>
      </div>
      <div>
        {matches[0] === 1 ?
          <>
            <h2 className="message">Loading...</h2>
            <p className="message">If you're seeing this loading screen for a long time, please try again in a few minutes. We may have ran out of available API calls.</p>
          </>
          : [(matches[0] === undefined ?
            <h2 className="message">There are no matches in this category.</h2>
            :
              <MatchContext.Provider value={{matches: matches, status: gameStatus, expandCard: expandCard, matchData: currentMatchData}}>
              {Object.keys(matches).map((matchId) => (
                <MatchCard key={matchId} matchId={matchId} />
              ))}
            </MatchContext.Provider>
          )]
        }
      </div>
      <div className="footer">
        <p>Built with <a href="https://reactjs.org/">React</a></p>
        <p>Football data provided by the <a href="https://www.football-data.org/">Football-Data.org API</a></p>
      </div>
    </div>
  );
}
