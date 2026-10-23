"""Life preview: serve fresh assets while the game is being edited."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial

class Preview(SimpleHTTPRequestHandler):
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

if __name__ == '__main__':
    print('Life preview: http://127.0.0.1:4219/', flush=True)
    ThreadingHTTPServer(('127.0.0.1', 4219), partial(Preview, directory='out')).serve_forever()
