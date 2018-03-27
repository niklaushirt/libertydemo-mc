/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

var express = require('express'),
    app = express(),
    server = require('http').createServer(app),
    fs = require('fs'),
    bluemix = require('./config/bluemix'),
    watson = require('watson-developer-cloud'),
    extend = require('util')._extend,
    UAparser = require('ua-parser-js'),
    userAgentParser = new UAparser();

//---Deployment Tracker---------------------------------------------------------
require("cf-deployment-tracker-client").track();

// setup express
require('./config/express')(app);


// -----------------------------
// SETUP WATSON SERVICES
// -----------------------------
var QA_CREDENTIALS = {
    username: 'qa username',
    password: 'qa password',
    version: 'v1',
    dataset: 'healthcare'
};

var STT_CREDENTIALS = {
    username: '3630d2f1-597d-43d1-b6be-50b21c8f3702',
    password: 'Ff7tBWQlAx5T',
    version: 'v1'
};

// setup watson services
var question_and_answer_healthcare = watson.question_and_answer(QA_CREDENTIALS);
var speechToText = watson.speech_to_text(STT_CREDENTIALS);


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// BASE API
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// render index page
app.get('/', function (req, res) {
    res.render('index');
});

// render index page
app.get('/tos', function (req, res) {
    res.render('tos');
});



// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// TRADE API
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -----------------------------
// GET TRADE DILEMMA
// -----------------------------
app.get('/getWatsonDilemma', function (req, res) {

    var actGain = req.query.gain;

    var actDilemma = '{ "subject": "Crops", "columns": [ { "key": "Quantity", "full_name": "Quantity", "type": "NUMERIC", "is_objective": true, "goal": "MAX", "range": { "ValueRange": { "low": 40000.0, "high": 2000000.0 } } }, { "key": "YTD", "full_name": "YTD", "type": "NUMERIC" }, { "key": "Buy", "full_name": "Buy at", "type": "NUMERIC", "is_objective": true, "goal": "MIN", "range": { "ValueRange": { "low": 0.0, "high": 22.0 } } }, { "key": "Sell", "full_name": "Sell", "type": "NUMERIC" }, { "key": "Gain", "full_name": "Gain on Sell", "type": "NUMERIC", "is_objective": true, "goal": "MAX", "range": { "ValueRange": { "low": -999.0, "high": 200.0 } } }, { "key": "Quality Rating", "full_name": "Quality Rating", "type": "NUMERIC", "is_objective": true, "goal": "MAX", "range": { "ValueRange": { "low": 4.0, "high": 6.0 } } }, { "key": "Long Term (1 month)", "full_name": "Long Term (1 month)", "type": "NUMERIC" }, { "key": "Risk", "full_name": "Geopolitical Risk", "type": "NUMERIC", "is_objective": true, "goal": "MIN", "range": { "ValueRange": { "low": 0.0, "high": 1.0 } } }, { "key": "Risk Delivery", "full_name": "Risk Delivery", "type": "NUMERIC" }, { "key": "Manager Tenure", "full_name": "Manager Tenure", "type": "NUMERIC" } ], "options": [ { "key": "1", "name": "OSPHX", "values": { "YTD": 12.69, "Buy": 18.09, "Sell": 24.55, "Gain": 6.46, "Long Term (1 month)": 12.81, "Risk Delivery": 0.77, "Quality Rating": 4.5, "Manager Tenure": 5, "Quantity": 49863.63, "Risk": 0.3 }, "description_html": "Select NA Crops", "app_data": {} }, { "key": "2", "name": "OSAIX", "values": { "YTD": 10.52, "Buy": 19.57, "Sell": 21.83, "Gain": 5.0, "Long Term (1 month)": 13.06, "Risk Delivery": 0.87, "Quality Rating": 4, "Manager Tenure": 2, "Quantity": 29426.31, "Risk": 0.6 }, "description_html": "My Crops", "app_data": {} }, { "key": "3", "name": "OPHAX", "values": { "YTD": 11.78, "Buy": 12.3, "Sell": 23.49, "Gain": 11.19, "Long Term (1 month)": 12.61, "Risk Delivery": 0.82, "Quality Rating": 2, "Manager Tenure": 1, "Quantity": 45659.58, "Risk": 1.8 }, "description_html": "Swiss Crops SA", "app_data": {} }, { "key": "4", "name": "OBMPX", "values": { "YTD": 0.34, "Buy": 19.6, "Sell": 25.16, "Gain": 6.0, "Long Term (1 month)": 20.77, "Risk Delivery": 0.81, "Quality Rating": 4.5, "Manager Tenure": 1, "Quantity": 86235.91, "Risk": 1.17 }, "description_html": "My Crops Inc", "app_data": {} }, { "key": "5", "name": "OSRPX", "values": { "YTD": 3.85, "Buy": 18.07, "Sell": 18.92, "Gain": 3.0, "Long Term (1 month)": 12.41, "Risk Delivery": 0.83, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 12855.24, "Risk": 0.99 }, "description_html": "Select Retailing Portfolio", "app_data": {} }, { "key": "6", "name": "OSCSX", "values": { "YTD": 0.13, "Buy": 28.58, "Sell": 29.79, "Gain": 2.0, "Long Term (1 month)": 13.19, "Risk Delivery": 0.79, "Quality Rating": 5, "Manager Tenure": 5, "Quantity": 43149.56, "Risk": 1.15 }, "description_html": "Select Software and Computer Services Portfolio", "app_data": {} }, { "key": "7", "name": "OSRFX", "values": { "YTD": 12.36, "Buy": 17.28, "Sell": 18.55, "Gain": 5.0, "Long Term (1 month)": 13.39, "Risk Delivery": 0.85, "Quality Rating": 4, "Manager Tenure": 2, "Quantity": 33598.17, "Risk": 1.06 }, "description_html": "Select Transportation Portfolio", "app_data": {} }, { "key": "8", "name": "OSHOX", "values": { "YTD": 1.5, "Buy": 6.42, "Sell": 18.2, "Gain": 5.0, "Long Term (1 month)": 9.33, "Risk Delivery": 0.81, "Quality Rating": 2, "Manager Tenure": 2, "Quantity": 55335.79, "Risk": 1.25 }, "description_html": "Select Construction and Housing Portfolio", "app_data": {} }, { "key": "9", "name": "OSVLX", "values": { "YTD": 1.33, "Buy": 13.85, "Sell": 17.89, "Gain": 5.0, "Long Term (1 month)": 5.56, "Risk Delivery": 0.85, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 23182.3, "Risk": 0.98 }, "description_html": "Select Consumer Finance Portfolio", "app_data": {} }, { "key": "10", "name": "OBSOX", "values": { "YTD": 3.11, "Buy": 22.98, "Sell": 17.85, "Gain": 7.0, "Long Term (1 month)": 13.16, "Risk Delivery": 0.84, "Quality Rating": 5, "Manager Tenure": 5, "Quantity": 111193.62, "Risk": 1.23 }, "description_html": "Select IT Services Portfolio", "app_data": {} }, { "key": "11", "name": "OSDAX", "values": { "YTD": 1.46, "Buy": 26.87, "Sell": 17.61, "Gain": 8.0, "Long Term (1 month)": 12.63, "Risk Delivery": 0.81, "Quality Rating": 4, "Manager Tenure": 2, "Quantity": 12897.41, "Risk": 0.95 }, "description_html": "Select Defense and Aerospace Portfolio", "app_data": {} }, { "key": "12", "name": "OSCPX", "values": { "YTD": 0.42, "Buy": 19.5, "Sell": 17.14, "Gain": -2.0, "Long Term (1 month)": 8.78, "Risk Delivery": 0.82, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 22885.83, "Risk": 1.09 }, "description_html": "Select Consumer Discretionary Portfolio", "app_data": {} }, { "key": "13", "name": "OLCSX", "values": { "YTD": 5.67, "Buy": 22.93, "Sell": 17.07, "Gain": -15.0, "Long Term (1 month)": 8.88, "Risk Delivery": 0.85, "Quality Rating": 4, "Manager Tenure": 9, "Quantity": 212950.25, "Risk": 1.13 }, "description_html": "OpenWealth Large Cap Stock Fund", "app_data": {} }, { "key": "14", "name": "OSPCX", "values": { "YTD": 2.41, "Buy": 18.68, "Sell": 16.45, "Gain": 4.0, "Long Term (1 month)": 5.24, "Risk Delivery": 0.83, "Quality Rating": 4, "Manager Tenure": 0, "Quantity": 16410.67, "Risk": 1.12 }, "description_html": "Select Insurance Portfolio", "app_data": {} }, { "key": "15", "name": "OSCHX", "values": { "YTD": 6.55, "Buy": 25.98, "Sell": 16.41, "Gain": 3.0, "Long Term (1 month)": 15.86, "Risk Delivery": 0.81, "Quality Rating": 5, "Manager Tenure": 4, "Quantity": 11651.79, "Risk": 1.38 }, "description_html": "Select Chemicals Portfolio", "app_data": {} }, { "key": "16", "name": "ODLSX", "values": { "YTD": 0.76, "Buy": 20.77, "Sell": 16.3, "Gain": 2.0, "Long Term (1 month)": 11.18, "Risk Delivery": 0.82, "Quality Rating": 3, "Manager Tenure": 0, "Quantity": 44539.66, "Risk": 1.13 }, "description_html": "Select Leisure Portfolio", "app_data": {} }, { "key": "17", "name": "OGRIX", "values": { "YTD": 5.27, "Buy": 18.5, "Sell": 16.08, "Gain": 1.1, "Long Term (1 month)": 3.76, "Risk Delivery": 0.69, "Quality Rating": 3, "Manager Tenure": 3, "Quantity": 33669.27, "Risk": 1.02 }, "description_html": "OpenWealth Growth & Income Portfolio", "app_data": {} }, { "key": "18", "name": "OLCEX", "values": { "YTD": 5.22, "Buy": 21.55, "Sell": 15.92, "Risk Delivery": 0.46, "Quality Rating": 4, "Manager Tenure": 7, "Quantity": 11485.36, "Risk": 0.98 }, "description_html": "OpenWealth Large Cap Core Enhanced Index Fund", "app_data": {} }, { "key": "19", "name": "ONCMX", "values": { "YTD": 3.95, "Buy": 24.07, "Sell": 15.65, "Gain": 0.1, "Long Term (1 month)": 8.7, "Risk Delivery": 0.29, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 11826.93, "Risk": 1 }, "description_html": "OpenWealth Nasdaq Composite Index Fund", "app_data": {} }, { "key": "20", "name": "ODCAX", "values": { "YTD": 2.1, "Buy": 19.78, "Sell": 15.57, "Gain": 3.1, "Long Term (1 month)": 8.28, "Risk Delivery": 0.79, "Quality Rating": 3, "Manager Tenure": 9, "Quantity": 15876.06, "Risk": 1.03 }, "description_html": "OpenWealth Capital Appreciation Fund", "app_data": {} }, { "key": "21", "name": "OMILX", "values": { "YTD": 5.44, "Buy": 22.38, "Sell": 15.56, "Gain": 1.4, "Long Term (1 month)": 10.35, "Risk Delivery": 0.91, "Quality Rating": 5, "Manager Tenure": 8, "Quantity": 163654.53, "Risk": 0.95 }, "description_html": "OpenWealth New Millennium Fund", "app_data": {} }, { "key": "22", "name": "OSUTX", "values": { "YTD": 16.09, "Buy": 26.83, "Sell": 15.53, "Gain": 1.2, "Long Term (1 month)": 10.91, "Risk Delivery": 0.82, "Quality Rating": 4, "Manager Tenure": 8, "Quantity": 17924.64, "Risk": 0.31 }, "description_html": "Select Utilities Portfolio", "app_data": {} }, { "key": "23", "name": "OSMVX", "values": { "YTD": 6.96, "Buy": 22.74, "Sell": 15.09, "Gain": -11.1, "Long Term (1 month)": 10.26, "Risk Delivery": 0.8, "Quality Rating": 4, "Manager Tenure": 1, "Quantity": 11558.99, "Risk": 1.06 }, "description_html": "OpenWealth Mid Cap Value Fund", "app_data": {} }, { "key": "24", "name": "OUSEX", "values": { "YTD": 5.8, "Buy": 20.33, "Sell": 15.04, "Gain": 1.21, "Long Term (1 month)": 7.7, "Risk Delivery": 0.1, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 15922.78, "Risk": 1 }, "description_html": "Spartan 500 Index Fund - Investor Class", "app_data": {} }, { "key": "25", "name": "OSRBX", "values": { "YTD": 2.06, "Buy": 19.83, "Sell": 14.97, "Gain": 1.51, "Long Term (1 month)": 1.63, "Risk Delivery": 0.81, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 11696.38, "Risk": 1.21 }, "description_html": "Select Banking Portfolio", "app_data": {} }, { "key": "26", "name": "OMEIX", "values": { "YTD": 5.35, "Buy": 24.48, "Sell": 14.96, "Risk Delivery": 0.62, "Quality Rating": 5, "Manager Tenure": 6, "Quantity": 12296.42, "Risk": 1.02 }, "description_html": "OpenWealth Mid Cap Enhanced Index Fund", "app_data": {} }, { "key": "27", "name": "ODVLX", "values": { "YTD": 7.44, "Buy": 22.39, "Sell": 14.82, "Gain": 4.1, "Long Term (1 month)": 9.28, "Risk Delivery": 0.67, "Quality Rating": 3, "Manager Tenure": 4, "Quantity": 17842.85, "Risk": 1.08 }, "description_html": "OpenWealth Value Fund", "app_data": {} }, { "key": "28", "name": "OJSCX", "values": { "YTD": 2.16, "Buy": 9.9, "Sell": 14.77, "Gain": 2.13, "Long Term (1 month)": 2.9, "Risk Delivery": 1.01, "Quality Rating": 3, "Manager Tenure": 0, "Quantity": 14448.68, "Risk": 1.26 }, "description_html": "OpenWealth Japan Smaller Companies Fund", "app_data": {} }, { "key": "29", "name": "OSTMX", "values": { "YTD": 5.42, "Buy": 20.25, "Sell": 14.71, "Gain": 1.1123, "Long Term (1 month)": 8.28, "Risk Delivery": 0.1, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 11735.05, "Risk": 1 }, "description_html": "Spartan Total Market Index Fund - Investor Class", "app_data": {} }, { "key": "30", "name": "OSLVX", "values": { "YTD": 8.2, "Buy": 20.04, "Sell": 14.52, "Gain": 1.1, "Long Term (1 month)": 6.69, "Risk Delivery": 0.72, "Quality Rating": 3, "Manager Tenure": 3, "Quantity": 16600.63, "Risk": 1.01 }, "description_html": "OpenWealth Stock Selector Large Cap Value Fund", "app_data": {} }, { "key": "31", "name": "OCYIX", "values": { "YTD": 3.07, "Buy": 23.42, "Sell": 14.51, "Gain": 2.1, "Long Term (1 month)": 12.52, "Risk Delivery": 0.81, "Quality Rating": 3, "Manager Tenure": 7, "Quantity": 11478.96, "Risk": 1.22 }, "description_html": "Select Industrials Portfolio", "app_data": {} }, { "key": "32", "name": "OIUIX", "values": { "YTD": 11.33, "Buy": 24.27, "Sell": 14.4, "Gain": 1.1, "Long Term (1 month)": 10.54, "Risk Delivery": 0.76, "Quality Rating": 4, "Manager Tenure": 9, "Quantity": 71995.26, "Risk": 0.41 }, "description_html": "OpenWealth Telecom and Utilities Fund", "app_data": {} }, { "key": "33", "name": "OCNTX", "values": { "YTD": 2.6, "Buy": 20.62, "Sell": 14.39, "Gain": 1.1, "Long Term (1 month)": 9.99, "Risk Delivery": 0.67, "Quality Rating": 4, "Manager Tenure": 24, "Quantity": 75259.3, "Risk": 0.96 }, "description_html": "OpenWealth Contrafund", "app_data": {} }, { "key": "34", "name": "OTQGX", "values": { "YTD": 3.55, "Buy": 22.75, "Sell": 14.32, "Gain": 1.1, "Long Term (1 month)": 11.13, "Risk Delivery": 0.91, "Quality Rating": 4, "Manager Tenure": 7, "Quantity": 11974.68, "Risk": 1.04 }, "description_html": "OpenWealth Focused Stock Fund", "app_data": {} }, { "key": "35", "name": "ODFAX", "values": { "YTD": 5.85, "Buy": 14.14, "Sell": 14.11, "Gain": 1.1, "Long Term (1 month)": 11.54, "Risk Delivery": 0.79, "Quality Rating": 3, "Manager Tenure": 10, "Quantity": 13419.5, "Risk": 0.72 }, "description_html": "Select Consumer Staples Portfolio", "app_data": {} }, { "key": "36", "name": "OLPSX", "values": { "YTD": 3.36, "Buy": 18.86, "Sell": 14.03, "Gain": 1.1, "Long Term (1 month)": 10.5, "Risk Delivery": 0.8, "Quality Rating": 4, "Manager Tenure": 3, "Quantity": 31060.89, "Risk": 0.77 }, "description_html": "OpenWealth Low-Priced Stock Fund", "app_data": {} }, { "key": "37", "name": "OMCSX", "values": { "YTD": 5.18, "Buy": 22.92, "Sell": 13.95, "Gain": 1.1, "Long Term (1 month)": 9.8, "Risk Delivery": 0.66, "Quality Rating": 4, "Manager Tenure": 3, "Quantity": 16044.25, "Risk": 0.87 }, "description_html": "OpenWealth Mid-Cap Stock Fund", "app_data": {} }, { "key": "38", "name": "OCPEX", "values": { "YTD": 0.09, "Buy": 18.18, "Sell": 13.58, "Risk Delivery": 0.73, "Quality Rating": 3, "Manager Tenure": 6, "Quantity": 21403.61, "Risk": 1.01 }, "description_html": "OpenWealth Small Cap Enhanced Index Fund", "app_data": {} }, { "key": "39", "name": "OSEMX", "values": { "YTD": 3.87, "Buy": 20.1, "Sell": 13.28, "Gain": 1.1, "Long Term (1 month)": 10.19, "Risk Delivery": 0.1, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 11810.05, "Risk": 1 }, "description_html": "Spartan Extended Market Index Fund - Investor Class", "app_data": {} }, { "key": "40", "name": "ONORX", "values": { "YTD": 8.58, "Buy": 11.07, "Sell": 13.25, "Gain": 1.1, "Long Term (1 month)": 12.49, "Risk Delivery": 1.04, "Manager Tenure": 3, "Quantity": 23629.18, "Risk": 0.91 }, "description_html": "OpenWealth Nordic Fund", "app_data": {} }, { "key": "41", "name": "OSSMX", "values": { "YTD": 5.12, "Buy": 18.53, "Sell": 13, "Gain": 1.1, "Long Term (1 month)": 7.86, "Risk Delivery": 0.72, "Manager Tenure": 3, "Quantity": 22232.33, "Risk": 0.94 }, "description_html": "OpenWealth Stock Selector Mid Cap Fund", "app_data": {} }, { "key": "42", "name": "OSLBX", "values": { "YTD": 3.33, "Buy": 13, "Sell": 12.81, "Gain": 1.1, "Long Term (1 month)": 8.01, "Risk Delivery": 1.42, "Quality Rating": 3, "Manager Tenure": 1, "Quantity": 21634.91, "Risk": 1.54 }, "description_html": "Select Brokerage and Investment Management Portfolio", "app_data": {} }, { "key": "43", "name": "OSLSX", "values": { "YTD": 4.47, "Buy": 17.72, "Sell": 12.28, "Gain": 1.1, "Long Term (1 month)": 8, "Risk Delivery": 0.73, "Quality Rating": 2, "Manager Tenure": 4, "Quantity": 20734.19, "Risk": 1.12 }, "description_html": "OpenWealth Value Strategies Fund", "app_data": {} }, { "key": "9999", "name": "OBIOX", "values": { "YTD": 8.24, "Buy": 19.74, "Sell": 27.22, "Gain": 7.48, "Long Term (1 month)": 30.08, "Risk Delivery": 0.76, "Quality Rating": 4.5, "Manager Tenure": 9, "Quantity": 65111.66, "Risk": 0.14 }, "description_html": "Intl. Seeds and Crops", "app_data": {} }, { "key": "44", "name": "OSDIX", "values": { "YTD": 8.12, "Buy": 13.58, "Sell": 11.98, "Gain": 1.1, "Long Term (1 month)": 7.68, "Risk Delivery": 0.77, "Quality Rating": 4, "Manager Tenure": 10, "Quantity": 12680.88, "Risk": 0.69 }, "description_html": "OpenWealth Strategic Dividend & Income Fund", "app_data": {} }, { "key": "45", "name": "OIDSX", "values": { "YTD": 1.78, "Buy": 15.52, "Sell": 11.58, "Gain": 1.1, "Long Term (1 month)": 0.98, "Risk Delivery": 0.86, "Quality Rating": 2, "Manager Tenure": 1, "Quantity": 21184.9, "Risk": 1.39 }, "description_html": "Select Financial Services Portfolio", "app_data": {} }, { "key": "46", "name": "OSCOX", "values": { "YTD": 5.59, "Buy": 20.18, "Sell": 11.26, "Risk Delivery": 1.39, "Quality Rating": 4, "Manager Tenure": 6, "Quantity": 13627.54, "Risk": 0.86 }, "description_html": "OpenWealth International Small Cap Opportunities Fund", "app_data": {} }, { "key": "47", "name": "OWWFX", "values": { "YTD": 2.36, "Buy": 19.29, "Sell": 11.16, "Gain": 1.1, "Long Term (1 month)": 8.86, "Risk Delivery": 1.11, "Quality Rating": 4, "Manager Tenure": 7, "Quantity": 9613.41, "Risk": 1.01 }, "description_html": "OpenWealth Worldwide Fund", "app_data": {} }, { "key": "48", "name": "OWRLX", "values": { "YTD": 1.64, "Buy": 22.28, "Sell": 10.96, "Gain": 1.1, "Long Term (1 month)": 10.5, "Risk Delivery": 0.88, "Quality Rating": 4, "Manager Tenure": 1, "Quantity": 16288.78, "Risk": 0.78 }, "description_html": "Select Wireless Portfolio", "app_data": {} }, { "key": "49", "name": "ODCPX", "values": { "YTD": 4.57, "Buy": 15.98, "Sell": 10.86, "Gain": 1.1, "Long Term (1 month)": 9.07, "Risk Delivery": 0.82, "Quality Rating": 3, "Manager Tenure": 1, "Quantity": 13639.63, "Risk": 1.29 }, "description_html": "Select Computers Portfolio", "app_data": {} }, { "key": "50", "name": "OSELX", "values": { "YTD": 22.95, "Buy": 15.45, "Sell": 10.85, "Gain": 1.1, "Long Term (1 month)": 6.18, "Risk Delivery": 0.82, "Quality Rating": 2, "Manager Tenure": 1, "Quantity": 12556.31, "Risk": 1.26 }, "description_html": "Select Electronics Portfolio", "app_data": {} }, { "key": "51", "name": "OCPGX", "values": { "YTD": 1.61, "Buy": 16.71, "Sell": 10.81, "Risk Delivery": 0.9, "Quality Rating": 3, "Manager Tenure": 3, "Quantity": 15103.16, "Risk": 0.96 }, "description_html": "OpenWealth Small Cap Growth Fund", "app_data": {} }, { "key": "52", "name": "OBALX", "values": { "YTD": 4.96, "Buy": 15.46, "Sell": 10.75, "Gain": 1.1, "Long Term (1 month)": 7.92, "Risk Delivery": 0.58, "Quality Rating": 4, "Manager Tenure": 6, "Quantity": 18801.71, "Risk": 0.67 }, "description_html": "OpenWealth Balanced Fund", "app_data": {} }, { "key": "53", "name": "OPURX", "values": { "YTD": 4.99, "Buy": 15.77, "Sell": 10.54, "Gain": 1.1, "Long Term (1 month)": 7.38, "Risk Delivery": 0.58, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 17853.44, "Risk": 0.69 }, "description_html": "OpenWealth Puritan Fund", "app_data": {} }, { "key": "54", "name": "OSPTX", "values": { "YTD": 5.24, "Buy": 23.87, "Sell": 10.34, "Gain": 1.1, "Long Term (1 month)": 8.84, "Risk Delivery": 0.8, "Quality Rating": 3, "Manager Tenure": 7, "Quantity": 12294.66, "Risk": 1.15 }, "description_html": "Select Technology Portfolio", "app_data": {} }, { "key": "55", "name": "ODEGX", "values": { "YTD": 4.42, "Buy": 22.42, "Sell": 10.31, "Gain": 1.1, "Long Term (1 month)": 6.6, "Risk Delivery": 0.71, "Quality Rating": 2, "Manager Tenure": 1, "Quantity": 11662.79, "Risk": 1.07 }, "description_html": "OpenWealth Growth Strategies Fund", "app_data": {} }, { "key": "56", "name": "ORESX", "values": { "YTD": 15.41, "Buy": 9.59, "Sell": 9.93, "Gain": 1.1, "Long Term (1 month)": 9.73, "Risk Delivery": 0.81, "Quality Rating": 4, "Manager Tenure": 16, "Quantity": 13937.46, "Risk": 0.97 }, "description_html": "OpenWealth Real Estate Investment Portfolio", "app_data": {} }, { "key": "57", "name": "ORIFX", "values": { "YTD": 8.44, "Buy": 6.9, "Sell": 9.83, "Gain": 1.1, "Long Term (1 month)": 7.46, "Risk Delivery": 0.84, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 22660.6, "Risk": 0.35 }, "description_html": "OpenWealth Real Estate Income Fund", "app_data": {} }, { "key": "58", "name": "OIREX", "values": { "YTD": 6.19, "Buy": 12.44, "Sell": 9.77, "Risk Delivery": 1.16, "Quality Rating": 3, "Manager Tenure": 4, "Quantity": 21338.37, "Risk": 1.07 }, "description_html": "OpenWealth International Real Estate Fund", "app_data": {} }, { "key": "59", "name": "OSDPX", "values": { "YTD": 5.39, "Buy": 18.84, "Sell": 9.61, "Gain": 1.1, "Long Term (1 month)": 13.82, "Risk Delivery": 0.82, "Quality Rating": 4, "Manager Tenure": 6, "Quantity": 11274.76, "Risk": 1.41 }, "description_html": "Select Materials Portfolio", "app_data": {} }, { "key": "60", "name": "OOSFX", "values": { "YTD": 3.33, "Buy": 21.17, "Sell": 9.29, "Gain": 1.1, "Long Term (1 month)": 6.68, "Risk Delivery": 1.09, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 13038.65, "Risk": 1.09 }, "description_html": "OpenWealth Overseas Fund", "app_data": {} }, { "key": "61", "name": "OCVSX", "values": { "YTD": 6.04, "Buy": 15.14, "Sell": 9.15, "Gain": 1.1, "Long Term (1 month)": 8.47, "Risk Delivery": 0.73, "Quality Rating": 3, "Manager Tenure": 9, "Quantity": 12278.86, "Risk": 1.24 }, "description_html": "OpenWealth Convertible Securities Fund", "app_data": {} }, { "key": "62", "name": "OIVFX", "values": { "YTD": 3.04, "Buy": 16.35, "Sell": 9.15, "Gain": 1.1, "Long Term (1 month)": 6.45, "Risk Delivery": 1.17, "Quality Rating": 3, "Manager Tenure": 6, "Quantity": 18037.91, "Risk": 1.06 }, "description_html": "OpenWealth International Capital Appreciation Fund", "app_data": {} }, { "key": "63", "name": "OISMX", "values": { "YTD": 1.61, "Buy": 19.77, "Sell": 8.83, "Gain": 1.1, "Long Term (1 month)": 10.46, "Risk Delivery": 1.33, "Quality Rating": 3, "Manager Tenure": 0, "Quantity": 19291.56, "Risk": 0.94 }, "description_html": "OpenWealth International Small Cap Fund", "app_data": {} }, { "key": "64", "name": "OIEUX", "values": { "YTD": 4.32, "Buy": 21.21, "Sell": 8.8, "Gain": 1.1, "Long Term (1 month)": 9.14, "Risk Delivery": 1.06, "Quality Rating": 3, "Manager Tenure": 1, "Quantity": 17546.63, "Risk": 0.99 }, "description_html": "OpenWealth Europe Fund", "app_data": {} }, { "key": "65", "name": "OPBFX", "values": { "YTD": 3.51, "Buy": 13.43, "Sell": 8.67, "Gain": 1.1, "Long Term (1 month)": 10.19, "Risk Delivery": 1.23, "Quality Rating": 4, "Manager Tenure": 1, "Quantity": 17213.07, "Risk": 1.05 }, "description_html": "OpenWealth Pacific Basin Fund", "app_data": {} }, { "key": "66", "name": "OSTCX", "values": { "YTD": 2.02, "Buy": 15.37, "Sell": 8.62, "Gain": 1.1, "Long Term (1 month)": 8.37, "Risk Delivery": 0.85, "Quality Rating": 3, "Manager Tenure": 1, "Quantity": 14016.38, "Risk": 0.7 }, "description_html": "Select Telecommunications Portfolio", "app_data": {} }, { "key": "67", "name": "ONMIX", "values": { "YTD": 9.24, "Buy": 5.22, "Sell": 8.38, "Gain": 1.1, "Long Term (1 month)": 10.35, "Risk Delivery": 0.86, "Quality Rating": 4, "Manager Tenure": 19, "Quantity": 14796.72, "Risk": 0.98 }, "description_html": "OpenWealth New Markets Income Fund", "app_data": {} }, { "key": "68", "name": "OIGFX", "values": { "YTD": 1.07, "Buy": 15.64, "Sell": 8.24, "Risk Delivery": 1.13, "Quality Rating": 5, "Manager Tenure": 7, "Quantity": 15356.11, "Risk": 0.93 }, "description_html": "OpenWealth International Growth Fund", "app_data": {} }, { "key": "69", "name": "OSNGX", "values": { "YTD": 19.98, "Buy": 10.85, "Sell": 8.06, "Gain": 1.1, "Long Term (1 month)": 10.65, "Risk Delivery": 0.84, "Quality Rating": 3, "Manager Tenure": 1, "Quantity": 13145.7, "Risk": 1.31 }, "description_html": "Select Natural Gas Portfolio", "app_data": {} }, { "key": "70", "name": "OLBIX", "values": { "YTD": 11.15, "Buy": 2.47, "Sell": 7.89, "Risk Delivery": 0.2, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 22221.69, "Risk": 1.02 }, "description_html": "Spartan Long-Term Treasury Bond Index Fund - Investor Class", "app_data": {} }, { "key": "71", "name": "ODIVX", "values": { "YTD": 2.17, "Buy": 18.67, "Sell": 7.66, "Gain": 1.1, "Long Term (1 month)": 7.19, "Risk Delivery": 0.95, "Quality Rating": 4, "Manager Tenure": 13, "Quantity": 15053.34, "Risk": 0.98 }, "description_html": "OpenWealth Diversified International Fund", "app_data": {} }, { "key": "72", "name": "OSPHIX", "values": { "YTD": 4.05, "Buy": 6.6, "Sell": 7.62, "Gain": 1.1, "Long Term (1 month)": 8.3, "Risk Delivery": 0.72, "Quality Rating": 4, "Manager Tenure": 14, "Quantity": 16417.52, "Risk": 1.05 }, "description_html": "OpenWealth High Income Fund", "app_data": {} }, { "key": "73", "name": "OIGRX", "values": { "YTD": 0.42, "Buy": 15.55, "Sell": 7.44, "Gain": 1.1, "Long Term (1 month)": 7.82, "Risk Delivery": 1, "Quality Rating": 4, "Manager Tenure": 10, "Quantity": 18208.49, "Risk": 0.98 }, "description_html": "OpenWealth International Discovery Fund", "app_data": {} }, { "key": "74", "name": "OAGIX", "values": { "YTD": 6.27, "Buy": 10.05, "Sell": 7.41, "Gain": 1.1, "Long Term (1 month)": 9.83, "Risk Delivery": 0.73, "Quality Rating": 5, "Manager Tenure": 11, "Quantity": 10548.92, "Risk": 1.23 }, "description_html": "OpenWealth Capital & Income Fund", "app_data": {} }, { "key": "75", "name": "OSIIX", "values": { "YTD": 4.38, "Buy": 18.73, "Sell": 7.31, "Gain": 1.1, "Long Term (1 month)": 7.12, "Risk Delivery": 0.2, "Quality Rating": 4, "Manager Tenure": 11, "Quantity": 12777.67, "Risk": 0.99 }, "description_html": "Spartan International Index Fund - Investor Class", "app_data": {} }, { "key": "76", "name": "OGBLX", "values": { "YTD": 3.35, "Buy": 13.5, "Sell": 6.94, "Gain": 1.1, "Long Term (1 month)": 8.1, "Risk Delivery": 1.02, "Quality Rating": 3, "Manager Tenure": 8, "Quantity": 11601.31, "Risk": 0.63 }, "description_html": "OpenWealth Global Balanced Fund", "app_data": {} }, { "key": "77", "name": "OCTFX", "values": { "YTD": 5.94, "Buy": 1.1, "Sell": 6.69, "Gain": 1.1, "Long Term (1 month)": 4.97, "Risk Delivery": 0.46, "Quality Rating": 3, "Manager Tenure": 8, "Quantity": 11678.49, "Risk": 1.05 }, "description_html": "OpenWealth California Municipal Income Fund", "app_data": {} }, { "key": "78", "name": "OCBFX", "values": { "YTD": 5.6, "Buy": 1.91, "Sell": 6.52, "Risk Delivery": 0.45, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 12642.72, "Risk": 1.05 }, "description_html": "OpenWealth Corporate Bond Fund", "app_data": {} }, { "key": "79", "name": "OTABX", "values": { "YTD": 6.42, "Buy": 1.68, "Sell": 6.21, "Gain": 1.1, "Long Term (1 month)": 5.21, "Risk Delivery": 0.47, "Quality Rating": 4, "Manager Tenure": 5, "Quantity": 12420.15, "Risk": 0.96 }, "description_html": "OpenWealth Tax-Free Bond Fund", "app_data": {} }, { "key": "80", "name": "OSENX", "values": { "YTD": 13.87, "Buy": 21.9, "Sell": 6.02, "Gain": 1.1, "Long Term (1 month)": 13.08, "Risk Delivery": 0.8, "Quality Rating": 4, "Manager Tenure": 8, "Quantity": 12573.01, "Risk": 1.58 }, "description_html": "Select Energy Portfolio", "app_data": {} }, { "key": "81", "name": "OHIGX", "values": { "YTD": 6.34, "Buy": 1.48, "Sell": 6.01, "Gain": 1.1, "Long Term (1 month)": 4.98, "Risk Delivery": 0.46, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 15561.61, "Risk": 1.06 }, "description_html": "OpenWealth Municipal Income Fund", "app_data": {} }, { "key": "82", "name": "OJPNX", "values": { "YTD": 1.66, "Buy": 6.44, "Sell": 5.94, "Gain": 1.1, "Long Term (1 month)": 2.48, "Risk Delivery": 0.93, "Quality Rating": 2, "Manager Tenure": 0, "Quantity": 32428.13, "Risk": 1.01 }, "description_html": "OpenWealth Japan Fund", "app_data": {} }, { "key": "83", "name": "OPXTX", "values": { "YTD": 5.46, "Buy": 1.36, "Sell": 5.43, "Gain": 1.1, "Long Term (1 month)": 4.7, "Risk Delivery": 0.49, "Quality Rating": 4, "Manager Tenure": 12, "Quantity": 22428.05, "Risk": 1.01 }, "description_html": "OpenWealth Pennsylvania Municipal Income Fund", "app_data": {} }, { "key": "84", "name": "OTIEX", "values": { "YTD": 1.95, "Buy": 13.19, "Sell": 5.43, "Risk Delivery": 1.09, "Quality Rating": 4, "Manager Tenure": 7, "Quantity": 13345.66, "Risk": 0.95 }, "description_html": "OpenWealth Total International Equity Fund", "app_data": {} }, { "key": "85", "name": "ONJHX", "values": { "YTD": 5.58, "Buy": 2.77, "Sell": 5.39, "Gain": 1.1, "Long Term (1 month)": 4.67, "Risk Delivery": 0.47, "Quality Rating": 3, "Manager Tenure": 5, "Quantity": 15946.3, "Risk": 1.04 }, "description_html": "OpenWealth New Jersey Municipal Income Fund", "app_data": {} }, { "key": "86", "name": "ODMMX", "values": { "YTD": 5.63, "Buy": 2.81, "Sell": 5.31, "Gain": 1.1, "Long Term (1 month)": 4.79, "Risk Delivery": 0.46, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 12091.08, "Risk": 1.12 }, "description_html": "OpenWealth Massachusetts Municipal Income Fund", "app_data": {} }, { "key": "87", "name": "OOHFX", "values": { "YTD": 5.92, "Buy": 1.48, "Sell": 5.31, "Gain": 1.1, "Long Term (1 month)": 4.77, "Risk Delivery": 0.48, "Quality Rating": 4, "Manager Tenure": 8, "Quantity": 27563.85, "Risk": 1.06 }, "description_html": "OpenWealth Ohio Municipal Income Fund", "app_data": {} }, { "key": "88", "name": "OSICX", "values": { "YTD": 5.33, "Buy": 5.14, "Sell": 5.28, "Gain": 3.1, "Long Term (1 month)": 7.49, "Risk Delivery": 0.69, "Quality Rating": 4, "Manager Tenure": 3, "Quantity": 298661.23, "Risk": 0.65 }, "description_html": "OpenWealth Strategic Income Fund", "app_data": {} }, { "key": "89", "name": "OTFMX", "values": { "YTD": 5.53, "Buy": 1.08, "Sell": 5.07, "Gain": 1.1, "Long Term (1 month)": 4.7, "Risk Delivery": 0.46, "Quality Rating": 4, "Manager Tenure": 12, "Quantity": 21655.96, "Risk": 1.05 }, "description_html": "OpenWealth New York Municipal Income Fund", "app_data": {} }, { "key": "90", "name": "OMHTX", "values": { "YTD": 5.1, "Buy": 2.18, "Sell": 4.78, "Gain": 0.4, "Long Term (1 month)": 4.49, "Risk Delivery": 0.48, "Quality Rating": 4, "Manager Tenure": 8, "Quantity": 55545.88, "Risk": 0.91 }, "description_html": "OpenWealth Michigan Municipal Income Fund", "app_data": {} }, { "key": "91", "name": "OTBFX", "values": { "YTD": 3.84, "Buy": 1.46, "Sell": 4.44, "Gain": 1.1, "Long Term (1 month)": 5.6, "Risk Delivery": 0.45, "Quality Rating": 4, "Manager Tenure": 10, "Quantity": 13743.35, "Risk": 0.98 }, "description_html": "OpenWealth Total Bond Fund", "app_data": {} }, { "key": "92", "name": "OICNX", "values": { "YTD": 5.08, "Buy": 1.01, "Sell": 4.38, "Gain": 1.9, "Long Term (1 month)": 4.37, "Risk Delivery": 0.48, "Quality Rating": 4, "Manager Tenure": 12, "Quantity": 63434.82, "Risk": 0.97 }, "description_html": "OpenWealth Connecticut Municipal Income Fund", "app_data": {} }, { "key": "93", "name": "OBNDX", "values": { "YTD": 3.83, "Buy": 1.13, "Sell": 4.25, "Gain": 1.1, "Long Term (1 month)": 4.75, "Risk Delivery": 0.45, "Quality Rating": 4, "Manager Tenure": 10, "Quantity": 51458.13, "Risk": 1.03 }, "description_html": "OpenWealth Investment Grade Bond Fund", "app_data": {} }, { "key": "94", "name": "OLTMX", "values": { "YTD": 4.14, "Buy": 2.6, "Sell": 4.18, "Gain": 2.1, "Long Term (1 month)": 4.29, "Risk Delivery": 0.37, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 41325.69, "Risk": 0.74 }, "description_html": "OpenWealth Intermediate Municipal Income Fund", "app_data": {} }, { "key": "95", "name": "OSESX", "values": { "YTD": 14.79, "Buy": 23.63, "Sell": 4.17, "Gain": 1.1, "Long Term (1 month)": 12.4, "Risk Delivery": 0.8, "Quality Rating": 2, "Manager Tenure": 0, "Quantity": 11252.08, "Risk": 1.75 }, "description_html": "Select Energy Service Portfolio", "app_data": {} }, { "key": "96", "name": "OHKCX", "values": { "YTD": 0.98, "Buy": 9.36, "Sell": 3.65, "Gain": 1.1, "Long Term (1 month)": 11.97, "Risk Delivery": 1.02, "Quality Rating": 5, "Manager Tenure": 3, "Quantity": 13413.51, "Risk": 0.97 }, "description_html": "OpenWealth China Region Fund", "app_data": {} }, { "key": "97", "name": "OIBIX", "values": { "YTD": 3.11, "Buy": 0.18, "Sell": 3.65, "Risk Delivery": 0.2, "Quality Rating": 4, "Manager Tenure": 2, "Quantity": 12111.81, "Risk": 1.02 }, "description_html": "Spartan Intermediate Treasury Bond Index Fund - Investor Class", "app_data": {} }, { "key": "98", "name": "OBIDX", "values": { "YTD": 3.33, "Buy": 2.44, "Sell": 3.34, "Gain": 1.1, "Long Term (1 month)": 4.63, "Risk Delivery": 0.22, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 62033.48, "Risk": 1.03 }, "description_html": "Spartan U.S. Bond Index Fund - Investor Class", "app_data": {} }, { "key": "99", "name": "OTHRX", "values": { "YTD": 2.25, "Buy": 2.14, "Sell": 3.23, "Gain": 1.1, "Long Term (1 month)": 4.42, "Risk Delivery": 0.45, "Quality Rating": 3, "Manager Tenure": 1, "Quantity": 34332.23, "Risk": 1.07 }, "description_html": "OpenWealth Intermediate Bond Fund", "app_data": {} }, { "key": "100", "name": "OMSFX", "values": { "YTD": 3.67, "Buy": 1.06, "Sell": 3.2, "Gain": 1.1, "Long Term (1 month)": 4.18, "Risk Delivery": 0.45, "Quality Rating": 2, "Manager Tenure": 5, "Quantity": 18304.05, "Risk": 1.08 }, "description_html": "OpenWealth Mortgage Securities Fund", "app_data": {} }, { "key": "101", "name": "ONARX", "values": { "YTD": 15.24, "Buy": 20.85, "Sell": 3.18, "Gain": 1.1, "Long Term (1 month)": 13.06, "Risk Delivery": 0.84, "Quality Rating": 3, "Manager Tenure": 8, "Quantity": 10232.99, "Risk": 1.54 }, "description_html": "Select Natural Resources Portfolio", "app_data": {} }, { "key": "102", "name": "OGMNX", "values": { "YTD": 3.97, "Buy": 1.08, "Sell": 3.05, "Gain": 1.1, "Long Term (1 month)": 5.12, "Risk Delivery": 0.45, "Quality Rating": 5, "Manager Tenure": 5, "Quantity": 61768.09, "Risk": 1.05 }, "description_html": "OpenWealth GNMA Fund", "app_data": {} }, { "key": "103", "name": "OJRLX", "values": { "YTD": 1.71, "Buy": 1.65, "Sell": 3, "Gain": 1.1, "Long Term (1 month)": 4.06, "Risk Delivery": 0.45, "Manager Tenure": 5, "Quantity": 11344.43, "Risk": 1.9 }, "description_html": "OpenWealth Limited Term Bond Fund", "app_data": {} }, { "key": "104", "name": "OGOVX", "values": { "YTD": 2.89, "Buy": 1.67, "Sell": 2.82, "Gain": 1.1, "Long Term (1 month)": 4.61, "Risk Delivery": 0.45, "Quality Rating": 4, "Manager Tenure": 5, "Quantity": 23227.47, "Risk": 0.8 }, "description_html": "OpenWealth Government Income Fund", "app_data": {} }, { "key": "105", "name": "OCSTX", "values": { "YTD": 1.98, "Buy": 2.13, "Sell": 2.53, "Risk Delivery": 0.49, "Quality Rating": 3, "Manager Tenure": 8, "Quantity": 17630.1, "Risk": 0.4 }, "description_html": "OpenWealth California Limited Term Tax-Free Bond Fund", "app_data": {} }, { "key": "106", "name": "OSTFX", "values": { "YTD": 1.48, "Buy": 1.51, "Sell": 2.13, "Gain": 1.1, "Long Term (1 month)": 3.04, "Risk Delivery": 0.48, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 13176.22, "Risk": 0.33 }, "description_html": "OpenWealth Limited Term Municipal Income Fund", "app_data": {} }, { "key": "107", "name": "OSTGX", "values": { "YTD": 1.43, "Buy": 0.96, "Sell": 1.98, "Gain": 1.1, "Long Term (1 month)": 3.94, "Risk Delivery": 0.45, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 12844.49, "Risk": 1.02 }, "description_html": "OpenWealth Intermediate Government Income Fund", "app_data": {} }, { "key": "108", "name": "OICDX", "values": { "YTD": 8.23, "Buy": 14.58, "Sell": 1.37, "Gain": 1.1, "Long Term (1 month)": 10.44, "Risk Delivery": 0.87, "Manager Tenure": 0, "Quantity": 21252.22, "Risk": 0.87 }, "description_html": "OpenWealth Canada Fund", "app_data": {} }, { "key": "109", "name": "OSHBX", "values": { "YTD": 0.67, "Buy": 1.23, "Sell": 1.37, "Gain": 1.1, "Long Term (1 month)": 2.29, "Risk Delivery": 0.45, "Quality Rating": 3, "Manager Tenure": 7, "Quantity": 16419.44, "Risk": 1.44 }, "description_html": "OpenWealth Short-Term Bond Fund", "app_data": {} }, { "key": "110", "name": "OSEAX", "values": { "YTD": 5.32, "Buy": 8.24, "Sell": 1.36, "Gain": 1.1, "Long Term (1 month)": 11.52, "Risk Delivery": 1.08, "Quality Rating": 3, "Manager Tenure": 5, "Quantity": 12079.14, "Risk": 0.99 }, "description_html": "OpenWealth Emerging Asia Fund", "app_data": {} }, { "key": "111", "name": "OFXSX", "values": { "YTD": 0.77, "Buy": 0.84, "Sell": 1.03, "Gain": 1.1, "Long Term (1 month)": 3.13, "Risk Delivery": 0.45, "Quality Rating": 4, "Manager Tenure": 4, "Quantity": 23368.51, "Risk": 0.94 }, "description_html": "OpenWealth Limited Term Government Fund", "app_data": {} }, { "key": "112", "name": "OCONX", "values": { "YTD": 0.13, "Buy": 0.4, "Sell": 0.66, "Risk Delivery": 0.4, "Quality Rating": 3, "Manager Tenure": 3, "Quantity": 31530.59, "Risk": 0.48 }, "description_html": "OpenWealth Conservative Income Bond Fund", "app_data": {} }, { "key": "113", "name": "OEMKX", "values": { "YTD": 5.44, "Buy": 6.04, "Sell": 1.36, "Gain": 1.1, "Long Term (1 month)": 10.87, "Risk Delivery": 1.09, "Quality Rating": 3, "Manager Tenure": 2, "Quantity": 22473.34, "Risk": 0.97 }, "description_html": "OpenWealth Emerging Markets Fund", "app_data": {} }, { "key": "114", "name": "OSAGX", "values": { "YTD": 19.76, "Buy": 17.17, "Sell": 15.86, "Gain": 1.1, "Long Term (1 month)": 3.67, "Risk Delivery": 0.92, "Quality Rating": 3, "Manager Tenure": 7, "Quantity": 10284.35, "Risk": 0.44 }, "description_html": "Select Gold Portfolio", "app_data": {} } ] }';
    var adjustedDilemma = actDilemma.replace("-999.0", actGain)

    console.log('Selected GAIN:' + actGain);
    res.send(adjustedDilemma);
});



