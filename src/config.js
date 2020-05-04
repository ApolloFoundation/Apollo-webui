/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


const config = {};

// API Gateway
config.api = {
    server: 'https://apl-t3-3.testnet3.apollowallet.org',
    transportUrl: 'ws://127.0.0.1:8888/',
    faucetUrl: 'https://wallet.test.apollowallet.org'
};

config.api.serverUrl = `${config.api.server}/apl?`;

module.exports = config;
