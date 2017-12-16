import React from 'react';
import { connect } from 'react-redux';
import { Button, Glyphicon } from 'react-bootstrap';
import Track from 'components/TrackList/Track';
import * as trackListActions from 'actions/trackListActions';
import * as compositionActions from 'actions/compositionActions';
import { fetchSamplerInstrument } from 'actions/webAudioActions';
import * as Utils from 'engine/Utils';
import AddNewTrackModal from '../components/TrackList/AddNewTrackModal';

class TrackList extends React.Component {
    constructor() {
        super();
    }

    addTrack(trackType) {
        this.props.dispatch(trackListActions.addTrack(trackType));
    }

    removeTrack(index) {
        if (this.props.trackList.length > 2) {
            this.props.dispatch(trackListActions.removeTrack(index));
            this.props.dispatch(compositionActions.removeTrackFromComposition(index));
        }
    }

    handleRecordClick(index) {
        this.props.dispatch(trackListActions.changeRecordState(index));
        this.shouldFetchSamplerInstrument(index);
    }

    handleSoloButtonClicked(index) {
        this.props.dispatch(trackListActions.changeSoloState(index));
    }

    handleMuteButtonClicked(index) {
        this.props.dispatch(trackListActions.changeMuteState(index));
    }

    handleTrackNameChange(event, trackIndex){
        this.props.dispatch(trackListActions.changeTrackName(event.target.value, trackIndex));
    }

    //Sprawdzanie czy wybrany jest sampler i czy ma załadowane sample TODO: zmienic nazwe tej metody?
    shouldFetchSamplerInstrument(index) {
        for (let i = 0; i < this.props.trackList.length; i++) {
            if (this.props.trackList[i].index === index &&
                this.props.trackList[i].instrument.name === 'Sampler') {
                for (let j = 0; j < this.props.samplerInstruments.length; j++) {
                    if (this.props.trackList[i].instrument.preset === this.props.samplerInstruments[j].name &&
                        !this.props.samplerInstruments[j].loaded && !this.props.fetching) {
                            this.props.dispatch(fetchSamplerInstrument(this.props.trackList[i].instrument.preset));
                        }
                }

            }
        }
    }

    changeSelectedTrack(index) {
        if(this.props.selected !== index) {
            this.props.dispatch(trackListActions.changeSelectedTrack(index));
        }
    }

    handleSwitchModalVisibility() {
        this.props.dispatch(trackListActions.addNewTrackModalVisibilitySwitch());

    }

    render() {
        let renderTrackList = new Array;
        /**
         * start iteration from i = 1 because i = 0 is the master track
         */
        for (let i = 1; i < this.props.trackList.length; i++) {
            renderTrackList.push(
                <Track key={i.toString()}
                    trackDetails={this.props.trackList[i]}
                    handleRowClicked={this.changeSelectedTrack.bind(this)}
                    handleRemove={this.removeTrack.bind(this)}
                    onRecordButtonClicked={this.handleRecordClick.bind(this)}
                    onSoloButtonClicked={this.handleSoloButtonClicked.bind(this)}
                    onMuteButtonClicked={this.handleMuteButtonClicked.bind(this)}
                    handleTrackNameChange={this.handleTrackNameChange.bind(this)}
                    selected={this.props.selected}
                />
            );
        }
        return (
            <div className=" trackList">
                <Button block={true} className="btn-block" bsStyle="primary" onClick={this.handleSwitchModalVisibility.bind(this)}><Glyphicon glyph="plus" /></Button>
                {renderTrackList}
                <AddNewTrackModal
                    showModal={this.props.showModal}
                    modalVisibilitySwitch={this.handleSwitchModalVisibility.bind(this)}
                    onAddNewTrack={this.addTrack.bind(this)}
                />
            </div>
        );
    }
}

//REDUX connection
const mapStateToProps = (state) => {
    let samplerInstruments = null;
    if (!Utils.isNullUndefinedOrEmpty(state.webAudio.samplerInstrumentsSounds)) {
        samplerInstruments = state.webAudio.samplerInstrumentsSounds.map(a => ({ 'name': a.name, 'loaded': a.loaded }));
    }
    return {
        trackList: state.tracks.trackList,
        selected: state.tracks.selected,
        samplerInstruments: samplerInstruments,
        fetching: state.webAudio.fetching,
        showModal: state.tracks.showAddNewTrackModal
    }
}

export default connect(mapStateToProps)(TrackList);