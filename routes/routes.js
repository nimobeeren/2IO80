module.exports = {
    use: (app, express, db) => {
        app.use(express.static('public'));

        app.get('*', (req, res) => {
            res.sendfile("views/home.html");
        });
    }
};
