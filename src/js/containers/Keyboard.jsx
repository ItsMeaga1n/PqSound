import React from 'react';
import Octave from 'components/Keyboard/Octave';
import { connect } from 'react-redux';
import {SoundOrigin} from 'constants/Constants';

class Keyboard extends React.Component {
    constructor() {
        super();
        this.lastPressedKey = null;

        document.onmouseup = this.handleUp.bind(this);
    }

    getAllRecordingTracks(){
        let recordingTracksSounds = new Array;
        for(let i = 1; i < this.props.trackList.length; i++){
            if(this.props.trackList[i].record){
                recordingTracksSounds.push(this.props.trackList[i].index);
            }
        }
        return recordingTracksSounds;
    }

    handleUp() {
        let recordingTracksSounds = this.getAllRecordingTracks();
        for(let i = 0; i < recordingTracksSounds.length; i++){
            this.props.sound.stop(recordingTracksSounds[i], this.lastPressedKey)
        }
        this.lastPressedKey = null;
    }

    handleDown(note) {
        this.lastPressedKey = note;
        let recordingTracksSounds = this.getAllRecordingTracks();
        for(let i = 0; i < recordingTracksSounds.length; i++){
            this.props.sound.play(recordingTracksSounds[i], null, note, SoundOrigin.pianoRollNote)
        }
    }

    render() {
        if (this.props.keyboard.show) {
            var renderOctaves = new Array;
            for (var i = 0; i < this.props.keyboard.octaves; i++) {
                renderOctaves.push(<Octave index={i} key={i.toString()} handleDown={this.handleDown.bind(this)} />);
            }
            return (
                <div className="keyboardBody">
                    <div className="colorLine"></div>
                    {renderOctaves}
                </div>
            );
        }
        return null;
    }
}

//REDUX connection
const mapStateToProps = (state) => {
    return {
        keyboard: state.keyboard,
        trackList: state.tracks.trackList,
        sound: state.webAudio.sound
    }
}

export default connect(mapStateToProps)(Keyboard);