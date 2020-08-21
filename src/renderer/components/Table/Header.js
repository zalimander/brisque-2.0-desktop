import { remote } from 'electron'
import React, { Component } from 'react';
import fs from 'fs'

import Button from '~/components/Button';
import Row from './Row';
import styles from './Table.scss';

/* Images */
import AddButton from '~/assets/table/add.svg';
import AddButtonHover from '~/assets/table/add-hover.svg';
import DuplicateButton from '~/assets/table/duplicate.svg';
import ImportButton from '~/assets/table/import.svg';
import ImportButtonHover from '~/assets/table/import-hover.svg';
import ExportButton from '~/assets/table/export.svg';
import EditButton from '~/assets/table/edit.svg';
import EditButtonHover from '~/assets/table/edit-hover.svg';
import SaveButton from '~/assets/table/save.svg';

const { dialog } = remote

type Props = {
  name: string,
  header?: boolean,
  editing: boolean,
  columns: array,
  filters: array,
  importFilters: array,
  selected: array,
  selectedFilter: string,
  dataLength: number,
  onSelect: (filter: string) => void,
  onCreate?: void => void,
  onImport?: (string | object) => void,
  onExport?: (selected: array<string>, save: (exports: string) => void) => void,
  onEdit?: void => void
};

export default class Header extends Component<Props> {
  static defaultProps = {
    header: false,
    onCreate: undefined,
    onImport: undefined,
    onExport: undefined
  };
  
  constructor(props) {
    super(props)
    
    this.state = {
      open: false
    }
  }
  
  get headerButtons() {
    const { onCreate, onImport, onEdit, editing, dataLength, openComponent } = this.props;
    const { open } = this.state
    const buttons = [];
    
    if (typeof onCreate === 'function') {
      buttons.push({
        open,
        openComponent,
        src: AddButton,
        hoverSrc: AddButtonHover,
        activeSrc: DuplicateButton,
        activeText: 'Duplicate',
        onClick: () => this.setState({ open: !open })
      });
    }
    
    if (typeof onImport === 'function') {
      buttons.push({
        src: ImportButton,
        hoverSrc: ImportButtonHover,
        activeSrc: ExportButton,
        activeText: 'Export',
        onClick: () => {
          if (editing) {
            return this.showExport()
          }
          
          this.showImport()
        }
      });
    }
    
    if (typeof onEdit === 'function') {
      buttons.push({
        src: EditButton,
        hoverSrc: EditButtonHover,
        activeSrc: SaveButton,
        disabled: dataLength === 0,
        onClick: onEdit
      });
    }
    
    return buttons;
  }
  
  showExport() {
    const { name, onExport } = this.props
    dialog.showSaveDialog(remote.getCurrentWindow(), {
      title: `Export ${ name }`,
      message: `Choose a location to save your ${ name.toLowerCase() }`,
      defaultPath: name.toLowerCase(),
      filters: [{ name: 'JSON File', extensions: ['json'] }]
    }, file => {
      if (!file) {
        return
      }
      
      if (typeof onExport === 'function') {
        onExport(result => {
          if (typeof result !== 'string' || result.length === 0) {
            return
          }
          
          fs.writeFile(file, result, err => err && dialog.showMessageBox(remote.getCurrentWindow(), {
            type: 'error',
            title: 'Uh Oh!',
            message: `There was a problem saving your ${ name }, please try again!`,
            buttons: ['Okay'],
            defaultId: 0,
          }))
        })
      }
    })
  }
  
  showImport() {
    const { name, importFilters, onImport } = this.props
    const filters = [{
      name: `${ name } File`,
      extensions: importFilters.length === 0 ? ['json'] : importFilters
    }]
    
    dialog.showOpenDialog(remote.getCurrentWindow(), {
      title: `Import ${ name }`,
      message: `Select a file to import your ${ name.toLowerCase() } from, in ${ filters[0].extensions.join(' or ') } format`,
      properties: ['openFile'],
      filters
    }, files => {
      if (!files || files.length === 0) {
        return
      }
    
      fs.readFile(files[0], (err, contents) => {
        if (err) {
          return dialog.showMessageBox(remote.getCurrentWindow(), {
            type: 'error',
            title: 'Uh Oh!',
            message: `There was a problem reading your ${ name }, please try again!`,
            buttons: ['Okay'],
            defaultId: 0,
          })
        }
        
        if (typeof onImport === 'function') {
          onImport(files[0].toLowerCase().endsWith('.json') ? JSON.parse(contents) : contents.toString('utf8'))
        }
      })
    })
  }

  render() {
    const {
      header,
      columns,
      filters,
      selected,
      selectedFilter,
      onSelect,
      editing
    } = this.props;
    const { open } = this.state

    return (
      <div className={styles.header}>
        {/* Title and header buttons */}
        <div className={styles.row}>
          {header}
          <div className={styles.buttons}>
            <div className={ [styles.buttonBackground, open && styles.active].join(' ') }/>
            { this.headerButtons.map(button => (
                <Button
                  className={styles.button}
                  src={button.src}
                  hoverSrc={button.hoverSrc}
                  activeSrc={button.activeSrc}
                  activeText={button.activeText}
                  disabled={button.disabled}
                  selected={selected}
                  active={editing}
                  openComponent={ button.openComponent }
                  open={button.open}
                  width={36}
                  height={36}
                  onClick={button.onClick}
                  key={button.src}
                />
              ))}
          </div>
        </div>
        {/* Filter selector */}
        <div className={[styles.row, styles.selectors].join(' ')}>
          {filters.map(filter => {
            const title = typeof filter === 'string' ? filter : filter.title;
            const key =
              typeof filter === 'string' ? filter : filter.key || filter.title;
            return (
              <div
                className={[
                  styles.selector,
                  key ===
                    (selectedFilter.key ||
                      selectedFilter.title ||
                      selectedFilter) && styles.selected
                ].join(' ')}
                onClick={() => onSelect && onSelect(key)}
                onKeyDown={() => {}}
                role="presentation"
                key={title}
              >
                {title}
              </div>
            );
          })}
        </div>
        <Row columns={columns} editing={editing} header />
      </div>
    );
  }
}
