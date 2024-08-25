from http.server import SimpleHTTPRequestHandler, HTTPServer

host = "localhost"
port = 8000

print("WHATEVER")

with HTTPServer((host, port), SimpleHTTPRequestHandler) as server:
    print(f"Serving on http://{host}:{port}")
    server.serve_forever()
