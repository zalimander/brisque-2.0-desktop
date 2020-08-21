import React, { Component } from 'react'

import { remote, ipcRenderer as ipc } from 'electron'
import { connect } from 'react-redux';

import Table from '~/components/Table'
import CreateTask from '~/components/CreateTask'
import CreateProfile from '~/components/CreateProfile'
import Icon from '~/assets/sidebar/tasks.svg'
import StartArrow from '~/assets/start-arrow.svg'
import StartButton from '~/assets/start.svg'
import StopButton from '~/assets/stop.svg'
import StopWhite from '~/assets/stop-white.svg'
import ArchiveButton from '~/assets/table/archive.svg'
import DeleteButton from '~/assets/table/delete.svg'
import NoTasks from '~/assets/table/no-tasks.svg'
import styles from './_pages.scss'

const {
  TouchBar,
  TouchBar: {TouchBarButton, TouchBarSpacer, TouchBarSegmentedControl }
} = remote

function mapStateToProps(state) {
  return {
    tasks: state.tasks,
    profiles: state.profiles
  }
}

type Props = {
  tasks: array<object>,
  profiles: array<object>
}

export default connect(
  mapStateToProps
)(class Tasks extends Component<Props> {
  static icon = Icon
  
  constructor() {
    super()
    
    this.state = {
      selectedFilter: 'all'
    }
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

    const touchSections = new TouchBarSegmentedControl(
      {
        segments: [
          { label:'All Tasks' },
          { label:'Manual' },
          { label:'Archived' },
        ],
      }
    );

    const fullSpace = new TouchBarSpacer({
      size:'flexible'
    })


    const startButton = new TouchBarButton({
      label: 'Start All Tasks',
      backgroundColor: '#32BC49',
      click: () => {
        this.setState(({ tasks }) => ({
          tasks: tasks.map(task =>
            Object.assign({}, task, { status: 'SEARCHING' })
          )
        }))
      }
    })
    
    const stopButton = new TouchBarButton({
      label: 'Stop All Tasks',
      backgroundColor: '#FF003D',
      click: () => {
        this.setState(({ tasks }) => ({
          tasks: tasks.map(task => Object.assign({}, task, { status: 'IDLE' }))
        }))
      }
    })
    
    remote
      .getCurrentWindow()
      .setTouchBar(new TouchBar([touchSections, fullSpace, fullSpace, touchButtons]))
  }
  
  get columns() {
    const { profiles } = this.props
    const { selectedFilter } = this.state
    
    return [
      {
        title: 'Store',
        accessor: 'store',
        style: {
          color: '#8CC7F7',
          fontWeight: '600',
          fontSize: '1.15em'
        },
        flex: 0.65
      },
      {
        title: 'Product',
        accessor: 'keywords',
        flex: 0.75
      },
      {
        title: 'Size',
        accessor: 'size',
        flex: 0.5
      },
      {
        title: 'Style',
        accessor: 'style',
        flex: 0.5
      },
      {
        title: 'Profile',
        accessor: data => {
          const profile = profiles.find(profile => profile._id === data.profile)
          return profile ? profile.name : <span style={{ color: '#FF4C40' }}>Missing Profile</span>
        },
        flex: 0.65
      },
      {
        title: 'Start Time',
        accessor: 'schedule'
      },
      {
        title: 'Status',
        accessor: 'message'
      },
      {
        accessor: (data, editing) => (
          <React.Fragment>
            <div
              style={ {
                width: 16,
                position: 'relative',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginLeft: 5
              } }
            >
              { (data.status === 'FAILED' || /* Start Button */
                data.status === 'IDLE') && !editing /* eslint-disable-next-line */ && (
                <img
                  alt=""
                  src={ StartButton }
                  style={ { cursor: 'pointer' } }
                  onClick={ () => ipc.send('task.start', [data._id]) }
                />
              ) }
              { data.status !== 'FAILED' && /* Stop Button */
              data.status !== 'IDLE' &&
              data.status !== 'ARCHIVED' &&
              !data.archived && !editing /* eslint-disable-next-line */ && (
                <img
                  alt=""
                  src={ StopButton }
                  style={ { cursor: 'pointer' } }
                  onClick={ () => ipc.send('task.stop', [data._id]) }
                  onKeyUp={ () => {
                  } }
                />
              ) }
              { editing && (
                <img
                  alt=""
                  src={ selectedFilter === 'archived' ? DeleteButton : ArchiveButton }
                  style={ { cursor: 'pointer' } }
                  onClick={ () => ipc.send(`task.${ selectedFilter === 'archived' ? 'delete' : 'archive' }`, [data._id]) }
                  onKeyUp={ () => {
                  } }
                />
              ) }
            </div>
          </React.Fragment>
        ),
        style: {
          justifyContent: 'flex-end',
          position: 'relative'
        },
        flex: 0.25
      }
    ]
  }
  
  get faButtons() {
    return {
      start: {
        iconSrc: StartArrow,
        content: 'Start All Tasks',
        type: 'success',
        onClick: () => {
          this.setState(({ tasks }) => ({
            tasks: tasks.map(task =>
              Object.assign({}, task, { status: 'SEARCHING' })
            )
          }))
        }
      },
      stop: {
        iconSrc: StopWhite,
        content: 'Stop All Tasks',
        type: 'danger',
        onClick: () => {
          this.setState(({ tasks }) => ({
            tasks: tasks.map(task =>
              Object.assign({}, task, { status: 'IDLE' })
            )
          }))
        }
      }
    }
  }
  
  onExport = (selected, save) => {
    const { tasks } = this.state
    const filtered = selected.length === 0 ? tasks : tasks.filter(task => selected.indexOf(task._id) !== -1)
    save(JSON.stringify(filtered.map(task => Object.assign({}, task, { _id: undefined, logs: undefined }))))
  }
  
  render() {
    const { selectedFilter } = this.state
    const { tasks } = this.props
    
    return (
      <div className={ styles.container }>
        <Table
          ref={ ref => this.table = ref }
          name="Task"
          data={ tasks }
          header={ <h1>Tasks</h1> }
          noItemsSrc={ NoTasks }
          columns={ this.columns }
          filters={ [
            {
              key: 'manual',
              title: 'Manual',
              filter: data =>
                data && !data.archived && data.schedule === 'Manual'
            }
          ] }
          faButtons={ this.faButtons }
          faSelected={
            tasks.length &&
            selectedFilter !== 'archived' &&
            (tasks.some(task => task.status === 'IDLE') ? 'start' : 'stop')
          }
          openComponent={ CreateTask }
          onSelectedFilter={ selectedFilter => this.setState({ selectedFilter }) }
          onCreate={ () => {
          } }
          onDelete={ ids => ipc.send('task.delete', ids) }
          onArchive={ ids => ipc.send('task.archive', ids) }
          onImport={ tasks => ipc.send('task.import', tasks) }
          onExport={ this.onExport }
        />
      </div>
    )
  }
})
