import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './Select.scss'
import Checkbox from './Checkbox'

type Props = {
  placeholder: string,
  title: string,
  options: array,
  width: string,
  value: string,
  multiple: boolean,
  fixed?: boolean,
  onChange: (value: string | object) => void
};

export default class Select extends Component<Props> {
  static defaultProps = {
    fixed: false
  }
  
  constructor(props) {
    super(props)
    
    this.state = {
      value: props.value || '',
      open: false,
      changing: false
    }
  }
  
  toggleBox = () => {
    const { onFocus } = this.state
    const { open } = this.state
    if (!open) {
      onFocus && onFocus()
      return this.input.focus()
    }
    this.setState({ open: !open })
  }
  
  onKeyPress = event => {
    const { onChange, fixed, value } = this.props
    const { key } = event
    
    if (fixed || typeof value === 'object') {
      event.preventDefault()
    }
    
    if (typeof value === 'object' && (key === 'Backspace' || key === 'Delete')) {
      return onChange('')
    }
  }
  
  onFocus = () => {
    const { onFocus } = this.props
    this.setState({ open: true })
    onFocus && onFocus()
  }
  
  onBlur = () => {
    const { onBlur } = this.props
    this.setState({ open: false, changing: true })
    onBlur && onBlur()
  }
  
  render() {
    const { placeholder, title, options, value, width, multiple, fixed, onChange } = this.props
    const { open, changing } = this.state
    
    return (
      <div className={ styles.container } style={ { width } }>
        <p className={ styles.title }>{ title }</p>
        <div className={ [styles.comboBox, open && styles.active].join(' ') }>
          <input
            type='text'
            className={ styles.textBox }
            placeholder={ placeholder }
            ref={ ref => {
              this.input = ref
            } }
            style={ { caretColor: fixed && 'transparent' } }
            value={ typeof value === 'object' ? (value.title || value.item) : value }
            onKeyDown={ this.onKeyPress }
            onFocus={ this.onFocus }
            onBlur={ this.onBlur }
            onChange={ ({ target }) => onChange(target.value) }
          />
          <div
            className={ [styles.arrow, open && styles.active].join(' ') }
            onClick={ !open && !changing ? this.toggleBox : undefined }
            onKeyUp={ () => {
            } }
            role='presentation'
          />
        </div>
        <CSSTransition
          in={ open }
          timeout={ 300 }
          classNames="fade"
          unmountOnExit
          onExited={ () => this.setState({ changing: false }) }
        >
          <div className={ styles.comboList }>
            <div className={ styles.options }>
              { options.map(option => (
                <div
                  className={ styles.option }
                  key={ option.item }
                  onClick={ () => onChange(option) }
                  onKeyUp={ () => {
                  } }
                  role='presentation'
                >
                  { multiple ?
                    <Checkbox style={ { marginLeft: `10px` } } text={ option.item }/> :
                    <p className={ styles.optionTitle }>{ option.item }</p>
                  }
                </div>
              )) }
            </div>
          </div>
        </CSSTransition>
      </div>
    )
  }
  
}
