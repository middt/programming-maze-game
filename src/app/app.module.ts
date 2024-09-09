import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { GameBoardComponent } from './game-board/game-board.component';
import { CommandInputComponent } from './command-input/command-input.component';

@NgModule({
  declarations: [
    AppComponent,
    GameBoardComponent,
    CommandInputComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
