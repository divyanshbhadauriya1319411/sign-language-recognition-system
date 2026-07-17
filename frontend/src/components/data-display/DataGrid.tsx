'use client';

import React from 'react';
import clsx from 'clsx';
import { Table, TableProps } from './Table';

/**
 * DataGrid wrapper around Table optimized for dense records and complex cell renderers.
 */
export function DataGrid<T>(props: TableProps<T>) {
  return (
    <div className="space-y-3">
      <Table {...props} className={clsx('border-2 border-border/80 shadow-md', props.className)} />
    </div>
  );
}