// -----------------------------
// GET TRADE SOLUTION
// -----------------------------
app.get('/getWatsonSolution', function (req, res) {

    var thrGain = req.query.gain;
    var theQty = req.query.qty;
    var theRisk = req.query.risk;

    console.log("Req Gain:" + thrGain);
    console.log("Req Qty:" + theQty);
    console.log("Req Risk:" + theRisk);

    //Example Solution    
    var actResult = '{ \"solution\": [{ \"Name\": \"OSPHX\", \"Gain\": \"6.46\", \"Risk\": \"0.3\", \"Buy\": \"18.09\", \"Quantity\": \"49863.63\" }, { \"Name\": \"OBIOX\", \"Gain\": \"7.48\", \"Risk\": \"0.14\", \"Buy\": \"19.74\", \"Quantity\": \"65111.66\" }, { \"Name\": \"OSICX\", \"Gain\": \"3.1\", \"Risk\": \"0.65\", \"Buy\": \"5.14\", \"Quantity\": \"298661.23\" }, { \"Name\": \"OMHTX\", \"Gain\": \"0.4\", \"Risk\": \"0.91\", \"Buy\": \"2.18\", \"Quantity\": \"55545.88\" }, { \"Name\": \"OICNX\", \"Gain\": \"1.9\", \"Risk\": \"0.97\", \"Buy\": \"1.01\", \"Quantity\": \"63434.82\" }, { \"Name\": \"OLTMX\", \"Gain\": \"2.1\", \"Risk\": \"0.74\", \"Buy\": \"2.6\", \"Quantity\": \"41325.69\" }] }';
    var jsonObj = JSON.parse(actResult);
    var jsonArray = jsonObj.solution

    //Delete non-fitting elements
    for (var myKey in jsonObj.solution) {
        var actGain = jsonObj.solution[myKey].Gain;
        var actQty = jsonObj.solution[myKey].Quantity;
        var actRisk = jsonObj.solution[myKey].Risk;

        if ((actGain < thrGain) || (actQty < theQty) || (actRisk > theRisk)) {
            console.log("Remove:" + myKey + ", Name:" + jsonObj.solution[myKey].Gain);
            delete jsonObj.solution[myKey];
        }
    }

    for (var myKey in jsonObj.solution) {
        var actGain = jsonObj.solution[myKey].Gain;
        console.log("key:" + myKey + ", Name:" + jsonObj.solution[myKey].Name + ":" + actGain);
    }

    //Construct Return String
    var solutionString = ""

    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + jsonObj.solution[myKey].Name + "/";
    }
    solutionString = solutionString + "@@@";


    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + jsonObj.solution[myKey].Gain + "/";
    }
    solutionString = solutionString + "@@@";

    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + "" + jsonObj.solution[myKey].Gain + "@" + jsonObj.solution[myKey].Risk + "@" + jsonObj.solution[myKey].Buy + "@" + jsonObj.solution[myKey].Quantity + "/";
    }
    solutionString = solutionString + "@@@";

    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + jsonObj.solution[myKey].Risk + "/";
    }
    console.log("Solution:" + solutionString);

    //console.log('Selected GAIN:' + actGain);
    res.send(solutionString);
});




// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// GLUE API
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -----------------------------
// GLUE DILEMMA
// -----------------------------
app.get('/getWatsonDilemmaGlue', function (req, res) {

    var actGain = req.query.time;

    var actDilemma = '{ "columns": [{ "type": "numeric", "key": "risk", "full_name": "Gefahren Klasse", "goal": "min", "is_objective": true }, { "type": "numeric", "key": "hardeningtime", "full_name": "Härtungszeit (min)", "goal": "min", "is_objective": true, "range": { "ValueRange": { "low": 1, "high": -999 } } }, { "type": "numeric", "key": "price", "full_name": "Preis (CHF)", "goal": "min", "is_objective": true }, { "type": "numeric", "key": "gain", "full_name": "Marge (CHF)", "goal": "max", "is_objective": true }, { "type": "numeric", "key": "availability", "full_name": "Verfügbarkeit (Einheiten)", "goal": "max", "is_objective": true }, { "type": "text", "key": "container", "full_name": "Verpackungsart", "goal": "max", "is_objective": false }], "subject": "Versiegelungsprodukte", "options": [{ "key": "0", "name": "GRONK", "values": { "isActive": false, "risk": 9, "hardeningtime": 73, "price": 42.7, "container": "powder", "availability": 33, "gain": 20.4 }, "description_html": "" }, { "key": "1", "name": "VERBUS", "values": { "isActive": true, "risk": 10, "hardeningtime": 111, "price": 34.65, "container": "tube", "availability": 28, "gain": 13.33 }, "description_html": "" }, { "key": "2", "name": "KEGULAR", "values": { "isActive": true, "risk": 5, "hardeningtime": 36, "price": 33.58, "container": "powder", "availability": 74, "gain": 44.32 }, "description_html": "" }, { "key": "3", "name": "DATAGEN", "values": { "isActive": true, "risk": 2, "hardeningtime": 82, "price": 90.01, "container": "tin can", "availability": 60, "gain": 15.58 }, "description_html": "" }, { "key": "4", "name": "QUILITY", "values": { "isActive": false, "risk": 3, "hardeningtime": 41, "price": 56.97, "container": "tin can", "availability": 36, "gain": 16.82 }, "description_html": "" }, { "key": "5", "name": "PATHWAYS", "values": { "isActive": false, "risk": 6, "hardeningtime": 39, "price": 40.74, "container": "powder", "availability": 50, "gain": 14.68 }, "description_html": "" }, { "key": "6", "name": "PETIGEMS", "values": { "isActive": false, "risk": 4, "hardeningtime": 50, "price": 23.34, "container": "tin can", "availability": 11, "gain": 11.2 }, "description_html": "" }, { "key": "7", "name": "BIZMATIC", "values": { "isActive": true, "risk": 3, "hardeningtime": 36, "price": 30.2, "container": "tin can", "availability": 64, "gain": 6.28 }, "description_html": "" }, { "key": "8", "name": "GALLAXIA", "values": { "isActive": false, "risk": 4, "hardeningtime": 52, "price": 73.28, "container": "tube", "availability": 50, "gain": 10.47 }, "description_html": "" }, { "key": "9", "name": "GENESYNK", "values": { "isActive": false, "risk": 6, "hardeningtime": 71, "price": 97.01, "container": "tin can", "availability": 16, "gain": 18.49 }, "description_html": "" }, { "key": "10", "name": "ENERSAVE", "values": { "isActive": false, "risk": 10, "hardeningtime": 142, "price": 46.89, "container": "tin can", "availability": 91, "gain": 21.82 }, "description_html": "" }, { "key": "11", "name": "XTH", "values": { "isActive": true, "risk": 8, "hardeningtime": 57, "price": 95.84, "container": "tube", "availability": 90, "gain": 17.13 }, "description_html": "" }, { "key": "12", "name": "VORTEXACO", "values": { "isActive": true, "risk": 1, "hardeningtime": 116, "price": 65.82, "container": "tube", "availability": 15, "gain": 15.78 }, "description_html": "" }, { "key": "13", "name": "MAGNAFONE", "values": { "isActive": true, "risk": 4, "hardeningtime": 107, "price": 53.88, "container": "tube", "availability": 45, "gain": 13.47 }, "description_html": "" }, { "key": "14", "name": "FUTURIS", "values": { "isActive": false, "risk": 1, "hardeningtime": 25, "price": 38.97, "container": "tube", "availability": 86, "gain": 34.75 }, "description_html": "" }, { "key": "15", "name": "MEDIOT", "values": { "isActive": true, "risk": 2, "hardeningtime": 75, "price": 18.93, "container": "tube", "availability": 98, "gain": 9.73 }, "description_html": "" }, { "key": "16", "name": "ENTOGROK", "values": { "isActive": true, "risk": 3, "hardeningtime": 34, "price": 51.61, "container": "powder", "availability": 26, "gain": 2.84 }, "description_html": "" }, { "key": "17", "name": "PHEAST", "values": { "isActive": true, "risk": 6, "hardeningtime": 25, "price": 39.57, "container": "tube", "availability": 35, "gain": 8.22 }, "description_html": "" }, { "key": "18", "name": "ISOSWITCH", "values": { "isActive": false, "risk": 6, "hardeningtime": 38, "price": 74.63, "container": "powder", "availability": 67, "gain": 13.57 }, "description_html": "" }, { "key": "19", "name": "STELAECOR", "values": { "isActive": false, "risk": 9, "hardeningtime": 45, "price": 53.83, "container": "tube", "availability": 22, "gain": 13.24 }, "description_html": "" }, { "key": "20", "name": "SLUMBERIA", "values": { "isActive": false, "risk": 7, "hardeningtime": 44, "price": 42.98, "container": "powder", "availability": 59, "gain": 20.24 }, "description_html": "" }, { "key": "21", "name": "CANOPOLY", "values": { "isActive": true, "risk": 7, "hardeningtime": 78, "price": 30.36, "container": "tin can", "availability": 26, "gain": 8.06 }, "description_html": "" }, { "key": "22", "name": "ANACHO", "values": { "isActive": true, "risk": 3, "hardeningtime": 79, "price": 37.19, "container": "powder", "availability": 95, "gain": 20.94 }, "description_html": "" }, { "key": "23", "name": "AQUAMATE", "values": { "isActive": false, "risk": 3, "hardeningtime": 52, "price": 33.9, "container": "tin can", "availability": 80, "gain": 28.24 }, "description_html": "" }, { "key": "24", "name": "TETAK", "values": { "isActive": false, "risk": 6, "hardeningtime": 111, "price": 68.26, "container": "tin can", "availability": 1, "gain": 10.18 }, "description_html": "" }, { "key": "25", "name": "DARWINIUM", "values": { "isActive": true, "risk": 6, "hardeningtime": 26, "price": 21.71, "container": "tube", "availability": 14, "gain": 7.82 }, "description_html": "" }] }';
    var adjustedDilemma = actDilemma.replace("-999", actGain)

    console.log('Selected GAIN:' + actGain);
    res.send(adjustedDilemma);


});



