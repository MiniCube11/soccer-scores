require('dotenv').config()
const express = require("express");
const axios = require("axios");

const PORT = process.env.PORT || 3001;

const app = express();

const AUTH_TOKEN = process.env.AUTH_TOKEN

async function getMatches(status) {
    const url = `http://api.football-data.org/v2/matches?status=${status}`;
    try {
        const response = await axios({
            url: url, 
            method: 'get',
            json: true,
            headers: {
                'X-Auth-Token': AUTH_TOKEN
            }
        })
        return response.data
    } catch(err) {
        console.error(err);
    }
}

async function getMatchData(id) {
    const url = `http://api.football-data.org/v2/matches/${id}`;
    try {
        const response = await axios({
            url: url, 
            method: 'get',
            json: true,
            headers: {
                'X-Auth-Token': AUTH_TOKEN
            }
        })
        return response.data
    } catch(err) {
        console.error(err);
    }
}

app.get("/matches/:status", (req, res) => {
    getMatches(req.params.status).then(resp => res.json(resp))
})

app.get("/match/:id", (req, res) => {
    getMatchData(req.params.id).then(resp => res.json(resp))
})

app.listen(PORT);