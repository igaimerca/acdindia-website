`hero.mp4` - 14s clip compressed from the client's real footage
(`Website Design/Video_learning centre(being built)/…/20260104_105849.mp4`,
originally 404MB/1080p HEVC) down to ~8.7MB/960w H.264 for web use via:

ffmpeg -ss 15 -t 14 -i <source> -vf "scale=960:-2" -r 25 -an \
 -c:v libx264 -profile:v main -pix_fmt yuv420p -crf 26 -preset slow \
 -movflags +faststart hero.mp4

Swap this file for a better-chosen/edited clip whenever one's ready - same filename, same spot.
