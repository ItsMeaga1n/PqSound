import * as React from 'react';
import { Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import TrackCompositionRow from 'components/CompositionGrid/TrackCompositionRow';
import PianoRoll from 'components/CompositionGrid/PianoRoll';
import TimeBar from 'components/CompositionGrid/TimeBar';
import PianoRollKeyboard from 'components/CompositionGrid/PianoRollKeyboard';
import PianoRollTimeBar from 'components/CompositionGrid/PianoRollTimeBar';
import { showPianoRoll, addRegion, removeRegion, addNote, removeNote, pasteRegion } from 'actions/compositionActions';
import { changeCurrentTime, copyRegion } from 'actions/controlActions';
import { getRegionIdByBitIndex, getRegionByRegionId, notesToDrawParser } from 'engine/CompositionParser';
import { tools, SoundOrigin } from 'constants/Constants';
import { pencilIcon, eraserIcon, copyIcon } from 'constants/Icons';
import { getTrackByIndex, isNullOrUndefined } from 'engine/Utils';

class CompositionGrid extends React.Component {
    constructor() {
        super();
        this.state = {
            scrollPianoRollY: 0,
            scrollPianoRollX: 0,
            scrollCompositionX: 0,
            scrollCompositionY: 0,
        };
    }

    handleEmptyBarClicked(event, trackIndex, bitIndex, bitsToDraw) {
        switch (event.altKey ? this.props.selectedSecoundaryTool : this.props.selectedTool) {
            case tools.draw.id: {
                let canDraw = true;
                for (let i = 0; i < this.props.regionDrawLength; i++) {
                    if (bitsToDraw[bitIndex + i] || bitIndex + i >= this.props.composition.BarsInComposition) {
                        canDraw = false;
                        break;
                    }
                }
                if (canDraw) {
                    this.props.dispatch(addRegion(trackIndex, bitIndex, this.props.regionDrawLength));
                }
                break;
            }
            case tools.copyPaste.id: {
                if (!isNullOrUndefined(this.props.copiedRegion)) {
                    let canPaste = true;
                    for (
                        let i = 0;
                        i <
                        getRegionByRegionId(this.props.copiedRegion, this.props.composition.regionList).regionLength;
                        i++
                    ) {
                        if (bitsToDraw[bitIndex + i] || bitIndex + i >= this.props.composition.BarsInComposition) {
                            canPaste = false;
                            break;
                        }
                    }
                    if (canPaste) {
                        this.props.dispatch(pasteRegion(trackIndex, bitIndex, this.props.copiedRegion));
                    }
                }
            }
        }
    }

    handleRegionClicked(event, trackIndex, bitIndex) {
        const regionIndex = getRegionIdByBitIndex(trackIndex, bitIndex);

        switch (event.altKey ? this.props.selectedSecoundaryTool : this.props.selectedTool) {
            case tools.select.id: {
                this.props.dispatch(showPianoRoll(trackIndex, regionIndex));
                break;
            }
            case tools.remove.id: {
                this.props.dispatch(removeRegion(regionIndex));
                break;
            }
            case tools.copyPaste.id: {
                this.props.dispatch(copyRegion(regionIndex));
                break;
            }
        }
    }

    handleNoteClicked(event, noteNumber, sixteenthNumber) {
        let noteLength;
        switch (this.props.noteDrawLength) {
            case 0: {
                noteLength = 16;
                break;
            }
            case 1: {
                noteLength = 8;
                break;
            }
            case 2: {
                noteLength = 4;
                break;
            }
            case 3: {
                noteLength = 2;
                break;
            }
            case 4: {
                noteLength = 1;
                break;
            }
        }
        const notesToDraw = notesToDrawParser(noteNumber);
        switch (event.altKey ? this.props.selectedSecoundaryTool : this.props.selectedTool) {
            case tools.draw.id: {
                let canDraw = sixteenthNumber + noteLength <= notesToDraw.length ? true : false;
                for (let i = 0; i < noteLength && canDraw; i++) {
                    if (notesToDraw[sixteenthNumber + i]) {
                        canDraw = false;
                    }
                }
                if (canDraw) {
                    this.props.dispatch(
                        addNote(this.props.composition.pianoRollRegion, noteNumber, sixteenthNumber, noteLength),
                    );
                }
                break;
            }
            case tools.remove.id: {
                if (notesToDraw[sixteenthNumber]) {
                    this.props.dispatch(
                        removeNote(this.props.composition.pianoRollRegion, noteNumber, sixteenthNumber, noteLength),
                    );
                }
                break;
            }
        }
    }

    handleUp(event, note) {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        //if (this.props.keyboard.notesPlaying.includes(note)) {
        const currTrackIndex = getRegionByRegionId(
            this.props.composition.pianoRollRegion,
            this.props.composition.regionList,
        ).trackIndex;
        this.props.sound.stop(currTrackIndex, note);
        //    this.props.dispatch(KeyboardActions.removePlayingNote(note));
        //}
        return false;
    }

    handleDown(event, note) {
        event.preventDefault();
        event.stopPropagation();
        event.nativeEvent.stopImmediatePropagation();
        if (event.buttons == 1 /*&& !this.props.keyboard.notesPlaying.includes(note)*/) {
            //leftClick
            const currTrackIndex = getRegionByRegionId(
                this.props.composition.pianoRollRegion,
                this.props.composition.regionList,
            ).trackIndex;
            if (this.props.audioContext.state !== 'running') {
                this.props.audioContext.resume();
            }
            this.props.sound.play(currTrackIndex, null, note, SoundOrigin.pianoRollNote);
            //this.props.dispatch(KeyboardActions.addPlayingNote(note))
        }
        return false;
    }

    updateScroll(scroll) {
        if (!isNullOrUndefined(scroll.pianoRollX) && scroll.pianoRollX !== this.state.scrollPianoRollX) {
            this.setState((prevState) => {
                return { ...prevState, scrollPianoRollX: scroll.pianoRollX };
            });
        }
        if (!isNullOrUndefined(scroll.pianoRollY) && scroll.pianoRollY !== this.state.scrollPianoRollY) {
            this.setState((prevState) => {
                return { ...prevState, scrollPianoRollY: scroll.pianoRollY };
            });
        }
        if (!isNullOrUndefined(scroll.compositionX) && scroll.compositionX !== this.state.scrollCompositionX) {
            this.setState((prevState) => {
                return { ...prevState, scrollCompositionX: scroll.compositionX };
            });
        }
        if (!isNullOrUndefined(scroll.compositionY) && scroll.compositionY !== this.state.scrollCompositionY) {
            this.setState((prevState) => {
                return { ...prevState, scrollCompositionY: scroll.compositionY };
            });
            document.getElementsByClassName('trackListContentList')[0].style.marginTop =
                -this.state.scrollCompositionY + 'px';
        }
    }

    getCursor() {
        switch (this.props.altClicked ? this.props.selectedSecoundaryTool : this.props.selectedTool) {
            case tools.draw.id: {
                return pencilIcon + ',auto';
            }
            case tools.remove.id: {
                return eraserIcon + ',auto';
            }
            case tools.select.id: {
                return 'default';
            }
            case tools.copyPaste.id: {
                return copyIcon + ',auto';
            }
        }
    }

    handleChangeCurrentSixteenth(sixteenth) {
        this.props.dispatch(changeCurrentTime(sixteenth));
    }

    render() {
        const trackCompositionRowList = [];
        if (this.props.composition.showPianoRoll) {
            const currRegion = getRegionByRegionId(
                this.props.composition.pianoRollRegion,
                this.props.composition.regionList,
            );
            const bitsNumber = currRegion.regionLength;
            const currTrackIndex = currRegion.trackIndex;
            return (
                <Col xs={12} className="nopadding compositionPanelPianoRoll">
                    <PianoRollTimeBar
                        bits={bitsNumber}
                        scroll={this.state.scrollPianoRollX}
                        sixteenthNotePlaying={this.props.sixteenthPlaying}
                        beatStart={currRegion.start}
                        changeCurrSixteenth={this.handleChangeCurrentSixteenth.bind(this)}
                    />
                    <PianoRollKeyboard
                        instrument={getTrackByIndex(this.props.trackList, currTrackIndex).instrument}
                        onDown={this.handleDown.bind(this)}
                        onUp={this.handleUp.bind(this)}
                        scroll={this.state.scrollPianoRollY}
                    />
                    <div style={{ cursor: this.getCursor() }}>
                        <PianoRoll
                            bitsNumber={bitsNumber}
                            onNoteClick={this.handleNoteClicked.bind(this)}
                            notes={
                                getRegionByRegionId(
                                    this.props.composition.pianoRollRegion,
                                    this.props.composition.regionList,
                                ).notes
                            }
                            onScroll={this.updateScroll.bind(this)}
                            onDown={this.handleDown.bind(this)}
                            onUp={this.handleUp.bind(this)}
                        />
                    </div>
                    <svg
                        className="svgContainer"
                        style={{
                            left:
                                this.props.sixteenthPlaying * 30 -
                                this.state.scrollPianoRollX +
                                100 -
                                currRegion.start * 30 * 16 +
                                'px',
                        }}
                    >
                        <rect className="currTimeLine"> </rect>
                    </svg>
                </Col>
            );
        } else {
            /**
             * start iteration from i = 1 because i = 0 is the master track
             */
            for (let i = 1; i < this.props.trackList.length; i++) {
                trackCompositionRowList.push(
                    <TrackCompositionRow
                        bits={this.props.composition.barsInComposition}
                        key={this.props.trackList[i].index}
                        trackIndex={this.props.trackList[i].index}
                        trackType={this.props.trackList[i].trackType}
                        onEmptyBarClick={this.handleEmptyBarClicked.bind(this)}
                        onRegionClick={this.handleRegionClicked.bind(this)}
                        copiedRegion={this.props.copiedRegion}
                    />,
                );
            }
            trackCompositionRowList.sort((a, b) => {
                return a.props.trackIndex - b.props.trackIndex;
            });
            return (
                <Col xs={10} className="nopadding compositionPanel">
                    <TimeBar
                        bits={this.props.composition.barsInComposition}
                        scroll={this.state.scrollCompositionX}
                        sixteenthNotePlaying={this.props.sixteenthPlaying}
                        changeCurrSixteenth={this.handleChangeCurrentSixteenth.bind(this)}
                    />

                    <div
                        className="compositionRowList"
                        onScroll={(e) =>
                            this.updateScroll({
                                compositionX: e.target.scrollLeft,
                                compositionY: e.target.scrollTop,
                            })
                        }
                        style={{ cursor: this.getCursor() }}
                    >
                        {trackCompositionRowList}
                    </div>
                    <svg
                        className="svgContainer"
                        style={{ left: (this.props.sixteenthPlaying * 50) / 16 - this.state.scrollCompositionX + 'px' }}
                    >
                        <rect className="currTimeLine"> </rect>
                    </svg>
                </Col>
            );
        }
    }
}

//REDUX connection
const mapStateToProps = (state) => {
    return {
        trackList: state.tracks.trackList,
        composition: state.composition,
        selectedTool: state.control.tool,
        selectedSecoundaryTool: state.control.secoundaryTool,
        regionDrawLength: state.control.regionDrawLength,
        noteDrawLength: state.control.noteDrawLength,
        keyboard: state.keyboard,
        sound: state.webAudio.sound,
        audioContext: state.webAudio.context,
        sixteenthPlaying: state.control.sixteenthNotePlaying,
        altClicked: state.control.altClicked,
        copiedRegion: state.control.copiedRegion,
    };
};

export default connect(mapStateToProps)(CompositionGrid);
