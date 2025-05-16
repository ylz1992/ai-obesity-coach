# scripts/build_vector_db.py
from langchain_community.document_loaders import TextLoader, DirectoryLoader
from langchain_community.embeddings import SentenceTransformerEmbeddings
from langchain_community.vectorstores import Chroma

docs = DirectoryLoader("corpus/medical", glob="**/*.txt").load()
emb = SentenceTransformerEmbeddings(model_name="all-MiniLM-L6-v2")
vs = Chroma.from_documents(docs, emb, persist_directory="vector_db")
vs.persist()