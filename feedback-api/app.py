import os
import json
import uuid
import tempfile
from datetime import datetime
from pathlib import Path
from fastapi import FastAPI, Form, UploadFile, File, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI(title="Hyesky Feedback API")

# 允许跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据目录
DATA_DIR = Path("/data/feedback")
DATA_DIR.mkdir(parents=True, exist_ok=True)

# SQLite 数据库
DB_PATH = DATA_DIR / "feedback.db"

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        CREATE TABLE IF NOT EXISTS feedback (
            id TEXT PRIMARY KEY,
            module TEXT,
            description TEXT,
            ftype TEXT,
            tags TEXT,
            extra TEXT,
            logs_filename TEXT,
            screenshots TEXT,
            created_at TEXT,
            ip_address TEXT,
            user_agent TEXT
        )
    """)
    conn.commit()
    conn.close()

init_db()

@app.post("/api/feedback")
async def receive_feedback(request: Request,
    module: str = Form(...),
    description: str = Form(...),
    type_: str = Form(default="user-feedback"),
    tags: str = Form(default="{}"),
    extra: str = Form(default="{}"),
    logs: UploadFile = File(None),
    screenshots: list[UploadFile] = File(default=[]),
):
    """
    接收桌面应用发来的用户反馈
    
    参数：
    - module: 模块标识（15种可选）
    - description: 用户描述
    - type: 固定值 "user-feedback"
    - tags: JSON字符串，上下文标签
    - extra: JSON字符串，附加上下文
    - logs: 日志文件（可选）
    - screenshots: 截图文件列表（可选）
    """
    
    feedback_id = str(uuid.uuid4())
    now = datetime.utcnow().isoformat() + "Z"
    
    # 获取 IP 和 User-Agent
    client_ip = request.client.host if request.client else "unknown"
    user_agent = request.headers.get("user-agent", "")
    
    # 保存目录
    upload_dir = DATA_DIR / feedback_id.replace("-", "")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    saved_files = []
    
    # 保存日志文件
    logs_filename = None
    if logs and logs.filename:
        logs_path = upload_dir / logs.filename
        with open(logs_path, "wb") as f:
            content = await logs.read()
            f.write(content)
        logs_filename = logs.filename
        saved_files.append(f"logs: {logs.filename} ({len(content)} bytes)")
    
    # 保存截图
    screenshot_names = []
    if screenshots:
        for i, screenshot in enumerate(screenshots):
            if screenshot and screenshot.filename:
                sname = f"screenshot-{i+1}-{screenshot.filename}"
                spath = upload_dir / sname
                with open(spath, "wb") as f:
                    content = await screenshot.read()
                    f.write(content)
                screenshot_names.append(screenshot.filename)
                saved_files.append(f"screenshot: {screenshot.filename} ({len(content)} bytes)")
    
    # 保存元数据
    metadata = {
        "feedback_id": feedback_id,
        "timestamp": now,
        "module": module,
        "type": type_,
        "tags": json.loads(tags) if tags else {},
        "extra": json.loads(extra) if extra else {},
        "ip": client_ip,
        "saved_files": saved_files,
    }
    
    with open(upload_dir / "metadata.json", "w") as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)
    
    # 保存到数据库
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute("""
        INSERT INTO feedback (id, module, description, ftype, tags, extra, logs_filename, screenshots, created_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        feedback_id, module, description, type_,
        tags, extra, logs_filename,
        json.dumps(screenshot_names, ensure_ascii=False),
        now, client_ip, user_agent
    ))
    conn.commit()
    conn.close()
    
    return {
        "status": "ok",
        "feedback_id": feedback_id,
        "saved_files": saved_files,
    }

@app.get("/api/feedback")
async def list_feedback(limit: int = 50, offset: int = 0):
    """查看已接收的反馈列表"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    
    total = c.execute("SELECT COUNT(*) FROM feedback").fetchone()[0]
    rows = c.execute(
        "SELECT * FROM feedback ORDER BY created_at DESC LIMIT ? OFFSET ?",
        (limit, offset)
    ).fetchall()
    
    result = [dict(row) for row in rows]
    conn.close()
    
    return {"total": total, "feedbacks": result}

@app.get("/api/feedback/<feedback_id>")
async def get_feedback_detail(feedback_id: str):
    """查看单个反馈详情"""
    meta_path = DATA_DIR / feedback_id.replace("-", "") / "metadata.json"
    if meta_path.exists():
        with open(meta_path) as f:
            return json.load(f)
    raise HTTPException(status_code=404, detail="Feedback not found")
