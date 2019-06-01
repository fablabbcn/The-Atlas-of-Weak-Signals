const googleTrends = require('google-trends-api');

/* Corpus Helpers Here */

function corpusTest(){
  googleTrends.interestOverTime({keyword: 'Valentines Day'})
      .then((res) => {
        console.log('this is res', res);
      })
      .catch((err) => {
        console.log('got the error', err);
        console.log('error message', err.message);
        console.log('request body',  err.requestBody);
      });
}


const express = require('express')
const app = express()
const port = 3000

app.use(express.static('app'))

app.listen(port, () => console.log(`Atlas listening on port ${port}!`))

