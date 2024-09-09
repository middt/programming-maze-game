import { Component, OnInit } from '@angular/core';
import { GameService, Cell, Player } from '../game.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css']
})
export class GameBoardComponent implements OnInit {
  board: Cell[][] = [];
  player: Player = { x: 0, y: 0, hasKey: false };

  constructor(private gameService: GameService) {}

  ngOnInit() {
    this.gameService.boardSubject.subscribe(board => this.board = board);
    this.gameService.playerSubject.subscribe(player => this.player = player);
  }
}
