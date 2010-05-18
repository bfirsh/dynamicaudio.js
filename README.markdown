dynamicaudio.js
===============

An interface for writing audio with Firefox's new 
[audio data API](https://wiki.mozilla.org/Audio_Data_API), but with a Flash fall 
back for older browsers.

For a basic example, see ``demo.html``.

Build
-----

To build, you will need jake:

    $ sudo gem install jake

You will also need Adobe's 
[Flex SDK](http://opensource.adobe.com/wiki/display/flexsdk/). This should be 
placed in a ``flexsdk`` directory in the same directory as ``jake.yml``.

To build, simply run:

    $ jake

