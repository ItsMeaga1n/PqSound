export function removeTrackFromComposition(index) {
    return {
        type: 'REMOVE_TRACK_FROM_COMPOSITION',
        payload: index,
    };
}
export function addRegion(newTrackIndex, newStart, length) {
    return {
        type: 'ADD_REGION',
        payload: {
            trackIndex: newTrackIndex,
            start: newStart,
            length: length,
        },
    };
}
export function removeRegion(newRegionId) {
    return {
        type: 'REMOVE_REGION',
        payload: newRegionId,
    };
}
export function changeOctaveNumber(number) {
    return {
        type: 'CHANGE_BITS_NUMBER',
        payload: number,
    };
}
export function showPianoRoll(newTrackIndex, newRegionIndex) {
    return {
        type: 'SHOW_PIANO_ROLL',
        payload: {
            trackIndex: newTrackIndex,
            regionIndex: newRegionIndex,
        },
    };
}
export function switchPianorollVisibility(show) {
    return {
        type: 'SWITCH_PIANO_ROLL_VISIBILITY',
        payload: show,
    };
}
export function updateTrackComposition(newPianoKey, newQuarterIndex, newSixteenthIndex) {
    return {
        type: 'UPDATE_TRACK_COMPOSITION',
        payload: {
            pianoKey: newPianoKey,
            quarterIndex: newQuarterIndex,
            sixteenthIndex: newSixteenthIndex,
        },
    };
}

export function addNote(newRegionId, newNoteNumber, newSixteenthNumber, newNoteLength) {
    return {
        type: 'ADD_NOTE',
        payload: {
            regionId: newRegionId,
            noteNumber: newNoteNumber,
            sixteenthNumber: newSixteenthNumber,
            noteLength: newNoteLength,
        },
    };
}

export function removeNote(newRegionId, newNoteNumber, newSixteenthNumber, newNoteLength) {
    return {
        type: 'REMOVE_NOTE',
        payload: {
            regionId: newRegionId,
            noteNumber: newNoteNumber,
            sixteenthNumber: newSixteenthNumber,
            noteLength: newNoteLength,
        },
    };
}

export function changeBarsInComposition(newBarsInComposition) {
    return {
        type: 'CHANGE_BARS_IN_COMPOSITION',
        payload: newBarsInComposition,
    };
}

export function loadCompositionState(newState) {
    return {
        type: 'LOAD_COMPOSITION_STATE',
        payload: newState,
    };
}

export function pasteRegion(newTrackIndex, newStart, newCopiedRegion) {
    return {
        type: 'PASTE_REGION',
        payload: {
            trackIndex: newTrackIndex,
            start: newStart,
            copiedRegion: newCopiedRegion,
        },
    };
}

export function trackIndexUp(newIndex) {
    return {
        type: 'REGION_TRACK_INDEX_UP',
        payload: newIndex,
    };
}

export function trackIndexDown(newIndex) {
    return {
        type: 'REGION_TRACK_INDEX_DOWN',
        payload: newIndex,
    };
}
