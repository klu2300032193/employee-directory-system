import os
import urllib.request
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from urllib.parse import urlsplit, urlunsplit


class ProxyHandler(SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path.startswith('/api/'):
            self._proxy_request(method='GET')
            return
        super().do_GET()

    def do_POST(self):
        if self.path.startswith('/api/'):
            self._proxy_request(method='POST')
            return
        super().do_POST()

    def do_PUT(self):
        if self.path.startswith('/api/'):
            self._proxy_request(method='PUT')
            return
        super().do_PUT()

    def do_DELETE(self):
        if self.path.startswith('/api/'):
            self._proxy_request(method='DELETE')
            return
        super().do_DELETE()

    def do_OPTIONS(self):
        if self.path.startswith('/api/'):
            self.send_response(204)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.end_headers()
            return
        super().do_OPTIONS()

    def _proxy_request(self, method):
        parsed = urlsplit(self.path)
        target_path = parsed.path.replace('/api', '', 1)
        target_url = f'http://localhost:8080{target_path}'
        if parsed.query:
            target_url += f'?{parsed.query}'

        body = None
        headers = {}
        if method in {'POST', 'PUT'}:
            length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(length) if length else b''
            content_type = self.headers.get('Content-Type', 'application/json')
            headers['Content-Type'] = content_type

        request = urllib.request.Request(target_url, data=body, method=method, headers=headers)
        with urllib.request.urlopen(request, timeout=10) as response:
            response_body = response.read()
            self.send_response(response.status)
            for key, value in response.headers.items():
                if key.lower() not in {'content-length', 'transfer-encoding', 'server', 'date'}:
                    self.send_header(key, value)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type')
            self.send_header('Content-Length', str(len(response_body)))
            self.end_headers()
            self.wfile.write(response_body)

    def log_message(self, format, *args):
        return


if __name__ == '__main__':
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    server = ThreadingHTTPServer(('127.0.0.1', 8000), partial(ProxyHandler, directory=os.getcwd()))
    print('Server running at http://127.0.0.1:8000')
    server.serve_forever()
