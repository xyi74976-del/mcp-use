# Native tool argument regression recordings

Recorded from actual Vitest runs of the same final32 cases using the native provider adapters and loops, synthetic HTTP/SSE model responses and a local tool counter. No live model endpoint was contacted.

- Before: detached pristine upstream ecacd4733993999cd06812cf48685c3e6371a6e2,20 failed/12 passed.
- After: reviewed fix,32 passed.

GIFs render the actual terminal stream; the final frame is held for readability. `.cast` files are replayable asciicast v2 recordings. Filesystem paths are redacted; test outcomes are unchanged.

Use `asciinema play before.cast` or `asciinema play after.cast` to replay locally.
