import Store from '../stroe';
import * as Utils from 'engine/Utils';

module.exports.regionToDrawParser = (trackIndex, bits) => {
    let trackRegionList = module.exports.getRegionsByTrackIndex(trackIndex);
    let bitsToDraw = new Array;
    for (let i = 0; i < bits; i++) {
        bitsToDraw.push(0);
    }
    for (let i = 0; i < trackRegionList.length; i++) {
        bitsToDraw[trackRegionList[i].start] = 1; //For applying different CSS for first and last bit in region
        for (let j = trackRegionList[i].start + 1; j < trackRegionList[i].end; j++) {
            bitsToDraw[j] = 2;
        }
        bitsToDraw[trackRegionList[i].end] = 3; //For applying different CSS for first and last bit in region
    }
    return bitsToDraw;
}

module.exports.getRegionIdByBitIndex = (trackIndex, bitIndex) => {
    let trackRegionList = module.exports.getRegionsByTrackIndex(trackIndex);
    let regionId;
    for (let i = 0; i < trackRegionList.length; i++) {
        if (trackRegionList[i].start <= bitIndex && trackRegionList[i].end >= bitIndex) {
            regionId = trackRegionList[i].id;
        }
    }
    return regionId;
}

module.exports.getRegionByRegionId = (regionId, regionList) => {
    if (Utils.isNullOrUndefined(regionList)) {
        regionList = Store.getState().composition.regionList;
    }
    for (let i = 0; i < regionList.length; i++) {
        if (regionList[i].id === regionId) {
            return regionList[i];
        }
    }
}

module.exports.getRegionsByTrackIndex = (trackIndex, allRegions) => {
    let regionsByTrackIndex = new Array;
    if(Utils.isNullOrUndefined(allRegions)){
        allRegions = Store.getState().composition.regionList;
    }
    for(let i = 0; i < allRegions.length; i++){
        if(allRegions[i].trackIndex === trackIndex){
            regionsByTrackIndex.push(allRegions[i]);
        }
    }
    return regionsByTrackIndex;
}

module.exports.notesToDrawParser = (pianoRollNote) => {
    let region = module.exports.getRegionByRegionId(Store.getState().composition.pianoRollRegion);
    let notesToDraw = new Array;
    for (let i = 0; i < region.regionLength * 16; i++) {
        notesToDraw.push(0);
    }
    if (!Utils.isNullOrUndefined(region.notes[pianoRollNote])) {
        for (let i = 0; i < region.notes[pianoRollNote].length; i++) {
            let currNote = region.notes[pianoRollNote][i];
            notesToDraw[currNote.sixteenthNumber] = 1;
            for (let j = currNote.sixteenthNumber + 1; j < currNote.sixteenthNumber + currNote.length - 1; j++) {
                notesToDraw[j] = 2;
            }
            notesToDraw[currNote.sixteenthNumber + currNote.length - 1] = 3;
        }
    }
    return notesToDraw;
}

module.exports.notesToPlay = (sixteenthPlaying, trackIndex) => {
    let regions = module.exports.getRegionsByTrackIndex(trackIndex);
    if(!Utils.isNullUndefinedOrEmpty(regions)){
        let notesToPlay = new Array;
        for(let i = 0; i < regions.length; i++){
            if(regions[i].start * 16 <= sixteenthPlaying && (regions[i].end + 1) * 16 >= sixteenthPlaying){
                let currRegion = regions[i];
                for(let j = 0; j < currRegion.notes.length; j++){
                    if(!Utils.isNullUndefinedOrEmpty(currRegion.notes[j])){
                        for(let z = 0; z < currRegion.notes[j].length; z++){
                            if(currRegion.notes[j][z].sixteenthNumber + currRegion.start * 16 === sixteenthPlaying){
                                notesToPlay.push({note: j, durotian: currRegion.notes[j][z].length});
                            }
                        }
                    }
                }
            }
        }
        return(notesToPlay);
    }
}