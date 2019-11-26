const express = require('express');
const cors = require('cors');
const app = express();
const functions = require('firebase-functions');
const axios = require('axios');
let token = "0cb8487d4ca260206f4b572292084e8c82d5c48f";
var admin = require("firebase-admin");
admin.initializeApp();

// Automatically allow cross-origin requests
app.use(cors({origin: true}));
app.get('/getMapBounds', (req, response) => {
    //let latlng = "39.379436,116.091230,40.235643,116.784382";
    let latlng = req.query.latlng;
    axios.get(`https://api.waqi.info/map/bounds/?token=${token}&latlng=${latlng}`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            return response.send(res.data);
        })
        .catch(err => {
            return console.log(err);
        });
});
app.get('/getSearch', (req, response) => {
    //let keyword = "bangalore";
    let keyword = req.query.keyword;
    axios.get(`https://api.waqi.info/search/?token=${token}&keyword=${keyword}`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            return response.send(res.data);
        })
        .catch(err => {
            return console.log(err);
        });
});
app.get('/PolutionByCountry', (req, response) => {
//    let keyword = "FR";
    let keyword = req.query.keyword;
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
app.get('/getStationInfo', (req, response) => {
    let keyword = "@" + req.query.keyword;
    axios.get(`https://api.waqi.info/feed/${keyword}/?token=${token}`)
    // eslint-disable-next-line promise/always-return
        .then(res => {
            storeStationInfo()
            return response.send(res.data);
        })
        .catch(err => {
            return console.log(err);
        });
});

var minutes = 5, the_interval = minutes * 60 * 1000;
setInterval(function () {
    storeStationInfo()
}, the_interval);

function storeStationInfo() {
    let arr = [5722, 1437];
    var db = admin.database();
    var ref = db.ref("/");
    for (let i in arr) {
        let stationRef = ref.child("station" + arr[i]);

        axios.get(`https://api.waqi.info/feed/@${arr[i]}/?token=${token}`)
        // eslint-disable-next-line promise/always-return
            .then(res => {
                    stationRef.limitToLast(1).once('value').then(function (snapshot) {
                        if (snapshot.child(Object.keys(snapshot.val())) === undefined || snapshot.child(Object.keys(snapshot.val()) + "/time").val().toString() !== res.data.data.time.s.toString()) {
                            stationRef.push({
                                "idx": res.data.data.idx,
                                "time": res.data.data.time.s,
                                "data": res.data.data.iaqi
                            });
                        }
                        return "done";
                    }).catch(err => {
                        return console.log(err);
                    });
                    return 'done';
                }
            )
            .catch(err => {
                return console.log(err);
            });
    }
}

app.get('/getStationHistory', (req, response) => {
    let ref = admin.database().ref("station" + req.query.id);
    ref.on("value", function (snapshot) {
        let data = [];
        for (let key in snapshot.val()) {
            data.push(snapshot.val()[key]);
        }
        return response.send(data);
    });
});

// Expose Express API as a single Cloud Function:
exports.api = functions.https.onRequest(app);
