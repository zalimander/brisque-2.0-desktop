import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { TransitionGroup, CSSTransition } from 'react-transition-group'

import Button from '~/components/Button'
import Header from './Header'
import Row from './Row'
import styles from './Table.scss'

/* Images */
import AddButton from '~/assets/table/add.svg'
import ImportButton from '~/assets/table/import.svg'
import ArchiveButton from '~/assets/table/archive.svg'
import DeleteButton from '~/assets/table/delete-white.svg'

type Props = {
  name: string,
  pluralName?: string,
  noItemsSrc: string,
  faSelected?: string,
  header: string,
  data: array,
  columns: array,
  filters?: array,
  importFilters?: array,
  faButtons?: object,
  onCreate?: void => void,
  onImport?: (string | object) => void,
  onExport?: string => void,
  onArchive?: (ids: array) => void,
  onDelete?: (ids: array) => void,
  onSelectedFilter?: (filter: string) => void
};

export default class Table extends Component<Props> {
  static defaultProps = {
    pluralName: '',
    faSelected: '',
    filters: [],
    importFilters: [],
    faButtons: {},
    onCreate: undefined,
    onImport: undefined,
    onExport: undefined,
    onArchive: undefined,
    onDelete: undefined
  }
  
  constructor(props) {
    super(props)
    
    this.state = {
      editing: false,
      selectedFilter: 'all',
      selected: []
    }
    
    this.bodyRef = React.createRef()
    this.headerRef = React.createRef()
  }
  
  componentDidUpdate(props, state) {
    const { selectedFilter } = this.state
    if (selectedFilter !== state.selectedFilter) {
      /* eslint-disable-next-line */
      findDOMNode(this.bodyRef.current).scrollTo(0, 0)
    }
  }
  
  get filters() {
    const { filters = [], name, pluralName, onArchive } = this.props
    
    const parsed = [
      {
        key: 'all',
        title: `All ${pluralName || `${name}s`}`,
        filter: ({ archived }) => !archived
      }
    ].concat(filters)
    
    if (onArchive) {
      parsed.push({
        key: 'archived',
        title: `Archived`,
        filter: ({ archived }) => archived
      })
    }
    
    return parsed
  }
  
  get filteredData() {
    const { data } = this.props
    const { selectedFilter } = this.state
    const { filter } = this.filters.find(filter => (filter.key || filter.title || filter) === selectedFilter)
    
    return filter ? data.filter(filter) : data
  }
  
  get body() {
    const { name, pluralName, noItemsSrc, columns, onCreate } = this.props
    const { editing, selected, selectedFilter } = this.state
    const { filteredData } = this
    
    return (
      <div className={ styles.body } ref={ this.bodyRef }>
        <CSSTransition in={ !filteredData.length } classNames="fade" timeout={ 250 } unmountOnExit>
          <div className={ styles.noItems }>
            <img src={ noItemsSrc } alt=""/>
            <h1>
              No { selectedFilter === 'archived' && 'Archived ' }{ pluralName || `${name}s` }
            </h1>
            { selectedFilter === 'archived' ? (
              <p>
                { pluralName || `${name}s` } that you&apos;re done with will appear here!
              </p>
            ) : (
              <p>
                Click
                <img
                  src={ onCreate ? AddButton : ImportButton }
                  style={ { width: '1.5em', height: '1.5em' } }
                  alt=""
                />
                above to { onCreate ? 'create one' : 'import some' }!
              </p>
            ) }
          </div>
        </CSSTransition>
        <TransitionGroup className={ styles.bodyScroller }>
          { filteredData.map(data => (
            <CSSTransition
              key={ data._id }
              classNames="height fade"
              timeout={ 250 }
              unmountOnExit
            >
              <Row
                data={ data }
                columns={ columns }
                editing={ editing }
                selected={ selected.indexOf(data._id) !== -1 }
                onSelected={ () =>
                  this.setState(({ selected: select }) => ({
                    selected:
                      select.indexOf(data._id) !== -1
                        ? select.filter(id => id !== data._id)
                        : select.concat(data._id)
                  }))
                }
              />
            </CSSTransition>
          )) }
        </TransitionGroup>
      </div>
    )
  }
  
  get fab() {
    const {
      name,
      pluralName,
      faButtons,
      faSelected,
      onArchive,
      onDelete
    } = this.props
    const { editing, selected, selectedFilter } = this.state
    const data = this.filteredData
    
    let selectedButton = faSelected
    if (selectedFilter.key === 'archived' || data.length === 0) {
      selectedButton = ''
    }
    if (editing && data.length > 0) {
      const all = selected.length === 0 || selected.length === data.length
      const plural = all || selected.length !== 1
      const archive =
        onArchive && selectedFilter && selectedFilter !== 'archived'
      const action = archive ? 'Archive' : 'Delete'
      const count = all ? 'All' : selected.length
      faButtons.remove = {
        iconSrc: archive ? ArchiveButton : DeleteButton,
        type: 'danger',
        content: `${action} ${count} ${(plural ? pluralName : name) || name}${
          plural && !pluralName ? 's' : ''
          }`,
        onClick: () => {
          const ids =
            selected.length === 0
              ? this.filteredData.map(({ _id }) => _id)
              : selected
          if (archive && typeof onArchive === 'function') {
            onArchive(ids)
          } else if (typeof onDelete === 'function') {
            onDelete(ids)
          }
          this.setState({ editing: false, selected: [] })
        }
      }
      selectedButton = 'remove'
    }
    
    return (
      <div className={ styles.fab }>
        { Object.keys(faButtons)
          .filter(button => button === selectedButton)
          .map(title => {
            const button = faButtons[title]
            return (
              <Button
                onClick={ button.onClick }
                iconSrc={ button.iconSrc }
                type={ button.type }
                className={ styles.fabButton }
                key={ title }
              >
                { button.children || button.content }
              </Button>
            )
          }) }
      </div>
    )
  }
  
  showImport = () => this.headerRef.current.showImport()
  showExport = () => this.headerRef.current.showExport()
  
  render() {
    const {
      name,
      pluralName,
      columns,
      header,
      openComponent,
      onCreate,
      onImport,
      onExport,
      onDelete,
      onSelectedFilter,
      importFilters
    } = this.props
    const { editing, selectedFilter: filter, selected } = this.state
    const dataLength = this.filteredData.length
    
    return (
      <div className={ styles.container }>
        <Header
          ref={ this.headerRef }
          name={ pluralName || `${name}s` }
          header={ header }
          columns={ columns }
          filters={ this.filters }
          dataLength={ dataLength }
          selected={ selected }
          selectedFilter={ filter }
          openComponent={ openComponent }
          onSelect={ selectedFilter => {
            this.setState({ selectedFilter })
            onSelectedFilter && onSelectedFilter(selectedFilter)
          } }
          onCreate={ onCreate }
          onImport={ typeof onImport === 'function' && (imports => {
            this.setState({ editing: false, selected: [] })
            onImport(imports)
          }) }
          onExport={ typeof onImport === 'function' && (save => {
            this.setState({ editing: false, selected: [] })
            onExport(selected, save)
          }) }
          onEdit={ typeof onDelete === 'function' && (() => {
            this.setState({ editing: !editing, selected: [] })
          }) }
          importFilters={ importFilters }
          headerButtons={ this.headerButtons }
          editing={ editing && dataLength > 0 }
        />
        { this.body }
        { this.fab }
      </div>
    )
  }
}
