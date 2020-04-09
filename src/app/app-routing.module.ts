import { TexasHoldEmGameComponent } from './texas-hold-em-game/texas-hold-em-game.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {path: 'texas-poker', component: TexasHoldEmGameComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