// -----------------------------
// GLUE RESULT
// -----------------------------
app.get('/getWatsonSolutionGlue', function (req, res) {

    var thrGain = req.query.time;

    console.log("Req Gain:" + thrGain);
    //Example Solution 
    var actResult = '{\"solution\": [ { \"name\": \"GRONK\", \"isActive\": false, \"risk\": 9, \"hardeningtime\": 73, \"price\": 42.7, \"container\": \"powder\", \"availability\": 33, \"gain\": 20.4 }, { \"name\": \"VERBUS\", \"isActive\": true, \"risk\": 10, \"hardeningtime\": 111, \"price\": 34.65, \"container\": \"tube\", \"availability\": 28, \"gain\": 13.33 }, { \"name\": \"KEGULAR\", \"isActive\": true, \"risk\": 5, \"hardeningtime\": 36, \"price\": 33.58, \"container\": \"powder\", \"availability\": 74, \"gain\": 44.32 }, { \"key\": \"3\", \"name\": \"DATAGEN\", \"isActive\": true, \"risk\": 2, \"hardeningtime\": 82, \"price\": 90.01, \"container\": \"tin can\", \"availability\": 60, \"gain\": 15.58 }, { \"key\": \"4\", \"name\": \"QUILITY\", \"isActive\": false, \"risk\": 3, \"hardeningtime\": 41, \"price\": 56.97, \"container\": \"tin can\", \"availability\": 36, \"gain\": 16.82 }, { \"key\": \"5\", \"name\": \"PATHWAYS\", \"isActive\": false, \"risk\": 6, \"hardeningtime\": 39, \"price\": 40.74, \"container\": \"powder\", \"availability\": 50, \"gain\": 14.68 }, { \"key\": \"6\", \"name\": \"PETIGEMS\", \"isActive\": false, \"risk\": 4, \"hardeningtime\": 50, \"price\": 23.34, \"container\": \"tin can\", \"availability\": 11, \"gain\": 11.2 }, { \"key\": \"7\", \"name\": \"BIZMATIC\", \"isActive\": true, \"risk\": 3, \"hardeningtime\": 36, \"price\": 30.2, \"container\": \"tin can\", \"availability\": 64, \"gain\": 6.28 }, { \"key\": \"8\", \"name\": \"GALLAXIA\", \"isActive\": false, \"risk\": 4, \"hardeningtime\": 52, \"price\": 73.28, \"container\": \"tube\", \"availability\": 50, \"gain\": 10.47 }, { \"key\": \"9\", \"name\": \"GENESYNK\", \"isActive\": false, \"risk\": 6, \"hardeningtime\": 71, \"price\": 97.01, \"container\": \"tin can\", \"availability\": 16, \"gain\": 18.49 }, { \"key\": \"10\", \"name\": \"ENERSAVE\", \"isActive\": false, \"risk\": 10, \"hardeningtime\": 142, \"price\": 46.89, \"container\": \"tin can\", \"availability\": 91, \"gain\": 21.82 }, { \"key\": \"11\", \"name\": \"XTH\", \"isActive\": true, \"risk\": 8, \"hardeningtime\": 57, \"price\": 95.84, \"container\": \"tube\", \"availability\": 90, \"gain\": 17.13 }, { \"key\": \"12\", \"name\": \"VORTEXACO\", \"isActive\": true, \"risk\": 1, \"hardeningtime\": 116, \"price\": 65.82, \"container\": \"tube\", \"availability\": 15, \"gain\": 15.78 }, { \"key\": \"13\", \"name\": \"MAGNAFONE\", \"isActive\": true, \"risk\": 4, \"hardeningtime\": 107, \"price\": 53.88, \"container\": \"tube\", \"availability\": 45, \"gain\": 13.47 }, { \"key\": \"14\", \"name\": \"FUTURIS\", \"isActive\": false, \"risk\": 1, \"hardeningtime\": 25, \"price\": 38.97, \"container\": \"tube\", \"availability\": 86, \"gain\": 34.75 }, { \"key\": \"15\", \"name\": \"MEDIOT\", \"isActive\": true, \"risk\": 2, \"hardeningtime\": 75, \"price\": 18.93, \"container\": \"tube\", \"availability\": 98, \"gain\": 9.73 }, { \"key\": \"16\", \"name\": \"ENTOGROK\", \"isActive\": true, \"risk\": 3, \"hardeningtime\": 34, \"price\": 51.61, \"container\": \"powder\", \"availability\": 26, \"gain\": 2.84 }, { \"key\": \"17\", \"name\": \"PHEAST\", \"isActive\": true, \"risk\": 6, \"hardeningtime\": 25, \"price\": 39.57, \"container\": \"tube\", \"availability\": 35, \"gain\": 8.22 }, { \"key\": \"18\", \"name\": \"ISOSWITCH\", \"isActive\": false, \"risk\": 6, \"hardeningtime\": 38, \"price\": 74.63, \"container\": \"powder\", \"availability\": 67, \"gain\": 13.57 }, { \"key\": \"19\", \"name\": \"STELAECOR\", \"isActive\": false, \"risk\": 9, \"hardeningtime\": 45, \"price\": 53.83, \"container\": \"tube\", \"availability\": 22, \"gain\": 13.24 }, { \"key\": \"20\", \"name\": \"SLUMBERIA\", \"isActive\": false, \"risk\": 7, \"hardeningtime\": 44, \"price\": 42.98, \"container\": \"powder\", \"availability\": 59, \"gain\": 20.24 }, { \"key\": \"21\", \"name\": \"CANOPOLY\", \"isActive\": true, \"risk\": 7, \"hardeningtime\": 78, \"price\": 30.36, \"container\": \"tin can\", \"availability\": 26, \"gain\": 8.06 }, { \"key\": \"22\", \"name\": \"ANACHO\", \"isActive\": true, \"risk\": 3, \"hardeningtime\": 79, \"price\": 37.19, \"container\": \"powder\", \"availability\": 95, \"gain\": 20.94 }, { \"key\": \"23\", \"name\": \"AQUAMATE\", \"isActive\": false, \"risk\": 3, \"hardeningtime\": 52, \"price\": 33.9, \"container\": \"tin can\", \"availability\": 80, \"gain\": 28.24 }, { \"key\": \"24\", \"name\": \"TETAK\", \"isActive\": false, \"risk\": 6, \"hardeningtime\": 111, \"price\": 68.26, \"container\": \"tin can\", \"availability\": 1, \"gain\": 10.18 }, { \"key\": \"25\", \"name\": \"DARWINIUM\", \"isActive\": true, \"risk\": 6, \"hardeningtime\": 26, \"price\": 21.71,\"container\": \"tube\",\"availability\": 14,\"gain\": 7.82}]}';
    var jsonObj = JSON.parse(actResult);
    var jsonArray = jsonObj.solution

    //Delete non-fitting elements
    for (var myKey in jsonObj.solution) {
        var actGain = jsonObj.solution[myKey].hardeningtime;
        if (actGain > thrGain) {
            console.log("Remove:" + myKey + ", Name:" + jsonObj.solution[myKey].hardeningtime);
            delete jsonObj.solution[myKey];
        }
    }

    for (var myKey in jsonObj.solution) {
        var actGain = jsonObj.solution[myKey].hardeningtime;
        console.log("key:" + myKey + ", Name:" + jsonObj.solution[myKey].Name + ":" + actGain);
    }

    //Construct Return String
    var solutionString = ""

    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + jsonObj.solution[myKey].name + "/";
    }
    solutionString = solutionString + "@@@";


    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + jsonObj.solution[myKey].hardeningtime + "/";
    }
    solutionString = solutionString + "@@@";

    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + "Hardening Time:" + jsonObj.solution[myKey].hardeningtime + " min\r\nRisk Level:" + jsonObj.solution[myKey].risk + "\r\nPrice:" + jsonObj.solution[myKey].price + " $\r\nAvailability:" + jsonObj.solution[myKey].availability + " Units\r\Packaging:" + jsonObj.solution[myKey].container + "/";
    }
    solutionString = solutionString + "@@@";

    for (var myKey in jsonObj.solution) {
        solutionString = solutionString + jsonObj.solution[myKey].risk + "/";
    }
    console.log("Solution:" + solutionString);

    res.send(solutionString);
});



// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// CUSTOMER CARE API 
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -----------------------------
// HANDLE COMPLAINT
// -----------------------------
// Handle the form POST containing an audio file and return transcript (from mobile)
app.post('/complaints', function (req, res) {

    console.log("BEGIN REQUEST-------------------------------------------------------\r\n\r\n");

    console.log("Transferring Audio from Phone");
    var file = req.files.audio;
    var readStream = fs.createReadStream(file.path);
    console.log("      Opened stream for audio file: " + file.path);

    var params = {
        audio: readStream,
        content_type: 'audio/l16; rate=16000; channels=1',
        continuous: "true"
    };

    //console.log("Writing stream to audio file: " + file.path);

    speechToText.recognize(params, function (err, response) {

        readStream.close();

        console.log("      Closed stream for audio file: " + file.path + "\r\n\r\n");

        if (err) {
            return res.status(err.code || 500).json(err);
        } else {
            var result = {};
            if (response.results.length > 0) {
                var finalResults = response.results.filter(isFinalResult);

                if (finalResults.length > 0) {
                    result = finalResults[0].alternatives[0];

                    console.log("What I understood:\r\n" + JSON.stringify(result.transcript) + "\r\n\r\n");
                    var transcription = JSON.stringify(result.transcript);
                    
                    //Kick off Backend Treatment in NodeRed
                    var requestify = require('requestify');

                    console.log("Sent to Analysis");

                    requestify.get('http://noderedprod.mydemo.center/complaint?text=' + encodeURIComponent(transcription))
                        .then(function (response) {
                            // Get the response body (JSON parsed or jQuery object for XMLs)
                            response.getBody();
                            console.log("Request Taxonomy: " + JSON.stringify(response) + "\r\n\r\n");
                            console.log("END REQUEST-------------------------------------------------------\r\n\r\n\r\n\r\n\r\n\r\n");
                        });
                }
            }
            return res.send(result.transcript);
        }
    });
});


