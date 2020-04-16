'use strict'

import React from 'react'
import ReactDOM from 'react-dom'
import './search.less'
import testimg from './test.gif'

class Search extends React.Component {
    render () {
        a = 1
        return (<div className="search">
            <p>121212121212search 2222</p>
            <img src={testimg} alt="#"/>
            </div>)
    }
}

ReactDOM.render(
    <Search/>,
    document.getElementById('root')
)