import React, { Component } from 'react'
import styles from './NumberStepper.scss'

type Props = {
  value?: number,
  min?: number,
  max?: number,
  onChange?: value => void
};

export default class NumberStepper extends Component<Props> {
  static defaultProps = {
    value: 1,
    min: 1,
    max: -1,
    onChange: undefined
  }
  
  constructor(props) {
    super(props)

    this.state = {
      value: props.value || 0
    }
  }
  
  setValue(setter) {
    const { onChange } = this.props
    this.setState(({ value: old }) => {
      const value = setter(old)
      if (typeof onChange === 'function') {
        onChange(value)
      }
      return { value }
    })
  }

  render() {
    const { title, min, max } = this.props
    const { value } = this.state

    return (
      <div className={styles.container}>
        <p className={ styles.title }>{ title }</p>
        <div className={styles.stepper}>
          <div
            className={[styles.button, styles.stepDown, value <= min && styles.disabled].join(' ')}
            onClick={ () => value > min && this.setValue(value => value > min ? value - 1 : min) }
          />
          <p className={styles.number}>{value}</p>
          <div
            className={[styles.button, styles.stepUp, (value >= max && max > -1) && styles.disabled].join(' ')}
            onClick={ () => (value < max || max === -1) && this.setValue(value => (value < max || max === -1) ? value + 1 : max) }
          />
        </div>
      </div>
    )
  }

}
