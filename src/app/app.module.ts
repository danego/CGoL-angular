import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { ControlCenterComponent } from './control-center/control-center.component';
import { BoardComponent } from './board/board.component';
import { CgolService } from './cgol.service';
import { ClickedColorDirective } from './clicked-color.directive';
import { TableSizingDirective } from './table-sizing.directive';
import { ClickedTurnDirective } from './clicked-turn.directive';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MaterialModule } from './material.module';
import { InteractiveStopwatchComponent } from './interactive-stopwatch/interactive-stopwatch.component';

@NgModule({
  declarations: [
    AppComponent,
    ControlCenterComponent,
    BoardComponent,
    ClickedColorDirective,
    ClickedTurnDirective,
    TableSizingDirective,
    LandingPageComponent,
    InteractiveStopwatchComponent
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
