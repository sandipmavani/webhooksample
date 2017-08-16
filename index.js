'use strict';

const express = require('express');
const bodyParser = require('body-parser');
var request = require('request');


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;
            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
                if(requestBody.result.actionIncomplete == false)
                {
                    var clarity = requestBody.result.parameters.clarity;
                    var color = requestBody.result.parameters.color;
                    var shape = requestBody.result.parameters.shape;
                    var carat = requestBody.result.parameters.carat;
                    console.log(clarity);
                    console.log(color);
                    console.log(shape);
                    console.log(carat);

                     if(shape == "Asscher")
                        shape = "A";
                     if(shape == "Cushion")
                        shape = "C";
                     if(shape == "Emerald")
                        shape = "E";
                     if(shape == "Heart")
                        shape = "H";
                     if(shape == "Marquise")
                        shape = "M";
                     if(shape == "Oval")
                        shape = "O";
                     if(shape == "Pear")
                        shape = "P";
                     if(shape == "Round")
                        shape = "R";
                     if(shape == "Princess")
                        shape = "X";
                     if(shape == "Radiant")
                        shape = "Z";

                if(clarity == "IF")
                     clarity = "0"
                if(clarity == "VVS1")
                    clarity = "1"
                if(clarity == "VVS2")
                    clarity = "2"
                if(clarity == "VS1")
                    clarity = "3"
                if(clarity == "VS2")
                    clarity = "4"
                if(clarity == "SI1")
                    clarity = "5"
                if(clarity == "SI2")
                    clarity = "6"

                    var requestify = require('requestify');
                    var url = 'https://data.washingtondiamond.com/store/calcjs.php?f=getprice&shape='+shape+'&carat='+carat+'&color='+color+'&clarity='+clarity;
                    console.log(url);
                    requestify.get(url)
                        .then(function(response) {
                                // Get the response body (JSON parsed or jQuery object for XMLs)
                                console.log(response.getBody());

                            var price = JSON.parse(response.getBody());
                            console.log(price);
                            speech += 'and \nPrice of Diamond Is :$ ' + price.data + ' Approx';
                            console.log('result: ', speech);

                            return res.json({
                                speech: speech,
                                displayText: speech,
                                source: 'apiai-webhook-sample'
                            });
                            }
                        );
                }
                else
                {
                    console.log('result: ', speech);

                    return res.json({
                        speech: speech,
                        displayText: speech,
                        source: 'apiai-webhook-sample'
                    });
                }
            }
        }


    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});