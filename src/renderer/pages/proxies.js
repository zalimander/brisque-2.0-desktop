import React, { Component } from 'react';

import crypto from 'crypto';
import { remote, ipcRenderer as ipc } from 'electron';

import Table from '~/components/Table';
import NoProxies from '~/assets/table/no-proxies.svg';
import Icon from '~/assets/sidebar/proxies.svg';
import styles from './_pages.scss';
import connect from 'react-redux/es/connect/connect'

const {
  TouchBar,
  TouchBar: { TouchBarLabel, TouchBarButton, TouchBarSpacer, TouchBarSegmentedControl }
} = remote

const testProxiesButton = new TouchBarButton({
  label: 'Test All Proxies',
  backgroundColor: '#32BC49',
  click: () => {
  }
})

function mapStateToProps(state) {
  return {
    proxies: state.proxies
  }
}

type Props = {
  proxies: array<object>
}

export default connect(
  mapStateToProps
)(class Proxies extends Component<Props> {
  static icon = Icon;

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const touchButtons = new TouchBarSegmentedControl(
      {
        mode: 'buttons',
        segments: [
          { icon: `${ __dirname }/${ process.env.NODE_ENV === 'production' ? 'touchbar/add.png' : 'assets/touchbar/add.png' }` },
          { icon: `${ __dirname }/${ process.env.NODE_ENV === 'production' ? 'touchbar/import.png' : 'assets/touchbar/import.png' }` },
          { icon: `${ __dirname }/${ process.env.NODE_ENV === 'production' ? 'touchbar/edit.png' : 'assets/touchbar/edit.png' }` },
        ],
        change : ()=>{
          switch (touchButtons.selectedIndex) {
            case 0:
              console.log('0')
              break;
            case 1:
              console.log('1')
              break;
            case 2:
              console.log('2')

          }
        }
      }
    );

    const fullSpace = new TouchBarSpacer({
      size:'flexible'
    })

    remote
      .getCurrentWindow()
      .setTouchBar(new TouchBar([fullSpace,testProxiesButton,fullSpace,touchButtons]))
  }

  componentWillUnmount() {}
  
  onExport = (selected, save) => {
    const { proxies } = this.props
    const filtered = selected.length === 0 ? proxies : proxies.filter(proxy => selected.indexOf(proxy.id) !== -1)
    save(JSON.stringify(filtered.map(proxy => Object.assign({}, proxy, { _id: undefined }))))
  }

  render() {
    const { proxies } = this.props;

    return (
      <div className={styles.container}>
        <Table
          name="Proxy"
          pluralName="Proxies"
          header={<h1>Proxies</h1>}
          noItemsSrc={NoProxies}
          importFilters={ ['json', 'txt'] }
          onImport={ proxies => ipc.send('proxy.import', proxies) }
          onExport={ this.onExport }
          onDelete={ ids => ipc.send('proxy.delete', ids) }
          data={proxies}
          columns={[
            {
              title: 'IP Address',
              accessor: 'ip',
              fontWeight: '600',
              fontSize: '1.15em',
              color: '#8CC7F7',
              flex: 0.25
            },
            {
              title: 'Port',
              accessor: 'port',
              flex: 0.35
            },
            {
              title: 'Username',
              accessor: 'user',
              flex: 0.35
            },
            {
              title: 'Password',
              accessor: 'pass'
            }
          ]}
        />
      </div>
    );
  }
})
