#!/usr/bin/env python3
"""Generate simple PWA icons (192x192 and 512x512) as PNG files."""
import struct, zlib, math

def make_png(size):
    """Create a simple pink-on-dark icon PNG."""
    img = []
    cx, cy, r = size//2, size//2, size*0.42
    for y in range(size):
        row = []
        for x in range(size):
            dx, dy = x - cx, y - cy
            dist = math.sqrt(dx*dx + dy*dy)
            corner_r = size * 0.18
            in_circle = dist <= r
            # background gradient-ish
            bg = (10, 6, 8, 255)
            accent = (232, 67, 106, 255)
            # draw circle
            if in_circle:
                # radial gradient from accent to darker
                t = dist / r
                r_c = int(232 * (1-t*0.4))
                g_c = int(67 * (1-t*0.3))
                b_c = int(106 * (1-t*0.2))
                row.extend([r_c, g_c, b_c, 255])
            else:
                row.extend(bg)
        img.append(bytes(row))
    
    def png_chunk(name, data):
        c = zlib.crc32(name + data) & 0xffffffff
        return struct.pack('>I', len(data)) + name + data + struct.pack('>I', c)
    
    raw = b''
    for row in img:
        raw += b'\x00' + row  # filter type none
    
    compressed = zlib.compress(raw, 9)
    
    ihdr = struct.pack('>IIBBBBB', size, size, 8, 6, 0, 0, 0)
    
    png = b'\x89PNG\r\n\x1a\n'
    png += png_chunk(b'IHDR', ihdr)
    png += png_chunk(b'IDAT', compressed)
    png += png_chunk(b'IEND', b'')
    return png

for size in [192, 512]:
    data = make_png(size)
    fname = f"icon-{size}.png"
    with open(fname, 'wb') as f:
        f.write(data)
    print(f"Created {fname} ({len(data)} bytes)")
