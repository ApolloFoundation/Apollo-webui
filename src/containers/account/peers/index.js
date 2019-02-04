/******************************************************************************
 * Copyright © 2018 Apollo Foundation                                         *
 *                                                                            *
 ******************************************************************************/


import React from 'react';
import SiteHeader from '../../components/site-header'
import {connect} from 'react-redux';
import {getPeerAction, getPeersAction, getPeersInfoAction} from "../../../actions/peers";
import Peer from './peer'
import {setBodyModalParamsAction} from "../../../modules/modals";
import {BlockUpdater} from "../../block-subscriber";
import uuid from "uuid";
import ContentLoader from '../../components/content-loader'
import ContentHendler from '../../components/content-hendler'

import CustomTable from '../../components/tables/table';
import TopPageBlocks from '../../components/tob-page-blocks';


const mapStateToProps = state => ({
    isLocalhost: state.account.isLocalhost
})

const mapDispatchToProps = dispatch => ({
    getPeersAction: (requestParams) => dispatch(getPeersAction(requestParams)),
    getPeerAction: peerAddress => dispatch(getPeerAction(peerAddress)),
    getPeersInfoAction: (requestParams) => dispatch(getPeersInfoAction(requestParams)),
    setBodyModalParamsAction: (type, data, valueForModal) => dispatch(setBodyModalParamsAction(type, data, valueForModal)),
});

class Peers extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        peersInfo: null,
        peers: null
    };

    componentDidMount() {
        this.initPeersPage();
        this.getPeers();
    }

    peersPageUpdater = setInterval(() => {
        this.getPeers();
    }, 4000);

    componentWillUnmount() {
        clearInterval(this.peersPageUpdater)
    }

    initPeersPage = async () => {
        this.setState({
            peersInfo: await this.props.getPeersInfoAction()()
        })
    };

    getPeers = async (reqParams) => {
        const peers = await this.props.getPeersAction(reqParams);

        if (peers) {
            this.setState({
                peers: peers.peers
            })
        }
    };

    getPeer = async peerAddress => {
        const peer = await this.props.getPeerAction(peerAddress);

        if (peer) {
            this.props.setBodyModalParamsAction("ABOUT_PEER_INFO", peer)
        }
    };

    connectPeer = peerAddress => this.props.setBodyModalParamsAction("CONNECT_PEER", peerAddress);

    blacklistPeer = peerAddress => this.props.setBodyModalParamsAction("BLACKLIST_PEER", peerAddress);

    render () {
        
        const {peersInfo} = this.state;

        return (
            <div className="page-content">
                <SiteHeader
                    pageTitle={'Peers'}
                >
                    {
                        this.props.isLocalhost &&
                        <a className="btn primary"
                           onClick={() => this.connectPeer()}
                        >
                            Add peer
                        </a>
                    }
                </SiteHeader>
                <div className="page-body container-fluid">
                    <div className="">
                        {
                            peersInfo &&
                            <TopPageBlocks
                                cards={[
                                    {
                                        label: 'Uploaded Volume',
                                        value: `${Math.round(peersInfo.volumeUploaded / 1000000, 2)} MB`
                                    },{
                                        label: 'Downloaded Volume',
                                        value: `${Math.round(peersInfo.volumeDownloaded / 1000000, 2)} MB`
                                    },{
                                        label: 'Connected Peers',
                                        value: peersInfo.upToDatePeers
                                    },{
                                        label: 'Up-to-date Peers',
                                        value: peersInfo.connectedPeers / peersInfo.peersVolume
                                    }
                                ]}
                            />
                        }
                        <CustomTable
                            header={[
                                {
                                    name: 'Address',
                                    alignRight: false
                                },{
                                    name: 'Weight',
                                    alignRight: true
                                },{
                                    name: 'Downloaded',
                                    alignRight: true
                                },{
                                    name: 'Uploaded',
                                    alignRight: true
                                },{
                                    name: 'Application',
                                    alignRight: true
                                },{
                                    name: 'Platform',
                                    alignRight: false
                                },{
                                    name: 'Services',
                                    alignRight: true
                                },{
                                    name: 'Actions',
                                    alignRight: true,
                                    isRneder: this.props.isLocalhost
                                }
                            ]}
                            TableRowComponent={Peer}
                            tableData={this.state.peers}
                            className={'no-min-height'}
                            emptyMessage={'No aliases found.'}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Peers);