function isFinalResult(value) {
    return value.final == true;
}


// -----------------------------
// HANDLE Q/A
// -----------------------------
//handle QA query and return json result (for mobile)
app.get('/ask', function (req, res) {

    var query = req.query.query;

    if (query != undefined) {
        question_and_answer_healthcare.ask({
            text: query
        }, function (err, response) {
            if (err) {
                return res.status(err.code || 500).json(response);
            } else {
                if (response.length > 0) {
                    var answers = [];

                    for (var x = 0; x < response[0].question.evidencelist.length; x++) {
                        var item = {};
                        item.text = response[0].question.evidencelist[x].text;
                        item.value = response[0].question.evidencelist[x].value;
                        answers.push(item);
                    }

                    var result = {
                        answers: answers
                    };
                    return res.send(result);
                }
                return res.send({});
            }
        });
    } else {
        return res.status(500).send('Bad Query');
    }
});


// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// DEMO SERVER API
// -------------------------------------------------------------------------------------------------------------------------------------------------------------------------

// -----------------------------
// GET AUTHORS
// -----------------------------
app.get('/getList', function (req, res) {
    res.send(({
        "values": [{
                "id": "1",
                "name": "Ben Franklin - Papers to Sir Hans Sloane ",
                "text": "Having lately been in the Nothern Parts of America, I have brought from thence a Purse made of the Stone Asbestus, a Piece of the Stone, and a Piece of Wood, the Pithy Part of which is of the same Nature, and call’d by the Inhabitants, Salamander Cotton. As you are noted to be a Lover of Curiosities, I have inform’d you of these; and if you have any Inclination to purchase them, or see ’em, let me know your Pleasure by a Line directed for me at the Golden Fan in Little Britain, and I will wait upon you with them. I am, Sir Your most humble Servant. I am highly pleased with the account captain Freeman gives me of you. I always judged by your behaviour when a child that you would make a good, agreeable woman, and you know you were ever my peculiar favourite. I have been thinking what would be a suitable present for me to make, and for you to receive, as I hear you are grown a celebrated beauty. I had almost determined on a tea table, but when I considered that the character of a good housewife was far preferable to that of being only a pretty gentlewoman, I concluded to send you a spinning wheel, which I hope you will accept as a small token of my sincere love and affection. Sister, farewell, and remember that modesty, as it makes the most homely virgin amiable and charming, so the want of it infallibly renders the most perfect beauty disagreeable and odious. But when that brightest of female virtues shines among other perfections of body and mind in the same person, it makes the woman more lovely than an angel. Excuse this freedom, and use the same with me. Your kind and affectionate Letter of May the 15th, was extreamly agreeable to me; and the more so, because I had not for two Years before, receiv’d a Line from any Relation, my Father and Mother only excepted. I am glad to hear your Family are got well thro’ the Small Pox, and that you have your Health continu’d to you. I sold your Husbands Watches for about £3 10s. this Money, and I now send him 3 Barrels of Flower (tho’ it be long first) which come to about the Money. I reckon my self very much oblig’d to him for not being more urgent with me. The Flower Brother John will deliver to him. Please to give my Respects to him, and excuse my not sending sooner. I am sorry to hear of Sister Macom’s Loss, and should be mighty glad of a Line from her; and from Sister Homes, who need be under no Apprehensions of not writing polite enough to such an unpolite Reader as I am; I think if Politeness is necessary to make Letters between Brothers and Sisters agreeable, there must be very little Love among ’em. I am not about to be married as you have heard. At present I am much hurryed in Business but hope to make a short Trip to Boston in the Spring. Please to let me know how Sister Douse is, and remember my kind Love to her, as also to Brother Peter, and Sister Lydia &c. Dear Sister, I love you tenderly, adieu. The two grand Requisites in the Art of Pleasing, are Complaisance and Good Nature. Complaisance is a seeming preference of others to our selves; and Good Nature a Readiness to overlook or excuse their Foibles, and do them all the Services we can. These two Principles must gain us their good Opinion, and make them fond of us for their own Sake, and then all we do or say will appear to the best Advantage, and be well accepted."
                                },
            {
                "id": "2",
                "name": "John F. Kennedy - Inaugural Speech",
                "text": "Vice President Johnson, Mr. Speaker, Mr. Chief Justice, President Eisenhower, Vice President Nixon, President Truman, Reverend Clergy, fellow citizens: We observe today not a victory of party but a celebration of freedom--symbolizing an end as well as a beginning--signifying renewal as well as change. For I have sworn before you and Almighty God the same solemn oath our forbears prescribed nearly a century and three-quarters ago.The world is very different now. For man holds in his mortal hands the power to abolish all forms of human poverty and all forms of human life. And yet the same revolutionary beliefs for which our forebears fought are still at issue around the globe--the belief that the rights of man come not from the generosity of the state but from the hand of God.We dare not forget today that we are the heirs of that first revolution. Let the word go forth from this time and place, to friend and foe alike, that the torch has been passed to a new generation of Americans--born in this century, tempered by war, disciplined by a hard and bitter peace, proud of our ancient heritage--and unwilling to witness or permit the slow undoing of those human rights to which this nation has always been committed, and to which we are committed today at home and around the world.Let every nation know, whether it wishes us well or ill, that we shall pay any price, bear any burden, meet any hardship, support any friend, oppose any foe to assure the survival and the success of liberty. This much we pledge--and more. To those old allies whose cultural and spiritual origins we share, we pledge the loyalty of faithful friends. United there is little we cannot do in a host of cooperative ventures. Divided there is little we can do--for we dare not meet a powerful challenge at odds and split asunder. To those new states whom we welcome to the ranks of the free, we pledge our word that one form of colonial control shall not have passed away merely to be replaced by a far more iron tyranny. We shall not always expect to find them supporting our view. But we shall always hope to find them strongly supporting their own freedom--and to remember that, in the past, those who foolishly sought power by riding the back of the tiger ended up inside. To those people in the huts and villages of half the globe struggling to break the bonds of mass misery, we pledge our best efforts to help them help themselves, for whatever period is required--not because the communists may be doing it, not because we seek their votes, but because it is right. If a free society cannot help the many who are poor, it cannot save the few who are rich. To our sister republics south of our border, we offer a special pledge--to convert our good words into good deeds--in a new alliance for progress--to assist free men and free governments in casting off the chains of poverty. But this peaceful revolution of hope cannot become the prey of hostile powers. Let all our neighbors know that we shall join with them to oppose aggression or subversion anywhere in the Americas. And let every other power know that this Hemisphere intends to remain the master of its own house. To that world assembly of sovereign states, the United Nations, our last best hope in an age where the instruments of war have far outpaced the instruments of peace, we renew our pledge of support--to prevent it from becoming merely a forum for invective--to strengthen its shield of the new and the weak--and to enlarge the area in which its writ may run."
                                },
            {
                "id": "4",
                "name": "Buisness eMail",
                "text": "Hi Team, I know the times are difficult! Our sales have been disappointing for the past three quarters for our data analytics product suite. We have a competitive data analytics product suite in the industry. But we need to do our job selling it! We need to acknowledge and fix our sales challenges. We can’t blame the economy for our lack of execution! We are missing critical sales opportunities. Our product  is in no way inferior to the competitor products. Our clients are hungry for analytical tools to improve their business outcomes. Economy has nothing to do with it. In fact, it is in times such as this, our clients want to get the insights they need to turn their businesses around. Let’s buckle up and execute. In summary, we have a competitive product, and a hungry market. We have to do our job to close the deals. Jennifer Baker Sales Leader, North-East Geo, Data Analytics Inc."
            }, {
                "id": "999",
                "name": "Custom",
                "text": "Provide your own text..."
            }]
    }));
});

// -----------------------------
// GET PEOPLE
// -----------------------------
app.get('/getDemo', function (req, res) {
    res.send(({
        "values": [
            {
                "name": "Franklin Kelly",
                "gender": "male",
                "company": "OVERPLEX",
                "email": "franklinkelly@overplex.com"
  },
            {
                "name": "Rosalie William",
                "gender": "female",
                "company": "REALYSIS",
                "email": "rosaliewilliam@realysis.com"
  },
            {
                "name": "Curry Slater",
                "gender": "male",
                "company": "DIGIQUE",
                "email": "curryslater@digique.com"
  },
            {
                "name": "Dalton Calhoun",
                "gender": "male",
                "company": "RETROTEX",
                "email": "daltoncalhoun@retrotex.com"
  },
            {
                "name": "Angelita Baxter",
                "gender": "female",
                "company": "COMTEST",
                "email": "angelitabaxter@comtest.com"
  }
]
    }));
});


// -----------------------------
// PING API
// -----------------------------

app.get('/ping', function (req, res) {
    res.send("I'm here");
});





// Start server
var port = (process.env.VCAP_APP_PORT || 3000);
server.listen(port);
console.log('listening at:', port);