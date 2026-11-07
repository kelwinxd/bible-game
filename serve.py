# Servidor local do jogo, sem cache: toda recarga (F5) pega a versão nova de JS, CSS e imagens.
# Uso: python serve.py   (porta 5500; outra: python serve.py 8000) → http://localhost:5500
import http.server, sys

class SemCache(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store, must-revalidate')
        super().end_headers()

port = int(sys.argv[1]) if len(sys.argv) > 1 else 5500
print(f'Sword of God em http://localhost:{port}  (Ctrl+C para parar)')
http.server.ThreadingHTTPServer(('', port), SemCache).serve_forever()
