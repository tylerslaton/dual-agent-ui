@echo off
REM Navigate to the agent directory
cd /d %~dp0\..\agent

REM Display startup message
echo Starting Pydantic AI agent on port 8000...
echo Starting LangGraph agent on port 8123...
echo.
echo Press Ctrl+C to stop both agents
echo.

REM Start pydantic-ai agent in background
start /B "Pydantic AI Agent" uv run uvicorn src.pydantic_ai.main:app --host 0.0.0.0 --port 8000 --reload

REM Start langgraph agent in background
start /B "LangGraph Agent" uv run uvicorn src.langgraph.main:app --host 0.0.0.0 --port 8123 --reload

REM Wait a moment for agents to start
timeout /t 2 /nobreak >nul

echo Both agents started successfully!
echo Pydantic AI agent: http://localhost:8000
echo LangGraph agent: http://localhost:8123
echo.

REM Keep the window open
pause
