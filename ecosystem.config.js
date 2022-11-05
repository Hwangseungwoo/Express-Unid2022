module.exports = {
    apps: [
        {
            name: "server",
            script: "app.js",
            watch: false,
            ignore_watch: ["node_modules", "src"]
        }
    ]
};
