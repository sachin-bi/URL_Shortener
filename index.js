const express = require("express");
const { connectToMongoDB } = require('./connect');
const urlRoute = require('./routes/url');
const URL = require("./models/url");
const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://127.0.0.1:27017/short-url2').then(() =>
    console.log(`MongoDB Connected`)
);

app.use(express.json());

// app.use("/analytics/:shortId",urlRoute);
app.use("/url", urlRoute);

app.get('/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    // this entry is the return value(from URL.findoneandupdate)
    const entry = await URL.findOneAndUpdate({
        shortId,
    }, 
    {
        $push: {
            visitHistory: {
                timestamp: Date.now(),
            }
        }
    });
    res.redirect(entry.redirectURL);
})


app.listen(PORT, () => console.log(`Server Started At PORT:${PORT}`));
