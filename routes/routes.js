module.exports = {
    use: (app, express, db) => {
        app.use(express.static('public'));

        app.get('*', (req, res) => {
            res.status(404).send(req.path); // TODO: this line could be wrong; will need to be fixed
        });

    }
};