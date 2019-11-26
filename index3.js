const functions = require('firebase-functions');
const axios = require('axios');

let token = "0cb8487d4ca260206f4b572292084e8c82d5c48f"
// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions
const https = require('https');

exports.getMapBounds = functions.https.onRequest((request, response) => {
    //req.body.ce que tu veux
    let latlng = "39.379436,116.091230,40.235643,116.784382";
    axios.get(`https://api.waqi.info/map/bounds/?token=${token}&latlng=${latlng}`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            return response.send(res.data);
        })
        .catch(err => {
            return console.log(err);
        });
});
exports.getSearch = functions.https.onRequest((request, response) => {
    //req.body.keyword
    let keyword = "bangalore";
    axios.get(`https://api.waqi.info/search/?token=${token}&keyword=${keyword}`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            return response.send(res.data);
        })
        .catch(err => {
            return console.log(err);
        });
});

exports.PolutionByCountry = functions.https.onRequest((request, response) => {
    let keyword = "FR";
    //req.body.country
    axios.get(`https://waqi.info/rtdata/ranking/index.json`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            let result = false;
            for (let i in res.data.cities) {
                if (res.data.cities[i].country === keyword) {
                    result = res.data.cities[i].station.a
                }
            }
            return response.send(result);
        })
        .catch(err => {
             throw new Error(err)
        });
});
