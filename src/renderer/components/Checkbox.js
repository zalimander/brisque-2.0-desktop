import React, { Component } from 'react'
import styles from './Checkbox.scss'

type Props = {
  onChange?: object => void,
  checked?: boolean,
  style?: object,
  text?: string
};

export default class Checkbox extends Component<Props> {
  static defaultProps = {
    onChange: undefined,
    checked: false,
    style: {},
    text: ''
  }
  
  render() {
    const { onChange, checked, style, text } = this.props
    
    return (
      <div className={styles.container} style={ style }>
        <input
          className={ styles.checkbox }
          type='checkbox'
          checked={ checked }
          onChange={ onChange }
        />
        <p className={styles.checkboxText}>{ text }</p>
      </div>
    )
  }
  
}
