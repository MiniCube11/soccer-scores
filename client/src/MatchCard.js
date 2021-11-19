import React from 'react'
import { MatchContext } from './App'
import './MatchCard.css'

function formatDate(dateString, status) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    let date = new Date(dateString)
    let currentDate = new Date()
    
    let hours = date.getHours()
    let zone = (hours < 12 ? 'AM' : 'PM')
    hours %= 12
    if (hours === 0) {
        hours = 12
    }
    let minute = date.getMinutes()
    minute = (minute < 10 ? '0' + minute : minute)
    if (status === 'FINISHED') {
        return 'FT'
    }
    if ((currentDate.getMonth() === date.getMonth()) && (currentDate.getDate() === date.getDate())) {
        if (status === 'LIVE') {
            return `LIVE`
        } else {
            return `Today, ${hours}:${minute} ${zone}`
        }
    } else {
        return `${months[date.getMonth()]} ${date.getDate()}, ${hours}:${minute} ${zone}`
    }
}

function MatchCard({ matchId }) {
    const data = React.useContext(MatchContext)
    const match = data.matches[matchId]
    const gameStatus = data.status
    const expandCard = data.expandCard
    const headToHead = data.matchData.head2head
    const matchData = data.matchData.match

    let symbol;
    if (gameStatus === 'LIVE' || gameStatus === 'FINISHED') {
        symbol = '-'
    } else if (gameStatus === 'SCHEDULED') {
        symbol = 'v'
    }
    const date = formatDate(match.utcDate, gameStatus)
    let width = 400, wins = 0, draws = 0, losses = 0, numMatches = 0
    if (headToHead !== undefined) {
        numMatches = headToHead.numberOfMatches
        wins = headToHead.homeTeam.wins / numMatches * width
        draws = headToHead.homeTeam.draws / numMatches * width
        losses = headToHead.homeTeam.losses / numMatches * width
    }

    return (
        <div className="card">
            <div className="card-container" onClick={() => expandCard.cardClicked(matchId)}>
                <div className="image-container">
                    <img src={`${match.competition.area.ensignUrl}`} alt=''/>
                </div>
                <div className="left">
                    <p>{match.homeTeam.name}</p>
                </div>
                <div className="center">
                    <div className="scores-container">
                        <p className="home-score">{match.score.fullTime.homeTeam}</p>
                        <p className="dash">{symbol}</p>
                        <p className="away-score">{match.score.fullTime.awayTeam}</p>
                    </div>
                </div>
                <div className="right">
                    <p>{match.awayTeam.name}</p>
                </div>
                <p className="date">{date}</p>
            </div>
            {(expandCard.expanded === matchId && matchData !== undefined) &&
                <div className="info">
                    <div className="info-left">
                        <p className="competition">{matchData.competition.name}</p>
                        <p className="matchday">Matchday {matchData.matchday}</p>
                        <div className="line"></div>
                        <p className="venue">Venue: {matchData.venue}</p>
                    </div>
                    <div className="stats-container">
                        <p>Head to Head Stats</p>
                        <div className="stats-wrapper">
                            <div className="stats home-stats" style={{width: wins}}>
                                <p className="home-stats-num">{headToHead.homeTeam.wins}</p>
                            </div>
                            <div className="stats draws-stats" style={{width: draws}}>
                                <p className="draws-stats-num">{headToHead.homeTeam.draws}</p>
                            </div>
                            <div className="stats away-stats" style={{width: losses}}>
                                <p className="away-stats-num">{headToHead.homeTeam.losses}</p>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default MatchCard
