window.AudioContext = window.AudioContext || window.webkitAudioContext; // prefixed naming used in Safary 8-9

function DynamicAudio(args) {
    if (this instanceof arguments.callee) {
        if (typeof this.init === "function") {
            this.init.apply(this, (args && args.callee) ? args : arguments);
        }
    }
    else {
        return new arguments.callee(arguments);
    }
}

DynamicAudio.VERSION = "<%= version %>";
DynamicAudio.nextId = 1;

DynamicAudio.prototype = {
    nextId: null,
    swf: 'dynamicaudio.swf',
    
    audioContext: null,
    flashWrapper: null,
    flashElement: null,

    init: function(opts) {
        var self = this;
        self.id = DynamicAudio.nextId++;
        
        if (opts && typeof opts['swf'] !== 'undefined') {
            self.swf = opts['swf'];
        }

        // Attempt to create HTML5 Web audio context
        try {
            self.audioContext = new AudioContext();
        } catch(e) {
            // HTML5 Web Audio API not available
            // Fall back to creating flash player
            console.log('Couldn\'t create AudioContext:' + e +', falling back to flash player');
            self.flashWrapper = document.createElement('div');
            self.flashWrapper.id = 'dynamicaudio-flashwrapper-'+self.id;
            // Credit to SoundManager2 for this:
            var s = self.flashWrapper.style;
            s['position'] = 'fixed';
            s['width'] = s['height'] = '8px'; // must be at least 6px for flash to run fast
            s['bottom'] = s['left'] = '0px';
            s['overflow'] = 'hidden';
            self.flashElement = document.createElement('div');
            self.flashElement.id = 'dynamicaudio-flashelement-'+self.id;
            self.flashWrapper.appendChild(self.flashElement);

            document.body.appendChild(self.flashWrapper);

            swfobject.embedSWF(
                self.swf,
                self.flashElement.id,
                "8",
                "8",
                "9.0.0",
                null,
                null,
                {'allowScriptAccess': 'always'},
                null,
                function(e) {
                    self.flashElement = e.ref;
                }
            );
        }
    },

    write: function(samples) {
        if (this.audioContext !== null) {
            this.output(samples);
        }
        else if (this.flashElement !== null) {
            var out = new Array(samples.length);
            for (var i = samples.length-1; i !== 0; i--) {
                out[i] = this.floatToIntSample(samples[i]);
            }
            this.flashElement.write(out.join(' '));
        }
    },

    writeInt: function(samples) {
        if (this.audioContext !== null) {
            this.output(samples, this.intToFloatSample);
        }
        else if (this.flashElement !== null) {
            this.flashElement.write(samples.join(' '));
        }
    },

    /**
     * Convert from interleaved buffer format to planar buffer
     * by writing right into appropriate channel buffers
     *
     * @param {Number[]} samples
     * @param {Function} converter - optional samples conversion function
     */
    output: function(samples, converter) {
        // Create output buffer (planar buffer format)
        var buffer = this.audioContext.createBuffer(2, samples.length, this.audioContext.sampleRate);
        var channelLeft = buffer.getChannelData(0);
        var channelRight = buffer.getChannelData(1);
        var j = 0;
        if (converter) { // for performance reasons we avoid conditions inside the for() cycle
            for (var i = 0; i < samples.length; i += 2) {
                channelLeft[j] = converter(samples[i]);
                channelRight[j] = converter(samples[i+1]);
                j++;
            }
        } else {
            for (var i = 0; i < samples.length; i += 2) {
                channelLeft[j] = samples[i];
                channelRight[j] = samples[i+1];
                j++;
            }
        }
        // Create sound source and play samples from buffer
        var source = this.audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(this.audioContext.destination); // Output to sound card
        source.start();
    },

    /**
     * helper function to convert Int output to Float
     * to return AudioBuffer/Float32Array output used in HTML5 WebAudio API
     *
     * @param {Number} value
     * @returns {number}
     */
    intToFloatSample: function(value) {
        return value / 32768; // from -32767..32768 to -1..1 range
    },

    /**
     * helper function to convert Float output to Int
     * to return Int Array used in SWF Audio player
     *
     * @param {Number} value
     * @returns {number}
     */
    floatToIntSample: function(value) {
        return Math.floor(value * 32768); // from -1..1 to -32767..32768 range
    }
};
