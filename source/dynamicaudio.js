
function DynamicAudio(args) {
    if (this instanceof arguments.callee) {
        if (typeof this.init == "function") {
            this.init.apply(this, (args && args.callee) ? args : arguments);
        }
    }
    else {
        return new arguments.callee(arguments);
    }
}

DynamicAudio.nextId = 1;

DynamicAudio.prototype = {
    nextId: null,
    swf: 'dynamicaudio.swf',
    
    audioElement: null,
    flashWrapper: null,
    flashElement: null,
    
    init: function(opts) {
        var self = this;
        self.id = DynamicAudio.nextId++;
        
        if (opts && typeof opts['swf'] != 'undefined') {
            self.swf = opts['swf'];
        }

        // Attempt to create an audio element
        if (typeof Audio != 'undefined') {
            self.audioElement = new Audio();
            if (self.audioElement.mozSetup) {
                self.audioElement.mozSetup(2, 44100, 1);
                return;
            }
        }

        // Fall back to creating flash player
        self.audioElement = null;
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
    },
    
    write: function(samples) {
        if (this.audioElement != null) {
            this.audioElement.mozWriteAudio(samples.length, samples);
        }
        else if (this.flashElement != null) {
            var out = new Array(samples.length);
            for (var i = samples.length-1; i != 0; i--) {
                out[i] = Math.floor(samples[i]*32768);
            }
            this.flashElement.write(out.join(' '));
        }
    }
};

