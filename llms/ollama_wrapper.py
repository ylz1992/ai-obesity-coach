from __future__ import annotations
import json, os, typing as t, httpx
from pydantic import BaseModel

BASE = os.getenv("OLLAMA_BASE", "http://localhost:11434")
MODEL = os.getenv("OLLAMA_MODEL", "llama3")

class Msg(BaseModel):
    role: str            # 'user' | 'assistant' | 'system'
    content: str

class Ollama:
    "Minimal sync/stream wrapper"
    def __init__(self, model: str = MODEL):
        self.base, self.model = BASE, model
        self._client = httpx.Client(timeout=60)

    def chat(self, messages: list[dict] | list[Msg], stream=False, **kw):
        messages = [m.dict() if isinstance(m, Msg) else m for m in messages]
        payload = {"model": self.model, "messages": messages, **kw}
        url = f"{self.base}/api/chat"
        if stream:
            return self._stream(url, payload)
        r = self._client.post(url, json=payload); r.raise_for_status()
        return r.json()["message"]["content"]

    def _stream(self, url: str, payload: dict) -> t.Iterator[str]:
        with self._client.stream("POST", url, json=payload) as r:
            r.raise_for_status()
            for line in r.iter_lines():
                if line:
                    yield json.loads(line)["message"]["content"]