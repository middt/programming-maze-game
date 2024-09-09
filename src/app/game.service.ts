import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Cell {
  type: 'empty' | 'wall' | 'key' | 'door';
}

export interface Player {
  x: number;
  y: number;
  hasKey: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private boardSize = 10;
  private board: Cell[][] = [];
  private player: Player = { x: 0, y: 0, hasKey: false };

  boardSubject = new BehaviorSubject<Cell[][]>([]);
  playerSubject = new BehaviorSubject<Player>({ x: 0, y: 0, hasKey: false });

  constructor() {
    this.generateMaze('easy');
  }

  generateMaze(difficulty: 'easy' | 'medium' | 'hard') {
    this.boardSize = difficulty === 'easy' ? 8 : difficulty === 'medium' ? 10 : 12;
    const wallPercentage = difficulty === 'easy' ? 0.2 : difficulty === 'medium' ? 0.3 : 0.4;

    do {
      this.board = Array(this.boardSize).fill(null).map(() =>
        Array(this.boardSize).fill(null).map(() => ({ type: 'empty' }))
      );

      // Generate walls
      for (let y = 0; y < this.boardSize; y++) {
        for (let x = 0; x < this.boardSize; x++) {
          if (Math.random() < wallPercentage && !(x === 0 && y === 0)) {
            this.board[y][x].type = 'wall';
          }
        }
      }

      // Set player position
      this.player = { x: 0, y: 0, hasKey: false };
      this.board[0][0].type = 'empty';

      // Set key and door
      const keyPos = this.getRandomEmptyCell();
      this.board[keyPos.y][keyPos.x].type = 'key';

      const doorPos = this.getRandomEmptyCell();
      this.board[doorPos.y][doorPos.x].type = 'door';

    } while (!this.hasValidSolution());

    this.boardSubject.next(this.board);
    this.playerSubject.next(this.player);
  }

  private hasValidSolution(): boolean {
    const visited: boolean[][] = Array(this.boardSize).fill(null).map(() => Array(this.boardSize).fill(false));
    const stack: [number, number][] = [[0, 0]];
    let foundKey = false;
    let foundDoor = false;

    while (stack.length > 0) {
      const [x, y] = stack.pop()!;
      if (visited[y][x]) continue;
      visited[y][x] = true;

      if (this.board[y][x].type === 'key') foundKey = true;
      if (this.board[y][x].type === 'door') foundDoor = true;

      if (foundKey && foundDoor) return true;

      const directions = [[0, 1], [1, 0], [0, -1], [-1, 0]];
      for (const [dx, dy] of directions) {
        const newX = x + dx;
        const newY = y + dy;
        if (
          newX >= 0 && newX < this.boardSize &&
          newY >= 0 && newY < this.boardSize &&
          this.board[newY][newX].type !== 'wall' &&
          !visited[newY][newX]
        ) {
          stack.push([newX, newY]);
        }
      }
    }

    return false;
  }

  private getRandomEmptyCell(): { x: number, y: number } {
    let x, y;
    do {
      x = Math.floor(Math.random() * this.boardSize);
      y = Math.floor(Math.random() * this.boardSize);
    } while (this.board[y][x].type !== 'empty' || (x === 0 && y === 0));
    return { x, y };
  }

  executeCommand(command: string) {
    const trimmedCommand = command.trim().toLowerCase();

    // Check for 'for' loop
    const forLoopMatch = trimmedCommand.match(/^for (\d+) (.+)$/);
    if (forLoopMatch) {
      const [, count, subCommand] = forLoopMatch;
      const repetitions = parseInt(count, 10);
      for (let i = 0; i < repetitions; i++) {
        this.executeSingleCommand(subCommand);
      }
    } else {
      this.executeSingleCommand(trimmedCommand);
    }
  }

  private executeSingleCommand(command: string) {
    switch (command) {
      case 'up':
        this.movePlayer(0, -1);
        break;
      case 'down':
        this.movePlayer(0, 1);
        break;
      case 'left':
        this.movePlayer(-1, 0);
        break;
      case 'right':
        this.movePlayer(1, 0);
        break;
      case 'pickup':
        this.pickupKey();
        break;
      case 'unlock':
        this.unlockDoor();
        break;
    }
  }

  private movePlayer(dx: number, dy: number) {
    const newX = this.player.x + dx;
    const newY = this.player.y + dy;

    if (
      newX >= 0 && newX < this.boardSize &&
      newY >= 0 && newY < this.boardSize &&
      this.board[newY][newX].type !== 'wall'
    ) {
      this.player.x = newX;
      this.player.y = newY;
      this.playerSubject.next(this.player);
    }
  }

  private pickupKey() {
    if (this.board[this.player.y][this.player.x].type === 'key') {
      this.player.hasKey = true;
      this.board[this.player.y][this.player.x].type = 'empty';
      this.boardSubject.next(this.board);
      this.playerSubject.next(this.player);
    }
  }

  private unlockDoor() {
    if (
      this.board[this.player.y][this.player.x].type === 'door' &&
      this.player.hasKey
    ) {
      alert('Congratulations! You completed the maze!');
      this.generateMaze('easy');
    }
  }
}
