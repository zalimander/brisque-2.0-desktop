import React, { Component } from 'react'
import { TransitionGroup, CSSTransition } from 'react-transition-group'
import styles from './SegmentedControl.scss'

export default class SegmentedControl extends Component {
  
  constructor(props) {
    super(props)
    
    this.state = {
      selected: props.segments[0].title
    }
  }
  
  render() {
    const { title, segments, width } = this.props
    const { selected } = this.state
    
    return (
      <React.Fragment>
        <h2 className={ styles.title } style={{ width: width - 40 }}>{ title }</h2>
        <div className={ styles.selector }>
          { segments.map(({ title }) => (
            <p
              className={ selected === title ? styles.selected : '' }
              onClick={ () => this.setState({ selected: title }) }
              key={ title }
            >
              { title }
            </p>
          )) }
        </div>
        <TransitionGroup style={{ position: 'relative' }}>
          { segments.map(({ title, component }) => selected === title && (
            <CSSTransition
              key={ title }
              classNames='absolute delayed-enter fade'
              timeout={ 250 }
            >
              { component }
            </CSSTransition>
          ))}
        </TransitionGroup>
      </React.Fragment>
    )
  }
  
}
