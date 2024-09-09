import { Component } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-command-input',
  templateUrl: './command-input.component.html',
  styleUrls: ['./command-input.component.css']
})
export class CommandInputComponent {
  commands = '';
  difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  private lastExecutedLineCount = 0;

  constructor(private gameService: GameService) {}

  onCommandInput(event: any) {
    const input = event.target.value;
    const lines = input.split('\n');

    // Execute only new commands
    for (let i = this.lastExecutedLineCount; i < lines.length - 1; i++) {
      const command = lines[i].trim();
      if (command) {
        this.gameService.executeCommand(command);
      }
    }

    this.lastExecutedLineCount = lines.length - 1;
    this.commands = input;
  }

  generateNewMaze() {
    this.gameService.generateMaze(this.difficulty);
    this.commands = '';
    this.lastExecutedLineCount = 0;
  }
}
