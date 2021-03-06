const path = require('path');
module.exports = {
    components: path.resolve(__dirname, 'components/**/[A-Z]*.{jsx,js}'),
    webpackConfig: require(path.resolve(__dirname, 'tools/webpack.dev.js')),
    require: [path.resolve(__dirname, 'styleguide/setup.js'), './style/mkbs.css'],
    getComponentPathLine(componentPath) {
        const name = path.basename(path.basename(componentPath, '.jsx'), '.js');
        const dir = path.dirname(componentPath);
        return `import ${name} from '${dir}';`
    },
    sections: [
        {
            name: 'Mktable',
            content: 'docs/introduction.md',
            components: path.resolve(__dirname, 'components/MkTable/**/[A-Z]*.{jsx,js}'),
        },
        {
            name: 'MkLayout',
            content: 'docs/introduction.md',
            components: path.resolve(__dirname, 'components/MkLayout/**/[A-Z]*.{jsx,js}')
        },
        {
            name: 'others',
            content: 'docs/main.md',
            components: path.resolve(__dirname, 'components/**/[A-Z]*.{jsx,js}'),
            ignore: [path.resolve(__dirname, 'components/MkTable/**'),path.resolve(__dirname, 'components/MkLayout/**')]
        },
    ]
};