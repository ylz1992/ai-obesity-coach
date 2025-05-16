from langchain_core.prompts import ChatPromptTemplate, PromptTemplate
from langchain_core.messages import SystemMessage, HumanMessage
from langchain.chains import LLMChain, RetrievalQA
from langchain_community.llms import Ollama
from langchain_community.vectorstores import Chroma

llm = Ollama(model="llama3:8b", base_url="http://localhost:11434", temperature=0.7)

# ---- Chain A  : bedside-manner reply ----------------------------------
doctor_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "Explain things in clear, supportive language."),
        ("human", "{question}"),
    ]
)
doctor_chain = LLMChain(llm=llm, prompt=doctor_prompt)

# ---- Chain B  : retrieval-augmented factual answer --------------------
vector_store = Chroma(
    persist_directory="vector_db",          
    embedding_function=llm,                
)
retriever = vector_store.as_retriever(search_kwargs={"k": 4})

rag_prompt = ChatPromptTemplate.from_messages(
    [
        ("system", "You are a medical expert. Answer ONLY from the context below."),
        ("system", "Context:\n{context}"),
        ("human", "{question}"),
    ]
)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": rag_prompt},
)


# ---- Combiner  : merge the two answers --------------------------------
combiner_prompt = PromptTemplate(
    input_variables=["doctor_answer", "rag_answer"],
    template=(
        "You are an obesity-care doctor.\n\n"
        "Conversational reply (A):\n{doctor_answer}\n\n"
        "Factual context (B):\n{rag_answer}\n\n"
        "Combine A and B into one helpful final answer. "
        "If they conflict, prefer the factual context."
    ),
)
combiner_chain = LLMChain(llm=llm, prompt=combiner_prompt)


# ---- Final function to answer a question -----------------------------
def answer(question: str) -> str:
    doctor_resp  = doctor_chain.run({"question": question})
    factual_resp = qa_chain.run({"query":   question})
    final_resp   = combiner_chain.run(
        {"doctor_answer": doctor_resp, "rag_answer": factual_resp}
    )
    return final_resp