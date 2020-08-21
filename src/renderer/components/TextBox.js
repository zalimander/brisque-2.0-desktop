import React, { Component } from 'react'
import styles from './TextBox.scss'

export default class TextBox extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      value: props.value || ''
    }
  }
  
  render() {
    const { placeholder } = this.props
    const { title } = this.props
    const { value } = this.state
    
    return (
      <div className={styles.container}>
        <p className={ styles.title }>{ title }</p>
        <input
          type='text'
          value={ value }
          className={ styles.textBox }
          placeholder={ placeholder }
          onChange={ ({ target: { value } }) => this.setState({ value }) }
        />
      </div>
    )
  }
  
}
