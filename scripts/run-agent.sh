#!/bin/bash

# Navigate to the agent directory
cd "$(dirname "$0")/../agent" || exit 1

# Color codes for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Trap Ctrl+C and cleanup
cleanup() {
    echo -e "\n${RED}Shutting down agents...${NC}"
    kill $PYDANTIC_PID $LANGGRAPH_PID 2>/dev/null
    wait $PYDANTIC_PID $LANGGRAPH_PID 2>/dev/null
    echo -e "${GREEN}Agents stopped.${NC}"
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start pydantic-ai agent
echo -e "${BLUE}Starting Pydantic AI agent on port 8000...${NC}"
uv run uvicorn src.pydantic_ai.main:app --host 0.0.0.0 --port 8000 --reload &
PYDANTIC_PID=$!

# Start langgraph agent
echo -e "${BLUE}Starting LangGraph agent on port 8123...${NC}"
uv run uvicorn src.langgraph.main:app --host 0.0.0.0 --port 8123 --reload &
LANGGRAPH_PID=$!

# Wait a moment to check if processes started successfully
sleep 2

# Check if both processes are still running
if ! kill -0 $PYDANTIC_PID 2>/dev/null; then
    echo -e "${RED}Error: Pydantic AI agent failed to start${NC}"
    cleanup
fi

if ! kill -0 $LANGGRAPH_PID 2>/dev/null; then
    echo -e "${RED}Error: LangGraph agent failed to start${NC}"
    cleanup
fi

echo -e "${GREEN}Both agents started successfully!${NC}"
echo -e "${GREEN}Pydantic AI agent: http://localhost:8000${NC}"
echo -e "${GREEN}LangGraph agent: http://localhost:8123${NC}"
echo -e "${BLUE}Press Ctrl+C to stop both agents${NC}"

# Wait for both background processes
wait $PYDANTIC_PID $LANGGRAPH_PID
