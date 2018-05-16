import React, { Component } from 'react';
import { Menu, Input, Dimmer, Loader } from 'semantic-ui-react'
import ReactMarkdown from 'react-markdown'
import axios from 'axios'

import menuDef from './MenuDef'

import 'semantic-ui-css/semantic.min.css';
import './App.css';

class App extends Component {
  state = {
    content: ''
  }

  loadContent(folder, file){
    this.setState({isLoading: true})

    axios.get(`doc/${folder}/${file}`)
      .then((res) => {
        this.setState({content: res.data, isLoading: false})
      })
      .catch((error) => {
        this.setState({content: 'Erreur de chargement du contenu...', isLoading: false})
      });
  }

  render() {
    const sidebarWidth = 250;

    const style = {
      sidebar: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0,
        width: sidebarWidth,
        paddingBottom: '1em',
        background: '#1B1C1D',
        overflowY: 'scroll',
      },
      content: {
        minHeight: 300,
        padding: 10,
        marginLeft: sidebarWidth,
        minWidth: parseInt(sidebarWidth, 10) + 300
      }
    }
    return (
        <div>
          <Menu vertical fixed='left' inverted style={style.sidebar}>
            <Menu.Item>
              <strong>
                EventPlanner &nbsp;
                <small><em>1.0.0</em></small>
              </strong>
            </Menu.Item>
            <Menu.Item>
              <Input
                className='transparent inverted icon'
                icon='search'
                placeholder='Rechercher...'
                //value={query}
                //onChange={this.handleSearchChange}
                //onKeyDown={this.handleSearchKeyDown}
              />
            </Menu.Item>
            {
              menuDef.map((section) => {
                const subMenu = section.subMenu.map((page) => {
                  return (
                    <Menu.Item key={page.contentFile} as='a' to={page.route} onClick={() => this.loadContent(section.contentFolder, page.contentFile)} activeClassName='active'>
                      {page.name}
                    </Menu.Item>)
                })
                return (
                    <Menu.Item  key={section.contentFolder}>
                      <Menu.Header>{section.name}</Menu.Header>
                      <Menu.Menu>
                        {subMenu}
                      </Menu.Menu>
                    </Menu.Item>
                  )
              })
            }
          </Menu>


          <Dimmer.Dimmable blurring dimmed={this.state.isLoading} style={style.content}>
            <Dimmer active={this.state.isLoading} inverted>
              <Loader inverted >Chargement...</Loader>
            </Dimmer>

            <ReactMarkdown source={this.state.content}/>
          </Dimmer.Dimmable>
        </div>
    );
  }
}

export default App;
