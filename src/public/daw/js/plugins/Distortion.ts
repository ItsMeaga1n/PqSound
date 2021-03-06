import { PluginsEnum } from '../constants/Constants';
import Plugin from './Plugin';

class Distortion extends Plugin {
    gainNode: GainNode;
    distortionNode: WaveShaperNode;

    constructor(index, audioContext) {
        super(PluginsEnum.Distortion, index, audioContext);
        this.preset = {
            outputGain: 1,
            distortion: 0,
        };
        this.gainNode = this.context.createGain();
        this.distortionNode = this.context.createWaveShaper();

        this.updateNodes();

        this.gainNode.connect(this.distortionNode);

        this.input = this.gainNode;
        this.output = this.distortionNode;
    }

    updateNodes() {
        this.gainNode.gain.setValueAtTime(
            this.preset.outputGain ? this.preset.outputGain : 0.000001,
            this.context.currentTime,
        );
        this.distortionNode.curve = this.makeDistortionCurve(this.preset.distortion);
    }

    makeDistortionCurve(distortionAmount) {
        //https://stackoverflow.com/questions/22312841/waveshaper-node-in-webaudio-how-to-emulate-distortion
        const samplesNumber = this.context.sampleRate;
        const curve = new Float32Array(samplesNumber);
        const deg = Math.PI / 180;
        let x = 0;
        for (let i = 0; i < samplesNumber; ++i) {
            x = (i * 2) / samplesNumber - 1;
            curve[i] = ((3 + distortionAmount) * x * 20 * deg) / (Math.PI + distortionAmount * Math.abs(x));
        }
        return curve;
    }
}

export default Distortion;
