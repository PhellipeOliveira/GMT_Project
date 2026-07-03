"""Configuração compartilhada dos testes do Agente GMT.

Garante que a raiz do backend (onde vive o pacote `app`) esteja no sys.path,
independentemente do diretório a partir do qual o pytest é invocado
(ex.: `make test` a partir de `backend/`, ou VSCode a partir da raiz do repo).
"""

import sys
from pathlib import Path

# tests/conftest.py -> parent = tests/, parent.parent = backend/
BACKEND_ROOT = Path(__file__).resolve().parent.parent
if str(BACKEND_ROOT) not in sys.path:
    sys.path.insert(0, str(BACKEND_ROOT))
