import { ipcRenderer as ipc, remote } from 'electron'
import React, { Component } from 'react'
import crypto from 'crypto'
import cardType from 'credit-card-type'
import CreateProfile from '~/components/CreateProfile'
import Table from '~/components/Table'
import NoProfiles from '~/assets/table/no-profiles.svg'
import Icon from '~/assets/sidebar/profiles.svg'
import styles from './_pages.scss'
import { connect } from 'react-redux'

const {
  TouchBar,
  TouchBar: { TouchBarLabel, TouchBarButton, TouchBarSegmentedControl, TouchBarSpacer }
} = remote

function mapStateToProps(state) {
  return {
    profiles: state.profiles
  }
}

type Props = {
  profiles: array<object>
}

export default connect(
  mapStateToProps
)(class Profiles extends Component<Props> {
  static icon = Icon
  
  static cardImage([card]) {
    if (!card) {
      return ''
    }
    
    const req = require.context('~/assets/cards')
    
    return <img src={ req(`./${card.type}.svg`) } alt=""/>
  }
  
  constructor(props) {
    super(props)
  }
  
  componentDidMount() {
    const fullSpace = new TouchBarSpacer({
      size:'flexible'
    })
    const touchButtons = new TouchBarSegmentedControl(
      {
        mode: 'buttons',
        segments: [
          { icon: `${ __dirname }/${ process.env.NODE_ENV === 'production' ? 'touchbar/add.png' : 'assets/touchbar/add.png' }` },
          { icon: `${ __dirname }/${ process.env.NODE_ENV === 'production' ? 'touchbar/import.png' : 'assets/touchbar/import.png' }` },
          { icon: `${ __dirname }/${ process.env.NODE_ENV === 'production' ? 'touchbar/edit.png' : 'assets/touchbar/edit.png' }` },
        ],
        change : ()=>{
          switch (touchButtons.selectedIndex) {
            case 0:
              console.log('0')
              break;
            case 1:
              console.log('1')
              break;
            case 2:
              console.log('2')

          }
        }
      }
    );

    remote
      .getCurrentWindow()
      .setTouchBar(new TouchBar([fullSpace, touchButtons]))
  }
  
  componentWillUnmount() {
  }
  
  render() {
    const { profiles } = this.props
    
    return (
      <div className={ styles.container }>
        <Table
          name="Profile"
          data={ profiles }
          header={ <h1>Billing Profiles</h1> }
          noItemsSrc={ NoProfiles }
          onCreate={ () => {} }
          onDelete={ ids => ipc.send('profile.delete', ids) }
          onImport={ profiles => ipc.send('profile.import', profiles) }
          onExport={ (selected, save) => {
            const { profiles } = this.state
            save(JSON.stringify(selected.length === 0 ? profiles : profiles.filter(profile => selected.indexOf(profile._id) !== -1)))
          } }
          openComponent={ CreateProfile }
          columns={ [
            {
              title: 'Card',
              accessor: ({ card }) => Profiles.cardImage(cardType(card.number)),
              flex: 0,
              identical: true,
              style: {
                minWidth: 35,
                marginRight: 0
              }
            },
            {
              accessor: ({ card: { number } }) => {
                const sections = number.split(' ')
                if (sections.length < 2) {
                  return number
                }
                
                return sections
                  .slice(sections.length - 2)
                  .map((section, i) =>
                    i === 0 ? section.replace(/./g, '•') : section
                  )
                  .join(' ')
              },
              style: {
                marginLeft: 0,
                fontWeight: '600'
              },
              headerStyle: {
                marginLeft: 0
              },
              flex: 0.15
            },
            {
              title: 'Name',
              accessor: 'name',
              flex: 0.35
            },
            {
              title: 'Card Holder',
              accessor: 'billing.name',
              flex: 0.35
            },
            {
              title: 'Expires',
              accessor: 'card.expiration',
              flex: 0.15
            },
            {
              title: 'Zip Code',
              accessor: 'billing.zip'
            }
          ] }
        />
      </div>
    )
  }
})
