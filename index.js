const express = require('express');
const router  = require('./router.js');

const app = express();
const port = process.env.PORT || 3000;

app.use('/api', router);

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, 'localhost', (error) => {
  if (error) {
    console.log(error);
  }
  console.log('Server listening on port %d', port);
})