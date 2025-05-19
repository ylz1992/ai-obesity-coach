# ai-obesity-coach
[A Longitudinal Evaluation of a Multimodal AI Assistant for Obesity, GLP-1 Therapy, and Chronic Disease Support](https://wavetulane-my.sharepoint.com/:w:/r/personal/aattia_tulane_edu/_layouts/15/Doc.aspx?sourcedoc=%7B7A767CFB-31F9-4106-A0CF-CB5A312EB333%7D&file=Longitudinal%20Evaluation%20of%20a%20Multimodal%20AI%20Assistant%20for%20Obesity.docx&wdLOR=cC94A69C8-B90E-2E45-B8FA-4A6EA4819842&fromShare=true&action=default&mobileredirect=true)

## 1. Introduction
This document specifies the architecture, API contracts, folder layout, technology stack, and an **8‑week delivery timeline** for the multimodal AI assistant focused on obesity, GLP‑1 therapy, and chronic‑disease coaching.

## 2. System Overview
### 2.1 Client
* Mobile web app built with the **Lynx JS SDK**  
* Requires sign‑in before chat window is enabled  
* Sends user messages and images to backend via HTTPS  
* Displays streaming responses from the LLM  

### 2.2 Server
* **FastAPI** service exposing REST endpoints  
* **SQLite** for persistence (user, prompt, response)  
* **LangChain** chains call **Ollama** (Llama‑3‑8B) and YOLOv8 tasks  
* Planner → Executor → Combiner pipeline routes tasks and merges answers  

### 2.3. High‑Level Flow
1. User authenticates: `POST /auth/login`  
2. Browser opens chat; sends image + text to `POST /chat`.  
3. **Planner** decides which tasks to run (image classifier, calorie estimator, etc.).  
4. **Backend** runs tasks; results injected into two LangChain sub‑chains  
   * **Chain A** – bedside‑manner LLM answer  
   * **Chain B** – Retriever‑augmented factual answer  
5. **Combiner** merges A + B and streams final response to client.  

## 3. Repository Layout

| Folder | Role | Key actions |
| ------ | ---- | ----------- |
| `backend/` | Entrypoints & routes | `POST /chat` → `chains.answer()` |
| `datapipes/` | Load / persist data | Log meals, parse USDA, query DB |
| `interfaces/` | Lynx frontend | Chat UI, dashboard |
| `llms/` | LLM providers | `.invoke(SystemMsg, HumanMsg)` via Ollama |
| `orchestrator/` | Planner & executor | Combine task results into prompt |
| `planners/` | Task planners | Return task list (ReAct / ToT) |
| `responsegenerator/` | Formatter | Markdown / tone polish |
| `tasks/` | Sub‑modules (YOLO, nutrition…) | Return kcal, risk, etc. |
| `scripts/` | CLI utilities | Build vector DB, cron jobs |

## 4. Technology Stack

### Conversational AI & NLP
* LangChain – LLM chaining & memory  
* Ollama / OpenAI – LLM backend  
* spaCy – NLP preprocessing  
* TextBlob, VADER – sentiment analysis  

### Image & Nutrition
* YOLOv8 – food object detection  
* torchvision / OpenCV – preprocessing  
* Food‑101 / Recipe1M – pretrained datasets  
* USDA FoodData Central API – nutrition DB  

### Backend & Infrastructure
* FastAPI – web framework  
* SQLite / DuckDB – lightweight DB  
* Redis – session cache  
* Celery – background tasks  
* Docker – deployment  

### Security & Auth
* OAuth2 Password Flow  
* bcrypt – password hashing  
* python‑dotenv – secrets management  


## 5. Timeline (8 Weeks)

| Week | Date |Milestones | 
| ---- | ---- |---------- |
| **W1** | May 9th |Dev env: Git, Conda, Docker; set up FastAPI skeleton; pull Llama‑3‑8B & YOLOv8n via Ollama. | 
| **W2** | May 16th |Implement `OllamaProvider` & `/chat` route; create SQLite schema. |
| **W3** | May 23th |Build Chain A (bedside‑manner prompt) & test with dummy data. |
| **W4** | May 30th |Integrate USDA FoodData & Retriever → Chain B; create vector store. |
| **W5** | Jun 13th |Implement Planner (ReAct) and Task Executor with YOLO & calorie estimator. |
| **W6** | Jun 20th |Combine chains; stream responses; wire Lynx frontend (login + chat). |
| **W7** | Jun 27th |Add authentication (JWT OAuth2); medication‑reminder APScheduler demo. |
| **W8** |  |End‑to‑end QA, Docker compose, security hardening, docs & deployment. |
