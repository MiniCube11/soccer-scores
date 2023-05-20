import React from 'react';
import './App.css';
import CategoryButton from './CategoryButton';
import Footer from './Footer';
import LoadingScreen from './LoadingScreen';
import MatchCard from './MatchCard'
import NoMatches from './NoMatches';

export const MatchContext = React.createContext()

export default function App() {
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
        })
    }
  }, [matchRequests])

  return (
    <div className="App">
      <h1>Soccer Scores</h1>
      <div className="buttons">
        <CategoryButton category={"LIVE"} changeStatus={changeStatus} gameStatus={gameStatus}/>
        <CategoryButton category={"FINISHED"} changeStatus={changeStatus} gameStatus={gameStatus}/>
        <CategoryButton category={"SCHEDULED"} changeStatus={changeStatus} gameStatus={gameStatus}/>
      </div>
      <div>
        {matches[0] === 1 ?
          <LoadingScreen />
          : [(matches[0] === undefined ?
            <NoMatches />
            :
              <MatchContext.Provider value={{matches: matches, status: gameStatus, expandCard: expandCard, matchData: currentMatchData}}>
                {Object.keys(matches).map((matchId) => (
                  <MatchCard key={matchId} matchId={matchId} />
                ))}
            </MatchContext.Provider>
          )]
        }
      </div>
      <Footer />
    </div>
  );
}
