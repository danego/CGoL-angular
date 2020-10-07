import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatSliderModule } from '@angular/material/slider';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';

//Not needed for any of my Material uses:
//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
 
@NgModule({
  imports: [],
  exports: [
    BrowserAnimationsModule,
    MatButtonModule, 
    MatSliderModule,
    MatInputModule,
    MatDividerModule,
    DragDropModule,
    MatIconModule,
    MatSnackBarModule,
    MatCardModule
  ]
})

export class MaterialModule {}