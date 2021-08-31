const express = require('express');
const app = express();
const port = 5000;

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Welcome!');
});

require("./routes/customer.routes.js")(app);

app.listen(port, () => {
    console.log(`Now listening on port ${port}`);
});

module.exports = app;
