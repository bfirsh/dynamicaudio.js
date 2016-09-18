dynamicaudio.js
===============

An interface for the [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) with a Flash shim for older browsers.

Download it from [the releases page](https://github.com/bfirsh/dynamicaudio.js/releases).

For a basic example, see ``demo.html``.


Usage
-----

First, instantiate a ``DynamicAudio`` object with a dictionary of options:

    var dynamicaudio = new DynamicAudio({'swf': '/static/dynamicaudio.swf'})

The ``swf`` option specifies the path of the ``dynamicaudio.swf`` file relative
to the page being displayed.

The ``DynamicAudio`` object has two methods available on it:


### write(samples)

Plays an array of floating point audio samples in the range -1.0 to 1.0.

They are output as 2 channels at 44.1 KHz. This means it takes 88,200 samples to 
play 1 second of audio. You do not need to supply this many samples in a single 
call, but if you don't call ``write()`` often enough with enough samples, you 
will get buffer underruns.


### writeInt(samples)

This method is the same as ``write()``, but is instead supplied with integer
samples in the range -32,768 to 32,767. If your samples are already integers,
this method is more efficient.


Build from source
-----------------

To build, you will need jake:

    $ sudo gem install jake

You will also need Adobe's 
[Flex SDK](http://opensource.adobe.com/wiki/display/flexsdk/). This should be 
placed in a ``flexsdk`` directory in the same directory as ``jake.yml``.

Now run:

    $ jake


