import React, { Component } from 'react';
import { css, StyleSheet } from 'aphrodite';
import { CSSTransition } from 'react-transition-group';
import cx from 'classnames';
import styles from './Button.scss';

const activeFontWeight = 700;
const activeFontSize = 16;

type Props = {
  width: number,
  height: number,
  type: string,
  open: boolean,
  openComponent: Component,
  className: string,
  children: Component,
  activeText: string,
  src: string,
  hoverSrc: string,
  activeSrc: string,
  iconSrc: string,
  disabled: boolean,
  active: boolean,
  style: object,
  selected: array,
  onClick: () => {}
};

export default class Button extends Component<Props> {
  constructor(props) {
    super(props);

    const { height } = this.props;
    this.styles = StyleSheet.create({
      button: {
        height: height || '100%'
      },
      disabled: {
        height: height || '100%',
        opacity: 0.25
      },
      activeText: {
        fontWeight: activeFontWeight,
        fontSize: activeFontSize
      }
    });
    this.state = {};

    if (props.activeText) {
      const canvas = document.createElement('canvas');
      this.context = canvas.getContext('2d');
      this.context.font = `${activeFontWeight} ${activeFontSize}px 'Open Sans', sans-serif`;
      const { context } = this;
      this.state = {
        open: props.activeText === 'Duplicate',
        activeTextWidth: context.measureText(props.activeText).width
      };
    }
  }

  componentDidUpdate(props) {
    const {
      props: { activeText },
      context
    } = this;
    if (activeText !== props.activeText) {
      /* eslint-disable-next-line */
      this.setState({
        activeTextWidth: context.measureText(props.activeText).width
      });
    }
  }

  onClick = event => {
    const { disabled, open, onClick } = this.props;
    if (!disabled && onClick && (!open || event.target instanceof Image)) {
      onClick.call(this, event);
    }
  };

  render() {
    const {
      className,
      children,
      style,
      width,
      height,
      disabled,
      selected,
      type,
      open,
      openComponent: OpenComponent,
      active,
      activeText,
      src,
      hoverSrc,
      activeSrc,
      iconSrc
    } = this.props;
    const { activeTextWidth } = this.state;
    const showingText = active && activeText;

    if (src) {
      return (
        <div
          className={[
            className,
            styles.container,
            css(this.styles.button),
            open && styles.open,
            active && styles.active,
            disabled && styles.disabled
          ].join(' ')}
          style={{
            height,
            width: width + (showingText ? activeTextWidth + 25 : 0),
            overflow: !active && !open ? 'hidden' : '',
            transform: showingText ? `scale(0.8)` : '',
            background: showingText ? '#FFFFFF1A' : '',
            border: showingText ? '1px solid #FFFFFF1A' : '',
            margin: showingText ? '0 -8px 0 -8px' : '',
            borderRadius: showingText ? 50 : ''
          }}
          onClick={this.onClick}
          onKeyUp={() => {}}
          role="presentation"
        >
          { OpenComponent &&
          <CSSTransition
            in={ open }
            classNames='pop'
            timeout={ 0 }
            unmountOnExit
          >
            <div className={ styles.dropdown }>
              <OpenComponent/>
            </div>
          </CSSTransition>
          }
          <CSSTransition
            in={typeof active === 'boolean' ? active : false}
            classNames="fade"
            timeout={250}
            unmountOnExit
          >
            <p className={ [styles.activeText, css(this.styles.activeText)].join(' ') }>{activeText}</p>
          </CSSTransition>
          <p
            className={styles.count}
            style={{
              transform: showingText ? 'scale(0.83)' : '',
              opacity: selected && selected.length !== 0 && showingText ? 1 : 0,
              width,
              height
            }}
          >
            {selected && selected.length}
          </p>
          <img
            className={styles.active}
            src={activeSrc}
            style={{
              transform: showingText ? 'scale(0.8)' : '',
              background: showingText ? '#FFFFFF1A' : '',
              border: showingText ? '2px solid #FFFFFF1A' : '',
              borderRadius: showingText ? '50%' : '',
              marginRight: showingText ? '-1px' : '',
              opacity:
                active && (selected.length === 0 || !showingText) ? 1 : 0,
              width,
              height
            }}
            alt=""
          />
          <img
            className={styles.hover}
            src={hoverSrc}
            style={{ width, height }}
            alt=""
          />
          <img src={src} style={{ width, height, transform: open ? 'rotateZ(45deg)' : '' }} alt="" />
        </div>
      );
    }

    return (
      <div
        style={style}
        onClick={this.onClick}
        onKeyUp={() => {}}
        role="presentation"
        className={cx({
          [styles.button]: true,
          [styles.rounded]: iconSrc,
          [styles[type]]: true,
          [className]: true
        })}
      >
        {children}
        {iconSrc && (
          <div className={styles.icon}>
            <img src={iconSrc} alt="" />
          </div>
        )}
      </div>
    );
  }
}
