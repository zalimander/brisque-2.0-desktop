import React, { Component } from 'react'
import { CSSTransition } from 'react-transition-group'
import styles from './DatePicker.scss'
import Select from './Select'

type Props = {
  placeholder: string,
  title: string
};

export default class DatePicker extends Component<Props> {

  constructor(props) {
    super(props)

    this.state = {
      value: props.value || '',
      open: true,
      changing: false
    }
  }
  
  componentWillUnmount() {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout)
    }
  }
  
  toggleBox = () => {
    const { open } = this.state
    if (!open) {
      this.input.focus()
    }
    this.setState({ open: !open })
  }
  
  scheduleClose = () => this.closeTimeout = setTimeout(() => this.setState({ open: false, changing: true }), 120)

  render() {
    const { placeholder, title, value } = this.props;
    const { open, changing } = this.state
    
    const today = new Date()
    const dates = new Array(7).fill().map((d, i) => new Date(today.valueOf() + (i * 24 * 60 * 60 * 1000)))
    
    return (
      <div className={styles.container}>
        <p className={ styles.title }>{ title }</p>
        <div className={[styles.comboBox, open && styles.active].join(' ')}>
          <input
            type='text'
            className={ styles.textBox }
            placeholder={ placeholder }
            ref={ ref => {this.input = ref} }
            value={ value }
            onFocus={ () => this.setState({ open: true }) }
            onBlur={ this.scheduleClose }
            onChange={ ({ target }) => this.setState({ value: target.value })}
          />
          <div className={[styles.arrow, open && styles.active].join(' ')} onClick={ !open && !changing ? this.toggleBox : undefined }/>
        </div>
        <CSSTransition
          in={ open }
          timeout={300}
          classNames="fade"
          unmountOnExit
          onExited={ () => this.setState({ changing: false }) }
        >
          <div className={styles.picker}>
            <p className={styles.month}>{ today.toLocaleDateString(undefined, { month: 'long' }) }</p>
            <div className={styles.week}>
              <div className={styles.arrow} style={{ transform: `rotate(90deg)` }}/>
              { dates.map(date => (
                <div className={ styles.day } key={ date }>
                  <p className={ styles.dayName }>{ date.toLocaleDateString(undefined, { weekday: 'short' }) }</p>
                  <p className={ styles.dayNumber }>{ date.getDate() }</p>
                </div>
              )) }
              { /*
              <div className={styles.day}>
                <p className={styles.dayName}>sun</p>
                <p className={styles.dayNumber}>2</p>
              </div>
              <div className={styles.day}>
                <p className={styles.dayName}>mon</p>
                <p className={styles.dayNumber}>3</p>
              </div>
              <div className={styles.day}>
                <p className={styles.dayName}>tue</p>
                <p className={styles.dayNumber}>4</p>
              </div>
              <div className={styles.day}>
                <p className={styles.dayName}>wed</p>
                <p className={styles.dayNumber}>5</p>
              </div>
              <div className={styles.day}>
                <p className={styles.dayName}>thu</p>
                <p className={styles.dayNumber}>6</p>
              </div>
              <div className={styles.day}>
                <p className={styles.dayName}>fri</p>
                <p className={styles.dayNumber}>7</p>
              </div>
              <div className={styles.day}>
                <p className={styles.dayName}>sat</p>
                <p className={styles.dayNumber}>8</p>
              </div>
              */ }
              <div className={styles.arrow} style={{ transform: `rotate(-90deg)` }}/>
            </div>
            <div className={styles.time}>
              <Select options={ new Array(12).fill().map((_, i) => ({ item: i + 1 })) } placeholder='00' width='59px' onFocus={ () => clearTimeout(this.closeTimeout) } onBlur={ () => this.input.focus() }/>
              <p className={styles.timeTitle}>:</p>
              <Select options={ [{ item: 'hi' },{item:'hi again'}] } placeholder='00' width='59px'/>
              <p className={styles.timeTitle}>:</p>
              <Select options={ [{ item: 'hi' },{item:'hi again'}] } placeholder='00' width='59px'/>
              <Select options={ [{ item: 'AM' },{item:'PM'}] } value='AM' width='65px'/>
            </div>
          </div>
        </CSSTransition>
      </div>
    )
  }

}
