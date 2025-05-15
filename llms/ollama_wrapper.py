from langchain_community.llms import Ollama
from langchain_core.callbacks import StreamingStdOutCallbackHandler

llm = Ollama(
    base_url="http://localhost:11434",   # default
    model="llama3:8b",                   # any model you pulled
    temperature=0.7,
    callbacks=[StreamingStdOutCallbackHandler()],
)

resp = llm.invoke("Give me a three-sentence summary of GLP-1 therapy.")
# streaming handler prints chunks; `resp` is the final string