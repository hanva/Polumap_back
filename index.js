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
        .then(res => {
            response.send(res.data);
        })
        .catch(err => {
            console.log(err);
        });
});
exports.getSearch = functions.https.onRequest((request, response) => {
    //req.body.keyword
    let keyword = "bangalore";
    axios.get(`https://api.waqi.info/search/?token=${token}&keyword=${keyword}`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            response.send(res.data);
        })
        .catch(err => {
            console.log(err);
        });
});
exports.PolutionByCountry = functions.https.onRequest((request, response) => {
    let keyword = "FR";

    //req.body.country
    axios.get(`https://waqi.info/rtdata/ranking/index.json`)
        .then(res => {
            let data = res.data.cities;
            for (let i in data) {
                if (data[i].country === keyword) {
                    response.send(data[i].station.a)
                }
            }
        })
        .catch(err => {
            console.log(err);
        });
});
