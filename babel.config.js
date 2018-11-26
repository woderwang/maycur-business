const presets = [
    "@babel/react",
    [
        "@babel/preset-env",
        {
            modules: false,
            targets: {
                edge: "17",
                firefox: "60",
                chrome: "67",
                safari: "11.1",
            },
            useBuiltIns: "usage",
        }
    ],
    // [
    //     "@babel/env",
    //     {
    //         targets: {
    //             edge: "17",
    //             firefox: "60",
    //             chrome: "67",
    //             safari: "11.1",
    //         },
    //         useBuiltIns: "usage",
    //     },
    // ],
];
const plugins = [
    [
        "import",
        {
            "libraryName": "maycur-antd",
            "style": "css"
        },
        "maycur-antd"
    ],
    ["@babel/plugin-proposal-class-properties", { "loose": true }],
];

module.exports = { presets, plugins };