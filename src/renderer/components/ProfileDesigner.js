import React, { Component } from 'react'
import styles from './ProfileDesigner.scss'
import { cardStyles } from '../assets/cardStyles'

export default class ProfileDesigner extends Component {

  constructor(props) {
    super(props)

    this.state = {
      value: props.value || ''
    }
  }

  render() {

    return (
      <div className={styles.container}>
        <div className={styles.cardGradients}>
          {cardStyles.map(style => (
            <div
              className={styles.gradient}
              style={{ backgroundImage: `url(${ style.preview })` }}
              onClick={ () => console.log(style.gradient) }
              key={style.id}
            />
          ))}
        </div>
          <div className={styles.cardPreview}>
            <div className={styles.cardContent}>
              <p className={styles.profileTitle}>Astroworld Express</p>
              <p className={styles.cardNumber}>1234&nbsp;&nbsp;5678&nbsp;&nbsp;9012&nbsp;&nbsp;3456</p>
              <div className={styles.cardInfo}>
                <div className={styles.cardHolder}>
                  <p className={styles.subtitle}>card holder</p>
                  <p className={styles.title}>Kylie Jenner</p>
                </div>
                <div className={styles.cardExpiration}>
                  <p className={styles.subtitle}>expires</p>
                  <p className={styles.title}>01/2023</p>
                </div>
              </div>
            </div>
            <div className={styles.cardDesign}/>
          </div>
      </div>
    )
  }

}
