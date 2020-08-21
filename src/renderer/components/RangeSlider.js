import React, { Component } from 'react'
import styles from './RangeSlider.scss'

type Props = {
  title: string,
  leftTitle: string,
  centerTitle: string,
  rightTitle: string,
  min: number,
  max: number
};

export default class RangeSlider extends Component<Props> {

  constructor(props) {
    super(props)

    this.state = {
      value: props.value || ''
    }
  }

  render() {
    const { title,leftTitle,centerTitle,rightTitle, min, max, value } = this.props

    return (
      <div className={styles.container}>
        <p className={ styles.title }>{ title }</p>
        <div className={ styles.pin }>
          <p>0</p>
        </div>
        <input type="range" min={min} max={max} className={styles.slider}/>
        <div className={styles.labels}>
          <p>{leftTitle}</p>
          <p>{centerTitle}</p>
          <p>{rightTitle}</p>
        </div>
      </div>
    )
  }

}
