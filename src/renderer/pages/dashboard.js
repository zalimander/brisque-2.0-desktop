import { ipcRenderer as ipc, remote } from 'electron'
import React, { Component } from 'react'
import connect from 'react-redux/es/connect/connect'
import axios from 'axios'

import Button from '~/components/Button'
import Icon from '~/assets/sidebar/dashboard.svg'
import styles from './dashboard.scss'

function mapStateToProps(state) {
  return {
    user: state.user
  }
}

type Props = {
  user: object
}

export default connect(
  mapStateToProps
)(class Dashboard extends Component<Props> {
  static icon = Icon
  
  componentDidMount() {
    onSignout = this.onSignout
    remote
      .getCurrentWindow()
      .setTouchBar(touchbar)
  }
  
  componentWillUnmount() {
    onSignout = null
  }
  
  onSignout = () => {
    ipc.send('logout')
  }
  
  bannedMessage = 'You have been banned from our Discord. If you believe this was an error, please contact us on Twitter.'
  joinDiscord = async (evt) => {
    evt.preventDefault()
    try {
      await axios.get(`/api/discord/join`)
      const { user } = this.props
  
      ipc.send('user.update', Object.assign({}, user, {
        discord: Object.assign(user.discord, {
          joined_guild: true
        })
      }))
    } catch (e) {
      console.error(e)
      let error
      const data = response && response.data
      if (data) {
        error = data.error === 'BANNED_FROM_GUILD' ? this.bannedMessage : data.error
      } else {
        error = 'An unknown error has occurred, please try again'
      }
    }
  }
  
  get lists() {
    const { user } = this.props
    
    return (
      <div className={ styles.lists }>
        { /* Licenses */ }
        <div className={ styles.list }>
          <div className={ styles.caption }>
            <h2>Licenses</h2>
            <div className={ styles.buttons }>
              <Button src={ require('~/assets/table/add.svg') } hoverSrc={ require('~/assets/table/add-hover.svg') } width={ 32 } height={ 32 } disabled/>
            </div>
          </div>
          <div className={ styles.contents }>
            <div className={ styles.header }>
              <p style={ { marginLeft: '1.2em' } }>Key</p>
              <p style={ { marginLeft: '19.73em' } }>Expires</p>
            </div>
            <div className={ styles.body }>
              { user.purchases.map(purchase => (
                <div className={ styles.item } key={ purchase.id }>
                  <div className={ styles.info }>
                    <p className={ styles.mono }>{ purchase.key || '********-****-****-****-************' }</p>
                    <p className={ styles.subtitle }>{ purchase.title }</p>
                  </div>
                  <p className={ [styles.expiration, styles.lifetime].join(' ') }>Lifetime</p>
                </div>
              )) }
            </div>
          </div>
        </div>
        { /* Checkouts */ }
        <div className={ styles.list }>
          <div className={ styles.caption }>
            <h2>Checkouts</h2>
            <div className={ styles.buttons }>
              <Button src={ require('~/assets/search.svg') } hoverSrc={ require('~/assets/table/add-hover.svg') } width={ 32 } height={ 32 } disabled/>
              <Button src={ require('~/assets/expand.svg') } hoverSrc={ require('~/assets/table/add-hover.svg') } width={ 32 } height={ 32 } disabled/>
            </div>
          </div>
          <div className={ styles.contents }>
            <div className={ styles.header }>
              <p style={ { marginLeft: '1.2em' } }>Item/Store</p>
              <p style={ { marginLeft: '20.5em' } }>Price</p>
            </div>
            <div className={ [styles.body, styles.centered].join(' ') }>
              <h2>-</h2>
              <div className={ styles.subtitle } style={ { textTransform: 'uppercase' } }>Coming Soon</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
  render() {
    const { user } = this.props
    
    if (!user || !user.discord) {
      return <div className={ styles.container }>Loading...</div>
    }
    
    const { discord: { profile, joined_guild, banned_from_guild, roles } } = user
    
    userLabel.label = `${ profile.username }#${ profile.discriminator }`
    
    return (
      <div className={ styles.container }>
        <div className={ styles.header }>
          <div className={ styles.profile }>
            { profile.avatarId && profile.avatarId.startsWith('a_') && (
              <img className={ [styles.avatar, styles.absolute].join(' ') } src={ `${ profile.avatar }.gif` } alt=''/>
            ) }
            <img className={ [styles.avatar, profile.avatarId && profile.avatarId.startsWith('a_') && styles.hide].join(' ') } src={ `${ profile.avatar }.png` } alt=''/>
            <div className={ styles.name }>
              <h2>{ profile.username }#{ profile.discriminator }</h2>
              <div className={ styles.actions }>
                { joined_guild && !banned_from_guild && roles.map(role => (
                  <div className={ styles.role } style={ { backgroundColor: role.color } } key={ role.id }>
                    { role.name }
                  </div>
                )) }
                { banned_from_guild && (
                  <button
                    className={ ['buttonWrap', styles.role].join(' ') } style={ { backgroundColor: 'red' } }
                    onClick={ () => history.replace('/dashboard', { error: this.bannedMessage }) }
                  >
                    Banned
                  </button>
                ) }
                { !banned_from_guild && !joined_guild && (
                  <a href='/' className={ styles.discordLink } onClick={ this.joinDiscord }>Join Discord</a>
                ) }
              </div>
            </div>
          </div>
          <Button className={ styles.signOut } type='danger' onClick={ this.onSignout }>
            Log Out
          </Button>
        </div>
        { this.lists }
        <div className={ styles.analytics }>
          <div className={ styles.header }>
            <h2>Analytics</h2>
            <div className={ styles.dropDown }>
              Last 30 Days
            </div>
          </div>
          <div className={ styles.analyticContainer }>
            <div className={ styles.analytic }>
              <div className={ styles.icon } id='purple'>
                <img src={ require('../assets/checkouts.svg') } alt=''/>
              </div>
              <div className={ styles.centered }>
                <h2>-</h2>
                <p className={ styles.subtitle } style={ { textTransform: 'uppercase' } }>Coming Soon</p>
              </div>
            </div>
            <div className={ styles.analytic }>
              <div className={ styles.icon } id='green'>
                <img src={ require('../assets/spent.svg') } alt=''/>
              </div>
              <div className={ styles.centered }>
                <h2>-</h2>
                <p className={ styles.subtitle } style={ { textTransform: 'uppercase' } }>Coming Soon</p>
              </div>
            </div>
            <div className={ styles.analytic }>
              <div className={ styles.icon } id='blue'>
                <img src={ require('../assets/proxy-usage.svg') } alt=''/>
              </div>
              <div className={ styles.centered }>
                <h2>-</h2>
                <p className={ styles.subtitle } style={ { textTransform: 'uppercase' } }>Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
})

/*
 * Touchbar stuff
 */

const {
  TouchBar,
  TouchBar: { TouchBarLabel, TouchBarButton, TouchBarSpacer }
} = remote

let onRedeem
let onSignout

const userLabel = new TouchBarLabel({ textColor: '#FFFFFF' })
const fullSpace = new TouchBarSpacer({ size: 'flexible' })
const redeemButton = new TouchBarButton({
  label: 'Redeem License',
  backgroundColor: '#32BC49',
  click: () => {
    onRedeem && onRedeem()
  }
})
const signoutButton = new TouchBarButton({
  label: 'Sign Out',
  backgroundColor: '#F63F32',
  click: () => {
    onSignout && onSignout()
  }
})

const touchbar = new TouchBar([redeemButton, fullSpace, userLabel, signoutButton])
