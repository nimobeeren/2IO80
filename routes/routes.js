module.exports = {
    use: (app, express, db) => {
        app.use(express.static('public'));

        app.get('*', (req, res) => {
            res.send("views/home.html");
        });
    }
};