import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { BoardComponent } from './board/board.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { InteractiveStopwatchComponent } from './interactive-stopwatch/interactive-stopwatch.component';
import { CgolService } from './cgol.service';
import { ClickedColorDirective } from './clicked-color.directive';
import { TableSizingDirective } from './table-sizing.directive';
import { ClickedTurnDirective } from './clicked-turn.directive';
import { StopPropoDirective } from './stop-propo.directive';
import { MaterialModule } from './material.module';

@NgModule({
  declarations: [
    AppComponent,
    ControlCenterComponent,
    BoardComponent,
    LandingPageComponent,
    InteractiveStopwatchComponent,
    ClickedColorDirective,
    ClickedTurnDirective,
    TableSizingDirective,
    StopPropoDirective
  ],
  imports: [
    BrowserModule, 
    ReactiveFormsModule,
    MaterialModule
  ],
  providers: [CgolService],
  bootstrap: [AppComponent]
})
export class AppModule { }
