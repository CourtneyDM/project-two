// Dependencies
const express = require("express");
const router = express.Router();
const read = require("node-readability");

// Import ORM
const orm = require("../config/orm");

// Route for handling data for current user logged in
router.post("/api/signed_in", (req, res) => {
    // This route will use the ORM validateUser method to query the database for the
    // user info submitted.
    user_email = req.body.user_email;
    console.log(`User signed in (POST/signed_in): ${JSON.stringify(req.body)}`);
    res.render("index", { user_email: user_email });
});

// Route handler to add new user to database
router.post("/api/sign_up", (req, res) => {
    user_email = req.body.user_email;
    console.log(`Data received: ${JSON.stringify(req.body)}`);
    const tableInput = "user_info";
    console.log(req.body);
    orm.createNewUser(req.body, result => {
        console.log("Successfully added new user.");
        console.log(`Results: ${JSON.stringify(result)}`);
    });
    res.render("user", user_email);
});

// Route handler for processing article URL
router.post("/article", (req, res) => {
    // Convert URL into Readability version
    getArticle(req, res, req.body.url);
});

// Get the reader version of the article
async function getArticle(req, res, url) {
    try {
        await read(url, (err, article, meta) => {
            if (err) { throw err; }
            const content = {
                title: article.title,
                article: article.textBody
            }
            article.close();
            console.log(`SUCCESS`);
            return res.render("index", content);
        });
    } catch (error) {
        console.log(`Error Logged: ${error}`);
    }
}
// Export router functionality for server to use
module.exports = router;