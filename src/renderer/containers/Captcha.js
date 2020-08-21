import React, { Component } from 'react'
import styles from './Captcha.scss'
import Select from '../components/Select'
import Button from '../components/Button'
import YouTube from '../assets/YouTube.svg'
import CaptchaLogo from '../assets/captchaWhite.svg'
import closeIcon from '../assets/UI/closeTab.svg'
import newTab from '../assets/UI/newTab.svg'

export default class Captcha extends Component {
  
  render() {
    return (
      <div className={styles.root}>
        <div className={styles.tabBar}>
          <div className={ [styles.tab, styles.active].join(' ') }>
            <p className={styles.title}>1</p>
            <div className={ styles.close }>
              <img src={closeIcon} alt=""/>
            </div>
          </div>
          <div className={ [styles.tab, styles.activee].join(' ') }>
            <p className={styles.title}>2</p>
          </div>
          <div className={ [styles.tab, styles.activee].join(' ') }>
            <p className={styles.title}>3</p>
          </div>
          <div className={ [styles.tab, styles.activee].join(' ') }>
            <p className={styles.title}>4</p>
          </div>
          <div className={ [styles.tab, styles.activee].join(' ') }>
            <p className={styles.title}>5</p>
          </div>
          <div className={ [styles.tab, styles.activee].join(' ') }>
            <div className={styles.newTab}>
              <img src={newTab} alt=""/>
            </div>
          </div>
        </div>
        <div className={styles.captchaArea}>
          <div className={styles.container}>
            <Select options={ [{ item: 'hi' },{item:'hi again'}] } title='proxy' placeholder='Select Proxy'/>
            <Button type='youtube'>
              <img src={YouTube} alt=""/>
            </Button>
            <div className={styles.captcha}>
              <div className={styles.waiting}>
                <img src={CaptchaLogo} alt=""/>
                <p className={styles.info}>Waiting for reCAPTCHA…</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  
}
