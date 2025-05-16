# scripts/build_vector_db.py
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma

DATA_DIR = Path("?????????")      
DB_DIR = "vector_db"

print("▶  Loading documents …")
docs = DirectoryLoader(str(DATA_DIR), glob="**/*.txt").load()

print("▶  Embedding + building Chroma store …")
emb = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vec = Chroma.from_documents(docs, emb, persist_directory=DB_DIR)
vec.persist()
print(f"✔  Vector DB built at {DB_DIR}/")