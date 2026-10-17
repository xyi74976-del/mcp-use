# Raw argument validation review follow-up

Actual terminal captures use identical 80 regression tests with synthetic provider HTTP/SSE responses and real adapters, loops, and a local tool counter. They do not use a live provider.

- Before: initial PR head 082952a63d65ee261abd1af032c8d8fa3f2b6cee, 40 failed / 40 passed.
- After: raw argument validation follow-up, 80 passed.
- Recordings are original PTY output with local filesystem paths redacted. GIFs render those captures; no test outcomes were edited.
- The original 32-case pristine-upstream reproduction remains in before.gif / after.gif.
