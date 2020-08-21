import React, { Component } from 'react';
import styles from './AlertBox.scss';
import Button from './Button';

type Props = {
  title: string,
  subtitle: string,
  cancelType?: string,
  confirmType?: string,
  cancelTitle?: string,
  confirmTitle?: string
};

export default class AlertBox extends Component<Props> {
  static defaultProps = {
    cancelType: 'clear',
    confirmType: 'success',
    cancelTitle: 'Okay',
    confirmTitle: ''
  };

  render() {
    const {
      title,
      subtitle,
      cancelTitle,
      confirmTitle,
      cancelType,
      confirmType
    } = this.props;

    return (
      <div className={styles.container}>
        <div className={styles.alert}>
          <p className={styles.title}>{title}</p>
          <p className={styles.subtitle}>{subtitle}</p>
          <div className={styles.buttons}>
            <Button style={{ height: 50, fontSize: '18px' }} type={cancelType}>
              {cancelTitle}
            </Button>
            {confirmTitle && (
              <Button
                style={{ height: 50, fontSize: '18px' }}
                type={confirmType}
              >
                {confirmTitle}
              </Button>
            )}
          </div>
        </div>
        <div className={styles.mask} />
      </div>
    );
  }
}
