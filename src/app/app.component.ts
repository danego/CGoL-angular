import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  title = 'cgol-angular';

  constructor() {}

  ngOnInit() {

    //add a simple url bar updater to reflect where user is on our scroll page
    //note - this scroll and timeout feature inspired by Chris Ferdinandi's blog, 'Go Make Things'
    let isScrolling;
    const screenRefreshrateMS = 66;

    window.addEventListener('scroll', function(event) {
      window.clearTimeout(isScrolling);

      isScrolling = window.setTimeout(function() {
        //Use only pageYOffset ... don't need to know scrollDelta, only finalScrollPos
        let end = window.pageYOffset;

        if(end > 500) {
          window.history.replaceState({}, 'landing', '/main');
        }
        else if (end < 300){
          window.history.replaceState({}, 'landing', '/landing');
        }
      }, screenRefreshrateMS)
    });
  }
}
