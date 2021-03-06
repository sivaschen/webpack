'use strict'

const React = require('react');
require('./search.less');
let logo = require('./test.jpg');
require('./../../common/index.js');
const { a } = require('./tree-shaking');

class Search extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            Text: null
        }
    }
    loadComponent() {
        import('./text.js').then((Text) => {
            console.log(Text)
            this.setState({
                Text: Text.default
            });
        });
    }
    render () {
        const { Text } = this.state;
        return (<div className="search">
            {
                Text ? <Text /> : null
            }
            <p>1212121{a()}12search 2222</p>
            <img src={ logo } onClick={this.loadComponent.bind(this)}/>
            </div>)
    }
}

module.exports = <Search />;