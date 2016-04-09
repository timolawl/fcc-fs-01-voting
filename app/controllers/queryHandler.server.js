'use strict';

var CX = process.env.CX; // custom search engine id
var API_KEY = process.env.API_KEY; // google api key
var https = require('https'); // for processing the google search api call
var querystring = require('querystring'); // also a built in module

function queryHandler (db) {
    var queries = db.collection('queries');
    var queryProjection = { _id: false };

    this.getSearch = function (req, res) {
        var url, queryString, keywords, offset, offsetNumber, params, path, options;

        url = req.url.slice(17); // remove '/api/imagesearch/'
        queryString = url.match(/^.+(?=\?)/); // if match
        if (queryString) {
            queryString = queryString[0]; // assign value
            // offset likely exists:
            offset = url.match(/\?offset=(\d{1,2})$/);
            if (offset) { // if match
                offset = offset[0]; // assign value
                offsetNumber = offset.match(/\d{1,2}/)[0]; // get offset number
                if (offsetNumber < 1 || offsetNumber > 91) {
                    return res.json({ error: 'Invalid offset value. Choose a number between 1 and 91.' });
                }
            }
            else { // syntax error
                return res.json({ error: 'Invalid offset or syntax error' });
            }
        }
        else {
            queryString = url; // likely queryString without offset
            offsetNumber = 1;
        }

        // add the search to recents, remove anything past last 10 from db.
        queries.insert({ term: queryString.replace(/%20/g, ' '), when: new Date() }, function (err) {
            if (err) throw err;

            function checkCount () {
                queries.count(function (err, count) {
                    if (err) throw err;

                    if (count > 10) {
                        queries.findOneAndDelete({}, { sort: { when: 1 }}, function (err, doc) {
                            checkCount();
                        });
                    }
                });
            }
            checkCount();
        });

        params = {};
        params.q = queryString.replace(/%20/g, '+'); // search text
        params.num = 10; // number of search results to return (1 - 10 max)
        params.start = offsetNumber; // offset
        params.imgSize = 'medium'; // image size
        params.searchType = 'image'; // necessary
        params.key = API_KEY; // https://console.developers.google.com
        params.cx = CX; // https://cse.google.com/cse

        options = {
            host: 'www.googleapis.com',
            port: 443,
            path: '/customsearch/v1?' + (querystring.stringify(params)).replace(/%2B/g, '+'),
            method: 'GET'
        };

        function getGoogleResults (callback) {
            return https.get(options, function (response) {
                var body = '';
               // response.setEncoding('utf8');
                response.on('data', function (d) {
                    body += d;
                });
                response.on('end', function () {
                    var parsed = JSON.parse(body);
                    callback(parsed);
                });
            });
        }


        getGoogleResults (function (json) {
            var items = json.items.map(function (item, index, array) {
                return {
                    url: item.link,
                    snippet: item.snippet,
                    thumbnail: item.image.thumbnailLink,
                    context: item.image.contextLink
                }
            });
            res.json(items);
        });

    };

    this.getRecent = function (req, res) {
        queries.find({}, queryProjection).sort({ when: -1 }).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
    }

}

module.exports = queryHandler;
