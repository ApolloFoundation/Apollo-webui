/** ****************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ***************************************************************************** */

import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getAccountCurrenciesAction } from 'actions/currencies';
import SiteHeader from 'containers/components/site-header';
import { getAccountRsSelector } from 'selectors';
import { TableLoader } from 'containers/components/TableLoader';
import MyCurrencytemItem from './my-currency-item';

export default function MyMadedCurrencies() {
  const dispatch = useDispatch();
  const accountRS = useSelector(getAccountRsSelector);

  const getExchanges = useCallback(async ({ firstIndex, lastIndex }) => {
    const exchanges = (await dispatch(getAccountCurrenciesAction({
      account: accountRS,
      firstIndex,
      lastIndex,
    })));

    if (!exchanges) return [];

    const accountCurrencies = exchanges.accountCurrencies
      .filter(el => el.code && el.name && el.type !== undefined);
    return accountCurrencies;
  }, [accountRS, dispatch]);

  return (
    <div className="page-content">
      <SiteHeader pageTitle="My currencies" />
      <div className="page-body container-fluid">
        <TableLoader
          headersList={[
            {
              name: 'Code',
              alignRight: false,
            }, {
              name: 'Name',
              alignRight: false,
            }, {
              name: 'Type',
              alignRight: false,
            }, {
              name: 'Units',
              alignRight: true,
            }, {
              name: 'Actions',
              alignRight: true,
            },
          ]}
          className="mb-3"
          TableRowComponent={MyCurrencytemItem}
          emptyMessage="No currencies found."
          dataLoaderCallback={getExchanges}
        />
      </div>
    </div>
  );
}
