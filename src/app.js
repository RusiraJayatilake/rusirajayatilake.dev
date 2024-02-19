const express = require('express');
const path = require('path');
const routes = require('./routes/routes');

const app = express();
const PORT = 4000;

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', routes);

app.listen(PORT, () => {
    console.log(`http://localhost:${PORT}/`)
});


