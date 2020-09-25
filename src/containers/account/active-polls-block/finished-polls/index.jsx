/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, {
  useCallback, useState, useEffect,
} from 'react';
import { useDispatch } from 'react-redux';
import { getpollsAction } from '../../../../actions/polls';
import { BlockUpdater } from '../../../block-subscriber';
import SiteHeader from '../../../components/site-header';
import CustomTable from '../../../components/tables/table1';
import FinishedpollsItem from './finished-pools-item';

export default function Finishedpolls() {
  const dispatch = useDispatch();

  const [dataFinishedpolls, setDataFinishedpolls] = useState(null);
  const [currentPaggination, setCurrentPaggination] = useState({
    page: 1,
    firstIndex: 0,
    lastIndex: 15,
  });

  const getFinishedpolls = useCallback(async params => {
    const reqParams = {
      ...params,
      finishedOnly: true,
    };

    const finishedpolls = await dispatch(getpollsAction(reqParams));

    if (finishedpolls) {
      setDataFinishedpolls(finishedpolls.polls);
    }
  }, [dispatch]);

  const listener = useCallback(() => {
    getFinishedpolls(currentPaggination);
  }, [currentPaggination, getFinishedpolls]);

  const onPaginate = useCallback(page => {
    const pagination = {
      page,
      firstIndex: page * 15 - 15,
      lastIndex: page * 15,
    };

    setCurrentPaggination(pagination);

    getFinishedpolls(pagination);
  }, [getFinishedpolls]);

  useEffect(() => {
    getFinishedpolls();
    BlockUpdater.on('data', listener);

    return () => BlockUpdater.removeListener('data', listener);
  }, [getFinishedpolls, listener]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="Finished Polls" />
      <div className="page-body container-fluid">
        <CustomTable
          header={[
            {
              name: 'Title',
              alignRight: false,
            }, {
              name: 'Description',
              alignRight: false,
            }, {
              name: 'Sender',
              alignRight: false,
            }, {
              name: 'Start date',
              alignRight: false,
            }, {
              name: 'Actions',
              alignRight: true,
            },
          ]}
          className="no-min-height mb-3"
          emptyMessage="No finished polls."
          TableRowComponent={el => <FinishedpollsItem {...el} activepolls />}
          tableData={dataFinishedpolls}
          hintClassName="mt-4"
          isPaginate
          page={currentPaggination.page}
          previousHendler={() => onPaginate(currentPaggination.page - 1)}
          nextHendler={() => onPaginate(currentPaggination.page + 1)}
          itemsPerPage={15}
        />
      </div>
    </div>
  );
}
