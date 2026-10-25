# Life: Small Hours

Original calm instrumental score and synthesis created for Life2.0 on 25 October 2026. The new note sequence and generated waveform in `dist/course/music.js` use no downloaded recording, sample, external music service or copied soundtrack. They are not a reconstruction of music from The Sims or 1in8b.life.

To the extent copyright or related rights exist in this original score and synthesis, this contribution is dedicated to the public domain under [CC0 1.0 Universal](https://creativecommons.org/publicdomain/zero/1.0/), including its [legal code](https://creativecommons.org/publicdomain/zero/1.0/legalcode). This dedication applies to this new music contribution, not unrelated game code, brands or third-party material. Attribution is optional. Suggested credit: “Small Hours — original procedural music for Life2.0, CC0.” No claim is made that Creative Commons has verified this work.

Audio is synthesized locally as a 32-second mono buffer with restrained sustained notes and a sparse melody. Mood variants change the harmony. There are no network requests or scheduling timers, and playback never changes game time or resources. Muting suspends the audio context; hiding the page silences playback and requires an explicit click to resume. Saved preference does not override browser autoplay rules.

Primary implementation references: [Web Audio standard](https://webaudio.github.io/web-audio-api/), [MDN best practices](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API/Best_practices) (create/resume from a user gesture, give users control, generate sounds locally), and [AudioContext.suspend](https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/suspend). No documentation prose was copied into the interface.

Automated checks cover waveform bounds/seam, deterministic synthesis, user-gesture initialization, saved preference, mute, visibility suspension and unsupported browsers. A real-browser listening and header-fit check is still required; mocked lifecycle tests cannot establish audio quality or browser-specific autoplay behavior.
