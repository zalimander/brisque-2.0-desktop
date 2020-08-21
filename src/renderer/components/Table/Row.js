import React, { Component } from 'react';

import Checkbox from '~/components/Checkbox';
import styles from './Table.scss';

type Props = {
  header: boolean,
  editing: boolean,
  selected: array,
  columns: array,
  data: array,
  onSelected: () => {}
};

export default class Row extends Component<Props> {
  shouldComponentUpdate(props) {
    const { header, editing, selected, data } = this.props;
    return header ||
      editing !== props.editing ||
      selected !== props.selected ||
      data.status !== props.data.status ||
      data.archived !== props.data.archived;
  }

  createColumn(from) {
    if (from.img) {
      return <img src={from.img} alt="" />;
    }

    const { data, editing } = this.props;
    if (typeof from.accessor === 'function') {
      return from.accessor(data, editing);
    }

    return from.accessor.split('.').reduce((acc, cur) => acc[cur], data);
  }

  render() {
    const { header, columns, editing, selected, onSelected } = this.props;

    return (
      <div
        className={styles.row}
        onClick={evt => editing && !(evt.target instanceof Image) && onSelected && onSelected()}
        onKeyDown={() => {}}
        role="presentation"
      >
        {editing && (
          <div
            className={styles.column}
            style={Object.assign(
              { flex: 0 },
              header ? { opacity: 0, height: 0 } : {}
            )}
          >
            <Checkbox checked={selected} onChange={onSelected} />
          </div>
        )}
        {columns.map(column => (
          <div
            className={styles.column}
            key={column.accessor}
            style={{
              ...(header && !column.identical ? column.headerStyle : column.style),
              flex: column.flex === undefined ? 1 : column.flex
            }}
          >
            {header ? column.title : this.createColumn(column)}
          </div>
        ))}
      </div>
    );
  }
}
