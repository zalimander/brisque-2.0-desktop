import React, { Component } from 'react'
import styles from './ProfileSelector.scss'

export default class ProfileSelector extends Component {

  constructor(props) {
    super(props)

    this.state = {
      value: props.value || ''
    }
  }

  render() {
    const { placeholder } = this.props
    const { title } = this.props
    const {widthValue} = this.props

    return (
      <div className={styles.container}>
        <p className={ styles.title }>{ title }</p>
        <div className={styles.comboBox}>
          <div className={styles.cardPreview}/>
          <div className={styles.infoContainer}>
            <p className={styles.cardTitle}>No Profile</p>
            <p className={styles.subtitle}>Select a Profile</p>
          </div>
          <div className={styles.arrow}/>
        </div>
      </div>
    )
  }

}
