"""Life preview: serve fresh assets while the game is being edited."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial

class Preview(SimpleHTTPRequestHandler):
    # HTTP/1.1 with keep-alive: a module graph is many parallel requests over
    # few connections. HTTP/1.0 closed every connection and burned the backlog.
    protocol_version = 'HTTP/1.1'

    def do_GET(self):
        # The embedded preview can retain a failed module response across reloads.
        # Development must never reuse an incomplete build's conditional response.
        for name in ('If-Modified-Since', 'If-None-Match'):
            if name in self.headers:
                del self.headers[name]
        super().do_GET()

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def log_message(self, format, *args):
        pass

    def handle_one_request(self):
        # A browser that navigates away mid-response is normal, not an error.
        try:
            super().handle_one_request()
        except (BrokenPipeError, ConnectionResetError):
            self.close_connection = True


class PreviewServer(ThreadingHTTPServer):
    # The stock backlog is 5. A page loads its module graph over six or more
    # parallel connections, so the queue overflows and the kernel resets the
    # excess: boot.js and fonts.js fail while the rest load, and the page
    # reports "failed to fetch dynamically imported module".
    request_queue_size = 128
    daemon_threads = True
    allow_reuse_address = True


if __name__ == '__main__':
    print('Life preview: http://127.0.0.1:4219/', flush=True)
    PreviewServer(('127.0.0.1', 4219), partial(Preview, directory='out')).serve_forever()
