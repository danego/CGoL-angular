import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { BoardComponent } from './board/board.component';
import { CgolService } from './cgol.service';
import { ClickedColorDirective } from './clicked-color.directive';
import { TableSizingDirective } from './table-sizing.directive';
import { ClickedTurnDirective } from './clicked-turn.directive';
import { LandingPageComponent } from './landing-page/landing-page.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlCenterComponent,
    BoardComponent,
    ClickedColorDirective,
    ClickedTurnDirective,
    TableSizingDirective,
    LandingPageComponent
  ],
  imports: [
    BrowserModule, 
    ReactiveFormsModule
  ],
  providers: [CgolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
