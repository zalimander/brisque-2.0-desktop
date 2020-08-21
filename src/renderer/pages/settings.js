import React, { Component } from 'react';
import { remote } from 'electron';
import Icon from '~/assets/sidebar/settings.svg';
import styles from './settings.scss';
import Button from '~/components/Button';
import Checkbox from '~/components/Checkbox';
import TextBox from '../components/TextBox';
import AlertBox from '../components/AlertBox';
import Logo from '~/assets/logo.png';

const {
  TouchBar,
  TouchBar: { TouchBarLabel, TouchBarSpacer, TouchBarButton }
} = remote;

export default class Settings extends Component {
  static icon = Icon;

  componentDidMount() {
    const label = new TouchBarLabel();
    label.label = 'Brisque IO v2.0.0';
    label.textColor = '#FFFFFF';

    const fullSpace = new TouchBarSpacer({
      size: 'flexible'
    });

    const updateButton = new TouchBarButton({
      label: 'Check For Updates',
      backgroundColor: '#663EB5',
      click: () => {}
    });

    remote
      .getCurrentWindow()
      .setTouchBar(new TouchBar([label, fullSpace, updateButton]));
  }

  componentWillUnmount() {}

  render() {
    return (
      <div className={styles.settings}>
        <AlertBox
          title="Hold up..."
          subtitle="Something something blah blah blah im tired bruh"
          confirmTitle="Yes"
          confirmType="danger"
        />
        <div className={styles.updateInfo}>
          <img className={styles.logo} src={Logo} alt="" />
          <div className={styles.updateOptions}>
            <h1>
              Brisque IO&nbsp;<span className={styles.subtitle}>v2.0.0</span>
            </h1>
            <p className={styles.textButton}>Check For Updates</p>
          </div>
        </div>
        <div className={styles.section}>
          <h1>Webhook</h1>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.input}>
                <TextBox title="discord" placeholder="Discord Webhook" />
                <Button>Test Discord Webhook</Button>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.input}>
                <TextBox title="slack" placeholder="Slack Webhook" />
                <Button>Test Slack Webhook</Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <h1>Delay</h1>
          <div className={styles.row}>
            <div className={styles.column}>
              <div className={styles.input}>
                <TextBox title="monitor" placeholder="1000" />
                <Button type="danger">Reset Monitor Delay</Button>
              </div>
            </div>
            <div className={styles.column}>
              <div className={styles.input}>
                <TextBox title="error" placeholder="1000" />
                <Button type="disabled">Reset Error Delay</Button>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <h1>Proxies</h1>
          <div className={styles.row}>
            <Checkbox text="Automatically Delete Failed Proxies" />
          </div>
        </div>
      </div>
    );
  }
}
