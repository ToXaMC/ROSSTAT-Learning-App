from typing import List
from fastapi import FastAPI, WebSocket
from starlette.middleware.cors import CORSMiddleware
from starlette.websockets import WebSocketDisconnect
import json
from app.database import engine
from app.database.tables import Base
from app.routers.auth import router as auth_router
from app.routers.user import router as user_router
from app.routers.task import router as task_router
from app.routers.answer import router as answer_router
from app.routers.solve import router as solve_router
from app.routers.result import router as result_router

Base.metadata.create_all(bind=engine)

tags_metadata = [
    {'name': 'auth', 'description': 'Авторизация'},
    {'name': 'user', 'description': 'Работа с пользователями'},
    {'name': 'task', 'description': 'Работа с задачами'},
    {'name': 'answer', 'description': 'Работа с ответами'},
    {'name': 'solve', 'description': 'Работа с решениями задач'},
    {'name': 'result', 'description': 'Работа с результатами задач'},
]

app = FastAPI(
    openapi_tags=tags_metadata,
    title='Tic Tac Toe App',
    description='Course Work: Tic Tac Toe App',
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
    expose_headers=['*'],
)


def init_board():
    # create empty board
    return [
        None, None, None,
        None, None, None,
        None, None, None,
    ]


board = init_board()


def is_draw():
    # checks if a draw
    global board
    for cell in board:
        if not cell:
            return False
    board = init_board()
    return True


def if_won():
    # check if some player has just won the game
    global board
    if board[0] == board[1] == board[2] is not None or \
            board[3] == board[4] == board[5] is not None or \
            board[6] == board[7] == board[8] is not None or \
            board[0] == board[3] == board[6] is not None or \
            board[1] == board[4] == board[7] is not None or \
            board[2] == board[5] == board[8] is not None or \
            board[0] == board[4] == board[8] is not None or \
            board[6] == board[4] == board[2] is not None:
        board = init_board()
        return True
    return False


async def update_board(ws_manager, data):
    ind = int(data['cell']) - 1
    data['init'] = False
    if not board[ind]:
        # cell is empty
        board[ind] = data['player']
        if is_draw():
            data['message'] = "draw"
        elif if_won():
            data['message'] = "won"
        else:
            data['message'] = "move"
    else:
        data['message'] = "choose another one"
    await ws_manager.broadcast(data)
    if data['message'] in ['draw', 'won']:
        ws_manager.connections = []


class ConnectionManager:
    def __init__(self):
        self.connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        # dealing with incomming connections here
        if len(self.connections) >= 2:
            # denies connection for 3rd player
            await websocket.accept()
            await websocket.close(4000)
        else:
            await websocket.accept()
            # adding the connections to the connection's list
            self.connections.append(websocket)
            if len(self.connections) == 1:
                # the first connected persone plays by X and should wait for a second player
                await websocket.send_json({
                    'init': True,
                    'player': 'X',
                    'message': 'Waiting for another player',
                })
            else:
                # the second player plays by O
                await websocket.send_json({
                    'init': True,
                    'player': 'O',
                    'message': '',
                })
                # signals to the first player that the second player has just connected
                await self.connections[0].send_json({
                    'init': True,
                    'player': 'X',
                    'message': 'Your turn!',
                })

    async def disconnect(self, websocket: WebSocket):
        self.connections.remove(websocket)

    async def broadcast(self, data: str):
        # broadcasting data to all connected clients
        for connection in self.connections:
            await connection.send_json(data)


manager = ConnectionManager()


@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # here we are waiting for an oncoming message from clients
            data = await websocket.receive_text()
            data = json.loads(data)
            # precessing the incoming message
            await update_board(manager, data)
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
    except Exception as e:
        print(str(e))
        pass


app.include_router(auth_router, tags=['auth'])
app.include_router(user_router, tags=['user'])
app.include_router(task_router, tags=['task'])
app.include_router(answer_router, tags=['answer'])
app.include_router(solve_router, tags=['solve'])
app.include_router(result_router, tags=['result'])
