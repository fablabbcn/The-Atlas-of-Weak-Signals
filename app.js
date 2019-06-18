const googleTrends = require('google-trends-api'),
    fs = require("fs");

/* Load Corpus */
var corpus = fs.readFileSync("weaksignals.json");
corpus = JSON.parse(corpus)["atlas"];

console.log(corpus);

corpus[1]["test"] =  "test";


/* Write File */
fs.writeFile('myTest.json', JSON.stringify(corpus), 'utf8', function (err)
{
    if (err) {
        console.log("failed to write");
    }
});



/* Corpus Helpers Here */
function corpusTest(keyword){
    googleTrends.interestOverTime({keyword: keyword})
        .then((res) => {
            console.log('this is res', res);
        })
        .catch((err) => {
            console.log('got the error', err);
            console.log('error message', err.message);
            console.log('request body',  err.requestBody);
        });
}



// corpusTest("Attention Economy");
//
//
//

const express = require('express')
const app = express()
const port = 3000

app.use(express.static('app'))

app.listen(port, () => console.log(`Atlas listening on port ${port}!`))

